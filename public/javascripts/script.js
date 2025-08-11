document.addEventListener("DOMContentLoaded", function () {
  // ---------- Helpers ----------
  function animateSkillBarsIn(section) {
    if (!section) return;
    const skillPercentages = section.querySelectorAll(".skills-percentage");
    skillPercentages.forEach((skillBar) => {
      const skillsData = skillBar.closest(".skills-data");
      const skillNumberEl = skillsData
        ? skillsData.querySelector(".skills-number")
        : null;

      let widthText = "0%";
      if (skillNumberEl) {
        widthText = skillNumberEl.textContent.trim();
      } else if (skillBar.dataset.target) {
        widthText = skillBar.dataset.target;
      }

      if (!/%$/.test(widthText)) widthText = widthText + "%";
      requestAnimationFrame(() => (skillBar.style.width = widthText));
    });
  }

  // ---------- Scroll animations ----------
  function checkSectionsAnimation() {
    const triggerBottom = window.innerHeight * 0.85;
    const animateSections = document.querySelectorAll(".section");

    animateSections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop < triggerBottom) {
        if (!section.classList.contains("active"))
          section.classList.add("active");

        if (
          section.classList.contains("skills") &&
          section.dataset.animated !== "true"
        ) {
          animateSkillBarsIn(section);
          section.dataset.animated = "true";
        }
      }
    });
  }
  checkSectionsAnimation();
  window.addEventListener("scroll", checkSectionsAnimation);

  // ---------- Work Section: Mixitup filtering ----------
  if (typeof mixitup !== "undefined") {
    try {
      mixitup(".work-container", {
        selectors: { target: ".work-card" },
        animation: { duration: 300 },
      });
    } catch (err) {
      console.warn("MixItUp init failed", err);
    }
  }

  // Filter active state
  const linkWork = document.querySelectorAll(".work-item");
  if (linkWork.length) {
    function activeWork() {
      linkWork.forEach((l) => l.classList.remove("active-work"));
      this.classList.add("active-work");
    }
    linkWork.forEach((l) => l.addEventListener("click", activeWork));
  }

  // ---------- Portfolio popup ----------
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("work-button")) {
      const parent = e.target.closest(".work-card");
      if (!parent) return;
      togglePortfolioPopup();
      portfolioItemDetails(parent);
    }
  });

  const portfolioPopup = document.querySelector(".portfolio-popup");
  function togglePortfolioPopup() {
    if (!portfolioPopup) return;
    portfolioPopup.classList.toggle("open");
  }

  const ppClose = document.querySelector(".portfolio-popup-close");
  if (ppClose) ppClose.addEventListener("click", togglePortfolioPopup);

  function portfolioItemDetails(portfolioItem) {
    if (!portfolioPopup || !portfolioItem) return;
    const img = portfolioItem.querySelector(".work-img");
    const details = portfolioItem.querySelector(".portfolio-item-details");

    const thumbImg = portfolioPopup.querySelector(".pp-thumbnail img");
    const subtitleSpan = portfolioPopup.querySelector(
      ".portfolio-popup-subtitle span"
    );
    const body = portfolioPopup.querySelector(".portfolio-popup-body");

    if (thumbImg && img) thumbImg.src = img.src;
    if (subtitleSpan)
      subtitleSpan.innerHTML =
        portfolioItem.querySelector(".work-title")?.innerHTML || "";
    if (body && details) body.innerHTML = details.innerHTML;
  }

  // ---------- "View Details" Toggle ----------
  const workButtons = document.querySelectorAll(".work-button");
  workButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const details = button.nextElementSibling;
      if (!details) return;
      document.querySelectorAll(".portfolio-item-details").forEach((detail) => {
        if (detail !== details) {
          detail.classList.remove("active-details");
          detail.style.display = "none";
        }
      });
      if (details.style.display === "block") {
        details.style.display = "none";
      } else {
        details.style.display = "block";
        details.classList.add("active-details");
      }
    });
  });

  // ---------- Skills Accordion ----------
  const skillsContent = document.getElementsByClassName("skills-content");
  const skillsHeader = document.querySelectorAll(".skills-header");

  function toggleSkills() {
    let itemClass = this.parentNode.className;
    for (let i = 0; i < skillsContent.length; i++) {
      skillsContent[i].className = "skills-content skills-close";
    }
    if (itemClass === "skills-content skills-close") {
      this.parentNode.className = "skills-content skills-open";
    }
  }
  skillsHeader.forEach((el) => {
    el.addEventListener("click", toggleSkills);
  });

  // ---------- Services Modal ----------
  const modalViews = document.querySelectorAll(".services-modal");
  const modalBtns = document.querySelectorAll(".services-button");
  const modalCloses = document.querySelectorAll(".services-modal-close");

  function openModal(modalIndex) {
    modalViews[modalIndex].classList.add("active-modal");
  }

  modalBtns.forEach((btn, i) => {
    btn.addEventListener("click", () => openModal(i));
  });

  modalCloses.forEach((close) => {
    close.addEventListener("click", () => {
      modalViews.forEach((view) => {
        view.classList.remove("active-modal");
      });
    });
  });

  // ---------- Nav highlighter ----------
  const sections = document.querySelectorAll("section[id]");
  function navHighlighter() {
    const scrollY = window.pageYOffset;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 50;
      const sectionId = current.getAttribute("id");
      const menuLink = document.querySelector(
        `.nav-menu a[href*=${sectionId}]`
      );
      if (!menuLink) return;
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        menuLink.classList.add("active-link");
      } else {
        menuLink.classList.remove("active-link");
      }
    });
  }
  window.addEventListener("scroll", navHighlighter);
  navHighlighter();

  // ---------- Sidebar toggle ----------
  const navMenu = document.getElementById("sidebar");
  const navToggle = document.getElementById("nav-toggle");
  const navClose = document.getElementById("nav-close");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () =>
      navMenu.classList.add("show-sidebar")
    );
  }
  if (navClose && navMenu) {
    navClose.addEventListener("click", () =>
      navMenu.classList.remove("show-sidebar")
    );
  }
});
// Skills Tabs Toggle
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".skills-header");
    const contents = document.querySelectorAll(".skills-group");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetSelector = tab.dataset.target;
            const target = document.querySelector(targetSelector);

            // Remove active state from all tabs
            tabs.forEach(t => t.classList.remove("skills-active"));

            // Remove active state from all content
            contents.forEach(c => c.classList.remove("skills-active"));

            // Activate clicked tab & its content
            tab.classList.add("skills-active");
            target.classList.add("skills-active");
        });
    });
});

