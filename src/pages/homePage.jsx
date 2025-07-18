import { Link, Routes, Route } from 'react-router-dom';
import Header from '../components/header.jsx';
import LoginPage from './loginPage.jsx';
import ProductOverview from './home/productOverview.jsx';
import Product from './home/product.jsx';
import Card from './home/card.jsx';


export default function HomePage() {
  return (
    <div className='h-screen w-full'>
        <Header/>

        <div className='w-full h-[calc(100vh-70px)] bg-gray-100'>
          <Routes path="/*">
            <Route path="/" element={<h1>Home page</h1>}/>
            <Route path="/login" element={<LoginPage />} />            
            <Route path="/productInfo/:id" element={<ProductOverview/>}/>
            <Route path="/product" element={<Product/>} />
            <Route path="/card" element={<Card/>} />
          </Routes>
        </div>
        


    </div>
  );
}
