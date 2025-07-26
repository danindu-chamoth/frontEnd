import { useState } from 'react'
import './App.css'
import LoginPage from './pages/loginPage.jsx'
import HomePage from './pages/homePage.jsx'
import SignUpPage from './pages/singUpPage.jsx'
import AdminHomePage from './pages/adminHomePage.jsx'
import FileUploadTest from './pages/test.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google'
import MyOrdersPage from './pages/home/orders.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <> 
      <BrowserRouter>
      <Toaster position="bottom-center" reverseOrder={false} />
      <GoogleOAuthProvider clientId='1071679549851-b869khnuk15a0g534nh5mgv91bjb01vq.apps.googleusercontent.com' >
        <Routes>          
          <Route path="/*" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/singup" element={<SignUpPage />} />
          <Route path="/admin/*" element={<AdminHomePage />} />
          <Route path="/test" element={<FileUploadTest/> }/>
          <Route path="/orders" element={<MyOrdersPage />} />
          <Route path="*" element={<h1>404 error</h1>}/>
        </Routes>
        </GoogleOAuthProvider>
      </BrowserRouter>      
    </>
  )
}

export default App
