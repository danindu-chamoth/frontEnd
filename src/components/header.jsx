import { Link } from 'react-router-dom';
import { CiMenuBurger } from "react-icons/ci";
import { useState } from 'react';
import NavSlider from './navSlider';


export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return(

        <>

           {isMenuOpen && <NavSlider closSlider={()=>{setIsMenuOpen(false)}}/> }
            
            <header className="bg-white w-full h-[70px] relative flex justify-center items-center">


            <img src="/logo.png" className=" cursor-pointer h-full rounded-full absolute left-[10px]" />
            

            <CiMenuBurger onClick={() => setIsMenuOpen(true) } className='text-2xl absolute right-4 cursor-pointer lg:hidden'/>
            <div className='h-full  items-center justify-evenly w-[500px] hidden lg:flex'>
                

                <Link to="/" className='bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:border-b'>Home</Link>
                <Link to="/product" className='bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:border-b'>Products</Link>
                <Link to="/" className='bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:border-b'>About Us</Link>
                <Link to="/" className='bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:border-b'>Contact Us</Link>
                <Link to="/card" className='bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:border-b'>Cart</Link>
                <Link to="/login" className='bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:border-b'>Login</Link>
            </div>

          
           
            
        </header>
        
        </>
        
    )
}