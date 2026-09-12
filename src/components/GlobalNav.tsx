import { useCallback, useEffect, useRef, useState } from "react";
import "./GlobalNav.css";

const NAV_LINKS = [
  { id: "how-it-works", label: "HOW IT WORKS", num: "01" },
  { id: "challenge", label: "77-DAY CHALLENGE", num: "02" },
  { id: "accountability", label: "ACCOUNTABILITY", num: "03" },
];

const SECTIONS = ["how-it-works", "challenge", "accountability"];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function GlobalNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const desktopOnly = window.matchMedia("(min-width: 901px)");

    const onDesktop = () => {
      if (desktopOnly.matches) setMenuOpen(false);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { id: string; ratio: number } | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (!best || entry.intersectionRatio > best.ratio) {
              best = { id, ratio: entry.intersectionRatio };
            }
          }
        }
        if (best && best.ratio > 0.15) {
          setActiveSection(best.id);
        } else {
          const anyVisible = entries.some((e) => e.isIntersecting);
          if (!anyVisible) {
            const scrollPos = window.scrollY + window.innerHeight * 0.4;
            let current: string | null = null;
            for (const id of SECTIONS) {
              const el = document.getElementById(id);
              if (el && el.offsetTop <= scrollPos) current = id;
            }
            setActiveSection(current);
          }
        }
      },
      { threshold: [0.15, 0.3, 0.5], rootMargin: "-30% 0px -50% 0px" }
    );

    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    desktopOnly.addEventListener("change", onDesktop);

    return () => {
      observer.disconnect();
      desktopOnly.removeEventListener("change", onDesktop);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      closeBtnRef.current?.focus();
    } else {
      document.body.style.overflow = "";
      menuBtnRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      setMenuOpen(false);
      requestAnimationFrame(() => scrollToId(id));
    },
    []
  );

  return (
    <>
      <header
        className={"globalNav" + (scrolled ? " globalNav--scrolled" : "")}
        aria-label="Site navigation"
      >
        <div className="globalNav__inner">
          <a
            href="#top"
            className="globalNav__brand"
            aria-label="Compound to Greatness — back to top"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("top");
            }}
          >
            <img src="/logo-mark.png" alt="" className="globalNav__brandMark" />
            <span className="globalNav__brandText">
              <strong>COMPOUND TO</strong>
              <strong className="globalNav__brandLime">GREATNESS</strong>
            </span>
          </a>

          <nav className="globalNav__links" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={
                  "globalNav__link" +
                  (activeSection === link.id ? " globalNav__link--active" : "")
                }
                onClick={(e) => handleNavClick(e, link.id)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#download"
            className="globalNav__download"
            onClick={(e) => handleNavClick(e, "download")}
          >
            DOWNLOAD APP
          </a>

          <button
            ref={menuBtnRef}
            type="button"
            className="globalNav__hamburger"
            aria-label="Open navigation"
            aria-expanded={menuOpen}
            aria-controls="mobileMenu"
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        className={"mobileMenu" + (menuOpen ? " mobileMenu--open" : "")}
        id="mobileMenu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="mobileMenu__header">
          <a
            href="#top"
            className="mobileMenu__brand"
            aria-label="Compound to Greatness — back to top"
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              requestAnimationFrame(() => scrollToId("top"));
            }}
          >
            <img src="/logo-mark.png" alt="" className="mobileMenu__brandMark" />
          </a>
          <button
            ref={closeBtnRef}
            type="button"
            className="mobileMenu__close"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="mobileMenu__nav" aria-label="Mobile primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="mobileMenu__item"
              onClick={(e) => handleNavClick(e, link.id)}
            >
              <span className="mobileMenu__num">{link.num}</span>
              <span className="mobileMenu__label">{link.label}</span>
            </a>
          ))}
        </nav>

        <div className="mobileMenu__footer">
          <p className="mobileMenu__annotation">Your Day 1 starts here.</p>
          <a
            href="#download"
            className="mobileMenu__appStore"
            aria-label="Download Compound to Greatness on the App Store"
            onClick={(e) => handleNavClick(e, "download")}
          >
            <img
              src="/assets/images/Download_on_the_App_Store_Badge.svg.webp"
              alt="Download on the App Store"
            />
          </a>
        </div>
      </div>
    </>
  );
}
