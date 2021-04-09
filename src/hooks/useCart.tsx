import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const findProduct = cart.find((product) => product.id === productId);

      if (!findProduct) {
        const { data } = await api.get<Product>(`/products/${productId}`);

        if (data) {
          data.amount = 1;

          const newCart = [...cart, data];

          localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));

          setCart(newCart);
          return;
        }
      }

      const { data: stock } = await api.get<Stock>(`stock/${productId}`);

      if (findProduct && findProduct.amount + 1 > stock.amount) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      const updateItemCard = cart.map((cart) =>
        cart.id === productId
          ? {
              ...cart,
              amount: cart.amount + 1,
            }
          : cart
      );

      localStorage.setItem("@RocketShoes:cart", JSON.stringify(updateItemCard));

      setCart(updateItemCard);
    } catch (e) {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
