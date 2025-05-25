import Right from "@/components/icons/Right";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero my-10 md:my-28">
      <div className="py-8 md:py-12">
        <h1 className="text-6xl font-extrabold font-agbalumo">
          Best Food<br />
          <p className="text-6xl">For Your Taste</p>
        </h1>
        <p className="mb-6 mt-4 mx-1 text-sm font-medium">
          Grocify offer a wide range of products, including fresh products, meats, dairy, baked goods and non-perishable items.
        </p>
        <div className="gap-4 grid grid-cols-2 text-sm">
          <button href="{'/#menu'}" className="flex font-bold justify-center bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-500 uppercase items-center gap-2 text-white px-2 py-2 rounded-full border-none">
            Order Now
            <Right />
          </button>

        </div>
      </div>
      <div className="relative hidden md:block">
        <Image src={'/geprek.png'} layout={'fill'} objectFit={'contain'} alt={'pizza'} />
      </div>
    </section>
  );
}