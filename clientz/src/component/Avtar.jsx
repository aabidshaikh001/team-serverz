import React from 'react'
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from 'react-redux';


function Avtar({userId,name,imageURL,width,heigth}) {
  const onlineUser = useSelector(state=>state?.user?.onlineUser)
    let avatarName = ""
    if (name) {
        const splitname = name?.split(" ")
        if (splitname.length>1) {
            avatarName=splitname[0][0]+splitname[1][0]
        }else{
            avatarName=splitname[0][0]
        }
    }
    const bgcolor = ['bg-slate-200','bg-teal-200','bg-red-200','bg-green-200','bg-yellow-200','bg-purpul-200','bg-orange-200','bg-blue-200','bg-indigo-200','bg-brown-200','bg-grey-200','bg-olive-200',]
    const randomno = Math.floor(Math.random()*13)
    const isOnline = onlineUser.includes(userId)
  return (
    <div className={`text-slate-800 rounded-full font-bold relative `} style={{width: width+"px",height:heigth+"px"}}>
        {
          imageURL ? (
            <img src={imageURL} width={width} height={heigth} alt={name} className='overflow-hidden rounded-full'/>
          ):(
            name ? (
                <div style={{width: width+"px",height:heigth+"px"}} className={`overflow-hidden rounded-full flex justify-center items-center text-xl shadow border ${bgcolor[randomno]}`}>

                   {avatarName}
                </div>
            ):( <PiUserCircle size={width} />)
          )
        }
        {
          isOnline && (
            <div className='bg-green-600 p-1 absolute bottom-2 -right-1 z-10 rounded-full'></div>
            )
        }
    </div>
  
  )
}

export default Avtar