import React, { useEffect, useState } from 'react'
import { MdOutlineSearch } from "react-icons/md";
import Loading from './Loading.jsx';
import UserSearchcard from './UserSearchcard.jsx';
import { IoClose } from "react-icons/io5";
import toast from 'react-hot-toast';
import axios from 'axios';
function Searchuser({onClose}) {
  const [searchuser, setsearchuser] = useState([])
  const [loading, setloading] = useState(false)
  const [search, setsearch] = useState("")
  const handleSearchuser = async()=>{
     const URL = `https://team-serverz.onrender.com/api/search-user`
   try {
    setloading(true)
    const response = await axios.post(URL,{
      search:search
    })
    setloading(false)
    setsearchuser(response.data.data)
   console.log(searchuser);
   
    
   } catch (error) {
    toast.error(error?.message)
   }
  }
  useEffect(()=>{
    handleSearchuser( )
  },[search])
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10 '>
        <div className='w-full max-w-lg mx-auto mt-10 m-2'> 
            {/* input search */}
            <div className='bg-white rounded h-14 overflow-hidden flex'>
                <input type="text" placeholder='Searh User By Name, Email...' className='w-full outline-none py-1 h-full px-4' onChange={(e)=>setsearch(e.target.value)}
                value={search} />
              <div className='h-14 w-14 flex justify-center items-center'><  MdOutlineSearch size={25}/></div>
            </div>
            {/* display search */}
            <div className='bg-white mt-2 w-full p-4 rounded '>
                {/* no user found */}
                {
                  searchuser.length === 0 && !loading && (
                    <p className='text-center text-slate-500'>no user found!</p>
                  )
                }
                {
                  loading && (
                    <p><Loading/></p>
                  )
                }
                {
                  searchuser.length !==0 && !loading && (
                    searchuser.map((user,index)=>{
                      return(
                     
                        <UserSearchcard key={user._id} user={user} onClose={onClose}/>
                        
                      )
                    })
                  )
                }
            </div>
        </div>
      <div className='absolute top-0 right-0 text-2xl lg:text-4xl p-2 hover:text-white' onClick={onClose}>
       <button><IoClose size={25}/></button>
        </div>
    </div>
  )
}

export default Searchuser