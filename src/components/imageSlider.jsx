import { useState } from "react";

export default function ImageSlider(props) {
    const images = props.images;
    const [activeImage,setActiveImage]=useState(0)


    return (
        <div>
            <div
                className="w-full flex items-center flex-col relative" >
                <img src={images[activeImage]} className="w-full object-cover" />
                <div className="w-full h-[75px] backdrop-blur-lg absolute bottom-0 overflow-hidden flex items-center justify-center">
                    {images.map((image, index) => (
                        <img
                            onClick={() => setActiveImage(index)}
                            key={index}
                            src={image}
                            className="w-16 h-16 object-cover inline-block m-1 cursor-pointer"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}