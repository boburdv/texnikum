import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("static")
      .select("*")
      .ilike("name", categoryName)
      .single()
      .then(({ data, error }) => {
        if (error) throw error;
        setCategory(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categoryName]);

  const Skeleton = () => (
    <div className="md:flex gap-6 w-full animate-pulse">
      <div className="md:w-1/2 w-full aspect-3/2 lg:aspect-[4/3.2] rounded-md bg-gray-200" />

      <div className="md:w-1/2 w-full mt-6 md:mt-0 space-y-4">
        <div className="h-8 w-2/3 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto min-h-screen p-4 flex flex-col md:flex-row md:items-center md:justify-center">
      {loading ? (
        <Skeleton />
      ) : category ? (
        <div className="md:flex gap-6 w-full">
          {/* Image */}
          <div className="md:w-1/2 w-full aspect-[3/2] overflow-hidden">
            <img src={category.image_url || "/no-image.webp"} alt={category.name} className="w-full h-full object-cover rounded-md" />
          </div>

          <div className="md:w-1/2 w-full mt-6 md:mt-0">
            <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
            <p className="text-gray-700 whitespace-pre-line">{category.description}</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Ma’lumot topilmadi</p>
      )}
    </div>
  );
}
