/* ================================================
   SCRIPT.JS — Romantic Website
   Semua teks, password, foto, dan konfigurasi
   dapat diubah di bagian CONFIG di bawah ini.
   ================================================ */

/* ================================================
   ✏️  KONFIGURASI — UBAH DI SINI
   ================================================ */
const CONFIG = {

    /* --- PASSWORD ---
       Isi dengan tanggal lahir (format bebas, harus cocok persis)
       Contoh: "01012000", "1 Januari 2000", "ddmmyyyy" */
    PASSWORD: "040208",

    /* --- TEKS HALAMAN 1 --- */
    TYPING_TEXT: "Andre punya sesuatu yang mau di tunjukkin ke Ochaa... 🌸",

    /* --- FOTO GALERI (HALAMAN 2) ---
       Ganti src dengan path foto kamu.
       Contoh: "photos/foto1.jpg" atau URL lengkap.
       Jika foto belum ada, placeholder otomatis ditampilkan. */

    PHOTOS: [
        {
            src: "photos/foto1.png",
            caption: "First time kita photobooth 😋😋"
        },
        {
            src: "photos/foto2.png",
            caption: "Pertama kali jalan-jalan sama ochaaa🤫🤫"
        },
        {
            src: "photos/foto3.png",
            caption: "Wleeeee 😛😛"
        },
        {
            src: "photos/foto4.png",
            caption: "Akuu kehujanann abis matkull 😒😒"
        },
        {
            src: "photos/foto5.png",
            caption: "Semoga masih banyak momen indah lainnya... ❤️"
        }
    ],

    /* --- INTERVAL SLIDESHOW (milidetik) --- */
    SLIDESHOW_INTERVAL: 3000,

    /* --- SURAT ROMANTIS (HALAMAN 2) ---
       Tulis dalam format array paragraf. */
    LETTER_MESSAGE: [
        "Hai Ocha kuu-sayangku-cintakuu, i like everything about you, ocha diem aja aku kagum, ochaa ketawa aku kagum, ochaa senyum aku juga kagum, KAMU KEDIP AJA AKU KAGUM.",
        "Kamu itu punya mata yang cantik teduh, ochaa senyum pun setenang ituu, all about u, perfect for me.",
        "Makasii udah bikin hidup aku lebih happy, with everything about aku beruntung bangett ketemu kamu n kenal kamu.",
        "Thank u for making me feel like i'm the most special boy in this world, i love u so much. 💕"
    ],

    /* --- PATH MUSIK ---
       Ganti dengan path file musikmu: "music/lagu.mp3"
       Atau URL streaming (pastikan CORS diizinkan) */
    MUSIC_SRC: "music/romantic.mp3",

    /* --- PERTANYAAN HALAMAN 3 --- */
    CONFESSION_QUESTION: "Ocha mauu gaa samaa aku selamanyaa? ❤️",

    /* --- BERAPA KALI TOMBOL NO LARI sebelum berubah jadi "butuh waktu" --- */
    NO_ESCAPE_LIMIT: 4,

    /* --- JUMLAH HATI MELAYANG DI LATAR --- */
    FLOATING_HEARTS_COUNT: 12,
};

/* ================================================
   VARIABEL GLOBAL
   ================================================ */
let currentSlide = 0;
let slideshowTimer = null;
let noEscapeCount = 0;
let musicPlaying = false;
let confettiActive = false;
let confettiParticles = [];

/* ================================================
   INISIALISASI SAAT DOM SIAP
   ================================================ */
document.addEventListener("DOMContentLoaded", () => {
    initFloatingHearts();
    initTypingEffect();
    initPasswordPage();
    initSlideshow();
    initLetterCard();
    initMusicPlayer();
    initConfessionPage();
});

/* ================================================
   FUNGSI TRANSISI HALAMAN
   ================================================ */
/**
 * Beralih dari halaman satu ke halaman lain dengan fade.
 * @param {string} fromId - ID elemen halaman asal
 * @param {string} toId   - ID elemen halaman tujuan
 */
function goToPage(fromId, toId) {
    const from = document.getElementById(fromId);
    const to = document.getElementById(toId);

    // Fade out halaman asal
    from.style.opacity = "0";
    setTimeout(() => {
        from.classList.remove("active");
        from.style.opacity = "";

        // Tampilkan halaman tujuan
        to.classList.add("active");
        to.style.opacity = "0";
        // Sedikit delay agar display:flex aktif dulu
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                to.style.transition = "opacity 0.7s ease";
                to.style.opacity = "1";
                setTimeout(() => { to.style.transition = ""; to.style.opacity = ""; }, 750);
            });
        });
    }, 400);
}

/* ================================================
   HATI MELAYANG (LATAR BELAKANG)
   ================================================ */
function initFloatingHearts() {
    const container = document.getElementById("floating-hearts-container");
    const heartEmojis = ["❤️", "💕", "💖", "💗", "💓", "🌸", "✨"];

    for (let i = 0; i < CONFIG.FLOATING_HEARTS_COUNT; i++) {
        const heart = document.createElement("div");
        heart.className = "floating-heart";
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

        // Posisi horizontal acak
        heart.style.left = `${Math.random() * 100}%`;
        // Durasi animasi acak (8–18 detik)
        heart.style.animationDuration = `${8 + Math.random() * 10}s`;
        // Delay acak agar tidak muncul semua sekaligus
        heart.style.animationDelay = `${Math.random() * 10}s`;
        // Ukuran acak
        heart.style.fontSize = `${14 + Math.random() * 14}px`;

        container.appendChild(heart);
    }
}

/* ================================================
   EFEK MENGETIK (HALAMAN 1)
   ================================================ */
function initTypingEffect() {
    const target = document.getElementById("typing-text");
    const text = CONFIG.TYPING_TEXT;
    let index = 0;

    // Buat elemen kursor
    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    target.appendChild(cursor);

    function typeNext() {
        if (index < text.length) {
            cursor.before(text[index]);
            index++;
            // Kecepatan mengetik: 40–80ms per karakter
            setTimeout(typeNext, 45 + Math.random() * 40);
        }
        // Kursor tetap berkedip setelah selesai
    }

    // Mulai mengetik setelah 0.8 detik
    setTimeout(typeNext, 800);
}

/* ================================================
   HALAMAN 1 — PASSWORD
   ================================================ */
function initPasswordPage() {
    const input = document.getElementById("password-input");
    const submitBtn = document.getElementById("submit-password");
    const errorMsg = document.getElementById("error-msg");
    const card = document.getElementById("password-card");
    const toggleBtn = document.getElementById("toggle-pw-btn");
    const successDiv = document.getElementById("success-hearts");

    /* Tombol tampilkan/sembunyikan password */
    toggleBtn.addEventListener("click", () => {
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        toggleBtn.textContent = isPassword ? "🙈" : "👁️";
    });

    /* Submit dengan tombol */
    submitBtn.addEventListener("click", checkPassword);

    /* Submit dengan Enter */
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") checkPassword();
    });

    function checkPassword() {
        const value = input.value.trim();

        if (value === CONFIG.PASSWORD) {
            // ✅ BENAR
            errorMsg.textContent = "";
            submitBtn.disabled = true;
            submitBtn.textContent = "✓ Yay! Sebentar ya... ❤️";

            // Animasi hati meledak
            spawnSuccessHearts(successDiv);

            // Pindah ke halaman 2 setelah animasi
            setTimeout(() => {
                goToPage("page-1", "page-2");
                startSlideshow();
                autoPlayMusic();
            }, 1400);

        } else {
            // ❌ SALAH
            errorMsg.textContent = "Password masih salah, coba ingat lagi tanggal lahir kamu ya 😊";
            card.classList.remove("shake");
            // Trigger reflow agar animasi shake bisa diulang
            void card.offsetWidth;
            card.classList.add("shake");
            input.value = "";
            input.focus();
            // Hapus class shake setelah selesai
            card.addEventListener("animationend", () => {
                card.classList.remove("shake");
            }, { once: true });
        }
    }
}

/**
 * Membuat animasi hati meledak saat password benar.
 */
function spawnSuccessHearts(container) {
    container.style.display = "block";
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    for (let i = 0; i < 18; i++) {
        const heart = document.createElement("span");
        heart.className = "burst-heart";
        heart.textContent = ["❤️", "💕", "💖", "💗", "✨"][Math.floor(Math.random() * 5)];

        const angle = (Math.PI * 2 / 18) * i + Math.random() * 0.3;
        const dist = 80 + Math.random() * 160;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;

        heart.style.left = `${cx}px`;
        heart.style.top = `${cy}px`;
        heart.style.setProperty("--tx", `${tx}px`);
        heart.style.setProperty("--ty", `${ty}px`);
        heart.style.animationDelay = `${Math.random() * 0.3}s`;
        heart.style.fontSize = `${20 + Math.random() * 20}px`;

        container.appendChild(heart);
    }

    // Bersihkan setelah selesai
    setTimeout(() => {
        container.innerHTML = "";
        container.style.display = "";
    }, 1800);
}

/* ================================================
   HALAMAN 2 — SLIDESHOW GALERI
   ================================================ */
function initSlideshow() {
    const slideshowEl = document.getElementById("slideshow");
    const dotsEl = document.getElementById("slide-dots");
    const prevBtn = document.getElementById("slide-prev");
    const nextBtn = document.getElementById("slide-next");
    const photos = CONFIG.PHOTOS;

    slideshowEl.innerHTML = "";
    dotsEl.innerHTML = "";

    photos.forEach((photo, idx) => {

        const slide = document.createElement("div");
        slide.className = "slide" + (idx === 0 ? " active-slide" : "");

        // Placeholder
        const createPlaceholder = () => {
            slide.innerHTML = `
                <div class="slide-placeholder">
                    <span>📷</span>
                    <p>Foto tidak ditemukan</p>
                </div>
            `;

            if (photo.caption) {
                const cap = document.createElement("div");
                cap.className = "slide-caption";
                cap.textContent = photo.caption;
                slide.appendChild(cap);
            }
        };

        // Jika path kosong
        if (!photo.src || photo.src.trim() === "") {

            createPlaceholder();

        } else {

            const img = document.createElement("img");

            img.src = photo.src;
            img.alt = photo.caption || `Foto ${idx + 1}`;
            img.loading = idx === 0 ? "eager" : "lazy";

            // Jika gambar gagal dimuat
            img.onerror = function () {
                createPlaceholder();
            };

            slide.appendChild(img);

            if (photo.caption) {
                const cap = document.createElement("div");
                cap.className = "slide-caption";
                cap.textContent = photo.caption;
                slide.appendChild(cap);
            }
        }

        slideshowEl.appendChild(slide);

        // Dot
        const dot = document.createElement("button");
        dot.className = "dot" + (idx === 0 ? " active" : "");
        dot.addEventListener("click", () => {
            goToSlide(idx);
            resetTimer();
        });

        dotsEl.appendChild(dot);
    });

    prevBtn.addEventListener("click", () => {
        goToSlide((currentSlide - 1 + photos.length) % photos.length);
        resetTimer();
    });

    nextBtn.addEventListener("click", () => {
        goToSlide((currentSlide + 1) % photos.length);
        resetTimer();
    });
}

function goToSlide(index) {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");

    slides[currentSlide].classList.remove("active-slide");
    dots[currentSlide].classList.remove("active");

    currentSlide = index;

    slides[currentSlide].classList.add("active-slide");
    dots[currentSlide].classList.add("active");
}

function startSlideshow() {
    if (slideshowTimer) clearInterval(slideshowTimer);
    slideshowTimer = setInterval(() => {
        goToSlide((currentSlide + 1) % CONFIG.PHOTOS.length);
    }, CONFIG.SLIDESHOW_INTERVAL);
}

function resetTimer() {
    clearInterval(slideshowTimer);
    startSlideshow();
}

/* ================================================
   HALAMAN 2 — KARTU SURAT
   ================================================ */
function initLetterCard() {
    const letterBody = document.getElementById("letter-body");
    CONFIG.LETTER_MESSAGE.forEach(para => {
        const p = document.createElement("p");
        p.textContent = para;
        letterBody.appendChild(p);
    });
}

/* ================================================
   HALAMAN 2 — MUSIK
   ================================================ */
function initMusicPlayer() {
    const audio = document.getElementById("bg-music");
    const musicBtn = document.getElementById("music-btn");

    audio.src = CONFIG.MUSIC_SRC;

    musicBtn.addEventListener("click", toggleMusic);

    audio.addEventListener("error", () => {
        // Sembunyikan tombol jika musik tidak bisa dimuat
        musicBtn.style.display = "none";
        console.info("Info: File musik tidak ditemukan di", CONFIG.MUSIC_SRC,
            "\nGanti MUSIC_SRC di CONFIG atau letakkan file mp3 di folder music/");
    });
}

function autoPlayMusic() {
    const audio = document.getElementById("bg-music");
    // Auto-play (mungkin diblokir browser tanpa interaksi user)
    audio.play().then(() => {
        musicPlaying = true;
        document.getElementById("music-btn").classList.add("playing");
        document.getElementById("music-btn").textContent = "⏸️";
    }).catch(() => {
        // Auto-play diblokir; user perlu klik tombol
        console.info("Auto-play diblokir browser. Klik tombol musik untuk memutar.");
    });
}

function toggleMusic() {
    const audio = document.getElementById("bg-music");
    const musicBtn = document.getElementById("music-btn");

    if (musicPlaying) {
        audio.pause();
        musicPlaying = false;
        musicBtn.classList.remove("playing");
        musicBtn.textContent = "🎵";
    } else {
        audio.play().catch(err => console.warn("Tidak bisa play:", err));
        musicPlaying = true;
        musicBtn.classList.add("playing");
        musicBtn.textContent = "⏸️";
    }
}

/* ================================================
   HALAMAN 2 — TOMBOL LANJUT
   ================================================ */
document.addEventListener("DOMContentLoaded", () => {
    const goBtn = document.getElementById("go-to-page-3");
    if (goBtn) {
        goBtn.addEventListener("click", () => {
            clearInterval(slideshowTimer);
            goToPage("page-2", "page-3");
            initNightSky();
            startConfessionTyping();
        });
    }
});

/* ================================================
   HALAMAN 3 — LANGIT MALAM & BINTANG
   ================================================ */
function initNightSky() {
    const starsContainer = document.getElementById("stars-container");

    // Jangan buat ulang jika sudah dibuat
    if (starsContainer.childElementCount > 0) return;

    // Buat 150 bintang dengan ukuran & posisi acak
    for (let i = 0; i < 150; i++) {
        const star = document.createElement("div");
        star.className = "star";

        const size = 1 + Math.random() * 2.5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 80}%`;
        star.style.animationDuration = `${2 + Math.random() * 4}s`;
        star.style.animationDelay = `${Math.random() * 4}s`;

        starsContainer.appendChild(star);
    }

    // Hati melayang di langit malam
    initConfessionHearts();
}

function initConfessionHearts() {
    const container = document.getElementById("confession-hearts");
    const heartEmoji = ["❤️", "💕", "💖", "💗", "🌟", "✨"];

    for (let i = 0; i < 8; i++) {
        const heart = document.createElement("div");
        heart.className = "floating-heart";
        heart.textContent = heartEmoji[Math.floor(Math.random() * heartEmoji.length)];
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDuration = `${7 + Math.random() * 8}s`;
        heart.style.animationDelay = `${Math.random() * 8}s`;
        heart.style.fontSize = `${16 + Math.random() * 16}px`;
        heart.style.opacity = "0.5";
        container.appendChild(heart);
    }
}

/* ================================================
   HALAMAN 3 — EFEK MENGETIK PERTANYAAN
   ================================================ */
function startConfessionTyping() {
    const el = document.getElementById("confession-question");
    const text = CONFIG.CONFESSION_QUESTION;
    el.textContent = "";
    let index = 0;

    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    el.appendChild(cursor);

    // Delay singkat sebelum mulai mengetik
    setTimeout(function typeChar() {
        if (index < text.length) {
            cursor.before(text[index]);
            index++;
            setTimeout(typeChar, 50 + Math.random() * 35);
        }
    }, 700);
}

/* ================================================
   HALAMAN 3 — TOMBOL YES & NO (KABUR)
   ================================================ */
function initConfessionPage() {
    const btnYes = document.getElementById("btn-yes");
    const btnNo = document.getElementById("btn-no");
    const choiceArea = document.getElementById("choice-buttons");

    /* --- Logika tombol NO kabur --- */
    btnNo.addEventListener("mouseenter", handleNoEscape);
    btnNo.addEventListener("touchstart", handleNoEscape, { passive: true });

    function handleNoEscape() {

        if (noEscapeCount >= CONFIG.NO_ESCAPE_LIMIT) return;

        noEscapeCount++;

        // YES semakin besar
        btnYes.style.transform = `scale(${1 + noEscapeCount * 0.08})`;

        // Munculkan hati
        createHeart();

        if (noEscapeCount >= CONFIG.NO_ESCAPE_LIMIT) {
            transformNoButton(btnNo);
            return;
        }

        btnNo.style.position = "absolute";

        const area = choiceArea.getBoundingClientRect();

        const btnWidth = btnNo.offsetWidth;
        const btnHeight = btnNo.offsetHeight;

        const padding = 20;

        const x = Math.random() * (area.width - btnWidth - padding);
        const y = Math.random() * 120;

        btnNo.style.left = x + "px";
        btnNo.style.top = y + "px";

        btnNo.style.transition = "all .35s ease";
    }

    function transformNoButton(btn) {

        btn.removeEventListener("mouseenter", handleNoEscape);

        btn.className = "btn-wait";
        btn.textContent = "Aku Butuh Waktu 🥺";

        // Kembalikan ke posisi normal
        btn.style.position = "relative";
        btn.style.left = "0";
        btn.style.top = "0";

        btn.addEventListener("click", () => {

            choiceArea.style.display = "none";

            document.getElementById("confession-question").style.display = "none";

            document.querySelector(".confession-sub").style.display = "none";

            document.getElementById("wait-message").classList.add("show");

        }, { once: true });

    }

    /* --- Tombol YES --- */
    btnYes.addEventListener("click", () => {
        // Sembunyikan tombol & pertanyaan
        choiceArea.style.display = "none";
        document.getElementById("confession-question").style.display = "none";
        document.querySelector(".confession-sub").style.display = "none";

        // Tampilkan pesan sukses
        const yesMsg = document.getElementById("yes-message");
        yesMsg.classList.add("show");

        // Luncurkan confetti!
        launchConfetti();
    });
}

/* ================================================
   CONFETTI ANIMATION
   (Tanpa library, murni canvas JS)
   ================================================ */
function launchConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = [
        "#FF6B9E", "#FFB6C1", "#D4A8F0", "#9B6DBF",
        "#FF85A1", "#FFC0CB", "#E040A0", "#CE93D8",
        "#FFFFFF", "#FFD700"
    ];
    const shapes = ["rect", "circle", "heart"];

    // Buat partikel confetti
    confettiParticles = Array.from({ length: 140 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: 4 + Math.random() * 8,
        dx: (Math.random() - 0.5) * 3,
        dy: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rot: Math.random() * Math.PI * 2,
        rotSpd: (Math.random() - 0.5) * 0.15,
        alpha: 0.9,
        life: 1,
    }));

    confettiActive = true;
    animateConfetti(ctx, canvas);
}

function drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.3);
    ctx.bezierCurveTo(x, y, x - size, y, x - size, y + size * 0.3);
    ctx.bezierCurveTo(x - size, y + size * 0.6, x, y + size, x, y + size * 1.1);
    ctx.bezierCurveTo(x, y + size, x + size, y + size * 0.6, x + size, y + size * 0.3);
    ctx.bezierCurveTo(x + size, y, x, y, x, y + size * 0.3);
    ctx.closePath();
    ctx.fill();
}

function animateConfetti(ctx, canvas) {
    if (!confettiActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let allDone = true;

    confettiParticles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        p.rot += p.rotSpd;
        p.dy += 0.05; // gravitasi ringan
        p.life -= 0.003;
        p.alpha = Math.max(0, p.life);

        if (p.y < canvas.height + 40) {
            allDone = false;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        if (p.shape === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, p.r, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.shape === "heart") {
            drawHeart(ctx, 0, -p.r, p.r * 0.7);
        } else {
            ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
        }

        ctx.restore();
    });

    if (!allDone) {
        requestAnimationFrame(() => animateConfetti(ctx, canvas));
    } else {
        confettiActive = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}
function createHeart() {

    const heart = document.createElement("div");

    heart.innerHTML = "💖";

    heart.style.position = "absolute";

    heart.style.left = btnNo.offsetLeft + "px";

    heart.style.top = btnNo.offsetTop + "px";

    heart.style.fontSize = "24px";

    heart.style.pointerEvents = "none";

    heart.style.transition = "all .8s ease";

    choiceArea.appendChild(heart);

    requestAnimationFrame(() => {

        heart.style.transform = "translateY(-80px) scale(1.5)";

        heart.style.opacity = "0";

    });

    setTimeout(() => heart.remove(), 800);

}

/* Handle resize canvas */
window.addEventListener("resize", () => {
    const canvas = document.getElementById("confetti-canvas");
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

/* ================================================
   CATATAN PENGGUNAAN
   ================================================

   📁 Struktur folder yang direkomendasikan:
   ├── index.html
   ├── style.css
   ├── script.js
   ├── photos/
   │   ├── foto1.jpg
   │   ├── foto2.jpg
   │   └── ...
   └── music/
       └── romantic.mp3

   ✏️ Cara mengganti konten:
   1. PASSWORD       → CONFIG.PASSWORD
   2. Teks pembuka  → CONFIG.TYPING_TEXT
   3. Foto galeri   → CONFIG.PHOTOS (src & caption)
   4. Surat          → CONFIG.LETTER_MESSAGE
   5. Musik          → CONFIG.MUSIC_SRC
   6. Pertanyaan    → CONFIG.CONFESSION_QUESTION
   7. Batas kabur   → CONFIG.NO_ESCAPE_LIMIT

   ================================================ */