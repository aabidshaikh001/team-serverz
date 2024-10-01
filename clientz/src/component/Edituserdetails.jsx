import React,{useEffect, useRef, useState} from 'react'
import Avtar from './Avtar'
import uploadfile from '../helper/uploadfile'
import Divider from './Divider'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'

function Edituserdetails({onClose,user}) {
    const [data, setdata] = useState({
        name: user?.user,
        profilePic: user?.profilePic
    })
    const uploadPhotoRef = useRef()
    const dispatch = useDispatch()
    useEffect(()=>{
        setdata((preve)=>{
           return{ 
            ...preve,
            ...user
           }
        })   
    },[user])
    const handleOnchange = (e) =>{
        const {name,value} = e.target
        setdata((preve)=>{
            return{
                ...preve,
                [name]:value 
            }
        })
    }
   const handleOpenUploadPhoto = (e)=>{
    e.preventDefault()
    e.stopPropagation()
    uploadPhotoRef.current.click()
   }
    const handleUploadPhoto = async(e)=>{
        const file = e.target.files[0]
        const uploadPhoto = await uploadfile(file)
        // console.log(uploadPhoto);
        
        setdata((pre)=>{
          return{
            ...pre,
            profilePic : uploadPhoto?.url
          }
        })
    }
    const handleSubmit = async(e)=>{
        e.preventDefault()
        e.stopPropagation()
        try {
             const URL =  `http://localhost:5600/api/update-user`
            const response = await axios({
                method:'post',
                url:URL,
                data:data,
                withCredentials:true,
            })
            toast.success(response.data.message)
            if (response.data.success) {
                dispatch(setUser(response.data.data))
                onClose()
            }
        } catch (error) {
            toast.error(error?.response?.data?.message )
        }
    }
  return (
    <div
     className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
        <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm'>
            <h2 className='font-semibold'>Profile Details</h2>
            <p className='text-sm'>Edit user details</p>
            <form action="" className='grid gap-3 mt-3' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-1'>
                <label htmlFor="name">Name:</label>
                <input type="text"
                name='name' id='name' value={data.name} onChange={handleOnchange}
                className='w-full py-1 px-2 focus:outline-primary border-0.5' />
                </div>
                <div>
                    <div>Photo:</div>
                    <div className='my-1 flex items-center gap-4'>
                        
                        <Avtar width={40} heigth={40} imageURL={data?.profilePic} name={data.name}/>
                        <label htmlFor="profile_pic">
                        <button className='font-semibold' onClick={handleOpenUploadPhoto} >Change Photo</button>
                        <input type="file" id='profile_pic' className='hidden' onChange={handleUploadPhoto} ref={uploadPhotoRef} /></label>
                    </div>
                </div>
                <Divider/>
                <div className='flex gap-2 w-fit ml-auto mt-3'>
                    <button onClick={onClose} className='border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white'>Cancel</button>
                    <button onClick={handleSubmit} className='border-primary bg-primary border text-white px-4 py-1 rounded hover:bg-secondary'>Save</button>
                </div>
            </form>
        </div>
     </div>
  )
}

export default React.memo(Edituserdetails)