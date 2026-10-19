/**
 * LOGIKA APLIKASI UTAMA - KOMPUTASI.ID
 * Media Pembelajaran Informatika Kelas X: 4 Pilar Berpikir Komputasional
 * Tanpa Penilaian / Skor (100% Eksplorasi Literasi & Penalaran Kritis)
 */

const App = {
  activeTab: 'beranda',
  activeLabTab: 'dekomposisi',
  selectedPillarIdx: 0,
  selectedCaseIdx: 0,
  darkMode: false,
  fontSizeLevel: 1, // 0: Small, 1: Normal, 2: Large
  isSpeaking: false,
  currentUtterance: null,

  init() {
    this.setupTheme();
    this.setupNavigation();
    this.renderHomePillars();
    this.renderPillarsDetail();
    this.renderLiteracyCases();
    this.renderGlossary();
    this.setupSearch();

    // Inisialisasi simulator 4 pilar
    DecompositionLab.init();
    PatternLab.init();
    AbstractionLab.init();
    AlgorithmLab.init();

    // Event listener audio FX toggle
    const audioToggle = document.getElementById("audio-fx-toggle");
    if (audioToggle) {
      audioToggle.addEventListener("click", () => {
        SoundFX.enabled = !SoundFX.enabled;
        audioToggle.innerHTML = SoundFX.enabled 
          ? '<i class="fa-solid fa-volume-high text-blue-500"></i>' 
          : '<i class="fa-solid fa-volume-xmark text-slate-400"></i>';
      });
    }
  },

  setupTheme() {
    const saved = localStorage.getItem("komputasi_theme");
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.darkMode = true;
      document.documentElement.classList.add('dark');
    } else {
      this.darkMode = false;
      document.documentElement.classList.remove('dark');
    }
    this.updateThemeButton();
  },

  toggleTheme() {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem("komputasi_theme", "dark");
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem("komputasi_theme", "light");
    }
    this.updateThemeButton();
    SoundFX.click();
  },

  updateThemeButton() {
    const btn = document.getElementById("theme-toggle-btn");
    if (!btn) return;
    btn.innerHTML = this.darkMode 
      ? '<i class="fa-solid fa-sun text-amber-400 text-sm"></i>' 
      : '<i class="fa-solid fa-moon text-slate-700 text-sm"></i>';
  },

  adjustFontSize(dir) {
    if (dir === 'inc' && this.fontSizeLevel < 2) this.fontSizeLevel++;
    if (dir === 'dec' && this.fontSizeLevel > 0) this.fontSizeLevel--;

    const contentArea = document.getElementById("content-area");
    if (!contentArea) return;

    contentArea.classList.remove("text-sm-content", "text-base-content", "text-lg-content");
    if (this.fontSizeLevel === 0) contentArea.classList.add("text-sm-content");
    if (this.fontSizeLevel === 1) contentArea.classList.add("text-base-content");
    if (this.fontSizeLevel === 2) contentArea.classList.add("text-lg-content");

    SoundFX.click();
  },

  switchTab(tabId) {
    this.activeTab = tabId;
    this.stopTTS();

    document.querySelectorAll(".tab-section").forEach(sec => sec.classList.add("hidden"));

    const target = document.getElementById(`tab-${tabId}`);
    if (target) {
      target.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (tabId === 'kasus') {
      this.renderLiteracyCases();
    }

    if (tabId === 'lab') {
      setTimeout(() => {
        this.switchLabTab(this.activeLabTab);
      }, 50);
    }

    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.dataset.tab === tabId) {
        link.classList.add("text-blue-600", "dark:text-blue-400", "font-bold", "border-b-2", "border-blue-600");
        link.classList.remove("text-slate-600", "dark:text-slate-300");
      } else {
        link.classList.remove("text-blue-600", "dark:text-blue-400", "font-bold", "border-b-2", "border-blue-600");
        link.classList.add("text-slate-600", "dark:text-slate-300");
      }
    });

    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
    }

    SoundFX.click();
  },

  switchLabTab(labId) {
    this.activeLabTab = labId;
    ['dekomposisi', 'pola', 'abstraksi', 'algoritma'].forEach(id => {
      const el = document.getElementById(`lab-panel-${id}`);
      const btn = document.getElementById(`lab-btn-${id}`);
      if (el) {
        if (id === labId) el.classList.remove("hidden");
        else el.classList.add("hidden");
      }
      if (btn) {
        if (id === labId) {
          btn.className = "px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 bg-blue-600 text-white shadow-md";
        } else {
          btn.className = "px-4 py-2 text-xs font-medium rounded-xl transition flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700";
        }
      }
    });

    // Reinitialize 3D viewports when switching tabs
    setTimeout(() => {
      if (labId === 'dekomposisi' && typeof DecompositionLab !== 'undefined') DecompositionLab.init3D();
      if (labId === 'pola' && typeof PatternLab !== 'undefined') PatternLab.init3D();
      if (labId === 'abstraksi' && typeof AbstractionLab !== 'undefined') AbstractionLab.init3D();
      if (labId === 'algoritma' && typeof AlgorithmLab !== 'undefined') AlgorithmLab.init3D();
    }, 60);

    SoundFX.click();
  },

  setupNavigation() {
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        if (tab) this.switchTab(tab);
      });
    });

    const mobileBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
      });
    }
  },

  // 1. Render Kartu 4 Pilar di Beranda
  renderHomePillars() {
    const container = document.getElementById("home-pillars-grid");
    if (!container) return;

    let html = '';
    APP_DATA.pillars.forEach((p, idx) => {
      const colors = {
        blue: "border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400",
        emerald: "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400",
        amber: "border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400",
        purple: "border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400"
      }[p.colorTheme];

      html += `
        <div onclick="App.openPillarTab(${idx})" class="p-5 rounded-3xl border ${colors} shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between group">
          <div>
            <!-- 3D Preview Visual Thumbnail -->
            <div class="w-full h-36 rounded-2xl overflow-hidden mb-3 border border-slate-200/80 dark:border-slate-700/80 bg-slate-900 shadow-inner relative">
              <img src="${p.image3D}" alt="Visual 3D ${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
              <span class="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[9px] font-mono text-cyan-300">
                <i class="fa-solid fa-cube mr-1"></i> 3D
              </span>
            </div>

            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
                ${p.badge}
              </span>
              <div class="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 shadow flex items-center justify-center text-sm group-hover:scale-110 transition">
                <i class="fa-solid ${p.icon}"></i>
              </div>
            </div>

            <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-0.5">
              ${p.title}
            </h3>
            <div class="text-[11px] font-mono opacity-60 mb-2">${p.enTitle}</div>
            
            <p class="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              ${p.tagline}
            </p>
          </div>

          <div class="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs font-bold flex items-center justify-between text-blue-600 dark:text-blue-400">
            <span>Buka Eksplorasi</span>
            <i class="fa-solid fa-arrow-right text-[11px] group-hover:translate-x-1 transition"></i>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  openPillarTab(idx) {
    this.selectedPillarIdx = idx;
    this.switchTab('pilar');
    this.renderPillarsDetail();
  },

  // 2. Render Pembahasan Mendalam 4 Pilar
  renderPillarsDetail() {
    const listContainer = document.getElementById("pillar-nav-list");
    const detailContainer = document.getElementById("pillar-detail-view");
    if (!listContainer || !detailContainer) return;

    let listHtml = '';
    APP_DATA.pillars.forEach((p, idx) => {
      const isSelected = idx === this.selectedPillarIdx;
      listHtml += `
        <button onclick="App.selectPillar(${idx})" class="w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5
          ${isSelected 
            ? 'bg-blue-600 text-white border-blue-600 shadow-md font-semibold' 
            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300'}">
          <span class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs
            ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}">
            <i class="fa-solid ${p.icon}"></i>
          </span>
          <div class="flex-1 min-w-0">
            <div class="text-[10px] uppercase font-bold opacity-80">${p.badge}</div>
            <div class="text-xs sm:text-sm font-bold truncate">${p.title}</div>
          </div>
        </button>
      `;
    });
    listContainer.innerHTML = listHtml;

    // Render detail of selected pillar
    const p = APP_DATA.pillars[this.selectedPillarIdx];
    detailContainer.innerHTML = `
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-lg space-y-6 animate-fadeIn">
        
        <!-- Header Info -->
        <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <div class="inline-flex items-center gap-2 mb-1">
              <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                ${p.badge} Berpikir Komputasional
              </span>
              <span class="text-xs text-slate-400 font-mono">${p.enTitle}</span>
            </div>
            <h3 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              ${p.title}
            </h3>
          </div>

          <button onclick="App.speakPillarText()" id="btn-tts" class="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 shadow-sm">
            <i class="fa-solid fa-volume-high text-blue-500"></i>
            <span id="tts-label">Dengarkan Materi</span>
          </button>
        </div>

        <!-- 3D Illustration Showcase Card -->
        <div class="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center gap-5 border border-slate-700 shadow-md">
          <img src="${p.image3D}" alt="Visual 3D ${p.title}" class="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl shadow-xl border border-cyan-400/30 flex-shrink-0">
          <div class="space-y-1.5 text-center sm:text-left">
            <span class="text-[10px] font-bold uppercase tracking-widest text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
              <i class="fa-solid fa-cube mr-1"></i> Visual 3D Konseptual
            </span>
            <h4 class="text-base font-bold text-white">${p.title} dalam Representasi 3D</h4>
            <p class="text-base text-slate-300 leading-relaxed font-normal">${p.tagline}. Tonton video pembelajaran dan coba simulasi interaktifnya pada menu Lab Simulasi!</p>
          </div>
        </div>

        <!-- Tagline Banner -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-base text-slate-700 dark:text-slate-300 italic font-medium">
          <strong>💡 Inti Definisi:</strong> "${p.tagline}"
        </div>

        <!-- Overview & Mengapa Penting -->
        <div class="space-y-4 text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          <p>${p.overview}</p>
          <div class="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50">
            <strong class="text-blue-900 dark:text-blue-200 block mb-1 font-bold"><i class="fa-solid fa-brain mr-1.5"></i> Mengapa Keterampilan Ini Sangat Penting?</strong>
            ${p.whyImportant}
          </div>
        </div>

        <!-- Karakteristik Pilar -->
        <div>
          <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
            <i class="fa-solid fa-list-check text-blue-500"></i> Karakteristik Utama ${p.title}:
          </h4>
          <ul class="space-y-2 pl-2 text-base text-slate-700 dark:text-slate-300">
            ${p.characteristics.map(c => `
              <li class="flex items-start gap-2.5">
                <i class="fa-solid fa-circle-check text-emerald-500 mt-1 text-xs"></i>
                <span>${c}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Contoh Kasus Nyata -->
        <div>
          <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <i class="fa-solid fa-earth-americas text-blue-500"></i> Contoh Penerapan dalam Kehidupan Sehari-Hari:
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${p.realWorldCases.map(item => `
              <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-2 text-base">
                <strong class="font-bold text-slate-900 dark:text-slate-100 block text-xs sm:text-sm">${item.title}</strong>
                <p class="text-slate-500 dark:text-slate-400 italic">Situasi: "${item.problem}"</p>
                <div class="pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-1 text-base text-slate-700 dark:text-slate-300">
                  ${item.decompositionSolution.map(sol => `<div>• ${sol}</div>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Panduan Literasi Membaca -->
        <div class="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-base">
          <strong class="text-amber-900 dark:text-amber-200 block mb-1 font-bold"><i class="fa-solid fa-glasses mr-1"></i> Panduan Literasi Membaca Teks:</strong>
          <p class="text-slate-700 dark:text-slate-300">${p.literacyGuide}</p>
        </div>

        <!-- Tautan Coba ke Lab Simulasi -->
        <div class="pt-2 flex justify-end">
          <button onclick="App.openSpecificLab('${p.id}')" class="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition flex items-center gap-2">
            <span>Coba Simulator ${p.title}</span>
            <i class="fa-solid fa-flask-vial"></i>
          </button>
        </div>

      </div>
    `;
  },

  selectPillar(idx) {
    this.selectedPillarIdx = idx;
    this.stopTTS();
    this.renderPillarsDetail();
    SoundFX.click();
  },

  openSpecificLab(pillarId) {
    this.switchTab('lab');
    this.switchLabTab(pillarId);
  },

  // 3. Render Studi Kasus Literasi Naratif
  renderLiteracyCases() {
    const tabsContainer = document.getElementById("cases-tab-buttons");
    const caseViewContainer = document.getElementById("case-view-container");
    if (!tabsContainer || !caseViewContainer) return;

    const pillarKeys = ['dekomposisi', 'pola', 'abstraksi', 'algoritma'];
    if (!this.selectedCasePillarFilter || !pillarKeys.includes(this.selectedCasePillarFilter)) {
      this.selectedCasePillarFilter = 'dekomposisi';
    }
    if (!this.openAnalysisMap) this.openAnalysisMap = {};

    // Render Navigation buttons for cases
    let tabsHtml = '';
    APP_DATA.literacyCases.forEach((c, idx) => {
      const isSelected = idx === this.selectedCaseIdx;
      tabsHtml += `
        <button onclick="App.selectCase(${idx})" class="px-4 py-2.5 text-xs font-bold rounded-2xl transition-all flex items-center gap-2.5 whitespace-nowrap border ${
          isSelected 
            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80 shadow-sm'
        }">
          <span class="w-6 h-6 rounded-lg flex items-center justify-center text-xs ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300'}">
            <i class="fa-solid ${c.icon}"></i>
          </span>
          <div class="text-left">
            <span class="block text-[9px] uppercase tracking-wider opacity-75 font-semibold">Kasus #${idx + 1}</span>
            <span class="font-extrabold text-[11px] leading-tight block">${c.title.length > 28 ? c.title.substring(0, 26) + '...' : c.title}</span>
          </div>
        </button>
      `;
    });
    tabsContainer.innerHTML = tabsHtml;

    const c = APP_DATA.literacyCases[this.selectedCaseIdx];

    // Filter pillars based on selected single pillar tab
    const activePillars = [this.selectedCasePillarFilter];

    const filterLabels = [
      { key: 'dekomposisi', label: '1. Dekomposisi', icon: 'fa-puzzle-piece' },
      { key: 'pola', label: '2. Pengenalan Pola', icon: 'fa-shapes' },
      { key: 'abstraksi', label: '3. Abstraksi', icon: 'fa-filter' },
      { key: 'algoritma', label: '4. Algoritma', icon: 'fa-route' }
    ];

    caseViewContainer.innerHTML = `
      <div class="space-y-8 animate-fadeIn">
        
        <!-- CARD 1: HERO & TEKS CERITA MASALAH -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-lg overflow-hidden">
          
          <!-- Banner Atas -->
          <div class="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <i class="fa-solid ${c.icon}"></i>
                  <span>${c.category}</span>
                </span>
                <span class="text-xs text-slate-300 font-mono">
                  <i class="fa-regular fa-clock mr-1"></i>${c.readTime}
                </span>
              </div>
              <span class="text-[11px] text-slate-300 font-bold px-3 py-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                Kajian Kasus #${this.selectedCaseIdx + 1}
              </span>
            </div>

            <h3 class="text-lg sm:text-2xl font-black text-white mb-2 leading-snug">
              ${c.title}
            </h3>
            <p class="text-base text-slate-300 max-w-3xl leading-relaxed font-normal">
              Pelajari narasi situasi masalah nyata di bawah ini, amati bagaimana 4 pilar diintegrasikan, lalu kerjakan pertanyaan nalar kritis di buku tulis atau kertas kerjamu!
            </p>
          </div>

          <!-- Isi Teks Cerita Masalah -->
          <div class="p-6 sm:p-8 space-y-6">
            <div class="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 space-y-2.5">
              <div class="flex items-center gap-2">
                <span class="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                  <i class="fa-solid fa-book-open"></i>
                </span>
                <h4 class="text-xs sm:text-sm uppercase tracking-wider font-extrabold text-slate-900 dark:text-slate-100">
                  Teks Cerita Masalah Nyata
                </h4>
              </div>
              <div class="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-line pl-3 border-l-2 border-blue-500">
                ${c.story}
              </div>
            </div>

            <!-- Bedah Solusi Menggunakan 4 Pilar -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <i class="fa-solid fa-layer-group text-blue-500"></i>
                  Bedah Solusi Terpadu 4 Pilar Berpikir Komputasional:
                </h4>
                <span class="text-[11px] text-slate-400 font-mono hidden sm:inline">4 Sudut Pandang Solusi</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-4 sm:p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 space-y-2 text-base">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-md">
                      <i class="fa-solid fa-puzzle-piece mr-1"></i> Pilar 1 • Dekomposisi
                    </span>
                  </div>
                  <strong class="font-bold text-slate-900 dark:text-slate-100 block text-base">${c.computationalBreakdown.dekomposisi.title}</strong>
                  <p class="text-slate-700 dark:text-slate-300 leading-relaxed text-base">${c.computationalBreakdown.dekomposisi.description}</p>
                </div>

                <div class="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-2 text-base">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                      <i class="fa-solid fa-shapes mr-1"></i> Pilar 2 • Pengenalan Pola
                    </span>
                  </div>
                  <strong class="font-bold text-slate-900 dark:text-slate-100 block text-base">${c.computationalBreakdown.pola.title}</strong>
                  <p class="text-slate-700 dark:text-slate-300 leading-relaxed text-base">${c.computationalBreakdown.pola.description}</p>
                </div>

                <div class="p-4 sm:p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-2 text-base">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-md">
                      <i class="fa-solid fa-filter mr-1"></i> Pilar 3 • Abstraksi
                    </span>
                  </div>
                  <strong class="font-bold text-slate-900 dark:text-slate-100 block text-base">${c.computationalBreakdown.abstraksi.title}</strong>
                  <p class="text-slate-700 dark:text-slate-300 leading-relaxed text-base">${c.computationalBreakdown.abstraksi.description}</p>
                </div>

                <div class="p-4 sm:p-5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 space-y-2 text-base">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-md">
                      <i class="fa-solid fa-route mr-1"></i> Pilar 4 • Perancangan Algoritma
                    </span>
                  </div>
                  <strong class="font-bold text-slate-900 dark:text-slate-100 block text-base">${c.computationalBreakdown.algoritma.title}</strong>
                  <p class="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-base">${c.computationalBreakdown.algoritma.description}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- CARD 2: RUANG PENALARAN KRITIS 4 PILAR (PERTANYAAN MANDIRI PER PILAR) -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-lg p-6 sm:p-8 space-y-6">
          
          <!-- Header Ruang Nalar & Filter Pilar -->
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-5">
            <div>
              <span class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                <i class="fa-solid fa-pen-ruler"></i> Lembar Kerja Mandiri Siswa (Tanpa Nilai / Skor)
              </span>
              <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                Pertanyaan Analisis &amp; Refleksi Tiap Pilar
              </h3>
              <p class="text-base text-slate-500 dark:text-slate-400 mt-0.5">
                Kerjakan di buku tulis atau selembar kertas. Pilih tab pilar di samping, tuliskan analisismu, lalu buka tombol model solusi untuk mengevaluasi alur penalaranmu.
              </p>
            </div>

            <!-- Filter Buttons Pilar -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 bg-slate-100 dark:bg-slate-900/70 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              ${filterLabels.map(fl => {
                const isActive = this.selectedCasePillarFilter === fl.key;
                return `
                  <button onclick="App.filterCasePillar('${fl.key}')" class="px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    isActive 
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }">
                    <i class="fa-solid ${fl.icon} text-[10px]"></i>
                    <span>${fl.label}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Banner Instruksi Pengerjaan di Buku Tulis / Kertas -->
          <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-950/40 border border-amber-200 dark:border-amber-800/70 flex items-start sm:items-center gap-3.5 text-xs shadow-sm">
            <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md text-base">
              <i class="fa-solid fa-book-open"></i>
            </div>
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <strong class="font-extrabold text-amber-950 dark:text-amber-100 text-xs sm:text-sm">
                  Perintah Pengerjaan di Buku Tulis / Kertas Kerja Siswa
                </strong>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/80 text-amber-900 dark:bg-amber-900/80 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                  <i class="fa-solid fa-pencil mr-1"></i> Aktivitas Menulis Manual
                </span>
              </div>
              <p class="text-amber-900/90 dark:text-amber-200/90 leading-relaxed text-base">
                Siswa diminta menyiapkan <strong>buku tulis Informatika atau selembar kertas</strong>. Klik salah satu tab pilar di atas (Dekomposisi, Pengenalan Pola, Abstraksi, atau Algoritma), baca cermat pertanyaan analitisnya, lalu tuliskan pemikiran serta solusi terstrukturmu secara mandiri sebelum membuka tombol <strong>"Buka Model Solusi Komputasional"</strong>!
              </p>
            </div>
          </div>

          <!-- List Kartu Pertanyaan Berdasarkan Pilar yang Aktif -->
          <div class="space-y-6">
            ${activePillars.map(pKey => {
              const qData = c.pillarQuestions ? c.pillarQuestions[pKey] : null;
              if (!qData) return '';

              const colors = {
                dekomposisi: {
                  badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
                  border: 'border-blue-200/90 dark:border-blue-800/80',
                  lightBg: 'bg-blue-50/40 dark:bg-blue-950/15',
                  accent: 'text-blue-600 dark:text-blue-400',
                  btn: 'bg-blue-600 hover:bg-blue-700 text-white'
                },
                pola: {
                  badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
                  border: 'border-emerald-200/90 dark:border-emerald-800/80',
                  lightBg: 'bg-emerald-50/40 dark:bg-emerald-950/15',
                  accent: 'text-emerald-600 dark:text-emerald-400',
                  btn: 'bg-emerald-600 hover:bg-emerald-700 text-white'
                },
                abstraksi: {
                  badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
                  border: 'border-amber-200/90 dark:border-amber-800/80',
                  lightBg: 'bg-amber-50/40 dark:bg-amber-950/15',
                  accent: 'text-amber-600 dark:text-amber-400',
                  btn: 'bg-amber-600 hover:bg-amber-700 text-white'
                },
                algoritma: {
                  badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
                  border: 'border-purple-200/90 dark:border-purple-800/80',
                  lightBg: 'bg-purple-50/40 dark:bg-purple-950/15',
                  accent: 'text-purple-600 dark:text-purple-400',
                  btn: 'bg-purple-600 hover:bg-purple-700 text-white'
                }
              }[pKey];

              const isAnalysisOpen = !!this.openAnalysisMap[`${c.id}_${pKey}`];

              return `
                <div class="rounded-2xl border ${colors.border} ${colors.lightBg} p-5 sm:p-6 space-y-4 shadow-sm transition hover:shadow-md">
                  
                  <!-- Header Kartu Pilar Pertanyaan -->
                  <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-3">
                    <div class="flex items-center gap-2">
                      <span class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${colors.badge} border">
                        <i class="fa-solid ${qData.icon}"></i>
                      </span>
                      <div>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">Pertanyaan Khusus</span>
                        <h4 class="text-sm font-black text-slate-900 dark:text-slate-100">
                          Pilar ${qData.pillarName}
                        </h4>
                      </div>
                    </div>
                    <span class="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500">
                      Penalaran Literasi Kritis
                    </span>
                  </div>

                  <!-- Teks Pertanyaan Utama -->
                  <div class="space-y-1">
                    <strong class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 block leading-snug">
                      ${qData.question}
                    </strong>
                  </div>

                  <!-- Kotak Petunjuk Berpikir (Scaffolding Hint) -->
                  <div class="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                    <i class="fa-solid fa-lightbulb text-amber-500 mt-0.5 text-xs"></i>
                    <div>
                      <strong class="font-bold block text-xs mb-0.5">Petunjuk Nalar Kritis:</strong>
                      <p class="leading-relaxed opacity-95 text-base">${qData.hint}</p>
                    </div>
                  </div>

                  <!-- Perintah Kerja Siswa di Buku Tulis / Kertas -->
                  <div class="p-4 rounded-xl bg-white/80 dark:bg-slate-900/70 border border-dashed border-slate-300 dark:border-slate-700/80 space-y-3">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <div class="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <span class="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[11px]">
                          <i class="fa-solid fa-pencil"></i>
                        </span>
                        <span>Instruksi Menulis Siswa:</span>
                      </div>
                      <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 flex items-center gap-1.5">
                        <i class="fa-solid fa-book-journal-whills"></i> Tulis di Buku Catatan / Kertas
                      </span>
                    </div>

                    <p class="text-base text-slate-600 dark:text-slate-300 leading-relaxed pl-0 sm:pl-8">
                      Tuliskan jawaban serta uraian analisismu secara lengkap pada <strong>buku tulis</strong> atau selembar <strong>kertas kerja</strong>. Uraikan pemikiranmu secara runtut berdasarkan petunjuk nalar di atas sebelum membuka rekomendasi solusi.
                    </p>

                    <div class="pt-2 pl-0 sm:pl-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200/60 dark:border-slate-800">
                      <span class="text-[10px] text-slate-500 dark:text-slate-400 italic flex items-center gap-1.5">
                        <i class="fa-solid fa-circle-check text-emerald-500"></i>
                        Sudah selesai menulis jawabanmu di buku catatan?
                      </span>

                      <!-- Tombol Accordion Buka/Tutup Pembahasan Solusi -->
                      <button onclick="App.toggleCaseAnalysis('${c.id}', '${pKey}')" 
                        class="px-4 py-2 text-[11px] font-bold rounded-xl ${colors.btn} transition flex items-center justify-center gap-2 shadow-sm">
                        <i class="fa-solid ${isAnalysisOpen ? 'fa-eye-slash' : 'fa-lightbulb'}"></i>
                        <span>${isAnalysisOpen ? 'Tutup Rekomendasi Solusi' : 'Buka Model Solusi Komputasional'}</span>
                        <i class="fa-solid fa-chevron-${isAnalysisOpen ? 'up' : 'down'} text-[9px]"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Accordion Isi Pembahasan Model Solusi Komputasional -->
                  ${isAnalysisOpen ? `
                    <div class="mt-3 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800/80 shadow-md space-y-2 animate-fadeIn text-base">
                      <div class="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold pb-1 border-b border-emerald-100 dark:border-emerald-900/60">
                        <i class="fa-solid fa-circle-check"></i>
                        <span class="text-xs uppercase tracking-wider">Model Analisis &amp; Rekomendasi Solusi Komputasional:</span>
                      </div>
                      <div class="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line pt-1 text-base">
                        ${qData.sampleAnalysis}
                      </div>
                      <div class="pt-2 text-xs text-slate-400 italic">
                        💡 Jadikan model solusi di atas sebagai pembanding nalar untuk mengevaluasi kelengkapan dan ketajaman analisismu.
                      </div>
                    </div>
                  ` : ''}

                </div>
              `;
            }).join('')}
          </div>

        </div>

      </div>
    `;
  },

  selectCase(idx) {
    this.selectedCaseIdx = idx;
    if (typeof SoundFX !== 'undefined') SoundFX.click();
    this.renderLiteracyCases();
  },

  filterCasePillar(pillarKey) {
    this.selectedCasePillarFilter = pillarKey;
    if (typeof SoundFX !== 'undefined') SoundFX.click();
    this.renderLiteracyCases();
  },

  toggleCaseAnalysis(caseId, pillarKey) {
    const key = `${caseId}_${pillarKey}`;
    this.openAnalysisMap = this.openAnalysisMap || {};
    this.openAnalysisMap[key] = !this.openAnalysisMap[key];
    if (typeof SoundFX !== 'undefined') SoundFX.pop();
    this.renderLiteracyCases();
  },

  saveStudentNote(caseId, pillarKey) {
    const el = document.getElementById(`note-${caseId}-${pillarKey}`);
    if (!el) return;
    const val = el.value.trim();
    localStorage.setItem(`ct_note_${caseId}_${pillarKey}`, val);
    
    const btn = document.getElementById(`btn-save-${caseId}-${pillarKey}`);
    if (btn) {
      btn.innerHTML = '<i class="fa-solid fa-check text-emerald-500"></i><span>Tersimpan!</span>';
      btn.classList.add('bg-emerald-50', 'text-emerald-700', 'border', 'border-emerald-300');
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-regular fa-bookmark"></i><span>Simpan Catatan</span>';
        btn.classList.remove('bg-emerald-50', 'text-emerald-700', 'border', 'border-emerald-300');
      }, 2000);
    }
    if (typeof SoundFX !== 'undefined') SoundFX.chime();
  },

  // 4. Glosarium Istilah dengan Live Search
  renderGlossary(filterText = '') {
    const container = document.getElementById("glossary-grid");
    if (!container) return;

    const query = filterText.toLowerCase().trim();
    const items = APP_DATA.glossary.filter(item => 
      item.term.toLowerCase().includes(query) || item.definition.toLowerCase().includes(query)
    );

    if (items.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12 text-slate-400 text-xs">
          <i class="fa-solid fa-magnifying-glass text-3xl mb-2 opacity-50"></i>
          <p>Tidak ditemukan istilah yang sesuai dengan "${filterText}".</p>
        </div>
      `;
      return;
    }

    let html = '';
    items.forEach(g => {
      html += `
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              ${g.category}
            </span>
          </div>
          <h4 class="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-1.5">
            ${g.term}
          </h4>
          <p class="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            ${g.definition}
          </p>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  setupSearch() {
    const searchInput = document.getElementById("glossary-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.renderGlossary(e.target.value);
      });
    }
  },

  // 5. Audio Text-to-Speech untuk Meningkatkan Literasi Auditori
  speakPillarText() {
    if (!('speechSynthesis' in window)) {
      alert("Browser Anda belum mendukung fitur Text-to-Speech.");
      return;
    }

    if (this.isSpeaking) {
      this.stopTTS();
      return;
    }

    const p = APP_DATA.pillars[this.selectedPillarIdx];
    const fullText = `${p.title}. ${p.tagline}. ${p.overview}. Mengapa penting? ${p.whyImportant}. Panduan literasi: ${p.literacyGuide}`;

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'id-ID';
    utterance.rate = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
    if (idVoice) utterance.voice = idVoice;

    utterance.onend = () => {
      this.isSpeaking = false;
      this.updateTTSButton(false);
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.updateTTSButton(false);
    };

    window.speechSynthesis.speak(utterance);
    this.currentUtterance = utterance;
    this.isSpeaking = true;
    this.updateTTSButton(true);
  },

  stopTTS() {
    if ('speechSynthesis' in window && this.isSpeaking) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.updateTTSButton(false);
    }
  },

  updateTTSButton(speaking) {
    const btn = document.getElementById("btn-tts");
    if (!btn) return;
    if (speaking) {
      btn.classList.add("bg-rose-100", "dark:bg-rose-950/60", "text-rose-600");
      btn.innerHTML = `<i class="fa-solid fa-stop text-rose-500"></i> <span>Hentikan Suara</span>`;
    } else {
      btn.classList.remove("bg-rose-100", "dark:bg-rose-950/60", "text-rose-600");
      btn.innerHTML = `<i class="fa-solid fa-volume-high text-blue-500"></i> <span>Dengarkan Materi</span>`;
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
