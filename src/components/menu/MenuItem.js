'use client';

import { useSession } from "next-auth/react";
import { CartContext } from "@/components/AppContext";
import MenuItemTile from "@/components/menu/MenuItemTile";
import Image from "next/image";
import { useContext, useState } from "react";

export default function MenuItem(menuItem) {
  const {
    image, name, description, basePrice,
    sizes = [], extraIngredientPrices = [],
  } = menuItem;

  const { data: session } = useSession();
  const [selectedSize, setSelectedSize] = useState(sizes[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const { addToCart } = useContext(CartContext);

  const hasOptions = sizes.length > 0 || extraIngredientPrices.length > 0;

  async function handleAddToCartButtonClick() {
    if (!session) {
      alert("Kamu harus login dulu untuk menambahkan ke keranjang!");
      return;
    }

    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }

    addToCart(menuItem, selectedSize, selectedExtras);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowPopup(false);
  }


  function handleExtraThingClick(ev, extraThing) {
    if (ev.target.checked) {
      setSelectedExtras(prev => [...prev, extraThing]);
    } else {
      setSelectedExtras(prev => prev.filter(e => e._id !== extraThing._id));
    }
  }

  let selectedPrice = basePrice;
  if (selectedSize) selectedPrice += selectedSize.price;
  if (selectedExtras.length > 0) {
    selectedExtras.forEach(extra => {
      selectedPrice += extra.price;
    });
  }

  return (
    <>
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-10"
        >
          <div
            onClick={ev => ev.stopPropagation()}
            className="my-8 bg-white p-4 rounded-lg max-w-md w-full"
          >
            <Image
              src={image}
              alt={name}
              width={300}
              height={200}
              className="mx-auto rounded"
            />
            <h2 className="text-lg font-bold text-center my-3">{name}</h2>
            <p className="text-center text-gray-600 mb-4">{description}</p>

            {sizes.length > 0 && (
              <div className="mb-4">
                <h3 className="text-center text-gray-700 mb-2">Pick your size</h3>
                {sizes.map(size => (
                  <label
                    key={size._id}
                    className="flex items-center gap-2 p-3 border rounded-md mb-1 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="size"
                      checked={selectedSize?._id === size._id}
                      onChange={() => setSelectedSize(size)}
                    />
                    {size.name} Rp. {basePrice + size.price}
                  </label>
                ))}
              </div>
            )}

            {extraIngredientPrices.length > 0 && (
              <div className="mb-4">
                <h3 className="text-center text-gray-700 mb-2">Any extras?</h3>
                {extraIngredientPrices.map(extra => (
                  <label
                    key={extra._id}
                    className="flex items-center gap-2 p-3 border rounded-md mb-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedExtras.some(e => e._id === extra._id)}
                      onChange={ev => handleExtraThingClick(ev, extra)}
                      name={extra.name}
                    />
                    {extra.name} +Rp. {extra.price}
                  </label>
                ))}
              </div>
            )}

            <button
              className="w-full mt-4 bg-primary hover:bg-yellow-600 text-white rounded-full px-6 py-3 font-semibold"
              onClick={handleAddToCartButtonClick}
            >
              Add to cart Rp. {selectedPrice}
            </button>

            <button
              className="mt-2 w-full text-center text-gray-600 underline"
              onClick={() => setShowPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <MenuItemTile
        onAddToCart={handleAddToCartButtonClick}
        {...menuItem}
      />
    </>
  );
}
