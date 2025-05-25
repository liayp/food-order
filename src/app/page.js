"use client";

import Hero from "@/components/layout/Hero";
import HomeMenu from "@/components/layout/HomeMenu";
import SectionHeaders from "@/components/layout/SectionHeaders";

export default function Home() {
  return (
    <>
      <Hero />
      <HomeMenu />

      <section className="text-center mb-8 mt-14" id="contact">
        <SectionHeaders
          mainHeader={'Contact us'}
        />
        <div className="mt-10">
          <div className="footer-flex-box flex flex-wrap">
            <div className="w-full md:w-1/3 mb-6 md:mb-0 text-left">
              <h2 className="text-lg font-serif font-extrabold mb-4">Our Location</h2>
              <p className="text-slate-800">Boroko Utara</p>
              <p className="text-slate-800">Jalan Trans Sulawesi</p>
              <p className="text-slate-800">Kaidipang </p>
              <p className="text-slate-800">North Bolaang Mongondow Regency</p>
              <p className="text-slate-800">North Sulawesi 95765</p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0 text-center">
              <h2 className="text-lg font-serif font-extrabold mb-4">Connect With Us</h2>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-gray-400 transition duration-300">

                </a>
                <a href="#" className="text-white hover:text-gray-400 transition duration-300">

                </a>
                <a href="#" className="text-white hover:text-gray-400 transition duration-300">

                </a>
              </div>
            </div>
            <div className="w-full md:w-1/3 text-right">
              <h2 className="text-lg font-serif font-extrabold mb-4">Operating Hours</h2>
              <p className="text-slate-800">Sunday - Friday: 08:00 - 22:00</p>
              <p className="text-slate-800">Saturday: 08:00 - 00:00</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
