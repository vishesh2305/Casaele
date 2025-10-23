import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const CartContext = createContext();

// Create a custom hook to use the context easily
export const useCart = () => {
  return useContext(CartContext);
};

// Create the provider component
export const CartProvider = ({ children }) => {
  // Load initial cart from local storage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cartItems');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Failed to parse cart from local storage", error);
      return [];
    }
  });

  // Save to local storage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      // Check if item (with same id, level, and format) is already in cart
      const existingItem = prevItems.find(
        (i) => i._id === item._id &&
               i.selectedLevel === item.selectedLevel &&
               i.selectedFormat === item.selectedFormat
      );

      if (existingItem) {
        // If it exists, update the quantity
        return prevItems.map((i) =>
          i._id === existingItem._id &&
          i.selectedLevel === existingItem.selectedLevel &&
          i.selectedFormat === existingItem.selectedFormat
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        // Otherwise, add it as a new item
        return [...prevItems, item];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (uniqueId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.uniqueId !== uniqueId));
  };
  
  // Update item quantity
  const updateQuantity = (uniqueId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(uniqueId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.uniqueId === uniqueId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Check if an item is added (by its base ID, for the "Added" button)
  const isItemAdded = (id) => {
    return cartItems.some((item) => item._id === id);
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate totals
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.discountPrice || item.price;
    return total + price * item.quantity;
  }, 0);

  // The value to be provided to all children
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    isItemAdded,
    clearCart,
    totalItems,
    totalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};