'use client';

import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    fetch('/api/categories').then(res => {
      res.json().then(categories => setCategories(categories))
    });
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => setMenuItems(menuItems));
    });
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => {
        setBestSellers(menuItems.slice(-3));
      });
    });
  }, []);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <section className="mt-8">
      <div className="text-center mb-7">
        <SectionHeaders
          mainHeader={'Our Menus'} />
      </div>
      <div className="text-center mb-10 font-serif font-extralight">
        {categories?.length > 0 && categories.map(c => (
          <span
            key={c._id}
            className={`mr-7 cursor-pointer ${selectedCategory === c._id ? 'font-bold border-b-2 border-yellow-600' : ''}`}
            onClick={() => handleCategoryClick(c._id)}
          >
            {c.name}
          </span>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-4 my-5 md:my-8">
        {(!selectedCategory ? bestSellers : menuItems.filter(item => item.category === selectedCategory))
          .map(item => (
            <MenuItem key={item._id} {...item} />
          ))}
      </div>
    </section>
  );
}

