document.addEventListener('DOMContentLoaded', () => {

    // ========== Smooth scrolling ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const el = document.querySelector(targetId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ========== FAQ Accordion ==========
    document.querySelectorAll('.faq-item').forEach(item => {
        const btn = item.querySelector('.faq-question');
        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = null;
            });
            if (!isOpen) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ========== Carousel ==========
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let slidesPerView = getSlidesPerView();
    let totalPages = Math.ceil(slides.length / slidesPerView);

    function getSlidesPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 992) return 2;
        return 3;
    }

    // Build dots
    function buildDots() {
        dotsContainer.innerHTML = '';
        totalPages = Math.ceil(slides.length / slidesPerView);
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function goToSlide(index) {
        if (index < 0) index = totalPages - 1;
        if (index >= totalPages) index = 0;
        currentIndex = index;

        const slideWidth = slides[0].getBoundingClientRect().width;
        const gap = 20;
        const offset = currentIndex * slidesPerView * (slideWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
        updateDots();
    }

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Touch / swipe support
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        track.classList.add('dragging');
    });
    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
    });
    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        track.classList.remove('dragging');
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goToSlide(currentIndex + 1);
            else goToSlide(currentIndex - 1);
        }
    });

    // Mouse drag support
    let mouseStartX = 0;
    let isMouseDragging = false;

    track.addEventListener('mousedown', (e) => {
        mouseStartX = e.clientX;
        isMouseDragging = true;
        track.classList.add('dragging');
        e.preventDefault();
    });
    track.addEventListener('mousemove', (e) => {
        if (!isMouseDragging) return;
    });
    track.addEventListener('mouseup', (e) => {
        if (!isMouseDragging) return;
        isMouseDragging = false;
        track.classList.remove('dragging');
        const diff = mouseStartX - e.clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goToSlide(currentIndex + 1);
            else goToSlide(currentIndex - 1);
        }
    });
    track.addEventListener('mouseleave', () => {
        isMouseDragging = false;
        track.classList.remove('dragging');
    });

    // Auto-play
    let autoPlay = setInterval(() => goToSlide(currentIndex + 1), 4000);
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlay));
    carouselContainer.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => goToSlide(currentIndex + 1), 4000);
    });

    // Resize handler
    window.addEventListener('resize', () => {
        slidesPerView = getSlidesPerView();
        totalPages = Math.ceil(slides.length / slidesPerView);
        if (currentIndex >= totalPages) currentIndex = totalPages - 1;
        buildDots();
        goToSlide(currentIndex);
    });

    // Init
    buildDots();
    goToSlide(0);
});
