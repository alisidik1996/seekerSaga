export interface Seal {
  number: number;
  name: string;
  cipher: string; // The correct password (case-insensitive)
  hint: string;
  sourceType: "spectrogram_audio" | "transmedia_web" | "whatsapp_voicemail" | "gps_coordinates" | "latin_litany";
  sourceHint: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: "document" | "audio" | "image" | "transcript" | "cipher";
  date: string;
  classifiedLevel: "RESTRICTED" | "OCCULT_LEVEL_4" | "TOP_SECRET";
  content: string;
  mediaUrl?: string;
  audioHint?: string;
  metadata?: Record<string, string>;
}

export interface Chapter {
  id: string;
  slug: string;
  title: string;
  latinTitle: string;
  subtitle: string;
  location: string;
  era: string;
  atmosphericDescription: string;
  seals: Seal[];
  relicChestName: string;
  relicChestDescription: string;
  voucherPromoCode: string;
  evidence: EvidenceItem[];
  loreFragments: string[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: "1",
    slug: "1-the-drowned-coven",
    title: "Chapter I: The Drowned Coven",
    latinTitle: "Coventus Submersus",
    subtitle: "Palung Karang Hitam & Ritual Pasang Surut",
    location: "Blackwater Cove, Pesisir Karang Hitam",
    era: "Oktober 1974 / Masa Kini",
    atmosphericDescription: "Desa nelayan mati yang diselimuti kabut asin abadi. Di bawah reruntuhan mercusuar, bisikan entitas palung samudra terdengar setiap kali air laut pasang surut.",
    relicChestName: "Cosmic Cube",
    relicChestDescription: "Kubus kosmik beresonansi tinggi yang menyimpan rahasia entitas dimensi luar dan voucher hadiah.",
    voucherPromoCode: "SEEKER-COVEN-LEVIATHAN-77",
    seals: [
      {
        number: 1,
        name: "Segel Air Asin (Seal of Brine)",
        cipher: "PALUNG_ABADI",
        hint: "Ditemukan dari analisis koordinat maritim dan nyanyian rintihan penjaga mercusuar gila.",
        sourceType: "gps_coordinates",
        sourceHint: "Periksa Laporan Hieroglyphs No. 74 di Meja Forensik."
      },
      {
        number: 2,
        name: "Segel Tulang Karang (Seal of Abyssal Bone)",
        cipher: "DARAH_PASANG",
        hint: "Terukir dalam prasasti batu altar gua pasang-surut yang hanya bisa dibaca saat air surut.",
        sourceType: "spectrogram_audio",
        sourceHint: "Dengarkan rekaman radio suar pesisir dan amati frekuensi gelombangnya."
      },
      {
        number: 3,
        name: "Segel Mata Palung (Seal of the Trench Eye)",
        cipher: "MATA_TAK_BERKEDIP",
        hint: "Pengakuan terakhir Tetua Koven sebelum tubuhnya bermutasi sempurna.",
        sourceType: "transmedia_web",
        sourceHint: "Gali transkrip wawancara rahasia di direktori dokumen koven."
      }
    ],
    evidence: [
      {
        id: "ev-101",
        title: "Kliping Berita: Hilangnya 12 Nelayan Blackwater",
        type: "document",
        date: "14 Oktober 1974",
        classifiedLevel: "RESTRICTED",
        content: "Harian Suara Pesisir: 'Dua belas awak kapal Motor Samudra tenggelam tanpa jejak di koordinat palung. Satu-satunya saksi yang ditemukan mengulang kalimat ganjil: Laut tidak menelan kami, laut menyambut kami ke PALUNG_ABADI.'"
      },
      {
        id: "ev-102",
        title: "Transmisi Suara Suar Mercusuar (Frekuensi 142.8 MHz)",
        type: "audio",
        date: "Rekaman Analog 1974",
        classifiedLevel: "OCCULT_LEVEL_4",
        content: "Sinyal radio berulang dari mercusuar terlantar. Spektrogram audio menunjukkan frekuensi getaran yang membentuk pola huruf sandi kedua: 'D-A-R-A-H _ P-A-S-A-N-G'.",
        audioHint: "Pola getaran biner menunjukkan kata sandi Segel 2: DARAH_PASANG"
      },
      {
        id: "ev-103",
        title: "Buku Harian Tetua Silas (Fragmen Halaman 33)",
        type: "transcript",
        date: "Tidak Diketahui",
        classifiedLevel: "TOP_SECRET",
        content: "‘...ketika sisik-sisik karang mulai menutupi leherku, aku menatap ke dalam jurang terdalam. Di sana, MATA_TAK_BERKEDIP menatap balik dan menuntut kepatuhan abadi kita...’"
      }
    ],
    loreFragments: [
      "Kultus Karang Hitam telah berdiri sejak abad ke-17 di teluk terpencil ini.",
      "Tiga segel air asin diciptakan untuk mengunci Cosmic Cube agar rahasia sang Leviathan tidak dicuri manusia luar.",
      "Setiap kata sandi segel adalah sumpah darah para pemuja palung terdalam."
    ]
  },
  {
    id: "2",
    slug: "2-the-blind-monastery",
    title: "Chapter II: The Blind Monastery",
    latinTitle: "Monasterium Caecorum",
    subtitle: "Katedral Batu Hitam & Kesunyian Kosmik",
    location: "Biara Saint Morbus, Puncak Tebing Gersang",
    era: "Abad Pertengahan / Dimensi Hampa",
    atmosphericDescription: "Biara batu hitam di mana para rahib mencungkil mata mereka sendiri demi menyembah entitas kosmik tanpa rupa dari kegelapan abadi.",
    relicChestName: "Cosmic Cube",
    relicChestDescription: "Kubus kosmik beresonansi tinggi yang menyimpan rahasia entitas dimensi luar dan voucher hadiah.",
    voucherPromoCode: "SEEKER-MONASTERY-VOID-99",
    seals: [
      {
        number: 1,
        name: "Segel Lilin Hitam (Seal of Black Wax)",
        cipher: "CAHAYA_GELAP",
        hint: "Rekonstruksi bait liturgi yang terbakar di lantai perpustakaan bawah tanah.",
        sourceType: "latin_litany",
        sourceHint: "Dekripsi fragmen teks latin kuno di berkas investigasi ordo."
      },
      {
        number: 2,
        name: "Segel Duri Darah (Seal of Bleeding Icon)",
        cipher: "AIR_MATA_MERAH",
        hint: "Teka-teki di balik tetesan cairan merah dari patung suci di altar tengah.",
        sourceType: "transmedia_web",
        sourceHint: "Periksa laporan otopsi sakral biara."
      },
      {
        number: 3,
        name: "Segel Penglihatan Buta (Seal of Blind Sight)",
        cipher: "KEHAMPAAN_MENATAP",
        hint: "Bisikan yang menggema saat lonceng biara berdentang di tengah malam buta.",
        sourceType: "spectrogram_audio",
        sourceHint: "Analisis rekaman dentang lonceng katedral hampa."
      }
    ],
    evidence: [
      {
        id: "ev-201",
        title: "Litani Terbakar Ordo Gerhana Perak",
        type: "document",
        date: "Abad ke-16",
        classifiedLevel: "OCCULT_LEVEL_4",
        content: "‘In tenebris veritas latet. Kita mematikan mata fana agar dapat melihat CAHAYA_GELAP yang tidak pernah padam di luar batas bintang.’"
      },
      {
        id: "ev-202",
        title: "Laporan Patung Maria Saint Morbus",
        type: "document",
        date: "Arsip Rahasia Gereja",
        classifiedLevel: "RESTRICTED",
        content: "Investigasi Inkuisisi menemukan bahwa patung marmer di bilik doa mengucurkan AIR_MATA_MERAH yang tidak mengering meski dibakar dengan api suci."
      },
      {
        id: "ev-203",
        title: "Rekaman Dentang Lonceng Tengah Malam",
        type: "audio",
        date: "Transmisi Misterius",
        classifiedLevel: "TOP_SECRET",
        content: "Lonceng tanpa pemukul berdentang sendiri 12 kali. Pada frekuensi 19 kHz terdengar suara bisikan: 'KEHAMPAAN_MENATAP mereka yang tidak lagi memandang dunia.'"
      }
    ],
    loreFragments: [
      "Biarawan Saint Morbus meyakini bahwa indera penglihatan manusia adalah ilusi yang menghalangi kehadiran dewa kosmik sejati.",
      "Tiga segel biara dipasang oleh Uskup Agung sebelum ia melompat ke dalam jurang hampa.",
      "Hanya mereka yang memahami filsafat kehampaan yang dapat membuka Cosmic Cube."
    ]
  },
  {
    id: "3",
    slug: "3-the-whispering-asylum",
    title: "Chapter III: The Whispering Asylum",
    latinTitle: "Asylum Susurrorum",
    subtitle: "Sanatorium Ravenscroft & Eksperimen Jiwa",
    location: "Sanatorium Jiwa Ravenscroft, Lembah Rawa Gambut",
    era: "November 1912 / Sisa Garis Waktu",
    atmosphericDescription: "Rumah sakit jiwa terpencil di tengah rawa gambut. Jeritan para pasien tertanam di dalam dinding batu dan rekaman silinder lilin fonograf tua.",
    relicChestName: "Cosmic Cube",
    relicChestDescription: "Kubus kosmik beresonansi tinggi yang menyimpan rahasia entitas dimensi luar dan voucher hadiah.",
    voucherPromoCode: "SEEKER-ASYLUM-RAVENSCROFT-33",
    seals: [
      {
        number: 1,
        name: "Segel Pasien Nol (Seal of Patient Zero)",
        cipher: "OTAK_TERBELAH",
        hint: "Coretan darah kering di balik lapisan busa sel isolasi No. 13.",
        sourceType: "transmedia_web",
        sourceHint: "Baca rekam medis pasien Catherine Vance."
      },
      {
        number: 2,
        name: "Segel Fonograf Roh (Seal of the Wax Cylinder)",
        cipher: "SUARA_DARI_DINDING",
        hint: "Rekaman suara dokter kepala sebelum ia mengunci dirinya di ruang bawah tanah.",
        sourceType: "whatsapp_voicemail",
        sourceHint: "Dengarkan silinder fonograf rekaman No. 88."
      },
      {
        number: 3,
        name: "Segel Cermin Retak (Seal of the Broken Mirror)",
        cipher: "BAYANGAN_ASLI",
        hint: "Teka-teki ilusi cermin di ruang terapi eksperimental.",
        sourceType: "spectrogram_audio",
        sourceHint: "Pecahkan enigma pantulan cermin dimensi terbalik."
      }
    ],
    evidence: [
      {
        id: "ev-301",
        title: "Rekam Medis Pasien No. 13 (Catherine Vance)",
        type: "document",
        date: "3 November 1912",
        classifiedLevel: "RESTRICTED",
        content: "Catatan Dr. Alistair: 'Pasien mengklaim mendengar ribuan suara sekaligus. Di dinding sel ia mencakar kata OTAK_TERBELAH berulang kali sebelum kesadarannya terbelah dua.'"
      },
      {
        id: "ev-302",
        title: "Transkrip Silinder Fonograf Dr. Alistair",
        type: "transcript",
        date: "12 November 1912",
        classifiedLevel: "OCCULT_LEVEL_4",
        content: "'Mereka tidak gila. Tembok ini hidup. SUARA_DARI_DINDING terus mendiktekan formula pembuka gerbang. Saya harus segera mengunci peti sebelum mereka mengambil alih tangan saya.'"
      },
      {
        id: "ev-303",
        title: "Catatan Ruang Cermin Terapi",
        type: "document",
        date: "15 November 1912",
        classifiedLevel: "TOP_SECRET",
        content: "Cermin di ruang terapi tidak memantulkan wajah pasien, melainkan entitas berwujud kabut gelap yang dinamai BAYANGAN_ASLI."
      }
    ],
    loreFragments: [
      "Sanatorium Ravenscroft didirikan di atas titik persimpangan leydisik energi kosmik.",
      "Dr. Alistair menggunakan metode psiko-okultisme untuk memancing kesadaran dimensi luar masuk ke dalam pikiran manusia.",
      "Cosmic Cube adalah wadah energi eter yang mencegah kutukan menyebar."
    ]
  }
];
