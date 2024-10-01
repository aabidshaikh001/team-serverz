import React,{useState} from 'react'
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadfile from '../helper/uploadfile';
import toast from 'react-hot-toast';
import axios from 'axios'
function Register() {
  const [data, setdata] = useState({
    name:"",
    email:"" ,
    password:"",
    profilePic:""
  })
  const [uploadphoto, setuploadphoto] = useState("")
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
  const handleUploadphoto = async(e)=>{
    const file = e.target.files[0]
    const uploadPhoto = await uploadfile(file)
    // console.log(uploadPhoto);
    setuploadphoto(file)
    setdata((pre)=>{
      return{
        ...pre,
        profilePic : uploadPhoto?.url
      }
    })
  }
  const handleClearUpload =(e)=>{
    e.stopPropagation()
    e.preventDefault()
    setuploadphoto(null)
  }
  const handleSubmit =async(e)=>{
    e.preventDefault()
    e.stopPropagation()
    const URL = `http://localhost:5600/api/register`
    try {
      const response = await axios.post(URL,data)
      console.log("response",response);
      toast.success(response.data.message)
      if (response.data.success) {
       setdata ({
        name:"",
        email:"" ,
        password:"",
        profilePic:""})
        navigate('/email')
      }

      
    } catch (error) {
      toast.error(error.message)
    
    }
    console.log(data);
  }

  
  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
        <h3 className='text-center'>Welcome to Woopab!</h3>
        <form action="" className='grid gap-4 mt-5' onSubmit={handleSubmit}>
          {/* name */}
          <div className='flex flex-col gap-1'>
            <label htmlFor="name">Name:</label>
            <input type="text" id='name' name='name' placeholder='enter your name' className='bg-slate-100 px-2  p-1 focus:outline-primary' value={data.name} onChange={handleOnChange} required/>
          </div>
          {/* email */}
          <div className='flex flex-col gap-1'>
            <label htmlFor="email">Email:</label>
            <input type="email" id='email' name='email' placeholder='enter your email' className='bg-slate-100 px-2  p-1 focus:outline-primary' value={data.email} onChange={handleOnChange} required/>
          </div>
           {/* password */}
           <div className='flex flex-col gap-1'>
            <label htmlFor="password">Password:</label>
            <input type="password" id='password' name='password' placeholder='enter your password' className='bg-slate-100 p-1 px-2 focus:outline-primary' value={data.password} onChange={handleOnChange} required/>
          </div>
           {/* password */}
           <div className='flex flex-col gap-1'>
            <label htmlFor="profile_pic">Photo:
              <div className='h-14 bg-slate-200 flex justify-center items-center border  hover:border-primary rounded cursor-pointer'>
                <p className='text-sm '>{uploadphoto?.name ? uploadphoto?.name : "Upload Profile Pic" }</p>
                {
                  uploadphoto?.name && ( <button className='text-lg ml-2 hover:text-red-600' onClick={handleClearUpload}>
                    <IoClose/>
                  </button>)
                }
               
              </div>
            </label>
            <input type="file" id='profile_pic' name='profile_pic'  className='bg-slate-100 px-2  focus:outline-primary hidden ' onChange={handleUploadphoto}/>
          </div>
          <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'>Register</button>
        </form>
        <p className='my-3 text-center'>Already have account?<Link to={"/email"} className='hover:text-secondary font-semibold'>Login</Link></p>
      </div>
    </div>
  )
}

export default Register