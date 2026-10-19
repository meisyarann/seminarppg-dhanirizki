/**
 * LABORATORIUM VIDEO & SIMULASI INTERAKTIF 4 PILAR BERPIKIR KOMPUTASIONAL
 * Tampilan Video Tunggal (Video 1 Saja) Berbasis Thumbnail YouTube Otentik
 * 
 * Fitur Pemutar Video Bebas Error:
 * 1. referrerpolicy="strict-origin-when-cross-origin" untuk memenuhi standar keamanan YouTube terbaru.
 * 2. URL embed resmi: https://www.youtube.com/embed/ dengan parameter enablejsapi=1.
 * 3. Video Pengenalan Pola diganti menjadi: j6BEfr4DEPQ (Berpikir Komputasional - Pengenalan Pola oleh DAVIDTAN).
 * 4. Deteksi protokol file:/// dengan tombol aksi cepat dan peringatan otomatis jika dibuka tanpa server lokal.
 * 5. Tampilan awal Cover Thumbnail Resmi YouTube beresolusi tinggi dengan tombol play merah ikonik.
 */

// Audio Effects Synthesizer menggunakan Web Audio API
const SoundFX = {
  ctx: null,
  enabled: true,

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  },

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.08) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  },

  pop() {
    this.playTone(320, 'triangle', 0.12, 0.12);
  },

  click() {
    this.playTone(480, 'sine', 0.06, 0.06);
  },

  chime() {
    this.playTone(523.25, 'sine', 0.1, 0.08); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.15, 0.08), 90); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.2, 0.08), 180); // G5
  },

  success() {
    this.playTone(440, 'triangle', 0.1, 0.08);
    setTimeout(() => this.playTone(554.37, 'triangle', 0.12, 0.08), 100);
    setTimeout(() => this.playTone(659.25, 'triangle', 0.2, 0.09), 200);
  },

  bell() {
    this.playTone(880, 'sine', 0.2, 0.08);
    setTimeout(() => this.playTone(784, 'sine', 0.3, 0.08), 160);
    setTimeout(() => this.playTone(659, 'sine', 0.45, 0.1), 320);
  },

  warn() {
    this.playTone(220, 'sawtooth', 0.18, 0.07);
  },

  step() {
    this.playTone(420, 'sine', 0.04, 0.05);
  }
};

// Helper Video Lab dengan Dukungan Thumbnail Asli YouTube & Penanganan Error Referrer
const VideoLabHelper = {
  // Status pemutaran video per kontainer
  playingState: {},

  // Buka pemutar popup mandiri (top-level window bebas error konfigurasi YouTube)
  openPopupPlayer(videoId) {
    SoundFX.pop();
    const url = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    const w = 960, h = 540;
    const left = Math.max(0, (window.screen.width - w) / 2);
    const top = Math.max(0, (window.screen.height - h) / 2);
    window.open(url, 'yt_popup_' + videoId, `width=${w},height=${h},top=${top},left=${left},menubar=no,toolbar=no,location=no,status=no,resizable=yes`);
  },

  // Memulai pemutaran video secara instan saat thumbnail diklik
  playVideo(containerId, videoId, labName) {
    this.playingState[containerId] = true;
    SoundFX.pop();
    const container = document.getElementById(containerId);
    if (!container) return;

    const isFileProtocol = window.location.protocol === 'file:';
    const originStr = (window.location.origin && window.location.origin !== 'null' && window.location.protocol.startsWith('http')) 
      ? encodeURIComponent(window.location.origin) 
      : 'https://www.youtube.com';
    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&origin=${originStr}&widget_referrer=${originStr}`;
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

    container.innerHTML = `
      <div class="space-y-3 animate-fadeIn">
        <div class="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 shadow-xl border border-slate-700">
          <iframe 
            src="${embedUrl}" 
            title="Pemutar Video YouTube"
            class="absolute top-0 left-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen>
          </iframe>
          <button onclick="VideoLabHelper.showThumbnail('${containerId}', '${labName}')" 
            class="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 hover:bg-black text-white text-[10px] font-bold backdrop-blur-md transition flex items-center gap-1 border border-white/20 shadow-md z-10">
            <i class="fa-solid fa-image"></i>
            <span>Tutup / Thumbnail</span>
          </button>
        </div>

        <!-- Toolbar Kontrol Tambahan & Solusi Bebas Error -->
        <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm flex flex-wrap items-center justify-between gap-2.5">
          <div class="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <i class="fa-solid fa-circle-info text-blue-500 text-sm"></i>
            <span class="text-xs sm:text-sm leading-tight">
              ${isFileProtocol 
                ? '<strong>Mode File Lokal:</strong> Jika video di atas memunculkan <em>Configuration Error</em>, buka melalui tombol <strong>Buka di YouTube</strong> di samping atau jalankan <code>buka_web.bat</code>.'
                : 'Pemutar YouTube aktif dalam halaman web. Selamat menyimak!'}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <a href="${watchUrl}" target="_blank" rel="noopener noreferrer" 
              class="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow transition" title="Buka di situs YouTube">
              <i class="fa-brands fa-youtube"></i>
              <span>Buka di YouTube</span>
            </a>
          </div>
        </div>
      </div>
    `;
  },

  // Mengembalikan pemutar ke tampilan cover thumbnail
  showThumbnail(containerId, labName) {
    this.playingState[containerId] = false;
    SoundFX.click();
    if (labName && window[labName] && typeof window[labName].render === 'function') {
      window[labName].render();
    }
  },

  renderVideoSection(config) {
    const isPlaying = this.playingState[config.containerId] || false;
    const watchUrl = `https://www.youtube.com/watch?v=${config.video.id}`;
    const thumbLocal = `assets/thumbnails/${config.video.id}.jpg`;
    const thumbRemote = `https://img.youtube.com/vi/${config.video.id}/hqdefault.jpg`;
    const isFileProtocol = window.location.protocol === 'file:';

    // 1. Tampilan Layar Video Utama: Thumbnail Interaktif atau Iframe Live
    let playerHtml = '';
    if (isPlaying) {
      const originStr = (window.location.origin && window.location.origin !== 'null' && window.location.protocol.startsWith('http')) 
        ? encodeURIComponent(window.location.origin) 
        : 'https://www.youtube.com';
      const embedUrl = `https://www.youtube-nocookie.com/embed/${config.video.id}?autoplay=1&rel=0&origin=${originStr}&widget_referrer=${originStr}`;

      playerHtml = `
        <div class="space-y-3 animate-fadeIn">
          <div class="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 shadow-xl border border-slate-700">
            <iframe 
              src="${embedUrl}" 
              title="${config.video.title}"
              class="absolute top-0 left-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerpolicy="no-referrer-when-downgrade"
              allowfullscreen>
            </iframe>
            <button onclick="VideoLabHelper.showThumbnail('${config.containerId}', '${config.labObject}')" 
              class="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 hover:bg-black text-white text-[10px] font-bold backdrop-blur-md transition flex items-center gap-1 border border-white/20 shadow-md z-10">
              <i class="fa-solid fa-image"></i>
              <span>Tutup / Thumbnail</span>
            </button>
          </div>

          <!-- Toolbar Kontrol Tambahan & Solusi Bebas Error -->
          <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm flex flex-wrap items-center justify-between gap-2.5">
            <div class="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <i class="fa-solid fa-circle-info text-blue-500 text-sm"></i>
              <span class="text-xs sm:text-sm leading-tight">
                ${isFileProtocol 
                  ? '<strong>Mode File Lokal:</strong> Jika video di atas memunculkan <em>Configuration Error</em>, buka melalui tombol <strong>Buka di YouTube</strong> di samping atau jalankan <code>buka_web.bat</code>.'
                  : 'Pemutar YouTube aktif dalam halaman web. Selamat menyimak!'}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <a href="${watchUrl}" target="_blank" rel="noopener noreferrer" 
                class="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow transition" title="Buka di situs YouTube">
                <i class="fa-brands fa-youtube"></i>
                <span>Buka di YouTube</span>
              </a>
            </div>
          </div>
        </div>
      `;
    } else {
      // Tampilan Cover Thumbnail Otentik YouTube
      playerHtml = `
        <div class="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 shadow-xl border border-slate-700/80 cursor-pointer group select-none transition-all duration-300 hover:shadow-red-900/20"
             onclick="VideoLabHelper.playVideo('${config.containerId}', '${config.video.id}', '${config.labObject}')"
             title="Klik untuk memutar video">
          
          <!-- Gambar Thumbnail Resmi YouTube -->
          <img src="${thumbLocal}" 
               onerror="this.src='${thumbRemote}'" 
               alt="Thumbnail YouTube: ${config.video.title}" 
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out">
          
          <!-- Efek Gradien Vignette YouTube (Atas dan Bawah) -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none"></div>

          <!-- Header Atas Thumbnail: Logo YouTube & Judul Video -->
          <div class="absolute top-3 left-3 right-3 flex items-center justify-between text-white pointer-events-none">
            <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 shadow-sm max-w-[80%] truncate">
              <i class="fa-brands fa-youtube text-red-600 text-base"></i>
              <span class="text-xs font-bold truncate text-slate-100">${config.video.title}</span>
            </div>
            <span class="text-[10px] font-bold px-2 py-1 rounded-lg bg-red-600 text-white shadow-md flex items-center gap-1.5 group-hover:scale-105 transition">
              <i class="fa-solid fa-circle-play text-[9px] animate-pulse"></i>
              <span>Klik Putar Video</span>
            </span>
          </div>

          <!-- Tombol Play Merah Khas YouTube (Tengah Layar) -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="w-16 h-12 sm:w-20 sm:h-14 rounded-2xl bg-red-600/95 group-hover:bg-red-600 group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-[0_4px_30px_rgba(220,38,38,0.7)] border border-red-400/40">
              <!-- Ikon Segitiga Play Putih -->
              <div class="w-0 h-0 border-t-[8px] sm:border-t-[10px] border-t-transparent border-b-[8px] sm:border-b-[10px] border-b-transparent border-l-[15px] sm:border-l-[19px] border-l-white ml-1"></div>
            </div>
          </div>

          <!-- Bar Bawah Thumbnail: Saluran & Durasi YouTube -->
          <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white pointer-events-none">
            <div class="flex items-center gap-2 text-xs">
              <span class="px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-slate-200 font-medium">
                ${config.video.channel}
              </span>
            </div>
            <div class="px-2 py-0.5 rounded bg-black/85 text-white font-mono text-[11px] font-bold tracking-wider shadow border border-white/10">
              ${config.video.duration || '04:30'}
            </div>
          </div>
        </div>
      `;
    }

    // 2. Timestamps Menit Kunci Pengamatan
    let timestampsHtml = '';
    if (config.timestamps && config.timestamps.length > 0) {
      timestampsHtml = `
        <div class="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
            <i class="fa-solid fa-clock-rotate-left text-red-500 mr-1"></i> Menit-Menit Kunci Pengamatan:
          </span>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-base">
            ${config.timestamps.map(t => `
              <div class="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-2">
                <span class="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-mono font-bold text-[10px] shrink-0">
                  ${t.time}
                </span>
                <span class="text-slate-700 dark:text-slate-300 leading-snug text-base">${t.note}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    return `
      <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
        <!-- Header Info Video -->
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40">
                <i class="fa-brands fa-youtube text-red-600"></i> Video Pembelajaran Utama
              </span>
              <span class="text-xs text-slate-400 dark:text-slate-500">•</span>
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
                <i class="fa-solid fa-clock text-slate-400 mr-1"></i>${config.video.duration || '04:30'}
              </span>
            </div>
            <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              ${config.video.title}
            </h3>
            <p class="text-base text-slate-500 dark:text-slate-400">
              Kreator: <strong class="text-slate-700 dark:text-slate-300">${config.video.channel}</strong>
            </p>
          </div>

          <a href="${watchUrl}" target="_blank" rel="noopener noreferrer" 
            class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800 transition flex items-center gap-1.5 shadow-sm">
            <span>Buka di YouTube</span>
            <i class="fa-brands fa-youtube text-[12px] text-red-600"></i>
          </a>
        </div>

        <!-- Video Display Port (Thumbnail Cover YouTube atau Player Aktif) -->
        <div id="${config.containerId}" class="max-w-4xl mx-auto w-full">
          ${playerHtml}
        </div>

        <!-- Panduan Pengamatan Literasi Aktif -->
        <div class="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-base space-y-1.5">
          <div class="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold">
            <i class="fa-solid fa-lightbulb text-amber-500"></i>
            <span>Fokus Literasi Menonton:</span>
          </div>
          <p class="text-slate-700 dark:text-slate-300 leading-relaxed font-normal text-base">
            ${config.literacyPrompt || 'Amati bagaimana konsep berpikir komputasional diuraikan secara visual dalam video di atas.'}
          </p>
        </div>

        <!-- Timestamps Menit Pengamatan Kunci -->
        ${timestampsHtml}
      </div>
    `;
  }
};


// ============================================================================
// 1. LAB DEKOMPOSISI (MEMECAH MASALAH KAMAR TIDUR & PERSIAPAN SEKOLAH) - 3D HD
// ============================================================================
const DecompositionLab = {
  // Video 1 Utama Pilihan YouTube
  video: { 
    id: 'GsysgO8j3Xo', 
    title: 'Dekomposisi dalam Berpikir Komputasional', 
    channel: 'AILAB Education', 
    duration: '04:35'
  },
  viewMode: 'interactive', // 'interactive' atau 'overwhelmed'
  displayMode: '3d', // '3d' (WebGL Three.js) atau 'svg' (Ilustrasi Isometrik HD)
  lightingMode: 'day', // 'day' atau 'night'
  scene: null,
  camera: null,
  renderer: null,
  animFrameId: null,
  zoneGroups: {},
  pointLights: [],
  
  modules: [
    {
      id: 'ranjang',
      title: 'Zona 1: Kasur & Bantal',
      icon: 'fa-bed',
      color: 'blue',
      done: false,
      messySummary: 'Kasur kusut, selimut terinjak di lantai, bantal berserakan.',
      cleanSummary: 'Sprei kencang, selimut terlipat rapi, bantal tertata empuk siap tidur.',
      steps: [
        { text: 'Kibas debu dan ratakan sprei kasur', done: false },
        { text: 'Lipat selimut dengan 2 lipatan sejajar', done: false },
        { text: 'Posisikan bantal dan guling di sandaran kepala', done: false }
      ]
    },
    {
      id: 'meja',
      title: 'Zona 2: Meja Belajar & Setup Laptop',
      icon: 'fa-laptop-code',
      color: 'indigo',
      done: false,
      messySummary: 'Laptop menyala semalaman, kabel kusut, buku tugas tercecer.',
      cleanSummary: 'Laptop tertutup rapi, kabel digulung, buku tersusun di rak meja.',
      steps: [
        { text: 'Matikan & tutup layar laptop dengan aman', done: false },
        { text: 'Gulung kabel charger dengan perekat rapi', done: false },
        { text: 'Susun buku pelajaran hari ini sesuai jadwal', done: false }
      ]
    },
    {
      id: 'lemari',
      title: 'Zona 3: Lemari Seragam SMA',
      icon: 'fa-shirt',
      color: 'cyan',
      done: false,
      messySummary: 'Pintu terbuka, baju seragam kusut, dasi dan kaos kaki hilang.',
      cleanSummary: 'Seragam putih abu-abu disetrika, dasi terpasang, kaos kaki siap.',
      steps: [
        { text: 'Ambil seragam putih abu-abu yang disetrika', done: false },
        { text: 'Pasangkan dasi dan siapkan ikat pinggang', done: false },
        { text: 'Satukan sepasang kaos kaki bersih dan rapi', done: false }
      ]
    },
    {
      id: 'lantai',
      title: 'Zona 4: Tas Sekolah, Sepatu & Lantai',
      icon: 'fa-broom',
      color: 'emerald',
      done: false,
      messySummary: 'Tas terbuka di lantai, botol minum tergeletak, remah cemilan di karpet.',
      cleanSummary: 'Tas sekolah terisi bekal & kotak pensil, lantai karpet disapu bersih.',
      steps: [
        { text: 'Masukkan kotak pensil & tumbler air ke dalam tas', done: false },
        { text: 'Kancingkan resleting tas dan tempatkan dekat pintu', done: false },
        { text: 'Sapu kotoran di lantai karpet ke tempat sampah', done: false }
      ]
    }
  ],

  init() {
    this.render();
  },

  init3D() {
    if (this.displayMode !== '3d') return;
    const container = document.getElementById("decom-3d-canvas");
    if (!container || typeof THREE === 'undefined') return;

    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    container.innerHTML = '';

    const width = container.clientWidth || 400;
    const height = 320;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.lightingMode === 'day' ? 0x0f172a : 0x050811);

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    this.camera.position.set(6.2, 5.2, 7.0);
    this.camera.lookAt(0, 0.4, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    // Pencahayaan Realistis (Ambient, Matahari Jendela, & Lampu Belajar)
    const ambientLight = new THREE.AmbientLight(
      this.lightingMode === 'day' ? 0xffffff : 0x1e293b, 
      this.lightingMode === 'day' ? 0.75 : 0.35
    );
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(
      this.lightingMode === 'day' ? 0xffedd5 : 0x38bdf8, 
      this.lightingMode === 'day' ? 0.95 : 0.25
    );
    sunLight.position.set(7, 11, 8);
    this.scene.add(sunLight);

    // Lampu Belajar Meja (Warm Point Light)
    const deskLampLight = new THREE.PointLight(0xfde047, this.lightingMode === 'day' ? 0.6 : 1.2, 8);
    deskLampLight.position.set(1.4, 1.8, -1.5);
    this.scene.add(deskLampLight);

    // Lampu Nakas Kasur (Warm Point Light)
    const bedLampLight = new THREE.PointLight(0xfbbf24, this.lightingMode === 'day' ? 0.5 : 1.0, 7);
    bedLampLight.position.set(-0.6, 1.2, -2.5);
    this.scene.add(bedLampLight);
    this.pointLights = [deskLampLight, bedLampLight];

    // ==========================================
    // 1. ARSITEKTUR RUANGAN ISOMETRIK (DINDING & LANTAI)
    // ==========================================
    // Platform Dasar Kamar
    const basePlate = new THREE.Mesh(
      new THREE.BoxGeometry(6.6, 0.3, 6.6),
      new THREE.MeshLambertMaterial({ color: 0x090d16 })
    );
    basePlate.position.y = -0.16;
    this.scene.add(basePlate);

    // Lantai Parket Kayu Kamar
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 0.05, 6.4),
      new THREE.MeshLambertMaterial({ color: 0x334155 })
    );
    floor.position.y = 0.01;
    this.scene.add(floor);

    // Karpet Melingkar Nyaman di Tengah Ruangan
    const rug = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.6, 0.03, 32),
      new THREE.MeshLambertMaterial({ color: 0x0284c7 })
    );
    rug.position.set(0.2, 0.04, 0.2);
    this.scene.add(rug);

    const rugBorder = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.4, 0.035, 32),
      new THREE.MeshLambertMaterial({ color: 0x38bdf8 })
    );
    rugBorder.position.set(0.2, 0.045, 0.2);
    this.scene.add(rugBorder);

    // Dinding Sudut Kiri (Along Z axis at X = -3.2)
    const wallLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 3.8, 6.4),
      new THREE.MeshLambertMaterial({ color: 0x1e293b })
    );
    wallLeft.position.set(-3.2, 1.9, 0);
    this.scene.add(wallLeft);

    // Dinding Sudut Belakang (Along X axis at Z = -3.2)
    const wallBack = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 3.8, 0.2),
      new THREE.MeshLambertMaterial({ color: 0x1e293b })
    );
    wallBack.position.set(0, 1.9, -3.2);
    this.scene.add(wallBack);

    // List Bawah Dinding (Baseboard)
    const bbLeft = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 6.4), new THREE.MeshLambertMaterial({ color: 0x475569 }));
    bbLeft.position.set(-3.1, 0.1, 0);
    this.scene.add(bbLeft);
    const bbBack = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.18, 0.24), new THREE.MeshLambertMaterial({ color: 0x475569 }));
    bbBack.position.set(0, 0.1, -3.1);
    this.scene.add(bbBack);

    // Jendela 3D dengan Sinar Cahaya di Dinding Belakang
    const winFrame = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.5, 0.08), new THREE.MeshLambertMaterial({ color: 0xf8fafc }));
    winFrame.position.set(1.1, 2.3, -3.1);
    this.scene.add(winFrame);
    const winGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(1.7, 1.3),
      new THREE.MeshLambertMaterial({ color: 0x7dd3fc, emissive: 0x0284c7, emissiveIntensity: 0.35 })
    );
    winGlass.position.set(1.1, 2.3, -3.05);
    this.scene.add(winGlass);

    // Poster Jadwal Pelajaran Kelas X di Dinding Kiri
    const poster = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.1, 0.8), new THREE.MeshLambertMaterial({ color: 0x3b82f6 }));
    poster.position.set(-3.1, 2.3, -0.9);
    this.scene.add(poster);
    const posterPaper = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.0, 0.7), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    posterPaper.position.set(-3.09, 2.3, -0.9);
    this.scene.add(posterPaper);

    // Jam Dinding (Wall Clock)
    const clock = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 24), new THREE.MeshLambertMaterial({ color: 0xf8fafc }));
    clock.rotation.z = Math.PI / 2;
    clock.position.set(-3.1, 2.7, 1.2);
    this.scene.add(clock);
    const clockRim = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.025, 8, 24), new THREE.MeshLambertMaterial({ color: 0xef4444 }));
    clockRim.rotation.y = Math.PI / 2;
    clockRim.position.set(-3.08, 2.7, 1.2);
    this.scene.add(clockRim);

    // Rak Buku Gantung di Dinding
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.35), new THREE.MeshLambertMaterial({ color: 0x78350f }));
    shelf.position.set(-1.6, 2.6, -3.0);
    this.scene.add(shelf);
    const shelfBook = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.4, 0.25), new THREE.MeshLambertMaterial({ color: 0x10b981 }));
    shelfBook.position.set(-1.8, 2.83, -2.95);
    this.scene.add(shelfBook);
    const shelfPot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.16, 12), new THREE.MeshLambertMaterial({ color: 0xd97706 }));
    shelfPot.position.set(-1.3, 2.7, -2.95);
    this.scene.add(shelfPot);
    const shelfPlant = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12), new THREE.MeshLambertMaterial({ color: 0x22c55e }));
    shelfPlant.position.set(-1.3, 2.85, -2.95);
    this.scene.add(shelfPlant);

    this.zoneGroups = {};

    // ==========================================
    // 2. MODUL 1: ZONA KASUR & BANTAL 3D (-X, -Z)
    // ==========================================
    const bedGroup = new THREE.Group();
    bedGroup.position.set(-1.6, 0, -1.4);

    // Rangka Ranjang Kayu Solid
    const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.32, 2.2), new THREE.MeshLambertMaterial({ color: 0x1d4ed8 }));
    bedFrame.position.y = 0.18;
    bedGroup.add(bedFrame);

    const headboard = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 0.14), new THREE.MeshLambertMaterial({ color: 0x1e3a8a }));
    headboard.position.set(0, 0.65, -1.05);
    bedGroup.add(headboard);

    const footboard = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 0.1), new THREE.MeshLambertMaterial({ color: 0x1e3a8a }));
    footboard.position.set(0, 0.32, 1.05);
    bedGroup.add(footboard);

    // Kasur Tebal
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.25, 2.05), new THREE.MeshLambertMaterial({ color: 0xf8fafc }));
    mattress.position.y = 0.42;
    bedGroup.add(mattress);

    // 2 Bantal Empuk
    const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 0.4), new THREE.MeshLambertMaterial({ color: 0xe0e7ff }));
    pillow1.position.set(-0.35, 0.6, -0.7);
    bedGroup.add(pillow1);
    const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 0.4), new THREE.MeshLambertMaterial({ color: 0xe0e7ff }));
    pillow2.position.set(0.35, 0.6, -0.7);
    bedGroup.add(pillow2);

    // Selimut Bedcover (Warna dinamis sesuai status modul)
    const isBedDone = this.modules[0].done;
    const blanketMat = new THREE.MeshLambertMaterial({ color: isBedDone ? 0x059669 : 0xf43f5e });
    const blanket = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.15, 1.25), blanketMat);
    blanket.position.set(0, 0.52, 0.38);
    bedGroup.add(blanket);

    // Meja Nakas & Lampu Tidur
    const nakas = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), new THREE.MeshLambertMaterial({ color: 0x1e3a8a }));
    nakas.position.set(1.15, 0.28, -1.0);
    bedGroup.add(nakas);

    const bLampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.05, 12), new THREE.MeshLambertMaterial({ color: 0xd97706 }));
    bLampBase.position.set(1.15, 0.58, -1.0);
    bedGroup.add(bLampBase);
    const bLampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8), new THREE.MeshLambertMaterial({ color: 0x94a3b8 }));
    bLampStem.position.set(1.15, 0.72, -1.0);
    bedGroup.add(bLampStem);
    const bLampShade = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.22, 12), new THREE.MeshLambertMaterial({ color: 0xfef08a, emissive: 0xfacc15, emissiveIntensity: 0.6 }));
    bLampShade.position.set(1.15, 0.88, -1.0);
    bedGroup.add(bLampShade);

    this.scene.add(bedGroup);
    this.zoneGroups['ranjang'] = bedGroup;

    // ==========================================
    // 3. MODUL 2: ZONA MEJA BELAJAR & LAPTOP 3D (+X, -Z)
    // ==========================================
    const deskGroup = new THREE.Group();
    deskGroup.position.set(1.6, 0, -1.4);

    // Meja Belajar Kayu Skandinavia
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 1.1), new THREE.MeshLambertMaterial({ color: 0xd97706 }));
    deskTop.position.y = 0.8;
    deskGroup.add(deskTop);

    // Lemari Laci Samping Meja
    const drawerBlock = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.72, 0.95), new THREE.MeshLambertMaterial({ color: 0xb45309 }));
    drawerBlock.position.set(0.6, 0.38, 0);
    deskGroup.add(drawerBlock);
    for (const dy of [0.6, 0.4, 0.2]) {
      const dHandle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.04), new THREE.MeshLambertMaterial({ color: 0xf1f5f9 }));
      dHandle.position.set(0.6, dy, 0.5);
      deskGroup.add(dHandle);
    }

    // Kaki Meja Kiri
    const legL1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.76, 0.08), new THREE.MeshLambertMaterial({ color: 0x334155 }));
    legL1.position.set(-0.8, 0.4, -0.45);
    deskGroup.add(legL1);
    const legL2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.76, 0.08), new THREE.MeshLambertMaterial({ color: 0x334155 }));
    legL2.position.set(-0.8, 0.4, 0.45);
    deskGroup.add(legL2);

    // Kursi Belajar Ergonomis
    const chairGroup = new THREE.Group();
    chairGroup.position.set(-0.15, 0, 0.5);
    const cSeat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.5), new THREE.MeshLambertMaterial({ color: 0x1e40af }));
    cSeat.position.y = 0.48;
    chairGroup.add(cSeat);
    const cBack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.06), new THREE.MeshLambertMaterial({ color: 0x1e40af }));
    cBack.position.set(0, 0.76, 0.22);
    chairGroup.add(cBack);
    const cPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.44, 8), new THREE.MeshLambertMaterial({ color: 0x64748b }));
    cPole.position.y = 0.24;
    chairGroup.add(cPole);
    const cBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.04, 5), new THREE.MeshLambertMaterial({ color: 0x0f172a }));
    cBase.position.y = 0.03;
    chairGroup.add(cBase);
    deskGroup.add(chairGroup);

    // Laptop Modern Menyala
    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.03, 0.44), new THREE.MeshLambertMaterial({ color: 0x0f172a }));
    laptopBase.position.set(-0.25, 0.87, 0);
    deskGroup.add(laptopBase);
    const laptopScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.4, 0.03),
      new THREE.MeshLambertMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.65 })
    );
    laptopScreen.position.set(-0.25, 1.05, -0.18);
    laptopScreen.rotation.x = -0.2;
    deskGroup.add(laptopScreen);

    // Lampu Meja Belajar
    const dLampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.03, 12), new THREE.MeshLambertMaterial({ color: 0x334155 }));
    dLampBase.position.set(-0.7, 0.87, -0.35);
    deskGroup.add(dLampBase);
    const dLampArm = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.42, 8), new THREE.MeshLambertMaterial({ color: 0x94a3b8 }));
    dLampArm.position.set(-0.65, 1.08, -0.3);
    dLampArm.rotation.z = -0.22;
    deskGroup.add(dLampArm);
    const dLampHead = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.16, 12), new THREE.MeshLambertMaterial({ color: 0xfacc15, emissive: 0xf59e0b, emissiveIntensity: 0.6 }));
    dLampHead.position.set(-0.55, 1.22, -0.25);
    dLampHead.rotation.z = -0.75;
    deskGroup.add(dLampHead);

    // Wadah Pensil & Penggaris
    const penCup = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.15, 12), new THREE.MeshLambertMaterial({ color: 0xec4899 }));
    penCup.position.set(0.3, 0.93, -0.28);
    deskGroup.add(penCup);
    const pen1 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.2, 6), new THREE.MeshLambertMaterial({ color: 0x3b82f6 }));
    pen1.position.set(0.28, 1.02, -0.28);
    pen1.rotation.z = 0.15;
    deskGroup.add(pen1);

    // Tumpukan Buku Pelajaran Kelas X
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.05, 0.45), new THREE.MeshLambertMaterial({ color: 0x3b82f6 }));
    b1.position.set(0.65, 0.88, -0.1);
    deskGroup.add(b1);
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.05, 0.42), new THREE.MeshLambertMaterial({ color: 0xef4444 }));
    b2.position.set(0.65, 0.93, -0.1);
    deskGroup.add(b2);
    const b3 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.05, 0.4), new THREE.MeshLambertMaterial({ color: 0x10b981 }));
    b3.position.set(0.65, 0.98, -0.1);
    deskGroup.add(b3);

    this.scene.add(deskGroup);
    this.zoneGroups['meja'] = deskGroup;

    // ==========================================
    // 4. MODUL 3: ZONA LEMARI SERAGAM SMA 3D (-X, +Z)
    // ==========================================
    const wardrobeGroup = new THREE.Group();
    wardrobeGroup.position.set(-1.6, 0, 1.6);

    // Bodi Lemari Kayu Lembut
    const wBody = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 0.85), new THREE.MeshLambertMaterial({ color: 0x334155 }));
    wBody.position.y = 1.2;
    wardrobeGroup.add(wBody);

    // 2 Pintu Putih Minimalis
    const dLeft = new THREE.Mesh(new THREE.BoxGeometry(0.66, 2.25, 0.04), new THREE.MeshLambertMaterial({ color: 0xf1f5f9 }));
    dLeft.position.set(-0.34, 1.2, 0.44);
    wardrobeGroup.add(dLeft);
    const dRight = new THREE.Mesh(new THREE.BoxGeometry(0.66, 2.25, 0.04), new THREE.MeshLambertMaterial({ color: 0xf1f5f9 }));
    dRight.position.set(0.34, 1.2, 0.44);
    wardrobeGroup.add(dRight);

    // Pegangan Pintu Vertikal Elegan
    const hLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.4), new THREE.MeshLambertMaterial({ color: 0x94a3b8 }));
    hLeft.position.set(-0.08, 1.2, 0.48);
    wardrobeGroup.add(hLeft);
    const hRight = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.4), new THREE.MeshLambertMaterial({ color: 0x94a3b8 }));
    hRight.position.set(0.08, 1.2, 0.48);
    wardrobeGroup.add(hRight);

    // Seragam Putih Abu-abu Terpasang di Depan Lemari
    const hanger = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.03, 0.03), new THREE.MeshLambertMaterial({ color: 0xd97706 }));
    hanger.position.set(0, 1.75, 0.5);
    wardrobeGroup.add(hanger);
    const shirt = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 0.07), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    shirt.position.set(0, 1.38, 0.51);
    wardrobeGroup.add(shirt);
    const collar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.08), new THREE.MeshLambertMaterial({ color: 0x94a3b8 }));
    collar.position.set(0, 1.68, 0.52);
    wardrobeGroup.add(collar);
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.4, 0.03), new THREE.MeshLambertMaterial({ color: 0x1e3a8a }));
    tie.position.set(0, 1.42, 0.56);
    wardrobeGroup.add(tie);
    const trousers = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.06), new THREE.MeshLambertMaterial({ color: 0x64748b }));
    trousers.position.set(0, 0.82, 0.51);
    wardrobeGroup.add(trousers);

    this.scene.add(wardrobeGroup);
    this.zoneGroups['lemari'] = wardrobeGroup;

    // ==========================================
    // 5. MODUL 4: ZONA TAS SEKOLAH, SEPATU & LANTAI 3D (+X, +Z)
    // ==========================================
    const bagGroup = new THREE.Group();
    bagGroup.position.set(1.6, 0, 1.6);

    // Tas Ransel Sekolah 3D
    const bagMain = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.78, 0.4), new THREE.MeshLambertMaterial({ color: 0x2563eb }));
    bagMain.position.y = 0.42;
    bagGroup.add(bagMain);
    const bagPocket = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.4, 0.12), new THREE.MeshLambertMaterial({ color: 0x1d4ed8 }));
    bagPocket.position.set(0, 0.3, 0.25);
    bagGroup.add(bagPocket);
    const strap1 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.65, 0.03), new THREE.MeshLambertMaterial({ color: 0x0f172a }));
    strap1.position.set(-0.18, 0.44, -0.21);
    bagGroup.add(strap1);
    const strap2 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.65, 0.03), new THREE.MeshLambertMaterial({ color: 0x0f172a }));
    strap2.position.set(0.18, 0.44, -0.21);
    bagGroup.add(strap2);

    // Botol Minum Tumbler
    const tumbler = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.44, 16), new THREE.MeshLambertMaterial({ color: 0x06b6d4 }));
    tumbler.position.set(0.38, 0.23, 0);
    bagGroup.add(tumbler);
    const tumblerCap = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.08, 16), new THREE.MeshLambertMaterial({ color: 0x0891b2 }));
    tumblerCap.position.set(0.38, 0.48, 0);
    bagGroup.add(tumblerCap);

    // Sepasang Sepatu Sekolah
    const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.4), new THREE.MeshLambertMaterial({ color: 0x0f172a }));
    shoeL.position.set(-0.4, 0.06, 0.25);
    bagGroup.add(shoeL);
    const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.4), new THREE.MeshLambertMaterial({ color: 0x0f172a }));
    shoeR.position.set(-0.16, 0.06, 0.25);
    bagGroup.add(shoeR);

    // Sapu Pembersih Kamar
    const broomPole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.3, 8), new THREE.MeshLambertMaterial({ color: 0xb45309 }));
    broomPole.position.set(0.65, 0.6, -0.2);
    broomPole.rotation.z = -0.18;
    bagGroup.add(broomPole);
    const broomHead = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.3, 8), new THREE.MeshLambertMaterial({ color: 0xfacc15 }));
    broomHead.position.set(0.77, 0.16, -0.2);
    bagGroup.add(broomHead);

    this.scene.add(bagGroup);
    this.zoneGroups['lantai'] = bagGroup;

    // ==========================================
    // 6. KONTROL INTERAKSI ORBIT DRAG & ZOOM
    // ==========================================
    let isDragging = false;
    let prevX = 0, prevY = 0;
    const canvas = this.renderer.domElement;

    const onDown = (x, y) => { isDragging = true; prevX = x; prevY = y; };
    const onMove = (x, y) => {
      if (!isDragging || !this.scene) return;
      this.scene.rotation.y += (x - prevX) * 0.009;
      this.camera.position.y = Math.max(1.8, Math.min(8.0, this.camera.position.y - (y - prevY) * 0.01));
      this.camera.lookAt(0, 0.4, 0);
      prevX = x; prevY = y;
    };
    const onUp = () => { isDragging = false; };

    canvas.addEventListener('mousedown', (e) => onDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onUp);

    canvas.addEventListener('touchstart', (e) => { if (e.touches.length === 1) onDown(e.touches[0].clientX, e.touches[0].clientY); });
    window.addEventListener('touchmove', (e) => { if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY); });
    window.addEventListener('touchend', onUp);

    // Zoom mouse wheel
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.002;
      this.camera.position.multiplyScalar(1 + zoomFactor);
      this.camera.position.clampLength(4.0, 14.0);
      this.camera.lookAt(0, 0.4, 0);
    }, { passive: false });

    const animate = () => {
      this.animFrameId = requestAnimationFrame(animate);
      if (!isDragging && this.scene) {
        this.scene.rotation.y += 0.0018; // Auto-rotation anggun
      }
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  },

  reset3DCamera() {
    if (!this.scene || !this.camera) return;
    this.scene.rotation.y = 0;
    this.camera.position.set(6.2, 5.2, 7.0);
    this.camera.lookAt(0, 0.4, 0);
    SoundFX.click();
  },

  toggleLighting() {
    this.lightingMode = this.lightingMode === 'day' ? 'night' : 'day';
    SoundFX.pop();
    this.init3D();
    const btn = document.getElementById("decom-light-btn");
    if (btn) {
      btn.innerHTML = this.lightingMode === 'day' 
        ? '<i class="fa-solid fa-sun text-amber-400 mr-1"></i>Siang Hari' 
        : '<i class="fa-solid fa-moon text-indigo-300 mr-1"></i>Malam Hari';
    }
  },

  setDisplayMode(mode) {
    this.displayMode = mode;
    SoundFX.click();
    this.renderSimulator();
    if (mode === '3d') {
      setTimeout(() => this.init3D(), 50);
    }
  },

  setViewMode(mode) {
    this.viewMode = mode;
    SoundFX.pop();
    this.renderSimulator();
    if (mode === 'interactive' && this.displayMode === '3d') {
      setTimeout(() => this.init3D(), 50);
    }
  },

  toggleModule(idx) {
    const m = this.modules[idx];
    m.done = !m.done;
    m.steps.forEach(s => s.done = m.done);
    if (m.done) {
      SoundFX.pop();
      if (this.modules.every(mod => mod.done)) SoundFX.chime();
    } else {
      SoundFX.click();
    }
    this.renderSimulator();
    if (this.displayMode === '3d') setTimeout(() => this.init3D(), 50);
  },

  toggleStep(modIdx, stepIdx) {
    const m = this.modules[modIdx];
    m.steps[stepIdx].done = !m.steps[stepIdx].done;
    m.done = m.steps.every(s => s.done);
    if (m.done) {
      SoundFX.pop();
      if (this.modules.every(mod => mod.done)) SoundFX.chime();
    } else {
      SoundFX.step();
    }
    this.renderSimulator();
    if (this.displayMode === '3d') setTimeout(() => this.init3D(), 50);
  },

  solveAll() {
    this.modules.forEach(m => {
      m.done = true;
      m.steps.forEach(s => s.done = true);
    });
    SoundFX.success();
    this.renderSimulator();
    if (this.displayMode === '3d') setTimeout(() => this.init3D(), 50);
  },

  resetAll() {
    this.modules.forEach(m => {
      m.done = false;
      m.steps.forEach(s => s.done = false);
    });
    SoundFX.click();
    this.renderSimulator();
    if (this.displayMode === '3d') setTimeout(() => this.init3D(), 50);
  },

  render() {
    const container = document.getElementById("decomposition-lab-container");
    if (!container) return;

    container.innerHTML = `
      <div class="flex flex-col gap-6 w-full">
        <!-- Bagian Atas: Video 1 Tunggal dengan Cover Thumbnail YouTube -->
        <div class="w-full space-y-4">
          ${VideoLabHelper.renderVideoSection({
            containerId: 'decom-video-viewport',
            labObject: 'DecompositionLab',
            video: this.video,
            literacyPrompt: 'Amati saat narator menjelaskan bagaimana satu persoalan besar yang terlihat melelahkan (misal: merapikan kamar) dapat diselesaikan tanpa rasa malas jika kita membaginya menjadi beberapa sub-tugas kecil yang independen.',
            timestamps: [
              { time: '00:45', note: 'Definisi Dekomposisi: Memecah persoalan besar tanpa kehilangan tujuan akhir.' },
              { time: '02:15', note: 'Studi Kasus Kehidupan Nyata: Membagi aktivitas kamar tidur menjadi modul mandiri.' },
              { time: '03:40', note: 'Kunci Sukses: Kerjakan satu bagian kecil sampai tuntas sebelum pindah ke bagian berikutnya.' }
            ]
          })}
        </div>

        <!-- Bagian Bawah: Simulator Dekomposisi Visual 3D Interaktif -->
        <div class="w-full space-y-4" id="decom-sim-wrapper">
          <!-- Rendered by renderSimulator() -->
        </div>
      </div>
    `;

    this.renderSimulator();
    if (this.displayMode === '3d') setTimeout(() => this.init3D(), 60);
  },

  renderSimulator() {
    const wrapper = document.getElementById("decom-sim-wrapper");
    if (!wrapper) return;

    const completedCount = this.modules.filter(m => m.done).length;
    const progressPercent = Math.round((completedCount / this.modules.length) * 100);
    const isOverwhelmed = this.viewMode === 'overwhelmed';
    const is3D = this.displayMode === '3d';

    wrapper.innerHTML = `
      <div class="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-md space-y-5">
        <!-- Header Lab & Mode Tampilan -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <span class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <i class="fa-solid fa-cube text-blue-500"></i> Model Diorama 3D Dekomposisi
            </span>
            <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
              Kamar Tidur Siswa Kelas X (Diorama 3D)
            </h3>
          </div>

          <!-- Switcher Mode 3D WebGL vs Ilustrasi Isometrik HD -->
          <div class="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs">
            <button onclick="DecompositionLab.setDisplayMode('3d')" 
              class="px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${is3D ? 'bg-blue-600 text-white shadow' : 'text-slate-600 dark:text-slate-300'}">
              <i class="fa-solid fa-cube"></i>
              <span>3D Orbit 360°</span>
            </button>
            <button onclick="DecompositionLab.setDisplayMode('svg')" 
              class="px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${!is3D ? 'bg-blue-600 text-white shadow' : 'text-slate-600 dark:text-slate-300'}">
              <i class="fa-solid fa-image"></i>
              <span>Isometrik HD</span>
            </button>
          </div>
        </div>

        ${isOverwhelmed ? `
          <!-- TAMPILAN MODE BEBAN KOGNITIF -->
          <div class="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border-2 border-rose-300 dark:border-rose-900 space-y-4 animate-fadeIn">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow text-lg">
                <i class="fa-solid fa-head-side-virus"></i>
              </div>
              <div>
                <h4 class="text-sm font-black text-rose-900 dark:text-rose-200">
                  Otak Mengalami "Decision Fatigue" (Kelelahan Keputusan)!
                </h4>
                <p class="text-base text-rose-700 dark:text-rose-300 mt-0.5 leading-relaxed">
                  Ketika melihat seluruh kamar sebagai satu masalah besar tanpa diurai, otak mengalami kebingungan prioritas dan akhirnya memilih untuk menunda (prokrastinasi).
                </p>
              </div>
            </div>

            <div class="space-y-1.5 p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900/60 text-xs">
              <div class="flex justify-between font-bold text-rose-800 dark:text-rose-300">
                <span>Tingkat Beban Pikiran & Kebingungan Otak:</span>
                <span class="font-mono text-rose-600">92% (SANGAT TINGGI)</span>
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div class="bg-gradient-to-r from-amber-500 to-rose-600 h-full rounded-full animate-pulse" style="width: 92%"></div>
              </div>
            </div>

            <div class="text-center pt-2">
              <button onclick="DecompositionLab.setViewMode('interactive')" 
                class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg transition transform hover:scale-105 inline-flex items-center gap-2">
                <i class="fa-solid fa-cube"></i>
                <span>Terapkan Dekomposisi 3D Sekarang!</span>
              </button>
            </div>
          </div>
        ` : `
          <!-- TAMPILAN VIEWPORT 3D / ILUSTRASI HD -->
          <div class="space-y-2.5">
            ${is3D ? `
              <!-- 1. MODEL 3D INTERAKTIF THREE.JS REALISTIS -->
              <div class="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
                <div id="decom-3d-canvas" style="height: 320px; width: 100%;"></div>

                <!-- HUD Kiri Atas: Petunjuk Drag & Zoom -->
                <div class="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                  <span class="px-2.5 py-1 rounded-lg bg-slate-900/90 text-white font-mono text-[10px] border border-slate-700 shadow-sm flex items-center gap-1.5 backdrop-blur-md">
                    <i class="fa-solid fa-arrows-rotate text-blue-400"></i> Drag Putar 360° • Scroll Zoom
                  </span>
                </div>

                <!-- HUD Kanan Atas: Tombol Suasana Lampu & Reset Kamera -->
                <div class="absolute top-3 right-3 flex items-center gap-1.5">
                  <button id="decom-light-btn" onclick="DecompositionLab.toggleLighting()" 
                    class="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-[10px] font-bold border border-slate-700 transition flex items-center shadow-sm backdrop-blur-md">
                    ${this.lightingMode === 'day' 
                      ? '<i class="fa-solid fa-sun text-amber-400 mr-1"></i>Siang' 
                      : '<i class="fa-solid fa-moon text-indigo-300 mr-1"></i>Malam'}
                  </button>
                  <button onclick="DecompositionLab.reset3DCamera()" 
                    class="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-[10px] font-bold border border-slate-700 transition flex items-center shadow-sm backdrop-blur-md">
                    <i class="fa-solid fa-camera-rotate mr-1"></i>Reset
                  </button>
                </div>

                <!-- HUD Bawah: Informasi Fitur Ruangan 3D -->
                <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[10px] pointer-events-none">
                  <span class="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-cyan-300">
                    🛏️ Kasur • 💻 Meja • 🚪 Lemari • 🎒 Tas
                  </span>
                  <span class="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-emerald-300 font-bold">
                    ${completedCount}/4 Selesai
                  </span>
                </div>
              </div>
            ` : `
              <!-- 2. ILUSTRASI ISOMETRIK HD VECTOR (ASSETS) -->
              <div class="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl p-2 flex items-center justify-center">
                <img src="assets/dekomposisi_3d.jpg" alt="Ilustrasi Diorama 3D Dekomposisi Kamar Tidur" 
                  class="w-full max-h-[320px] object-contain rounded-xl hover:scale-105 transition-transform duration-500">
                
                <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] text-white">
                  <span class="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 backdrop-blur-md text-amber-300">
                    🎨 Model Diorama 3D Kamar Siswa
                  </span>
                  <button onclick="DecompositionLab.setDisplayMode('3d')" 
                    class="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold transition shadow hover:bg-blue-700">
                    Beralih ke 3D Orbit ➔
                  </button>
                </div>
              </div>
            `}
          </div>

          <!-- Progress Bar & Tombol Tindakan -->
          <div class="space-y-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700">
            <div class="flex items-center justify-between text-xs font-bold">
              <span class="text-slate-700 dark:text-slate-300">
                Progres Dekomposisi Masalah: <strong>${completedCount} dari 4 Bagian Selesai</strong>
              </span>
              <span class="${progressPercent === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'} font-mono">
                ${progressPercent}% Tuntas
              </span>
            </div>
            <div class="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 h-full transition-all duration-500 rounded-full" 
                style="width: ${progressPercent}%"></div>
            </div>
            <div class="flex items-center justify-between pt-1">
              <p class="text-base text-slate-500 dark:text-slate-400">
                ${progressPercent === 100 
                  ? '🎉 <strong>Kamar Rapi & Nyaman!</strong> Masalah besar selesai karena diurai menjadi 4 bagian kecil.' 
                  : 'Klik tombol centang di setiap kartu zona di bawah untuk merapikan.'}
              </p>
              <div class="flex items-center gap-1.5 shrink-0">
                <button onclick="DecompositionLab.solveAll()" class="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 transition">
                  Tuntaskan Semua
                </button>
                <button onclick="DecompositionLab.resetAll()" class="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 transition">
                  Reset
                </button>
              </div>
            </div>
          </div>

          <!-- Rincian 4 Kartu Modul Dekomposisi -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            ${this.modules.map((m, mIdx) => `
              <div class="p-3 rounded-xl border transition-all ${m.done 
                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'} space-y-2">
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg flex items-center justify-center ${m.done ? 'bg-emerald-600 text-white' : 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300'}">
                      <i class="fa-solid ${m.icon} text-xs"></i>
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-slate-900 dark:text-slate-100">${m.title}</h4>
                      <span class="text-[10px] ${m.done ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}">${m.done ? '✨ Bersih & Siap' : '⚠️ Berantakan'}</span>
                    </div>
                  </div>

                  <button onclick="DecompositionLab.toggleModule(${mIdx})" 
                    class="px-2.5 py-0.5 text-xs font-bold rounded-lg transition border flex items-center gap-1 ${m.done 
                      ? 'bg-emerald-600 text-white border-emerald-600' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'}">
                    <i class="fa-solid ${m.done ? 'fa-check' : 'fa-circle'} text-[9px]"></i>
                    <span>${m.done ? 'Rapi' : 'Bereskan'}</span>
                  </button>
                </div>

                <div class="pt-1 space-y-1 border-t border-slate-100 dark:border-slate-700/60">
                  ${m.steps.map((st, sIdx) => `
                    <div onclick="DecompositionLab.toggleStep(${mIdx}, ${sIdx})" 
                      class="flex items-center justify-between p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer transition select-none text-[11px]">
                      <div class="flex items-center gap-1.5">
                        <span class="w-3.5 h-3.5 rounded flex items-center justify-center border ${st.done ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-600 text-transparent'}">
                          <i class="fa-solid fa-check text-[8px] ${st.done ? '' : 'hidden'}"></i>
                        </span>
                        <span class="${st.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}">${st.text}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        `}

        <!-- Refleksi Literasi Kritis -->
        <div class="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 space-y-2 text-base">
          <strong class="font-bold text-blue-900 dark:text-blue-200 block flex items-center gap-1.5 text-base">
            <i class="fa-solid fa-brain text-blue-600 dark:text-blue-400"></i>
            Refleksi Literasi Dekomposisi:
          </strong>
          <p class="text-slate-700 dark:text-slate-300 leading-relaxed font-normal text-base">
            Saat kamu menghadapi teks bacaan narasi yang sangat tebal atau masalah pemrograman rumit, <strong>jangan membaca sekaligus tanpa arah</strong>. Terapkan Dekomposisi: belah menjadi paragraf pembuka (konteks), data tabel (fakta), dan inti pertanyaan akhir.
          </p>
        </div>
      </div>
    `;
  }
};

// ============================================================================
// 2. LAB PENGENALAN POLA (POLA ANTREAN KANTIN SEKOLAH) - 3D
// ============================================================================
const PatternLab = {
  // Video 1 Utama: Sesuai Tautan YouTube User (DAVIDTAN - Pengenalan Pola)
  video: { 
    id: 'j6BEfr4DEPQ', 
    title: 'Berpikir Komputasional (Pengenalan Pola)', 
    channel: 'DAVIDTAN', 
    duration: '06:17'
  },
  selectedTimeIdx: 2, // Default pada jam sibuk istirahat 1 (09.45)
  isPlayingTimeline: false,
  timelineInterval: null,
  activeStrategy: null,
  scene: null,
  camera: null,
  renderer: null,
  animFrameId: null,
  studentQueueGroup: null,
  pillarMeshes: [],

  canteenData: [
    { time: '07.00', count: 5, avatars: 1, waitMin: '1', status: 'Sangat Sepi', color: 'emerald', tip: 'Kantin baru buka, penjual sedang menata makanan. Makanan langsung dilayani tanpa antre.' },
    { time: '08.15', count: 12, avatars: 2, waitMin: '2', status: 'Sepi / Santai', color: 'emerald', tip: 'Jam pelajaran pertama, hanya 1-2 siswa yang izin minum saat istirahat ringan.' },
    { time: '09.45', count: 68, avatars: 8, waitMin: '20', isBell: true, status: 'PUNCAK RAMAI 1', color: 'rose', tip: 'Bel Istirahat Pertama! Ratusan siswa serentak menyerbu stan bakso dan es teh.' },
    { time: '11.00', count: 15, avatars: 2, waitMin: '3', status: 'Sepi Normal', color: 'emerald', tip: 'Siswa kembali masuk kelas, suasana kantin kembali lengang dan tertib.' },
    { time: '12.15', count: 85, avatars: 10, waitMin: '25', isBell: true, status: 'PUNCAK MAKSIMAL', color: 'rose', tip: 'Istirahat Kedua & Makan Siang! Antrean mencapai titik terpanjang hari ini.' },
    { time: '13.30', count: 8, avatars: 1, waitMin: '1', status: 'Menjelang Tutup', color: 'slate', tip: 'Kantin mulai beres-beres menjelang jam pulang sekolah.' }
  ],

  init() {
    this.render();
  },

  init3D() {
    const container = document.getElementById("pattern-3d-canvas");
    if (!container || typeof THREE === 'undefined') return;

    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    container.innerHTML = '';

    const width = container.clientWidth || 400;
    const height = 300;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x064e3b); // Emerald-950

    this.camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 1000);
    this.camera.position.set(5.5, 4.5, 6.2);
    this.camera.lookAt(0, 0.4, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfef08a, 0.9);
    dirLight.position.set(6, 9, 7);
    this.scene.add(dirLight);

    // Platform Lantai Kantin 3D
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(7.2, 0.15, 6.2),
      new THREE.MeshLambertMaterial({ color: 0x0f172a })
    );
    floor.position.y = -0.08;
    this.scene.add(floor);

    // Stan Makanan Kantin 3D
    const stallGroup = new THREE.Group();
    stallGroup.position.set(-1.8, 0, 0);

    // Meja Kasir Stan
    const counterMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 1.0, 3.6),
      new THREE.MeshLambertMaterial({ color: 0xd97706 })
    );
    counterMesh.position.y = 0.5;
    stallGroup.add(counterMesh);

    // Atap Kanopi Merah
    const canopyMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.2, 4.0),
      new THREE.MeshLambertMaterial({ color: 0xef4444 })
    );
    canopyMesh.position.set(0, 2.0, 0);
    stallGroup.add(canopyMesh);

    // Tiang Atap
    for (const [px, pz] of [[-0.7, -1.6], [0.7, -1.6], [-0.7, 1.6], [0.7, 1.6]]) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.0), new THREE.MeshLambertMaterial({ color: 0x94a3b8 }));
      pole.position.set(px, 1.0, pz);
      stallGroup.add(pole);
    }

    // Figur 3D Penjual di Belakang Meja
    const sellerBody = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.8), new THREE.MeshLambertMaterial({ color: 0xf59e0b }));
    sellerBody.position.set(-0.4, 0.8, 0);
    stallGroup.add(sellerBody);
    const sellerHead = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), new THREE.MeshLambertMaterial({ color: 0xfde047 }));
    sellerHead.position.set(-0.4, 1.35, 0);
    stallGroup.add(sellerHead);

    this.scene.add(stallGroup);

    // Grup Barisan Avatar Siswa 3D
    this.studentQueueGroup = new THREE.Group();
    this.scene.add(this.studentQueueGroup);

    // 6 Pilar Grafik Batang 3D di Latar Belakang
    const pillarsGroup = new THREE.Group();
    pillarsGroup.position.set(2.4, 0, -1.6);
    this.pillarMeshes = [];

    this.canteenData.forEach((d, i) => {
      const h = Math.max(0.3, (d.count / 100) * 2.2);
      const pColor = d.color === 'rose' ? 0xf43f5e : 0x06b6d4;
      const pMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, h, 0.35),
        new THREE.MeshLambertMaterial({ color: pColor })
      );
      pMesh.position.set(0, h / 2, i * 0.6);
      pillarsGroup.add(pMesh);
      this.pillarMeshes.push(pMesh);
    });
    this.scene.add(pillarsGroup);

    this.update3DQueue();

    // Mouse & Touch Drag Controls
    let isDragging = false;
    let prevX = 0, prevY = 0;
    const canvas = this.renderer.domElement;

    const onDown = (x, y) => { isDragging = true; prevX = x; prevY = y; };
    const onMove = (x, y) => {
      if (!isDragging || !this.scene) return;
      this.scene.rotation.y += (x - prevX) * 0.01;
      this.camera.position.y = Math.max(1.8, Math.min(7.5, this.camera.position.y - (y - prevY) * 0.01));
      this.camera.lookAt(0, 0.4, 0);
      prevX = x; prevY = y;
    };
    const onUp = () => { isDragging = false; };

    canvas.addEventListener('mousedown', (e) => onDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onUp);

    canvas.addEventListener('touchstart', (e) => { if (e.touches.length === 1) onDown(e.touches[0].clientX, e.touches[0].clientY); });
    window.addEventListener('touchmove', (e) => { if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY); });
    window.addEventListener('touchend', onUp);

    const animate = () => {
      this.animFrameId = requestAnimationFrame(animate);
      if (!isDragging && this.scene) {
        this.scene.rotation.y += 0.002;
      }
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  },

  update3DQueue() {
    if (!this.studentQueueGroup) return;
    while (this.studentQueueGroup.children.length > 0) {
      this.studentQueueGroup.remove(this.studentQueueGroup.children[0]);
    }

    const current = this.canteenData[this.selectedTimeIdx];
    const numStudents = current.avatars || 1;

    for (let i = 0; i < numStudents; i++) {
      const sGroup = new THREE.Group();
      sGroup.position.set(-0.6 + i * 0.5, 0, 0);

      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.18, 0.65),
        new THREE.MeshLambertMaterial({ color: 0x3b82f6 })
      );
      body.position.y = 0.5;
      sGroup.add(body);

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 12, 12),
        new THREE.MeshLambertMaterial({ color: 0xfde047 })
      );
      head.position.y = 0.95;
      sGroup.add(head);

      const bag = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.28, 0.2),
        new THREE.MeshLambertMaterial({ color: 0x1e293b })
      );
      bag.position.set(0.1, 0.52, 0);
      sGroup.add(bag);

      this.studentQueueGroup.add(sGroup);
    }

    if (this.pillarMeshes) {
      this.pillarMeshes.forEach((mesh, idx) => {
        if (idx === this.selectedTimeIdx) {
          mesh.material.emissive = new THREE.Color(0xfacc15);
          mesh.material.emissiveIntensity = 0.6;
        } else {
          mesh.material.emissive = new THREE.Color(0x000000);
          mesh.material.emissiveIntensity = 0;
        }
      });
    }
  },

  reset3DCamera() {
    if (!this.scene || !this.camera) return;
    this.scene.rotation.y = 0;
    this.camera.position.set(5.5, 4.5, 6.2);
    this.camera.lookAt(0, 0.4, 0);
    SoundFX.click();
  },

  selectTime(idx) {
    this.selectedTimeIdx = idx;
    const current = this.canteenData[idx];
    if (current.color === 'rose') {
      SoundFX.bell();
    } else {
      SoundFX.pop();
    }
    this.update3DQueue();
    this.renderSimulatorTextOnly();
  },

  togglePlayTimeline() {
    if (this.isPlayingTimeline) {
      this.stopTimeline();
    } else {
      this.startTimeline();
    }
  },

  startTimeline() {
    this.isPlayingTimeline = true;
    SoundFX.pop();
    this.renderSimulatorTextOnly();

    const maxIdx = this.canteenData.length - 1;
    this.timelineInterval = setInterval(() => {
      this.selectedTimeIdx = (this.selectedTimeIdx + 1) > maxIdx ? 0 : this.selectedTimeIdx + 1;
      const current = this.canteenData[this.selectedTimeIdx];
      if (current.color === 'rose') {
        SoundFX.bell();
      } else {
        SoundFX.step();
      }
      this.update3DQueue();
      this.renderSimulatorTextOnly();
    }, 1800);
  },

  stopTimeline() {
    this.isPlayingTimeline = false;
    if (this.timelineInterval) clearInterval(this.timelineInterval);
    SoundFX.click();
    this.renderSimulatorTextOnly();
  },

  setStrategy(strat) {
    this.activeStrategy = strat;
    if (strat === 'B') SoundFX.chime();
    else if (strat === 'A') SoundFX.warn();
    else SoundFX.pop();
    this.renderSimulatorTextOnly();
  },

  render() {
    const container = document.getElementById("pattern-lab-container");
    if (!container) return;

    container.innerHTML = `
      <div class="flex flex-col gap-6 w-full">
        <!-- Bagian Atas: Video 1 Tunggal dengan Cover Thumbnail YouTube -->
        <div class="w-full space-y-4">
          ${VideoLabHelper.renderVideoSection({
            containerId: 'pattern-video-viewport',
            labObject: 'PatternLab',
            video: this.video,
            literacyPrompt: 'Amati saat pemateri dalam video menjelaskan bagaimana kita menemukan kesamaan pola, tren, dan keteraturan dalam data maupun aktivitas sehari-hari untuk memecahkan persoalan baru secara lebih cepat.',
            timestamps: [
              { time: '00:40', note: 'Konsep Dasar Pengenalan Pola: Mengapa pola mempermudah kerja otak manusia.' },
              { time: '02:15', note: 'Melihat Karakteristik Serupa: Menghubungkan pola dari pengalaman masa lalu.' },
              { time: '04:30', note: 'Penerapan Solusi: Menggunakan pola yang teridentifikasi untuk merumuskan aksi nyata.' }
            ]
          })}
        </div>

        <!-- Bagian Bawah: Simulator Pola 3D Interaktif -->
        <div class="w-full space-y-4" id="pattern-sim-wrapper">
          <!-- Rendered by renderSimulator() -->
        </div>
      </div>
    `;

    this.renderSimulator();
    setTimeout(() => this.init3D(), 60);
  },

  renderSimulator() {
    const wrapper = document.getElementById("pattern-sim-wrapper");
    if (!wrapper) return;

    wrapper.innerHTML = `
      <div class="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-md space-y-5">
        <!-- Header Lab -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <span class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <i class="fa-solid fa-cube text-emerald-500"></i> Simulasi 3D Pengenalan Pola
            </span>
            <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
              Pola Antrean Kantin Sekolah (Model 3D)
            </h3>
          </div>

          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <i class="fa-solid fa-utensils text-emerald-500 mr-1"></i>
            <span>Studi Kasus Kantin</span>
          </div>
        </div>

        <!-- 3D Viewport Stan Kantin & Antrean Siswa -->
        <div class="space-y-2">
          <div class="relative w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
            <div id="pattern-3d-canvas" style="height: 300px; width: 100%;"></div>

            <!-- HUD Kontrol Kamera & Status -->
            <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
              <span class="px-2 py-0.5 rounded-md bg-slate-900/85 text-white font-mono text-[10px] border border-slate-700 flex items-center gap-1">
                <i class="fa-solid fa-arrows-rotate text-emerald-400"></i> Drag Putar 3D 360°
              </span>
            </div>

            <div class="absolute top-2.5 right-2.5 flex items-center gap-1">
              <button onclick="PatternLab.reset3DCamera()" 
                class="px-2 py-0.5 rounded-md bg-slate-900/85 hover:bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700 transition">
                <i class="fa-solid fa-camera-rotate mr-1"></i>Reset Kamera
              </button>
            </div>

            <div class="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[10px] pointer-events-none">
              <span class="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-amber-300">
                Stan Bakso & Es Teh Bu Siti
              </span>
              <span class="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-cyan-300 font-bold" id="pattern-3d-hud-time">
                Jam: ${this.canteenData[this.selectedTimeIdx].time} WIB
              </span>
            </div>
          </div>
        </div>

        <!-- Bagian Kontrol Waktu, Chart, & Sandbox -->
        <div id="pattern-details-container">
          <!-- Rendered by renderSimulatorTextOnly() -->
        </div>
      </div>
    `;

    this.renderSimulatorTextOnly();
  },

  renderSimulatorTextOnly() {
    const container = document.getElementById("pattern-details-container");
    if (!container) return;

    const current = this.canteenData[this.selectedTimeIdx];

    const hudTime = document.getElementById("pattern-3d-hud-time");
    if (hudTime) hudTime.innerText = `Jam: ${current.time} WIB`;

    container.innerHTML = `
      <div class="space-y-4">
        <!-- Bar Waktu & Tombol Play Otomatis -->
        <div class="p-3 rounded-xl bg-slate-900 text-white border border-slate-700 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-300 font-bold">
              <i class="fa-solid fa-chart-column text-emerald-400 mr-1"></i>
              Tingkat Antrean Jam ${current.time} WIB: <span class="text-amber-300">${current.count} Siswa</span>
            </span>
            <button onclick="PatternLab.togglePlayTimeline()" 
              class="px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${this.isPlayingTimeline ? 'bg-amber-500 text-slate-900 animate-pulse' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}">
              <i class="fa-solid ${this.isPlayingTimeline ? 'fa-pause' : 'fa-play'} text-[10px]"></i>
              <span>${this.isPlayingTimeline ? 'Jeda' : 'Putar Waktu Otomatis'}</span>
            </button>
          </div>

          <!-- Tombol Pilihan Jam -->
          <div class="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1">
            ${this.canteenData.map((d, idx) => `
              <button onclick="PatternLab.selectTime(${idx})" 
                class="py-1.5 px-1 rounded-lg text-xs font-bold transition flex flex-col items-center justify-center border ${idx === this.selectedTimeIdx 
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow ring-1 ring-emerald-300' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-400'}">
                <span>${d.time}</span>
                <span class="text-[9px] font-normal opacity-80">${d.color === 'rose' ? 'Puncak' : 'Biasa'}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Analisis Pola Jam Terpilih -->
        <div class="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-1.5 text-base">
          <div class="flex items-center justify-between">
            <span class="font-bold text-emerald-900 dark:text-emerald-200">
              Analisis Jam ${current.time} WIB: <span class="px-2 py-0.5 rounded text-[10px] ${current.color === 'rose' ? 'bg-rose-100 text-rose-700 font-bold' : 'bg-emerald-100 text-emerald-700'}">${current.status}</span>
            </span>
          </div>
          <p class="text-slate-700 dark:text-slate-300 leading-relaxed font-normal text-base">
            ${current.tip}
          </p>
        </div>

        <!-- Sandbox Strategi Berbasis Pola -->
        <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <span class="font-bold text-slate-800 dark:text-slate-200 block text-xs sm:text-sm">
            <i class="fa-solid fa-lightbulb text-amber-500 mr-1"></i> Eksperimen Keputusan Berbasis Pola:
          </span>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button onclick="PatternLab.setStrategy('A')" 
              class="p-2 rounded-lg border text-left transition ${this.activeStrategy === 'A' ? 'bg-rose-100 border-rose-400 text-rose-900 font-bold' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}">
              A. Lari Pas Bel (09.45)
            </button>
            <button onclick="PatternLab.setStrategy('B')" 
              class="p-2 rounded-lg border text-left transition ${this.activeStrategy === 'B' ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}">
              B. Titip Pesan (09.20)
            </button>
            <button onclick="PatternLab.setStrategy('C')" 
              class="p-2 rounded-lg border text-left transition ${this.activeStrategy === 'C' ? 'bg-blue-100 border-blue-400 text-blue-900 font-bold' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}">
              C. Beli Santai (10.15)
            </button>
          </div>

          ${this.activeStrategy ? `
            <div class="p-3 rounded-lg border text-base leading-relaxed animate-fadeIn ${this.activeStrategy === 'B' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : (this.activeStrategy === 'A' ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-blue-50 border-blue-300 text-blue-900')}">
              ${this.activeStrategy === 'A' ? '⚠️ <strong>Hasil A:</strong> Terjebak antrean 20 menit berdesakan. Waktu istirahat habis terbuang.' : ''}
              ${this.activeStrategy === 'B' ? '✨ <strong>Hasil B (SANGAT CERDAS):</strong> Makanan siap diambil dalam 30 detik tanpa antre berkat membaca pola jam istirahat!' : ''}
              ${this.activeStrategy === 'C' ? '☕ <strong>Hasil C:</strong> Dilayani dalam 2 menit karena antrean sudah kosong dan santai.' : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
};

// ============================================================================
// 3. LAB ABSTRAKSI (PETA NAVIGASI OJOL: MENYARING DETAIL PENTING)
// ============================================================================
const AbstractionLab = {
  // Hanya menampilkan 1 Video Utama
  video: { 
    id: 'v-ty7uDYOKY', 
    title: 'Abstraksi dalam Berpikir Komputasional: Menyaring Hal Penting', 
    channel: 'Ismed Eko Hadi Saputra', 
    duration: '04:40'
  },
  layers: {
    trees: true,
    cats: true,
    fences: true,
    shops: true,
    clouds: true
  },
  isDriving: false,
  driveProgress: 0,
  driveInterval: null,
  activeTextFilter: false,

  init() {
    this.render();
  },

  init3D() {
    // Kompatibilitas sistem
  },

  toggleLayer(layerKey) {
    this.layers[layerKey] = !this.layers[layerKey];
    SoundFX.pop();
    this.renderSimulator();
  },

  setAllLayers(val) {
    Object.keys(this.layers).forEach(k => this.layers[k] = val);
    if (!val) SoundFX.success();
    else SoundFX.click();
    this.renderSimulator();
  },

  getCognitiveLoad() {
    const activeCount = Object.values(this.layers).filter(Boolean).length;
    return Math.round((activeCount / 5) * 85) + 15;
  },

  startDrive() {
    if (this.isDriving) return;
    this.isDriving = true;
    this.driveProgress = 0;
    SoundFX.pop();
    this.renderSimulator();

    const isDistracted = this.getCognitiveLoad() > 60;
    const intervalMs = isDistracted ? 140 : 80;

    this.driveInterval = setInterval(() => {
      this.driveProgress += 4;
      if (this.driveProgress % 20 === 0) {
        SoundFX.step();
      }
      this.renderSimulator();

      if (this.driveProgress >= 100) {
        clearInterval(this.driveInterval);
        this.isDriving = false;
        SoundFX.chime();
        this.renderSimulator();
      }
    }, intervalMs);
  },

  toggleTextFilter() {
    this.activeTextFilter = !this.activeTextFilter;
    SoundFX.chime();
    this.renderSimulator();
  },

  render() {
    const container = document.getElementById("abstraction-lab-container");
    if (!container) return;

    container.innerHTML = `
      <div class="flex flex-col gap-6 w-full">
        <!-- Bagian Atas: Video 1 Tunggal dengan Cover Thumbnail YouTube -->
        <div class="w-full space-y-4">
          ${VideoLabHelper.renderVideoSection({
            containerId: 'abstraction-video-viewport',
            labObject: 'AbstractionLab',
            video: this.video,
            literacyPrompt: 'Perhatikan analogi Peta Digital yang dijelaskan dalam video: mengapa aplikasi Google Maps atau Gojek/Grab TIDAK menampilkan setiap pohon, kucing, atau warna cat pagar di layar? Mengapa membuang detail tersebut justru membuat kita sampai lebih cepat?',
            timestamps: [
              { time: '01:15', note: 'Definisi Abstraksi: Fokus pada fakta penentu, abaikan informasi distraksi.' },
              { time: '02:40', note: 'Analogi Peta Navigasi Ojol: Mengapa detail berlebihan justru berbahaya bagi pengemudi.' },
              { time: '03:55', note: 'Penerapan pada Soal Cerita Ujian: Memilah kata kunci fakta dari kalimat pemanis.' }
            ]
          })}
        </div>

        <!-- Bagian Bawah: Simulator Abstraksi Interaktif -->
        <div class="w-full space-y-4" id="abstraction-sim-wrapper">
          <!-- Rendered by renderSimulator() -->
        </div>
      </div>
    `;

    this.renderSimulator();
  },

  renderSimulator() {
    const wrapper = document.getElementById("abstraction-sim-wrapper");
    if (!wrapper) return;

    const cogLoad = this.getCognitiveLoad();
    const isClean = cogLoad <= 30;

    const p = this.driveProgress;
    let bikeX = 40, bikeY = 80;
    if (p <= 20) {
      bikeX = 40 + (p / 20) * 100; bikeY = 80;
    } else if (p <= 35) {
      bikeX = 140; bikeY = 80 - ((p - 20) / 15) * 40;
    } else if (p <= 65) {
      bikeX = 140 + ((p - 35) / 30) * 120; bikeY = 40;
    } else if (p <= 80) {
      bikeX = 260; bikeY = 40 + ((p - 65) / 15) * 80;
    } else {
      bikeX = 260 + ((p - 80) / 20) * 100; bikeY = 120;
    }

    let turnText = "Menunggu keberangkatan...";
    if (this.isDriving) {
      if (p < 25) turnText = "📍 Memulai perjalanan dari Gerbang SMA (Jl. Pendidikan)";
      else if (p < 55) turnText = "↪️ Belok kanan di Simpang Merdeka (200 meter)";
      else if (p < 85) turnText = "↩️ Belok kiri di Bundaran Flamboyan";
      else turnText = "🏁 Tiba di Rumah Siswa dengan selamat!";
    } else if (this.driveProgress >= 100) {
      turnText = "🎉 Perjalanan Selesai! Tiba tepat waktu di tujuan.";
    }

    wrapper.innerHTML = `
      <div class="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-md space-y-5">
        <!-- Header Lab -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <span class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <i class="fa-solid fa-filter"></i> Simulasi Praktik Abstraksi
            </span>
            <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
              Peta Ojek Online: Saring Distraksi Menuju Rute Inti
            </h3>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="AbstractionLab.setAllLayers(false)" 
              class="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white shadow hover:bg-emerald-700 transition">
              <i class="fa-solid fa-wand-magic-sparkles mr-1"></i>Abstraksi Maksimal
            </button>
            <button onclick="AbstractionLab.setAllLayers(true)" 
              class="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition">
              Munculkan Semua
            </button>
          </div>
        </div>

        <!-- Beban Kognitif Driver Meter -->
        <div class="p-3.5 rounded-xl border space-y-1.5 text-xs ${isClean 
          ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800' 
          : 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'}">
          <div class="flex items-center justify-between font-bold">
            <span class="${isClean ? 'text-emerald-900 dark:text-emerald-200' : 'text-rose-900 dark:text-rose-200'}">
              <i class="fa-solid ${isClean ? 'fa-circle-check text-emerald-600' : 'fa-triangle-exclamation text-rose-600'} mr-1"></i>
              Beban Pikiran Pengemudi: <strong>${cogLoad}%</strong>
            </span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isClean ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'}">
              ${isClean ? '✨ SANGAT JELAS & FOKUS' : '⚠️ DISTRAKSI BERBAHAYA'}
            </span>
          </div>
          <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-300 ${isClean ? 'bg-emerald-500' : (cogLoad > 65 ? 'bg-rose-500' : 'bg-amber-500')}"
              style="width: ${cogLoad}%"></div>
          </div>
        </div>

        <!-- Layar Peta Navigasi GPS Ojol -->
        <div class="p-4 rounded-xl bg-slate-900 text-white border border-slate-700 space-y-3">
          <div class="flex items-center justify-between text-xs text-slate-300">
            <span class="flex items-center gap-1.5 font-bold">
              <i class="fa-solid fa-map-location-dot text-amber-400"></i>
              <span>Layar Navigasi Pengemudi:</span>
            </span>
            <button onclick="AbstractionLab.startDrive()" ${this.isDriving ? 'disabled' : ''} 
              class="px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${this.isDriving ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-md'}">
              <i class="fa-solid fa-motorcycle"></i>
              <span>${this.isDriving ? 'Sedang Melaju...' : 'Jalankan Ojol 🛵'}</span>
            </button>
          </div>

          <!-- Banner Notifikasi Turn-by-Turn GPS -->
          <div class="p-2.5 rounded-lg bg-slate-800/90 border border-slate-700 text-xs flex items-center justify-between text-cyan-300">
            <span class="truncate font-semibold">${turnText}</span>
            <span class="text-[10px] font-mono shrink-0 ml-2 text-slate-400">Progres: ${this.driveProgress}%</span>
          </div>

          <!-- Peta Grafis SVG Dinamis -->
          <div class="relative w-full h-52 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center p-2 select-none">
            ${this.layers.trees ? `
              <div class="absolute inset-0 pointer-events-none text-[11px] text-emerald-400 font-semibold animate-fadeIn">
                <span class="absolute top-2 left-6">🌳 Pohon Mangga</span>
                <span class="absolute bottom-4 left-10">🌴 Pohon Palem</span>
              </div>
            ` : ''}

            ${this.layers.cats ? `
              <div class="absolute inset-0 pointer-events-none text-[11px] text-amber-300 font-semibold animate-fadeIn">
                <span class="absolute top-8 left-1/3">🐱 Kucing Menyeberang</span>
              </div>
            ` : ''}

            ${this.layers.fences ? `
              <div class="absolute inset-0 pointer-events-none text-[11px] text-pink-300 font-semibold animate-fadeIn">
                <span class="absolute bottom-8 left-1/4">🎨 Pagar Rumah Cat Merah</span>
              </div>
            ` : ''}

            ${this.layers.shops ? `
              <div class="absolute inset-0 pointer-events-none text-[11px] text-yellow-300 font-semibold animate-fadeIn">
                <span class="absolute top-2 right-1/4">🏪 Warung Madura</span>
              </div>
            ` : ''}

            ${this.layers.clouds ? `
              <div class="absolute inset-0 pointer-events-none text-[11px] text-slate-400 font-semibold animate-fadeIn">
                <span class="absolute top-1 left-1/2">☁️ Awan Mendung</span>
              </div>
            ` : ''}

            <svg class="w-full h-full" viewBox="0 0 400 160">
              <path d="M 40,80 L 140,80 L 140,40 L 260,40 L 260,120 L 360,120" 
                fill="none" stroke="#1e293b" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" />
              
              <path d="M 40,80 L 140,80 L 140,40 L 260,40 L 260,120 L 360,120" 
                fill="none" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />

              <circle cx="40" cy="80" r="10" fill="#22c55e" />
              <text x="40" y="105" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">Gerbang SMA</text>

              <circle cx="360" cy="120" r="10" fill="#ef4444" />
              <text x="360" y="145" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">Rumah Siswa</text>

              <circle cx="${bikeX}" cy="${bikeY}" r="9" fill="#fbbf24" stroke="#ffffff" stroke-width="2" class="${this.isDriving ? 'animate-pulse' : ''}" />
            </svg>
          </div>
        </div>

        <!-- Kotak Perkakas Abstraksi -->
        <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <span class="font-bold text-slate-800 dark:text-slate-200 block">
            <i class="fa-solid fa-sliders text-amber-500 mr-1"></i> Kotak Perkakas Abstraksi:
          </span>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            <label class="p-2 rounded-lg border flex items-center gap-1.5 cursor-pointer transition select-none ${this.layers.trees ? 'bg-white dark:bg-slate-800 border-slate-300' : 'bg-emerald-50 text-emerald-800 font-bold border-emerald-300'}">
              <input type="checkbox" ${this.layers.trees ? 'checked' : ''} onchange="AbstractionLab.toggleLayer('trees')" class="rounded text-amber-600">
              <span class="text-[11px]">🌳 Pohon & Semak</span>
            </label>
            <label class="p-2 rounded-lg border flex items-center gap-1.5 cursor-pointer transition select-none ${this.layers.cats ? 'bg-white dark:bg-slate-800 border-slate-300' : 'bg-emerald-50 text-emerald-800 font-bold border-emerald-300'}">
              <input type="checkbox" ${this.layers.cats ? 'checked' : ''} onchange="AbstractionLab.toggleLayer('cats')" class="rounded text-amber-600">
              <span class="text-[11px]">🐱 Kucing</span>
            </label>
            <label class="p-2 rounded-lg border flex items-center gap-1.5 cursor-pointer transition select-none ${this.layers.fences ? 'bg-white dark:bg-slate-800 border-slate-300' : 'bg-emerald-50 text-emerald-800 font-bold border-emerald-300'}">
              <input type="checkbox" ${this.layers.fences ? 'checked' : ''} onchange="AbstractionLab.toggleLayer('fences')" class="rounded text-amber-600">
              <span class="text-[11px]">🎨 Cat Pagar</span>
            </label>
            <label class="p-2 rounded-lg border flex items-center gap-1.5 cursor-pointer transition select-none ${this.layers.shops ? 'bg-white dark:bg-slate-800 border-slate-300' : 'bg-emerald-50 text-emerald-800 font-bold border-emerald-300'}">
              <input type="checkbox" ${this.layers.shops ? 'checked' : ''} onchange="AbstractionLab.toggleLayer('shops')" class="rounded text-amber-600">
              <span class="text-[11px]">🏪 Spanduk Toko</span>
            </label>
            <label class="p-2 rounded-lg border flex items-center gap-1.5 cursor-pointer transition select-none ${this.layers.clouds ? 'bg-white dark:bg-slate-800 border-slate-300' : 'bg-emerald-50 text-emerald-800 font-bold border-emerald-300'}">
              <input type="checkbox" ${this.layers.clouds ? 'checked' : ''} onchange="AbstractionLab.toggleLayer('clouds')" class="rounded text-amber-600">
              <span class="text-[11px]">☁️ Awan Langit</span>
            </label>
            <div class="p-2 rounded-lg border border-dashed border-cyan-400 bg-cyan-50/50 flex items-center gap-1 text-cyan-800 font-bold">
              <i class="fa-solid fa-lock text-[10px]"></i>
              <span class="text-[11px]">🛣️ Jalan (Wajib)</span>
            </div>
          </div>
        </div>

        <!-- Uji Soal Cerita -->
        <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-slate-800 dark:text-slate-200">
              <i class="fa-solid fa-book-open mr-1 text-blue-500"></i> Uji Coba Abstraksi Membaca Soal Ujian:
            </span>
            <button onclick="AbstractionLab.toggleTextFilter()" 
              class="px-2.5 py-1 rounded-lg font-bold transition ${this.activeTextFilter ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'}">
              ${this.activeTextFilter ? 'Teks Asli' : 'Abstraksi Teks'}
            </button>
          </div>
          <div class="p-3.5 rounded-lg bg-white dark:bg-slate-800 text-base leading-relaxed text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            ${this.activeTextFilter ? `
              Pada hari Senin yang cerah, <mark class="bg-amber-200 dark:bg-amber-900/60 font-bold px-1 rounded">Rudi berangkat pukul 06.30</mark> dengan sepeda. Di jalan ia melihat kucing lucu dan pohon jambu. Karena rantai sepedanya lepas, <mark class="bg-amber-200 dark:bg-amber-900/60 font-bold px-1 rounded">Rudi berhenti 10 menit untuk membetulkannya</mark>. <mark class="bg-amber-200 dark:bg-amber-900/60 font-bold px-1 rounded">Perjalanan memakan waktu 15 menit</mark>. <span class="text-emerald-600 dark:text-emerald-400 font-bold">Pukul berapa Rudi tiba? (Jawab: 06.55)</span>
            ` : `
              Pada hari Senin yang cerah, Rudi berangkat pukul 06.30 dengan sepeda. Di jalan ia melihat kucing lucu dan pohon jambu yang berbuah lebat. Karena rantai sepedanya lepas, Rudi berhenti 10 menit untuk membetulkannya. Penjual es sempat menyapanya ramah. Perjalanan memakan waktu 15 menit. Pukul berapa Rudi tiba di sekolah?
            `}
          </div>
        </div>
      </div>
    `;
  }
};

// ============================================================================
// 4. LAB ALGORITMA (DIAGRAM ALIR DINAMIS & RUTINITAS PAGI SISWA) - 3D DIORAMA
// ============================================================================
const AlgorithmLab = {
  // Hanya menampilkan 1 Video Utama
  video: { 
    id: 'R8SDxWnlhSU', 
    title: 'Belajar Algoritma Mudah & Seru Bersama Mie Instan', 
    channel: 'Kang Sidik Guru', 
    duration: '05:24'
  },
  weatherCondition: 'cerah', // 'cerah' atau 'hujan'
  wakeTime: '05.30', // '05.30', '06.15', '06.35'
  currentStep: 0,
  isRunning: false,
  runInterval: null,
  scene: null,
  camera: null,
  renderer: null,
  animFrameId: null,
  studentAvatar: null,
  umbrellaMesh: null,
  cloudGroup: null,
  sunMesh: null,
  rainGroup: null,
  dirLight: null,
  alarmClockGroup: null,
  flagMesh: null,
  stationRings: [],
  stationCoords: [
    { x: -3.2, z: -1.7, label: 'Kamar: Alarm Berbunyi' },          // 1: Bangun Pagi
    { x: -1.9, z: -1.7, label: 'Kamar: Rapikan Kasur' },           // 2: Rapikan Tempat Tidur
    { x: -1.0, z: 0.9,  label: 'Kamar Mandi & Seragam SMA' },      // 3: Mandi & Berpakaian
    { x: 0.6,  z: -1.4, label: 'Meja Makan: Sarapan & Susu' },     // 4: Sarapan
    { x: 1.6,  z: 0.7,  label: 'Persimpangan Logika IF/ELSE' },     // 5: Percabangan Cuaca
    { x: 3.2,  z: 1.8,  label: 'Gerbang Megah SMA Negeri 1' }       // 6: Tiba di Sekolah
  ],
  targetPos: { x: -3.2, z: -1.7 },
  currentPos: { x: -3.2, z: -1.7 },

  flowNodes: [
    { id: 1, label: 'Langkah 1: Alarm Pagi Berbunyi', icon: 'fa-bell', place: 'Kamar Tidur Andi', desc: 'Mendengar dering alarm, mematikannya, dan bangkit dari kasur tepat waktu.' },
    { id: 2, label: 'Langkah 2: Merapikan Kasur & Bantal', icon: 'fa-bed', place: 'Kamar Tidur Andi', desc: 'Menepuk bantal, meratakan sprei, dan melipat selimut secara rapi teratur.' },
    { id: 3, label: 'Langkah 3: Mandi & Memakai Seragam', icon: 'fa-shirt', place: 'Kamar Mandi', desc: 'Mandi pagi segar, mengeringkan badan, mengenakan seragam putih abu-abu SMA.' },
    { id: 4, label: 'Langkah 4: Sarapan Sehat & Minum Susu', icon: 'fa-utensils', place: 'Meja Makan', desc: 'Makan sarapan bergizi, minum susu hangat, dan menyiapkan tas punggung.' },
    { id: 5, label: 'Langkah 5: Percabangan Cuaca (IF / ELSE)', icon: 'fa-code-branch', place: 'Persimpangan Jalan', isDecision: true, desc: 'IF cuaca cerah -> gowes sepeda/motor. ELSE hujan deras -> sedia payung & naik angkot.' },
    { id: 6, label: 'Langkah 6: Tiba di Gerbang SMA Negeri 1', icon: 'fa-school', place: 'Gerbang Sekolah', desc: 'Melangkah masuk gerbang sekolah sebelum pukul 06.45 WIB.' }
  ],

  init() {
    this.render();
  },

  init3D() {
    const container = document.getElementById("algorithm-3d-canvas");
    if (!container || typeof THREE === 'undefined') return;

    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    container.innerHTML = '';

    const width = container.clientWidth || 400;
    const height = 320;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0f1d); // Deep space slate

    this.camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 1000);
    this.camera.position.set(6.8, 6.2, 7.8);
    this.camera.lookAt(0.3, 0.4, 0.2);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // Pencahayaan Diorama
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xffedd5, 0.95);
    this.dirLight.position.set(7, 12, 8);
    this.scene.add(this.dirLight);

    const fillLight = new THREE.DirectionalLight(0xa5b4fc, 0.4);
    fillLight.position.set(-6, 8, -5);
    this.scene.add(fillLight);

    // 1. Base Pedestal Diorama
    const basePedestal = new THREE.Mesh(
      new THREE.BoxGeometry(9.6, 0.35, 7.2),
      new THREE.MeshLambertMaterial({ color: 0x090d16 })
    );
    basePedestal.position.y = -0.18;
    this.scene.add(basePedestal);

    // 2. Lantai Zona Rumah (Parquet Kayu Hangat)
    const houseFloor = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 0.08, 6.4),
      new THREE.MeshLambertMaterial({ color: 0xb45309 })
    );
    houseFloor.position.set(-2.4, 0.04, -0.1);
    this.scene.add(houseFloor);

    // Karpet Lembut Kamar Tidur
    const bedRug = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 0.09, 2.3),
      new THREE.MeshLambertMaterial({ color: 0x38bdf8 })
    );
    bedRug.position.set(-2.6, 0.05, -1.7);
    this.scene.add(bedRug);

    // 3. Lantai Zona Luar / Jalan & Gerbang Sekolah (Aspal & Rumput)
    const streetFloor = new THREE.Mesh(
      new THREE.BoxGeometry(4.6, 0.08, 6.4),
      new THREE.MeshLambertMaterial({ color: 0x1e293b })
    );
    streetFloor.position.set(2.2, 0.04, -0.1);
    this.scene.add(streetFloor);

    // Rumput Halaman Sekolah
    const lawnFloor = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.09, 2.6),
      new THREE.MeshLambertMaterial({ color: 0x15803d })
    );
    lawnFloor.position.set(3.2, 0.05, 1.7);
    this.scene.add(lawnFloor);

    // 4. Jalur Winding Road Berpendar Menghubungkan Stasiun
    const roadPoints = this.stationCoords.map(c => new THREE.Vector3(c.x, 0.10, c.z));
    const curve = new THREE.CatmullRomCurve3(roadPoints);
    const roadTube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 48, 0.11, 8, false),
      new THREE.MeshLambertMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.85 })
    );
    this.scene.add(roadTube);

    // 5. Cincin Waypoint Halo di Tiap Stasiun
    this.stationRings = [];
    this.stationCoords.forEach((c) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.48, 0.035, 8, 24),
        new THREE.MeshLambertMaterial({ color: 0x475569 })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.set(c.x, 0.09, c.z);
      this.scene.add(ring);
      this.stationRings.push(ring);
    });

    // ==========================================
    // STASIUN 1 & 2: KAMAR TIDUR ANDI & RUMAH
    // ==========================================
    const roomGroup = new THREE.Group();

    // Dinding Kamar Tidur (L-shape)
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 2.2, 0.12),
      new THREE.MeshLambertMaterial({ color: 0xf1f5f9 })
    );
    backWall.position.set(-2.4, 1.15, -3.2);
    roomGroup.add(backWall);

    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 2.2, 3.4),
      new THREE.MeshLambertMaterial({ color: 0xe2e8f0 })
    );
    leftWall.position.set(-4.55, 1.15, -1.5);
    roomGroup.add(leftWall);

    // Jendela Kamar dengan Cahaya Pagi
    const winFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 0.95, 0.15),
      new THREE.MeshLambertMaterial({ color: 0xffffff })
    );
    winFrame.position.set(-2.8, 1.45, -3.2);
    roomGroup.add(winFrame);
    const winGlass = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 0.8, 0.16),
      new THREE.MeshLambertMaterial({ color: 0x38bdf8 })
    );
    winGlass.position.set(-2.8, 1.45, -3.2);
    roomGroup.add(winGlass);

    // Poster Semangat Belajar di Dinding
    const poster = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.42, 0.02),
      new THREE.MeshLambertMaterial({ color: 0x0284c7 })
    );
    poster.position.set(-1.4, 1.5, -3.13);
    roomGroup.add(poster);

    // Ranjang Modern (Kasur, Sprei, Bantal, Selimut)
    const bedFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.35, 0.22, 1.95),
      new THREE.MeshLambertMaterial({ color: 0x78350f })
    );
    bedFrame.position.set(-2.8, 0.19, -2.0);
    roomGroup.add(bedFrame);

    const headboard = new THREE.Mesh(
      new THREE.BoxGeometry(1.35, 0.75, 0.1),
      new THREE.MeshLambertMaterial({ color: 0x78350f })
    );
    headboard.position.set(-2.8, 0.46, -2.93);
    roomGroup.add(headboard);

    const mattress = new THREE.Mesh(
      new THREE.BoxGeometry(1.22, 0.24, 1.75),
      new THREE.MeshLambertMaterial({ color: 0x60a5fa })
    );
    mattress.position.set(-2.8, 0.38, -2.0);
    roomGroup.add(mattress);

    const pillow = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.14, 0.42),
      new THREE.MeshLambertMaterial({ color: 0xffffff })
    );
    pillow.position.set(-2.8, 0.52, -2.62);
    roomGroup.add(pillow);

    const blanket = new THREE.Mesh(
      new THREE.BoxGeometry(1.24, 0.12, 0.85),
      new THREE.MeshLambertMaterial({ color: 0x2563eb })
    );
    blanket.position.set(-2.8, 0.44, -1.55);
    roomGroup.add(blanket);

    // Meja Nakas Samping Ranjang
    const nightstand = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, 0.55, 0.55),
      new THREE.MeshLambertMaterial({ color: 0x92400e })
    );
    nightstand.position.set(-3.85, 0.35, -2.65);
    roomGroup.add(nightstand);

    // Lampu Tidur Meja
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.05, 12), new THREE.MeshLambertMaterial({ color: 0x475569 }));
    lampBase.position.set(-3.85, 0.65, -2.75);
    roomGroup.add(lampBase);
    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.22, 12), new THREE.MeshLambertMaterial({ color: 0xfef08a }));
    lampShade.position.set(-3.85, 0.82, -2.75);
    roomGroup.add(lampShade);

    // Jam Weker 3D Berdering
    this.alarmClockGroup = new THREE.Group();
    const clockBody = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16), new THREE.MeshLambertMaterial({ color: 0xef4444 }));
    clockBody.rotation.x = Math.PI / 2;
    this.alarmClockGroup.add(clockBody);
    const bellL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), new THREE.MeshLambertMaterial({ color: 0xf59e0b }));
    bellL.position.set(-0.08, 0.13, 0);
    this.alarmClockGroup.add(bellL);
    const bellR = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), new THREE.MeshLambertMaterial({ color: 0xf59e0b }));
    bellR.position.set(0.08, 0.13, 0);
    this.alarmClockGroup.add(bellR);
    this.alarmClockGroup.position.set(-3.85, 0.72, -2.52);
    roomGroup.add(this.alarmClockGroup);

    this.scene.add(roomGroup);

    // ==========================================
    // STASIUN 3: KAMAR MANDI & SERAGAM SMA
    // ==========================================
    const bathGroup = new THREE.Group();
    bathGroup.position.set(-1.0, 0, 0.9);

    // Bilik Kaca Shower Mandi
    const showerGlass = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 1.7, 0.85),
      new THREE.MeshLambertMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.42 })
    );
    showerGlass.position.set(-0.55, 0.93, 0.4);
    bathGroup.add(showerGlass);

    const showerPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.5), new THREE.MeshLambertMaterial({ color: 0x94a3b8 }));
    showerPipe.position.set(-0.55, 1.0, 0.7);
    bathGroup.add(showerPipe);

    // Cermin Wastafel
    const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.9, 0.06), new THREE.MeshLambertMaterial({ color: 0x475569 }));
    mirrorFrame.position.set(0.3, 1.05, 0.6);
    bathGroup.add(mirrorFrame);
    const mirrorGlass = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.78, 0.07), new THREE.MeshLambertMaterial({ color: 0xa5f3fc }));
    mirrorGlass.position.set(0.3, 1.05, 0.6);
    bathGroup.add(mirrorGlass);

    // Stand Manekin Seragam Putih Abu-Abu SMA
    const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2), new THREE.MeshLambertMaterial({ color: 0x78350f }));
    standPole.position.set(0.1, 0.6, -0.4);
    bathGroup.add(standPole);
    const uniformShirt = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.42, 0.2), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    uniformShirt.position.set(0.1, 0.95, -0.4);
    bathGroup.add(uniformShirt);
    const uniformPants = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.45, 0.18), new THREE.MeshLambertMaterial({ color: 0x475569 }));
    uniformPants.position.set(0.1, 0.55, -0.4);
    bathGroup.add(uniformPants);

    this.scene.add(bathGroup);

    // ==========================================
    // STASIUN 4: RUANG MAKAN & SARAPAN
    // ==========================================
    const diningGroup = new THREE.Group();
    diningGroup.position.set(0.6, 0, -1.4);

    // Meja Bundar Kayu
    const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.08, 20), new THREE.MeshLambertMaterial({ color: 0xb45309 }));
    tableTop.position.set(0, 0.54, 0);
    diningGroup.add(tableTop);
    const tableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.54, 12), new THREE.MeshLambertMaterial({ color: 0x78350f }));
    tableLeg.position.set(0, 0.27, 0);
    diningGroup.add(tableLeg);

    // Kursi Makan Kayu
    const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 0.42), new THREE.MeshLambertMaterial({ color: 0x92400e }));
    chairSeat.position.set(0, 0.32, -0.65);
    diningGroup.add(chairSeat);
    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.45, 0.05), new THREE.MeshLambertMaterial({ color: 0x92400e }));
    chairBack.position.set(0, 0.55, -0.84);
    diningGroup.add(chairBack);

    // Piring Sarapan, Telur Mata Sapi, & Roti
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.2, 0.03, 16), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    plate.position.set(0.05, 0.59, 0);
    diningGroup.add(plate);
    const eggWhite = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 12), new THREE.MeshLambertMaterial({ color: 0xf8fafc }));
    eggWhite.position.set(0.05, 0.61, 0);
    diningGroup.add(eggWhite);
    const eggYolk = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), new THREE.MeshLambertMaterial({ color: 0xfacc15 }));
    eggYolk.position.set(0.05, 0.63, 0);
    diningGroup.add(eggYolk);

    // Gelas Susu
    const milkCup = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.05, 0.18, 12), new THREE.MeshLambertMaterial({ color: 0xf8fafc, transparent: true, opacity: 0.85 }));
    milkCup.position.set(-0.25, 0.67, 0.1);
    diningGroup.add(milkCup);

    // Tas Ransel Sekolah Siap Pakai
    const sideBag = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.34, 0.18), new THREE.MeshLambertMaterial({ color: 0x1e3a8a }));
    sideBag.position.set(0.5, 0.25, 0.3);
    diningGroup.add(sideBag);

    this.scene.add(diningGroup);

    // ==========================================
    // STASIUN 5: PERSIMPANGAN LOGIKA IF/ELSE CUACA
    // ==========================================
    const crossGroup = new THREE.Group();
    crossGroup.position.set(1.6, 0, 0.7);

    // Tiang Penunjuk Arah Cabang Logika
    const signPost = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.7), new THREE.MeshLambertMaterial({ color: 0x475569 }));
    signPost.position.set(0, 0.85, 0);
    crossGroup.add(signPost);

    // Plang Arah IF Cerah (Kuning Oranye)
    const signSunny = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 0.06), new THREE.MeshLambertMaterial({ color: 0xf59e0b }));
    signSunny.position.set(-0.4, 1.48, 0);
    crossGroup.add(signSunny);

    // Plang Arah ELSE Hujan (Biru Muda)
    const signRainy = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 0.06), new THREE.MeshLambertMaterial({ color: 0x0284c7 }));
    signRainy.position.set(0.4, 1.25, 0);
    crossGroup.add(signRainy);

    // Kendaraan Cabang Cerah: Sepeda Santai 3D
    const bikeGroup = new THREE.Group();
    bikeGroup.position.set(-0.7, 0, -0.3);
    const wheelF = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.04, 8, 14), new THREE.MeshLambertMaterial({ color: 0x0f172a }));
    wheelF.position.set(0.28, 0.2, 0);
    bikeGroup.add(wheelF);
    const wheelB = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.04, 8, 14), new THREE.MeshLambertMaterial({ color: 0x0f172a }));
    wheelB.position.set(-0.28, 0.2, 0);
    bikeGroup.add(wheelB);
    const bikeFrame = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.05, 0.05), new THREE.MeshLambertMaterial({ color: 0x06b6d4 }));
    bikeFrame.position.set(0, 0.28, 0);
    bikeGroup.add(bikeFrame);
    crossGroup.add(bikeGroup);

    // Kendaraan Cabang Hujan: Angkot Biru 3D
    const angkotGroup = new THREE.Group();
    angkotGroup.position.set(0.75, 0, 0.1);
    const vanBody = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.55, 0.65), new THREE.MeshLambertMaterial({ color: 0x0284c7 }));
    vanBody.position.set(0, 0.38, 0);
    angkotGroup.add(vanBody);
    const vanRoof = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.1, 0.62), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    vanRoof.position.set(0, 0.68, 0);
    angkotGroup.add(vanRoof);
    const vanGlass = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.67), new THREE.MeshLambertMaterial({ color: 0xbae6fd }));
    vanGlass.position.set(0.1, 0.48, 0);
    angkotGroup.add(vanGlass);
    // 4 Roda Angkot
    for (const [wx, wz] of [[-0.35, -0.34], [0.35, -0.34], [-0.35, 0.34], [0.35, 0.34]]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 10), new THREE.MeshLambertMaterial({ color: 0x0f172a }));
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, 0.11, wz);
      angkotGroup.add(wheel);
    }
    crossGroup.add(angkotGroup);

    // Awan 3D Mengambang di Atas Persimpangan
    this.cloudGroup = new THREE.Group();
    this.cloudGroup.position.set(0, 3.1, 0);
    for (const [cx, cy, cz, cr] of [[0, 0, 0, 0.45], [-0.3, -0.05, 0.1, 0.35], [0.3, -0.05, -0.1, 0.38], [0.15, 0.15, 0.1, 0.32]]) {
      const cMesh = new THREE.Mesh(new THREE.SphereGeometry(cr, 10, 10), new THREE.MeshLambertMaterial({ color: 0xffffff }));
      cMesh.position.set(cx, cy, cz);
      this.cloudGroup.add(cMesh);
    }
    crossGroup.add(this.cloudGroup);

    // Matahari Cerah
    this.sunMesh = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), new THREE.MeshLambertMaterial({ color: 0xfacc15 }));
    this.sunMesh.position.set(-0.6, 3.4, -0.4);
    crossGroup.add(this.sunMesh);

    // Sistem Partikel Hujan (Raindrops)
    this.rainGroup = new THREE.Group();
    for (let r = 0; r < 32; r++) {
      const drop = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.15),
        new THREE.MeshLambertMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 })
      );
      drop.position.set((Math.random() - 0.5) * 1.5, Math.random() * 2.5 + 0.5, (Math.random() - 0.5) * 1.5);
      drop.userData = { speed: 0.08 + Math.random() * 0.06 };
      this.rainGroup.add(drop);
    }
    this.rainGroup.position.set(0, 0, 0);
    this.rainGroup.visible = (this.weatherCondition === 'hujan');
    crossGroup.add(this.rainGroup);

    this.scene.add(crossGroup);

    // ==========================================
    // STASIUN 6: GERBANG MEGAH SMA NEGERI 1
    // ==========================================
    const schoolGroup = new THREE.Group();
    schoolGroup.position.set(3.2, 0, 1.8);

    // Pilar Bata Megah Kiri & Kanan
    const pillarL = new THREE.Mesh(new THREE.BoxGeometry(0.42, 2.1, 0.42), new THREE.MeshLambertMaterial({ color: 0xb91c1c }));
    pillarL.position.set(-0.9, 1.05, 0);
    schoolGroup.add(pillarL);
    const capL = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.1, 0.52), new THREE.MeshLambertMaterial({ color: 0xf8fafc }));
    capL.position.set(-0.9, 2.15, 0);
    schoolGroup.add(capL);

    const pillarR = new THREE.Mesh(new THREE.BoxGeometry(0.42, 2.1, 0.42), new THREE.MeshLambertMaterial({ color: 0xb91c1c }));
    pillarR.position.set(0.9, 1.05, 0);
    schoolGroup.add(pillarR);
    const capR = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.1, 0.52), new THREE.MeshLambertMaterial({ color: 0xf8fafc }));
    capR.position.set(0.9, 2.15, 0);
    schoolGroup.add(capR);

    // Balok Papan Nama SMA NEGERI 1
    const archBeam = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.38, 0.22), new THREE.MeshLambertMaterial({ color: 0x065f46 }));
    archBeam.position.set(0, 2.0, 0);
    schoolGroup.add(archBeam);
    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.24, 0.04), new THREE.MeshLambertMaterial({ color: 0xf8fafc }));
    signBoard.position.set(0, 2.0, 0.12);
    schoolGroup.add(signBoard);

    // Pintu Gerbang Besi Terbuka
    const gateL = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.2, 0.04), new THREE.MeshLambertMaterial({ color: 0x0f172a }));
    gateL.position.set(-0.45, 0.7, 0.35);
    gateL.rotation.y = -0.5;
    schoolGroup.add(gateL);
    const gateR = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.2, 0.04), new THREE.MeshLambertMaterial({ color: 0x0f172a }));
    gateR.position.set(0.45, 0.7, 0.35);
    gateR.rotation.y = 0.5;
    schoolGroup.add(gateR);

    // Pos Satpam Sekolah
    const guardCabin = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.2, 0.85), new THREE.MeshLambertMaterial({ color: 0xf1f5f9 }));
    guardCabin.position.set(1.45, 0.65, -0.6);
    schoolGroup.add(guardCabin);
    const guardRoof = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.22, 1.05), new THREE.MeshLambertMaterial({ color: 0xd97706 }));
    guardRoof.position.set(1.45, 1.35, -0.6);
    schoolGroup.add(guardRoof);
    const guardWin = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.4, 0.04), new THREE.MeshLambertMaterial({ color: 0xbae6fd }));
    guardWin.position.set(1.01, 0.75, -0.6);
    guardWin.rotation.y = Math.PI / 2;
    schoolGroup.add(guardWin);

    // Tiang Bendera Merah Putih
    const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.8), new THREE.MeshLambertMaterial({ color: 0xe2e8f0 }));
    flagPole.position.set(-1.3, 1.4, 0.3);
    schoolGroup.add(flagPole);

    this.flagMesh = new THREE.Group();
    const flagRed = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.18, 0.02), new THREE.MeshLambertMaterial({ color: 0xef4444 }));
    flagRed.position.set(0.28, 0.09, 0);
    this.flagMesh.add(flagRed);
    const flagWhite = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.18, 0.02), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    flagWhite.position.set(0.28, -0.09, 0);
    this.flagMesh.add(flagWhite);
    this.flagMesh.position.set(-1.3, 2.5, 0.3);
    schoolGroup.add(this.flagMesh);

    // Semak Hias Bunga Halaman
    const bush1 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), new THREE.MeshLambertMaterial({ color: 0x16a34a }));
    bush1.position.set(-0.9, 0.2, 0.4);
    schoolGroup.add(bush1);
    const bush2 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), new THREE.MeshLambertMaterial({ color: 0x16a34a }));
    bush2.position.set(0.9, 0.2, 0.4);
    schoolGroup.add(bush2);

    this.scene.add(schoolGroup);

    // Pohon Estetik Low-poly di Tepi Jalan
    const treeGroup = new THREE.Group();
    treeGroup.position.set(0.4, 0, 2.2);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.1), new THREE.MeshLambertMaterial({ color: 0x78350f }));
    trunk.position.set(0, 0.55, 0);
    treeGroup.add(trunk);
    const leaves1 = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.7, 8), new THREE.MeshLambertMaterial({ color: 0x15803d }));
    leaves1.position.set(0, 1.25, 0);
    treeGroup.add(leaves1);
    const leaves2 = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.6, 8), new THREE.MeshLambertMaterial({ color: 0x22c55e }));
    leaves2.position.set(0, 1.65, 0);
    treeGroup.add(leaves2);
    this.scene.add(treeGroup);

    // Lampu Jalan Estetik
    const streetLamp = new THREE.Group();
    streetLamp.position.set(2.4, 0, -1.8);
    const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 2.0), new THREE.MeshLambertMaterial({ color: 0x334155 }));
    lampPole.position.set(0, 1.0, 0);
    streetLamp.add(lampPole);
    const lampBulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshLambertMaterial({ color: 0xfef08a }));
    lampBulb.position.set(0, 2.05, 0);
    streetLamp.add(lampBulb);
    this.scene.add(streetLamp);

    // ==========================================
    // 6. AVATAR SISWA ANDI 3D LENGKAP & DINAMIS
    // ==========================================
    this.studentAvatar = new THREE.Group();

    // Kaki Kiri & Kanan (Celana Abu-Abu & Sepatu Hitam)
    this.studentAvatar.leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.42, 0.13), new THREE.MeshLambertMaterial({ color: 0x334155 }));
    this.studentAvatar.leftLeg.position.set(-0.08, 0.21, 0);
    this.studentAvatar.add(this.studentAvatar.leftLeg);

    this.studentAvatar.rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.42, 0.13), new THREE.MeshLambertMaterial({ color: 0x334155 }));
    this.studentAvatar.rightLeg.position.set(0.08, 0.21, 0);
    this.studentAvatar.add(this.studentAvatar.rightLeg);

    // Badan: Baju Seragam Putih SMA
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.42, 0.2), new THREE.MeshLambertMaterial({ color: 0xf8fafc }));
    torso.position.set(0, 0.58, 0);
    this.studentAvatar.add(torso);

    // Dasi / Saku Abu-Abu
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.02), new THREE.MeshLambertMaterial({ color: 0x64748b }));
    tie.position.set(0, 0.62, 0.11);
    this.studentAvatar.add(tie);

    // Lengan Kiri & Kanan
    this.studentAvatar.leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.38, 0.09), new THREE.MeshLambertMaterial({ color: 0xf8fafc }));
    this.studentAvatar.leftArm.position.set(-0.22, 0.56, 0);
    this.studentAvatar.add(this.studentAvatar.leftArm);

    this.studentAvatar.rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.38, 0.09), new THREE.MeshLambertMaterial({ color: 0xf8fafc }));
    this.studentAvatar.rightArm.position.set(0.22, 0.56, 0);
    this.studentAvatar.add(this.studentAvatar.rightArm);

    // Kepala & Rambut Rapi Siswa
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.24), new THREE.MeshLambertMaterial({ color: 0xfde047 }));
    head.position.set(0, 0.92, 0);
    this.studentAvatar.add(head);

    const hair = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.12, 0.26), new THREE.MeshLambertMaterial({ color: 0x1e293b }));
    hair.position.set(0, 1.02, 0);
    this.studentAvatar.add(hair);

    // Tas Ransel Biru Tua
    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.32, 0.15), new THREE.MeshLambertMaterial({ color: 0x1e3a8a }));
    backpack.position.set(0, 0.58, -0.15);
    this.studentAvatar.add(backpack);

    // Payung Pelindung Hujan
    this.umbrellaMesh = new THREE.Group();
    const umbCanopy = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.24, 10), new THREE.MeshLambertMaterial({ color: 0x06b6d4 }));
    umbCanopy.position.set(0, 0.55, 0);
    this.umbrellaMesh.add(umbCanopy);
    const umbStick = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.65), new THREE.MeshLambertMaterial({ color: 0x334155 }));
    umbStick.position.set(0, 0.25, 0);
    this.umbrellaMesh.add(umbStick);
    this.umbrellaMesh.position.set(0.24, 0.55, 0.08);
    this.umbrellaMesh.visible = (this.weatherCondition === 'hujan');
    this.studentAvatar.add(this.umbrellaMesh);

    this.scene.add(this.studentAvatar);
    this.update3DStudentPos();

    // Sinkronisasi Kondisi Cuaca Awal
    this.applyWeatherVisuals();

    // Drag Rotate & Mouse Wheel Zoom Controls
    let isDragging = false;
    let prevX = 0, prevY = 0;
    const canvas = this.renderer.domElement;

    const onDown = (x, y) => { isDragging = true; prevX = x; prevY = y; };
    const onMove = (x, y) => {
      if (!isDragging || !this.scene) return;
      this.scene.rotation.y += (x - prevX) * 0.009;
      this.camera.position.y = Math.max(2.2, Math.min(8.5, this.camera.position.y - (y - prevY) * 0.01));
      this.camera.lookAt(0.3, 0.4, 0.2);
      prevX = x; prevY = y;
    };
    const onUp = () => { isDragging = false; };

    canvas.addEventListener('mousedown', (e) => onDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onUp);

    canvas.addEventListener('touchstart', (e) => { if (e.touches.length === 1) onDown(e.touches[0].clientX, e.touches[0].clientY); });
    window.addEventListener('touchmove', (e) => { if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY); });
    window.addEventListener('touchend', onUp);

    // Zoom Kamera dengan Scroll Roda Mouse
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.005;
      this.camera.position.x = Math.max(3.5, Math.min(11.0, this.camera.position.x + zoomFactor * 0.8));
      this.camera.position.z = Math.max(3.5, Math.min(12.0, this.camera.position.z + zoomFactor * 0.8));
      this.camera.lookAt(0.3, 0.4, 0.2);
    }, { passive: false });

    // Loop Animasi 3D Utama
    const animate = () => {
      this.animFrameId = requestAnimationFrame(animate);

      // Rotasi perlahan saat santai
      if (!isDragging && this.scene) {
        this.scene.rotation.y += 0.0012;
      }

      // Animasi Jam Weker bergetar saat langkah 1
      if (this.alarmClockGroup) {
        if (this.currentStep === 1) {
          this.alarmClockGroup.rotation.z = Math.sin(Date.now() * 0.04) * 0.2;
        } else {
          this.alarmClockGroup.rotation.z = 0;
        }
      }

      // Bendera Merah Putih berkibar
      if (this.flagMesh) {
        this.flagMesh.rotation.y = Math.sin(Date.now() * 0.005) * 0.18;
      }

      // Tetesan Air Hujan Jatuh Dinamis
      if (this.rainGroup && this.rainGroup.visible) {
        this.rainGroup.children.forEach(drop => {
          drop.position.y -= drop.userData.speed;
          if (drop.position.y < 0.1) {
            drop.position.y = 2.8 + Math.random() * 0.3;
          }
        });
      }

      // Animasi Halus Perjalanan Avatar Andi (Lerp & Hopping Bounce)
      if (this.studentAvatar) {
        const dx = this.targetPos.x - this.currentPos.x;
        const dz = this.targetPos.z - this.currentPos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > 0.04) {
          this.currentPos.x += dx * 0.08;
          this.currentPos.z += dz * 0.08;
          this.currentPos.y = 0.08 + Math.abs(Math.sin(Date.now() * 0.015)) * 0.16;

          // Ayunan Langkah Tangan & Kaki
          const swing = Math.sin(Date.now() * 0.015) * 0.4;
          if (this.studentAvatar.leftArm) this.studentAvatar.leftArm.rotation.x = swing;
          if (this.studentAvatar.rightArm) this.studentAvatar.rightArm.rotation.x = -swing;
          if (this.studentAvatar.leftLeg) this.studentAvatar.leftLeg.rotation.x = -swing;
          if (this.studentAvatar.rightLeg) this.studentAvatar.rightLeg.rotation.x = swing;

          // Hadap Arah Berjalan
          this.studentAvatar.rotation.y = Math.atan2(dx, dz);
        } else {
          this.currentPos.x = this.targetPos.x;
          this.currentPos.z = this.targetPos.z;
          this.currentPos.y = 0.08 + Math.sin(Date.now() * 0.003) * 0.02;

          if (this.studentAvatar.leftArm) this.studentAvatar.leftArm.rotation.x = 0;
          if (this.studentAvatar.rightArm) this.studentAvatar.rightArm.rotation.x = 0;
          if (this.studentAvatar.leftLeg) this.studentAvatar.leftLeg.rotation.x = 0;
          if (this.studentAvatar.rightLeg) this.studentAvatar.rightLeg.rotation.x = 0;
        }

        this.studentAvatar.position.set(this.currentPos.x, this.currentPos.y, this.currentPos.z);
      }

      // Cincin Waypoint Berpendar Sesuai Langkah Aktif
      if (this.stationRings) {
        this.stationRings.forEach((ring, idx) => {
          const stepNum = idx + 1;
          if (this.currentStep === stepNum) {
            const pulse = 0.6 + Math.sin(Date.now() * 0.008) * 0.3;
            ring.material.emissive.setHex(0xa855f7); // Ungu cerah
            ring.material.emissiveIntensity = pulse;
          } else if (this.currentStep > stepNum) {
            ring.material.emissive.setHex(0x10b981); // Hijau selesai
            ring.material.emissiveIntensity = 0.45;
          } else {
            ring.material.emissive.setHex(0x000000);
            ring.material.emissiveIntensity = 0;
          }
        });
      }

      this.renderer.render(this.scene, this.camera);
    };
    animate();
  },

  applyWeatherVisuals() {
    const isRain = this.weatherCondition === 'hujan';

    if (this.cloudGroup) {
      this.cloudGroup.children.forEach(mesh => {
        mesh.material.color.setHex(isRain ? 0x475569 : 0xffffff);
      });
    }

    if (this.sunMesh) {
      this.sunMesh.visible = !isRain;
    }

    if (this.rainGroup) {
      this.rainGroup.visible = isRain;
    }

    if (this.dirLight) {
      this.dirLight.color.setHex(isRain ? 0x93c5fd : 0xffedd5);
      this.dirLight.intensity = isRain ? 0.6 : 0.95;
    }

    if (this.umbrellaMesh) {
      this.umbrellaMesh.visible = isRain;
    }
  },

  update3DStudentPos() {
    if (!this.stationCoords) return;
    const idx = Math.min(this.stationCoords.length - 1, Math.max(0, this.currentStep - 1));
    const target = this.stationCoords[idx] || this.stationCoords[0];
    this.targetPos = { x: target.x, z: target.z };
  },

  reset3DCamera() {
    if (!this.scene || !this.camera) return;
    this.scene.rotation.y = 0;
    this.camera.position.set(6.8, 6.2, 7.8);
    this.camera.lookAt(0.3, 0.4, 0.2);
    SoundFX.click();
  },

  focusOnAndi() {
    if (!this.camera || !this.studentAvatar) return;
    this.camera.position.set(this.currentPos.x + 2.8, this.currentPos.y + 2.6, this.currentPos.z + 3.4);
    this.camera.lookAt(this.currentPos.x, this.currentPos.y + 0.6, this.currentPos.z);
    SoundFX.pop();
  },

  setWeather(w) {
    this.weatherCondition = w;
    this.applyWeatherVisuals();
    SoundFX.click();
    this.renderSimulatorTextOnly();
  },

  toggleWeather() {
    this.setWeather(this.weatherCondition === 'cerah' ? 'hujan' : 'cerah');
  },

  setWakeTime(t) {
    this.wakeTime = t;
    SoundFX.click();
    this.renderSimulatorTextOnly();
  },

  nextStep() {
    if (this.currentStep < this.flowNodes.length) {
      this.currentStep++;
      if (this.currentStep === this.flowNodes.length) {
        SoundFX.chime();
      } else {
        SoundFX.pop();
      }
      this.update3DStudentPos();
      this.renderSimulatorTextOnly();
    }
  },

  resetExecution() {
    if (this.runInterval) clearInterval(this.runInterval);
    this.currentStep = 0;
    this.isRunning = false;
    SoundFX.click();
    this.update3DStudentPos();
    this.renderSimulatorTextOnly();
  },

  runFullAlgorithm() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.currentStep = 0;
    SoundFX.pop();
    this.renderSimulatorTextOnly();

    let step = 1;
    this.runInterval = setInterval(() => {
      this.currentStep = step;
      this.update3DStudentPos();
      if (step === this.flowNodes.length) {
        clearInterval(this.runInterval);
        this.isRunning = false;
        SoundFX.success();
      } else {
        SoundFX.step();
      }
      this.renderSimulatorTextOnly();
      step++;
    }, 850);
  },

  getArrivalTime() {
    if (this.wakeTime === '06.35') {
      return { time: '06.56 WIB', status: 'late', desc: '❌ TERLAMBAT! Gerbang sekolah telah dikunci satpam pada pukul 06.45.' };
    }
    if (this.wakeTime === '06.15') {
      if (this.weatherCondition === 'hujan') {
        return { time: '06.48 WIB', status: 'late', desc: '❌ TERLAMBAT 3 MENIT! Hujan deras memperlambat laju kendaraan.' };
      }
      return { time: '06.44 WIB', status: 'tight', desc: '🏃 MEPET 1 MENIT! Tiba tepat saat satpam hendak menggembok gerbang.' };
    }
    if (this.weatherCondition === 'hujan') {
      return { time: '06.40 WIB', status: 'ok', desc: '🌟 TEPAT WAKTU! Berangkat lebih awal membuatmu siap menghadapi hujan tanpa tergesa-gesa.' };
    }
    return { time: '06.35 WIB', status: 'ok', desc: '🌟 TEPAT WAKTU & SANTAI! Tiba 10 menit sebelum bel, sempat meletakkan tas & menyapa teman.' };
  },

  render() {
    const container = document.getElementById("algorithm-lab-container");
    if (!container) return;

    container.innerHTML = `
      <div class="flex flex-col gap-6 w-full">
        <!-- Bagian Atas: Video 1 Tunggal dengan Cover Thumbnail YouTube -->
        <div class="w-full space-y-4">
          ${VideoLabHelper.renderVideoSection({
            containerId: 'algorithm-video-viewport',
            labObject: 'AlgorithmLab',
            video: this.video,
            literacyPrompt: 'Perhatikan saat video menjelaskan syarat mutlak algoritma: langkah-langkah harus logis, berurutan, dan tidak boleh ambigu (bermakna ganda). Apa yang terjadi jika urutan langkah terbalik, seperti memakai sepatu sebelum memakai celana seragam?',
            timestamps: [
              { time: '00:50', note: 'Pengertian Algoritma: Urutan instruksi terstruktur untuk mencapai tujuan.' },
              { time: '02:10', note: 'Kondisi Logika IF/ELSE: Mengapa rencana harus siap dengan kemungkinan perubahan situasi.' },
              { time: '03:45', note: 'Keterkaitan dengan Teks Prosedur pada Literasi Bahasa Indonesia.' }
            ]
          })}
        </div>

        <!-- Bagian Bawah: Simulator Algoritma 3D Interaktif -->
        <div class="w-full space-y-4" id="algorithm-sim-wrapper">
          <!-- Rendered by renderSimulator() -->
        </div>
      </div>
    `;

    this.renderSimulator();
    setTimeout(() => this.init3D(), 60);
  },

  renderSimulator() {
    const wrapper = document.getElementById("algorithm-sim-wrapper");
    if (!wrapper) return;

    wrapper.innerHTML = `
      <div class="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-md space-y-5">
        <!-- Header Lab -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <span class="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              <i class="fa-solid fa-cube text-purple-500"></i> Diorama 3D Perancangan Algoritma
            </span>
            <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
              Misi Pagi Hari Tiba di Sekolah (Model 3D)
            </h3>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="AlgorithmLab.runFullAlgorithm()" ${this.isRunning ? 'disabled' : ''} 
              class="px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow transition flex items-center gap-1.5 ${this.isRunning ? 'opacity-50 cursor-not-allowed' : ''}">
              <i class="fa-solid fa-play text-[10px]"></i>
              <span>Jalankan Otomatis</span>
            </button>
            <button onclick="AlgorithmLab.resetExecution()" 
              class="px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition" title="Reset Langkah">
              <i class="fa-solid fa-rotate-left"></i>
            </button>
          </div>
        </div>

        <!-- 3D Viewport Diorama Jalur Rutinitas Pagi & Karakter Andi -->
        <div class="space-y-2">
          <div class="relative w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
            <div id="algorithm-3d-canvas" style="height: 320px; width: 100%;"></div>

            <!-- HUD Kontrol Kamera & Status -->
            <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
              <span class="px-2 py-0.5 rounded-md bg-slate-900/85 text-white font-mono text-[10px] border border-slate-700 flex items-center gap-1">
                <i class="fa-solid fa-arrows-rotate text-purple-400"></i> Drag Putar 360° | Scroll Zoom
              </span>
            </div>

            <div class="absolute top-2.5 right-2.5 flex items-center gap-1.5">
              <button onclick="AlgorithmLab.toggleWeather()" 
                class="px-2.5 py-0.5 rounded-md bg-slate-900/85 hover:bg-slate-800 text-amber-300 text-[10px] font-bold border border-slate-700 transition flex items-center gap-1" title="Ubah Cuaca Langsung di 3D">
                <i class="fa-solid ${this.weatherCondition === 'cerah' ? 'fa-sun text-amber-400' : 'fa-cloud-showers-heavy text-blue-400'}"></i>
                <span>${this.weatherCondition === 'cerah' ? 'Cerah' : 'Hujan'}</span>
              </button>
              <button onclick="AlgorithmLab.focusOnAndi()" 
                class="px-2 py-0.5 rounded-md bg-slate-900/85 hover:bg-slate-800 text-cyan-300 text-[10px] font-bold border border-slate-700 transition" title="Fokus Kamera ke Karakter Andi">
                <i class="fa-solid fa-user mr-1"></i>Fokus Andi
              </button>
              <button onclick="AlgorithmLab.reset3DCamera()" 
                class="px-2 py-0.5 rounded-md bg-slate-900/85 hover:bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700 transition" title="Reset Sudut Pandang">
                <i class="fa-solid fa-camera-rotate"></i>
              </button>
            </div>

            <div class="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[10px] pointer-events-none">
              <span class="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-cyan-300">
                <i class="fa-solid fa-person-walking mr-1"></i>Karakter Andi Bergerak Dinamis
              </span>
              <span class="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-purple-300 font-bold" id="algo-3d-hud-step">
                ${this.currentStep > 0 ? `Langkah ${this.currentStep}/6: ${this.flowNodes[this.currentStep-1].place}` : 'Posisi Awal (Kamar Tidur)'}
              </span>
            </div>
          </div>
        </div>

        <!-- Detail Kontrol Parameter & Flowchart List -->
        <div id="algo-details-container">
          <!-- Rendered by renderSimulatorTextOnly() -->
        </div>
      </div>
    `;

    this.renderSimulatorTextOnly();
  },

  renderSimulatorTextOnly() {
    const container = document.getElementById("algo-details-container");
    if (!container) return;

    const arrival = this.getArrivalTime();
    const isRain = this.weatherCondition === 'hujan';

    const hudStep = document.getElementById("algo-3d-hud-step");
    if (hudStep) {
      hudStep.innerText = this.currentStep > 0 
        ? `Langkah ${this.currentStep}/6: ${this.flowNodes[this.currentStep-1].place}` 
        : 'Posisi Awal (Kamar Tidur)';
    }

    container.innerHTML = `
      <div class="space-y-4">
        <!-- Pengaturan Input Variabel Masukan -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300 block">
              <i class="fa-solid fa-clock text-purple-500 mr-1"></i> Jam Bangun Siswa:
            </label>
            <div class="grid grid-cols-3 gap-1">
              <button onclick="AlgorithmLab.setWakeTime('05.30')" 
                class="py-1 px-1 rounded-lg text-[11px] font-bold transition border ${this.wakeTime === '05.30' ? 'bg-purple-600 text-white border-purple-600 shadow' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'}">
                05.30 (Ideal)
              </button>
              <button onclick="AlgorithmLab.setWakeTime('06.15')" 
                class="py-1 px-1 rounded-lg text-[11px] font-bold transition border ${this.wakeTime === '06.15' ? 'bg-amber-600 text-white border-amber-600 shadow' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'}">
                06.15 (Riskan)
              </button>
              <button onclick="AlgorithmLab.setWakeTime('06.35')" 
                class="py-1 px-1 rounded-lg text-[11px] font-bold transition border ${this.wakeTime === '06.35' ? 'bg-rose-600 text-white border-rose-600 shadow' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'}">
                06.35 (Kesiangan)
              </button>
            </div>
          </div>

          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300 block">
              <i class="fa-solid fa-cloud-sun text-amber-500 mr-1"></i> Kondisi Cuaca (IF / ELSE):
            </label>
            <div class="grid grid-cols-2 gap-1">
              <button onclick="AlgorithmLab.setWeather('cerah')" 
                class="py-1 px-2 rounded-lg text-[11px] font-bold transition border ${this.weatherCondition === 'cerah' ? 'bg-amber-500 text-white border-amber-500 shadow' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'}">
                ☀️ Cuaca Cerah
              </button>
              <button onclick="AlgorithmLab.setWeather('hujan')" 
                class="py-1 px-2 rounded-lg text-[11px] font-bold transition border ${this.weatherCondition === 'hujan' ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'}">
                🌧️ Hujan Deras
              </button>
            </div>
          </div>
        </div>

        <!-- Tombol Step Manual & Estimasi Kedatangan (Diletakkan di atas urutan langkah) -->
        <div class="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
          <span class="text-xs text-slate-600 dark:text-slate-400">
            Estimasi Tiba: <strong class="text-slate-900 dark:text-slate-100 font-bold">${arrival.time}</strong>
          </span>

          <button onclick="AlgorithmLab.nextStep()" ${this.currentStep >= 6 ? 'disabled' : ''} 
            class="px-4 py-1.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition flex items-center gap-1.5 ${this.currentStep >= 6 ? 'opacity-40 cursor-not-allowed' : ''}">
            <span>Langkah Berikutnya</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </button>
        </div>

        <!-- Stepper Langkah Algoritma Berurutan -->
        <div class="space-y-1.5">
          ${this.flowNodes.map((n, idx) => {
            const stepNum = idx + 1;
            const isActive = this.currentStep === stepNum;
            const isPast = this.currentStep > stepNum;

            return `
              <div class="p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs ${isActive ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 ring-1 ring-purple-400 shadow-sm' : (isPast ? 'bg-slate-50/60 dark:bg-slate-900/40 border-emerald-300 dark:border-emerald-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60')}">
                <div class="flex items-center gap-2.5">
                  <span class="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${isActive ? 'bg-purple-600 text-white animate-pulse' : (isPast ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500')}">
                    ${isPast ? '✓' : stepNum}
                  </span>
                  <div>
                    <div class="flex items-center gap-1.5">
                      <strong class="${isActive ? 'text-purple-700 dark:text-purple-300' : 'text-slate-800 dark:text-slate-200'}">${n.label}</strong>
                      <span class="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">${n.place}</span>
                    </div>
                    <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">${n.desc}</p>
                    ${n.isDecision ? `<span class="text-xs font-semibold text-purple-600 dark:text-purple-400 block mt-0.5">Cabang Cuaca: ${isRain ? '🌧️ Bawa Payung & Naik Angkot' : '☀️ Gowes Sepeda / Motor'}</span>` : ''}
                  </div>
                </div>

                ${isActive ? `
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 animate-pulse whitespace-nowrap">
                    Aktif di 3D
                  </span>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>

        <!-- Umpan Balik Hasil Algoritma -->
        ${this.currentStep >= 5 ? `
          <div class="p-3.5 rounded-xl border text-base leading-relaxed animate-fadeIn ${arrival.status === 'ok' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : (arrival.status === 'tight' ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-rose-50 border-rose-300 text-rose-900')}">
            <strong class="text-base font-bold">Evaluasi Logika Waktu:</strong>
            <p class="mt-0.5 text-base">${arrival.desc}</p>
          </div>
        ` : ''}
      </div>
    `;
  }
};
