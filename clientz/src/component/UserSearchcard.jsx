import React from 'react'
import Avtar from './Avtar'
import { Link } from 'react-router-dom'
import { IoClose } from "react-icons/io5";

function UserSearchcard({user,onClose}) {
  return (
    <Link to={"/"+user?._id} onClick={onClose} className='flex items-center gap-3 p-2 lg:p-4 border border-transparent border-b-slate-200 hover:border-primary rounded cursor-pointer '>
        <div><Avtar width={50} heigth={50} name={user?.name} userId={user?._id} imageURL={user?.profilePic}/></div>
        <div>
            <div className='font-semibold text-ellipsis line-clamp-1'>
                {user?.name}
            </div>
            <p className='text-sm line-clamp-1'>{user?.email}</p>
        </div>
    </Link>
  )
}

export default UserSearchcard