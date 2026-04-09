/* =============================================
   MAIN.JS — Doce Encanto
   ============================================= */

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileNav();
  initActiveNavLinks();
  initContactForm();
  initFooterYear();
  initReveal();
});

/* =============================================
   HEADER — Transparente no topo, branco ao rolar
   ============================================= */
function initHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 60);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* =============================================
   MENU MOBILE
   ============================================= */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav    = document.getElementById("nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  nav.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-label", "Abrir menu");
      document.body.style.overflow = "";
    });
  });
}

/* =============================================
   NAV ATIVO — Destaca link da seção visível
   ============================================= */
function initActiveNavLinks() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks  = document.querySelectorAll(".nav__link");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((s) => observer.observe(s));
}

/* =============================================
   FORMULÁRIO — Validação e envio simulado
   ============================================= */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const fields = {
    name: {
      el:       form.querySelector("#name"),
      error:    form.querySelector("#nameError"),
      validate: (v) => v.trim().length >= 2 ? "" : "Informe seu nome.",
    },
    email: {
      el:       form.querySelector("#email"),
      error:    form.querySelector("#emailError"),
      validate: (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "E-mail inválido.",
    },
    message: {
      el:       form.querySelector("#message"),
      error:    form.querySelector("#messageError"),
      validate: (v) =>
        v.trim().length >= 10 ? "" : "Descreva sua encomenda (mín. 10 caracteres).",
    },
  };

  const feedback = form.querySelector("#formFeedback");

  // Valida ao sair do campo
  Object.values(fields).forEach(({ el, error, validate }) => {
    if (!el) return;
    el.addEventListener("blur", () => {
      const msg = validate(el.value);
      error.textContent = msg;
      el.classList.toggle("error", !!msg);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;
    Object.values(fields).forEach(({ el, error, validate }) => {
      if (!el) return;
      const msg = validate(el.value);
      error.textContent = msg;
      el.classList.toggle("error", !!msg);
      if (msg) valid = false;
    });

    if (!valid) return;

    // Coleta os dados do formulário
    const name     = form.querySelector("#name").value.trim();
    const phone    = form.querySelector("#phone").value.trim();
    const email    = form.querySelector("#email").value.trim();
    const occasion = form.querySelector("#occasion").value;
    const message  = form.querySelector("#message").value.trim();

    // Monta a mensagem para o WhatsApp
    const texto = [
      `Olá Vovó Bel! Gostaria de fazer uma encomenda. 🎂`,
      ``,
      `*Nome:* ${name}`,
      phone    ? `*WhatsApp:* ${phone}`   : null,
      email    ? `*E-mail:* ${email}`     : null,
      occasion ? `*Ocasião:* ${occasion}` : null,
      `*Detalhes:* ${message}`,
    ]
      .filter((linha) => linha !== null)
      .join("\n");

    // Número da Vovó Bel — troque pelo número real
    const numero = "5511999999999";

    // Abre o WhatsApp com a mensagem já preenchida
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(texto)}`, "_blank");

    form.reset();
  });
}

function showFeedback(el, message, type) {
  el.textContent = message;
  el.className = `form__feedback ${type}`;
  setTimeout(() => {
    el.textContent = "";
    el.className = "form__feedback";
  }, 6000);
}

/* =============================================
   REVEAL — Fotos da seção "Nossa História"
   ============================================= */
function initReveal() {
  const elements = document.querySelectorAll(".reveal-wrap");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target); // roda só uma vez
        }
      });
    },
    { threshold: 0.2 }
  );

  elements.forEach((el) => observer.observe(el));
}

/* =============================================
   FOOTER — Ano atual
   ============================================= */
function initFooterYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}
