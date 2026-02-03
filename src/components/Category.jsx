import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";
import { MdArrowBackIos } from "react-icons/md";
import Students from "../components/Students";

export default function CategoryPage() {
  const { categoryName } = useParams();

  const [data, setData] = useState(null);
  const [students, setStudents] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setImageLoaded(false);
      setShowFullDescription(false);

      const { data: categoryData } = await supabase.from("static").select("id, name, description, image_url, students").ilike("name", `%${categoryName}%`).maybeSingle();

      if (cancelled) return;

      if (!categoryData) {
        setData(null);
        setStudents([]);
      } else {
        setData(categoryData);
        setStudents(categoryData.students || []);
      }

      setLoading(false);
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [categoryName]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center overflow-hidden">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4 bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-7xl font-bold text-blue-800">404</h1>
          <p className="text-xl text-gray-500">Sahifa topilmadi</p>
          <a href="/" className="btn btn-primary">
            <MdArrowBackIos /> Bosh sahifaga qaytish
          </a>
        </div>
      </div>
    );
  }

  const hasLongDescription = (data.description?.length || 0) > 100;

  return (
    <div className="container mx-auto p-4 lg:mt-24">
      <div className="md:flex gap-8 w-full">
        <div className="md:w-1/2 w-full aspect-[3/2] overflow-hidden relative rounded-md bg-gray-200">
          {!imageLoaded && <div className="absolute inset-0 skeleton" />}
          <img
            src={data.image_url || "/no-image.webp"}
            alt={data.name}
            className={`w-full h-full object-cover rounded-md transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        <div className="md:w-1/2 w-full mt-4 md:mt-0">
          <h1 className="text-3xl font-bold mb-4">{data.name}</h1>

          <div className={`text-gray-700 whitespace-pre-line overflow-hidden ${showFullDescription ? "" : "line-clamp-5"}`}>{data.description}</div>

          {hasLongDescription && (
            <button className="mt-2 text-blue-600 text-sm cursor-pointer hover:underline" onClick={() => setShowFullDescription((v) => !v)}>
              {showFullDescription ? "Kamroq o'qish" : "Ko'proq o'qish"}
            </button>
          )}
        </div>
      </div>

      <Students students={students} />
    </div>
  );
}
