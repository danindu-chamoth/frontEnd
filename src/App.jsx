import { useState } from 'react'
import './App.css'
import LoginPage from './pages/loginPage.jsx'
import HomePage from './pages/homePage.jsx'
import SignUpPage from './pages/singUpPage.jsx'
import AdminHomePage from './pages/adminHomePage.jsx'
import FileUploadTest from './pages/test.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';


function App() {
  const [count, setCount] = useState(0)

  return (
    <> 
      <BrowserRouter>
      <Toaster />
        <Routes >
          <Route path="/*" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/singup" element={<SignUpPage />} />
          <Route path="/admin/*" element={<AdminHomePage />} />
          <Route path="/test" element={<FileUploadTest/> }/>
          

          <Route path="*" element={<h1>404 error</h1>}/>
        </Routes>
      </BrowserRouter>      
    </>
  )
}

export default App
