import React,{useState} from 'react'
import { PiUserCircle } from "react-icons/pi";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios'
function CheckEmail() {
  const [data, setdata] = useState({
    email:"" ,
  })
  const navigate = useNavigate()
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
    const URL = `http://localhost:5600/api/email`
    try {
      const response = await axios.post(URL,data)
      // console.log("response",response);
      toast.success(response.data.message)
      if (response.data.success) {
       setdata ({
        email:"" ,
  })
        navigate('/password',{
          state: response?.data?.data
         })
      }

      
    } catch (error) {
      toast.error("Invalid Email!!")
    
    }
    console.log(data);
  }

  return (
    <div className='mt-5'>
    <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
      <div className='w-fit mx-auto'><PiUserCircle size={60} /></div>
      <h3 className='text-center'>Welcome to Woopab!</h3>
      <form action="" className='grid gap-4 mt-5' onSubmit={handleSubmit}>
       
        {/* email */}
        <div className='flex flex-col gap-1'>
          <label htmlFor="email">Email:</label>
          <input type="email" id='email' name='email' placeholder='enter your email' className='bg-slate-100 px-2  p-1 focus:outline-primary' value={data.email} onChange={handleOnChange} required/>
        </div>
         
        <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'>Let's Go</button>
      </form>
      <p className='my-3 text-center'>New User?<Link to={"/register"} className='hover:text-secondary font-semibold'>Register</Link></p>
    </div>
  </div>
  )
}

export default CheckEmail