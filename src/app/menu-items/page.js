'use client';
import Right from "@/components/icons/Right";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MenuItemsPage() {

  const [menuItems, setMenuItems] = useState([]);
  const { loading, data } = useProfile();

  useEffect(() => {
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => {
        setMenuItems(menuItems);
      });
    })
  }, []);

  if (loading) {
    return 'Loading user info...';
  }

  if (!data.admin) {
    return 'Not an admin.';
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        <Link
          className="button flex bg-yellow-400 border-none"
          href={'/menu-items/new'}>
          <span className="text-white">Add menu item</span>
          <Right />
        </Link>
      </div>
      <div>
        <h2 className="text-sm text-gray-700 mt-8 mb-3">Edit menu item:</h2>
        <div className="grid grid-cols-4 gap-2">
          {menuItems?.length > 0 && menuItems.map(item => (
            <Link
              key={item._id}
              href={'/menu-items/edit/' + item._id}
              className="bg-gray-200 hover:bg-gray-300 rounded-lg p-4"
            >
              <div className="relative">
                <Image
                  className="rounded-lg"
                  src={item.image} alt={''} width={150} height={150} />
              </div>
              <div className="text-center mt-2 font-agbalumo font-semibold text-yellow-500">
                {item.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}