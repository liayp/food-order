  import AddToCartButton from "@/components/menu/AddToCartButton";

  export default function MenuItemTile({ onAddToCart, ...item }) {
    const { image, description, name, basePrice,
      sizes, extraIngredientPrices,
    } = item;
    const hasSizesOrExtras = sizes?.length > 0 || extraIngredientPrices?.length > 0;
    return (
      <div className="bg-stone-100 mt-4 mb-10 p-5 rounded-2xl text-center
        group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all">
        <div className="text-center">
          <img src={image} className="max-h-auto max-h-24 block mx-auto rounded-lg" alt="pizza" />
        </div>
        <h4 className="font-medium font-agbalumo text-2xl mt-5 mb-3 text-yellow-500">{name}</h4>
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
          {description}
        </p>
        <AddToCartButton
          image={image}
          hasSizesOrExtras={hasSizesOrExtras}
          onClick={onAddToCart}
          basePrice={basePrice}
        />
      </div>
    );
  }