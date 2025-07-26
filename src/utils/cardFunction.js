export function loadCard(){

    const cart = localStorage.getItem('cart');
    
    if(cart !==null){
        return JSON.parse(cart);

    }else{
        return [];
    }
}

export function addToCard(productId,qty){
    const cart = loadCard();

    const index = cart.findIndex((item) => item.productId === productId)

    if(index === -1){
        cart.push({productId,qty});
    }
    else{
        const newQty =cart[index].qty + qty;

        if(newQty <= 0){
            cart.splice(index,1);
        }else
        {
            cart[index].qty = newQty;
        }
    }
    
    saveCard(cart);
}

export function saveCard(cart){
    localStorage.setItem('cart', JSON.stringify(cart));
}


export function clearCard(){

    localStorage.removeItem('cart');
    return [];
} 

export function deleteItem(productID){
    const cart = loadCard();
    const index = cart.findIndex((item) => {
        return item.productId === productID;
    })

    if(index != -1){
        cart.splice(index, 1);
        saveCard(cart);
    }
}



/*
COMPREHENSIVE STEP-BY-STEP EXPLANATION OF THE SHOPPING CART FUNCTIONALITY:

This file contains three main functions that work together to manage a shopping cart system using browser's localStorage:

=== FUNCTION 1: loadCard() ===
Purpose: Retrieves the existing cart data from browser's localStorage
Step 1: Calls localStorage.getItem('cart') to fetch stored cart data
Step 2: Checks if cart data exists (not null)
Step 3: If data exists, parses the JSON string back into a JavaScript array/object
Step 4: If no data exists, returns an empty array as the default cart
Note: This function should be exported to be used in other files

=== FUNCTION 2: addToCard(productId, qty) ===
Purpose: Adds a product to the cart or updates its quantity
Step 1: Load existing cart data by calling loadCard()
Step 2: Search for the product in the cart using findIndex()
        - findIndex() returns the position of the item if found, or -1 if not found
Step 3: Decision branch based on whether product exists:
        
        IF PRODUCT NOT FOUND (index === -1):
        - Add new product to cart with push() method
        - Creates new object with productId and qty properties
        
        IF PRODUCT ALREADY EXISTS (index !== -1):
        - Calculate new quantity by adding current qty to existing qty
        - Another decision branch for quantity handling:
          
          IF NEW QUANTITY <= 0:
          - Remove product from cart using splice(index, 1)
          - This handles cases where user decreases quantity to 0 or below
          
          IF NEW QUANTITY > 0:
          - Update the existing product's quantity
          - Modifies cart[index].qty to the new quantity value

CRITICAL ISSUE: This function modifies the cart but doesn't save it!
Missing step: Should call saveCard(cart) at the end to persist changes

=== FUNCTION 3: saveCard(cart) ===
Purpose: Saves the cart data to browser's localStorage
Step 1: Takes the cart array as a parameter
Step 2: Converts the cart array to a JSON string using JSON.stringify()
Step 3: Stores the JSON string in localStorage with key 'cart'
Step 4: Data persists even after browser refresh or closure

=== COMPLETE WORKFLOW EXAMPLE ===
1. User wants to add 2 units of product "ABC123"
2. addToCard("ABC123", 2) is called
3. loadCard() fetches existing cart from localStorage
4. findIndex() searches for "ABC123" in cart
5. If not found, adds {productId: "ABC123", qty: 2} to cart
6. If found, updates quantity (existing + 2)
7. MISSING: Should call saveCard(cart) to save changes

=== DATA STRUCTURE ===
Cart is stored as an array of objects:
[
  {productId: "ABC123", qty: 2},
  {productId: "XYZ789", qty: 1},
  {productId: "DEF456", qty: 3}
]

=== RECOMMENDATIONS FOR IMPROVEMENT ===
1. Export loadCard() function for external use
2. Add saveCard(cart) call at the end of addToCard()
3. Consider renaming functions to "loadCart" and "addToCart" for consistency
4. Add error handling for localStorage operations
5. Consider adding validation for productId and qty parameters
*/