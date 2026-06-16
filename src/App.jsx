import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Sparkles, Github, Linkedin, Mail, Phone,
  MapPin, ExternalLink, Download, Server, Laptop, Cpu,
  Database, Rocket, Globe, Sun, Moon, ChevronDown,
  ChevronUp, MoveRight, GraduationCap, BookOpen, Brain,
} from "lucide-react";
import AdminPanel from "./components/AdminPanel";
import { loadPortfolioData, savePortfolioData } from "./lib/supabase";
 
// ─── keys ─────────────────────────────────────────────────────────────────────
const LANG_KEY  = "samuel.lang";
const THEME_KEY = "samuel.theme";
const DATA_KEY  = "samuel.portfolioData";
 
// ─── default data ─────────────────────────────────────────────────────────────
const DEFAULT_DATA = {
  personal: {
    name: "Samuel Fonseca",
    role_pt: "Desenvolvedor Full-Stack",
    role_en: "Full-Stack Developer",
    bio_pt:
      "Full-stack com foco em React, Node, Python e integrações REST/GraphQL. Experiência com CI/CD, microsserviços, automação e IA generativa aplicada ao produto.",
    bio_en:
      "Full-stack focused on React, Node, Python and REST/GraphQL integrations. Experience with CI/CD, microservices, automation and applied Generative AI.",
    about_pt:
      "Com mais de 4 anos como Desenvolvedor, entrego produtos web e mobile com foco em performance, escalabilidade e visão de produto.",
    about_en:
      "With 4+ years as a Full-Stack dev, I ship web & mobile products with performance, scalability and product mindset.",
    location: "Brasil • Remoto",
    phone: "+55 24 99226-0913",
    email: "samuelbatista3rios@gmail.com",
    github: "https://github.com/samuelbatista3rios",
    linkedin: "https://www.linkedin.com/in/samuel-fonseca-0289a6121/",
    stats_years: "4+",
    stats_projects: "15+",
    highlights_pt: [
      "Frontend: React, TypeScript, Next.js",
      "Backend: Node.js (Express/Nest), Python",
      "DB: PostgreSQL, MySQL, MongoDB",
      "Arquitetura: microsserviços, REST/GraphQL",
      "Infra: Docker, AWS, CI/CD, Kubernetes",
      "DevOps & Cloud-Native com IA integrada",
      "IA generativa aplicada ao produto",
      "Projetos no Fluig (TOTVS)",
    ],
    highlights_en: [
      "Frontend: React, TypeScript, Next.js",
      "Backend: Node.js (Express/Nest), Python",
      "DB: PostgreSQL, MySQL, MongoDB",
      "Architecture: microservices, REST/GraphQL",
      "Infra: Docker, AWS, CI/CD, Kubernetes",
      "DevOps & Cloud-Native with integrated AI",
      "Applied Generative AI",
      "Projects on Fluig (TOTVS)",
    ],
  },
  tech: [
    { id: 1,  name: "React.js",    category: "frontend"  },
    { id: 2,  name: "Next.js",     category: "frontend"  },
    { id: 3,  name: "TypeScript",  category: "frontend"  },
    { id: 4,  name: "Node.js",     category: "backend"   },
    { id: 5,  name: "Express",     category: "backend"   },
    { id: 6,  name: "NestJS",      category: "backend"   },
    { id: 7,  name: "Python",      category: "backend"   },
    { id: 8,  name: "GraphQL",     category: "backend"   },
    { id: 9,  name: "MongoDB",     category: "database"  },
    { id: 10, name: "PostgreSQL",  category: "database"  },
    { id: 11, name: "Docker",      category: "devops"    },
    { id: 12, name: "Kubernetes",  category: "devops"    },
    { id: 13, name: "AWS",         category: "devops"    },
    { id: 14, name: "Selenium",    category: "ai"        },
    { id: 15, name: "Puppeteer",   category: "ai"        },
  ],
  services: [
    {
      id: 1, icon: "laptop",
      title_pt: "Frontend escalável",
      title_en: "Scalable Frontend",
      desc_pt: "SPAs performáticas com React/Next, UI acessível e foco em conversão.",
      desc_en: "High-performance SPAs with React/Next, accessible UI and conversion focus.",
    },
    {
      id: 2, icon: "server",
      title_pt: "APIs & Backends",
      title_en: "APIs & Backends",
      desc_pt: "Node/Nest/Python, autenticação JWT/OAuth, filas e observabilidade.",
      desc_en: "Node/Nest/Python, JWT/OAuth auth, queues and observability.",
    },
    {
      id: 3, icon: "database",
      title_pt: "Dados & DevOps",
      title_en: "Data & DevOps",
      desc_pt: "Mongo/Postgres, Docker, CI/CD, deploy em AWS com boas práticas.",
      desc_en: "Mongo/Postgres, Docker, CI/CD, AWS deployments with best practices.",
    },
  ],
  projects: [
    {
      id: 1,
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
      live: "#", repo: "#",
    },
    {
      id: 2,
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
      live: "#", repo: "#",
    },
    {
      id: 3,
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
      live: "#", repo: "#",
    },
  ],
  experiences: [
    {
      id: 1,
      when_pt: "jun/2025 → hoje", when_en: "Jun/2025 → present",
      role_pt: "Desenvolvedor · Freelance", role_en: "Developer · Freelance",
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
    {
      id: 2,
      when_pt: "jun/2024 → mai/2025", when_en: "Jun/2024 → May/2025",
      role_pt: "Analista de desenvolvimento de software",
      role_en: "Software Development Analyst",
      org: "Hospital e Maternidade Therezinha de Jesus (HMTJ) · Juiz de Fora/MG",
      points_pt: [
        "Interfaces responsivas com React.js, Redux e Tailwind (+35% UX mobile)",
        "APIs RESTful com Node.js/Express em microsserviços",
        "MongoDB/MySQL modelados e otimizados (−20% no tempo de resposta)",
        "Testes automatizados (Jest, React Testing Library) com >90% cobertura",
        "Automação de processos em Python (+25% produtividade)",
        "CI/CD com GitHub Actions e GitLab",
        "Integrações TOTVS Fluig (API/Workflows)",
      ],
      points_en: [
        "Responsive UIs with React.js, Redux, Tailwind (+35% mobile UX)",
        "RESTful APIs with Node.js/Express (microservices)",
        "MongoDB/MySQL modeled & tuned (−20% response time)",
        "Automated tests (Jest, RTL) with >90% coverage",
        "Python process automation (+25% productivity)",
        "CI/CD using GitHub Actions & GitLab",
        "TOTVS Fluig integrations (API/Workflows)",
      ],
    },
    {
      id: 3,
      when_pt: "jan/2024 → mai/2024", when_en: "Jan/2024 → May/2024",
      role_pt: "Desenvolvedor · Freelance", role_en: "Developer · Freelance",
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
    {
      id: 4,
      when_pt: "jan/2023 → dez/2023", when_en: "Jan/2023 → Dec/2023",
      role_pt: "Analista de sistemas", role_en: "Systems Analyst",
      org: "Delage · Remoto · Juiz de Fora/MG",
      points_pt: [
        "Otimização de consultas e índices (−30% tempo de execução)",
        "Migração de bancos legados para plataformas modernas",
        "Relatórios automatizados com SSRS (−50% no tempo de geração)",
        "T-SQL, Oracle SQL Developer e SQL Server Management Studio",
        "Integrações com WMS e automações de dados",
      ],
      points_en: [
        "Query & index optimization (−30% runtime)",
        "Legacy DB migration to modern stacks",
        "Automated reporting with SSRS (−50% build time)",
        "T-SQL, Oracle SQL Developer, SQL Server Management Studio",
        "WMS integrations and data automations",
      ],
    },
    {
      id: 5,
      when_pt: "fev/2021 → jan/2023", when_en: "Feb/2021 → Jan/2023",
      role_pt: "Freelance Web Developer", role_en: "Freelance Web Developer",
      org: "Autônomo",
      points_pt: [
        "Apps web com React.js e mobile com React Native",
        "UIs dinâmicas com HTML/CSS/JS e design responsivo",
        "Integração de APIs e versionamento com Git/GitHub",
      ],
      points_en: [
        "Web apps with React.js and mobile with React Native",
        "Dynamic UIs with HTML/CSS/JS and responsive design",
        "API integrations and versioning with Git/GitHub",
      ],
    },
    {
      id: 6,
      when_pt: "fev/2021 → fev/2022", when_en: "Feb/2021 → Feb/2022",
      role_pt: "Desenvolvedor Full-Stack", role_en: "Full-Stack Developer",
      org: "MzTech – Sites e Aplicativos · Presencial",
      points_pt: [
        "Performance: −40% tempo de carregamento, +25% responsividade",
        "APIs escaláveis com Node.js/Express",
        "Integração com AWS (EC2, S3, RDS)",
        "Frontend com React + TypeScript + Redux",
        "PostgreSQL e MongoDB",
      ],
      points_en: [
        "Performance: −40% load time, +25% responsiveness",
        "Scalable APIs with Node.js/Express",
        "AWS integrations (EC2, S3, RDS)",
        "Frontend with React + TypeScript + Redux",
        "PostgreSQL and MongoDB",
      ],
    },
    {
      id: 7,
      when_pt: "set/2020 → set/2021", when_en: "Sep/2020 → Sep/2021",
      role_pt: "Auxiliar de suporte técnico", role_en: "Technical Support Assistant",
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
    {
      id: 8,
      when_pt: "2020 → 2021", when_en: "2020 → 2021",
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
  ],
  education: [
    {
      id: 1,
      degree_pt: "Pós-graduação · DevOps & Engenharia de Plataforma Cloud-Native",
      degree_en: "Postgraduate · DevOps & Cloud-Native Platform Engineering",
      org: "PUC Minas Virtual",
      when_pt: "Em andamento", when_en: "In progress",
      summary_pt:
        "Especialização que integra IA em todas as disciplinas como apoio para acelerar atividades práticas, aprofundar conhecimentos e fortalecer o vínculo entre conhecimento técnico, objetivos de negócio e competências comportamentais.",
      summary_en:
        "Specialization that integrates AI across every course as support to accelerate hands-on work, deepen knowledge and strengthen the link between technical skills, business goals and behavioral competencies.",
      modules: [
        {
          id: 1,
          title_pt: "Módulo 1 · Fundamentos e Arquitetura",
          title_en: "Module 1 · Fundamentals & Architecture",
          disciplines: [
            {
              id: 1,
              name_pt: "Fundamentos de DevOps e Transformação Digital",
              name_en: "DevOps Fundamentals & Digital Transformation",
              goals_pt: [
                "Compreender os fundamentos da transformação digital e seu impacto nas organizações",
                "Relacionar os princípios do DevOps com Agile, Lean Thinking e frameworks como DASA",
                "Implantar a cultura DevOps com foco em colaboração, autonomia e responsabilidade compartilhada",
                "Identificar e integrar ferramentas da cadeia DevOps para automação de processos",
                "Reconhecer a evolução para EmergingOps (AIOps, GitOps, PlatformOps e DevSecOps)",
                "Aplicar IA e metodologias de Foresight e Forecasting para análise de maturidade DevOps e tendências",
              ],
              goals_en: [
                "Understand the fundamentals of digital transformation and its impact on organizations",
                "Relate DevOps principles to Agile, Lean Thinking and frameworks such as DASA",
                "Implement a DevOps culture focused on collaboration, autonomy and shared responsibility",
                "Identify and integrate DevOps toolchains for process automation",
                "Recognize the evolution toward EmergingOps (AIOps, GitOps, PlatformOps and DevSecOps)",
                "Apply AI and Foresight/Forecasting methods to assess DevOps maturity and tech trends",
              ],
            },
            {
              id: 2,
              name_pt: "Arquitetura Cloud-Native e Estratégias Híbridas",
              name_en: "Cloud-Native Architecture & Hybrid Strategies",
              goals_pt: [
                "Compreender os modelos Cloud-First, Multicloud e Híbridos e suas implicações estratégicas",
                "Projetar arquiteturas Cloud-Native com microsserviços, contêineres, Kubernetes e Serverless",
                "Planejar e realizar o deploy de aplicações Cloud-Native e orientadas a eventos",
                "Integrar práticas de segurança, logging e automação com CloudOps/NoOps",
                "Aplicar IA para definição arquitetural e tomada de decisões em ambientes distribuídos",
                "Executar projetos de migração e otimização para ambientes cloud-native e híbridos",
              ],
              goals_en: [
                "Understand Cloud-First, Multicloud and Hybrid models and their strategic implications",
                "Design Cloud-Native architectures with microservices, containers, Kubernetes and Serverless",
                "Plan and deploy Cloud-Native and event-driven applications",
                "Integrate security, logging and automation with CloudOps/NoOps",
                "Apply AI to architectural definition and technical decisions in distributed environments",
                "Run migration and optimization projects for cloud-native and hybrid environments",
              ],
            },
            {
              id: 3,
              name_pt: "Infrastructure as Code e Automação",
              name_en: "Infrastructure as Code & Automation",
              goals_pt: [
                "Compreender os fundamentos de IaC com foco em segurança, escalabilidade e disponibilidade",
                "Utilizar ferramentas de IaC para provisionamento automatizado de infraestrutura",
                "Construir pipelines de infraestrutura integrados a processos CI/CD",
                "Realizar testes automatizados de infraestrutura (validação, linting e compliance)",
                "Aplicar versionamento, gestão de estado e Policy as Code para governança",
                "Utilizar IA para recomendação de configurações, detecção de falhas e otimização",
              ],
              goals_en: [
                "Understand IaC fundamentals focused on security, scalability and availability",
                "Use IaC tools for automated infrastructure provisioning",
                "Build infrastructure pipelines integrated with CI/CD processes",
                "Run automated infrastructure tests (validation, linting and compliance)",
                "Apply versioning, state management and Policy as Code for governance",
                "Use AI for configuration recommendations, failure detection and optimization",
              ],
            },
          ],
        },
        {
          id: 2,
          title_pt: "Módulo 2 · Implementação, Automação e Engenharia de Plataforma",
          title_en: "Module 2 · Implementation, Automation & Platform Engineering",
          disciplines: [
            {
              id: 1,
              name_pt: "Conteinerização e Orquestração com Kubernetes",
              name_en: "Containerization & Orchestration with Kubernetes",
              goals_pt: [
                "Compreender a conteinerização com Docker e a otimização/segurança de imagens",
                "Implementar e gerenciar aplicações no Kubernetes (pods, services e deployments)",
                "Aplicar escalabilidade, alta disponibilidade e rolling updates",
                "Configurar segurança, RBAC e proteção de pods em clusters",
                "Utilizar operadores e CRDs para automação avançada de infraestrutura",
                "Empregar IA para otimização de recursos, detecção de anomalias e capacity planning",
              ],
              goals_en: [
                "Understand containerization with Docker and image optimization/security",
                "Deploy and manage applications on Kubernetes (pods, services and deployments)",
                "Apply scalability, high availability and rolling updates",
                "Configure security, RBAC and pod protection in clusters",
                "Use operators and CRDs for advanced infrastructure automation",
                "Use AI for resource optimization, anomaly detection and capacity planning",
              ],
            },
            {
              id: 2,
              name_pt: "CI/CD, Pipelines e Testes Automatizados",
              name_en: "CI/CD, Pipelines & Automated Testing",
              goals_pt: [
                "Compreender os fundamentos, objetivos e desafios de CI/CD",
                "Projetar pipelines completos (build, test, deploy e monitoramento)",
                "Integrar segurança (SAST, DAST, varredura de dependências e conformidade)",
                "Aplicar observabilidade em pipelines (métricas, logs e tracing)",
                "Utilizar IA para análise de falhas, predição de gargalos e otimização de etapas",
                "Construir pipelines CI/CD com integração a GitOps e práticas de confiabilidade",
              ],
              goals_en: [
                "Understand CI/CD fundamentals, goals and challenges",
                "Design complete pipelines (build, test, deploy and monitoring)",
                "Integrate security (SAST, DAST, dependency scanning and compliance)",
                "Apply observability in pipelines (metrics, logs and tracing)",
                "Use AI for failure analysis, bottleneck prediction and stage optimization",
                "Build CI/CD pipelines integrated with GitOps and reliability practices",
              ],
            },
            {
              id: 3,
              name_pt: "Serverless Computing e Arquiteturas Event-Driven",
              name_en: "Serverless Computing & Event-Driven Architectures",
              goals_pt: [
                "Compreender os fundamentos de Serverless e arquiteturas orientadas a eventos",
                "Aplicar Event Sourcing e CQRS em microsserviços e sistemas reativos",
                "Utilizar ferramentas de mensageria, streaming e integração em tempo real",
                "Planejar e implantar aplicações Serverless e Event-Driven em cloud-native",
                "Aplicar IA para otimização de recursos, análise de eventos e priorização dinâmica",
                "Projetar uma aplicação event-driven com IA como projeto prático",
              ],
              goals_en: [
                "Understand Serverless fundamentals and event-driven architectures",
                "Apply Event Sourcing and CQRS in microservices and reactive systems",
                "Use messaging, streaming and real-time integration tools",
                "Plan and deploy Serverless and Event-Driven applications in cloud-native",
                "Apply AI for resource optimization, event analysis and dynamic prioritization",
                "Design an AI-powered event-driven application as a hands-on project",
              ],
            },
            {
              id: 4,
              name_pt: "Engenharia de Plataforma com Backstage e Crossplane",
              name_en: "Platform Engineering with Backstage & Crossplane",
              goals_pt: [
                "Compreender a Engenharia de Plataforma e sua relação com DevOps e SRE",
                "Identificar necessidades de ferramentas para fluxos de trabalho de desenvolvimento",
                "Construir e gerenciar uma Internal Developer Platform (IDP) com Backstage e Crossplane",
                "Automatizar fluxos e gerenciar o ciclo de vida dos componentes da plataforma",
                "Aplicar IA para recomendação de ferramentas, detecção de gargalos e métricas operacionais",
                "Desenvolver uma IDP funcional como projeto prático",
              ],
              goals_en: [
                "Understand Platform Engineering and its relation to DevOps and SRE",
                "Identify tooling needs for development workflows",
                "Build and manage an Internal Developer Platform (IDP) with Backstage and Crossplane",
                "Automate workflows and manage the lifecycle of platform components",
                "Apply AI for tool recommendation, bottleneck detection and operational metrics",
                "Build a functional IDP as a hands-on project",
              ],
            },
            {
              id: 5,
              name_pt: "MLOps e DataOps: Orquestração e Automação",
              name_en: "MLOps & DataOps: Orchestration & Automation",
              goals_pt: [
                "Compreender os princípios de DataOps e MLOps na governança de dados e modelos",
                "Implementar pipelines automatizados de ingestão, transformação e entrega de dados",
                "Orquestrar o ciclo de vida de modelos com MLFlow, Kubeflow ou similares",
                "Monitorar e versionar modelos em produção com práticas de CI/CD",
                "Utilizar IA Generativa para geração de scripts, documentação e automação operacional",
                "Desenvolver soluções completas integrando dados, modelos e infraestrutura",
              ],
              goals_en: [
                "Understand DataOps and MLOps principles for data and model governance",
                "Implement automated pipelines for data ingestion, transformation and delivery",
                "Orchestrate the ML model lifecycle with MLFlow, Kubeflow or similar",
                "Monitor and version models in production with CI/CD practices",
                "Use Generative AI for scripts, documentation and operational automation",
                "Build complete solutions integrating data, models and infrastructure",
              ],
            },
          ],
        },
        {
          id: 3,
          title_pt: "Módulo 3 · Segurança, Monitoramento e Confiabilidade",
          title_en: "Module 3 · Security, Monitoring & Reliability",
          disciplines: [
            {
              id: 1,
              name_pt: "DevSecOps: Segurança Integrada e Scanning",
              name_en: "DevSecOps: Integrated Security & Scanning",
              goals_pt: [
                "Compreender os fundamentos de DevSecOps e aplicar o conceito de Security by Design",
                "Implementar práticas de segurança contínua no ciclo de desenvolvimento (SDLC)",
                "Integrar ferramentas como IAST, SAST, DAST e RASP em pipelines CI/CD",
                "Aplicar métricas, logs e tracing para observabilidade de segurança",
                "Utilizar IA para análise de vulnerabilidades e inteligência de ameaças",
                "Construir pipelines DevSecOps em ambientes cloud-native",
              ],
              goals_en: [
                "Understand DevSecOps fundamentals and apply Security by Design",
                "Implement continuous security across the SDLC",
                "Integrate IAST, SAST, DAST and RASP into CI/CD pipelines",
                "Apply metrics, logs and tracing for security observability",
                "Use AI for vulnerability analysis and threat intelligence",
                "Build DevSecOps pipelines in cloud-native environments",
              ],
            },
            {
              id: 2,
              name_pt: "Arquitetura de Cibersegurança e Zero Trust",
              name_en: "Cybersecurity Architecture & Zero Trust",
              goals_pt: [
                "Compreender os princípios da arquitetura de segurança e o modelo Zero Trust",
                "Aplicar estratégias de defesa em profundidade e segurança em camadas",
                "Projetar arquiteturas seguras em nuvem com base nos frameworks CAF e WAF",
                "Identificar e configurar soluções como NGFW, NIDPS, WAF, CASB e SASE",
                "Integrar ferramentas de IA na arquitetura de segurança para automação e análise",
                "Desenvolver projetos com estudos de caso em ambientes híbridos e cloud",
              ],
              goals_en: [
                "Understand security architecture principles and the Zero Trust model",
                "Apply defense-in-depth and layered security strategies",
                "Design secure cloud architectures based on the CAF and WAF frameworks",
                "Identify and configure NGFW, NIDPS, WAF, CASB and SASE solutions",
                "Integrate AI tools into security architecture for automation and analysis",
                "Develop case-study projects in hybrid and cloud environments",
              ],
            },
            {
              id: 3,
              name_pt: "Site Reliability Engineering (SRE) e Chaos Engineering",
              name_en: "Site Reliability Engineering (SRE) & Chaos Engineering",
              goals_pt: [
                "Compreender os princípios e práticas de SRE e sua integração com DevOps",
                "Definir e aplicar métricas de confiabilidade como SLIs, SLOs, SLAs e error budgets",
                "Identificar oportunidades de automação e eliminação de trabalho manual",
                "Gerenciar artefatos e o ciclo de vida operacional com foco em resiliência",
                "Aplicar Chaos Engineering para testar a robustez em ambientes simulados",
                "Utilizar IA para antecipação de falhas, classificação de alertas e ações corretivas",
                "Desenvolver uma solução prática de confiabilidade cloud-native como projeto final",
              ],
              goals_en: [
                "Understand SRE principles and practices and their integration with DevOps",
                "Define and apply reliability metrics such as SLIs, SLOs, SLAs and error budgets",
                "Identify automation opportunities and eliminate manual toil",
                "Manage artifacts and the operational lifecycle with a focus on resilience",
                "Apply Chaos Engineering to test system robustness in simulated environments",
                "Use AI for failure anticipation, alert classification and corrective actions",
                "Build a hands-on cloud-native reliability solution as the final project",
              ],
            },
            {
              id: 4,
              name_pt: "Monitoramento e Observabilidade",
              name_en: "Monitoring & Observability",
              goals_pt: [
                "Diferenciar os conceitos de monitoramento e observabilidade e seus pilares fundamentais",
                "Projetar arquiteturas observáveis em cloud-native e microsserviços",
                "Utilizar OpenTelemetry, Observability Stacks e pipelines de observabilidade",
                "Integrar SRE e estratégias de SLO/Error Budgeting na gestão de confiabilidade",
                "Aplicar logs, métricas e tracing para alertas, dashboards e relatórios de performance",
                "Utilizar IA para predição de falhas, análise de anomalias e resposta autônoma",
              ],
              goals_en: [
                "Differentiate monitoring and observability and apply their core pillars",
                "Design observable architectures in cloud-native and microservices environments",
                "Use OpenTelemetry, Observability Stacks and observability pipelines",
                "Integrate SRE and SLO/Error Budgeting strategies into reliability management",
                "Apply logs, metrics and tracing for alerts, dashboards and performance reports",
                "Use AI for failure prediction, anomaly analysis and autonomous response",
              ],
            },
          ],
        },
        {
          id: 4,
          title_pt: "Módulo 4 · IA, FinOps e Projeto Prático",
          title_en: "Module 4 · AI, FinOps & Capstone Project",
          disciplines: [
            {
              id: 1,
              name_pt: "AIOps: IA para Automação e Observabilidade",
              name_en: "AIOps: AI for Automation & Observability",
              goals_pt: [
                "Compreender os fundamentos de AIOps e seu papel na modernização das operações de TI",
                "Aplicar IA para automação inteligente, detecção de anomalias e resposta autônoma a incidentes",
                "Utilizar ferramentas como Prometheus, Grafana, ELK Stack, OpenTelemetry e Dynatrace",
                "Implementar coleta, enriquecimento e análise de dados operacionais em tempo real",
                "Desenvolver modelos de automação com IA para escalonamento e otimização de recursos",
                "Integrar AIOps com práticas de SRE, DevSecOps e FinOps em soluções cloud-native",
              ],
              goals_en: [
                "Understand AIOps fundamentals and its role in modernizing IT operations",
                "Apply AI for intelligent automation, anomaly detection and autonomous incident response",
                "Use tools such as Prometheus, Grafana, ELK Stack, OpenTelemetry and Dynatrace",
                "Implement collection, enrichment and analysis of operational data in real time",
                "Build AI automation models for scaling and resource optimization",
                "Integrate AIOps with SRE, DevSecOps and FinOps practices in cloud-native solutions",
              ],
            },
            {
              id: 2,
              name_pt: "FinOps e Cloud Economics",
              name_en: "FinOps & Cloud Economics",
              goals_pt: [
                "Compreender os fundamentos de FinOps e os modelos de precificação em nuvem aplicados a IA (pay-as-you-go, reserved, spot e serverless)",
                "Implementar estratégias de gestão de custos por projeto, serviço e unidade de negócio com accountability",
                "Utilizar automação, observabilidade e monitoramento para controle de gastos e alertas orçamentários",
                "Aplicar IA para análise de consumo, otimização de recursos, detecção de anomalias e recomendações financeiras",
                "Desenvolver planos de otimização financeira com base em KPIs e práticas de Cloud Economics",
              ],
              goals_en: [
                "Understand FinOps fundamentals and cloud pricing models applied to AI (pay-as-you-go, reserved, spot and serverless)",
                "Implement cost management strategies per project, service and business unit with accountability",
                "Use automation, observability and monitoring for spend control and budget alerts",
                "Apply AI for consumption analysis, resource optimization, anomaly detection and financial recommendations",
                "Develop financial optimization plans based on KPIs and Cloud Economics practices",
              ],
            },
            {
              id: 3,
              name_pt: "Projeto Prático: Plataforma de Entrega Contínua com IA",
              name_en: "Capstone: AI-Powered Continuous Delivery Platform",
              goals_pt: [
                "Planejar e arquitetar uma plataforma de entrega contínua moderna em ambiente cloud-native",
                "Implementar pipelines CI/CD com versionamento, build, testes automatizados e deploy",
                "Integrar automação de infraestrutura e observabilidade distribuída na plataforma",
                "Aplicar conceitos de SRE para garantir resiliência e desempenho",
                "Incorporar práticas de DevSecOps e FinOps na gestão da plataforma",
                "Apresentar os resultados do projeto",
              ],
              goals_en: [
                "Plan and architect a modern continuous delivery platform in a cloud-native environment",
                "Implement CI/CD pipelines with versioning, build, automated tests and deploy",
                "Integrate infrastructure automation and distributed observability into the platform",
                "Apply SRE concepts to ensure resilience and performance",
                "Incorporate DevSecOps and FinOps practices into platform management",
                "Present the project results",
              ],
            },
            {
              id: 4,
              name_pt: "Humanidades (disciplina bônus)",
              name_en: "Humanities (bonus course)",
              goals_pt: [
                "Refletir sobre o papel da ética e da espiritualidade no contexto científico e tecnológico",
                "Avaliar os impactos sociais e humanistas do uso de dados e tecnologia",
                "Desenvolver uma ética profissional sólida em ambientes de trabalho colaborativos e tecnológicos",
              ],
              goals_en: [
                "Reflect on the role of ethics and spirituality in the scientific and technological context",
                "Assess the social and humanistic impacts of using data and technology",
                "Develop solid professional ethics in collaborative and technological work environments",
              ],
            },
          ],
        },
      ],
    },
  ],
};
 
// ─── i18n (static UI labels) ──────────────────────────────────────────────────
const i18n = {
  pt: {
    nav: {
      sobre: "Sobre", stack: "Stack", projetos: "Projetos",
      servicos: "Serviços", experiencia: "Experiência", formacao: "Formação", contato: "Contato",
    },
    navIds: {
      sobre: "sobre", stack: "stack", projetos: "projetos",
      servicos: "servicos", experiencia: "experiencia", formacao: "formacao", contato: "contato",
    },
    hero: {
      badge: "Disponível para projetos",
      h1a: "Construo produtos", h1b: "web & mobile", h1c: "que entregam resultado.",
      talk: "Fale comigo", cv: "Baixar CV",
      years: "anos de exp.", projects: "projetos",
    },
    about: { title: "Sobre mim" },
    stack: {
      title: "Stack Tecnológica", desc: "Ferramentas que uso no dia a dia.",
      frontend: "Frontend", backend: "Backend", database: "Database",
      devops: "DevOps / Cloud", ai: "Automação / IA",
    },
    services: { title: "Como posso ajudar", desc: "Do design do fluxo de dados ao deploy." },
    projects: {
      title: "Projetos em destaque",
      desc: "Cases que mostram como penso produto e engenharia.",
      cta: "Precisa de algo parecido?", view: "Ver", code: "Código",
    },
    exp: { title: "Experiência" },
    edu: {
      kicker: "Formação",
      title: "Formação acadêmica",
      desc: "Especialização contínua em DevOps, Cloud-Native e IA.",
      aiBadge: "IA integrada em todas as disciplinas",
    },
    cta: {
      title: "Tem um projeto em mente?",
      desc: "Bora tirar do papel com qualidade de engenharia e foco em negócio.",
      start: "Começar agora",
    },
    contact: {
      title: "Vamos conversar",
      desc: "Me chama e eu respondo rápido. Se preferir, descreva a ideia e mando uma proposta objetiva.",
      name: "Nome", email: "Email", message: "Mensagem",
      placeholderName: "Seu nome", placeholderEmail: "voce@email.com",
      placeholderMsg: "Conte rapidamente sua ideia, objetivo e prazo.",
      send: "Enviar mensagem",
    },
    footer: { rights: "Todos os direitos reservados.", home: "Início" },
    langPrompt: { title: "Escolha seu idioma", pt: "Português", en: "English" },
    cvHref: "/Samuel-CV-PT.pdf",
  },
  en: {
    nav: {
      sobre: "About", stack: "Stack", projetos: "Projects",
      servicos: "Services", experiencia: "Experience", formacao: "Education", contato: "Contact",
    },
    navIds: {
      sobre: "sobre", stack: "stack", projetos: "projetos",
      servicos: "servicos", experiencia: "experiencia", formacao: "formacao", contato: "contato",
    },
    hero: {
      badge: "Available for projects",
      h1a: "I build", h1b: "web & mobile", h1c: "products that deliver results.",
      talk: "Let's talk", cv: "Download CV",
      years: "years of exp.", projects: "projects",
    },
    about: { title: "About me" },
    stack: {
      title: "Tech Stack", desc: "Tools I use every day.",
      frontend: "Frontend", backend: "Backend", database: "Database",
      devops: "DevOps / Cloud", ai: "Automation / AI",
    },
    services: { title: "How I can help", desc: "From data-flow design to production deploys." },
    projects: {
      title: "Featured Projects",
      desc: "Cases that show my product + engineering mindset.",
      cta: "Need something similar?", view: "View", code: "Code",
    },
    exp: { title: "Experience" },
    edu: {
      kicker: "Education",
      title: "Academic background",
      desc: "Continuous specialization in DevOps, Cloud-Native and AI.",
      aiBadge: "AI integrated across every course",
    },
    cta: {
      title: "Got a project in mind?",
      desc: "Let's ship it with solid engineering and business focus.",
      start: "Start now",
    },
    contact: {
      title: "Let's talk",
      desc: "Ping me and I'll reply fast. Or describe your idea and I'll send a concise proposal.",
      name: "Name", email: "Email", message: "Message",
      placeholderName: "Your name", placeholderEmail: "you@email.com",
      placeholderMsg: "Tell me about your idea, goal and timeline.",
      send: "Send message",
    },
    footer: { rights: "All rights reserved.", home: "Home" },
    langPrompt: { title: "Choose your language", pt: "Português", en: "English" },
    cvHref: "/Samuel-CV-EN.pdf",
  },
};
 
// ─── animation presets ────────────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55 },
};
const fadeUpD = (d) => ({ ...fadeUp, transition: { duration: 0.55, delay: d } });
 
// ─── section wrapper ──────────────────────────────────────────────────────────
const Sec = ({ id, children, className = "" }) => (
  <section
    id={id}
    className={`max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
  >
    {children}
  </section>
);
 
// ─── category meta ────────────────────────────────────────────────────────────
const CAT = {
  frontend: { color: "text-sky-500 dark:text-sky-400",   bg: "bg-sky-500/10 border-sky-500/25 hover:bg-sky-500/15",    dot: "bg-sky-400"     },
  backend:  { color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/25 hover:bg-emerald-500/15", dot: "bg-emerald-400" },
  database: { color: "text-amber-500 dark:text-amber-400",  bg: "bg-amber-500/10 border-amber-500/25 hover:bg-amber-500/15",   dot: "bg-amber-400"   },
  devops:   { color: "text-violet-500 dark:text-violet-400", bg: "bg-violet-500/10 border-violet-500/25 hover:bg-violet-500/15", dot: "bg-violet-400"  },
  ai:       { color: "text-pink-500 dark:text-pink-400",   bg: "bg-pink-500/10 border-pink-500/25 hover:bg-pink-500/15",     dot: "bg-pink-400"    },
};
 
// ─── service icon map ─────────────────────────────────────────────────────────
const SICONS = { laptop: Laptop, server: Server, database: Database, rocket: Rocket, cpu: Cpu, sparkles: Sparkles };
const SIcon = ({ icon, className }) => {
  const I = SICONS[icon] || Sparkles;
  return <I className={className} />;
};
 
// ──────────────────────────────────────────────────────────────────────────────
// NAV
// ──────────────────────────────────────────────────────────────────────────────
function Nav({ lang, t, theme, onThemeToggle, onLangGate, personal }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
 
  const navItems = Object.entries(t.nav).map(([key, label]) => ({
    href: `#${t.navIds[key]}`,
    label,
  }));
 
  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-white/80 dark:bg-neutral-950/80 border-b border-neutral-200/60 dark:border-neutral-800/60 shadow-sm"
          : ""
      }`}
    >
      <Sec className="flex items-center justify-between py-4">
        {/* Logo */}
        <a
          href="#home"
          className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 transition"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="hidden sm:block text-sm tracking-tight">Samuel Fonseca</span>
        </a>
 
        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navItems.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-lg text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition"
            >
              {label}
            </a>
          ))}
        </nav>
 
        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={onLangGate}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition"
          >
            <Globe className="w-4 h-4" />
            {lang.toUpperCase()}
          </button>
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </Sec>
    </header>
  );
}
 
// ──────────────────────────────────────────────────────────────────────────────
// HERO
// ──────────────────────────────────────────────────────────────────────────────
function Hero({ lang, t, personal }) {
  return (
    <Sec id="home" className="pt-16 pb-20">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left */}
        <motion.div {...fadeUp}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t.hero.badge}
          </div>
 
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-neutral-900 dark:text-white">
            {t.hero.h1a}{" "}
            <span className="text-gradient">{t.hero.h1b}</span>
            <br />
            {t.hero.h1c}
          </h1>
 
          <p className="mt-5 text-base text-neutral-500 dark:text-neutral-400 max-w-lg leading-relaxed">
            {lang === "pt" ? personal.bio_pt : personal.bio_en}
          </p>
 
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#contato"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
            >
              {t.hero.talk} <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={t.cvHref}
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium transition border border-neutral-200 dark:border-neutral-700 hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" /> {t.hero.cv}
            </a>
          </div>
 
          {/* Stats */}
          <div className="mt-8 flex items-center gap-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">{personal.stats_years}</div>
              <div className="text-xs text-neutral-400 mt-0.5">{t.hero.years}</div>
            </div>
            <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-800" />
            <div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">{personal.stats_projects}</div>
              <div className="text-xs text-neutral-400 mt-0.5">{t.hero.projects}</div>
            </div>
            <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-800" />
            <div className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              {personal.location}
            </div>
          </div>
        </motion.div>
 
        {/* Right — terminal card */}
        <motion.div {...fadeUpD(0.15)} className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/15 via-sky-500/8 to-violet-500/15 blur-3xl rounded-[40px]" />
          <div className="relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden">
            {/* Terminal bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-neutral-100 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700/60">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="ml-2 text-xs text-neutral-400 font-mono">portfolio.ts</span>
            </div>
            {/* Code */}
            <div className="p-6 font-mono text-sm leading-relaxed select-none">
              <div>
                <span className="text-violet-400 dark:text-violet-400">const</span>{" "}
                <span className="text-sky-500 dark:text-sky-400">dev</span>{" "}
                <span className="text-neutral-500">=</span>{" "}
                <span className="text-amber-500">{"{"}</span>
              </div>
              <div className="pl-5 space-y-1 my-1">
                <div>
                  <span className="text-sky-500 dark:text-sky-300">name</span>
                  <span className="text-neutral-400">: </span>
                  <span className="text-emerald-500 dark:text-emerald-300">"{personal.name}"</span>
                  <span className="text-neutral-500">,</span>
                </div>
                <div>
                  <span className="text-sky-500 dark:text-sky-300">role</span>
                  <span className="text-neutral-400">: </span>
                  <span className="text-emerald-500 dark:text-emerald-300">
                    "{lang === "pt" ? personal.role_pt : personal.role_en}"
                  </span>
                  <span className="text-neutral-500">,</span>
                </div>
                <div>
                  <span className="text-sky-500 dark:text-sky-300">stack</span>
                  <span className="text-neutral-400">: </span>
                  <span className="text-amber-500">["</span>
                  <span className="text-emerald-500 dark:text-emerald-300">React</span>
                  <span className="text-amber-500">", "</span>
                  <span className="text-emerald-500 dark:text-emerald-300">Node</span>
                  <span className="text-amber-500">", "</span>
                  <span className="text-emerald-500 dark:text-emerald-300">Python</span>
                  <span className="text-amber-500">"]</span>
                  <span className="text-neutral-500">,</span>
                </div>
                <div>
                  <span className="text-sky-500 dark:text-sky-300">location</span>
                  <span className="text-neutral-400">: </span>
                  <span className="text-emerald-500 dark:text-emerald-300">"{personal.location}"</span>
                  <span className="text-neutral-500">,</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sky-500 dark:text-sky-300">available</span>
                  <span className="text-neutral-400">: </span>
                  <span className="text-emerald-500">true</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
              <div><span className="text-amber-500">{"}"}</span></div>
              <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex gap-4 text-xs text-neutral-400">
                <span><span className="text-emerald-400">✓</span> TypeScript</span>
                <span><span className="text-emerald-400">✓</span> CI/CD</span>
                <span><span className="text-emerald-400">✓</span> Remote</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Sec>
  );
}
 
// ──────────────────────────────────────────────────────────────────────────────
// ABOUT
// ──────────────────────────────────────────────────────────────────────────────
function About({ lang, t, personal }) {
  return (
    <Sec id="sobre" className="py-16">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <motion.div {...fadeUp}>
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">
            {t.about.title}
          </span>
          <h2 className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">
            {lang === "pt" ? personal.role_pt : personal.role_en}
          </h2>
          <p className="mt-4 text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {lang === "pt" ? personal.about_pt : personal.about_en}
          </p>
          <div className="mt-6 space-y-2.5">
            <a
              href={`mailto:${personal.email}`}
              className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition group w-fit"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-emerald-500/10 transition">
                <Mail className="w-3.5 h-3.5" />
              </div>
              {personal.email}
            </a>
            <a
              href={`tel:${personal.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition group w-fit"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-emerald-500/10 transition">
                <Phone className="w-3.5 h-3.5" />
              </div>
              {personal.phone}
            </a>
          </div>
        </motion.div>
 
        <motion.div {...fadeUpD(0.12)}>
          <ul className="grid sm:grid-cols-2 gap-2">
            {(lang === "pt" ? personal.highlights_pt : personal.highlights_en).map((h, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60 text-sm text-neutral-700 dark:text-neutral-300 hover:border-emerald-500/30 transition"
              >
                <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </Sec>
  );
}
 
// ──────────────────────────────────────────────────────────────────────────────
// STACK
// ──────────────────────────────────────────────────────────────────────────────
function Stack({ lang, t, tech }) {
  const cats = ["frontend", "backend", "database", "devops", "ai"];
  const labels = {
    frontend: t.stack.frontend, backend: t.stack.backend,
    database: t.stack.database, devops: t.stack.devops, ai: t.stack.ai,
  };
 
  return (
    <Sec id="stack" className="py-16">
      <motion.div {...fadeUp} className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">Stack</span>
        <h2 className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">{t.stack.title}</h2>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">{t.stack.desc}</p>
      </motion.div>
 
      <div className="space-y-6">
        {cats.map((cat, i) => {
          const items = tech.filter((ti) => ti.category === cat);
          if (!items.length) return null;
          const meta = CAT[cat];
          return (
            <motion.div key={cat} {...fadeUpD(i * 0.07)}>
              <div className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-3 ${meta.color}`}>
                <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                {labels[cat]}
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((ti) => (
                  <span
                    key={ti.id}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition hover:-translate-y-0.5 cursor-default ${meta.bg} ${meta.color}`}
                  >
                    {ti.name}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Sec>
  );
}
 
// ──────────────────────────────────────────────────────────────────────────────
// SERVICES
// ──────────────────────────────────────────────────────────────────────────────
function Services({ lang, t, services }) {
  return (
    <Sec id="servicos" className="py-16">
      <motion.div {...fadeUp} className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">Serviços</span>
        <h2 className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">{t.services.title}</h2>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">{t.services.desc}</p>
      </motion.div>
 
      <div className="grid md:grid-cols-3 gap-5">
        {services.map((s, i) => (
          <motion.div
            key={s.id}
            {...fadeUpD(i * 0.08)}
            className="group p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition">
              <SIcon icon={s.icon} className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
              {lang === "pt" ? s.title_pt : s.title_en}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {lang === "pt" ? s.desc_pt : s.desc_en}
            </p>
          </motion.div>
        ))}
      </div>
    </Sec>
  );
}
 
// ──────────────────────────────────────────────────────────────────────────────
// PROJECTS
// ──────────────────────────────────────────────────────────────────────────────
function Projects({ lang, t, projects }) {
  return (
    <Sec id="projetos" className="py-16">
      <motion.div {...fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">Projetos</span>
          <h2 className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">{t.projects.title}</h2>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">{t.projects.desc}</p>
        </div>
        <a
          href="#contato"
          className="hidden sm:inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition flex-shrink-0"
        >
          {t.projects.cta} <MoveRight className="w-4 h-4" />
        </a>
      </motion.div>
 
      <div className="grid md:grid-cols-3 gap-5">
        {projects.map((p, i) => (
          <motion.div
            key={p.id}
            {...fadeUpD(i * 0.08)}
            className="group flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 overflow-hidden hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-200/60 dark:hover:shadow-emerald-500/5 transition-all duration-300"
          >
            {/* Gradient top stripe */}
            <div
              className="h-1.5 w-full"
              style={{
                background: `linear-gradient(90deg, hsl(${160 + i * 30},80%,50%), hsl(${200 + i * 30},80%,55%))`,
              }}
            />
            <div className="flex-1 p-6">
              <div className="text-xs font-medium text-neutral-400 mb-1">
                {lang === "pt" ? p.tag_pt : p.tag_en}
              </div>
              <h3 className="font-bold text-neutral-900 dark:text-white text-lg leading-snug mb-2">
                {lang === "pt" ? p.title_pt : p.title_en}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
                {lang === "pt" ? p.blurb_pt : p.blurb_en}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(lang === "pt" ? p.bullets_pt : p.bullets_en).map((b) => (
                  <span
                    key={b}
                    className="px-2.5 py-1 rounded-lg text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <div className="px-6 pb-5 pt-4 flex gap-4 border-t border-neutral-100 dark:border-neutral-800/60">
              <a
                href={p.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" /> {t.projects.view}
              </a>
              <a
                href={p.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
              >
                <Github className="w-3.5 h-3.5" /> {t.projects.code}
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </Sec>
  );
}
 
// ──────────────────────────────────────────────────────────────────────────────
// EXPERIENCE — vertical timeline
// ──────────────────────────────────────────────────────────────────────────────
function Experience({ lang, t, experiences }) {
  const [open, setOpen] = useState(() => new Set([experiences[0]?.id]));

  // Quando o Supabase carrega e troca o array, garante que o primeiro fica aberto
  useEffect(() => {
    if (experiences[0]?.id) {
      setOpen((s) => {
        // só força se nenhum estiver aberto (evita fechar o que o usuário abriu)
        if (s.size === 0) return new Set([experiences[0].id]);
        // se o ID do primeiro mudou (Supabase carregou), atualiza
        const firstId = experiences[0].id;
        if (!s.has(firstId)) return new Set([firstId]);
        return s;
      });
    }
  }, [experiences[0]?.id]);

  const toggle = (id) =>
    setOpen((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
 
  return (
    <Sec id="experiencia" className="py-16">
      <motion.div {...fadeUp} className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">
          Timeline
        </span>
        <h2 className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">{t.exp.title}</h2>
      </motion.div>
 
      <div className="relative pl-6">
        {/* Vertical line */}
        <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-emerald-500/60 via-emerald-500/20 to-transparent" />
 
        <div className="space-y-3">
          {experiences.map((exp, i) => (
            <motion.div key={exp.id} {...fadeUpD(i * 0.05)} className="relative">
              {/* Timeline dot — maior e com glow no primeiro */}
              <div className={`absolute top-[18px] rounded-full border-2 border-emerald-500 bg-white dark:bg-neutral-900 transition-all ${
                i === 0 ? "-left-[27px] w-4 h-4 shadow-[0_0_8px_2px] shadow-emerald-500/40" : "-left-[25px] w-3 h-3"
              }`} />
 
              <div
                className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                  i === 0
                    ? "border-emerald-500/40 dark:border-emerald-500/30 bg-white dark:bg-neutral-900/80 shadow-sm shadow-emerald-500/10"
                    : open.has(exp.id)
                      ? "border-emerald-500/25 dark:border-emerald-500/20 bg-white dark:bg-neutral-900/80"
                      : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50"
                }`}
              >
                <button
                  onClick={() => toggle(exp.id)}
                  className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-emerald-500 dark:text-emerald-400">
                        {lang === "pt" ? exp.when_pt : exp.when_en}
                      </span>
                      {i === 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {lang === "pt" ? "Atual" : "Current"}
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-neutral-900 dark:text-white">
                      {lang === "pt" ? exp.role_pt : exp.role_en}
                    </div>
                    <div className="text-sm text-neutral-400 mt-0.5 truncate">{exp.org}</div>
                  </div>
                  <div className="flex-shrink-0 mt-1 text-neutral-400">
                    {open.has(exp.id) ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>
 
                <AnimatePresence initial={false}>
                  {open.has(exp.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <ul className="px-5 pb-5 grid sm:grid-cols-2 gap-1.5 border-t border-neutral-100 dark:border-neutral-800/60 pt-4">
                        {(lang === "pt" ? exp.points_pt : exp.points_en).map((pt, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                            <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Sec>
  );
}
 
// ──────────────────────────────────────────────────────────────────────────────
// EDUCATION
// ──────────────────────────────────────────────────────────────────────────────
function DisciplineItem({ lang, discipline }) {
  const [open, setOpen] = useState(false);
  const goals = lang === "pt" ? discipline.goals_pt : discipline.goals_en;

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition"
      >
        <span className="flex items-start gap-2.5 min-w-0">
          <BookOpen className="w-4 h-4 mt-0.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 leading-snug">
            {lang === "pt" ? discipline.name_pt : discipline.name_en}
          </span>
        </span>
        <span className="flex-shrink-0 mt-0.5 text-neutral-400">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <ul className="px-4 pb-4 pt-1 space-y-1.5 border-t border-neutral-100 dark:border-neutral-800/60">
              {goals.map((g, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed"
                >
                  <span className="w-1 h-1 mt-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  {g}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Education({ lang, t, education }) {
  if (!education?.length) return null;

  return (
    <Sec id="formacao" className="py-16">
      <motion.div {...fadeUp} className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">
          {t.edu.kicker}
        </span>
        <h2 className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">{t.edu.title}</h2>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">{t.edu.desc}</p>
      </motion.div>

      <div className="space-y-6">
        {education.map((ed, i) => (
          <motion.div
            key={ed.id}
            {...fadeUpD(i * 0.08)}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-emerald-500 dark:text-emerald-400">
                      {lang === "pt" ? ed.when_pt : ed.when_en}
                    </span>
                    <span className="text-xs text-neutral-400">· {ed.org}</span>
                  </div>
                  <h3 className="font-bold text-neutral-900 dark:text-white text-lg leading-snug">
                    {lang === "pt" ? ed.degree_pt : ed.degree_en}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-pink-500/10 text-pink-500 dark:text-pink-400 border border-pink-500/20">
                    <Brain className="w-3 h-3" />
                    {t.edu.aiBadge}
                  </span>
                  <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {lang === "pt" ? ed.summary_pt : ed.summary_en}
                  </p>
                </div>
              </div>

              {/* Modules → disciplines (expansíveis) */}
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                {(ed.modules || []).map((m) => (
                  <div
                    key={m.id}
                    className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/30 p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                      <span className="text-sm font-bold text-neutral-900 dark:text-white leading-snug">
                        {lang === "pt" ? m.title_pt : m.title_en}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {(m.disciplines || []).map((d) => (
                        <DisciplineItem key={d.id} lang={lang} discipline={d} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Sec>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// CTA BANNER
// ──────────────────────────────────────────────────────────────────────────────
function CTA({ lang, t, personal }) {
  return (
    <Sec className="py-16">
      <motion.div
        {...fadeUp}
        className="relative overflow-hidden rounded-3xl border border-emerald-500/20 dark:border-emerald-500/15 p-8 md:p-12 text-center"
        style={{
          background:
            "linear-gradient(135deg,rgba(16,185,129,.06) 0%,rgba(14,165,233,.04) 50%,rgba(139,92,246,.06) 100%)",
        }}
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">{t.cta.title}</h3>
          <p className="mt-3 text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">{t.cta.desc}</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <a
              href="#contato"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5"
            >
              {t.cta.start} <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-medium text-sm transition border border-neutral-200 dark:border-neutral-700 hover:-translate-y-0.5"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          </div>
        </div>
      </motion.div>
    </Sec>
  );
}
 
// ──────────────────────────────────────────────────────────────────────────────
// CONTACT
// ──────────────────────────────────────────────────────────────────────────────
function Contact({ lang, t, personal }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const s = (k, v) => setForm((f) => ({ ...f, [k]: v }));
 
  const submit = (e) => {
    e.preventDefault();
    const sub = `Portfolio contact — ${form.name}`;
    window.location.href = `mailto:${personal.email}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(form.message)}`;
  };
 
  const inputCls =
    "w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition";
 
  return (
    <Sec id="contato" className="py-16">
      <div className="grid lg:grid-cols-2 gap-12">
        <motion.div {...fadeUp}>
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">
            Contato
          </span>
          <h2 className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">{t.contact.title}</h2>
          <p className="mt-3 text-neutral-500 dark:text-neutral-400 leading-relaxed">{t.contact.desc}</p>
 
          <div className="mt-8 space-y-3">
            {[
              { href: `mailto:${personal.email}`, Icon: Mail, label: personal.email },
              { href: personal.linkedin, Icon: Linkedin, label: "/in/samuel-fonseca-0289a6121", external: true },
              { href: personal.github, Icon: Github, label: "/samuelbatista3rios", external: true },
            ].map(({ href, Icon, label, external }) => (
              <a
                key={href}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition group w-fit"
              >
                <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-emerald-500/10 transition flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                {label}
              </a>
            ))}
          </div>
        </motion.div>
 
        <motion.div {...fadeUpD(0.12)}>
          <form
            onSubmit={submit}
            className="space-y-4 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60"
          >
            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
                {t.contact.name}
              </label>
              <input
                value={form.name}
                onChange={(e) => s("name", e.target.value)}
                placeholder={t.contact.placeholderName}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
                {t.contact.email}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => s("email", e.target.value)}
                placeholder={t.contact.placeholderEmail}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
                {t.contact.message}
              </label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => s("message", e.target.value)}
                placeholder={t.contact.placeholderMsg}
                className={inputCls + " resize-none"}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              {t.contact.send} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </Sec>
  );
}
 
// ──────────────────────────────────────────────────────────────────────────────
// FOOTER  (triple-click unlocks admin)
// ──────────────────────────────────────────────────────────────────────────────
function Footer({ lang, t, onAdminTrigger }) {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-8">
      <Sec className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-neutral-400">
        <button
          onClick={onAdminTrigger}
          className="hover:text-neutral-500 dark:hover:text-neutral-300 transition select-none cursor-default"
          tabIndex={-1}
          aria-hidden="true"
        >
          © {new Date().getFullYear()} Samuel Fonseca. {t.footer.rights}
        </button>
        <nav className="flex items-center gap-4">
          {[
            { href: "#home", label: t.footer.home },
            { href: "#sobre", label: t.nav.sobre },
            { href: "#projetos", label: t.nav.projetos },
            { href: "#contato", label: t.nav.contato },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="hover:text-neutral-700 dark:hover:text-neutral-200 transition"
            >
              {label}
            </a>
          ))}
        </nav>
      </Sec>
    </footer>
  );
}
 
// ──────────────────────────────────────────────────────────────────────────────
// LANGUAGE GATE
// ──────────────────────────────────────────────────────────────────────────────
function LangGate({ onChoose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] grid place-items-center"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(14px)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.2 }}
        className="w-[92vw] max-w-sm bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-8 text-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
          <Globe className="w-6 h-6 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
          Escolha seu idioma
        </h2>
        <p className="text-sm text-neutral-500 mb-6">Choose your language</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onChoose("pt")}
            className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition shadow-lg shadow-emerald-500/20"
          >
            🇧🇷 Português
          </button>
          <button
            onClick={() => onChoose("en")}
            className="py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-medium text-sm transition border border-neutral-200 dark:border-neutral-700"
          >
            🇺🇸 English
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
 
// ──────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ──────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang]             = useState("pt");
  const [theme, setTheme]           = useState("dark");
  const [showLangGate, setShowLang] = useState(false);
  const [showAdmin, setShowAdmin]   = useState(false);
  const [data, setData]             = useState(DEFAULT_DATA);
 
  const clickRef  = useRef(0);
  const timerRef  = useRef(null);
 
  // ── bootstrap ──────────────────────────────────────────────────────────────
  useEffect(() => {
    // language
    const savedLang = localStorage.getItem(LANG_KEY);
    if (savedLang === "pt" || savedLang === "en") {
      setLang(savedLang);
    } else {
      setShowLang(true);
    }
    // theme
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
    // data — Supabase first, fallback to localStorage
    (async () => {
      const remoteData = await loadPortfolioData();
      if (remoteData && remoteData.personal) {
        setData(remoteData);
        localStorage.setItem(DATA_KEY, JSON.stringify(remoteData));
      } else {
        try {
          const saved = localStorage.getItem(DATA_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.personal) setData(parsed);
          }
        } catch {}
      }
    })();
    // ?admin URL param
    if (window.location.search.includes("admin")) setShowAdmin(true);
  }, []);
 
  // ── apply dark class ────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);
 
  // ── handlers ────────────────────────────────────────────────────────────────
  const chooseLang = useCallback((l) => {
    setLang(l);
    setShowLang(false);
    localStorage.setItem(LANG_KEY, l);
  }, []);
 
  const toggleTheme = useCallback(
    () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
    []
  );
 
  const handleFooterClick = useCallback(() => {
    clickRef.current += 1;
    clearTimeout(timerRef.current);
    if (clickRef.current >= 3) {
      clickRef.current = 0;
      setShowAdmin(true);
    } else {
      timerRef.current = setTimeout(() => { clickRef.current = 0; }, 1500);
    }
  }, []);
 
  const saveData = useCallback(async (newData) => {
    setData(newData);
    localStorage.setItem(DATA_KEY, JSON.stringify(newData));
    await savePortfolioData(newData);
  }, []);

  const handleHashChange = useCallback(async (newHash) => {
    const newData = { ...data, __adminHash: newHash };
    setData(newData);
    localStorage.setItem(DATA_KEY, JSON.stringify(newData));
    await savePortfolioData(newData);
  }, [data]);
 
  const t = i18n[lang];

  // Garante que subcomponentes nunca recebem undefined
  const safeData = {
    personal:    data.personal    ?? DEFAULT_DATA.personal,
    tech:        data.tech        ?? DEFAULT_DATA.tech,
    services:    data.services    ?? DEFAULT_DATA.services,
    projects:    data.projects    ?? DEFAULT_DATA.projects,
    experiences: data.experiences ?? DEFAULT_DATA.experiences,
    education:   data.education   ?? DEFAULT_DATA.education,
  };

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-[#030303] text-neutral-900 dark:text-neutral-100 antialiased transition-colors duration-300">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-48 -left-48 w-[700px] h-[700px] bg-emerald-500/5 dark:bg-emerald-500/4 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-48 w-[600px] h-[600px] bg-violet-500/5 dark:bg-violet-500/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-sky-500/4 dark:bg-sky-500/3 rounded-full blur-[100px]" />
      </div>
 
      <div className="relative z-10">
        {/* Overlays */}
        <AnimatePresence>{showLangGate && <LangGate onChoose={chooseLang} />}</AnimatePresence>
        <AnimatePresence>
          {showAdmin && (
            <AdminPanel
              data={data}
              defaultData={DEFAULT_DATA}
              onSave={saveData}
              onClose={() => setShowAdmin(false)}
              adminHash={data.__adminHash}
              onHashChange={handleHashChange}
            />
          )}
        </AnimatePresence>
 
        {/* Layout */}
        <Nav
          lang={lang}
          t={t}
          theme={theme}
          onThemeToggle={toggleTheme}
          onLangGate={() => setShowLang(true)}
          personal={safeData.personal}
        />
 
        <main>
          <Hero        lang={lang} t={t} personal={safeData.personal} />
          <About       lang={lang} t={t} personal={safeData.personal} />
          <Stack       lang={lang} t={t} tech={safeData.tech} />
          <Services    lang={lang} t={t} services={safeData.services} />
          <Projects    lang={lang} t={t} projects={safeData.projects} />
          <Experience  lang={lang} t={t} experiences={safeData.experiences} />
          <Education   lang={lang} t={t} education={safeData.education} />
          <CTA         lang={lang} t={t} personal={safeData.personal} />
          <Contact     lang={lang} t={t} personal={safeData.personal} />
        </main>
 
        <Footer lang={lang} t={t} onAdminTrigger={handleFooterClick} />
      </div>
    </div>
  );
}