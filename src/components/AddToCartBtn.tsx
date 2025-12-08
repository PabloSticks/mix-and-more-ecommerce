"use client";
import { useCartStore } from "@/src/store/cartStore";
import { FaShoppingCart } from "react-icons/fa";
import { Product } from "@prisma/client";
import toast, { Toaster } from 'react-hot-toast';

export default function AddToCartBtn({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    // Feedback visual simple
    toast.success('Agregado');
    // O si instalas react-hot-toast: toast.success('Agregado')
  };

  return (
    <button 
      onClick={handleAdd}
      className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-900 rounded-lg font-bold text-sm hover:bg-amber-200 transition active:scale-95"
    >
        <FaShoppingCart /> Añadir
    </button>
  );
}