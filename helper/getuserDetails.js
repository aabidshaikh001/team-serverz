import jwt from 'jsonwebtoken';
import { User } from '../modal/user.modal.js';

/**
 * Retrieves user details from a JWT token.
 * @param {string} token - The JWT token to be verified.
 * @returns {Promise<object>} - Returns user details or an error message.
 */
const getuserDetailsfromtoken = async (token) => {
    // Return a session out message if no token is provided
    if (!token) {
        return {
            message: "Session out",
            logout: true
        };
    }
    
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // No need to await here, since jwt.verify is synchronous

        // Fetch user details without the password field
        const user = await User.findById(decoded.id).select("-password");

        // Check if user exists
        if (!user) {
            return {
                message: "User not found",
                logout: true
            };
        }

        return user;  // Return the user details if everything is fine
    } catch (error) {
        console.error("Token verification error:", error);
        return {
            message: "Invalid token",
            logout: true
        };
    }
}

export default getuserDetailsfromtoken;
