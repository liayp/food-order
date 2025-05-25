'use client';

import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { CartContext, cartProductPrice } from "@/components/AppContext";
import AddressInputs from "@/components/layout/AddressInputs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import { useProfile } from "@/components/UseProfile";

export default function CartPage() {
  const { cartProducts, removeCartProduct } = useContext(CartContext);
  const [address, setAddress] = useState({});
  const { data: profileData } = useProfile();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.href.includes("canceled=1")) {
      toast.error("Payment failed 😔");
    }
  }, []);

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY; // Pastikan ini sudah di .env.local dan di prefix NEXT_PUBLIC_ supaya bisa di client

    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (profileData?.city) {
      const { phone, streetAddress, city, postalCode, country } = profileData;
      setAddress({ phone, streetAddress, city, postalCode, country });
    }
  }, [profileData]);

  const subtotal = cartProducts.reduce((sum, p) => sum + cartProductPrice(p), 0);

  function handleAddressChange(propName, value) {
    setAddress((prev) => ({ ...prev, [propName]: value }));
  }

  async function proceedToCheckout(ev) {
    ev.preventDefault();

    const promise = fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address,
        cartProducts,
      }),
    }).then(async (res) => {
      if (!res.ok) throw new Error("Checkout failed");
      const data = await res.json();

      if (data?.redirect_url) {
        window.location.href = data.redirect_url;
      } else if (window.snap && data?.token) {
        window.snap.pay(data.token);
      }
    });

    await toast.promise(promise, {
      loading: "Preparing your order...",
      success: "Redirecting to payment...",
      error: "Something went wrong... Please try again later",
    });
  }

  if (!cartProducts?.length) {
    return (
      <section className="mt-24 text-center">
        <SectionHeaders mainHeader="Cart" />
        <p className="mt-4">Your shopping cart is empty 😔</p>
      </section>
    );
  }

  return (
    <section className="mt-24">
      <div className="text-center">
        <SectionHeaders mainHeader="Cart" />
      </div>
      <div className="mt-8 grid gap-8 grid-cols-2">
        <div>
          {cartProducts.map((product, index) => (
            <CartProduct
              key={index}
              product={product}
              onRemove={removeCartProduct}
              index={index}
            />
          ))}
          <div className="py-2 pr-16 flex justify-end items-center">
            <div className="text-gray-500">Total:</div>
            <div className="font-medium pl-2 text-right">{subtotal}</div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2>Checkout</h2>
          <form onSubmit={proceedToCheckout}>
            <AddressInputs addressProps={address} setAddressProp={handleAddressChange} />
            <button type="submit">Pay Rp. {subtotal}</button>
          </form>
        </div>
      </div>
    </section>
  );
}
