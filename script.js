// ===== DATA PENGGUNA (Simulasi Database) =====
const users = [
    { username: 'admin', password: 'admin123', nama: 'Administrator' },
    { username: 'user', password: 'user123', nama: 'Pengguna Biasa' },
    { username: 'budi', password: '123456', nama: 'Budi Santoso' },
    { username: 'admin@demo.com', password: 'admin123', nama: 'Admin Demo' }
];

// ===== AMBIL ELEMEN HTML =====
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');
const alertBox = document.getElementById('alert');
const btnLogin = document.getElementById('btnLogin');
const loading = document.getElementById('loading');
const btnText = document.getElementById('btnText');
const rememberCheck = document.getElementById('remember');

// ===== CEK APAKAH SUDAH LOGIN SEBELUMNYA =====
document.addEventListener('DOMContentLoaded', function() {
    // Cek localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        // Otomatis redirect ke dashboard
        window.location.href = 'dashboard.html';
    }
    
    // Isi remember me jika ada
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) {
        usernameInput.value = remembered;
        rememberCheck.checked = true;
    }
});

// ===== VALIDASI REAL-TIME =====
usernameInput.addEventListener('input', function() {
    const value = this.value.trim();
    
    if (value === '') {
        this.classList.add('error');
        this.classList.remove('success');
        usernameError.textContent = 'Username harus diisi';
    } else if (value.length < 3) {
        this.classList.add('error');
        this.classList.remove('success');
        usernameError.textContent = 'Username minimal 3 karakter';
    } else {
        this.classList.remove('error');
        this.classList.add('success');
        usernameError.textContent = '';
    }
    
    cekTombolLogin();
});

passwordInput.addEventListener('input', function() {
    const value = this.value;
    
    if (value === '') {
        this.classList.add('error');
        this.classList.remove('success');
        passwordError.textContent = 'Password harus diisi';
    } else if (value.length < 4) {
        this.classList.add('error');
        this.classList.remove('success');
        passwordError.textContent = 'Password minimal 4 karakter';
    } else {
        this.classList.remove('error');
        this.classList.add('success');
        passwordError.textContent = '';
    }
    
    cekTombolLogin();
});

// ===== FUNGSI CEK TOMBOL LOGIN =====
function cekTombolLogin() {
    const usernameValid = usernameInput.classList.contains('success');
    const passwordValid = passwordInput.classList.contains('success');
    
    btnLogin.disabled = !(usernameValid && passwordValid);
}

// ===== FUNGSI LOGIN =====
function prosesLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    // Tampilkan loading
    btnLogin.disabled = true;
    loading.style.display = 'inline-block';
    btnText.textContent = 'Memproses...';
    
    // Simulasi proses ke server
    setTimeout(() => {
        // Cari user di database
        const foundUser = users.find(u => 
            (u.username === username || u.username === username) && 
            u.password === password
        );
        
        if (foundUser) {
            // Login berhasil
            alertBox.className = 'alert alert-success';
            alertBox.innerHTML = '✅ Login berhasil! Selamat datang ' + foundUser.nama;
            alertBox.style.display = 'block';
            
            // Data user yang akan disimpan
            const userData = {
                username: foundUser.username,
                nama: foundUser.nama,
                loginTime: new Date().toString()
            };
            
            // Simpan ke storage sesuai remember me
            if (rememberCheck.checked) {
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('rememberedUser', foundUser.username);
            } else {
                sessionStorage.setItem('user', JSON.stringify(userData));
                localStorage.removeItem('rememberedUser');
            }
            
            // Redirect ke dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } else {
            // Login gagal
            alertBox.className = 'alert alert-error';
            alertBox.innerHTML = '❌ Username atau password salah!';
            alertBox.style.display = 'block';
            
            // Reset button
            btnLogin.disabled = false;
            loading.style.display = 'none';
            btnText.textContent = 'Login';
            
            // Reset password
            passwordInput.value = '';
            passwordInput.classList.remove('success');
            passwordInput.focus();
        }
    }, 1500);
}

// ===== CEK STATUS LOGIN =====
document.addEventListener('DOMContentLoaded', function() {
    // Ambil data user dari storage
    let userData = localStorage.getItem('user');
    
    if (!userData) {
        userData = sessionStorage.getItem('user');
    }
    // Parse data user
    const user = JSON.parse(userData);
    
    // Tampilkan data user di halaman
    tampilkanDataUser(user);
});

// ===== FUNGSI TAMPILKAN DATA USER =====
function tampilkanDataUser(user) {
    // Elemen-elemen yang akan diisi
    const displayName = document.getElementById('displayName');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const userUsername = document.getElementById('userUsername');
    const userNama = document.getElementById('userNama');
    const lastLogin = document.getElementById('lastLogin');
    
    // Isi dengan data user
    if (displayName) {
        displayName.textContent = `Halo, ${user.nama || user.username}!`;
    }
    
    if (welcomeMessage) {
        welcomeMessage.textContent = `Selamat datang kembali, ${user.nama || user.username}!`;
    }
    
    if (userUsername) {
        userUsername.textContent = user.username;
    }
    
    if (userNama) {
        userNama.textContent = user.nama || user.username;
    }
    
    // Tampilkan waktu login
    if (lastLogin) {
        if (user.loginTime) {
            const loginDate = new Date(user.loginTime);
            lastLogin.textContent = loginDate.toLocaleString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } else {
            lastLogin.textContent = 'Sesi ini';
        }
    }
}

// ===== FUNGSI LOGOUT =====
function logout() {
    // Tampilkan konfirmasi
    const confirmLogout = confirm('Apakah Anda yakin ingin logout?');
    
    if (confirmLogout) {
        // Hapus semua data dari storage
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        
        // Redirect ke halaman login
        window.location.href = 'index.html';
    }
}

// ===== EVENT LISTENER UNTUK TOMBOL LOGOUT =====
const btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
    btnLogout.addEventListener('click', logout);
}

// ===== FITUR TAMBAHAN: JAM REAL-TIME =====
function updateJam() {
    const jamElement = document.getElementById('currentTime');
    if (jamElement) {
        const now = new Date();
        jamElement.textContent = now.toLocaleTimeString('id-ID');
    }
}

// Update jam setiap detik
setInterval(updateJam, 1000);

// ===== FITUR TAMBAHAN: SALAM BERDASARKAN WAKTU =====
function getSalam() {
    const hour = new Date().getHours();
    
    if (hour < 12) {
        return 'Selamat Pagi';
    } else if (hour < 15) {
        return 'Selamat Siang';
    } else if (hour < 18) {
        return 'Selamat Sore';
    } else {
        return 'Selamat Malam';
    }
}

// Tambahkan salam di welcome message
const welcomeCard = document.querySelector('.welcome-card h1');
if (welcomeCard) {
    const salam = getSalam();
    welcomeCard.textContent = `${salam}, selamat datang di dashboard!`;
}

// ===== EVENT LISTENER UNTUK TOMBOL LOGIN =====
btnLogin.addEventListener('click', prosesLogin);

// ===== TEKAN ENTER UNTUK LOGIN =====
passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !btnLogin.disabled) {
        prosesLogin();
    }
});

usernameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        passwordInput.focus();
    }
});

// ===== AMBIL ELEMEN YANG DIPERLUKAN =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// ===== TOGGLE HAMBURGER MENU =====
if (hamburger) {
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animasi hamburger
        this.classList.toggle('active');
    });
}

// ===== TUTUP MENU SAAT KLIK DI LUAR =====
document.addEventListener('click', function(e) {
    if (navMenu && hamburger) {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
});

// ===== SCROLL SMOOTH UNTUK LINK ANCHOR =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Tutup menu mobile
            if (navMenu) navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        }
    });
});

// ===== HIGHLIGHT ACTIVE MENU SAAT SCROLL =====
window.addEventListener('scroll', function() {
    let sections = document.querySelectorAll('section[id]');
    let navLinks = document.querySelectorAll('.nav-menu a');
    
    sections.forEach(section => {
        let top = section.offsetTop - 100;
        let bottom = top + section.offsetHeight;
        let scroll = window.scrollY;
        
        if (scroll >= top && scroll < bottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + section.id) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ===== VALIDASI FORM KONTAK =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const nama = document.getElementById('nama');
    const email = document.getElementById('email');
    const subjek = document.getElementById('subjek');
    const pesan = document.getElementById('pesan');
    
    const namaError = document.getElementById('namaError');
    const emailError = document.getElementById('emailError');
    const subjekError = document.getElementById('subjekError');
    const pesanError = document.getElementById('pesanError');
    
    const loading = document.getElementById('loading');
    const btnText = document.getElementById('btnText');
    const alertBox = document.getElementById('alert');
    
    // Validasi real-time
    nama.addEventListener('input', function() {
        if (this.value.trim() === '') {
            this.classList.add('error');
            namaError.textContent = 'Nama harus diisi';
        } else if (this.value.trim().length < 3) {
            this.classList.add('error');
            namaError.textContent = 'Nama minimal 3 karakter';
        } else {
            this.classList.remove('error');
            namaError.textContent = '';
        }
    });
    
    email.addEventListener('input', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (this.value.trim() === '') {
            this.classList.add('error');
            emailError.textContent = 'Email harus diisi';
        } else if (!emailRegex.test(this.value.trim())) {
            this.classList.add('error');
            emailError.textContent = 'Email tidak valid';
        } else {
            this.classList.remove('error');
            emailError.textContent = '';
        }
    });
    
    subjek.addEventListener('input', function() {
        if (this.value.trim() === '') {
            this.classList.add('error');
            subjekError.textContent = 'Subjek harus diisi';
        } else {
            this.classList.remove('error');
            subjekError.textContent = '';
        }
    });
    
    pesan.addEventListener('input', function() {
        if (this.value.trim() === '') {
            this.classList.add('error');
            pesanError.textContent = 'Pesan harus diisi';
        } else if (this.value.trim().length < 10) {
            this.classList.add('error');
            pesanError.textContent = 'Pesan minimal 10 karakter';
        } else {
            this.classList.remove('error');
            pesanError.textContent = '';
        }
    });
    
    // Submit form
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validasi semua field
        let isValid = true;
        
        if (nama.value.trim() === '' || nama.value.trim().length < 3) {
            nama.classList.add('error');
            namaError.textContent = 'Nama minimal 3 karakter';
            isValid = false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            email.classList.add('error');
            emailError.textContent = 'Email tidak valid';
            isValid = false;
        }
        
        if (subjek.value.trim() === '') {
            subjek.classList.add('error');
            subjekError.textContent = 'Subjek harus diisi';
            isValid = false;
        }
        
        if (pesan.value.trim() === '' || pesan.value.trim().length < 10) {
            pesan.classList.add('error');
            pesanError.textContent = 'Pesan minimal 10 karakter';
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Tampilkan loading
        const btn = this.querySelector('button[type="submit"]');
        btn.disabled = true;
        loading.style.display = 'inline-block';
        btnText.textContent = 'Mengirim...';
        
        // Simulasi pengiriman
        setTimeout(() => {
            alertBox.className = 'alert alert-success';
            alertBox.innerHTML = '✅ Pesan berhasil dikirim! Terima kasih telah menghubungi saya.';
            alertBox.style.display = 'block';
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            btn.disabled = false;
            loading.style.display = 'none';
            btnText.textContent = 'Kirim Pesan';
            
            // Hilangkan alert setelah 5 detik
            setTimeout(() => {
                alertBox.style.display = 'none';
            }, 5000);
        }, 2000);
    });
}

// ===== ANIMASI SCROLL =====
window.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.feature-card, .skill-item, .timeline-item');
    
    elements.forEach(element => {
        const position = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (position < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// ===== INITIALIZE ANIMATION =====
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.feature-card, .skill-item, .timeline-item');
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.5s ease';
    });
    
    // Trigger scroll event untuk elemen yang sudah terlihat
    window.dispatchEvent(new Event('scroll'));
});

// ===== DARK MODE TOGGLE (OPSIONAL) =====
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Cek preferensi dark mode
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// ===== BACK TO TOP BUTTON =====
const backToTop = document.createElement('button');
backToTop.innerHTML = '↑';
backToTop.className = 'back-to-top';
backToTop.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    font-size: 20px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    z-index: 999;
    transition: all 0.3s;
`;

document.body.appendChild(backToTop);

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }
});

backToTop.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});