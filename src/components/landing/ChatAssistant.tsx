import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Hi! I'm Clarity's AI assistant. Ask me anything about sprint planning, GitHub automations, or pricing!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // AI simulated responses
    setTimeout(() => {
      let botText =
        "I'm here to help! For features, check out our Kanban boards. For pricing, plans start at $0/mo. You can also import tickets from Jira in under 2 minutes.";
      const query = inputValue.toLowerCase();
      if (query.includes("github") || query.includes("repo") || query.includes("integration")) {
        botText =
          "Clarity integrates directly with GitHub! Commit messages containing fixes tags (e.g. fixes #123) automatically transition task cards to Done, avoiding manual board updates.";
      } else if (query.includes("pricing") || query.includes("cost") || query.includes("price")) {
        botText =
          "Clarity is free for up to 2 members. The Team plan is $10/user/month (billed annually) or $12/user/month (billed monthly). Custom Enterprise plans are also available.";
      } else if (query.includes("sprint") || query.includes("board") || query.includes("kanban")) {
        botText =
          "Our Kanban board sandbox lets you drag, start, and complete tasks with physics-based click animations. Give it a try on the homepage!";
      }

      const botMessage: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: botText,
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, botMessage]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Speech Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer relative group"
        >
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
          </span>
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window Card */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[450px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-primary p-4 text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-bold">Clarity Assistant</h4>
                <span className="text-[10px] text-white/70 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> Active
                  Assistant
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-muted/20">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`chat-bubble max-w-[85%] rounded-2xl px-3.5 py-2 text-xs sm:text-sm shadow-sm text-left ${
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-card border border-border text-foreground rounded-tl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center shadow-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-border flex gap-2 bg-card">
            <Input
              type="text"
              placeholder="Ask a question..."
              className="h-9 text-xs sm:text-sm flex-1 bg-muted/40"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button type="submit" size="sm" className="h-9 w-9 p-0 shrink-0 cursor-pointer">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
