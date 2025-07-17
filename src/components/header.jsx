import { Link } from 'react-router-dom';


export default function Header() {

    return(
        <header className="bg-white w-full h-[70px] relative flex justify-center items-center">
            <img src="/logo.png" className=" cursor-pointer h-full rounded-full absolute left-[10px]" />

            <div className='h-full flex items-center justify-evenly w-[500px]'>

                <Link to="/" className='bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:border-b'>Home</Link>
                <Link to="/" className='bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:border-b'>Products</Link>
                <Link to="/" className='bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:border-b'>About Us</Link>
                <Link to="/" className='bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:border-b'>Contact Us</Link>
            </div>

          
           
            
        </header>
    )
}