import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function AdDetail() {
  const { adId } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("ads")
      .select("*")
      .eq("id", adId)
      .single()
      .then(({ data, error }) => {
        if (error) throw error;
        setAd(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [adId]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!ad) return <p className="text-center mt-20">E'lon topilmadi.</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      {ad.image_url && <img src={ad.image_url} alt={ad.title} className="w-full h-64 object-cover rounded mb-4" />}
      <h2 className="text-2xl font-bold">{ad.title}</h2>
      <p className="text-gray-700 mt-2">{ad.description}</p>
      {ad.price && <p className="text-green-600 font-semibold mt-2">{ad.price} so‘m</p>}
      <p className="mt-2">
        <strong>Kategoriya:</strong> {ad.category}
      </p>
      <p>
        <strong>Subkategoriya:</strong> {ad.sub_category}
      </p>
      {ad.created_at && (
        <p className="text-gray-500 text-sm mt-1">
          <strong>Yaratilgan sana:</strong> {new Date(ad.created_at).toLocaleString()}
        </p>
      )}
      <button onClick={() => navigate(`/chat?category=${encodeURIComponent(ad.category)}`)} className="btn btn-primary w-full mt-6">
        Izoh qoldirish
      </button>
    </div>
  );
}
