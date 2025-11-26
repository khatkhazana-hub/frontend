import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext();

const actionTypes = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  UPDATE: "UPDATE",
  CLEAR: "CLEAR",
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD: {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }] };
    }
    case actionTypes.REMOVE:
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };
    case actionTypes.UPDATE:
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: Math.max(0, action.payload.quantity) }
              : item
          )
          .filter((item) => item.quantity > 0),
      };
    case actionTypes.CLEAR:
      return { ...state, items: [] };
    default:
      return state;
  }
};

const initialState = { items: [] };

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, (init) => {
    if (typeof window === "undefined") return init;
    try {
      const stored = localStorage.getItem("kk_cart");
      return stored ? JSON.parse(stored) : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("kk_cart", JSON.stringify(state));
  }, [state]);

  const addItem = (product, quantity = 1) => {
    if (!product?.id && !product?._id) return;
    const payload = {
      ...product,
      id: product.id || product._id,
      quantity,
    };
    dispatch({ type: actionTypes.ADD, payload });
  };

  const removeItem = (id) => dispatch({ type: actionTypes.REMOVE, payload: id });
  const updateQuantity = (id, quantity) =>
    dispatch({ type: actionTypes.UPDATE, payload: { id, quantity } });
  const clear = () => dispatch({ type: actionTypes.CLEAR });

  const totals = useMemo(() => {
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal === 0 ? 0 : subtotal >= 95 ? 0 : 6.5;
    const tax = subtotal === 0 ? 0 : parseFloat((subtotal * 0.07).toFixed(2));
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }, [state.items]);

  const value = useMemo(
    () => ({
      items: state.items,
      totals,
      addItem,
      removeItem,
      updateQuantity,
      clear,
    }),
    [state.items, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
