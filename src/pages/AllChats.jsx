import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const categoryFromURL = new URLSearchParams(location.search).get("category");

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const currentUserId = user?.email;

  useEffect(() => {
    const fetchChats = async () => {
      const { data: allChats } = await supabase.from("chats").select("*");
      let all = allChats || [];

      if (categoryFromURL) {
        const chatId = `category-${categoryFromURL}`;
        if (!all.find((c) => c.id === chatId)) {
          const { data } = await supabase
            .from("chats")
            .insert([{ id: chatId, messages: [] }])
            .select()
            .single();
          all.push(data);
        }
        setSelectedChatId(chatId);
      }

      setChats(all);
    };

    fetchChats();
  }, [categoryFromURL]);

  useEffect(() => {
    if (!selectedChatId) return;

    const channel = supabase
      .channel("public:chats")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "chats", filter: `id=eq.${selectedChatId}` }, (payload) => setMessages(payload.new.messages || []))
      .subscribe();

    supabase
      .from("chats")
      .select("messages")
      .eq("id", selectedChatId)
      .single()
      .then(({ data }) => setMessages(data?.messages || []));

    return () => supabase.removeChannel(channel);
  }, [selectedChatId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !selectedChatId) return;

    const newMsg = { sender: currentUserId, text: text.trim(), createdAt: Date.now() };
    setText("");
    const updated = [...messages, newMsg];

    await supabase.from("chats").update({ messages: updated }).eq("id", selectedChatId);
  };

  const deleteMessage = async (index) => {
    const updated = messages.filter((_, i) => i !== index);
    await supabase.from("chats").update({ messages: updated }).eq("id", selectedChatId);
  };

  if (loading) return <span className="loading loading-spinner loading-lg"></span>;
  if (!user)
    return (
      <p className="text-center mt-20">
        Avval ro'yxatdan o'ting. <a href="/auth">Login</a>
      </p>
    );

  return (
    <div className="bg-base-200 flex flex-col p-4 h-screen">
      <div className="card mx-auto bg-white max-w-xl w-full shadow-sm h-full flex flex-col">
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 shadow flex gap-2 justify-between items-center">
            <div className="flex items-center gap-3 flex-1">
              {selectedChatId ? (
                <>
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(chats.find((c) => c.id === selectedChatId)?.id.replace("category-", ""))}&background=random`} alt="avatar" />
                  </div>
                  <span className="font-semibold text-lg">{chats.find((c) => c.id === selectedChatId)?.id.replace("category-", "")}</span>
                </>
              ) : (
                <span className="font-semibold text-lg">Fikrlar bo‘yicha kategoriya</span>
              )}
            </div>

            <select
              value={selectedChatId}
              onChange={(e) => {
                const chatId = e.target.value;
                setSelectedChatId(chatId);
                navigate(chatId ? `/chat?category=${encodeURIComponent(chatId.replace("category-", ""))}` : "/chat");
              }}
              className="select flex-1"
            >
              <option value="">Fikrlar bo‘yicha kategoriya</option>
              {chats.map((chat) => (
                <option key={chat.id} value={chat.id}>
                  {chat.id.replace("category-", "")}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-2 p-4">
            {selectedChatId &&
              messages.map((msg, i) => {
                const isMe = msg.sender === currentUserId;
                const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                return (
                  <div key={i} className="chat chat-start relative">
                    <div className="absolute right-0 top-0">
                      <div className="dropdown dropdown-left">
                        <div tabIndex={0} role="button" className="btn btn-xs btn-ghost">
                          •••
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-28">
                          <li>
                            <button className="text-red-500" onClick={() => deleteMessage(i)}>
                              O‘chirish
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="chat-image avatar" title={msg.sender}>
                      <div className="w-10 rounded-full">
                        <img alt="avatar" src={`https://ui-avatars.com/api/?name=${msg.sender}&background=random`} />
                      </div>
                    </div>

                    <div className="chat-header flex items-center gap-2">
                      <time className="text-xs opacity-50">{time}</time>
                    </div>

                    <div className={`chat-bubble ${isMe ? "chat-bubble-primary" : ""}`}>{msg.text}</div>
                  </div>
                );
              })}
            <div ref={scrollRef}></div>
          </div>
        </div>

        {selectedChatId && (
          <div className="p-4 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Izoh qoldiring..."
              className="input input-bordered flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} className="btn btn-primary">
              Yuborish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
