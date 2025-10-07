import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Download,
  Server,
  Laptop,
  Cpu,
  Database,
  Rocket,
  MoveRight,
  Globe,
} from "lucide-react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";

// ──────────────────────────────────────────────────────────────────────────────
// Samuel • Portfolio Full-Stack (PT/EN)
// - PT/EN com overlay de escolha e persistência (samuel.lang)
// - Download do CV muda conforme idioma
// - Seções: Hero, Sobre, Stack, Serviços, Projetos, Experiência, CTA, Contato
// ──────────────────────────────────────────────────────────────────────────────

// Ajuste aqui seus links
const socials = {
  github: "https://github.com/samuelbatista3rios",
  linkedin: "https://www.linkedin.com/in/samuel-fonseca-0289a6121/",
  email: "mailto:samuelbatista3rios@gmail.com",
  phone: "tel:+5524992260913",
};

// Stack (com techs pedidas)
const tech = [
  { name: "React.js", icon: <Laptop className="w-4 h-4" /> },
  { name: "Next.js", icon: <Laptop className="w-4 h-4" /> },
  { name: "TypeScript", icon: <Cpu className="w-4 h-4" /> },
  { name: "Node.js", icon: <Server className="w-4 h-4" /> },
  { name: "Express", icon: <Server className="w-4 h-4" /> },
  { name: "NestJS", icon: <Server className="w-4 h-4" /> },
  { name: "Python", icon: <Cpu className="w-4 h-4" /> },
  { name: "GraphQL", icon: <Cpu className="w-4 h-4" /> },
  { name: "MongoDB", icon: <Database className="w-4 h-4" /> },
  { name: "PostgreSQL", icon: <Database className="w-4 h-4" /> },
  { name: "Docker", icon: <Server className="w-4 h-4" /> },
  { name: "Kubernetes", icon: <Server className="w-4 h-4" /> },
  { name: "AWS", icon: <Rocket className="w-4 h-4" /> },
  { name: "Selenium", icon: <Cpu className="w-4 h-4" /> },
  { name: "Puppeteer", icon: <Cpu className="w-4 h-4" /> },
];

// Projetos (com métricas do Coomb)
const projects = [
  {
    title_pt: "Coomb – IA para Currículos",
    title_en: "Coomb – AI‑Powered Résumé Builder",
    tag_pt: "SaaS • IA • PDFs",
    tag_en: "SaaS • AI • PDFs",
    blurb_pt:
      "SaaS que gera CVs personalizados com IA (OpenAI/Groq), seleção de temas, exportação em PDF e otimização baseada na vaga.",
    blurb_en:
      "SaaS that creates tailored résumés with AI (OpenAI/Groq), theme picker, PDF export and job‑aware optimization.",
    bullets_pt: ["Next.js + API Routes", "Fila de jobs", "Stripe (assinaturas)", "MongoDB"],
    bullets_en: ["Next.js + API Routes", "Job queue", "Stripe (subscriptions)", "MongoDB"],
    links: { live: "#", repo: "#" },
  },
  {
    title_pt: "E‑commerce React + Checkout API",
    title_en: "React E‑commerce + Checkout API",
    tag_pt: "Web App • Front/Back",
    tag_en: "Web App • Front/Back",
    blurb_pt:
      "Página de produto dinâmica (Pexels API para imagens), carrinho em localStorage e envio de pedidos via API de checkout.",
    blurb_en:
      "Dynamic product page (Pexels API), cart via localStorage and order submission to a checkout API.",
    bullets_pt: ["React + Zustand", "Pexels API", "Checkout REST", "Testes de integração"],
    bullets_en: ["React + Zustand", "Pexels API", "Checkout REST", "Integration tests"],
    links: { live: "#", repo: "#" },
  },
  {
    title_pt: "Dashboard Fluig (TOTVS)",
    title_en: "Fluig (TOTVS) Dashboard",
    tag_pt: "Automação • B.I.",
    tag_en: "Automation • B.I.",
    blurb_pt:
      "Automação de processos críticos com integrações REST, painéis analíticos e orquestração de workflows.",
    blurb_en:
      "Process automation with REST integrations, analytical dashboards and workflow orchestration.",
    bullets_pt: ["Fluig + Scripts", "Integração REST", "KPIs em tempo real"],
    bullets_en: ["Fluig + Scripts", "REST integration", "Realtime KPIs"],
    links: { live: "#", repo: "#" },
  },
];

// Serviços
const services = [
  {
    icon: <Laptop className="w-5 h-5" />,
    title_pt: "Frontend escalável",
    title_en: "Scalable Frontend",
    desc_pt:
      "SPAs performáticas com React/Next, UI acessível e foco em conversão.",
    desc_en:
      "High-performance SPAs with React/Next, accessible UI and conversion focus.",
  },
  {
    icon: <Server className="w-5 h-5" />,
    title_pt: "APIs & Backends",
    title_en: "APIs & Backends",
    desc_pt:
      "Node/Nest/Python, autenticação JWT/OAuth, filas e observabilidade.",
    desc_en: "Node/Nest/Python, JWT/OAuth auth, queues and observability.",
  },
  {
    icon: <Database className="w-5 h-5" />,
    title_pt: "Dados & DevOps",
    title_en: "Data & DevOps",
    desc_pt: "Mongo/Postgres, Docker, CI/CD, deploy em AWS com boas práticas.",
    desc_en:
      "Mongo/Postgres, Docker, CI/CD, AWS deployments with best practices.",
  },
];

// Experiências (expandido)
const experiences = [
  // ───────────────────────────────────────────
  // FREELANCE (atual)
  {
    when_pt: "jun/2025 → hoje",
    when_en: "Jun/2025 → present",
    role_pt: "Desenvolvedor · Freelance",
    role_en: "Developer · Freelance",
    org: "Autônomo",
    points_pt: [
      "Projetos full-stack (React/Node) com TypeScript",
      "Testes ágeis e automação básica (Jest/RTL)",
      "Integração com bancos NoSQL e SQL",
      "Bundling/otimização com Webpack e Vite",
      "Suporte multi-SO e ambientes de deploy",
    ],
    points_en: [
      "Full-stack projects (React/Node) with TypeScript",
      "Agile testing and basic automation (Jest/RTL)",
      "NoSQL and SQL database integrations",
      "Bundling/optimizations with Webpack & Vite",
      "Multi-OS support and deployment environments",
    ],
  },

  // ───────────────────────────────────────────
  // HMTJ
  {
    when_pt: "jun/2024 → mai/2025",
    when_en: "Jun/2024 → May/2025",
    role_pt: "Analista de desenvolvimento de software",
    role_en: "Software Development Analyst",
    org: "Hospital e Maternidade Therezinha de Jesus (HMTJ) · Presencial · Juiz de Fora/MG",
    points_pt: [
      "Interfaces responsivas com React.js, Redux e Tailwind (+35% UX mobile)",
      "APIs RESTful com Node.js/Express em microsserviços",
      "MongoDB/MySQL modelados e otimizados (−20% no tempo de resposta)",
      "Testes automatizados (Jest, React Testing Library) com >90% cobertura",
      "Automação de processos em Python (+25% produtividade)",
      "CI/CD com GitHub Actions e GitLab",
      "Integrações TOTVS Fluig (API/Workflows) · Stack: Fluig, Eclipse, Bootstrap, SQL Server",
    ],
    points_en: [
      "Responsive UIs with React.js, Redux, Tailwind (+35% mobile UX)",
      "RESTful APIs with Node.js/Express (microservices)",
      "MongoDB/MySQL modeled & tuned (−20% response time)",
      "Automated tests (Jest, RTL) with >90% coverage",
      "Python process automation (+25% productivity)",
      "CI/CD using GitHub Actions & GitLab",
      "TOTVS Fluig integrations (API/Workflows) · Stack: Fluig, Eclipse, Bootstrap, SQL Server",
    ],
  },

  // ───────────────────────────────────────────
  // FREELANCE (jan–mai/2024)
  {
    when_pt: "jan/2024 → mai/2024",
    when_en: "Jan/2024 → May/2024",
    role_pt: "Desenvolvedor · Freelance",
    role_en: "Developer · Freelance",
    org: "Autônomo",
    points_pt: [
      "Landing pages e SPAs responsivas (React + TS)",
      "Boas práticas de testes ágeis",
      "Modelagem simples em NoSQL",
      "Ajustes de Webpack e performance",
    ],
    points_en: [
      "Responsive landing pages & SPAs (React + TS)",
      "Agile testing practices",
      "Light NoSQL modeling",
      "Webpack tweaks and performance tuning",
    ],
  },

  // ───────────────────────────────────────────
  // DELAGE
  {
    when_pt: "jan/2023 → dez/2023",
    when_en: "Jan/2023 → Dec/2023",
    role_pt: "Analista de sistemas",
    role_en: "Systems Analyst",
    org: "Delage · Remoto · Juiz de Fora/MG",
    points_pt: [
      "Otimização de consultas e índices (−30% tempo de execução)",
      "Migração de bancos legados para plataformas modernas",
      "Relatórios automatizados com SSRS (−50% no tempo de geração)",
      "Adoção de práticas ágeis (+20% eficiência de entrega)",
      "T-SQL, Oracle SQL Developer e SQL Server Management Studio",
      "Integrações com WMS e automações de dados",
    ],
    points_en: [
      "Query & index optimization (−30% runtime)",
      "Legacy DB migration to modern stacks",
      "Automated reporting with SSRS (−50% build time)",
      "Agile practices adoption (+20% delivery efficiency)",
      "T-SQL, Oracle SQL Developer, SQL Server Management Studio",
      "WMS integrations and data automations",
    ],
  },

  // ───────────────────────────────────────────
  // FREELANCE WEB (2021–2023)
  {
    when_pt: "fev/2021 → jan/2023",
    when_en: "Feb/2021 → Jan/2023",
    role_pt: "Freelance Web Developer",
    role_en: "Freelance Web Developer",
    org: "Autônomo",
    points_pt: [
      "Apps web com React.js e mobile com React Native",
      "UIs dinâmicas com HTML/CSS/JS e design responsivo",
      "Integração de APIs e versionamento com Git/GitHub",
      "Portfólio de repositórios: github.com/samuelbatista3rios",
    ],
    points_en: [
      "Web apps with React.js and mobile with React Native",
      "Dynamic UIs with HTML/CSS/JS and responsive design",
      "API integrations and versioning with Git/GitHub",
      "Repos: github.com/samuelbatista3rios",
    ],
  },

  // ───────────────────────────────────────────
  // MZTECH
  {
    when_pt: "fev/2021 → fev/2022",
    when_en: "Feb/2021 → Feb/2022",
    role_pt: "Desenvolvedor Full-Stack",
    role_en: "Full-Stack Developer",
    org: "MzTech – Sites e Aplicativos · Presencial",
    points_pt: [
      "Performance: −40% tempo de carregamento, +25% responsividade",
      "APIs escaláveis com Node.js/Express",
      "Integração com AWS (EC2, S3, RDS)",
      "Frontend com React + TypeScript + Redux",
      "PostgreSQL e MongoDB · manutenção e evolução de sistemas",
    ],
    points_en: [
      "Performance: −40% load time, +25% responsiveness",
      "Scalable APIs with Node.js/Express",
      "AWS integrations (EC2, S3, RDS)",
      "Frontend with React + TypeScript + Redux",
      "PostgreSQL and MongoDB · maintenance & evolution",
    ],
  },

  // ───────────────────────────────────────────
  // SUPORTE TÉCNICO
  {
    when_pt: "set/2020 → set/2021",
    when_en: "Sep/2020 → Sep/2021",
    role_pt: "Auxiliar de suporte técnico",
    role_en: "Technical Support Assistant",
    org: "Três Rios/RJ · Presencial",
    points_pt: [
      "Atendimento a usuários (remoto/presencial) e registro de chamados",
      "Instalação e configuração de softwares/hardwares",
      "Documentação técnica básica do ambiente de TI",
    ],
    points_en: [
      "User support (remote/on-site) and ticket logging",
      "Software/hardware install & configuration",
      "Basic technical documentation for the IT environment",
    ],
  },

  // ───────────────────────────────────────────
  // IRONHACK (formação aplicada como experiência)
  {
    when_pt: "2020 → 2021",
    when_en: "2020 → 2021",
    role_pt: "Desenvolvedor Full-Stack · Aprendiz",
    role_en: "Full-Stack Developer · Trainee",
    org: "Ironhack",
    points_pt: [
      "HTML, CSS, JavaScript no dia a dia",
      "Express (back-end) e React (front-end)",
      "Git e GitHub · APIs REST",
      "Metodologias ágeis",
    ],
    points_en: [
      "Daily HTML, CSS, JavaScript",
      "Express (back end) and React (front end)",
      "Git & GitHub · REST APIs",
      "Agile methodologies",
    ],
  },
];


// i18n (textos PT/EN + href do CV por idioma)
const i18n = {
  pt: {
    nav: {
      sobre: "Sobre",
      stack: "Stack",
      projetos: "Projetos",
      servicos: "Serviços",
      experiencia: "Experiência",
      contato: "Contato",
    },
    hero: {
      badge: "Disponível para projetos",
      h1a: "Construo produtos",
      h1b: "web e mobile",
      h1c: "que unem",
      h1d: "performance, escalabilidade e visão de produto.",
      p: "Full-stack com foco em React, Node, Python e integrações REST/GraphQL. Experiência com CI/CD, microsserviços, automação e IA generativa aplicada ao produto.",
      talk: "Fale comigo",
      cv: "Baixar CV",
      phoneLabel: "Brasil • Remoto",
    },
    about: {
      title: "Sobre",
      desc: "Com mais de 4 anos como Desenvolvedor, entrego produtos web e mobile com foco em performance, escalabilidade e visão de produto.",
      highlights: [
        "Frontend: React, TypeScript, Next.js",
        "Backend: Node.js (Express/Nest), Python",
        "DB: PostgreSQL, MySQL, MongoDB",
        "Arquitetura: microsserviços, REST/GraphQL",
        "Infra: Docker, AWS, CI/CD, Kubernetes",
        "Automação: Selenium, Puppeteer",
        "IA generativa aplicada ao produto",
        "Projetos no Fluig (TOTVS)",
      ],
    },
    stack: {
      title: "Stack Tecnológica",
      desc: "Ferramentas que uso no dia a dia.",
    },
    services: {
      title: "Como posso ajudar",
      desc: "Do design do fluxo de dados ao deploy.",
    },
    projects: {
      title: "Projetos em destaque",
      desc: "Alguns cases que mostram como penso produto e engenharia.",
      cta: "Precisa de algo parecido?",
      view: "Ver",
      code: "Código",
    },
    exp: { title: "Experiência" },
    cta: {
      title: "Tem um projeto em mente?",
      desc: "Bora tirar do papel com qualidade de engenharia e foco em negócio.",
      start: "Começar agora",
    },
    contact: {
      title: "Vamos conversar",
      desc: "Me chama e eu respondo rápido. Se preferir, descreva a ideia e mando uma proposta objetiva.",
      name: "Nome",
      email: "Email",
      message: "Mensagem",
      placeholderName: "Seu nome",
      placeholderEmail: "voce@email.com",
      placeholderMsg: "Conte rapidamente sua ideia, objetivo e prazo.",
      send: "Enviar",
    },
    footer: { rights: "Todos os direitos reservados.", home: "Início" },
    languagePrompt: {
      title: "Escolha seu idioma",
      pt: "Português",
      en: "English",
    },
    cvHref: "/Samuel-CV-PT.pdf",
  },
  en: {
    nav: {
      sobre: "About",
      stack: "Stack",
      projetos: "Projects",
      servicos: "Services",
      experiencia: "Experience",
      contato: "Contact",
    },
    hero: {
      badge: "Available for projects",
      h1a: "I build",
      h1b: "web and mobile products",
      h1c: "that combine",
      h1d: "performance, scalability and product thinking.",
      p: "Full-stack focused on React, Node, Python and REST/GraphQL integrations. Experience with CI/CD, microservices, automation and applied Generative AI.",
      talk: "Talk to me",
      cv: "Download Résumé",
      phoneLabel: "Brazil • Remote",
    },
    about: {
      title: "About",
      desc: "With 4+ years as a Full-Stack dev, I ship web & mobile products with performance, scalability and product mindset.",
      highlights: [
        "Frontend: React, TypeScript, Next.js",
        "Backend: Node.js (Express/Nest), Python",
        "DB: PostgreSQL, MySQL, MongoDB",
        "Architecture: microservices, REST/GraphQL",
        "Infra: Docker, AWS, CI/CD, Kubernetes",
        "Automation: Selenium, Puppeteer",
        "Applied Generative AI",
        "Projects on Fluig (TOTVS)",
      ],
    },
    stack: { title: "Tech Stack", desc: "Tools I use daily." },
    services: {
      title: "How I can help",
      desc: "From data-flow design to production deploys.",
    },
    projects: {
      title: "Featured Projects",
      desc: "A few cases that show my product + engineering mindset.",
      cta: "Need something similar?",
      view: "View",
      code: "Code",
    },
    exp: { title: "Experience" },
    cta: {
      title: "Got a project in mind?",
      desc: "Let's ship it with solid engineering and business focus.",
      start: "Start now",
    },
    contact: {
      title: "Let's talk",
      desc: "Ping me and I'll reply fast. Or describe your idea and I'll send a concise proposal.",
      name: "Name",
      email: "Email",
      message: "Message",
      placeholderName: "Your name",
      placeholderEmail: "you@email.com",
      placeholderMsg: "Briefly tell me your idea, goal and timeline.",
      send: "Send",
    },
    footer: { rights: "All rights reserved.", home: "Home" },
    languagePrompt: {
      title: "Choose your language",
      pt: "Português",
      en: "English",
    },
    cvHref: "/Samuel-CV-EN.pdf",
  },
};

const Section = ({ id, children, className = "" }) => (
  <section
    id={id}
    className={`max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 ${className}`}
  >
    {children}
  </section>
);

export default function PortfolioSamuel() {
  const [lang, setLang] = useState("pt");
  const [showLangGate, setShowLangGate] = useState(false);

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("samuel.lang")
        : null;
    if (saved === "pt" || saved === "en") {
      setLang(saved);
    } else {
      setShowLangGate(true);
    }
  }, []);

  const t = useMemo(() => i18n[lang], [lang]);

  const chooseLang = (l) => {
    setLang(l);
    setShowLangGate(false);
    if (typeof window !== "undefined") localStorage.setItem("samuel.lang", l);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-900 text-neutral-100 antialiased relative">
      {/* Overlay de idioma (primeiro acesso ou quando clicar no botão) */}
      {showLangGate && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-neutral-950/80 backdrop-blur">
          <Card className="w-[92vw] max-w-md bg-neutral-900/80 border-neutral-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-neutral-200 mb-4">
                <Globe className="w-5 h-5" />
                <span className="font-semibold">
                  {i18n.pt.languagePrompt.title} /{" "}
                  {i18n.en.languagePrompt.title}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => chooseLang("pt")} className="w-full">
                  {i18n.pt.languagePrompt.pt}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => chooseLang("en")}
                  className="w-full"
                >
                  {i18n.en.languagePrompt.en}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 border-b border-neutral-800/60">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3">
          <a href="#home" className="flex items-center gap-2 font-semibold">
            <Sparkles className="w-5 h-5" /> Samuel • Full-Stack
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#sobre" className="hover:text-white/90">
              {t.nav.sobre}
            </a>
            <a href="#stack" className="hover:text-white/90">
              {t.nav.stack}
            </a>
            <a href="#projetos" className="hover:text-white/90">
              {t.nav.projetos}
            </a>
            <a href="#servicos" className="hover:text-white/90">
              {t.nav.servicos}
            </a>
            <a href="#experiencia" className="hover:text-white/90">
              {t.nav.experiencia}
            </a>
            <a href="#contato" className="hover:text-white/90">
              {t.nav.contato}
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLangGate(true)}
              className="p-2 rounded-xl hover:bg-neutral-800/60 flex items-center gap-2 text-sm"
            >
              <Globe className="w-5 h-5" /> {lang.toUpperCase()}
            </button>
            <a
              href={socials.github}
              target="_blank"
              className="p-2 rounded-xl hover:bg-neutral-800/60"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={socials.linkedin}
              target="_blank"
              className="p-2 rounded-xl hover:bg-neutral-800/60"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={socials.email}
              className="p-2 rounded-xl hover:bg-neutral-800/60"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <Section id="home" className="pt-16">
        <div className="grid md:grid-cols-2 gap-10 items-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-widest uppercase text-neutral-400 mb-3">
              {t.hero.badge}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              {t.hero.h1a} <span className="text-white/90">{t.hero.h1b}</span>{" "}
              {t.hero.h1c}
              <span className="block mt-1">{t.hero.h1d}</span>
            </h1>
            <p className="mt-5 text-neutral-300 max-w-prose">{t.hero.p}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="group">
                <a href="#contato" className="flex items-center gap-2">
                  {t.hero.talk}{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </a>
              </Button>
              <Button variant="secondary" asChild>
                <a href={t.cvHref} download className="flex items-center gap-2">
                  <Download className="w-4 h-4" /> {t.hero.cv}
                </a>
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-4 text-sm text-neutral-400">
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />{" "}
                <a href={socials.phone}>+55 24 99226-0913</a>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {t.hero.phoneLabel}
              </span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500/20 via-sky-500/10 to-violet-500/20 blur-2xl rounded-3xl" />
              <Card className="relative bg-neutral-900/60 border-neutral-800/70 shadow-2xl rounded-3xl">
                <CardContent className="p-6">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-neutral-800">
                    <img
                      src="./Code.png"
                      alt="Preview de projetos de desenvolvimento"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="mt-4 flex gap-2 text-xs text-neutral-400">
                    <span className="px-2 py-1 rounded-full bg-neutral-800/80">
                      React
                    </span>
                    <span className="px-2 py-1 rounded-full bg-neutral-800/80">
                      Node
                    </span>
                    <span className="px-2 py-1 rounded-full bg-neutral-800/80">
                      MongoDB
                    </span>
                    <span className="px-2 py-1 rounded-full bg-neutral-800/80">
                      AWS
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* SOBRE */}
      <Section id="sobre" className="py-8">
        <h2 className="text-2xl font-semibold mb-2">{t.about.title}</h2>
        <p className="text-neutral-300 mb-4 max-w-prose">{t.about.desc}</p>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-neutral-300">
          {t.about.highlights.map((h) => (
            <li key={h}>• {h}</li>
          ))}
        </ul>
      </Section>

      {/* STACK */}
      <Section id="stack" className="py-8">
        <h2 className="text-2xl font-semibold mb-2">{t.stack.title}</h2>
        <p className="text-neutral-300 mb-6">{t.stack.desc}</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {tech.map((ti) => (
            <div
              key={ti.name}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900/60"
            >
              {ti.icon}
              <span className="text-sm">{ti.name}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* SERVIÇOS */}
      <Section id="servicos" className="py-12">
        <h2 className="text-2xl font-semibold mb-2">{t.services.title}</h2>
        <p className="text-neutral-300 mb-6">{t.services.desc}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {services.map((s) => (
            <Card
              key={s.title_pt}
              className="bg-neutral-900/60 border-neutral-800"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-emerald-400 mb-3">
                  {s.icon}
                  <span className="font-medium">
                    {lang === "pt" ? s.title_pt : s.title_en}
                  </span>
                </div>
                <p className="text-neutral-300 text-sm">
                  {lang === "pt" ? s.desc_pt : s.desc_en}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* PROJETOS */}
      <Section id="projetos" className="py-12">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold">{t.projects.title}</h2>
            <p className="text-neutral-300">{t.projects.desc}</p>
          </div>
          <a
            href="#contato"
            className="hidden md:inline-flex items-center gap-1 text-sm text-neutral-300 hover:text-white"
          >
            {t.projects.cta} <MoveRight className="w-4 h-4" />
          </a>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {projects.map((p) => (
            <Card
              key={p.title_pt}
              className="bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 transition"
            >
              <CardContent className="p-6">
                <div className="aspect-video rounded-xl bg-neutral-800 mb-4 flex items-center justify-center text-neutral-400 text-sm">
                  screenshot
                </div>
                <div className="text-xs text-neutral-400 mb-1">
                  {lang === "pt" ? p.tag_pt : p.tag_en}
                </div>
                <h3 className="text-lg font-semibold">
                  {lang === "pt" ? p.title_pt : p.title_en}
                </h3>
                <p className="text-sm text-neutral-300 mt-1">
                  {lang === "pt" ? p.blurb_pt : p.blurb_en}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-neutral-300">
                  {(lang === "pt" ? p.bullets_pt : p.bullets_en).map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-3">
                  <a
                    href={p.links.live}
                    target="_blank"
                    className="text-sm inline-flex items-center gap-1 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" /> {t.projects.view}
                  </a>
                  <a
                    href={p.links.repo}
                    target="_blank"
                    className="text-sm inline-flex items-center gap-1 hover:underline"
                  >
                    <Github className="w-4 h-4" /> {t.projects.code}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* EXPERIÊNCIA */}
      <Section id="experiencia" className="py-12">
        <h2 className="text-2xl font-semibold mb-2">{t.exp.title}</h2>
        <div className="space-y-4">
          {experiences.map((e) => (
            <div
              key={e.role_pt}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5"
            >
              <div className="text-xs text-neutral-400">
                {lang === "pt" ? e.when_pt : e.when_en}
              </div>
              <div className="font-semibold">
                {lang === "pt" ? e.role_pt : e.role_en} · {e.org}
              </div>
              <ul className="mt-2 text-sm text-neutral-300 grid sm:grid-cols-2 gap-1">
                {(lang === "pt" ? e.points_pt : e.points_en).map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-12">
        <Card className="bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-violet-500/10 border-neutral-700">
          <CardContent className="p-8 md:p-10">
            <div className="md:flex items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold">{t.cta.title}</h3>
                <p className="text-neutral-300 mt-1">{t.cta.desc}</p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-3">
                <Button asChild>
                  <a href="#contato" className="flex items-center gap-2">
                    {t.cta.start} <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="secondary" asChild>
                  <a
                    href={socials.linkedin}
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    LinkedIn <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* CONTATO */}
      <Section id="contato" className="py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold">{t.contact.title}</h2>
            <p className="text-neutral-300 mt-2">{t.contact.desc}</p>
            <div className="mt-6 space-y-2 text-sm">
              <a
                className="flex items-center gap-2 hover:underline"
                href={socials.email}
              >
                <Mail className="w-4 h-4" /> samuelbatista3rios@gmail.com
              </a>
              <a
                className="flex items-center gap-2 hover:underline"
                href={socials.linkedin}
              >
                <Linkedin className="w-4 h-4" /> /in/samuel-fonseca-0289a6121
              </a>
              <a
                className="flex items-center gap-2 hover:underline"
                href={socials.github}
              >
                <Github className="w-4 h-4" /> /samuelbatista3rios
              </a>
            </div>
          </div>
          <Card className="bg-neutral-900/60 border-neutral-800">
            <CardContent className="p-6">
              <form
                action={`mailto:samuelbatista3rios@gmail.com`}
                method="POST"
                className="space-y-3"
              >
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">
                    {t.contact.name}
                  </label>
                  <input
                    name="nome"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder={t.contact.placeholderName}
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">
                    {t.contact.email}
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder={t.contact.placeholderEmail}
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">
                    {t.contact.message}
                  </label>
                  <textarea
                    name="mensagem"
                    rows={5}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder={t.contact.placeholderMsg}
                  ></textarea>
                </div>
                <Button type="submit" className="w-full">
                  {t.contact.send}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </Section>

      <footer className="border-t border-neutral-800/60">
        <Section className="py-6 text-sm text-neutral-400 flex flex-col sm:flex-row gap-2 items-center justify-between">
          <div>
            © {new Date().getFullYear()} Samuel • Full-Stack. {t.footer.rights}
          </div>
          <div className="flex items-center gap-3">
            <a href="#home" className="hover:underline">
              {t.footer.home}
            </a>
            <a href="#sobre" className="hover:underline">
              {t.nav.sobre}
            </a>
            <a href="#projetos" className="hover:underline">
              {t.nav.projetos}
            </a>
            <a href="#contato" className="hover:underline">
              {t.nav.contato}
            </a>
          </div>
        </Section>
      </footer>
    </div>
  );
}
