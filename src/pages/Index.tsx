import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

// Карта-тултип для адресов
function MapTooltip({ address, mapSrc, children }: { address: string; mapSrc: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: "calc(100% + 12px)",
            zIndex: 200,
            width: 280,
            background: "rgba(10,22,38,0.98)",
            border: "1px solid rgba(30,144,255,0.35)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(30,144,255,0.1)",
            borderRadius: 4,
            overflow: "hidden",
            animation: "fade-in 0.2s ease-out",
          }}
        >
          <div style={{ height: 160, overflow: "hidden", position: "relative" }}>
            <iframe
              src={mapSrc}
              width="100%"
              height="160"
              style={{ border: "none", display: "block", filter: "brightness(0.85) saturate(1.2)" }}
              loading="lazy"
              title={address}
            />
          </div>
          <div
            style={{
              padding: "10px 14px",
              fontFamily: "IBM Plex Sans, sans-serif",
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              borderTop: "1px solid rgba(30,144,255,0.15)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icon name="MapPin" size={12} style={{ color: "#1e90ff", flexShrink: 0 }} />
            {address}
          </div>
          {/* стрелка вниз */}
          <div style={{
            position: "absolute",
            bottom: -7,
            left: 20,
            width: 12,
            height: 12,
            background: "rgba(10,22,38,0.98)",
            border: "1px solid rgba(30,144,255,0.35)",
            borderTop: "none",
            borderLeft: "none",
            transform: "rotate(45deg)",
          }} />
        </div>
      )}
    </div>
  );
}

// Калькулятор стрейч плёнки
function FilmCalculator() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"weight" | "length">("weight");
  const [width, setWidth] = useState(500);
  const [thickness, setThickness] = useState(20);
  const [value, setValue] = useState<number | "">("");

  const density = 0.920; // г/см³ для LLDPE
  const widthM = width / 1000;
  const thickM = thickness / 1000000;

  let result: string | null = null;
  if (value !== "" && Number(value) > 0) {
    if (mode === "weight") {
      const lengthM = (Number(value) * 1000) / (density * widthM * thickM * 1000000);
      result = `≈ ${lengthM.toFixed(0)} м длины`;
    } else {
      const weightG = density * widthM * thickM * Number(value) * 1000000;
      result = `≈ ${(weightG / 1000).toFixed(2)} кг`;
    }
  }

  return (
    <div style={{ marginTop: 40 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "rgba(30,144,255,0.06)",
          border: "1px solid rgba(30,144,255,0.25)",
          color: "#64b5f6",
          fontFamily: "Oswald, sans-serif",
          fontSize: "0.9rem",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          padding: "12px 20px",
          cursor: "pointer",
          transition: "all 0.3s",
          borderRadius: 2,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(30,144,255,0.12)"; e.currentTarget.style.borderColor = "#1e90ff"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(30,144,255,0.06)"; e.currentTarget.style.borderColor = "rgba(30,144,255,0.25)"; }}
      >
        <Icon name="Calculator" size={16} style={{ color: "#1e90ff" }} />
        Калькулятор плёнки
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={14} style={{ color: "#1e90ff", marginLeft: "auto" }} />
      </button>

      {open && (
        <div
          style={{
            marginTop: 0,
            background: "rgba(13,28,46,0.9)",
            border: "1px solid rgba(30,144,255,0.2)",
            borderTop: "none",
            padding: "28px 32px",
            animation: "fade-in 0.3s ease-out",
          }}
        >
          <div style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: "1.1rem", color: "#fff", marginBottom: 20, letterSpacing: "0.03em" }}>
            РАСЧЁТ СТРЕЙЧ ПЛЁНКИ
          </div>

          {/* Режим */}
          <div style={{ display: "flex", gap: 0, marginBottom: 24, border: "1px solid rgba(74,144,217,0.2)", width: "fit-content" }}>
            {([["weight", "По весу → длина"], ["length", "По длине → вес"]] as const).map(([m, label]) => (
              <button
                key={m}
                onClick={() => { setMode(m); setValue(""); }}
                style={{
                  padding: "9px 18px",
                  fontFamily: "IBM Plex Sans, sans-serif",
                  fontSize: "0.82rem",
                  background: mode === m ? "#1e90ff" : "transparent",
                  color: mode === m ? "#fff" : "var(--text-muted)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4" style={{ marginBottom: 20 }}>
            <div>
              <label style={{ fontFamily: "IBM Plex Sans, sans-serif", fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                Ширина рулона, мм
              </label>
              <select
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="input-dark"
                style={{ padding: "10px 14px", width: "100%", borderRadius: 2, cursor: "pointer" }}
              >
                {[450, 500].map(w => <option key={w} value={w}>{w} мм</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontFamily: "IBM Plex Sans, sans-serif", fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                Толщина, мкм
              </label>
              <select
                value={thickness}
                onChange={(e) => setThickness(Number(e.target.value))}
                className="input-dark"
                style={{ padding: "10px 14px", width: "100%", borderRadius: 2, cursor: "pointer" }}
              >
                {[17, 20, 23, 25, 30, 35].map(t => <option key={t} value={t}>{t} мкм</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontFamily: "IBM Plex Sans, sans-serif", fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                {mode === "weight" ? "Вес, кг" : "Длина, м"}
              </label>
              <input
                type="number"
                min={0}
                value={value}
                onChange={(e) => setValue(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder={mode === "weight" ? "Введите кг" : "Введите м"}
                className="input-dark"
                style={{ padding: "10px 14px", width: "100%", borderRadius: 2 }}
              />
            </div>
          </div>

          {result && (
            <div
              style={{
                padding: "16px 20px",
                background: "rgba(30,144,255,0.08)",
                border: "1px solid rgba(30,144,255,0.3)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                animation: "fade-in 0.2s ease-out",
              }}
            >
              <Icon name="Zap" size={18} style={{ color: "#1e90ff", flexShrink: 0 }} />
              <span style={{ fontFamily: "Oswald, sans-serif", fontSize: "1.1rem", color: "#fff" }}>
                {mode === "weight" ? `${value} кг` : `${value} м`} плёнки {width}мм × {thickness}мкм →{" "}
                <span style={{ color: "#64b5f6" }}>{result}</span>
              </span>
            </div>
          )}

          <p style={{ fontFamily: "IBM Plex Sans, sans-serif", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 14 }}>
            * Расчёт приблизительный, основан на плотности LLDPE 0,920 г/см³
          </p>
        </div>
      )}
    </div>
  );
}

// Виджет обратной связи
function CallbackWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);
  const [widgetConsent, setWidgetConsent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!widgetConsent) return;
    await fetch("https://functions.poehali.dev/c16dfd96-103d-40df-92cf-0b9bc1bac38c", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "callback", name, phone }),
    }).catch(() => null);
    setDone(true);
    setTimeout(() => { setOpen(false); setDone(false); setName(""); setPhone(""); setWidgetConsent(false); }, 3000);
  };

  return (
    <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 90, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
      {open && (
        <div
          className="animate-scale-in"
          style={{
            background: "rgba(10,22,38,0.98)",
            border: "1px solid rgba(30,144,255,0.3)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(30,144,255,0.08)",
            width: 300,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "16px 20px", background: "linear-gradient(135deg, rgba(30,144,255,0.15), rgba(21,101,192,0.1))", borderBottom: "1px solid rgba(30,144,255,0.15)" }}>
            <div style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: "1rem", color: "#fff", letterSpacing: "0.04em" }}>
              НАШ МЕНЕДЖЕР СВЯЖЕТСЯ С ВАМИ
            </div>
            <div style={{ fontFamily: "IBM Plex Sans, sans-serif", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 4 }}>
              Ответим в течение 30 минут
            </div>
          </div>
          <div style={{ padding: "20px" }}>
            {done ? (
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <Icon name="CheckCircle" size={32} style={{ color: "#1e90ff", margin: "0 auto 10px" }} />
                <div style={{ fontFamily: "Oswald, sans-serif", color: "#fff", fontSize: "1rem" }}>Заявка принята!</div>
                <div style={{ fontFamily: "IBM Plex Sans, sans-serif", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>Позвоним вам скоро</div>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  className="input-dark"
                  placeholder="Ваше имя *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ padding: "10px 14px", width: "100%", borderRadius: 2, fontSize: "0.875rem" }}
                />
                <input
                  className="input-dark"
                  placeholder="Телефон *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  type="tel"
                  style={{ padding: "10px 14px", width: "100%", borderRadius: 2, fontSize: "0.875rem" }}
                />
                <ConsentCheckbox checked={widgetConsent} onChange={setWidgetConsent} />
                <button
                  type="submit"
                  className="btn-primary py-2.5 text-sm"
                  style={{ borderRadius: 2, opacity: widgetConsent ? 1 : 0.45, cursor: widgetConsent ? "pointer" : "not-allowed" }}
                  disabled={!widgetConsent}
                >
                  Перезвоните мне
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: open ? "rgba(30,100,200,0.9)" : "linear-gradient(135deg, #1e90ff, #1565c0)",
          border: "2px solid rgba(100,181,246,0.3)",
          boxShadow: open ? "0 4px 20px rgba(30,144,255,0.3)" : "0 8px 32px rgba(30,144,255,0.45)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          transform: open ? "rotate(45deg)" : "none",
        }}
        title="Обратная связь"
      >
        <Icon name={open ? "X" : "MessageCircle"} size={22} style={{ color: "#fff" }} />
      </button>
      {!open && (
        <div style={{
          position: "absolute",
          bottom: 64,
          right: 0,
          background: "rgba(10,22,38,0.95)",
          border: "1px solid rgba(30,144,255,0.25)",
          borderRadius: 4,
          padding: "6px 12px",
          fontFamily: "IBM Plex Sans, sans-serif",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          animation: "fade-in 1s ease-out 1.5s both",
        }}>
          Нужна консультация?
        </div>
      )}
    </div>
  );
}

const HERO_IMAGE = "https://cdn.poehali.dev/projects/8fbdf227-6035-4a92-b027-59557fc75d15/files/0c6dc6d4-36aa-4a19-8832-e2adee5b7944.jpg";

// SVG иконки продуктов — можно редактировать вручную
const ProductIconManual = () => (
  // Ручная стрейч плёнка — рулон в руках
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
    <rect x="18" y="8" width="14" height="28" rx="7" stroke="#1e90ff" strokeWidth="2.2"/>
    <rect x="22" y="12" width="6" height="20" rx="3" fill="rgba(30,144,255,0.15)" stroke="#1e90ff" strokeWidth="1.4"/>
    <path d="M10 34 Q14 30 18 32" stroke="#1e90ff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M38 34 Q34 30 32 32" stroke="#1e90ff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 36 Q13 40 24 40 Q35 40 40 36" stroke="#1e90ff" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
  </svg>
);

const ProductIconMachine = () => (
  // Машинная плёнка — большой рулон с шестернёй
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
    <rect x="12" y="6" width="18" height="34" rx="9" stroke="#1e90ff" strokeWidth="2.2"/>
    <rect x="17" y="11" width="8" height="24" rx="4" fill="rgba(30,144,255,0.15)" stroke="#1e90ff" strokeWidth="1.4"/>
    <circle cx="36" cy="14" r="6" stroke="#1e90ff" strokeWidth="2"/>
    <circle cx="36" cy="14" r="2" fill="#1e90ff"/>
    <path d="M36 8 V6 M36 22 V20 M30 14 H28 M44 14 H42" stroke="#1e90ff" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M31.8 9.8 L30.4 8.4 M41.6 19.6 L40.2 18.2 M40.2 9.8 L41.6 8.4 M30.4 19.6 L31.8 18.2" stroke="#1e90ff" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const ProductIconTape = () => (
  // Клейкая лента — диспенсер с лентой
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
    <circle cx="20" cy="20" r="12" stroke="#1e90ff" strokeWidth="2.2"/>
    <circle cx="20" cy="20" r="5" fill="rgba(30,144,255,0.15)" stroke="#1e90ff" strokeWidth="1.6"/>
    <path d="M29 27 L38 38" stroke="#1e90ff" strokeWidth="2.4" strokeLinecap="round"/>
    <path d="M36 36 L42 30 L38 38 L32 36 Z" fill="#1e90ff"/>
    <path d="M8 10 Q12 6 20 8" stroke="#1e90ff" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="2 2"/>
  </svg>
);

const PRODUCT_ICONS = [ProductIconManual, ProductIconMachine, ProductIconTape];

const PRODUCTS = [
  {
    name: "Стрейч плёнка ручная",
    desc: "Для ручной упаковки паллет на малых и средних объёмах. Эластичная, с высокой степенью растяжения.",
    params: ["Ширина: 100–500 мм", "Толщина: 17–23 мкм", "Длина: до 1000 м"],
  },
  {
    name: "Стрейч плёнка машинная",
    desc: "Для автоматических и полуавтоматических паллетоупаковщиков. Высокая скорость намотки, стабильная толщина.",
    params: ["Ширина: 500 мм", "Толщина: от 12 мкм", "Длина: до 5000 м"],
  },
  {
    name: "Клейкие ленты",
    desc: "Скотч и клейкие ленты для упаковки коробов, маркировки и укрепления швов. Широкий ассортимент.",
    params: ["Прозрачные и цветные", "Ширина: 48–75 мм", "Длина: 50–150 м"],
  },
];

const STATS = [
  { value: "10+", label: "лет на рынке" },
  { value: "500+", label: "клиентов" },
  { value: "200т", label: "производительность в месяц" },
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
    text: "Продукция соответствует ГОСТ и международным стандартам. Контроль качества на каждом этапе производства.",
  },
  {
    icon: "Handshake",
    title: "Гибкие условия",
    text: "Работаем с дистрибьюторами, оптовиками и прямыми клиентами. Индивидуальные цены от объёма.",
  },
  {
    icon: "MapPin",
    title: "Доставка по Калининградской области",
    text: "Доставка по всей Калининградской области. Самовывоз с производства в пос. Борское.",
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

function ConsentCheckbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 18,
          height: 18,
          border: `2px solid ${checked ? "#1e90ff" : "rgba(74,144,217,0.4)"}`,
          background: checked ? "#1e90ff" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 1,
          transition: "all 0.2s",
          cursor: "pointer",
        }}
      >
        {checked && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4L4 7.5L10 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span style={{ fontFamily: "IBM Plex Sans, sans-serif", fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
        Я согласен(а) на обработку{" "}
        <span style={{ color: "#64b5f6", cursor: "default" }}>персональных данных</span>{" "}
        в соответствии с Федеральным законом №152-ФЗ
      </span>
    </label>
  );
}

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formType, setFormType] = useState<"sample" | "offer">("offer");
  const [formData, setFormData] = useState({ name: "", company: "", phone: "", email: "", comment: "" });
  const [consent, setConsent] = useState(false);
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
    setConsent(false);
    setFormData({ name: "", company: "", phone: "", email: "", comment: "" });
  };

  const SEND_URL = "https://functions.poehali.dev/c16dfd96-103d-40df-92cf-0b9bc1bac38c";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, string> = {
      type: modalOpen ? formType : "contact",
      name: formData.name,
      phone: formData.phone,
    };
    if (formData.email) payload.email = formData.email;
    if (formData.company) payload.company = formData.company;
    if (formData.comment) payload.comment = formData.comment;
    await fetch(SEND_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch(() => null);
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
            <img
              src="https://cdn.poehali.dev/projects/8fbdf227-6035-4a92-b027-59557fc75d15/bucket/5fd35f9a-31e6-4ee2-8a51-f3c449c10f4b.png"
              alt="КФУ"
              style={{ width: 42, height: 42, objectFit: "contain", mixBlendMode: "lighten" }}
            />
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
                КФУ
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
                Калининградская Фабрика Упаковки
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
                Производство · Калининградская область
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
              Производим стрейч плёнку и упаковочные материалы с 2015 года.
              Поставки по Калининградской области — напрямую с фабрики.
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
                Калининградская Фабрика Упаковки — производитель стрейч плёнки и упаковочных материалов.
                С 2015 года мы обеспечиваем предприятия и логистические компании Калининградской области
                надёжной упаковкой.
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
                  «Работай напрямую с производителем — без наценок посредников и с гарантией стабильного качества каждой партии.»
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
            {PRODUCTS.map((p, idx) => {
              const ProductSvgIcon = PRODUCT_ICONS[idx];
              return (
              <AnimatedSection key={p.name}>
                <div className="product-card" style={{ padding: "28px", height: "100%", position: "relative", overflow: "hidden" }}>
                  {/* Декоративная SVG-иконка в фоне */}
                  <div style={{
                    position: "absolute",
                    top: 10,
                    right: 14,
                    opacity: 0.06,
                    pointerEvents: "none",
                    userSelect: "none",
                    transform: "scale(3.5)",
                    transformOrigin: "top right",
                  }}>
                    <ProductSvgIcon />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        background: "rgba(30,144,255,0.08)",
                        border: "1px solid rgba(30,144,255,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        position: "relative",
                        filter: "drop-shadow(0 0 6px rgba(30,144,255,0.25))",
                      }}
                    >
                      <ProductSvgIcon />
                    </div>
                    <div
                      style={{
                        fontFamily: "Oswald, sans-serif",
                        fontWeight: 500,
                        fontSize: "1.1rem",
                        color: "#fff",
                        letterSpacing: "0.02em",
                        lineHeight: 1.2,
                      }}
                    >
                      {p.name}
                    </div>
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
              );
            })}
          </div>

          <FilmCalculator />

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
                  Производим под заказ с любыми параметрами.
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
      <section id="contacts" style={{ background: "var(--bg-dark-3)", padding: "100px 0", position: "relative", overflow: "hidden" }}>
        {/* Карта Калининграда на фоне */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=20.3,54.6,20.7,54.8&layer=mapnik"
            style={{ width: "100%", height: "100%", border: "none", opacity: 0.13, filter: "grayscale(100%) brightness(0.5) sepia(30%) hue-rotate(190deg)" }}
            title="Калининград"
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, var(--bg-dark-3) 0%, transparent 20%, transparent 80%, var(--bg-dark-3) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, var(--bg-dark-3) 0%, transparent 30%, transparent 70%, var(--bg-dark-3) 100%)" }} />
        </div>
        <div className="max-w-7xl mx-auto px-6" style={{ position: "relative", zIndex: 1 }}>
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
                  { icon: "Phone", label: "Телефон", value: "+7 (4012) 52-66-00", sub: "Бесплатно по Калининградской области" },
                  { icon: "Mail", label: "Email", value: "info@kdfu.ru", sub: "Ответим в течение 2 часов" },
                  { icon: "Factory", label: "Производство", value: "Гвардейский район, пос. Борское, 1А", sub: "Самовывоз с производства", mapSrc: "https://yandex.ru/map-widget/v1/?ll=21.0833%2C54.6167&z=13&pt=21.0833%2C54.6167%2Cpm2rdm&text=%D0%93%D0%B2%D0%B0%D1%80%D0%B4%D0%B5%D0%B9%D1%81%D0%BA%D0%B8%D0%B9+%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C+%D0%91%D0%BE%D1%80%D1%81%D0%BA%D0%BE%D0%B5" },
                  { icon: "Building2", label: "Офис", value: "г. Калининград, аллея Смелых, 20В", sub: "Консультация и оформление заказов", mapSrc: "https://yandex.ru/map-widget/v1/?ll=20.5114%2C54.7243&z=15&pt=20.5114%2C54.7243%2Cpm2rdm&text=%D0%9A%D0%B0%D0%BB%D0%B8%D0%BD%D0%B8%D0%BD%D0%B3%D1%80%D0%B0%D0%B4%2C+%D0%B0%D0%BB%D0%BB%D0%B5%D1%8F+%D0%A1%D0%BC%D0%B5%D0%BB%D1%8B%D1%85%2C+20%D0%92" },
                  { icon: "Clock", label: "Режим работы", value: "Пн–Пт: 09:00–18:00", sub: "Сб–Вс: по договорённости" },
                ].map((c) => {
                  const inner = (
                    <div key={c.label} style={{ display: "flex", gap: 16, alignItems: "flex-start", cursor: (c as { mapSrc?: string }).mapSrc ? "help" : "default" }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          background: "rgba(30,144,255,0.08)",
                          border: (c as { mapSrc?: string }).mapSrc ? "1px solid rgba(30,144,255,0.4)" : "1px solid rgba(30,144,255,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "border-color 0.2s",
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
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          {c.label}
                          {(c as { mapSrc?: string }).mapSrc && (
                            <span style={{ fontSize: "0.65rem", color: "#1e90ff", letterSpacing: "0.05em" }}>карта ↗</span>
                          )}
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
                  );
                  const mapSrc = (c as { mapSrc?: string }).mapSrc;
                  return mapSrc ? (
                    <MapTooltip key={c.label} address={c.value} mapSrc={mapSrc}>
                      {inner}
                    </MapTooltip>
                  ) : inner;
                })}
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
                  <ConsentCheckbox checked={consent} onChange={setConsent} />
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
                    <button
                      type="submit"
                      className="btn-primary py-3 text-sm"
                      style={{ borderRadius: 2, opacity: consent ? 1 : 0.45, cursor: consent ? "pointer" : "not-allowed" }}
                      disabled={!consent}
                    >
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
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src="https://cdn.poehali.dev/projects/8fbdf227-6035-4a92-b027-59557fc75d15/bucket/5fd35f9a-31e6-4ee2-8a51-f3c449c10f4b.png"
              alt="КФУ"
              style={{ width: 32, height: 32, objectFit: "contain", mixBlendMode: "lighten", opacity: 0.75 }}
            />
            <span style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.1em", color: "var(--text-muted)" }}>КФУ</span>
          </div>
          <div style={{ fontFamily: "IBM Plex Sans, sans-serif", fontSize: "0.78rem", color: "var(--text-muted)" }}>
            © 2025 Калининградская Фабрика Упаковки · Производство стрейч плёнки
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

      <CallbackWidget />

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
                <ConsentCheckbox checked={consent} onChange={setConsent} />
                <button
                  type="submit"
                  className="btn-primary py-4 text-sm"
                  style={{ borderRadius: 2, marginTop: 4, opacity: consent ? 1 : 0.45, cursor: consent ? "pointer" : "not-allowed" }}
                  disabled={!consent}
                >
                  {formType === "offer" ? "Получить коммерческое предложение" : "Заказать образцы"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;