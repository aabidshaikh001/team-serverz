import React from 'react'
import logo from '../assets/woopab.png'



function AuthLayouts({children}) {
  return (
   <>
   <div className='flex justify-center items-center py-3 h-20 shadow-md bg-white'>
    <img src={logo} height={70} width={180}/>
   </div>
   {children}
   </>
  )
}

export default AuthLayouts