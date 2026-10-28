 "use client";

import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const faces = [
  { emoji: "😡", label: "Muy mal", color: "#e85c52", score: 1 },
  { emoji: "🙁", label: "Mal", color: "#f2a14a", score: 2 },
  { emoji: "😐", label: "Neutral", color: "#f1cd62", score: 3 },
  { emoji: "🙂", label: "Bien", color: "#9fc66b", score: 4 },
  { emoji: "😄", label: "Muy bien", color: "#5b9e63", score: 5 }
];

export default function SmartLore() {
  const [score, setScore] = useState(4);
  const [intensity, setIntensity] = useState(2);
  const [comment, setComment] = useState("");
  const [kind, setKind] = useState<"digital" | "physical">("digital");
  const [target, setTarget] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [summary, setSummary] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [showQr, setShowQr] = useState(false);
  const [profileName, setProfileName] = useState("Tu avatar");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const u = p.get("url");
    if (u) { setCurrentUrl(u); setTarget(u); setKind("digital"); }
    try {
      setHistory(JSON.parse(localStorage.getItem("sl-history") || "[]"));
      setProfileName(localStorage.getItem("sl-name") || "Tu avatar");
      setAvatarUrl(localStorage.getItem("sl-avatar") || "");
    } catch {}
  }, []);

  const face = faces[score - 1];
  const qrUrl = typeof window !== "undefined" ? `${window.location.origin}/?source=qr` : "https://smartlore.example";

  async function submit() {
    if (!comment.trim() && !score) { setStatus("Elige una valoración."); return; }
    setStatus("Procesando tu opinión…");
    let ai = { summary: comment.trim(), keywords: [] as string[] };
    if (comment.trim()) {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment, score, intensity, target, kind })
        });
        if (res.ok) ai = await res.json();
      } catch {}
    }
    const item = {
      id: crypto.randomUUID(), score, intensity, comment, target: target || (kind === "digital" ? currentUrl : "Lugar sin especificar"),
      kind, createdAt: new Date().toISOString(), summary: ai.summary, keywords: ai.keywords || []
    };
    const next = [item, ...history].slice(0, 100);
    setHistory(next);
    try { localStorage.setItem("sl-history", JSON.stringify(next)); } catch {}
    setSummary(item.summary);
    setKeywords(item.keywords);
    setComment("");
    setStatus("Opinión guardada en este dispositivo. Inicia sesión para sincronizarla y enviarla al espacio compartido.");
  }

  async function signIn() {
    if (!email.includes("@")) { setStatus("Introduce un correo válido."); return; }
    try {
      const res = await fetch("/api/auth-link", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      setStatus(res.ok ? "Si el correo está registrado o permitido, recibirás un enlace de acceso." : (data.error || "No se pudo enviar el enlace. Revisa la configuración."));
    } catch { setStatus("No se pudo conectar. Revisa la configuración de Supabase."); }
  }

  function saveProfile() {
    try {
      localStorage.setItem("sl-name", profileName);
      localStorage.setItem("sl-avatar", avatarUrl);
      setStatus("Perfil guardado en este dispositivo.");
    } catch { setStatus("No se pudo guardar el perfil."); }
  }

  return <main>
    <header className="nav">
      <a className="brand" href="#"><span className="leaf">◆</span> SMART LORE</a>
      <nav><a href="#como">Cómo funciona</a><a href="#mapa">Mapa emocional</a><a href="#empresas">Para organizaciones</a><a className="navCta" href="#avatar">Probar avatar ↗</a></nav>
    </header>

    <section className="hero">
      <div className="heroCopy">
        <div className="eyebrow"><span className="dot"></span> LA INTELIGENCIA DE LO QUE SENTIMOS</div>
        <h1>Tu opinión también<br/>construye <em>ciudades.</em></h1>
        <p className="lead">Un avatar que te acompaña para valorar webs, servicios y lugares. Convierte experiencias reales en señales útiles para mejorar lo que nos rodea.</p>
        <div className="actions"><a className="primary" href="#avatar">Probar el avatar <span>↗</span></a><a className="secondary" href="#empresas">Soy una organización</a></div>
        <div className="proof"><span>●</span> Sin formularios interminables <span>●</span> Tu voz, en segundos</div>
      </div>
      <div className="heroVisual">
        <div className="cityGlow"></div>
        <div className="floatingCard"><div className="tinyLabel">SMART LORE / PULSO</div><h3>¿Cómo te hace sentir<br/>esta experiencia?</h3><div className="faces">{faces.map(f=><button key={f.score} onClick={()=>{setScore(f.score); document.getElementById("avatar")?.scrollIntoView({behavior:"smooth"});}} title={f.label}>{f.emoji}</button>)}</div><div className="miniBars"><i/><i/><i/><i/><i/></div><small>Una señal pequeña. Una mejora posible.</small></div>
        <div className="avatarBadge">{avatarUrl ? <img src={avatarUrl} alt="Avatar"/> : "👨🏻‍💻"}</div>
        <div className="orbit orbit1"></div><div className="orbit orbit2"></div>
      </div>
    </section>

    <section className="metrics">
      <div><strong>01</strong><span>Valora lo digital</span><small>Webs, servicios y proyectos</small></div>
      <div><strong>02</strong><span>Explora lo físico</span><small>Lugares y experiencias cercanas</small></div>
      <div><strong>03</strong><span>Comprende patrones</span><small>Sentimientos, temas y tendencias</small></div>
      <div><strong>04</strong><span>Mejora decisiones</span><small>Información agregada y accionable</small></div>
    </section>

    <section className="demo section" id="avatar">
      <div className="sectionIntro"><div className="eyebrow">TU VOZ, EN UN SOLO TOQUE</div><h2>¿Qué te gustaría<br/><em>cambiar o celebrar?</em></h2><p>Elige una emoción, añade contexto si quieres y deja que Smart Lore organice la señal sin sustituir tu voz.</p>
        <div className="privacy">✳ Tus opiniones son privadas por defecto en esta demo. No se publican automáticamente.</div>
      </div>
      <div className="widget">
        <div className="widgetTop"><div className="avatarSmall">{avatarUrl ? <img src={avatarUrl} alt="Avatar"/> : "👨🏻‍💻"}</div><div><b>Hola, {profileName}</b><small>¿Cómo te sientes con esto?</small></div><span className="online"></span></div>
        <div className="segmented"><button className={kind==="digital"?"active":""} onClick={()=>setKind("digital")}>◎ Entorno digital</button><button className={kind==="physical"?"active":""} onClick={()=>setKind("physical")}>⌖ Entorno físico</button></div>
        <label className="fieldLabel">{kind === "digital" ? "Web, servicio o elemento" : "Lugar o proyecto"}</label>
        <input className="textInput" value={target} onChange={e=>setTarget(e.target.value)} placeholder={kind==="digital" ? "https:// o nombre de la web" : "Nombre del lugar o proyecto"}/>
        <div className="facePicker">{faces.map(f=><button key={f.score} className={score===f.score?"chosen":""} style={{"--face":f.color} as React.CSSProperties} onClick={()=>setScore(f.score)}><span>{f.emoji}</span><small>{f.label}</small></button>)}</div>
        <label className="fieldLabel">Intensidad</label><div className="intensities">{["Suave","Moderada","Fuerte"].map((s,i)=><button key={s} className={intensity===i+1?"selected":""} onClick={()=>setIntensity(i+1)}>{s}</button>)}</div>
        <label className="fieldLabel">Cuéntanos más (opcional)</label>
        <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="¿Qué te ha gustado? ¿Qué cambiarías?..." rows={3}/>
        <button className="submit" onClick={submit}>Enviar valoración <span>↗</span></button>
        {status && <p className="status" role="status">{status}</p>}
        {summary && <div className="aiResult"><b>Resumen fiel</b><p>{summary}</p>{keywords.length>0&&<div className="chips">{keywords.map(k=><span key={k}>{k}</span>)}</div>}</div>}
      </div>
    </section>

    <section className="mapSection section" id="mapa">
      <div><div className="eyebrow">EL TERRITORIO TAMBIÉN HABLA</div><h2>Un mapa de lo que<br/><em>sentimos en común.</em></h2><p>Visualiza tendencias por zonas cuando haya suficientes valoraciones. Sin publicar ubicaciones personales exactas ni exponer a individuos.</p><a className="secondary" href="#empresas">Explorar piloto urbano ↗</a></div>
      <div className="mapMock" aria-label="Vista conceptual del mapa emocional">
        <div className="mapRoad roadA"></div><div className="mapRoad roadB"></div><div className="mapRoad roadC"></div><div className="park">PARQUE<br/>PÚBLICO</div>
        <span className="pin pin1">🙂</span><span className="pin pin2">😐</span><span className="pin pin3">😄</span><span className="pin pin4">🙁</span><span className="pin pin5">🙂</span>
        <div className="mapLegend"><span><i className="green"></i> Positivo</span><span><i className="yellow"></i> Neutro</span><span><i className="red"></i> A mejorar</span></div><div className="mapNote">Vista conceptual · sin datos reales</div>
      </div>
    </section>

    <section className="profile section">
      <div><div className="eyebrow">TU IDENTIDAD SMART LORE</div><h2>Un avatar.<br/><em>Tu historial.</em></h2><p>Personaliza tu perfil y conserva tus valoraciones en este dispositivo. La sincronización entre dispositivos requiere configurar Supabase.</p></div>
      <div className="profileCard"><div className="profilePreview">{avatarUrl ? <img src={avatarUrl} alt="Vista previa del avatar"/> : "👨🏻‍💻"}</div><div className="profileFields"><label className="fieldLabel">Nombre visible</label><input className="textInput" value={profileName} onChange={e=>setProfileName(e.target.value)} maxLength={40}/><label className="fieldLabel">URL de tu foto (opcional)</label><input className="textInput" value={avatarUrl} onChange={e=>setAvatarUrl(e.target.value)} placeholder="https://..."/><button className="secondary" onClick={saveProfile}>Guardar perfil</button></div></div>
    </section>

    <section className="history section"><div className="historyHead"><div><div className="eyebrow">TU VOZ DEJA HUELLA</div><h2>Tu historial de <em>opiniones.</em></h2></div><button className="secondary" onClick={()=>setShowQr(!showQr)}>{showQr?"Ocultar QR":"Crear QR de acceso"} ↗</button></div>
      {showQr&&<div className="qrPanel"><QRCodeSVG value={qrUrl} size={124}/><div><b>Acceso rápido al avatar</b><p>Comparte este QR para abrir la experiencia. En producción, crea QR separados por cliente, campaña o ubicación.</p></div></div>}
      {history.length===0?<div className="emptyHistory">Aún no hay opiniones. Prueba el avatar para crear la primera.</div>:<div className="historyList">{history.map(item=><article className="historyItem" key={item.id}><span className="historyEmoji">{faces[item.score-1]?.emoji}</span><div><b>{item.target}</b><p>{item.summary || item.comment || "Valoración sin comentario"}</p><small>{item.kind==="digital"?"Digital":"Físico"} · {new Date(item.createdAt).toLocaleString("es-ES")}</small>{item.keywords?.length>0&&<div className="chips">{item.keywords.map((k:string)=><span key={k}>{k}</span>)}</div>}</div></article>)}</div>}
    </section>

    <section className="business section" id="empresas"><div className="eyebrow">SMART LORE PARA ORGANIZACIONES</div><h2>Menos intuición.<br/><em>Más señales reales.</em></h2><p>Un piloto para entender qué funciona en tu web, qué preocupa a tus clientes y cómo se perciben tus espacios.</p><div className="businessGrid"><div><b>01 / Experiencia digital</b><p>Detecta fricciones y elementos concretos que generan satisfacción o frustración.</p></div><div><b>02 / Experiencia física</b><p>Recoge opiniones de tiendas, servicios, barrios o proyectos mediante QR.</p></div><div><b>03 / Informe accionable</b><p>Resumen de sentimientos, temas recurrentes y evolución temporal.</p></div></div><a className="primary" href="mailto:hola@smartlore.example?subject=Piloto%20Smart%20Lore">Quiero probar un piloto ↗</a><small className="disclaimer">Demo conceptual. Sustituye el correo de contacto antes de publicar.</small></section>

    <footer><a className="brand" href="#"><span className="leaf">◆</span> SMART LORE</a><span>Tu opinión también construye ciudades.</span><span>Privacidad primero · Opiniones con contexto</span></footer>
    <button className="floatingAvatar" aria-label="Abrir avatar" onClick={()=>document.getElementById("avatar")?.scrollIntoView({behavior:"smooth"})}>{avatarUrl?<img src={avatarUrl} alt=""/>:"👨🏻‍💻"}<span>Valorar</span></button>
  </main>;
}