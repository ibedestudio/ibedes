import * as React from "react";

type Props = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function GlowCard({ title, subtitle, children, className }: Props) {
  const ref = React.useRef<HTMLDivElement>(null);

  const update = (x: number, y: number) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const cx = x - r.left;
    const cy = y - r.top;
    el.style.setProperty("--x", `${cx}px`);
    el.style.setProperty("--y", `${cy}px`);
    // tilt ringan
    const rx = ((cy / r.height) - 0.5) * -6;
    const ry = ((cx / r.width) - 0.5) * 6;
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.dataset.active = "true";
  };

  return (
    <div
      ref={ref}
      className={`glow-card ${className ?? ""}`}
      onMouseMove={(e) => update(e.clientX, e.clientY)}
      onTouchMove={(e) => {
        const t = e.touches[0];
        if (t) update(t.clientX, t.clientY);
      }}
      onMouseLeave={() => {
        const el = ref.current!;
        el.dataset.active = "false";
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
        el.style.setProperty("--x", "50%");
        el.style.setProperty("--y", "50%");
      }}
      data-active="false"
      role="region"
      aria-label={title ?? "Glow card"}
    >
      <div className="gc-inner">
        {title && <h3 className="gc-title">{title}</h3>}
        {subtitle && <p className="gc-sub">{subtitle}</p>}
        <div className="gc-body">{children}</div>
      </div>

      {/* CSS ter-embed agar mandiri, tanpa ketergantungan util lain */}
      <style>{`
        .glow-card {
          --x: 50%;
          --y: 50%;
          --rx: 0deg;
          --ry: 0deg;
          position: relative;
          border-radius: 18px;
          transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));
          transition: transform .18s ease;
          will-change: transform;
        }

        /* ring + border gradient */
        .glow-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: 20px;
          padding: 1px;
          background:
            conic-gradient(from 180deg at var(--x) var(--y),
              #22d3ee 0deg, #10b981 90deg, #a78bfa 180deg, #22d3ee 360deg);
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          opacity: .9;
          filter: saturate(1.2);
        }

        /* glow yang mengikuti kursor */
        .glow-card::after {
          content: "";
          position: absolute;
          inset: -20%;
          background:
            radial-gradient(220px 160px at var(--x) var(--y),
              rgba(34,211,238,.22), rgba(16,185,129,.14) 35%, transparent 60%);
          filter: blur(22px);
          opacity: .7;
          transition: opacity .2s ease;
          pointer-events: none;
        }
        .glow-card[data-active="false"]::after { opacity: .35; }

        .gc-inner {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          background:
            linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
          border: 1px solid rgba(255,255,255,.14);
          backdrop-filter: blur(6px);
          padding: 16px 18px;
        }

        /* highlight garis miring tipis */
        .gc-inner::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(120deg, rgba(255,255,255,.08), transparent 30% 70%, rgba(255,255,255,.06));
          mix-blend-mode: overlay;
          opacity: .5;
          pointer-events: none;
        }

        .gc-title {
          margin: 0 0 4px 0;
          font-weight: 800;
          letter-spacing: .02em;
        }
        .gc-sub {
          margin: 0 0 8px 0;
          color: rgba(229,231,235,.85);
        }
        .gc-body {
          color: rgba(226,232,240,.95);
          line-height: 1.75;
        }
      `}</style>
    </div>
  );
}
