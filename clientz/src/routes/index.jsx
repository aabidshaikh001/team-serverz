import {createBrowserRouter} from 'react-router-dom'
import App from '../App.jsx'
import CheckEmail from '../pages/CheckEmail.jsx'
import Register from '../pages/Register.jsx'
import CheckPassword from '../pages/CheckPassword.jsx'
import Home from '../pages/Home.jsx'
import Message from '../component/Message.jsx'
import AuthLayouts from '../layout/index.jsx'
import Forgotpassword from '../pages/Forgot-password.jsx'

const router = createBrowserRouter([
   { 
    path: "/",
    element: <App/>,
    children:[
        {
            path: "register",
            element: <AuthLayouts><Register/></AuthLayouts>
        },
        {
            path: "email",
            element: <AuthLayouts><CheckEmail/></AuthLayouts>
        },
        {
            path: "password",
            element: <AuthLayouts><CheckPassword/></AuthLayouts>
        },
        {
            path: "forgot-password",
            element: <AuthLayouts><Forgotpassword/></AuthLayouts> 
        },
        {
            path:"",
            element:<Home/>,
            children:[
                {
                path:":userId",
                element:<Message/>
            }
        ]
        }
    ]
},
])
export default router