// js/script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Elemen DOM untuk Modal ---
    const overlay = document.getElementById('overlay');
    const welcomeModal = document.getElementById('welcome-modal');
    const welcomeNameInput = document.getElementById('welcome-name-input');
    // Tombol "Mulai Jelajahi"
    const startBrowseButton = document.getElementById('start-Browse-button'); 

    const customNotification = document.getElementById('custom-notification');
    const notificationTitle = document.getElementById('notification-title');
    const notificationMessage = document.getElementById('notification-message');
    const notificationOkButton = document.getElementById('notification-ok-button');

    // --- Fungsi Pembantu untuk Modal/Notifikasi ---
    function showModal(modalElement) {
        overlay.classList.remove('hidden');
        modalElement.classList.remove('hidden');
        document.body.classList.add('overflow-hidden'); // Nonaktifkan scrolling halaman

        // Memicu transisi dengan menambahkan kelas setelah sedikit jeda
        setTimeout(() => {
            overlay.classList.add('opacity-100'); // Tampilkan overlay
            modalElement.classList.add('opacity-100', 'scale-100'); // Tampilkan modal
        }, 10);
    }

    function hideModal(modalElement) {
        overlay.classList.remove('opacity-100'); // Sembunyikan overlay
        modalElement.classList.remove('opacity-100', 'scale-100');
        modalElement.classList.add('opacity-0', 'scale-90');

        // Sembunyikan elemen dan overlay setelah transisi selesai
        setTimeout(() => {
            modalElement.classList.add('hidden');
            overlay.classList.add('hidden');
            document.body.classList.remove('overflow-hidden'); // Aktifkan kembali scrolling
        }, 300); // Durasi transisi (sesuaikan dengan CSS)
    }

    // --- Fungsi untuk menampilkan notifikasi kustom (digunakan juga untuk info "Pelajari Lebih Lanjut") ---
    function showNotification(type, title, message) {
        notificationTitle.textContent = title;
        notificationMessage.textContent = message;

        // Hapus kelas tipe sebelumnya
        notificationTitle.classList.remove('text-success-green', 'text-warning-yellow', 'text-error-red', 'text-info-blue'); 
        customNotification.classList.remove('border-success-green', 'border-warning-yellow', 'border-error-red', 'border-info-blue'); 

        // Hapus semua kelas warna tombol OK sebelumnya
        notificationOkButton.classList.remove('bg-primary-purple', 'bg-success-green', 'bg-warning-yellow', 'bg-error-red', 'bg-info-blue');

        // Terapkan gaya berdasarkan tipe notifikasi
        if (type === 'success') {
            notificationTitle.classList.add('text-success-green');
            customNotification.classList.add('border-success-green');
            notificationOkButton.classList.add('bg-success-green');
        } else if (type === 'warning') {
            notificationTitle.classList.add('text-warning-yellow');
            customNotification.classList.add('border-warning-yellow');
            notificationOkButton.classList.add('bg-warning-yellow');
        } else if (type === 'error') {
            notificationTitle.classList.add('text-error-red');
            customNotification.classList.add('border-error-red');
            notificationOkButton.classList.add('bg-error-red');
        } else if (type === 'info') { // Tipe baru untuk informasi "Pelajari Lebih Lanjut"
            notificationTitle.classList.add('text-info-blue'); 
            customNotification.classList.add('border-info-blue'); 
            notificationOkButton.classList.add('bg-info-blue');
        } else { // Default ke ungu utama jika tipe tidak ditentukan atau tidak dikenal
            notificationTitle.classList.add('text-primary-purple');
            customNotification.classList.add('border-primary-purple');
            notificationOkButton.classList.add('bg-primary-purple');
        }

        showModal(customNotification);
    }

    // --- Event listener untuk tombol OK notifikasi ---
    notificationOkButton.addEventListener('click', () => {
        hideModal(customNotification);
    });


    // --- 1. Sambutan di Halaman Beranda dengan Efek Mesin Tik ---
    const userNameSpan = document.getElementById('user-name');
    const typewriterCursor = document.querySelector('.typewriter-cursor');
    
    async function typeWriter(text, element) {
        element.textContent = ''; // Hapus teks yang ada
        typewriterCursor.style.display = 'inline-block'; // Tampilkan kursor
        for (let i = 0; i < text.length; i++) {
            element.textContent += text.charAt(i);
            await new Promise(resolve => setTimeout(resolve, 80)); // Kecepatan mengetik
        }
        typewriterCursor.style.display = 'none'; // Sembunyikan kursor setelah mengetik selesai
    }

    // Pengecekan awal untuk nama pengguna dan tampilkan modal selamat datang
    let storedUserName = localStorage.getItem('websiteUserName');
    if (!storedUserName) {
        showModal(welcomeModal);
        welcomeNameInput.focus(); // Fokuskan input nama
    } else {
        // Jika nama sudah ada, lanjutkan untuk menampilkannya dengan efek mesin tik
        if (userNameSpan) {
            typeWriter(storedUserName, userNameSpan);
        }
    }

    // Event listener untuk tombol "Mulai Jelajahi"
    startBrowseButton.addEventListener('click', () => {
        let inputName = welcomeNameInput.value.trim();
        if (inputName === '') {
            showNotification('warning', 'Input Nama Dibutuhkan', 'Nama tidak boleh kosong. Silakan masukkan nama Anda.');
        } else {
            localStorage.setItem('websiteUserName', inputName); // Simpan nama di local storage
            if (userNameSpan) {
                typeWriter(inputName, userNameSpan); // Tampilkan nama dengan efek mesin tik
            }
            hideModal(welcomeModal); // Sembunyikan modal selamat datang
        }
    });

    // Izinkan menekan Enter di bidang input untuk submit
    welcomeNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            startBrowseButton.click();
        }
    });


    // --- 2. Tampilan Waktu Saat Ini di Bagian Hubungi Kami ---
    const currentTimeSpan = document.getElementById('currentTime');
    function updateCurrentTime() {
        const now = new Date();
        
        // Waktu saat ini di Denpasar, Bali, Indonesia (WITA)
        const formattedTime = now.toLocaleString('en-GB', {
            weekday: 'short', // Hari dalam seminggu (misal: Thu)
            year: 'numeric', // Tahun (misal: 2025)
            month: 'short', // Bulan (misal: Jul)
            day: 'numeric', // Tanggal (misal: 03)
            hour: '2-digit', // Jam (misal: 23)
            minute: '2-digit', // Menit (misal: 54)
            second: '2-digit', // Detik (misal: 27)
            timeZone: 'Asia/Makassar', // Zona waktu WITA (Denpasar, Bali)
            timeZoneName: 'shortOffset' // Akan menunjukkan offset GMT (misal: GMT+8)
        });

        if (currentTimeSpan) {
            currentTimeSpan.textContent = formattedTime;
        }
    }
    updateCurrentTime(); // Panggil fungsi pertama kali saat halaman dimuat
    setInterval(updateCurrentTime, 1000); // Perbarui setiap detik


    // --- 3. Validasi Formulir "Hubungi Kami" & Tampilkan Nilai ---
    const messageForm = document.getElementById('messageForm');
    const displayNama = document.getElementById('displayNama');
    const displayTanggalLahir = document.getElementById('displayTanggalLahir');
    const displayJenisKelamin = document.getElementById('displayJenisKelamin');
    const displayPesan = document.getElementById('displayPesan');

    if (messageForm) {
        messageForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Mencegah pengiriman formulir default

            const nama = document.getElementById('nama').value.trim();
            const tanggalLahir = document.getElementById('tanggalLahir').value;
            const jenisKelamin = document.querySelector('input[name="jenisKelamin"]:checked')?.value;
            const pesan = document.getElementById('pesan').value.trim();

            let isValid = true;
            let errorMessage = [];
            let successDetails = '';

            // Validasi bidang Nama
            if (!nama) {
                errorMessage.push('Nama tidak boleh kosong.');
                isValid = false;
            } else {
                successDetails += `Nama: ${nama}\n`;
            }

            // Validasi bidang Tanggal Lahir
            if (!tanggalLahir) {
                errorMessage.push('Tanggal Lahir tidak boleh kosong.');
                isValid = false;
            } else {
                successDetails += `Tanggal Lahir: ${tanggalLahir}\n`;
            }

            // Validasi bidang Jenis Kelamin
            if (!jenisKelamin) {
                errorMessage.push('Jenis Kelamin harus dipilih.');
                isValid = false;
            } else {
                successDetails += `Jenis Kelamin: ${jenisKelamin}\n`;
            }

            // Validasi bidang Pesan
            if (!pesan) {
                errorMessage.push('Pesan tidak boleh kosong.');
                isValid = false;
            } else {
                successDetails += `Pesan: ${pesan}`;
            }

            if (isValid) {
                // Simulasikan 10% kemungkinan "gagal" (kegagalan pengiriman)
                const isFailed = Math.random() < 0.1;

                if (isFailed) {
                    showNotification('error', 'Pengiriman Gagal!', 'Terjadi masalah teknis saat mengirim pesan. Silakan coba lagi.');
                } else {
                    // Sukses: Tampilkan nilai di kotak detail
                    displayNama.textContent = nama;
                    displayTanggalLahir.textContent = tanggalLahir;
                    displayJenisKelamin.textContent = jenisKelamin;
                    displayPesan.textContent = pesan;
                    showNotification('success', 'Pesan Berhasil Dikirim!', 'Terima kasih atas pesan Anda.\n\n' + successDetails);
                    messageForm.reset(); // Kosongkan formulir setelah pengiriman berhasil
                }
            } else {
                // Peringatan: Tampilkan kesalahan validasi
                showNotification('warning', 'Input Tidak Lengkap!', 'Harap lengkapi semua bidang yang diperlukan:\n' + errorMessage.join('\n'));
            }
        });
    }

    // --- Toggle Menu Mobile ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('#mobile-menu a');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden'); // Toggle visibilitas menu
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden'); // Sembunyikan menu saat link diklik
            });
        });
    }

    // --- Animasi Masuk yang Dipicu oleh Scroll ---
    const animatedSections = document.querySelectorAll('.animated-section');

    const observerOptions = {
        root: null, // Relatif terhadap viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% dari bagian harus terlihat
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible'); // Terapkan kelas visibilitas
                observer.unobserve(entry.target); // Berhenti mengamati setelah terlihat (animasi hanya sekali)
            }
        });
    }, observerOptions);

    animatedSections.forEach(section => {
        sectionObserver.observe(section); // Mulai mengamati setiap bagian
    });

    // --- Fungsionalitas Tombol "Pelajari Lebih Lanjut" (Portofolio) ---
    const learnMoreButtons = document.querySelectorAll('.learn-more-btn');

    learnMoreButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Mencegah link mengarahkan ke halaman lain secara default

            // Ambil data dari atribut 'data-' pada tombol yang diklik
            const title = event.currentTarget.dataset.title;
            const description = event.currentTarget.dataset.description;

            // Tampilkan pop-up notifikasi kustom dengan tipe 'info'
            showNotification('info', title, description);
        });
    });
});