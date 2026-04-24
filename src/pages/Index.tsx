import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/8fbdf227-6035-4a92-b027-59557fc75d15/files/0c6dc6d4-36aa-4a19-8832-e2adee5b7944.jpg";

const PRODUCTS = [
  {
    icon: "Package",
    name: "Стрейч плёнка ручная",
    desc: "Ширина 450–500 мм, толщина 17–23 мкм. Оптимальна для ручной упаковки паллет на малых объёмах.",
    params: ["Ширина: 450–500 мм", "Толщина: 17–23 мкм", "Длина: 150–300 м"],
  },
  {
    icon: "Layers",
    name: "Стрейч плёнка машинная",
    desc: "Ширина 500 мм, толщина 17–35 мкм. Для автоматических и полуавтоматических паллетоупаковщиков.",
    params: ["Ширина: 500 мм", "Толщина: 17–35 мкм", "Длина: 1500–3000 м"],
  },
  {
    icon: "Zap",
    name: "Плёнка ПВД/ПНД",
    desc: "Полиэтиленовые пакеты и плёнка высокого и низкого давления для промышленной и строительной упаковки.",
    params: ["Толщина: 30–200 мкм", "Любые размеры", "Различные цвета"],
  },
  {
    icon: "Shield",
    name: "Армированная плёнка",
    desc: "Усиленная стрейч плёнка с повышенной прочностью на разрыв для тяжёлых и нестандартных грузов.",
    params: ["Нагрузка: до 800 кг", "Толщина: 25–50 мкм", "Повышенная адгезия"],
  },
  {
    icon: "Globe",
    name: "Цветная стрейч плёнка",
    desc: "Цветная плёнка для маркировки и идентификации грузов на складе. Более 10 цветов в наличии.",
    params: ["10+ цветов", "Стандартные размеры", "Для паллетирования"],
  },
  {
    icon: "Truck",
    name: "Плёнка для сенажа",
    desc: "Специализированная агро-плёнка для заготовки сенажа и силоса. Высокая УФ-защита.",
    params: ["УФ-стабилизатор", "Зелёный цвет", "Для агро-сектора"],
  },
];

const STATS = [
  { value: "15+", label: "лет на рынке" },
  { value: "500+", label: "клиентов" },
  { value: "12", label: "видов продукции" },
  { value: "48ч", label: "срок отгрузки" },
];

const ADVANTAGES = [
  {
    icon: "Factory",
    title: "Собственное производство",
    text: "Полный цикл — от сырья до готовой продукции. Контроль качества на каждом этапе.",
  },
  {
    icon: "BadgeCheck",
    title: "Сертифицированное качество",
    text: "Продукция соответствует ГОСТ и международным стандартам. Все партии проходят лабораторный контроль.",
  },
  {
    icon: "Handshake",
    title: "Гибкие условия",
    text: "Работаем с дистрибьюторами, оптовиками и прямыми клиентами. Индивидуальные цены от объёма.",
  },
  {
    icon: "MapPin",
    title: "Доставка по России",
    text: "Собственный транспортный отдел. Доставка во все регионы. Самовывоз со склада.",
  },
];

function useInView(ref: React.RefObject<Element>, threshold = 0.1) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return inView;
}

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formType, setFormType] = useState<"sample" | "offer">("offer");
  const [formData, setFormData] = useState({ name: "", company: "", phone: "", email: "", comment: "" });
  const [submitted, setSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = ["home", "about", "products", "contacts"];
    const handler = () => {
      const scrollY = window.scrollY + 100;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && scrollY >= el.offsetTop && scrollY < el.offsetTop + el.offsetHeight) {
          setActiveSection(id);
        }
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const openModal = (type: "sample" | "offer") => {
    setFormType(type);
    setModalOpen(true);
    setSubmitted(false);
    setFormData({ name: "", company: "", phone: "", email: "", comment: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const navItems = [
    { id: "home", label: "Главная" },
    { id: "about", label: "О компании" },
    { id: "products", label: "Продукция" },
    { id: "contacts", label: "Контакты" },
  ];

  return (
    <div style={{ background: "var(--bg-dark)", color: "var(--text-light)", minHeight: "100vh" }}>
      {/* HEADER */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "rgba(6,13,24,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(74,144,217,0.15)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 36,
                height: 36,
                background: "linear-gradient(135deg, #1e90ff, #1565c0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="Layers" size={18} style={{ color: "#fff" }} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "Oswald, sans-serif",
                  fontWeight: 700,
                  fontSize: "1.15rem",
                  letterSpacing: "0.1em",
                  color: "#fff",
                  lineHeight: 1,
                }}
              >
                ПОЛИПАК
              </div>
              <div
                style={{
                  fontFamily: "IBM Plex Sans, sans-serif",
                  fontSize: "0.6rem",
                  color: "var(--text-muted)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Производство плёнки
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="nav-link"
                style={{ color: activeSection === item.id ? "#fff" : "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => openModal("offer")}
            className="hidden md:block btn-primary px-5 py-2 text-sm"
            style={{ borderRadius: 2 }}
          >
            Получить КП
          </button>

          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: "var(--text-light)", background: "none", border: "none", cursor: "pointer" }}
          >
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {menuOpen && (
          <div style={{ background: "rgba(6,13,24,0.98)", borderTop: "1px solid rgba(74,144,217,0.15)" }}>
            <div className="px-6 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="nav-link text-left"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { openModal("offer"); setMenuOpen(false); }}
                className="btn-primary px-5 py-2 text-sm mt-2"
                style={{ borderRadius: 2 }}
              >
                Получить КП
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section
        id="home"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${HERO_IMAGE})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.25) saturate(0.8)",
          }}
        />
        <div className="bg-grid" style={{ position: "absolute", inset: 0, opacity: 0.6 }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(6,13,24,1) 0%, rgba(6,13,24,0.4) 50%, rgba(6,13,24,0.1) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(90deg, transparent, #1e90ff, transparent)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 pt-32">
          <div className="max-w-3xl">
            <div
              className="animate-fade-in"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(30,144,255,0.1)",
                border: "1px solid rgba(30,144,255,0.3)",
                padding: "6px 14px",
                marginBottom: 28,
                borderRadius: 2,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1e90ff" }} />
              <span
                style={{
                  fontFamily: "IBM Plex Sans, sans-serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  color: "#64b5f6",
                  textTransform: "uppercase",
                }}
              >
                Производство · Оптовые поставки
              </span>
            </div>

            <h1
              className="animate-fade-in animate-delay-100"
              style={{
                fontFamily: "Oswald, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.01em",
                marginBottom: 28,
                opacity: 0,
              }}
            >
              <span style={{ color: "#fff" }}>СТРЕЙЧ</span>
              <br />
              <span className="text-gradient">ПЛЁНКА</span>
              <br />
              <span style={{ color: "#fff" }}>С ЗАВОДА</span>
            </h1>

            <p
              className="animate-fade-in animate-delay-200"
              style={{
                fontFamily: "IBM Plex Sans, sans-serif",
                fontSize: "clamp(1rem, 2vw, 1.15rem)",
                color: "var(--text-muted)",
                lineHeight: 1.7,
                maxWidth: 520,
                marginBottom: 40,
                opacity: 0,
              }}
            >
              Производим стрейч плёнку и упаковочные материалы с 2009 года.
              Прямые поставки производителя — без посредников.
            </p>

            <div
              className="animate-fade-in animate-delay-300 flex flex-wrap gap-4"
              style={{ opacity: 0 }}
            >
              <button
                onClick={() => openModal("offer")}
                className="btn-primary px-8 py-3 text-sm"
                style={{ borderRadius: 2 }}
              >
                Получить коммерческое предложение
              </button>
              <button
                onClick={() => openModal("sample")}
                className="btn-outline-steel px-8 py-3 text-sm"
                style={{ borderRadius: 2 }}
              >
                Заказать образцы
              </button>
            </div>
          </div>

          <div
            className="animate-fade-in animate-delay-500 grid grid-cols-2 md:grid-cols-4 gap-px mt-20"
            style={{
              opacity: 0,
              background: "rgba(74,144,217,0.15)",
              border: "1px solid rgba(74,144,217,0.15)",
            }}
          >
            {STATS.map((s) => (
              <div key={s.label} style={{ background: "rgba(6,13,24,0.9)", padding: "24px 28px" }}>
                <div className="stat-number" style={{ fontSize: "2.5rem" }}>{s.value}</div>
                <div
                  style={{
                    fontFamily: "IBM Plex Sans, sans-serif",
                    fontSize: "0.78rem",
                    color: "var(--text-muted)",
                    letterSpacing: "0.05em",
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ background: "var(--bg-dark-2)", padding: "100px 0" }}>
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="flex items-center gap-4 mb-3">
              <div className="section-divider" />
              <span
                style={{
                  fontFamily: "IBM Plex Sans, sans-serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.2em",
                  color: "var(--accent-blue)",
                  textTransform: "uppercase",
                }}
              >
                О компании
              </span>
            </div>
            <h2
              style={{
                fontFamily: "Oswald, sans-serif",
                fontWeight: 600,
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                color: "#fff",
                marginBottom: 48,
                lineHeight: 1.1,
              }}
            >
              ТЕХНОЛОГИИ УПАКОВКИ
              <br />
              <span style={{ color: "var(--text-muted)", fontWeight: 300 }}>НА СЛУЖБЕ БИЗНЕСА</span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <AnimatedSection>
              <p
                style={{
                  fontFamily: "IBM Plex Sans, sans-serif",
                  fontSize: "1.05rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.8,
                  marginBottom: 24,
                }}
              >
                ПолиПак — российский производитель стрейч плёнки и упаковочных материалов.
                С 2009 года мы обеспечиваем промышленные предприятия, логистические компании
                и дистрибьюторов надёжной упаковкой.
              </p>
              <p
                style={{
                  fontFamily: "IBM Plex Sans, sans-serif",
                  fontSize: "1.05rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.8,
                }}
              >
                Современное производственное оборудование, строгий контроль качества и
                собственная лаборатория — основа нашего подхода. Каждая партия продукции
                проходит проверку перед отгрузкой.
              </p>
              <div
                style={{
                  marginTop: 36,
                  padding: "20px 24px",
                  background: "rgba(30,144,255,0.05)",
                  border: "1px solid rgba(30,144,255,0.2)",
                  borderLeft: "3px solid #1e90ff",
                }}
              >
                <p
                  style={{
                    fontFamily: "IBM Plex Sans, sans-serif",
                    fontStyle: "italic",
                    color: "var(--text-light)",
                    fontSize: "0.95rem",
                    lineHeight: 1.7,
                  }}
                >
                  «Работаем напрямую с производителем — без наценок посредников
                  и с гарантией стабильного качества каждой партии.»
                </p>
              </div>
            </AnimatedSection>

            <div className="flex flex-col gap-4">
              {ADVANTAGES.map((adv) => (
                <AnimatedSection key={adv.title}>
                  <div
                    className="card-industrial"
                    style={{ padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 16 }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        background: "rgba(30,144,255,0.1)",
                        border: "1px solid rgba(30,144,255,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon name={adv.icon} size={18} style={{ color: "#1e90ff" }} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "Oswald, sans-serif",
                          fontWeight: 500,
                          fontSize: "1rem",
                          color: "#fff",
                          marginBottom: 6,
                          letterSpacing: "0.03em",
                        }}
                      >
                        {adv.title}
                      </div>
                      <div
                        style={{
                          fontFamily: "IBM Plex Sans, sans-serif",
                          fontSize: "0.85rem",
                          color: "var(--text-muted)",
                          lineHeight: 1.6,
                        }}
                      >
                        {adv.text}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" style={{ background: "var(--bg-dark)", padding: "100px 0" }}>
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="flex items-center gap-4 mb-3">
              <div className="section-divider" />
              <span
                style={{
                  fontFamily: "IBM Plex Sans, sans-serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.2em",
                  color: "var(--accent-blue)",
                  textTransform: "uppercase",
                }}
              >
                Каталог продукции
              </span>
            </div>
            <h2
              style={{
                fontFamily: "Oswald, sans-serif",
                fontWeight: 600,
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                color: "#fff",
                marginBottom: 16,
                lineHeight: 1.1,
              }}
            >
              НАША ПРОДУКЦИЯ
            </h2>
            <p
              style={{
                fontFamily: "IBM Plex Sans, sans-serif",
                fontSize: "1rem",
                color: "var(--text-muted)",
                marginBottom: 56,
                maxWidth: 500,
              }}
            >
              Полный ассортимент плёнки для паллетирования, упаковки и агро-сектора.
              Производим под заказ с любыми параметрами.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRODUCTS.map((p) => (
              <AnimatedSection key={p.name}>
                <div className="product-card" style={{ padding: "28px", height: "100%" }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      background: "rgba(30,144,255,0.08)",
                      border: "1px solid rgba(30,144,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                    }}
                  >
                    <Icon name={p.icon} size={22} style={{ color: "#1e90ff" }} />
                  </div>
                  <div
                    style={{
                      fontFamily: "Oswald, sans-serif",
                      fontWeight: 500,
                      fontSize: "1.1rem",
                      color: "#fff",
                      marginBottom: 12,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {p.name}
                  </div>
                  <p
                    style={{
                      fontFamily: "IBM Plex Sans, sans-serif",
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      lineHeight: 1.7,
                      marginBottom: 20,
                    }}
                  >
                    {p.desc}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {p.params.map((param) => (
                      <div
                        key={param}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontFamily: "IBM Plex Sans, sans-serif",
                          fontSize: "0.78rem",
                          color: "#8bafc9",
                        }}
                      >
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#1e90ff", flexShrink: 0 }} />
                        {param}
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div
              style={{
                marginTop: 48,
                padding: "36px 40px",
                background: "linear-gradient(135deg, rgba(30,144,255,0.08), rgba(21,101,192,0.05))",
                border: "1px solid rgba(30,144,255,0.2)",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 24,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "Oswald, sans-serif",
                    fontWeight: 600,
                    fontSize: "1.5rem",
                    color: "#fff",
                    marginBottom: 8,
                  }}
                >
                  Нужен нестандартный размер или объём?
                </div>
                <p style={{ fontFamily: "IBM Plex Sans, sans-serif", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                  Производим под заказ. Минимальная партия — от 1 паллеты.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => openModal("offer")} className="btn-primary px-7 py-3 text-sm" style={{ borderRadius: 2 }}>
                  Запросить КП
                </button>
                <button onClick={() => openModal("sample")} className="btn-outline-steel px-7 py-3 text-sm" style={{ borderRadius: 2 }}>
                  Образцы
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" style={{ background: "var(--bg-dark-3)", padding: "100px 0" }}>
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="flex items-center gap-4 mb-3">
              <div className="section-divider" />
              <span
                style={{
                  fontFamily: "IBM Plex Sans, sans-serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.2em",
                  color: "var(--accent-blue)",
                  textTransform: "uppercase",
                }}
              >
                Контакты
              </span>
            </div>
            <h2
              style={{
                fontFamily: "Oswald, sans-serif",
                fontWeight: 600,
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                color: "#fff",
                marginBottom: 56,
                lineHeight: 1.1,
              }}
            >
              СВЯЖИТЕСЬ С НАМИ
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-12">
            <AnimatedSection>
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {[
                  { icon: "Phone", label: "Телефон", value: "+7 (800) 000-00-00", sub: "Бесплатно по России" },
                  { icon: "Mail", label: "Email", value: "info@polipak.ru", sub: "Ответим в течение 2 часов" },
                  { icon: "MapPin", label: "Адрес", value: "г. Москва, Промышленная ул., 15", sub: "Склад и самовывоз" },
                  { icon: "Clock", label: "Режим работы", value: "Пн–Пт: 09:00–18:00", sub: "Сб–Вс: по договорённости" },
                ].map((c) => (
                  <div key={c.label} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        background: "rgba(30,144,255,0.08)",
                        border: "1px solid rgba(30,144,255,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon name={c.icon} size={18} style={{ color: "#1e90ff" }} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "IBM Plex Sans, sans-serif",
                          fontSize: "0.72rem",
                          color: "var(--text-muted)",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          marginBottom: 4,
                        }}
                      >
                        {c.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "Oswald, sans-serif",
                          fontSize: "1.05rem",
                          fontWeight: 500,
                          color: "#fff",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {c.value}
                      </div>
                      <div style={{ fontFamily: "IBM Plex Sans, sans-serif", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        {c.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div
                style={{
                  background: "rgba(13,28,46,0.8)",
                  border: "1px solid rgba(74,144,217,0.2)",
                  padding: "36px",
                }}
              >
                <div
                  style={{
                    fontFamily: "Oswald, sans-serif",
                    fontWeight: 600,
                    fontSize: "1.3rem",
                    color: "#fff",
                    marginBottom: 24,
                    letterSpacing: "0.03em",
                  }}
                >
                  НАПИСАТЬ НАМ
                </div>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <input
                    className="input-dark"
                    placeholder="Ваше имя"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ padding: "12px 16px", width: "100%", borderRadius: 2 }}
                    required
                  />
                  <input
                    className="input-dark"
                    placeholder="Телефон или Email"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ padding: "12px 16px", width: "100%", borderRadius: 2 }}
                    required
                  />
                  <textarea
                    className="input-dark"
                    placeholder="Сообщение или вопрос"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    rows={4}
                    style={{ padding: "12px 16px", width: "100%", borderRadius: 2, resize: "vertical" }}
                  />
                  {submitted ? (
                    <div
                      style={{
                        padding: "14px",
                        background: "rgba(30,144,255,0.1)",
                        border: "1px solid rgba(30,144,255,0.3)",
                        color: "#64b5f6",
                        fontFamily: "IBM Plex Sans, sans-serif",
                        fontSize: "0.9rem",
                        textAlign: "center",
                      }}
                    >
                      Сообщение отправлено. Свяжемся с вами в ближайшее время.
                    </div>
                  ) : (
                    <button type="submit" className="btn-primary py-3 text-sm" style={{ borderRadius: 2 }}>
                      Отправить сообщение
                    </button>
                  )}
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "rgba(4,9,16,0.98)",
          borderTop: "1px solid rgba(74,144,217,0.1)",
          padding: "32px 0",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <div style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.1em", color: "var(--text-muted)" }}>
            ПОЛИПАК
          </div>
          <div style={{ fontFamily: "IBM Plex Sans, sans-serif", fontSize: "0.78rem", color: "var(--text-muted)" }}>
            © 2024 ООО «ПолиПак» · Производство стрейч плёнки
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                style={{
                  fontFamily: "IBM Plex Sans, sans-serif",
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {/* MODAL */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(4,9,16,0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div
            className="animate-scale-in"
            style={{
              background: "var(--bg-dark-3)",
              border: "1px solid rgba(74,144,217,0.25)",
              padding: "40px",
              width: "100%",
              maxWidth: 540,
              position: "relative",
            }}
          >
            <button
              onClick={() => setModalOpen(false)}
              style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
            >
              <Icon name="X" size={20} />
            </button>

            <div style={{ display: "flex", gap: 0, marginBottom: 32, border: "1px solid rgba(74,144,217,0.2)" }}>
              {(["offer", "sample"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFormType(type)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    fontFamily: "Oswald, sans-serif",
                    fontSize: "0.85rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    background: formType === type ? "#1e90ff" : "transparent",
                    color: formType === type ? "#fff" : "var(--text-muted)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {type === "offer" ? "Коммерческое предложение" : "Образцы продукции"}
                </button>
              ))}
            </div>

            <div style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: "1.4rem", color: "#fff", marginBottom: 8, letterSpacing: "0.02em" }}>
              {formType === "offer" ? "ЗАПРОСИТЬ КП" : "ЗАКАЗАТЬ ОБРАЗЦЫ"}
            </div>
            <p style={{ fontFamily: "IBM Plex Sans, sans-serif", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 28 }}>
              {formType === "offer"
                ? "Подготовим персональное предложение с ценами под ваш объём."
                : "Отправим образцы плёнки по указанному адресу бесплатно."}
            </p>

            {submitted ? (
              <div style={{ padding: "24px", background: "rgba(30,144,255,0.08)", border: "1px solid rgba(30,144,255,0.3)", textAlign: "center" }}>
                <Icon name="CheckCircle" size={40} style={{ color: "#1e90ff", margin: "0 auto 16px" }} />
                <div style={{ fontFamily: "Oswald, sans-serif", fontSize: "1.2rem", color: "#fff", marginBottom: 8 }}>
                  ЗАЯВКА ПРИНЯТА
                </div>
                <p style={{ fontFamily: "IBM Plex Sans, sans-serif", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Свяжемся с вами в течение рабочего дня.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <input
                  className="input-dark"
                  placeholder="Ваше имя *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ padding: "13px 16px", width: "100%", borderRadius: 2 }}
                  required
                />
                <input
                  className="input-dark"
                  placeholder="Компания"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  style={{ padding: "13px 16px", width: "100%", borderRadius: 2 }}
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <input
                    className="input-dark"
                    placeholder="Телефон *"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ padding: "13px 16px", width: "100%", borderRadius: 2 }}
                    required
                  />
                  <input
                    className="input-dark"
                    placeholder="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ padding: "13px 16px", width: "100%", borderRadius: 2 }}
                  />
                </div>
                <textarea
                  className="input-dark"
                  placeholder={formType === "offer" ? "Укажите нужный объём, вид продукции..." : "Укажите виды плёнки и адрес доставки образцов..."}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={4}
                  style={{ padding: "13px 16px", width: "100%", borderRadius: 2, resize: "vertical" }}
                />
                <button type="submit" className="btn-primary py-4 text-sm" style={{ borderRadius: 2, marginTop: 4 }}>
                  {formType === "offer" ? "Получить коммерческое предложение" : "Заказать образцы"}
                </button>
                <p style={{ fontFamily: "IBM Plex Sans, sans-serif", fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "center" }}>
                  Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;