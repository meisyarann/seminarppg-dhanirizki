/**
 * DATA PEMBELAJARAN INFORMATIKA KELAS X - FASE E
 * FOKUS EKSKLUSIF: 4 PILAR BERPIKIR KOMPUTASIONAL (COMPUTATIONAL THINKING)
 * Dirancang untuk meningkatkan literasi membaca-analitis dan penalaran kritis siswa.
 * TIDAK ADA SISTEM PENILAIAN / SKOR.
 */

const APP_DATA = {
  // 1. DATA RINGKAS & PADAT 4 PILAR BERPIKIR KOMPUTASIONAL (BAHASA SISWA)
  pillars: [
    {
      id: "dekomposisi",
      title: "Dekomposisi",
      enTitle: "Decomposition",
      icon: "fa-puzzle-piece",
      badge: "Pilar 1",
      colorTheme: "blue",
      image3D: "assets/dekomposisi_3d.jpg",
      tagline: "Pecah Masalah Besar Jadi Bagian Kecil yang Mudah Dikerjakan",
      overview: "Dekomposisi adalah teknik membagi masalah rumit menjadi beberapa bagian kecil agar lebih mudah diselesaikan satu demi satu tanpa rasa pusing.",
      whyImportant: "Memikirkan seluruh masalah sekaligus membuat kita stres dan bingung. Dengan memecahnya, fokus kita terarah dan tugas selesai lebih cepat.",
      characteristics: [
        "Membagi tugas besar menjadi beberapa sub-tugas kecil yang mandiri.",
        "Menentukan prioritas mana yang harus diselesaikan lebih dulu.",
        "Memudahkan pembagian tugas saat kerja kelompok."
      ],
      realWorldCases: [
        {
          title: "Merapikan Kamar Berantakan",
          problem: "Kamar tidur acak-acakan setelah seminggu ujian.",
          decompositionSolution: [
            "1. Area Kasur: Lipat selimut & rapikan sprei.",
            "2. Meja Belajar: Susun buku pelajaran & simpan pulpen.",
            "3. Lemari: Gantung seragam & pisahkan baju kotor.",
            "4. Lantai: Sapu bungkus snack & pel bersih."
          ]
        },
        {
          title: "Tugas Video Kelompok",
          problem: "Tugas membuat video presentasi 2 menit.",
          decompositionSolution: [
            "1. Pra-produksi: Tulis naskah & bagi peran bicara.",
            "2. Produksi: Rekam video dengan HP & mic earphone.",
            "3. Editing: Potong bagian salah & tambah musik santai."
          ]
        }
      ],
      literacyGuide: "Tandai tugas utama dalam teks bacaan, lalu uraikan menjadi daftar langkah-langkah kecil."
    },

    {
      id: "pola",
      title: "Pengenalan Pola",
      enTitle: "Pattern Recognition",
      icon: "fa-shapes",
      badge: "Pilar 2",
      colorTheme: "emerald",
      image3D: "assets/pola_3d.jpg",
      tagline: "Kenali Kesamaan, Tren, dan Keteraturan yang Berulang",
      overview: "Pengenalan pola adalah kemampuan melihat keteraturan atau tren yang berulang dari suatu situasi, sehingga kita bisa memakai solusi masa lalu untuk masalah baru yang serupa.",
      whyImportant: "Banyak hal di hidup kita terjadi berulang kali. Jika kita tahu polanya, kita bisa memprediksi kejadian berikutnya tanpa perlu mencari solusi dari nol.",
      characteristics: [
        "Melihat kesamaan ciri atau tren antarkejadian.",
        "Mengenali waktu atau siklus yang sering terulang.",
        "Mampu memprediksi hal selanjutnya berdasarkan pola lampau."
      ],
      realWorldCases: [
        {
          title: "Antrean Kantin Sekolah",
          problem: "Sering kehabisan jajan dan terjebak antrean mengular.",
          decompositionSolution: [
            "Pola: Antrean selalu melonjak di jam istirahat (09.45 & 12.15).",
            "Solusi: Beli tepat saat bel berbunyi atau titip teman yang piket."
          ]
        },
        {
          title: "Jadwal Bel & Ritme Jam Istirahat Sekolah",
          problem: "Sering salah menduga waktu persiapan masuk kelas dan jajan tergesa-gesa.",
          decompositionSolution: [
            "Pola: Bel istirahat memiliki durasi tetap (30 menit) dan pola kepadatan memuncak 15 menit pertama.",
            "Solusi: Mengatur waktu menuju kantin di awal atau menjelang akhir istirahat."
          ]
        }
      ],
      literacyGuide: "Cari kata kunci frekuensi dalam teks, seperti 'selalu', 'setiap jam', 'cenderung', atau 'meningkat'."
    },

    {
      id: "abstraksi",
      title: "Abstraksi",
      enTitle: "Abstraction",
      icon: "fa-filter",
      badge: "Pilar 3",
      colorTheme: "amber",
      image3D: "assets/abstraksi_3d.jpg",
      tagline: "Fokus pada yang Penting Saja, Abaikan yang Tidak Relevan",
      overview: "Abstraksi adalah keterampilan menyaring informasi dengan memusatkan perhatian hanya pada inti masalah dan mengabaikan detail tambahan yang tidak berpengaruh pada solusi.",
      whyImportant: "Dunia ini penuh informasi yang tidak semuanya kita butuhkan. Tanpa abstraksi, kita akan kelelahan memproses detail yang tidak berguna dan kehilangan fokus.",
      characteristics: [
        "Memilih fakta penentu yang paling penting.",
        "Membuang rincian hiasan atau basa-basi cerita.",
        "Membuat model ringkas (seperti garis peta rute atau bagan alur)."
      ],
      realWorldCases: [
        {
          title: "Peta Ojek Online (Gojek / Grab)",
          problem: "Driver butuh rute cepat mengantar siswa pulang dari sekolah.",
          decompositionSolution: [
            "Detail diabaikan: Warna pagar rumah tetangga, kucing lewat, pohon mangga.",
            "Info penting dijaga: Titik jemput gerbang sekolah, jalur rute, titik rumah, & waktu tempuh."
          ]
        },
        {
          title: "Katalog Buku Perpustakaan",
          problem: "Mencari buku materi informatika di antara ribuan rak.",
          decompositionSolution: [
            "Detail diabaikan: Warna sampul buku, berat buku, jenis font cetakan.",
            "Info penting dijaga: Judul buku, nama pengarang, dan kode nomor rak."
          ]
        }
      ],
      literacyGuide: "Garis bawahi hanya fakta kunci penentu solusi; lewati kalimat basa-basi pengantar cerita."
    },

    {
      id: "algoritma",
      title: "Perancangan Algoritma",
      enTitle: "Algorithm Design",
      icon: "fa-route",
      badge: "Pilar 4",
      colorTheme: "purple",
      image3D: "assets/algoritma_3d.jpg",
      tagline: "Susun Langkah yang Teratur, Runtut, dan Tidak Ambigu",
      overview: "Perancangan algoritma adalah menyusun langkah-langkah kerja secara teratur, logis, jelas, dan berurutan dari awal sampai akhir untuk mencapai tujuan tertentu.",
      whyImportant: "Ide solusi yang bagus tidak akan berhasil jika urutan langkahnya salah atau membingungkan. Algoritma memastikan setiap tindakan dieksekusi secara tepat.",
      characteristics: [
        "Langkah tersusun secara kronologis dan logis (sekuensial).",
        "Instruksi jelas, pasti, dan tidak membingungkan (tidak ambigu).",
        "Pasti selesai dan tuntas setelah sejumlah langkah (berhingga)."
      ],
      realWorldCases: [
        {
          title: "Rutinitas Misi Pagi ke Sekolah",
          problem: "Sering panik dan terlambat masuk sekolah.",
          decompositionSolution: [
            "1. Bangun 05.30: Langsung rapikan tempat tidur.",
            "2. Mandi & Sarapan: Pakai seragam sekolah rapi.",
            "3. Cek Cuaca (IF/ELSE): JIKA hujan bawa payung, JIKA cerah langsung berangkat.",
            "4. Berangkat: Tiba di gerbang sekolah 06.45 sebelum bel berbunyi."
          ]
        },
        {
          title: "Cuci Tangan Higienis (WHO)",
          problem: "Mencegah kuman sebelum jajan di kantin sekolah.",
          decompositionSolution: [
            "1. Basahi tangan dengan air mengalir.",
            "2. Ratakan sabun di telapak & sela jari minimal 20 detik.",
            "3. Bilas hingga busa hilang lalu keringkan."
          ]
        }
      ],
      literacyGuide: "Perhatikan kata penghubung urutan kronologis seperti 'pertama', 'kemudian', 'setelah itu', 'jika... maka', dan 'terakhir'."
    }
  ],

  // 2. KAJIAN LITERASI MENDALAM: STUDI KASUS NYATA (HOTS TANPA PENILAIAN)
  literacyCases: [
    {
      id: "literasi-1",
      title: "Investigasi Jejak Sampah Plastik di Lingkungan Sekolah",
      category: "Lingkungan & Kehidupan Nyata",
      readTime: "4 menit membaca",
      icon: "fa-leaf",
      colorTheme: "emerald",
      story: `SMA Cendekia memiliki 1.200 siswa dan 30 kantin. Setiap hari seusai jam istirahat kedua, tempat pembuangan sampah sekolah selalu meluap dipenuhi gelas plastik sekali pakai, bungkus makanan ringan, dan sisa sedotan. 

Kepala Sekolah mengundang OSIS untuk mencari solusi komprehensif agar volume sampah plastik berkurang minimal 60% dalam kurun waktu satu semester tanpa merugikan pedagang kantin.`,
      computationalBreakdown: {
        dekomposisi: {
          title: "1. Membedah Masalah Menjadi Komponen Sub-Masalah",
          description: "OSIS tidak langsung membeli tong sampah baru, melainkan menguraikan masalah menjadi: (a) Sumber sampah (kantin mana yang menghasilkan plastik terbanyak?), (b) Kebiasaan siswa (mengapa siswa tidak membawa botol minum sendiri?), dan (c) Sistem pengolahan (apakah sekolah memiliki komposter atau bank sampah?)."
        },
        pola: {
          title: "2. Menemukan Pola Kebiasaan dan Waktu Penumpukan",
          description: "Dari observasi selama seminggu, ditemukan pola berulang: 80% sampah gelas plastik berasal dari minuman es manis yang dibeli antara pukul 12.00–12.30 WIB di 4 stan kantin minuman, karena hari yang panas dan antrean yang panjang membuat siswa memilih minuman kemasan siap saji."
        },
        abstraksi: {
          title: "3. Menyaring Informasi yang Menjadi Kunci Solusi",
          description: "OSIS mengabaikan perbedaan warna kemasan atau merek snack. Mereka memusatkan perhatian pada informasi esensial: jenis wadah minuman sekali pakai yang paling dominan."
        },
        algoritma: {
          title: "4. Merancang Alur Solusi Terstruktur",
          description: "OSIS menyusun rencana aksi bertahap: \nLangkah 1: Wajibkan siswa membawa tumbler air dari rumah.\nLangkah 2: Sediakan 5 dispenser isi ulang air minum gratis di koridor sekolah.\nLangkah 3: Beri potongan harga Rp 1.000 di kantin bagi siswa yang membeli minuman menggunakan tumbler sendiri.\nLangkah 4: Evaluasi timbangan volume sampah tiap akhir pekan."
        }
      },
      pillarQuestions: {
        dekomposisi: {
          pillarName: "Dekomposisi",
          icon: "fa-puzzle-piece",
          colorTheme: "blue",
          question: "Selain membagi masalah sampah ke faktor siswa dan dispenser, sub-masalah apa lagi yang perlu diuraikan jika pihak sekolah ingin melibatkan peran aktif pedagang kantin dan petugas kebersihan sekolah?",
          hint: "Fokus pada aspek pembiayaan kemasan alternatif bagi pedagang, fasilitas cuci tumbler, dan jadwal pemilahan sampah harian.",
          sampleAnalysis: "Dekomposisi lanjutan melibatkan: (1) Sub-masalah Finansial Kantin: Menghitung selisih modal kemasan guna-ulang vs plastik, (2) Sub-masalah Sanitasi: Menyusun SOP kebersihan tempat cuci tumbler di area kantin, dan (3) Sub-masalah Manajemen Petugas: Menjadwalkan pemilahan sampah anorganik bersih sebelum jam kepulangan sekolah agar siap disetor ke bank sampah."
        },
        pola: {
          pillarName: "Pengenalan Pola",
          icon: "fa-shapes",
          colorTheme: "emerald",
          question: "Observasi menunjukkan 80% sampah gelas plastik menumpuk antara 12.00–12.30 WIB. Pola tren apa yang dapat diprediksi jika sekolah menerapkan jadwal istirahat bergilir (Kelas X pukul 11.45, Kelas XI pukul 12.15, Kelas XII pukul 12.45)?",
          hint: "Amati bagaimana pemecahan waktu kedatangan siswa mempengaruhi kurva antrean dan kesempatan mengisi ulang tumbler.",
          sampleAnalysis: "Pola penumpukan tunggal yang tajam akan terdistribusi merata ke 3 sesi terpisah. Antrean stan kantin menjadi lebih pendek, sehingga siswa tidak terburu-buru dan memiliki waktu luang untuk mengisi ulang air ke dispenser tanpa tergoda membeli minuman saset instan siap saji."
        },
        abstraksi: {
          pillarName: "Abstraksi",
          icon: "fa-filter",
          colorTheme: "amber",
          question: "Dalam membuat lembar monitoring volume sampah mingguan, data detail apa saja yang harus diabaikan (dianggap distraksi) dan data penting apa yang wajib dicatat?",
          hint: "Pisahkan antara atribut visual/merek yang tidak mengubah kebijakan dengan metrik berat/volume dan jenis wadah.",
          sampleAnalysis: "Data yang diabaikan (Distraksi): Merek minuman kemasan, warna sedotan, atau desain gambar pada cup. Data esensial yang dijaga (Kunci): Berat harian sampah plastik (kg), rasio siswa yang membawa tumbler di tiap kelas, dan stan kantin yang menghasilkan residu wadah plastik terbanyak."
        },
        algoritma: {
          pillarName: "Perancangan Algoritma",
          icon: "fa-route",
          colorTheme: "purple",
          question: "Jika seorang siswa hendak membeli minuman di kantin namun lupa membawa tumbler dari rumah, rancanglah instruksi percabangan logika (aturan IF-ELSE) agar ia tetap terlayani tanpa menghasilkan sampah plastik baru!",
          hint: "Gunakan kondisi IF (membawa tumbler) ... ELSE (tidak membawa tumbler) dengan opsi deposit gelas guna-ulang.",
          sampleAnalysis: "Alur Logika Percabangan:\n1. Siswa memesan minuman.\n2. JIKA (Siswa membawa tumbler) THEN:\n     Tuang ke tumbler & beri diskon Rp 1.000.\n   ELSE IF (Siswa meminjam gelas guna-ulang sekolah) THEN:\n     Bayar deposit jaminan Rp 2.000, minum di kantin, lalu uang deposit kembali saat gelas ditaruh di rak cuci.\n   ELSE:\n     Minuman disajikan dalam cangkir kertas daur ulang berbayar Rp 1.500.\n3. Transaksi selesai secara ramah lingkungan."
        }
      },
      criticalThought: "Bagaimana jika ada satu kantin yang tetap menggunakan plastik sekali pakai? Bagian mana dari algoritma solusi di atas yang perlu ditambahkan kondisi percabangan (IF-THEN)?"
    },

    {
      id: "literasi-2",
      title: "Misteri Perjalanan Rute Angkutan Kota Tercepat",
      category: "Transportasi & Optimasi",
      readTime: "4 menit membaca",
      icon: "fa-van-shuttle",
      colorTheme: "blue",
      story: `Dimas harus menempuh perjalanan dari rumahnya di pinggiran kota menuju sekolah baru. Terdapat 3 trayek angkutan umum yang berbeda (Angkot Merah, Angkot Biru, dan Bus Sekolah), serta beberapa titik perempatan yang sering mengalami penyempitan jalan (*bottleneck*).

Dimas ingin menemukan rute perjalanan yang tidak hanya paling cepat sampai, tetapi juga paling konsisten waktu tempuhnya agar ia tidak pernah terlambat upacara bendera setiap hari Senin.`,
      computationalBreakdown: {
        dekomposisi: {
          title: "1. Dekomposisi Perjalanan",
          description: "Dimas memecah perjalanan menjadi segmen-segmen: Waktu berjalan kaki dari rumah ke halte, waktu menunggu angkutan, waktu tempuh di jalan, dan waktu transit ganti angkutan."
        },
        pola: {
          title: "2. Pengenalan Pola Waktu & Kemacetan",
          description: "Dimas mencatat bahwa setiap hari Senin pagi pukul 06.30 WIB, ruas jalan pasar tradisional selalu macet parah karena pedagang bongkar muat. Namun pada hari Selasa–Jumat, ruas jalan pasar tersebut relatif lancar."
        },
        abstraksi: {
          title: "3. Abstraksi Peta Perjalanan",
          description: "Dimas membuat gambar sketsa sederhana berupa titik-titik halte pemberhentian dan garis waktu rata-rata (model graf sederhana), tanpa menggambar pepohonan, warung kopi, atau tiang listrik di sepanjang jalan."
        },
        algoritma: {
          title: "4. Algoritma Keputusan Perjalanan",
          description: "Dimas menyusun aturan keputusan: \n- JIKA hari = Senin, MAKA pilih Bus Sekolah jalur lingkar luar (menghindari pasar).\n- JIKA hari = Selasa–Jumat, MAKA naik Angkot Biru jalur potong kota (lebih cepat 10 menit).\n- JIKA hujan lebat di pagi hari, berangkat 15 menit lebih awal."
        }
      },
      pillarQuestions: {
        dekomposisi: {
          pillarName: "Dekomposisi",
          icon: "fa-puzzle-piece",
          colorTheme: "blue",
          question: "Bagaimana cara memecah total durasi perjalanan Dimas menjadi komponen waktu pasti (fixed time) dan komponen waktu tak terduga (variable time)?",
          hint: "Bandingkan durasi jalan kaki yang konstan dengan faktor tunggu angkutan umum dan lampu lalu lintas.",
          sampleAnalysis: "Komponen Waktu Pasti: Jalan kaki dari rumah ke halte (5 menit) dan dari halte sekolah ke kelas (3 menit). Komponen Waktu Tak Terduga: Waktu tunggu angkot tiba (3-12 menit), waktu angkot 'ngetem' mencari penumpang, serta antrean lampu merah di persimpangan pasar."
        },
        pola: {
          pillarName: "Pengenalan Pola",
          icon: "fa-shapes",
          colorTheme: "emerald",
          question: "Mengapa pola kemacetan parah di ruas pasar tradisional selalu terkonsentrasi pada hari Senin pagi pukul 06.30 WIB dibanding hari lainnya?",
          hint: "Hubungkan antara jam upacara sekolah, jam masuk kantor di awal pekan, dan jadwal bongkar muat logistik pasar mingguan.",
          sampleAnalysis: "Pola Senin pagi dipicu oleh dua gelombang bersamaan: (1) Seluruh sekolah dan perkantoran mewajibkan upacara/apel awal pekan serentak di pukul 07.00 sehingga arus kendaraan menumpuk di jam yang persis sama, dan (2) Hari Senin merupakan jadwal kedatangan truk pasokan komoditas mingguan ke pasar yang memakan separuh badan jalan."
        },
        abstraksi: {
          pillarName: "Abstraksi",
          icon: "fa-filter",
          colorTheme: "amber",
          question: "Mengapa diagram sketsa garis dan titik halte (model graf) jauh lebih membantu Dimas mengambil keputusan rute dibanding foto satelit beresolusi tinggi?",
          hint: "Pikirkan tentang beban kerja mental (cognitive load) otak saat membutuhkan keputusan navigasi cepat.",
          sampleAnalysis: "Foto satelit memuat ribuan detail visual yang tidak relevan (atap rumah, pepohonan, gang buntu, warung) sehingga membebani pemrosesan otak. Diagram graf abstraksi hanya menyajikan 2 variabel penentu: titik simpul persimpangan/halte dan bobot waktu tempuh, memungkinkan keputusan diambil dalam beberapa detik."
        },
        algoritma: {
          pillarName: "Perancangan Algoritma",
          icon: "fa-route",
          colorTheme: "purple",
          question: "Susunlah algoritma langkah sekuensial bersyarat (prosedur kronologis 05.30 - 06.45 WIB) agar Dimas selalu tiba di sekolah sebelum bel upacara!",
          hint: "Tuliskan langkah bangun tidur, cek hari & cuaca, seleksi moda transportasi, dan target waktu tiba.",
          sampleAnalysis: "1. Pukul 05.30 WIB: Bangun, mandi, dan kenakan seragam sekolah rapi.\n2. Pukul 06.00 WIB: Berjalan kaki 5 menit ke Halte Utama.\n3. Pukul 06.05 WIB (Evaluasi Kondisi):\n   - IF (Hari == 'Senin') THEN: Naik Bus Sekolah Jalur Lingkar Luar (hindari pasar, durasi 30 menit).\n   - ELSE IF (Cuaca == 'Hujan') THEN: Naik Angkot Biru dengan payung, berangkat lebih awal (durasi 25 menit).\n   - ELSE: Naik Angkot Biru Jalur Potong Kota (durasi 18 menit).\n4. Pukul 06.35–06.40 WIB: Turun di depan gerbang sekolah.\n5. Pukul 06.45 WIB: Tiba tepat waktu sebelum gerbang dikunci satpam."
        }
      },
      criticalThought: "Mengapa abstraksi peta dalam bentuk diagram garis jauh lebih membantu Dimas mengambil keputusan dibanding foto satelit Google Maps yang sangat mendetail?"
    },

    {
      id: "literasi-3",
      title: "Perencanaan Produksi Konten Kreator Edukasi",
      category: "Kreativitas & Media Digital",
      readTime: "5 menit membaca",
      icon: "fa-clapperboard",
      colorTheme: "purple",
      story: `Nadia dan timnya ingin mengelola kanal media sosial edukasi sains untuk remaja. Pada bulan pertama, mereka merasa sangat kelelahan karena pembuatan konten dilakukan mendadak tanpa rencana yang jelas, sehingga kualitas video naik-turun dan jadwal unggah tidak konsisten.

Nadia memutuskan merombak total cara kerja timnya dengan menerapkan 4 pilar berpikir komputasional agar produksi konten bisa berjalan lancar dan teratur.`,
      computationalBreakdown: {
        dekomposisi: {
          title: "1. Dekomposisi Alur Produksi",
          description: "Nadia memecah pekerjaan besar 'bikin konten' menjadi 4 bagian kerja yang jelas: Riset Topik & Penulisan Naskah -> Perekaman Video -> Penyuntingan & Efek Visual -> Publikasi & Balas Komentar."
        },
        pola: {
          title: "2. Pengenalan Pola Minat Audiens",
          description: "Nadia menganalisis video-video sebelumnya dan menemukan pola: Video animasi berdurasi 60 detik dengan pembuka pertanyaan menggelitik memiliki tingkat tontonan (*watch time*) 3 kali lebih tinggi daripada video monolog 5 menit."
        },
        abstraksi: {
          title: "3. Abstraksi Template Konten",
          description: "Nadia menyusun template naskah ringkas (Hook 3 detik -> Penjelasan Inti 40 detik -> Call-to-Action 10 detik). Tim tidak perlu pusing memikirkan struktur dari awal setiap kali membuat video baru."
        },
        algoritma: {
          title: "4. Algoritma Jadwal Mingguan",
          description: "Nadia menetapkan alur operasional mingguan: \n- Senin: Riset & finalisasi naskah.\n- Selasa: Pengambilan video.\n- Rabu–Kamis: Proses editing.\n- Jumat sore (pukul 17.00): Publikasi video.\n- Sabtu: Meninjau metrik performa."
        }
      },
      pillarQuestions: {
        dekomposisi: {
          pillarName: "Dekomposisi",
          icon: "fa-puzzle-piece",
          colorTheme: "blue",
          question: "Bagaimana cara membagi beban kerja penyuntingan (editing) video 60 detik menjadi sub-tugas kecil yang dapat dikerjakan secara paralel oleh dua anggota tim?",
          hint: "Pikirkan pemisahan antara pengolahan audio/suara dengan penambahan teks rangkuman dan efek grafis.",
          sampleAnalysis: "Dekomposisi Paralel: Anggota Tim 1 fokus pada 'A-Roll' (memotong bagian salah/jeda nafas, menstabilkan volume audio narator, dan mengatur backsound). Anggota Tim 2 secara paralel menyiapkan 'B-Roll' (mengetik teks rangkuman/subtitle, menambahkan ikon ilustrasi sains, dan membuat animasi teks kata kunci)."
        },
        pola: {
          pillarName: "Pengenalan Pola",
          icon: "fa-shapes",
          colorTheme: "emerald",
          question: "Dari data penonton, video dengan kalimat pertanyaan di 3 detik pertama memiliki retensi 3 kali lipat lebih tinggi. Mengapa audiens remaja memiliki pola psikologis seperti itu?",
          hint: "Kaitkan dengan rasa penasaran (curiosity gap) dan kebiasaan menggulir cepat (scrolling) media sosial.",
          sampleAnalysis: "Pola rentang atensi penonton muda sangat singkat (2-3 detik pertama menentukan apakah video akan digulir atau ditonton). Kalimat pertanyaan membuka celah rasa ingin tahu (curiosity gap) yang merangsang otak penonton untuk bertahan demi membuktikan apakah tebakan mereka benar."
        },
        abstraksi: {
          pillarName: "Abstraksi",
          icon: "fa-filter",
          colorTheme: "amber",
          question: "Saat mengadaptasi materi sains biologi rumit ke video 60 detik, informasi ilmiah apa yang wajib dipertahankan dan istilah teknis apa yang harus disederhanakan/diabaikan?",
          hint: "Terapkan konsep abstraksi: analogi fungsi inti vs hafalan nama latin sel yang berbelit-belit.",
          sampleAnalysis: "Dipertahankan: Konsep sebab-akibat inti, analogi benda sehari-hari (misal: antibodi diibaratkan pasukan pelindung benteng tubuh), dan pesan tindakan nyata. Diabaikan/Disederhanakan: Nama latin taksonomi yang panjang, detail reaksi biokimia rumit di tingkat molekuler, dan istilah teknis medis yang tidak mempengaruhi pemahaman dasar siswa."
        },
        algoritma: {
          pillarName: "Perancangan Algoritma",
          icon: "fa-route",
          colorTheme: "purple",
          question: "Rancanglah sebuah algoritma 'Pemeriksaan Mutu' (Quality Control) 3 langkah sebelum video diunggah otomatis pada jadwal rutin Jumat pukul 17.00 WIB!",
          hint: "Susun tahapan verifikasi fakta, kelayakan teknis suara/tulisan, dan percabangan jika ditemukan kesalahan.",
          sampleAnalysis: "1. Verifikasi Kebenaran Sains: Cek fakta naskah dengan buku pelajaran atau rujukan guru pembimbing.\n2. Verifikasi Audio-Visual: Pastikan suara narator terdengar jelas di atas latar musik, dan teks terbaca jelas di layar HP kecil.\n3. Evaluasi Keputusan:\n   - IF (Kriteria 1 & 2 Terpenuhi) THEN: Set status 'Approved' dan jadwalkan tayang Jumat pukul 17.00 WIB.\n   - ELSE: Tandai letak menit revisi, kirim kembali ke editor untuk perbaikan cepat 30 menit, lalu ulangi Langkah 1."
        }
      },
      criticalThought: "Bagaimana penerapan template naskah (abstraksi) dapat menghemat waktu dan tenaga tim kreatif tanpa mengurangi kualitas konten?"
    }
  ],

  // 3. GLOSARIUM KOSAKATA LITERASI 4 PILAR BERPIKIR KOMPUTASIONAL
  glossary: [
    {
      term: "Abstraksi (Abstraction)",
      category: "Pilar 3",
      definition: "Keterampilan memilih dan memfokuskan perhatian pada aspek-aspek inti yang penting, serta menyisihkan detail-detail tambahan yang tidak mempengaruhi hasil pemecahan masalah."
    },
    {
      term: "Algoritma (Algorithm)",
      category: "Pilar 4",
      definition: "Serangkaian instruksi atau prosedur langkah demi langkah yang teratur, logis, tidak ambigu, dan memiliki akhir yang pasti untuk menyelesaikan suatu tujuan spesifik."
    },
    {
      term: "Beban Kognitif (Cognitive Load)",
      category: "Konsep Belajar",
      definition: "Jumlah upaya mental yang dibutuhkan oleh memori kerja otak untuk memproses informasi dalam satu waktu. Dekomposisi membantu menurunkan beban kognitif ini."
    },
    {
      term: "Berpikir Komputasional (Computational Thinking)",
      category: "Fondasi",
      definition: "Proses berpikir dalam memformulasikan persoalan dan solusinya secara terstruktur sehingga dapat dieksekusi secara efektif oleh manusia, mesin komputer, atau kombinasi keduanya."
    },
    {
      term: "Dekomposisi (Decomposition)",
      category: "Pilar 1",
      definition: "Teknik membedah atau memecah masalah yang rumit dan besar menjadi bagian-bagian sub-masalah yang lebih sederhana, kecil, dan mudah ditangani satu per satu."
    },
    {
      term: "Generalisasi Pola (Pattern Generalization)",
      category: "Pilar 2",
      definition: "Menyimpulkan aturan atau rumus umum dari berbagai pola yang teramati, sehingga solusi tersebut dapat dipakai kembali untuk masalah serupa di masa depan."
    },
    {
      term: "Instruksi Sekuensial (Sequential)",
      category: "Pilar 4",
      definition: "Pelaksanaan perintah secara berurutan langkah demi langkah dari awal hingga akhir tanpa ada langkah yang melompat secara sembarangan."
    },
    {
      term: "Model Representasi",
      category: "Pilar 3",
      definition: "Bentuk tiruan sederhana dari kenyataan (seperti bagan alur, graf rute, atau diagram tabel) hasil dari proses abstraksi informasi."
    },
    {
      term: "Pengenalan Pola (Pattern Recognition)",
      category: "Pilar 2",
      definition: "Kemampuan mengidentifikasi kesamaan karakteristik, tren, siklus waktu, atau keteraturan berulang yang ada di dalam sekumpulan data atau situasi."
    },
    {
      term: "Percabangan Logika (Condition / IF-THEN)",
      category: "Pilar 4",
      definition: "Penentuan jalur langkah dalam algoritma berdasarkan suatu kondisi benar atau salah (misalnya: JIKA hujan MAKA bawa payung)."
    },
    {
      term: "Sub-masalah (Sub-problem)",
      category: "Pilar 1",
      definition: "Bagian kecil dari masalah utama yang dihasilkan melalui proses dekomposisi agar dapat dianalisis dan diselesaikan secara lebih fokus."
    },
    {
      term: "Tidak Ambigu (Definiteness)",
      category: "Pilar 4",
      definition: "Karakteristik instruksi algoritma yang memiliki makna tunggal, jelas, tegas, dan tidak menimbulkan kebingungan atau multi-tafsir."
    }
  ]
};
