import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

// Knowledge base: each entry has keywords to match and a response
const knowledgeBase: { keywords: string[]; response: string }[] = [
  // Pricing
  {
    keywords: ["pricing", "cost", "price", "how much", "plan", "plans", "subscription"],
    response:
      "Clarity has 3 plans:\n\n• **Starter** — $0/forever free for up to 2 members, 3 projects, and 100MB storage.\n• **Team** — $10/user/month (billed annually) with unlimited projects, GitHub automation, and sprint charts.\n• **Business** — $24/user/month (billed annually) with SSO, dedicated support, and 99.99% SLA.\n\nVisit /pricing for full details!",
  },
  {
    keywords: ["free", "starter", "no cost", "free plan", "forever free"],
    response:
      "Yes! The Starter plan is completely free forever — no credit card required. It includes up to 3 active projects, 2 team members, basic task boards, 100MB storage, and Slack notifications.",
  },
  {
    keywords: ["team plan", "team tier"],
    response:
      "The Team plan is $10/user/month (billed annually) or $12/user/month (billed monthly). It includes unlimited projects & boards, unlimited members, GitHub repo automation, real-time sprint charts, 10GB storage, and priority email support.",
  },
  {
    keywords: ["business", "enterprise", "sso", "saml", "okta"],
    response:
      "The Business plan is $24/user/month (billed annually). It includes everything in Team plus SAML SSO & Okta identity sync, custom webhooks & API limits, a dedicated customer success rep, 99.99% SLA, and annual invoice/PO billing options.",
  },
  {
    keywords: ["annual", "annually", "yearly", "discount", "save"],
    response:
      "Yes! Billing annually saves you money. Team plan: $10/user/month annually vs $12 monthly (save $24/yr per user). Business plan: $24/user/month annually vs $29 monthly (save $60/yr per user).",
  },
  // GitHub Integration
  {
    keywords: ["github", "repo", "integration", "commit", "pull request", "pr"],
    response:
      "Clarity integrates directly with GitHub! Connect your repo in Settings → Integrations. Use commit messages like `fixes #123` and Clarity automatically moves the task card to Done. Pull requests are linked to cards too!",
  },
  {
    keywords: ["git", "automation", "automate", "auto"],
    response:
      "Our Git automation controller watches your repository for commit messages containing task references (e.g., `fixes #123`, `closes #456`). When detected, Clarity auto-transitions the linked task card to the Done column — no manual board updates needed.",
  },
  // Features
  {
    keywords: ["feature", "features", "what can", "capabilities", "tools"],
    response:
      "Clarity's core features include:\n\n• **Kanban Boards** — Drag-and-drop task management\n• **Sprint Planning** — Velocity tracking & burndown charts\n• **GitHub Sync** — Auto-close tasks from commits\n• **Real-time Collaboration** — Live updates across your team\n• **Custom Workflows** — Tailored columns & statuses\n• **Analytics Dashboard** — Sprint velocity & team performance\n\nExplore them all at /features!",
  },
  {
    keywords: ["kanban", "board", "boards", "task", "tasks", "drag"],
    response:
      "Clarity's Kanban boards let you organize tasks into customizable columns (To Do, In Progress, Done, etc.). Drag and drop cards between columns, assign team members, add labels, set due dates, and track progress in real time. Try the interactive demo at /demo!",
  },
  {
    keywords: ["sprint", "velocity", "burndown", "chart", "analytics"],
    response:
      "Clarity includes real-time sprint progress charts with velocity tracking and burndown metrics. Plan sprints, set story points, and monitor your team's throughput over time. Available on Team and Business plans.",
  },
  // Demo
  {
    keywords: ["demo", "sandbox", "try", "test", "playground"],
    response:
      "You can try Clarity right now! Visit /demo to use our interactive board sandbox. Add tasks, drag them between columns, and experience the workflow before signing up. No account needed!",
  },
  // Import / Migration
  {
    keywords: ["import", "jira", "linear", "migrate", "migration", "csv", "json", "export"],
    response:
      "Yes! You can import data from Jira or Linear. Go to Settings → Import and upload a CSV or JSON export. Your tasks, statuses, and assignees transfer over automatically. Migration typically takes under 2 minutes.",
  },
  // Account & Auth
  {
    keywords: ["signup", "sign up", "register", "create account", "new account", "get started"],
    response:
      "Creating an account is easy! Click 'Start free trial' in the navigation bar or visit /signup. You can sign up with your email or use GitHub OAuth for one-click registration. No credit card required for the free Starter plan!",
  },
  {
    keywords: ["login", "log in", "sign in", "signin"],
    response:
      "Visit /login to sign into your Clarity workspace. You can log in with email & password or use GitHub OAuth. Forgot your password? Click 'Forgot password?' on the login page to reset it.",
  },
  {
    keywords: ["password", "reset", "forgot"],
    response:
      "To reset your password, visit /forgot-password, enter your email, and click 'Send reset link'. You'll receive an email with a link to set a new password. The link expires after 1 hour.",
  },
  // Security & Privacy
  {
    keywords: ["security", "secure", "encryption", "data", "privacy", "gdpr", "soc"],
    response:
      "Clarity takes security seriously. We offer SOC 2 Type II certification, end-to-end encryption, SAML SSO on Business plans, and 99.99% uptime SLA. Your data is hosted on secure cloud infrastructure. Read more at /security.",
  },
  // Support
  {
    keywords: ["support", "help", "contact", "sales", "customer"],
    response:
      "Need help? Here's how to reach us:\n\n• **Email support** — Available on all plans (priority on Team+)\n• **Dedicated success rep** — Business plan\n• **Contact sales** — Visit /pricing and click 'Contact sales' on the Business plan\n• **This chat** — I'm here to answer your questions right now!",
  },
  // Team Size
  {
    keywords: ["team size", "members", "how many", "limit", "grow", "scale"],
    response:
      "Starter plan supports up to 2 members. Team and Business plans support unlimited members. If your team grows, simply upgrade from Starter to Team at $10/user/month (billed annually) and add as many members as you need.",
  },
  // On-premise
  {
    keywords: ["on-premise", "on premise", "self-host", "self host", "hosted"],
    response:
      "Clarity is currently cloud-hosted with a 99.99% uptime SLA on the Business plan. Enterprise on-premise deployment is on our roadmap. Contact our sales team for updates on availability.",
  },
  // Changelog
  {
    keywords: ["changelog", "update", "updates", "new", "release", "what's new", "roadmap"],
    response:
      "Check out /changelog to see our latest updates and releases! We ship improvements regularly and keep a detailed log of all new features, bug fixes, and enhancements.",
  },
  // Slack
  {
    keywords: ["slack", "notification", "notifications", "alert", "alerts"],
    response:
      "Clarity integrates with Slack for status notifications! Get real-time alerts when tasks are created, moved, or completed. Available on all plans, including the free Starter tier.",
  },
  // Storage
  {
    keywords: ["storage", "file", "files", "attachment", "attachments", "upload"],
    response:
      "Storage varies by plan:\n\n• **Starter** — 100MB\n• **Team** — 10GB\n• **Business** — Unlimited\n\nYou can attach files, images, and documents directly to task cards.",
  },
  // API / Webhooks
  {
    keywords: ["api", "webhook", "webhooks", "developer", "developers"],
    response:
      "The Business plan includes custom webhooks and public API access with configurable rate limits. Build custom integrations, connect to your CI/CD pipeline, or automate workflows programmatically.",
  },
  // Greetings
  {
    keywords: ["hello", "hi", "hey", "good morning", "good evening", "what's up"],
    response:
      "Hey there! 👋 I'm the Clarity assistant. Ask me about features, pricing, GitHub integration, importing from Jira, or anything else about Clarity!",
  },
  {
    keywords: ["thank", "thanks", "thx", "appreciate"],
    response:
      "You're welcome! 😊 Let me know if you have any other questions about Clarity. I'm always here to help!",
  },
  {
    keywords: ["bye", "goodbye", "see you", "later"],
    response:
      "Bye! 👋 Feel free to come back anytime you have questions. Happy sprinting!",
  },
];

function findBestResponse(query: string): string {
  const q = query.toLowerCase().trim();

  // Score each knowledge base entry by how many keywords match
  let bestScore = 0;
  let bestResponse =
    "Great question! I can help with pricing, features, GitHub integration, importing data, account setup, and more. Could you rephrase or ask about a specific topic?";

  for (const entry of knowledgeBase) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (q.includes(keyword)) {
        // Give longer keywords higher weight (more specific match)
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestResponse = entry.response;
    }
  }

  return bestResponse;
}

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Hi! 👋 I'm Clarity's assistant. Ask me anything about sprint planning, GitHub integrations, pricing, importing from Jira, or getting started!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Quick suggestion chips shown when chat opens
  const suggestions = [
    "What features does Clarity offer?",
    "How much does it cost?",
    "How does GitHub integration work?",
    "Can I import from Jira?",
  ];

  const handleSend = (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const text = overrideText || inputValue.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay (shorter for better UX)
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      const botResponse = findBestResponse(text);
      const botMessage: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: botResponse,
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMessage]);
    }, delay);
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
        <div className="w-80 sm:w-96 h-[500px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-primary p-4 text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-bold">Clarity Assistant</h4>
                <span className="text-[10px] text-white/70 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> Online
                  — Ask me anything
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
                  className={`chat-bubble max-w-[85%] rounded-2xl px-3.5 py-2 text-xs sm:text-sm shadow-sm text-left whitespace-pre-line ${
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-card border border-border text-foreground rounded-tl-none"
                  }`}
                >
                  {/* Render bold text wrapped in ** */}
                  {m.text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
                    part.startsWith("**") && part.endsWith("**") ? (
                      <strong key={i}>{part.slice(2, -2)}</strong>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
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

          {/* Quick Suggestion Chips - only show at start */}
          {messages.length <= 1 && !isTyping && (
            <div className="px-3 py-2 border-t border-border/50 bg-muted/10 flex flex-wrap gap-1.5">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(undefined, s)}
                  className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer border border-primary/20 whitespace-nowrap"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

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
