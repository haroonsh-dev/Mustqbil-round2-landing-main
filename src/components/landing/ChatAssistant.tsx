import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

// Comprehensive knowledge base about Clarity
const knowledgeBase: { keywords: string[]; weight: number; response: string }[] = [
  // === WHAT IS CLARITY ===
  {
    keywords: ["what is clarity", "what does clarity do", "about clarity", "tell me about", "what is this"],
    weight: 3,
    response:
      "Clarity is a simple, focused project management tool built for software engineering teams. It helps small teams plan work, track progress, and ship faster — without the clutter of complex PM tools like Jira.\n\nKey highlights:\n• Kanban boards with drag-and-drop\n• GitHub commit-to-task automation\n• Sprint planning & velocity charts\n• Real-time team collaboration\n• Free forever Starter plan",
  },
  {
    keywords: ["why clarity", "why not jira", "better than jira", "compared to", "vs jira", "vs linear", "vs asana", "vs trello", "alternative"],
    weight: 3,
    response:
      "Unlike Jira, Linear, or Asana, Clarity is purpose-built for small-to-mid engineering teams who want simplicity without sacrificing power.\n\n• **vs Jira** — No 30-minute setup. Clarity is ready in seconds.\n• **vs Linear** — Native GitHub automation baked in, not bolted on.\n• **vs Trello** — Sprint planning, velocity charts, and SSO included.\n• **vs Asana** — Developer-first: commit messages auto-close tasks.\n\nPlus, Clarity's Starter plan is free forever!",
  },
  // === PRICING ===
  {
    keywords: ["pricing", "cost", "price", "how much", "plan", "plans", "subscription", "billing"],
    weight: 2,
    response:
      "Clarity offers 3 plans:\n\n• **Starter** — $0/forever free. Up to 2 members, 3 projects, 100MB storage.\n• **Team** — $10/user/month (billed annually). Unlimited projects, GitHub automation, sprint charts, 10GB storage.\n• **Business** — $24/user/month (billed annually). SSO, dedicated support, 99.99% SLA, custom webhooks.\n\nAll plans include a 14-day free trial. No credit card needed for Starter!",
  },
  {
    keywords: ["free", "starter", "no cost", "free plan", "forever free", "$0", "zero"],
    weight: 2,
    response:
      "Yes! The Starter plan is completely free forever — no credit card required.\n\nIt includes:\n• Up to 3 active projects\n• 2 team members\n• Basic Kanban task boards\n• 100MB storage\n• Slack status notifications\n\nPerfect for solo developers or side projects!",
  },
  {
    keywords: ["team plan", "team tier", "$10", "ten dollars"],
    weight: 2,
    response:
      "The Team plan is $10/user/month (billed annually) or $12/user/month (billed monthly).\n\nIncludes:\n• Unlimited projects & boards\n• Unlimited members & guests\n• GitHub repository workflow automation\n• Real-time sprint progress charts\n• 10GB storage\n• Priority email support\n\nSave $24/yr per user with annual billing!",
  },
  {
    keywords: ["business", "enterprise", "$24", "twenty four"],
    weight: 2,
    response:
      "The Business plan is $24/user/month (billed annually) or $29/month billed monthly.\n\nIncludes everything in Team plus:\n• SAML SSO & Okta identity sync\n• Custom webhooks & public API\n• Dedicated customer success rep\n• 99.99% uptime SLA\n• Annual invoice/PO billing\n• Unlimited storage\n\nIdeal for scaling organizations needing enterprise security.",
  },
  {
    keywords: ["annual", "annually", "yearly", "discount", "save", "cheaper"],
    weight: 2,
    response:
      "Yes, billing annually saves you money!\n\n• **Team**: $10/mo annually vs $12/mo monthly — save $24/yr per user\n• **Business**: $24/mo annually vs $29/mo monthly — save $60/yr per user\n\nYou can switch between monthly and annual billing anytime from your account settings.",
  },
  {
    keywords: ["trial", "try", "14 day", "fourteen day", "free trial"],
    weight: 2,
    response:
      "Every paid plan comes with a 14-day free trial — no credit card required! You get full access to all features during the trial.\n\nAfter 14 days, you can:\n• Upgrade to keep all features\n• Downgrade to the free Starter plan (keep your data)\n• Contact sales for a custom arrangement",
  },
  {
    keywords: ["cancel", "refund", "money back", "stop", "unsubscribe"],
    weight: 2,
    response:
      "You can cancel your subscription anytime — no long-term contracts or cancellation fees.\n\nWhen you cancel:\n• Your plan stays active until the end of the billing period\n• Your data is preserved for 30 days\n• You can downgrade to the free Starter plan to keep basic access\n\nWe don't offer refunds for partial months, but you won't be charged again.",
  },
  // === FEATURES ===
  {
    keywords: ["feature", "features", "what can", "capabilities", "tools", "functionality"],
    weight: 2,
    response:
      "Clarity's core features:\n\n• **Kanban Boards** — Drag-and-drop task management with custom columns\n• **Sprint Planning** — Velocity tracking, burndown charts, story points\n• **GitHub Sync** — Auto-close tasks from commit messages\n• **Real-time Collaboration** — Live updates across your team\n• **Custom Workflows** — Tailored statuses and board layouts\n• **Analytics** — Sprint velocity & team performance dashboards\n• **File Attachments** — Attach docs, images, and files to cards\n• **Slack Notifications** — Get alerts when tasks move\n\nExplore all features at /features!",
  },
  {
    keywords: ["kanban", "board", "boards", "task", "tasks", "drag", "drop", "card", "cards", "column"],
    weight: 2,
    response:
      "Clarity's Kanban boards are the heart of your workflow:\n\n• **Custom columns** — To Do, In Progress, Review, Done (or create your own)\n• **Drag & drop** — Move cards between columns instantly\n• **Assignees** — Assign team members to tasks\n• **Labels & tags** — Color-code tasks by type or priority\n• **Due dates** — Set deadlines and track overdue items\n• **Card details** — Add descriptions, checklists, and attachments\n\nTry the interactive demo at /demo!",
  },
  {
    keywords: ["sprint", "velocity", "burndown", "chart", "analytics", "metrics", "tracking", "progress"],
    weight: 2,
    response:
      "Clarity's sprint tools help you ship on time:\n\n• **Sprint planning** — Set sprint duration, goals, and story points\n• **Burndown charts** — Track remaining work vs. time\n• **Velocity tracking** — See how much your team completes per sprint\n• **Progress indicators** — Real-time sprint completion percentage\n• **Historical data** — Compare sprint performance over time\n\nAvailable on Team and Business plans.",
  },
  // === GITHUB INTEGRATION ===
  {
    keywords: ["github", "repo", "integration", "commit", "pull request", "pr", "repository"],
    weight: 3,
    response:
      "Clarity integrates directly with GitHub!\n\n**Setup:** Settings → Integrations → Connect GitHub\n\n**How it works:**\n• Use `fixes #123` or `closes #123` in commit messages\n• Clarity auto-moves the linked task to Done\n• Pull requests are linked to task cards\n• See commit history directly on cards\n• Branch names linked to tasks\n\nNo more manually updating boards after code changes!",
  },
  {
    keywords: ["git", "automation", "automate", "auto close", "auto move", "workflow"],
    weight: 2,
    response:
      "Our Git automation controller watches your repository events:\n\n• **Commit keywords**: `fixes #123`, `closes #456`, `resolves #789`\n• **Auto-transition**: Matching tasks automatically move to Done\n• **PR linking**: Pull requests display on the task card\n• **Branch tracking**: See which branch is working on which task\n\nThis eliminates the gap between coding and project tracking!",
  },
  // === DEMO ===
  {
    keywords: ["demo", "sandbox", "playground", "interactive"],
    weight: 2,
    response:
      "You can try Clarity right now — no account needed!\n\nVisit /demo to use our interactive board sandbox:\n• Add new tasks with the input field\n• Drag cards between To Do, In Progress, and Done columns\n• Experience the real Kanban workflow\n• See how task management feels in Clarity\n\nIt's the full board experience, right in your browser!",
  },
  // === IMPORT / MIGRATION ===
  {
    keywords: ["import", "jira", "linear", "migrate", "migration", "csv", "json", "export", "transfer", "move data", "switch"],
    weight: 3,
    response:
      "Yes! You can easily import from other tools:\n\n**From Jira or Linear:**\n1. Go to Settings → Import\n2. Upload a CSV or JSON export\n3. Tasks, statuses, and assignees transfer automatically\n4. Migration typically takes under 2 minutes\n\n**What transfers:**\n• Tasks and descriptions\n• Statuses and columns\n• Assignees\n• Labels and priorities\n• Due dates",
  },
  // === ACCOUNT & AUTH ===
  {
    keywords: ["signup", "sign up", "register", "create account", "new account", "get started", "join", "start"],
    weight: 2,
    response:
      "Creating an account is quick and easy!\n\n**Option 1 — Email signup:**\nVisit /signup, fill in your name, email, workspace name, and password.\n\n**Option 2 — GitHub OAuth:**\nClick 'Sign Up with GitHub' for one-click registration.\n\nNo credit card required for the free Starter plan. You'll get a 14-day trial of Team features automatically!",
  },
  {
    keywords: ["login", "log in", "sign in", "signin", "access", "enter"],
    weight: 2,
    response:
      "To sign into your Clarity workspace:\n\n1. Visit /login\n2. Enter your email and password, OR\n3. Click 'Continue with GitHub' for one-click login\n\n**New user?** Click the 'Create a free account' button at the bottom of the login page.\n\n**Forgot password?** Click 'Forgot password?' to reset it via email.",
  },
  {
    keywords: ["password", "reset", "forgot", "change password", "new password"],
    weight: 2,
    response:
      "To reset your password:\n\n1. Visit /forgot-password\n2. Enter your email address\n3. Click 'Send reset link'\n4. Check your inbox for the email\n5. Click the link to set a new password\n\nThe reset link expires after 1 hour. If it expired, just request a new one!",
  },
  // === SECURITY ===
  {
    keywords: ["security", "secure", "encryption", "safe", "privacy", "gdpr", "soc", "compliance", "data protection"],
    weight: 2,
    response:
      "Clarity takes security seriously:\n\n• **SOC 2 Type II** certified\n• **End-to-end encryption** for data in transit and at rest\n• **SAML SSO** — Okta, Azure AD, Auth0 (Business plan)\n• **99.99% uptime SLA** on Business plan\n• **GDPR compliant** — EU data processing agreements available\n• **2FA** — Two-factor authentication support\n• **Audit logs** — Track team activity (Business plan)\n\nRead our full security practices at /security.",
  },
  {
    keywords: ["sso", "saml", "okta", "azure", "auth0", "single sign on"],
    weight: 3,
    response:
      "SAML SSO is available on the Business plan ($24/user/month).\n\nSupported identity providers:\n• Okta\n• Azure Active Directory\n• Auth0\n• Any SAML 2.0 compliant provider\n\nSSO setup takes about 10 minutes with your IT admin. Contact sales for setup assistance.",
  },
  // === SUPPORT ===
  {
    keywords: ["support", "help", "contact", "sales", "customer", "assistance", "question"],
    weight: 2,
    response:
      "We're here to help!\n\n• **This chat** — I can answer questions right now\n• **Email support** — Available on all plans\n• **Priority email** — Faster responses on Team plan\n• **Dedicated success rep** — Personal contact on Business plan\n• **Contact sales** — Visit /pricing and click 'Contact sales'\n\nResponse times:\n• Starter: 48 hours\n• Team: 24 hours\n• Business: 4 hours",
  },
  // === TEAM & SCALING ===
  {
    keywords: ["team size", "members", "how many", "limit", "grow", "scale", "people", "users", "seats"],
    weight: 2,
    response:
      "Member limits by plan:\n\n• **Starter** — Up to 2 members\n• **Team** — Unlimited members\n• **Business** — Unlimited members + guest access\n\nIf your team outgrows the Starter plan, simply upgrade to Team at $10/user/month. All your data and projects carry over seamlessly!",
  },
  {
    keywords: ["invite", "add member", "add user", "add team", "onboard"],
    weight: 2,
    response:
      "To invite team members:\n\n1. Go to Settings → Members\n2. Enter their email address\n3. Choose their role (Admin, Member, or Guest)\n4. Click 'Send Invite'\n\nThey'll receive an email invitation to join your workspace. Guest access is available on the Business plan for external collaborators.",
  },
  // === ON-PREMISE / HOSTING ===
  {
    keywords: ["on-premise", "on premise", "self-host", "self host", "hosted", "where is data", "server", "cloud"],
    weight: 2,
    response:
      "Clarity is currently cloud-hosted with enterprise-grade infrastructure:\n\n• **Hosting:** Secure cloud servers with global CDN\n• **Uptime:** 99.99% SLA on Business plan\n• **Data centers:** Multiple regions for redundancy\n• **Backups:** Automated daily backups\n\nEnterprise on-premise deployment is on our roadmap. Contact sales for updates and timeline.",
  },
  // === CHANGELOG ===
  {
    keywords: ["changelog", "update", "updates", "new", "release", "what's new", "roadmap", "latest", "version"],
    weight: 2,
    response:
      "We ship improvements regularly!\n\nVisit /changelog to see:\n• New features and enhancements\n• Bug fixes and performance improvements\n• UI/UX updates\n• Security patches\n\nWe typically release updates every 1-2 weeks. Major features are announced via email to all users.",
  },
  // === INTEGRATIONS ===
  {
    keywords: ["slack", "notification", "notifications", "alert", "alerts"],
    weight: 2,
    response:
      "Clarity integrates with Slack for real-time notifications:\n\n• Task created, moved, or completed alerts\n• Sprint start/end notifications\n• @mention notifications\n• Daily/weekly summary digests\n\nSetup: Settings → Integrations → Connect Slack\nAvailable on all plans, including the free Starter tier!",
  },
  {
    keywords: ["integration", "integrations", "connect", "third party", "apps"],
    weight: 2,
    response:
      "Clarity integrates with your favorite tools:\n\n• **GitHub** — Commit-to-task automation\n• **Slack** — Real-time notifications\n• **Webhooks** — Custom integrations (Business plan)\n• **REST API** — Build your own integrations (Business plan)\n\nMore integrations (GitLab, Bitbucket, Discord) are on our roadmap!",
  },
  // === STORAGE ===
  {
    keywords: ["storage", "file", "files", "attachment", "attachments", "upload", "space", "gb", "mb"],
    weight: 2,
    response:
      "Storage varies by plan:\n\n• **Starter** — 100MB\n• **Team** — 10GB\n• **Business** — Unlimited\n\nYou can attach files, images, documents, and screenshots directly to task cards. Supported formats include PDF, PNG, JPG, DOCX, and more.",
  },
  // === API / WEBHOOKS ===
  {
    keywords: ["api", "webhook", "webhooks", "developer", "developers", "programmatic", "rest api", "endpoint"],
    weight: 2,
    response:
      "The Business plan includes full API access:\n\n• **REST API** — Create, read, update, delete tasks programmatically\n• **Webhooks** — Get HTTP callbacks when events occur\n• **Rate limits** — Configurable per-API-key limits\n• **Authentication** — API key or OAuth bearer tokens\n\nPerfect for CI/CD integrations, custom dashboards, or automating workflows!",
  },
  // === COLLABORATION ===
  {
    keywords: ["collaborate", "collaboration", "real-time", "realtime", "team work", "together", "share"],
    weight: 2,
    response:
      "Clarity is built for real-time team collaboration:\n\n• **Live board updates** — See changes instantly when teammates move tasks\n• **@mentions** — Tag team members in card comments\n• **Activity feed** — Track who did what and when\n• **Shared views** — Everyone sees the same board state\n• **Role-based access** — Admin, Member, and Guest roles\n\nNo more \"did you update the board?\" messages!",
  },
  // === MOBILE ===
  {
    keywords: ["mobile", "phone", "ios", "android", "app", "responsive"],
    weight: 2,
    response:
      "Clarity's web app is fully responsive and works great on mobile browsers!\n\n• Swipe to navigate between columns\n• Tap to open and edit cards\n• Full task management on the go\n\nDedicated iOS and Android apps are on our roadmap. For now, you can add Clarity to your home screen for an app-like experience!",
  },
  // === GREETINGS ===
  {
    keywords: ["hello", "hi", "hey", "good morning", "good evening", "what's up", "yo", "howdy"],
    weight: 1,
    response:
      "Hey there! 👋 I'm the Clarity assistant. I can help you with:\n\n• Pricing and plans\n• Features and capabilities\n• GitHub integration setup\n• Importing from Jira or Linear\n• Account and login help\n• Security and compliance\n\nJust ask away!",
  },
  {
    keywords: ["thank", "thanks", "thx", "appreciate", "awesome", "great", "cool", "nice"],
    weight: 1,
    response:
      "You're welcome! 😊 Happy to help. Let me know if you have any other questions about Clarity — I'm always here!",
  },
  {
    keywords: ["bye", "goodbye", "see you", "later", "gotta go"],
    weight: 1,
    response:
      "Bye! 👋 Feel free to come back anytime. Happy sprinting! 🚀",
  },
  // === CATCH-ALL PATTERNS ===
  {
    keywords: ["how to", "how do i", "how can i", "can i", "is it possible"],
    weight: 1,
    response:
      "I'd love to help! Could you tell me more specifically what you'd like to do? For example:\n\n• \"How do I connect GitHub?\"\n• \"How do I import from Jira?\"\n• \"How do I invite team members?\"\n• \"How do I reset my password?\"\n• \"How much does Clarity cost?\"\n\nThe more specific your question, the better I can help!",
  },
  {
    keywords: ["project", "projects", "workspace", "workspaces"],
    weight: 1,
    response:
      "In Clarity, a **workspace** is your team's home. Each workspace can have multiple **projects**, and each project has its own Kanban board.\n\n• **Starter**: Up to 3 active projects\n• **Team**: Unlimited projects\n• **Business**: Unlimited projects + advanced controls\n\nYou create a workspace when you sign up, then add projects for each product, team, or initiative.",
  },
  {
    keywords: ["custom", "customize", "configure", "settings", "personalize"],
    weight: 1,
    response:
      "Clarity is highly customizable:\n\n• **Board columns** — Add, rename, reorder, or delete columns\n• **Labels** — Create custom color-coded labels\n• **Workflows** — Define task statuses and transitions\n• **Notifications** — Choose what alerts you receive\n• **Theme** — Dark mode and light mode\n• **Integrations** — Connect GitHub, Slack, and more\n\nMost settings are in Settings → Workspace.",
  },
];

function findBestResponse(query: string): string {
  const q = query.toLowerCase().trim();

  // Score each knowledge base entry
  let bestScore = 0;
  let bestResponse =
    "That's a great question! I can help with anything about Clarity — pricing, features, GitHub integration, importing data, account setup, security, and more.\n\nCould you rephrase your question? For example:\n• \"What features does Clarity offer?\"\n• \"How much does it cost?\"\n• \"How does GitHub integration work?\"";

  for (const entry of knowledgeBase) {
    let score = 0;
    for (const keyword of entry.keywords) {
      // Check for full phrase match (higher weight)
      if (q.includes(keyword)) {
        score += keyword.length * entry.weight;
      }
      // Also check individual words for partial matches
      const words = keyword.split(" ");
      if (words.length > 1) {
        for (const word of words) {
          if (word.length > 2 && q.includes(word)) {
            score += word.length * 0.5;
          }
        }
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
      text: "Hi! 👋 I'm Clarity's assistant. Ask me anything about our features, pricing, GitHub integration, importing from Jira, or getting started!\n\nTry one of the suggestions below 👇",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Quick suggestion chips
  const suggestions = [
    "What is Clarity?",
    "Show me pricing",
    "GitHub integration",
    "Import from Jira",
    "How to get started",
    "Security & compliance",
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

    // Simulate typing delay
    const delay = 500 + Math.random() * 700;
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
      {/* Floating Button */}
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

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-primary p-4 text-primary-foreground flex items-center justify-between shrink-0">
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

          {/* Messages */}
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

          {/* Quick Suggestions - show at start */}
          {messages.length <= 1 && !isTyping && (
            <div className="px-3 py-2 border-t border-border/50 bg-muted/10 flex flex-wrap gap-1.5 shrink-0">
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

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-border flex gap-2 bg-card shrink-0">
            <Input
              type="text"
              placeholder="Ask about pricing, features, integrations..."
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
