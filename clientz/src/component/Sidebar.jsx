import React,{useState} from 'react'
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";
import Avtar from './Avtar.jsx';
import { useSelector,useDispatch } from 'react-redux';
import Edituserdetails from './Edituserdetails';
import { FiArrowUpLeft } from "react-icons/fi";
import Searchuser from './Searchuser.jsx';
import { FaVideo } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { useEffect } from 'react';
import { logout } from '../redux/userSlice.js';
function Sidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
    const user = useSelector(state=>state?.user)
    const [edituseropen, setedituseropen] = useState(false)
    const [alluser, setalluser] = useState([])
    const [opensearchUser, setopensearchUser] = useState(false)
    const socketConnection = useSelector(state=>state?.user?.socketConnection)

    useEffect(() => {
      if (socketConnection) {
          socketConnection.emit('sidebar', user._id);
          socketConnection.on('conversation', (data) => {
              console.log('conversation', data);
              
              // Use a Set to track unique user IDs
              const uniqueUsers = new Set();
              const conversationUserData = data.map((conversationUser) => {
                  let userDetails;
                  if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
                      userDetails = conversationUser?.sender;
                  } else if (conversationUser?.receiver?._id !== user?._id) {
                      userDetails = conversationUser.receiver;
                  } else {
                      userDetails = conversationUser.sender;
                  }

                  // If the user ID is not already in the Set, add it to the array and the Set
                  if (!uniqueUsers.has(userDetails?._id)) {
                      uniqueUsers.add(userDetails?._id);
                      return {
                          ...conversationUser,
                          userDetails
                      };
                  }
                  return null; // Return null for duplicates
              }).filter(Boolean); // Filter out null values

              setalluser(conversationUserData);
          });
      }
  }, [socketConnection, user]);
  const handleLogout = ()=>{
    dispatch(logout())
    navigate('/email')
    localStorage.clear()
  }
  return (
    <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white'>
        <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
            <div>
            <NavLink className={({isActive})=>`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${isActive && "bg-slate-200"}`} title='Chat'>
            <IoChatbubbleEllipses size={25} />
            </NavLink>
            <div onClick={()=>setopensearchUser(true)} className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200' title='Add Freind'>
            <FaUserPlus  size={25} />
            </div>
            </div>
            <div className='flex flex-col items-center'>
            <button title={user?.name} className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200' onClick={()=>setedituseropen(true)}>
            <span className='-ml-1'>  <Avtar width={40} heigth={40} name={user?.name} imageURL={user?.profilePic} userId={user?._id} /></span>
           
            </button>
            <button className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded' title='Logout' onClick={handleLogout}>
           <span className='-ml-2'> <CiLogout size={30} /></span>

            </button>
            </div>
        </div>

        <div className='w-full '>
         <div className='flex h-16 items-center'>
          <h2 className='text-xl font-bold p-4 text-slate-800 '>Message</h2>
          </div>
       <div className='bg-slate-200 p-[0.5px]'></div>
       <div className=' h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
        {
          alluser.length === 0 && (
            <div className='mt-12'>
              <div className='flex justify-center items-center my-4 text-slate-500'>
                  <FiArrowUpLeft size={50}/>
              </div>
              <p className='text-lg text-center text-slate-400'>Explore Users To Start A Conversation With.</p>
            </div>
          )
        } 
          {
            
          alluser.map((conv)=>{
            return(
              <NavLink to={"/"+conv?.userDetails?._id} className='flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer'>
                <div>
                  <Avtar imageURL={conv?.userDetails?.profilePic}
                  name={conv?.userDetails?.name} width={40} heigth={40}/>
                </div>

                <div >
                  <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>{conv?.userDetails?.name}</h3>
                  <div className='text-slate-500 text-xs flex items-center gap-1'>
                    <div className='flex items-center gap-1'>
                      {
                        conv?.lastmsg?.imageUrl && (
                          <div  className='flex items-center gap-1'>
                            <span><FaImage/></span>
                           {!conv?.lastmsg?.text && <span>Image</span>} 
                          </div>
                        )
                      }
                      {
                        conv?.lastmsg?.videoUrl && (
                          <div  className='flex items-center gap-1'>
                            <span><FaVideo/></span>
                            {!conv?.lastmsg?.text && <span>Video</span>}
                          </div>
                        )
                      }
                    </div>
                    <p className='text-ellipsis line-clamp-1'>{conv?.lastmsg?.text}</p>
                  </div>
                  </div>
                  {
                       Boolean(conv?.unseenMsg) && (
              <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full'>{conv?.unseenmsg}</p>
 )
   }
                
              </NavLink>
            )
          })
        }
       </div>
        </div>

        
        {/* edit user open */}
        {
          edituseropen && (
            <Edituserdetails onClose={()=>setedituseropen(false)} user={user}/>
          )
        }
        {/* search user */}
        {
          opensearchUser && (
            <Searchuser onClose={()=>setopensearchUser(false)}/>
          )
        }

    </div>
  )
}

// 

export default Sidebar