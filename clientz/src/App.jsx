import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import toast, { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
    <Toaster/>
   <main>
    <Outlet/>
   </main>
   </> 
  )
}

export default App
