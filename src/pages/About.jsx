import { memo } from "react";

const reasons = ["Lorem ipsum dolor sit amet", "Consectetur adipiscing elit", "Praesent commodo sapien", "Sem purus elementum nisi", "Sed dictum ligula arcu vel libero"];

const contacts = ["Telegram chat", "(90) 94 441 1407", "info@texnikum.uz"];

const About = memo(() => {
  return (
    <div className="max-w-6xl mx-auto mt-28 lg:mt-36 mb-24 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-8 gap-4">
        <div className="w-full h-72 md:h-auto overflow-hidden">
          <img src="/home-img.jpg" alt="About Image" className="w-full h-full object-cover rounded-md" loading="lazy" />
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo, sapien in facilisis gravida, sem purus elementum nisi, sed dictum ligula arcu vel libero.
          </p>

          <div>
            <h2 className="text-xl font-semibold mb-3">Nima uchun biz?</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Aloqa</h2>
            {contacts.map((c, i) => (
              <p key={i} className="text-gray-700">
                {c}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default About;
