"use client";

import React, { useState, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ExternalLink, X, ArrowRight } from "lucide-react";
import Lenis from "lenis";

/* ═══════════════════════════════════════════════════════════════
   PROJECT DATA — replace url with your real deployed links
═══════════════════════════════════════════════════════════════ */
const PROJECTS = [
  {
    id: "nested",
    title: "Nested United",
    cat: "ERP System · 2025",
    blurb: "Enterprise cloud ERP: property management, HR, CRM, and double-entry accounting — one platform.",
    url: "https://example.com",
    bg: "linear-gradient(135deg, #1a2a4a 0%, #0f1b35 60%, #1a3a5c 100%)",
    accent: "#4A9EDB",
    accentSoft: "rgba(74,158,219,.15)",
    textColor: "#E8F4FF",
    mutedColor: "rgba(232,244,255,.5)",
    deco: "chat",
    story: {
      headline: "One platform.\nEvery operation.",
      overview: "Nested United is a comprehensive, enterprise-grade cloud ERP built for real estate and property management companies. It unifies Property & Booking Management with Airbnb iCal sync, a full CRM with Kanban pipeline, complete HR with payroll & GOSI calculations, and a professional double-entry accounting system with multi-theme PDF invoice generation.",
      challenge: "Building a single cohesive platform for five completely different business domains — while keeping the UI intuitive for non-technical users — required extremely careful data modelling. The Airbnb iCal sync required a real-time bridge handling race conditions from multiple booking platforms simultaneously.",
      outcome: "Actively used to manage hundreds of property units and tens of employees. The accounting module alone processes thousands of journal entries monthly, generating audit-ready financial reports automatically.",
      tech: ["Next.js 16", "Electron", "PostgreSQL", "Supabase", "NextAuth.js", "Tailwind CSS v4"],
    },
  },
  {
    id: "feps",
    title: "FEPS Hub",
    cat: "Ed Tech · 2025",
    blurb: "Academic management platform digitising Cairo University's Faculty of Economics and Political Science.",
    url: "https://example.com",
    bg: "linear-gradient(135deg, #0d2b1a 0%, #081a10 60%, #0d3320 100%)",
    accent: "#2ECC71",
    accentSoft: "rgba(46,204,113,.15)",
    textColor: "#E0FFF0",
    mutedColor: "rgba(224,255,240,.5)",
    deco: "shield",
    story: {
      headline: "A whole faculty,\nfully digitised.",
      overview: "FEPS Hub digitises every core academic pillar for the Faculty of Economics and Political Science at Cairo University — delivering a seamless trilingual experience (Arabic, English, French) for students, lecturers, and administrators.",
      challenge: "The course prerequisite system needed to handle hundreds of courses with intricate enrollment chains without circular dependencies. The automated exam scheduling engine had to generate conflict-free calendars across all departments in seconds.",
      outcome: "Covers unified digital profiles, real-time grade tracking & GPA calculation, secure academic materials distribution, conflict-free exam scheduling, and advanced course prerequisite enforcement.",
      tech: ["Next.js 15", "SQLite", "LibSQL", "Prisma", "next-intl", "TypeScript", "Tailwind CSS"],
    },
  },
  {
    id: "khadamat",
    title: "Khadamat",
    cat: "Gov Tech · 2026",
    blurb: "Citizen request routing platform — 780+ Egyptian government authorities, RBAC, and full audit trails.",
    url: "https://elshami.vercel.app/",
    bg: "linear-gradient(135deg, #2d1f00 0%, #1a1200 60%, #3a2800 100%)",
    accent: "#F0A500",
    accentSoft: "rgba(240,165,0,.15)",
    textColor: "#FFF8E6",
    mutedColor: "rgba(255,248,230,.5)",
    deco: "official",
    story: {
      headline: "780+ authorities.\nOne system.",
      overview: "Khadamat (خدمات) is a full-stack government operations platform for a regional inspection authority in Egypt. Employees log citizen requests, route them to the correct authority from a database of 780+ Egyptian government bodies, and track every status change — while citizens track their case by auto-generated request number (REQ-YYYY-XXXX).",
      challenge: "Modelling strict data isolation for three simultaneous user types — admins, employees, and anonymous citizens — without slowing down the dashboard. Row-level security in Supabase/PostgreSQL handles this at the database level, while an auto-numbering trigger provides a professional audit trail for every interaction.",
      outcome: "Live on Vercel and actively processing real government requests. Replaced a fully paper-based workflow — processing time for standard requests dropped from multiple days to hours.",
      tech: ["Next.js", "Supabase", "PostgreSQL", "TypeScript", "Tailwind CSS", "Row-Level Security"],
    },
  },
  {
    id: "aura",
    title: "Aura",
    cat: "Flutter App · 2024",
    blurb: "Cross-platform Flutter app for Windows & Android — offline-first with real-time Supabase sync.",
    url: "https://example.com",
    bg: "linear-gradient(135deg, #1e1030 0%, #120820 60%, #2a1445 100%)",
    accent: "#A78BFA",
    accentSoft: "rgba(167,139,250,.15)",
    textColor: "#F0EAFF",
    mutedColor: "rgba(240,234,255,.5)",
    deco: "orb",
    story: {
      headline: "Flutter.\nDone beautifully.",
      overview: "Aura is a cross-platform Flutter application targeting Windows desktop and Android mobile. Built with Riverpod for reactive state management and Drift (SQLite) for an offline-first local data layer that silently syncs with Supabase when connectivity is available.",
      challenge: "Achieving a truly seamless offline-first experience where the app works without internet then reconciles with Supabase on reconnection — without data loss or conflicts. Flutter Acrylic was used to implement a native Windows 11 Mica/Acrylic glass UI effect.",
      outcome: "A polished cross-platform app with smooth animations, beautiful FL Chart data visualisation, and a staggered grid layout that adapts intelligently across Windows and Android screen sizes.",
      tech: ["Flutter", "Dart", "Riverpod", "Drift (SQLite)", "Supabase", "FL Chart", "Flutter Acrylic"],
    },
  },
  {
    id: "alraseef",
    title: "Al-Raseef",
    cat: "News Platform · 2025",
    blurb: "Full Arabic news portal — RTL editorial layout, multi-category browsing, and fast article delivery.",
    url: "https://example.com",
    bg: "linear-gradient(135deg, #1a0a00 0%, #100500 60%, #280f00 100%)",
    accent: "#F97316",
    accentSoft: "rgba(249,115,22,.15)",
    textColor: "#FFF7ED",
    mutedColor: "rgba(255,247,237,.5)",
    deco: "sport",
    story: {
      headline: "الرصيف —\nYour trusted source.",
      overview: "Al-Raseef (الرصيف | بوابتك للخبر الموثوق) is a complete Arabic-language news platform, built RTL-first with a professional editorial layout. It features a dynamic hero section, multi-category article browsing (politics, economy, sports, culture), and a full article reading experience with proper Arabic typography.",
      challenge: "Building RTL-first in Next.js required rethinking every layout assumption — flexbox direction, text alignment, scroll behaviour, and font rendering. Arabic typography demands specific line-height and letter-spacing values that differ fundamentally from Latin type, and every editorial component required custom CSS.",
      outcome: "A fully functional Arabic news portal with a professional editorial design, SEO-ready Arabic metadata, and a scalable article architecture ready for real editorial team and CMS integration.",
      tech: ["Next.js", "React", "TypeScript", "Cairo Font", "Noto Kufi Arabic", "Tailwind CSS"],
    },
  },
] as const;

type P = (typeof PROJECTS)[number];

/* ═══════════════════════════════════════════════════════════════
   DECORATIVE ELEMENTS
═══════════════════════════════════════════════════════════════ */
// Optimized Background Component with React.memo for high performance
const DynamicBg = memo(function DynamicBg() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [mounted, setMounted] = useState(false);

  // Memoize random positions for data nodes to prevent jumpy re-renders and save CPU
  const nodes = useMemo(() => {
    return [...Array(12)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 5
    }));
  }, []);

  // Buttery-smooth spring damping for that "expensive" feel
  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0));
      mouseY.set(e.clientY - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0));
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div style={{ 
      position: "fixed", inset: 0, zIndex: -1, overflow: "hidden", 
      pointerEvents: "none", background: "var(--page)",
      willChange: "transform"
    }}>
      {/* 1. Subtle Statistical Grid Overlay */}
      <div style={{ 
        position: "absolute", inset: 0, 
        backgroundImage: `linear-gradient(var(--line2) 1px, transparent 1px), linear-gradient(90deg, var(--line2) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        opacity: 0.4,
        maskImage: "radial-gradient(circle at 50% 50%, black, transparent 80%)",
        WebkitMaskImage: "radial-gradient(circle at 50% 50%, black, transparent 80%)",
      }} />

      {/* 2. Static Grain / Texture Overlay (Cheaper than SVG noise) */}
      <div style={{ 
        position: "absolute", inset: 0, opacity: 0.05, mixBlendMode: "soft-light",
        backgroundImage: `url("https://www.transparenttextures.com/patterns/pinstriped-suit.png")`,
        pointerEvents: "none"
      }} />
      
      {/* 3. Optimized Parallax Blobs (No heavy blurs) */}
      {[
        { color: "var(--amber)", size: "50vw", top: "10%", left: "15%", factor: 0.04, op: 0.15 },
        { color: "var(--ink)", size: "45vw", top: "45%", right: "10%", factor: -0.05, op: 0.1 },
        { color: "var(--ivory)", size: "35vw", bottom: "10%", left: "25%", factor: 0.03, op: 0.4 },
      ].map((blob, i) => (
        <BlobItem key={i} {...blob} springX={springX} springY={springY} />
      ))}

      {/* 4. Neural Data Nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.2, 1] }}
          transition={{ duration: node.duration, repeat: Infinity, delay: node.delay }}
          style={{
            position: "absolute", top: node.top, left: node.left,
            width: 4, height: 4, background: "var(--amber)",
            borderRadius: "50%", filter: "blur(2px)",
            willChange: "transform"
          }}
        />
      ))}
    </div>
  );
});

// Helper component for parallax blobs to use motion values correctly
const BlobItem = memo(({ color, size, top, left, right, bottom, factor, op, springX, springY }: any) => {
  const tx = useTransform(springX, (v: number) => v * factor);
  const ty = useTransform(springY, (v: number) => v * factor);

  return (
    <motion.div 
      style={{ 
        position: "absolute", 
        top, left, right, bottom,
        width: size, height: size, borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 80%)`,
        opacity: op,
        x: tx, y: ty,
        willChange: "transform"
      }} 
    />
  );
});

/* ═══════════════════════════════════════════════════════════════
   VISUAL STORYTELLING (Project Specific Stages)
═══════════════════════════════════════════════════════════════ */
// Helper stages defined before ProjectNarrative to avoid reference errors
const NestedStage = memo(({ accent }: { accent: string }) => {
  const [scene, setScene] = useState(0);
  useEffect(() => {
    const itv = setInterval(() => setScene(s => (s + 1) % 3), 4500);
    return () => clearInterval(itv);
  }, []);

  const modules = [
    { label: "Accounts", x: -100, y: -60, d: 0 },
    { label: "CRM", x: 100, y: -60, d: 0.2 },
    { label: "Inventory", x: 100, y: 60, d: 0.4 },
    { label: "HRM", x: -100, y: 60, d: 0.6 },
  ];

  return (
    <div style={{ position: "relative", height: 320, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.1)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 50% 50%, ${accent}08 0%, transparent 70%)` }} />
      <AnimatePresence mode="wait">
        {scene === 0 && (
          <motion.div key="s1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ type: "spring", stiffness: 80, damping: 20 }}
            style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: 120, height: 120, borderRadius: "50%", background: `rgba(0,0,0,.6)`, backdropFilter: "blur(10px)", border: `1px solid ${accent}44`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, boxShadow: `0 0 30px ${accent}22` }}>
              <img src="/nested-logo.png" style={{ width: "70%", height: "70%", objectFit: "contain" }} />
            </motion.div>
            <svg style={{ position: "absolute", inset: -150, width: 600, height: 600, pointerEvents: "none" }}>
              {modules.map((m, i) => (
                <motion.path key={i} d={`M 300 300 Q ${300 + m.x*0.5} ${300 + m.y*1.2} ${300 + m.x} ${300 + m.y}`} stroke={accent} strokeWidth="1.5" strokeDasharray="5 5" fill="none" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.3 }} transition={{ delay: m.d + 0.5, duration: 2 }} />
              ))}
            </svg>
            {modules.map((m, i) => (
              <motion.div key={i} initial={{ x: m.x * 1.5, y: m.y * 1.5, opacity: 0 }} animate={{ x: m.x, y: m.y, opacity: 1 }} transition={{ delay: m.d, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: "absolute", padding: "8px 16px", background: "rgba(255,255,255,.03)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 20px rgba(0,0,0,.2)" }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: ".1em" }}>{m.label.toUpperCase()}</span>
                <motion.div animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: m.d }} style={{ position: "absolute", inset: -1, borderRadius: 10, border: `1px solid ${accent}` }} />
              </motion.div>
            ))}
          </motion.div>
        )}
        {scene === 1 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ type: "spring", stiffness: 80, damping: 20 }}
            style={{ width: "80%", height: "65%", background: "rgba(255,255,255,.02)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 16, padding: 24, position: "relative" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, height: "100%" }}>
              {[...Array(6)].map((_, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                  style={{ width: "30%", height: "40%", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.04)", borderRadius: 8, display: "flex", flexDirection: "column", padding: 10, gap: 5 }}>
                  <div style={{ width: "40%", height: 3, background: accent, opacity: 0.3 }} />
                  <div style={{ width: "90%", height: 2, background: "#fff", opacity: 0.05 }} />
                  <div style={{ width: "70%", height: 2, background: "#fff", opacity: 0.05 }} />
                </motion.div>
              ))}
            </div>
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: "absolute", top: 15, right: 20, width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 10px #22c55e" }} />
          </motion.div>
        )}
        {scene === 2 && (
          <motion.div key="s3" initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} 
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            <div style={{ position: "relative" }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{ width: 100, height: 100, border: `1px solid ${accent}33`, borderRadius: "50%" }}>
                <motion.div style={{ position: "absolute", top: -5, left: "50%", width: 10, height: 10, background: accent, borderRadius: "50%", boxShadow: `0 0 15px ${accent}` }} />
              </motion.div>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 32 }}>🔄</span>
              </div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, color: accent, letterSpacing: ".3em" }}>GLOBAL MODULE SYNC</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ position: "absolute", bottom: 24, display: "flex", gap: 10 }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i} animate={{ width: scene === i ? 32 : 8, background: scene === i ? accent : "rgba(255,255,255,.2)" }} style={{ height: 2, borderRadius: 1 }} />
        ))}
      </div>
    </div>
  );
});

const FepsStage = memo(({ accent }: { accent: string }) => {
  const [scene, setScene] = useState(0);
  useEffect(() => {
    const itv = setInterval(() => setScene(s => (s + 1) % 3), 4500);
    return () => clearInterval(itv);
  }, []);

  return (
    <div style={{ position: "relative", height: 320, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.1)", overflow: "hidden" }}>
       <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 30% 70%, ${accent}12 0%, transparent 60%)` }} />
      <AnimatePresence mode="wait">
        {scene === 0 && (
          <motion.div key="s1" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", stiffness: 80, damping: 20 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} style={{ width: 100, height: 100, color: accent, position: "relative", perspective: 1000 }}>
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill={`${accent}22`} />
                <path d="M22 10V17C22 18.1 21.1 19 20 19H4C2.9 19 2 18.1 2 17V10" />
                <motion.path d="M12 12V22" strokeDasharray="2 4" animate={{ opacity: [0.1, 0.6, 0.1] }} transition={{ duration: 3, repeat: Infinity }} />
              </svg>
            </motion.div>
            <span style={{ marginTop: 24, fontSize: 11, fontWeight: 900, color: accent, letterSpacing: ".4em", textShadow: `0 0 10px ${accent}44` }}>ACADEMIC CORE</span>
          </motion.div>
        )}
        {scene === 1 && (
          <motion.div key="s2" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ type: "spring", stiffness: 100, damping: 25 }}
            style={{ width: "85%", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 110, background: "rgba(255,255,255,.02)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 10, boxShadow: "0 10px 20px rgba(0,0,0,.2)" }}>
                <div style={{ width: i === 1 ? "100%" : "40%", height: 3, background: accent, opacity: i === 1 ? 1 : 0.4 }} />
                <div style={{ flex: 1, background: "rgba(255,255,255,.03)", borderRadius: 4 }} />
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.5 + i*0.1, duration: 2 }} style={{ height: 2, background: accent, borderRadius: 1, opacity: 0.6 }} />
              </div>
            ))}
          </motion.div>
        )}
        {scene === 2 && (
          <motion.div key="s3" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.15, opacity: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{ display: "flex", alignItems: "center", gap: 24, padding: "20px 40px", background: "rgba(255,255,255,.01)", border: "1px solid rgba(255,255,255,.03)", borderRadius: 20, backdropFilter: "blur(4px)" }}>
            <span style={{ fontSize: 48, fontWeight: 900, color: accent, filter: `drop-shadow(0 0 15px ${accent}66)`, letterSpacing: "-.02em" }}>4.0</span>
            <div style={{ width: 160, height: 8, background: "rgba(255,255,255,.08)", borderRadius: 4, overflow: "hidden", position: "relative" }}>
               <motion.div initial={{ x: "-100%" }} animate={{ x: "0%" }} transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }} style={{ height: "100%", width: "100%", background: `linear-gradient(90deg, transparent, ${accent})` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ position: "absolute", bottom: 24, display: "flex", gap: 10 }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i} animate={{ width: scene === i ? 32 : 8, background: scene === i ? accent : "rgba(255,255,255,.15)" }} style={{ height: 2, borderRadius: 1 }} />
        ))}
      </div>
    </div>
  );
});

const KhadamatStage = memo(({ accent }: { accent: string }) => {
  const [scene, setScene] = useState(0);
  useEffect(() => {
    const itv = setInterval(() => setScene(s => (s + 1) % 3), 4500);
    return () => clearInterval(itv);
  }, []);

  return (
    <div style={{ position: "relative", height: 320, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.1)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${accent}03 1px, transparent 1px), linear-gradient(90deg, ${accent}03 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />
      <AnimatePresence mode="wait">
        {scene === 0 && (
          <motion.div key="s1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, filter: "blur(10px)" }} transition={{ duration: 0.8 }}
            style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 4, repeat: Infinity }}
              style={{ width: 160, height: 160, borderRadius: "50%", border: `1px dashed ${accent}44` }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 100 }}
                style={{ width: 60, height: 60, background: accent, borderRadius: "50%", boxShadow: `0 0 30px ${accent}44`, display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 900 }}>G</motion.div>
            </div>
            {[0, 1, 2, 3].map(i => (
              <motion.div key={i} animate={{ y: [-100, 100], opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.7 }}
                style={{ position: "absolute", width: 2, height: 40, background: `linear-gradient(to bottom, transparent, ${accent}, transparent)`, left: `${25 + i * 15}%` }} />
            ))}
          </motion.div>
        )}
        {scene === 1 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{ width: "75%", height: 140, background: "rgba(255,255,255,.02)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ width: "35%", height: 12, background: accent, borderRadius: 2 }} />
            {[...Array(3)].map((_, i) => (
              <motion.div key={i} initial={{ width: 0 }} animate={{ width: `${80 - i * 15}%` }} transition={{ delay: 0.4 + i*0.1 }} style={{ height: 6, background: "rgba(255,255,255,.1)", borderRadius: 3 }} />
            ))}
            <div style={{ marginTop: "auto", display: "flex", gap: 8 }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: accent, opacity: 0.4 - i * 0.1 }} />
              ))}
            </div>
          </motion.div>
        )}
        {scene === 2 && (
          <motion.div key="s3" initial={{ rotateX: 45, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} transition={{ duration: 0.8 }}
            style={{ width: 120, height: 160, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: 20, position: "relative" }}>
            <motion.div animate={{ y: [0, 120, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", inset: "0 5px", height: 2, background: accent, boxShadow: `0 0 10px ${accent}`, zIndex: 10 }} />
            <div style={{ height: 4, width: "60%", background: accent, opacity: 0.2, marginBottom: 15 }} />
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ height: 2, width: "100%", background: "rgba(255,255,255,.05)", marginBottom: 10 }} />
            ))}
            <span style={{ position: "absolute", bottom: 20, right: 20, fontSize: 10, fontWeight: 900, color: accent }}>VERIFIED</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ position: "absolute", bottom: 24, display: "flex", gap: 10 }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i} animate={{ width: scene === i ? 32 : 8, background: scene === i ? accent : "rgba(255,255,255,.2)" }} style={{ height: 2, borderRadius: 1 }} />
        ))}
      </div>
    </div>
  );
});

const AuraStage = memo(({ accent }: { accent: string }) => {
  const [scene, setScene] = useState(0);
  useEffect(() => {
    const itv = setInterval(() => setScene(s => (s + 1) % 3), 4500);
    return () => clearInterval(itv);
  }, []);

  return (
    <div style={{ position: "relative", height: 320, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.1)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 70% 30%, ${accent}08 0%, transparent 60%)` }} />
      <AnimatePresence mode="wait">
        {scene === 0 && (
          <motion.div key="s1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <div style={{ width: 50, height: 90, border: "2px solid rgba(255,255,255,.15)", borderRadius: 12, position: "relative" }}>
               <div style={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", width: 14, height: 2, background: "rgba(255,255,255,.2)", borderRadius: 1 }} />
            </div>
            <div style={{ position: "relative", width: 50, height: 2, background: accent, opacity: 0.2 }}>
              <motion.div animate={{ x: [-25, 25] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                style={{ position: "absolute", top: -3, width: 8, height: 8, background: accent, borderRadius: "50%", boxShadow: `0 0 15px ${accent}` }} />
            </div>
            <div style={{ width: 100, height: 70, border: "2px solid rgba(255,255,255,.15)", borderRadius: 8 }} />
          </motion.div>
        )}
        {scene === 1 && (
          <motion.div key="s2" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} 
            style={{ width: "80%", height: 140, display: "flex", alignItems: "flex-end", gap: 6 }}>
            {[40, 80, 55, 100, 70, 90, 50].map((h, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.05, type: "spring", stiffness: 100, damping: 15 }}
                style={{ flex: 1, background: `linear-gradient(to top, ${accent}, ${accent}22)`, borderRadius: "4px 4px 0 0", boxShadow: `0 0 20px ${accent}22` }} />
            ))}
          </motion.div>
        )}
        {scene === 2 && (
          <motion.div key="s3" initial={{ rotateY: 30, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: -30, opacity: 0 }}
            style={{ position: "relative", perspective: 1200 }}>
            <div style={{ width: 180, height: 120, background: "rgba(255,255,255,.02)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 16, boxShadow: "0 20px 40px rgba(0,0,0,.3)" }} />
            <motion.div animate={{ y: [0, -10, 0], x: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "absolute", top: -30, right: -30, width: 80, height: 80, background: `${accent}11`, backdropFilter: "blur(8px)", border: `1px solid ${accent}44`, borderRadius: 20, boxShadow: `0 10px 30px ${accent}11` }} />
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ position: "absolute", bottom: 24, display: "flex", gap: 10 }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i} animate={{ width: scene === i ? 32 : 8, background: scene === i ? accent : "rgba(255,255,255,.2)" }} style={{ height: 2, borderRadius: 1 }} />
        ))}
      </div>
    </div>
  );
});

const AlRaseefStage = memo(({ accent }: { accent: string }) => {
  const [scene, setScene] = useState(0);
  useEffect(() => {
    const itv = setInterval(() => setScene(s => (s + 1) % 3), 4500);
    return () => clearInterval(itv);
  }, []);

  return (
    <div style={{ position: "relative", height: 320, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.1)", overflow: "hidden", padding: 24 }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.05, background: `repeating-linear-gradient(90deg, ${accent} 0px, transparent 1px, transparent 48px)` }} />
      <AnimatePresence mode="wait">
        {scene === 0 && (
          <motion.div key="s1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, filter: "blur(10px)" }} transition={{ duration: 0.8 }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr 1fr", gridTemplateRows: "1fr 1.2fr", gap: 12, width: "100%", height: "100%", direction: "rtl", position: "relative" }}>
            {[...Array(5)].map((_, i) => (
              <motion.div key={i} style={{ background: i === 1 ? accent : "rgba(255,255,255,.03)", borderRadius: 12, gridColumn: i === 1 ? "span 2" : "auto", gridRow: i === 1 ? "span 2" : "auto", border: "1px solid rgba(255,255,255,.05)", boxShadow: i === 1 ? `0 10px 30px ${accent}22` : "none" }} />
            ))}
          </motion.div>
        )}
        {scene === 1 && (
          <motion.div key="s2" initial={{ x: 120, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -120, opacity: 0 }} transition={{ type: "spring", stiffness: 100, damping: 22 }}
             style={{ width: "100%", direction: "rtl", position: "relative" }}>
            <div style={{ height: 180, background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.08)", backdropFilter: "blur(10px)", borderRadius: 20, padding: 32, display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 30px 60px rgba(0,0,0,.4)" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: 100 }} transition={{ duration: 1 }} style={{ height: 16, background: accent, borderRadius: 2 }} />
              <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,.1)", borderRadius: 3 }} />
              <div style={{ width: "90%", height: 6, background: "rgba(255,255,255,.05)", borderRadius: 3 }} />
              <div style={{ width: "70%", height: 6, background: "rgba(255,255,255,.05)", borderRadius: 3 }} />
              <motion.div style={{ marginTop: "auto", width: 120, height: 36, borderRadius: 10, border: `1px solid ${accent}44`, alignSelf: "flex-start" }} />
            </div>
          </motion.div>
        )}
        {scene === 2 && (
          <motion.div key="s3" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.15, opacity: 0 }} transition={{ duration: 0.8 }}
            style={{ display: "flex", flexDirection: "column", gap: 16, width: "75%", padding: 24, background: "rgba(255,255,255,.02)", backdropFilter: "blur(4px)", borderRadius: 16, border: "1px solid rgba(255,255,255,.05)" }}>
            <div style={{ height: 40, border: `1px solid ${accent}44`, borderRadius: 20, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ width: 2, height: 20, background: accent }} />
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 12, background: "rgba(255,255,255,.04)", borderRadius: 6, width: `${100 - i * 12}%`, alignSelf: "flex-end" }} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ position: "absolute", bottom: 24, display: "flex", gap: 10 }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i} animate={{ width: scene === i ? 32 : 8, background: scene === i ? accent : "rgba(255,255,255,.2)" }} style={{ height: 2, borderRadius: 1 }} />
        ))}
      </div>
    </div>
  );
});

const AL_LOGOS: Record<string, string> = {
  "next.js": "M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.75 18.25l-6.75-8.5v8.5h-1.5v-11h1.5l6.75 8.5v-8.5h1.5v11h-1.5z",
  "tailwind": "M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.676,10.648,15.2,12.2,18.4,12.2c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.725,6.352,15.201,4.8,12.001,4.8z M6.001,12.2c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.187,1.213,2.712,2.776,5.912,2.776c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.725,13.752,9.201,12.2,6.001,12.2z",
  "supabase": "M21.362 9.354H12.704L19.466 1.35A.556.556 0 0 0 19.043.434H7.436a.555.555 0 0 0-.441.214L.19 11.23a.556.556 0 0 0 .441.89h8.658L2.534 20.122a.555.555 0 0 0 .844.62.55.55 0 0 0 .092-.08L16.564 7.5a.556.556 0 0 0-.423-.924h-1.8z",
  "typescript": "M1.125 0C.502 0 0 .502 0 1.125V22.875C0 23.498.502 24 1.125 24H22.875C23.498 24 24 23.498 24 22.875V1.125C24 .502 23.498 0 22.875 0H1.125ZM17.46 15.15C17.46 14.517 17.586 13.938 17.838 13.413C18.09 12.888 18.452 12.437 18.924 12.06C19.395 11.683 19.965 11.493 20.634 11.493C21.054 11.493 21.439 11.543 21.789 11.643V13.513C21.498 13.407 21.192 13.354 20.871 13.354C20.536 13.354 20.25 13.438 20.013 13.607C19.776 13.776 19.601 14.004 19.488 14.292C19.375 14.58 19.318 14.887 19.318 15.213C19.318 15.54 19.375 15.847 19.488 16.135C19.601 16.423 19.776 16.657 20.013 16.837C20.25 17.017 20.536 17.107 20.871 17.107C21.213 17.107 21.519 17.047 21.789 16.927V18.827C21.432 18.94 21.047 18.997 20.634 18.997C19.962 18.997 19.392 18.807 18.924 18.427C18.456 18.047 18.095 17.593 17.843 17.065C17.591 16.537 17.465 15.899 17.465 15.25L17.46 15.15Z",
  "postgresql": "M13.52 11.603c-.22-.647-.532-1.25-.92-1.785.49-.074.88-.344.88-.737 0-.486-.595-.882-1.332-.882-.244 0-.472.046-.666.126-.145-.583-.437-1.1-.855-1.503.273-.13.46-.358.46-.62 0-.414-.467-.75-1.044-.75-.245 0-.466.06-.638.158-.282-.373-.674-.668-1.127-.85C8.36 4.312 8.5 3.868 8.5 3.402c0-1.88-1.552-3.402-3.466-3.402C3.12 0 1.566 1.523 1.566 3.402c0 .503.118.978.328 1.402-.553.076-1.012.352-1.154.733-.217-.07-.46-.112-.72-.112C1.566 5.425.5 6.467.5 7.75c0 .35.08.68.225.98-.328.273-.55.652-.614 1.082-.07.03-.132.067-.19.11-.275.2-.424.482-.424.793 0 .428.283.82.748 1.036-.027.08-.046.16-.046.248 0 .484.595.88 1.332.88.356 0 .68-.09.914-.24.167.33.456.6.814.773-.02.054-.034.11-.034.167 0 .414.464.75 1.044.75.204 0 .393-.042.548-.112.283.374.676.67 1.127.85-.064.24-.1.49-.1.748C6.545 18.067 8.1 19.5 10.015 19.5c1.914 0 3.464-1.433 3.464-3.2 0-.457-.097-.887-.272-1.278.435-.07.828-.31 1.038-.646.128.057.27.09.42-.09.303-.023.51-.237.6-.51.107.036.21.05.323.05 1.044 0 1.914-.848 1.914-1.914s-.87-1.914-1.914-1.914c-.024 0-.046.002-.068.004.0-.0-.0-.0-.0-.0z",
  "flutter": "M14.314 0L2.3 12L6 15.7L21.684.012L14.314 0ZM21.684 15.086L14.31 22.46L10.532 18.663L6.755 22.454L14.314 30L21.684 22.628V15.087",
  "dart": "M4.1 10.2L10.2 4.1C10.6 3.7 11.2 3.7 11.6 4.1L21.8 14.3L19.4 21.4C19.1 22.3 18.2 22.9 17.2 22.8H4.6C3.1 22.8 2 21.4 2.5 20L4.1 10.2ZM24 16.5L20.5 13L16 17.5L19.5 21L24 16.5Z",
  "prisma": "M12 0c-.232 0-.455.092-.621.258L.258 11.379a.878.878 0 0 0 0 1.242l4.814 4.814 6.928-6.928c.484-.484 1.267-.484 1.751 0l6.928 6.928 4.814-4.814a.878.878 0 0 0 0-1.242L12.621.258A.878.878 0 0 0 12 0z",
  "react": "M23.32 10.648a.496.496 0 0 0-.196-.282 12.016 12.016 0 0 0-4.048-1.921c.54-.316 1.055-.674 1.536-1.08a.495.495 0 0 0 .114-.658 12.052 12.052 0 0 0-3.34-3.352.492.492 0 0 0-.658.114c-.456.545-.845 1.134-1.16 1.748a12.112 12.112 0 0 0-1.93-4.045.499.499 0 0 0-.756 0 12.11 12.11 0 0 0-1.93 4.045c-.316-.614-.705-1.203-1.16-1.748a.497.497 0 0 0-.658-.114 12.052 12.052 0 0 0-3.34 3.352.496.496 0 0 0 .114.658c.481.406.996.764 1.536 1.08a12.016 12.016 0 0 0-4.048 1.921.498.498 0 0 0-.196.282 12.052 12.052 0 0 0 0 4.704.498.498 0 0 0 .196.282c1.22.84 2.508 1.53 3.868 2.062a12.032 12.032 0 0 0-1.356 1.298.496.496 0 0 0-.114.658 12.052 12.052 0 0 0 3.34 3.352.496.496 0 0 0 .658-.114c.456-.545.845-1.134 1.16-1.748a12.112 12.112 0 0 0 1.93 4.045.5.5 0 0 0 .756 0 12.11 12.11 0 0 0 1.93-4.045c.315.614.704 1.203 1.16 1.748a.498.498 0 0 0 .658.114 12.052 12.052 0 0 0 3.34-3.352.496.496 0 0 0-.114-.658 12.032 12.032 0 0 0-1.356-1.298c1.36-.532 2.648-1.222 3.868-2.062a.498.498 0 0 0 .196-.282 12.052 12.052 0 0 0 0-4.704zm-11.32 8.136c-3.748 0-6.786-3.038-6.786-6.784 0-3.746 3.038-6.784 6.786-6.784 3.748 0 6.786 3.038 6.786 6.784 0 3.746-3.038 6.784-6.786 6.784z",
  "riverpod": "M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5",
  "drift": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5l-6 4.5z",
  "node.js": "M12 2L3.5 7v10l8.5 5 8.5-5V7L12 2zm0 17.5l-6.5-3.8V8.3l6.5-3.8 6.5 3.8v7.4l-6.5 3.8z",
};

function TechIcon({ name, accent, color }: { name: string; accent: string; color: string }) {
  const [hov, setHov] = useState(false);
  const key = name.toLowerCase().split(' ')[0];
  const path = AL_LOGOS[key] || "M12 2L2 7L12 12L22 7L12 2Z"; 

  return (
    <motion.div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 44, height: 44,
        background: hov ? `${accent}15` : "rgba(255,255,255,0.03)",
        border: `1px solid ${hov ? accent : "rgba(255,255,255,0.08)"}`,
        borderRadius: 12,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        cursor: "default", position: "relative"
      }}
    >
      <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, fill: hov ? accent : color, opacity: hov ? 1 : 0.4, transition: "all 0.3s" }}>
        <path d={path} />
      </svg>
      {hov && (
        <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ position: "absolute", bottom: -28, fontSize: 10, fontWeight: 800, color: accent, whiteSpace: "nowrap", letterSpacing: ".05em" }}>
          {name.toUpperCase()}
        </motion.span>
      )}
    </motion.div>
  );
}

const ProjectNarrative = memo(({ id, accent }: { id: string; accent: string }) => {
  if (id === "nested") return <NestedStage accent={accent} />;
  if (id === "feps") return <FepsStage accent={accent} />;
  if (id === "khadamat") return <KhadamatStage accent={accent} />;
  if (id === "aura") return <AuraStage accent={accent} />;
  if (id === "alraseef") return <AlRaseefStage accent={accent} />;
  return null;
});

const BrowserMockup = memo(({ url, accent }: { url: string; accent: string }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      // We want to scale 1280px to fit exactly in width w
      setScale(w / 1280);
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      style={{ 
        width: "100%", 
        aspectRatio: "14/9",
        background: "rgba(0,0,0,.35)",
        backdropFilter: "blur(12px)",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,.12)",
        overflow: "hidden",
        boxShadow: "0 40px 80px -20px rgba(0,0,0,.4)",
        position: "relative",
        willChange: "transform",
        margin: "32px 0"
      }}
    >
      <div style={{ height: 32, background: "rgba(255,255,255,.05)", borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", padding: "0 12px", gap: 6, position: "relative", zIndex: 20 }}>
        {[ "#FF5F57", "#FFBD2E", "#28C840" ].map((c, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.8 }} />
        ))}
        <div style={{ margin: "0 auto 0 16px", height: 18, flex: 1, maxWidth: 240, background: "rgba(0,0,0,.2)", borderRadius: 4, display: "flex", alignItems: "center", padding: "0 8px", overflow: "hidden", gap: 6 }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,.3)", whiteSpace: "nowrap" }}>{url.replace("https://", "")}</span>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,.4)", display: "flex", transition: "color .2s" }}
           onMouseEnter={e => e.currentTarget.style.color = accent}
           onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.4)"}>
           <ExternalLink size={14} />
        </a>
      </div>
      
      <div style={{ width: "100%", height: "calc(100% - 32px)", position: "relative", overflow: "hidden" }}>
        <iframe 
          src="/api/proxy/" 
          style={{ 
            width: "1280px", 
            height: "800px", 
            border: "none", 
            background: "#fff", 
            opacity: 0.95,
            position: "absolute",
            top: 0,
            left: 0,
            transformOrigin: "top left",
            transform: `scale(${scale})`,
          }}
          title="Project Live Preview"
        />
      </div>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", boxShadow: "inset 0 0 40px rgba(0,0,0,.1)" }} />
    </motion.div>
  );
});


/* ═══════════════════════════════════════════════════════════════
   DECORATIVE SVG ELEMENTS (unique per card)
═══════════════════════════════════════════════════════════════ */
function Deco({ type, accent, hov }: { type: string; accent: string; hov: boolean }) {
  const s: React.CSSProperties = {
    position: "absolute", inset: 0, pointerEvents: "none",
    overflow: "hidden", borderRadius: "inherit",
  };

  if (type === "chat") return (
    <div style={s}>
      {[
        { x: "10%", y: "12%", w: 120, r: "0 20px 20px 20px", o: hov ? 0.3 : 0.12, delay: 0 },
        { x: "28%", y: "38%", w: 90,  r: "20px 20px 0 20px",  o: hov ? 0.25 : 0.08, delay: 0.1 },
        { x: "12%", y: "58%", w: 110, r: "0 20px 20px 20px",  o: hov ? 0.2 : 0.06, delay: 0.2 },
      ].map((b, i) => (
        <motion.div key={i} animate={{ opacity: b.o, x: hov ? 6 : 0 }}
          transition={{ delay: b.delay, duration: 0.5 }}
          style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: 28,
            borderRadius: b.r, background: accent, opacity: b.o }} />
      ))}
    </div>
  );

  if (type === "shield") return (
    <div style={s}>
      <motion.svg animate={{ rotate: hov ? 5 : 0, scale: hov ? 1.05 : 1 }}
        transition={{ duration: 0.6 }}
        style={{ position: "absolute", right: "-10%", bottom: "-8%", opacity: hov ? 0.18 : 0.08 }}
        width="220" height="220" viewBox="0 0 100 100">
        <path d="M50 5 L90 20 L90 55 C90 75 70 90 50 95 C30 90 10 75 10 55 L10 20 Z"
          fill="none" stroke={accent} strokeWidth="2" />
        <path d="M50 20 L75 30 L75 52 C75 65 63 75 50 79 C37 75 25 65 25 52 L25 30 Z"
          fill={accent} opacity="0.3" />
      </motion.svg>
      {[...Array(4)].map((_, i) => (
        <motion.div key={i} animate={{ opacity: hov ? 0.15 : 0.05 }}
          style={{
            position: "absolute", left: `${15 + i * 22}%`, top: "15%",
            width: 2, height: "70%", background: accent, borderRadius: 1,
          }} />
      ))}
    </div>
  );

  if (type === "official") return (
    <div style={s}>
      <motion.div animate={{ opacity: hov ? 1 : 0.6 }}
        style={{ position: "absolute", top: 20, right: 20, width: 80, height: 80, borderRadius: "50%",
          border: `2px solid ${accent}`, opacity: 0.15, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", border: `1px solid ${accent}`, opacity: 0.5 }} />
      </motion.div>
      {[0, 1, 2].map(i => (
        <motion.div key={i} animate={{ scaleX: hov ? 1 : 0.7, opacity: hov ? 0.25 : 0.1 }}
          transition={{ delay: i * 0.06 }} style={{
            position: "absolute", left: "8%", bottom: `${30 + i * 18}%`,
            width: "50%", height: 1, background: accent, transformOrigin: "left",
          }} />
      ))}
    </div>
  );

  if (type === "orb") return (
    <div style={s}>
      <motion.div animate={{ scale: hov ? 1.2 : 1, opacity: hov ? 0.35 : 0.15 }}
        transition={{ duration: 0.8 }}
        style={{
          position: "absolute", right: "-20%", top: "-20%",
          width: 220, height: 220, borderRadius: "50%",
          background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`,
        }} />
      <motion.div animate={{ rotate: hov ? 360 : 0 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", right: "5%", top: "5%", width: 100, height: 100 }}>
        {[0, 60, 120, 180, 240, 300].map(angle => (
          <div key={angle} style={{
            position: "absolute", left: "50%", top: "50%",
            width: 2, height: 40, background: accent, opacity: 0.12,
            transformOrigin: "top",
            transform: `rotate(${angle}deg) translateX(-50%)`,
          }} />
        ))}
      </motion.div>
    </div>
  );

  if (type === "grid") return (
    <div style={s}>
      {[...Array(5)].map((_, i) => (
        <motion.div key={`v${i}`} animate={{ opacity: hov ? 0.15 : 0.06 }}
          style={{ position: "absolute", left: `${15 + i * 18}%`, top: 0, bottom: 0, width: 1, background: accent }} />
      ))}
      {[...Array(4)].map((_, i) => (
        <motion.div key={`h${i}`} animate={{ opacity: hov ? 0.12 : 0.05 }}
          style={{ position: "absolute", top: `${20 + i * 20}%`, left: 0, right: 0, height: 1, background: accent }} />
      ))}
      <motion.div animate={{ scale: hov ? 1.1 : 1, opacity: hov ? 0.25 : 0.1 }}
        style={{ position: "absolute", right: "10%", bottom: "10%", width: 60, height: 60,
          border: `2px solid ${accent}`, borderRadius: 8 }} />
    </div>
  );

  if (type === "sport") return (
    <div style={s}>
      {[-20, 0, 20, 40].map((deg, i) => (
        <motion.div key={i}
          animate={{ x: hov ? -8 : 0, opacity: hov ? 0.2 : 0.07 }}
          transition={{ delay: i * 0.05 }}
          style={{
            position: "absolute", right: `${-5 + i * 8}%`, top: 0, bottom: 0,
            width: 3, background: accent, borderRadius: 2,
            transform: `rotate(${15}deg)`,
          }} />
      ))}
      <motion.div animate={{ scale: hov ? 1.1 : 1, opacity: hov ? 0.2 : 0.08 }}
        style={{ position: "absolute", right: "12%", top: "15%", width: 80, height: 80,
          borderRadius: "50%", border: `2px solid ${accent}` }} />
    </div>
  );

  return null;
}

/* ═══════════════════════════════════════════════════════════════
   STORY OVERLAY
═══════════════════════════════════════════════════════════════ */
const ez = [0.22, 1, 0.36, 1] as const;

function StoryOverlay({ p, close }: { p: P; close: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const up = (delay = 0) => ({
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { delay, duration: 0.6, ease: ez } },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={close}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(246,241,233,.45)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "clamp(0px, 4vw, 40px)",
      }}
    >
      <motion.div
        layoutId={`card-${p.id}`}
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 1100,
          maxHeight: "90vh",
          background: p.bg,
          borderRadius: 32, overflow: "hidden", 
          position: "relative",
          display: "flex", flexDirection: "column",
          boxShadow: "0 50px 100px -20px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.05)",
        }}
      >
        {/* Fixed Header Bar (Mobile Friendly) */}
        <div style={{ 
          position: "absolute", top: 32, right: 32, zIndex: 10,
          display: "flex", gap: 12 
        }}>
          <button onClick={close} style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(255,255,255,.15)", backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,.1)",
            color: p.textColor, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .2s"
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.background = "rgba(255,255,255,.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "rgba(255,255,255,.15)"; }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Global Grain/Noise on Modal Background */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        {/* --- MAIN SPLIT LAYOUT --- */}
        <div style={{ display: "flex", flexWrap: "nowrap", height: "calc(90vh - 0px)", overflow: "hidden" }}>
          
          {/* Identity Sidebar (Fixed on Desktop) */}
          <div style={{ 
            flex: "1 1 380px", padding: "64px 48px", 
            borderRight: "1px solid rgba(255,255,255,.07)",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            background: "rgba(0,0,0,.05)"
          }}>
            <div>
              <motion.img 
                variants={up(.05)} initial="hidden" animate="show"
                src="/logo.png" style={{ width: 80, height: 80, objectFit: "contain", marginBottom: 48, mixBlendMode: "multiply" }} 
              />
              <motion.span variants={up(.1)} initial="hidden" animate="show"
                style={{ display: "block", fontSize: 13, fontWeight: 700, color: p.accent, letterSpacing: ".08em", marginBottom: 12 }}>
                {p.cat.split(" · ")[1]} · {p.cat.split(" · ")[0]}
              </motion.span>
              <motion.h2 variants={up(.15)} initial="hidden" animate="show"
                style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 800, color: p.textColor, letterSpacing: "-.04em", lineHeight: 1.0, marginBottom: 24 }}>
                {p.title}
              </motion.h2>
              <motion.div variants={up(.2)} initial="hidden" animate="show"
                style={{ width: 40, height: 4, background: p.accent, borderRadius: 2 }} 
              />
              
              {p.id === "khadamat" && (
                <BrowserMockup url={p.url} accent={p.accent} />
              )}
            </div>

            <motion.div variants={up(.45)} initial="hidden" animate="show">
              {p.url.includes("example.com") ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: p.mutedColor, fontSize: 13, fontWeight: 500 }}>
                  <span style={{ fontSize: 18 }}>🔒</span> Project details are classified
                </div>
              ) : (
                <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ 
                  display: "inline-flex", alignItems: "center", gap: 10,
                  background: p.accent, color: "#fff", padding: "16px 32px", borderRadius: 14,
                  fontWeight: 700, fontSize: 15, transition: "transform .25s ease"
                }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  Visit Project <ExternalLink size={16} />
                </a>
              )}
            </motion.div>
          </div>

          {/* Narrative Section (Scrollable) */}
          <div 
            data-lenis-prevent
            className="narrative-scroll"
            style={{ 
              flex: "1 1 65%", 
              position: "relative",
              overflowY: "auto",
              padding: "64px 48px",
              background: "rgba(0,0,0,.02)",
              flexShrink: 1, 
              height: "100%",
              maxHeight: "none",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.1) transparent"
            }}
          >
            <style>{`
              .narrative-scroll::-webkit-scrollbar { width: 4px; }
              .narrative-scroll::-webkit-scrollbar-track { background: transparent; }
              .narrative-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            `}</style>
            
            {/* --- VISUAL STORY STAGE --- */}
            <div style={{ marginBottom: 64, borderRadius: 24, background: "rgba(0,0,0,.03)", overflow: "hidden", border: "1px solid rgba(255,255,255,.05)", position: "relative" }}>
              <ProjectNarrative id={p.id} accent={p.accent} />
            </div>
            
            <motion.h3 variants={up(.2)} initial="hidden" animate="show"
              style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(24px, 2.5vw, 36px)", fontWeight: 800, color: p.textColor, lineHeight: 1.15, letterSpacing: "-.02em", marginBottom: 32 }}>
              {p.story.headline}
            </motion.h3>

            <motion.p variants={up(.25)} initial="hidden" animate="show"
              style={{ fontSize: 18, lineHeight: 1.8, color: p.textColor, opacity: 0.9, marginBottom: 56 }}>
              {p.story.overview}
            </motion.p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 48, marginBottom: 56 }}>
              <motion.div variants={up(.3)} initial="hidden" animate="show">
                <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".15em", color: p.accent, marginBottom: 16 }}>THE CHALLENGE</h4>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: p.textColor, opacity: 0.75 }}>{p.story.challenge}</p>
              </motion.div>
              <motion.div variants={up(.35)} initial="hidden" animate="show">
                <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".15em", color: p.accent, marginBottom: 16 }}>THE OUTCOME</h4>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: p.textColor, opacity: 0.75 }}>{p.story.outcome}</p>
              </motion.div>
            </div>

            <motion.div variants={up(.4)} initial="hidden" animate="show">
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".15em", color: p.accent, marginBottom: 24 }}>ENGINEERING STACK</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                {p.story.tech.map(t => (
                  <TechIcon key={t} name={t} accent={p.accent} color={p.textColor} />
                ))}
              </div>
            </motion.div>
            
            <div style={{ height: 100 }} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROJECT CARD
═══════════════════════════════════════════════════════════════ */
function Card({ p, onClick }: { p: P; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useTransform(my, [-80, 80], [4, -4]);
  const rotY = useTransform(mx, [-80, 80], [-4, 4]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left - r.width / 2);
    my.set(e.clientY - r.top - r.height / 2);
  };
  const handleLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      layoutId={`card-${p.id}`}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); handleLeave(); }}
      onMouseMove={handleMove}
      style={{
        rotateX: rotX, rotateY: rotY,
        transformStyle: "preserve-3d",
        background: p.bg, borderRadius: 20,
        cursor: "pointer", position: "relative",
        overflow: "hidden",
        boxShadow: hov
          ? `0 24px 60px rgba(0,0,0,.3), 0 0 0 1px rgba(255,255,255,.1)`
          : `0 4px 20px rgba(0,0,0,.15), 0 0 0 1px rgba(255,255,255,.04)`,
        transition: "box-shadow .4s",
      }}
    >
      {/* Decorative layer */}
      <Deco type={p.deco} accent={p.accent} hov={hov} />

      {/* Content */}
      <div style={{ padding: "32px 28px 28px", position: "relative", zIndex: 2, display: "flex", flexDirection: "column", minHeight: 240, gap: 20 }}>
        {/* Tag */}
        <span style={{
          display: "inline-block", alignSelf: "flex-start",
          fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 700,
          letterSpacing: ".1em", color: p.accent, background: p.accentSoft,
          padding: "4px 12px", borderRadius: 20,
        }}>
          {p.cat.split(" · ")[0].toUpperCase()}
        </span>

        {/* Title */}
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(22px,2.5vw,28px)", fontWeight: 800,
            letterSpacing: "-.04em", lineHeight: 1.1,
            color: p.textColor, marginBottom: 10,
            transform: hov ? "translateY(-2px)" : "translateY(0)",
            transition: "transform .35s",
          }}>
            {p.title}
          </h3>
          <p style={{
            fontSize: 14, lineHeight: 1.65, color: p.mutedColor,
            opacity: hov ? 1 : 0.7, transition: "opacity .35s",
          }}>
            {p.blurb}
          </p>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,.07)", paddingTop: 18,
        }}>
          <span style={{ fontSize: 12, color: p.mutedColor, fontWeight: 500 }}>{p.cat.split(" · ")[1]}</span>
          <motion.div
            animate={{ x: hov ? 3 : 0, y: hov ? -3 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ArrowRight size={18} style={{ color: hov ? p.accent : p.mutedColor, transition: "color .3s" }} />
          </motion.div>
        </div>
      </div>

      {/* Hover glow ring */}
      <motion.div
        animate={{ opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute", inset: 0, borderRadius: 20,
          border: `1px solid ${p.accent}`,
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════ */
function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 400,
      transition: "all .4s",
      background: solid ? "rgba(246,241,233,.92)" : "transparent",
      backdropFilter: solid ? "blur(20px)" : "none",
      WebkitBackdropFilter: solid ? "blur(20px)" : "none",
      borderBottom: `1px solid ${solid ? "rgba(60,45,25,.1)" : "transparent"}`,
    }}>
      <div className="g" style={{ height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 800, color: "var(--ink)", letterSpacing: "-.04em" }}>
          ELSAMAHY<span style={{ color: "var(--amber)" }}>.</span>
        </span>
        <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {([["Work", "#work"], ["Contact", "#contact"]] as [string, string][]).map(([l, h]) => (
            <a key={l} href={h} style={{
              fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700,
              color: "var(--ink3)", letterSpacing: ".01em", transition: "color .2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--ink3)")}
            >{l}</a>
          ))}
          <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ display: "block", width: 8, height: 8, borderRadius: "50%", background: "#22a55b", boxShadow: "0 0 0 3px rgba(34,165,91,.2)" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink4)" }}>Available</span>
          </span>
        </nav>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════ */
function Hero() {
  const up = (d = 0) => ({
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { delay: d, duration: 0.6, ease: ez } },
  });

  return (
    <section className="g" style={{ paddingTop: 164, paddingBottom: 120 }}>
      <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .09 } } }}>
        <motion.div variants={up()} style={{ marginBottom: 40 }}>
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={{ width: 140, height: 140, objectFit: "contain", mixBlendMode: "multiply" }} 
          />
        </motion.div>
        
        <motion.p variants={up(.04)} style={{ fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 700, letterSpacing: ".14em", color: "var(--ink4)", marginBottom: 24 }}>
          AI DEVELOPER & FOUNDER
        </motion.p>
        <motion.h1 variants={up(.04)} style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(38px,6.5vw,78px)", fontWeight: 800,
          lineHeight: 1.15, letterSpacing: "-.015em",
          color: "var(--ink)", marginBottom: 32, maxWidth: 960,
        }}>
          I don&apos;t just write code —<br />
          <span style={{ color: "var(--amber)" }}>I build systems that think.</span>
        </motion.h1>
        <motion.p variants={up(.08)} style={{ 
          fontSize: "clamp(17px,2.2vw,24px)", 
          color: "var(--ink2)", 
          lineHeight: 1.75, 
          maxWidth: 780, 
          marginBottom: 52,
          fontWeight: 450
        }}>
          A Statistics student at Cairo University turned AI Developer, tech lead, and founder. 
          I sit at the intersection of machine intelligence, climate action, and systems design — 
          turning complex problems into elegant, working solutions. 
          Currently building <strong style={{ color: "var(--ink)", fontWeight: 700 }}>MZ for Tech Solutions</strong> and leading AI initiatives across international organizations.
        </motion.p>
        <motion.div variants={up(.12)} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="#work" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--ink)", color: "var(--page)",
            padding: "14px 28px", borderRadius: 10,
            fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, transition: "opacity .2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = ".85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            View work <ArrowRight size={15} />
          </a>
          <a href="#contact" style={{
            display: "inline-flex", alignItems: "center",
            background: "var(--surf)", border: "1px solid var(--line)",
            color: "var(--ink2)", padding: "14px 28px", borderRadius: 10,
            fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, transition: "all .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--surf2)"; e.currentTarget.style.color = "var(--ink)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--surf)"; e.currentTarget.style.color = "var(--ink2)"; }}
          >
            Get in touch
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WORK SECTION
═══════════════════════════════════════════════════════════════ */
function Work() {
  const [open, setOpen] = useState<string | null>(null);
  const proj = PROJECTS.find(p => p.id === open);

  return (
    <>
      <section id="work" className="g" style={{ paddingBottom: 120 }}>
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 64, marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(36px,5vw,64px)", fontWeight: 800, letterSpacing: "-.05em", color: "var(--ink)", lineHeight: 1, marginBottom: 12 }}>
            SELECTED WORK
          </h2>
          <p style={{ fontSize: 14, fontWeight: 500, color: "var(--ink4)" }}>Projects I&apos;ve shipped</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(320px,100%),1fr))", gap: 16 }}>
          {PROJECTS.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * .08, duration: .55, ease: ez }}
              style={{ perspective: 1000 }}
            >
              <Card p={p} onClick={() => setOpen(p.id)} />
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {open && proj && <StoryOverlay p={proj} close={() => setOpen(null)} />}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONTACT
═══════════════════════════════════════════════════════════════ */
function Contact() {
  return (
    <section id="contact" className="g" style={{ paddingBottom: 100 }}>
      <div style={{ borderTop: "1px solid var(--line)", paddingTop: 64 }}>
        <span style={{ fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "var(--ink4)", display: "block", marginBottom: 20 }}>LET'S TALK</span>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(30px,5vw,60px)", fontWeight: 800, letterSpacing: "-.05em", color: "var(--ink)", marginBottom: 20, lineHeight: .95 }}>
          Have a project<br />in mind?
        </h2>
        <p style={{ fontSize: 16, color: "var(--ink3)", lineHeight: 1.75, maxWidth: 400, marginBottom: 44 }}>
          Open to freelance projects and full-time roles.
          If you have something interesting, I'd love to hear about it.
        </p>
        <a href="mailto:info@samahy.tech" style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          fontFamily: "var(--font-heading)", fontSize: "clamp(18px,3vw,32px)",
          fontWeight: 800, letterSpacing: "-.02em", color: "var(--ink)",
          borderBottom: "2.5px solid var(--amber)", paddingBottom: 4, transition: "color .2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--amber)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--ink)")}
        >
          info@samahy.tech
        </a>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)" }}>
      <div className="g" style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700, color: "var(--ink4)" }}>
          © 2026 Mohamed Elsamahy
        </span>
        <div style={{ display: "flex", gap: 28 }}>
          {([["GitHub", "https://github.com/mo-elsamahy"], ["LinkedIn", "https://www.linkedin.com/in/mohamedaelsamahy"], ["Facebook", "https://www.facebook.com/M.ELSAMAHYY/"]] as [string, string][]).map(([l, h]) => (
            <a key={l} href={h} style={{ fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 700, color: "var(--ink4)", transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--ink4)")}
            >{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      <DynamicBg />
      <Nav />
      <Hero />
      <Work />
      <Contact />
      <Footer />
    </main>
  );
}
