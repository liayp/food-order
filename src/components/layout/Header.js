'use client';
import { CartContext } from "@/components/AppContext";
import Bars2 from "@/components/icons/Bars2";
import ShoppingCart from "@/components/icons/ShoppingCart";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useState } from "react";

function AuthLinks({ status, userName }) {
  if (status === 'authenticated') {
    return (
      <>
        <Link href={'/profile'} className="whitespace-nowrap">
          {userName} | Transaction
        </Link>
        <button
          onClick={() => signOut()}
          className="bg-primary rounded-full text-white px-8 py-2 border-none">
          Logout
        </button>
      </>
    );
  }
  if (status === 'unauthenticated') {
    return (
      <>
        <Link href={'/login'} className="font-medium ">Login</Link>
        <Link href={'/register'} className="font-medium bg-primary rounded-full text-white px-8 py-2 border-none">
          Register
        </Link>
      </>
    );
  }
}

export default function Header() {
  const session = useSession();
  const status = session?.status;
  const userData = session.data?.user;
  let userName = userData?.name || userData?.email;
  const { cartProducts } = useContext(CartContext);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  if (userName && userName.includes(' ')) {
    userName = userName.split(' ')[0];
  }
  return (
    <header className="">
      <div className="flex items-center md:hidden justify-between font-extralight">
        <Link className="text-primary font-bold text-2xl font-agbalumo" href={'/'}>
          Coconut Beach
        </Link>
        <div className="flex gap-8 items-center">
          <Link href={'/cart'} className="relative">
            <ShoppingCart />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
                {cartProducts.length}
              </span>
            )}
          </Link>
          <button
            className="p-1 border"
            onClick={() => setMobileNavOpen(prev => !prev)}>
            <Bars2 />
          </button>
        </div>
      </div>
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="md:hidden p-4 bg-gray-200 rounded-lg mt-2 flex flex-col gap-2 text-center">
          <Link href={'/'}>Home</Link>
          <Link href={'/menu'}>Menu</Link>
          <Link href={'/#contact'}>Contact</Link>
          <AuthLinks status={status} userName={userName} />
        </div>
      )}
      <div className="fixed z-10 top-0 left-0 right-0 bg-white shadow-lg py-4 justify-center hidden md:flex">
        <div className="hidden max-widthfood-o md:flex items-center">
          <div className="flex justify-start">
            <nav className="flex relative items-center gap-8 font-normal">
              <Link className="text-primary font-bold font-agbalumo text-2xl" href={'/'}>
                Coconut Beach
              </Link>
              <Link href={'/'}>Home</Link>
              <Link href={'/#menu'}>Menu</Link>
              <Link href={'/#contact'}>Contact</Link>
            </nav>
          </div>
          <div className="pl-24">
            <nav className="flex relative items-center gap-4 font-semibold">
              <AuthLinks status={status} userName={userName} />
              <Link href={'/cart'} className="relative">
                <ShoppingCart />
                {cartProducts?.length > 0 && (
                  <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
                    {cartProducts.length}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}