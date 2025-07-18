import { Link } from "react-router-dom";

export default function ProductCard(props ) {
    return (
        <Link to={`/productInfo/${props.product.productId}`}> 

            <div className="w-[260px] h-[400px] m-[10px] rounded-xl shadow-md shadow-gray-500 hover:shadow-lg  overflow-hidden flex flex-col">
                    <img
                        src={props.product.images[0]}
                        alt={props.product.productName}
                        className="h-[65%] w-full object-cover"
                    />
                    <div className="flex-1 flex flex-col justify-between p-4">
                        <div>
                            <h1 className="text-2xl font-bold text-center">{props.product.productName}</h1>
                        </div>
                        <div className="mt-2 flex flex-col   ">
                            <span className="text-lg font-semibold text-yellow-500">${props.product.lastPrice.toFixed(2)}</span>
                            <span className="text-sm text-gray-500 line-through">${props.product.price.toFixed(2)}</span>
                            
                        </div>
                    </div>
                </div>

           
            
        </Link>
    );
}