'use client'

import Cart from "@/components/Cart";
import { Navigation } from "@/components/Navigation";
import { RestaurantList } from "@/components/RestaurantList";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Navigation />
      <main className="mx-auto container m-6">
        <div className="mb-6">
          <input
            className="appearance-none block w-full p-3 leading-5 text-coolGray-900 border border-coolGray-200 rounded-lg shadow-md placeholder-coolGray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
            type="text"
            placeholder="Search restaurants"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <RestaurantList query={query} />
      </main>
    </div>
  );
}
