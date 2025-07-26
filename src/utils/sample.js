const token = localStorage.getItem("token");
        if(token === null){
            return alert("Please login to place an order");
        }
        axios.post(import.meta.env.VITE_BACKEND_URL+"/api/orders",{
            orderedItems:cart,
            name: "Michael Fernando",
            phone: "94772119876",
            address: "789 Lake Road, Kandy, Central Province, Sri Lanka",
            email: "customer@example.com" // You may want to get this from user authentication

        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            console.log("Order placed successfully:", response.data);
            alert("Order placed successfully!");
            clearCart(); // Clear cart after successful order
            
        }).catch((error) => {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
            
        })