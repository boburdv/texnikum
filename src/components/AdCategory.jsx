import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabase";

export default function CategoryAds() {
  const { categoryName } = useParams();
  const decodedCategory = decodeURIComponent(categoryName);

  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSub, setSelectedSub] = useState("");
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("dynamic")
      .select("*")
      .ilike("name", decodedCategory)
      .then(({ data }) => {
        if (!data?.length) return setLoading(false);
        const current = data[0];
        setCategory(current);
        setSubCategories(current.sub || []);
        return supabase.from("ads").select("*").eq("category", decodedCategory);
      })
      .then(({ data }) => setAds(data || []))
      .finally(() => setLoading(false));
  }, [decodedCategory]);

  const filteredAds = selectedSub ? ads.filter((ad) => ad.sub_category?.toLowerCase() === selectedSub.toLowerCase()) : ads;

  if (!category && !loading) return <div className="text-center mt-32">Kategoriya topilmadi</div>;

  const skeletonCards = Array.from({ length: 5 }).map((_, i) => <div key={i} className=" bg-gray-200 animate-pulse aspect-[3/4] rounded-lg" />);

  return (
    <>
      {loading ? (
        <div className="sticky top-0 z-30 bg-white shadow-xs lg:mb-8 mb-4">
          <div className="mx-auto max-w-6xl py-2 px-4 animate-pulse">
            {/* title skeleton */}
            <div className="h-7 w-64 bg-gray-200 rounded mb-3" />

            {/* sub buttons skeleton */}
            <div className="flex gap-2 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 w-24 bg-gray-200 rounded-sm" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="sticky top-0 z-30 bg-white shadow-xs lg:mb-8 mb-4">
          <div className="mx-auto max-w-6xl py-2 px-4">
            <h2 className="text-xl lg:text-[22px] font-medium text-gray-900 mb-2">{category.name} bo‘yicha e’lonlar</h2>

            <div className="relative">
              <div className="flex gap-2 overflow-x-auto scroll-hidden pr-10">
                <button onClick={() => setSelectedSub("")} className={`btn btn-soft ${selectedSub === "" ? "btn-primary" : ""}`}>
                  Barchasi
                </button>

                {subCategories.map((sub, i) => (
                  <button key={i} onClick={() => setSelectedSub(sub)} className={`btn btn-soft ${selectedSub === sub ? "btn-primary" : ""}`}>
                    {sub}
                  </button>
                ))}
              </div>

              <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-white to-transparent" />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto mb-24 px-4">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">{skeletonCards}</div>
        ) : filteredAds.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-24">Hozircha joylangan e'lonlar topilmadi</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-8 gap-4">
            {filteredAds.map((ad) => (
              <Link key={ad.id} to={`/ad/${ad.id}`} className="group">
                <div className="card border-base-300 shadow border hover:shadow-lg transition-shadow duration-300">
                  <figure className="aspect-[3/3] bg-gray-100 overflow-hidden">
                    <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
                  </figure>
                  <div className=" px-4 py-3">
                    <h2 className="card-title text-base font-semibold line-clamp-1">{ad.title}</h2>
                    {ad.price && <p className="text-lg font-bold text-primary line-clamp-1">{ad.price}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
