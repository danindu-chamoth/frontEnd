import { IoMdClose } from 'react-icons/io';
import { Link } from 'react-router-dom';

export default function NavSlider(props) {

    const closSlider = props.closSlider

    return(
        <div className='fixed w-full h-screen bg-[#00000080] z-[1000] lg:hidden'>
                <div className='w-[300px] h-full flex flex-col bg-white relative'>
                    {/* Logo Section */}
                    <div className='w-full h-[80px] flex items-center justify-center border-b border-gray-200'>
                        <img src="/logo.png" className="cursor-pointer h-[60px] w-[60px] rounded-full object-cover" />
                        <IoMdClose onClick={closSlider} className='absolute right-4 cursor-pointer h-[80px] text-yellow-500 hover:text-yellow-600' />
                    </div>
                    
                    
                    {/* Navigation Links */}
                    <div className='flex-1 flex flex-col items-center justify-center gap-8'>
                       <Link to="/" className='bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:border-b'>Home</Link>
                        <Link to="/product" className='bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:border-b'>Products</Link>
                        <Link to="/" className='bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:border-b'>About Us</Link>
                        <Link to="/" className='bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:border-b'>Contact Us</Link>
                        <Link to="/card" className='bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:border-b'>Cart</Link>
                        <Link to="/login" className='bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:border-b'>Login</Link>
                    </div>
                </div>
            </div>
    )
}