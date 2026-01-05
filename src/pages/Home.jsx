import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import React from "react";
import { FaComputer, FaQuestion, FaRegGem } from "react-icons/fa6";
import { TbNeedleThread, TbPlug, TbFlame } from "react-icons/tb";
import { GiBee } from "react-icons/gi";
import { MdRestaurant } from "react-icons/md";

const iconMap = {
  "fa-computer": FaComputer,
  "tb-needle-thread": TbNeedleThread,
  "tb-plug": TbPlug,
  "gi-bee": GiBee,
  "tb-flame": TbFlame,
  "md-restaurant": MdRestaurant,
  "fa-gem": FaRegGem,
};

const StaticSkeleton = () => (
  <div className="border border-gray-200 shadow rounded-lg p-4 flex flex-col gap-2 bg-white animate-pulse">
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 bg-gray-300 rounded-full" />
      <div className="h-5 bg-gray-300 rounded w-2/5" />
    </div>
    <div className="h-4 bg-gray-300 rounded w-full mt-2" />
    <div className="h-4 bg-gray-300 rounded w-4/5 mt-1" />
    <div className="h-4 bg-gray-300 rounded w-3/5 mt-1" />
  </div>
);

const DynamicSkeleton = () => (
  <div className="border border-gray-200 shadow rounded-lg flex flex-row items-start gap-4 p-4 sm:p-5 bg-white animate-pulse">
    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded-full flex-shrink-0" />
    <div className="flex-1 flex flex-col gap-2 justify-center">
      <div className="h-5 bg-gray-300 rounded w-2/5" />
      <div className="h-4 bg-gray-300 rounded w-full" />
      <div className="h-4 bg-gray-300 rounded w-4/5" />
    </div>
  </div>
);

export default function Home() {
  const [staticCategories, setStaticCategories] = useState([]);
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [staticData, dynamicData] = await Promise.all([supabase.from("static").select("*"), supabase.from("dynamic").select("*")]);

      if (staticData.data) setStaticCategories(staticData.data);
      if (dynamicData.data) setDynamicCategories(dynamicData.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Hero section */}
      <div className="relative w-full h-[450px] md:h-[500px] lg:h-[550px] mt-[100px]">
        <img src="/home-img.jpg" alt="hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="w-full max-w-6xl text-white text-center md:text-left space-y-4 md:space-y-6 px-4">
            <span className="inline-block bg-primary px-4 py-1.5 rounded-full text-sm font-semibold mx-auto md:mx-0">RISHTON TUMAN</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-snug mx-auto md:mx-0 uppercase">1-son Teхnikumi</h1>
            <p className="text-base md:text-lg font-medium text-white/90 max-w-lg mx-auto md:mx-0">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis, nam quam praesentium est quae perferendis laudantium quia iure? Architecto.
            </p>
          </div>
        </div>
      </div>

      {/* Static categories */}
      <div className="max-w-6xl mx-auto mt-24 mb-10 px-4">
        <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-8">Kasb yo'nalishlari</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
          {loading
            ? Array.from({ length: 6 }, (_, i) => <StaticSkeleton key={i} />)
            : staticCategories.map((cat) => {
                const Icon = iconMap[cat.icon] || FaQuestion;
                return (
                  <Link key={cat.id} to={`/${encodeURIComponent(cat.name)}`}>
                    <div className="card border border-gray-200 shadow hover:shadow-md transition-shadow duration-300 flex flex-col gap-2 p-4 bg-white">
                      <div className="flex items-center gap-2">
                        <Icon className="text-primary w-5 h-5" />
                        <h2 className="text-xl font-semibold text-gray-800">{cat.name}</h2>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{cat.description}</p>
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>

      {/* Dynamic categories / Yarmarka */}
      <div className="max-w-6xl mx-auto mt-20 mb-24 px-4" id="yarmarka">
        <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-8">Yarmarka</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {loading
            ? Array.from({ length: 6 }, (_, i) => <DynamicSkeleton key={i} />)
            : dynamicCategories.map((cat) => {
                const Icon = iconMap[cat.icon] || FaQuestion;
                return (
                  <Link key={cat.id} to={`/category/${encodeURIComponent(cat.name)}`}>
                    <div className="card border border-gray-200 shadow hover:shadow-md transition-shadow flex flex-row items-start gap-4 p-4 sm:p-5 bg-white">
                      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-base-200 rounded-full">
                        <Icon className="text-4xl text-primary" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center gap-1">
                        <h3 className="text-xl font-semibold text-gray-800">{cat.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{cat.description}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
    </div>
  );
}
