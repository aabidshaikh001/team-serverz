import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice'
import Sidebar from '../component/Sidebar'
import logo from '../assets/woopab.png'
import io from 'socket.io-client'

function Home() {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  console.log('user',user);
  
 
  
  const fetchUserDetails = async()=>{
    try {
         const URL = `http://localhost:5600/api/user-details`
         const response = await axios({
          url:URL,
          withCredentials:true
         })
         dispatch(setUser(response.data.data))
         if (response.data.data.logout) {
          dispatch(logout())
          navigate("/email")
         }
         console.log("current user Details",response?.data?.data);
         
      
    } catch (error) {
      console.log(error);
      
    }
  }
  useEffect(()=>{
    fetchUserDetails()
  },[])
  /**soket connection */
  useEffect(()=>{
    const socketConnection = io(`http://localhost:5600`,{
      auth:{
        token: localStorage.getItem('token')
      }
    })
    socketConnection.on('onlineUser',(data)=>{
      console.log(data);
      dispatch(setOnlineUser(data))
      
    })
    dispatch(setSocketConnection(socketConnection))
    return ()=>{
      socketConnection.disconnect()
    }
  },[])
  const  basePath = location.pathname === '/'
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar/>
      </section> 
      <section className={`${basePath && "hidden"}`}>
        <Outlet/>
      </section>
      <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath  ? "hidden" : "lg:flex"}`}>
        <div>
          <img src={logo} width={250} alt='logo' />

        </div>
        <p className='text-lg mt-2 text-slate-500'>Select User To Send Message</p>
      </div>
    </div>
  )
}

export default Home