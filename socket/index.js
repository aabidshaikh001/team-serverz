
import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import getuserDetailsfromtoken from '../helper/getuserDetails.js';
import { User } from '../modal/user.modal.js';
import { Conversation, Message } from '../modal/conversation.modal.js';

const app = express();

// Create HTTP server and Socket.io server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || `http://localhost:5173`,
        credentials: true
    }
});

// Track online users
const onlineUser = new Set();

io.on('connection', async (socket) => {
    console.log("User connected:", socket.id);

    // Token validation and user retrieval
    try {
        const token = socket.handshake.auth.token;
        const user = await getuserDetailsfromtoken(token);
        console.log('User:', user);

        // Create a room for the user and track them online
        socket.join(user?._id.toString());
        onlineUser.add(user?._id.toString());

        // Emit updated online user list
        io.emit('onlineUser', Array.from(onlineUser));

        // Handle message page requests
        socket.on('message-page', async (userId) => {
            try {
                const userDetails = await User.findById(userId).select("-password");
                const payload = {
                    _id: userDetails?._id,
                    name: userDetails?.name,
                    email: userDetails?.email,
                    online: onlineUser.has(userId),
                    profilePic: userDetails?.profilePic
                };
                socket.emit('message-user', payload);

                // Fetch previous messages
                let getConversationMessage = await Conversation.findOne({
                    "$or": [
                        { sender: user?._id, receiver: userId },
                        { sender: userId, receiver: user?._id }
                    ]
                }).populate('message').sort({ updatedAt: -1 });

                if (getConversationMessage) {
                    socket.emit('message', getConversationMessage.message);
                } else {
                    // Create a new conversation if one doesn't exist
                    const newConversation = new Conversation({
                        sender: user?._id,
                        receiver: userId
                    });
                    await newConversation.save();
                    socket.emit('message', []); // No previous messages
                }
            } catch (error) {
                console.error("Error on message-page:", error);
                socket.emit('error', 'Unable to load messages.');
            }
        });

        // Handle new message events
        socket.on('new message', async (data) => {
            try {
                // Find or create conversation between users
                let conversation = await Conversation.findOne({
                    "$or": [
                        { sender: data?.sender, receiver: data?.receiver },
                        { sender: data?.receiver, receiver: data?.sender }
                    ]
                });

                // If conversation doesn't exist, create a new one
                if (!conversation) {
                    const createConversation = new Conversation({
                        sender: data?.sender,
                        receiver: data?.receiver
                    });
                    conversation = await createConversation.save();
                }

                // Save the new message
                const message = new Message({
                    text: data.text,
                    imageUrl: data.imageUrl,
                    videoUrl: data.videoUrl,
                    msgByuserId: data?.msgByuserId,
                });
                const saveMessage = await message.save();

                // Update conversation with the new message
                await Conversation.updateOne(
                    { _id: conversation?._id },
                    { "$push": { message: saveMessage?._id } }
                );

                // Fetch updated conversation and emit to both users
                const getConversationMessage = await Conversation.findOne({
                    "$or": [
                        { sender: data?.sender, receiver: data?.receiver },
                        { sender: data?.receiver, receiver: data?.sender }
                    ]
                }).populate('message').sort({ updatedAt: -1 });

                io.to(data?.sender).emit('message', getConversationMessage?.message || []);
                io.to(data?.receiver).emit('message', getConversationMessage?.message || []);
            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit('error', 'Unable to send message.');
            }
        });

        // Handle sidebar (conversations list)
        socket.on('sidebar', async (currentUserId) => {
            try {
                const currentUserConversation = await Conversation.find({
                    "$or": [
                        { sender: currentUserId },
                        { receiver: currentUserId }
                    ]
                }).sort({ updatedAt: -1 }).populate('message').populate('sender').populate('receiver');

                const conversation = currentUserConversation.map((conv) => {
                    const countUnseenMsg = conv?.message?.reduce((prev, curr) => prev + (curr.seen ? 0 : 1), 0);
                    return {
                        _id: conv?._id,
                        sender: conv?.sender,
                        receiver: conv?.receiver,
                        unseenmsg: countUnseenMsg,
                        lastmsg: conv?.message[conv?.message?.length - 1]
                    };
                });

                socket.emit('conversation', conversation);
            } catch (error) {
                console.error("Error loading sidebar:", error);
                socket.emit('error', 'Unable to load conversations.');
            }
        });

        // Handle message "seen" events
        socket.on('seen', async (msgByUserId) => {
            try {
                let conversation = await Conversation.findOne({
                    "$or": [
                        { sender: user?._id, receiver: msgByUserId },
                        { sender: msgByUserId, receiver: user?._id }
                    ]
                });
                const conversationMessageId = conversation?.messages || [];

                // Update all messages as "seen"
                await Message.updateMany(
                    { _id: { "$in": conversationMessageId }, msgByuserId: msgByUserId },
                    { "$set": { seen: true } }
                );

                // Emit updated conversations
                const conversationSender = await getConversation(user?._id?.toString());
                const conversationReceiver = await getConversation(msgByUserId);

                io.to(user?._id?.toString()).emit('conversation', conversationSender);
                io.to(msgByUserId).emit('conversation', conversationReceiver);
            } catch (error) {
                console.error("Error updating seen status:", error);
                socket.emit('error', 'Unable to update message status.');
            }
        });

        // Handle user disconnect
        socket.on('disconnect', () => {
            onlineUser.delete(user?._id?.toString());
            console.log('User disconnected:', socket.id);
        });

    } catch (error) {
        console.error("Error during socket connection:", error);
        socket.emit('error', 'Invalid token or user.');
    }
});

export { app, server };
