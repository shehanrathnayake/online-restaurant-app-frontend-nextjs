'use client';

import { useState, createContext, useContext, useEffect, ReactNode } from "react";
import Cookie from "js-cookie";
import { gql } from "@apollo/client";
import { client } from "@/app/layout";

// Define the user type
interface User {
  id: string;
  email: string;
  username: string;
}

interface CartItem {
  documentId: string;
  quantity: number;
  name: string;
  price: number;
  description: string;
}

interface Cart {
  items: CartItem[];
  total: number;
}

// Define the context type
interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  cart: Cart;
  addItem: (item: CartItem) => void;
  removeItem: (item: CartItem) => void;
  resetCart: () => void;
  showCart: boolean;
  setShowCart: (show: boolean) => void;
}

// Create the context (not a namespace)
const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

// Context Provider component
export const AppProvider = ({ children }: AppProviderProps) => {
  const cartCookie =
    Cookie.get("cart") !== "undefined" ? Cookie.get("cart") : null;
  const [user, setUser] = useState<User | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState(
    cartCookie ? JSON.parse(cartCookie) : { items: [], total: 0 }
  );

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    Cookie.set("cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (item) => {
    let newItem = cart.items.find((i) => i.documentId === item.documentId);
    if (!newItem) {
      newItem = {
        quantity: 1,
        ...item,
      };
      setCart((prevCart) => ({
        items: [...prevCart.items, newItem],
        total: prevCart.total + item.price,
      }));
    } else {
      setCart((prevCart) => ({
        items: prevCart.items.map((i) =>
          i.documentId === newItem.documentId ? { ...i, quantity: i.quantity + 1 } : i
        ),
        total: prevCart.total + item.price,
      }));
    }
  };

  const removeItem = (item) => {
    let newItem = cart.items.find((i) => i.documentId === item.documentId);
    if (newItem.quantity > 1) {
      setCart((prevCart) => ({
        items: prevCart.items.map((i) =>
          i.documentId === newItem.documentId ? { ...i, quantity: i.quantity - 1 } : i
        ),
        total: prevCart.total - item.price,
      }));
    } else {
      setCart((prevCart) => ({
        items: prevCart.items.filter((i) => i.documentId !== item.documentId),
        total: prevCart.total - item.price,
      }));
    }
  };

  const resetCart = () => {
    setCart({ items: [], total: 0 });
  };

  return (
    <AppContext.Provider 
      value={{ 
        user, 
        setUser,
        cart,
        addItem,
        removeItem,
        resetCart,
        showCart,
        setShowCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Helper function to fetch the user
const getUser = async (): Promise<User | null> => {
  try {
    const token = Cookie.get("token");
    if (!token) return null;

    const { data } = await client.query({
      query: gql`
        query {
          me {
            id
            email
            username
          }
        }
      `,
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    return data?.me || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
