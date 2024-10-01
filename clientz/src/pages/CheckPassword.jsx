import React,{useEffect, useState} from 'react'
import { PiUserCircle } from "react-icons/pi";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios'
import Avtar from '../component/Avtar';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/userSlice';

function CheckPassword() {
  const [data, setdata] = useState({
    password:"" ,

  })
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  console.log("location",location.state);
  useEffect(()=>{
    if (!location?.state?.name) {
      navigate('/email')
    }
  },[])
  
  const handleOnChange = (e) =>{
    const {name,value} = e.target
    setdata((preve)=>{
      return{
        ...preve,
        [name]:value
      }

    })
  }
  
  const handleSubmit =async(e)=>{
    e.preventDefault()
    e.stopPropagation()
    const URL = `http://localhost:5600/api/password`
    
    try {
      const response = await axios({
        method:'post',
        url:URL,
        data: {
        userId: location?.state?._id,
        password:data.password
      },
        withCredentials:true
      })
      // console.log("response",response);
      toast.success(response.data.message)
    
      if (response.data.success) {
        dispatch(setToken(response?.data?.token))
        localStorage.setItem('token',response?.data?.token)
       setdata ({
        password:"" ,
  })
        navigate('/')
 
      
      }

      
    } catch (error) {
      toast.error("Invalid Password!!")
    
    }
    console.log(data);
  }

  return (
    <div className='mt-5'>
    <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
      <div className='w-fit mx-auto flex flex-col items-center gap-2'>
        {/* <PiUserCircle size={60} /> */}
        <Avtar width={80} heigth={70} name={location?.state?.name} imageURL={location?.state?.profilePic}/>
        <h2 className='font-semibold text-lg'>{location?.state?.name}</h2>
        </div>
      
      <form action="" className='grid gap-4 mt-5' onSubmit={handleSubmit}>
       
        {/* password */}
        <div className='flex flex-col gap-1'>
          <label htmlFor="password">Password:</label>
          <input type="password" id='password' name='password' placeholder='enter your password' className='bg-slate-100 px-2  p-1 focus:outline-primary' value={data.password} onChange={handleOnChange} required/>
        </div>
         
        <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'>Login</button>
      </form>
      <p className='my-3 text-center'><Link to={"/forgot-password"} className='hover:text-secondary font-semibold'>Forgot Password?</Link></p>
    </div>
  </div>
  )
}

export default CheckPassword