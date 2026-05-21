document.addEventListener('DOMContentLoaded', () => {

    // ========== Forward URL Parameters to Checkout Links (Load) ==========
    window.addEventListener("load", function () {
        const params = window.location.search;
        if (!params) return;

        document.querySelectorAll('a[href*="pay.kirvano.com"]').forEach(link => {
            const separator = link.href.includes('?') ? '&' : '?';
            link.href = link.href + separator + params.substring(1);
            console.log("LINK KIRVANO ATUALIZADO:", link.href);
        });
    });

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

    // ========== General Multi-Carousel ==========
    const carousels = document.querySelectorAll('.carousel-container');
    
    carousels.forEach((container) => {
        const track = container.querySelector('.carousel-track');
        const slides = container.querySelectorAll('.carousel-slide');
        const prevBtn = container.querySelector('.carousel-prev');
        const nextBtn = container.querySelector('.carousel-next');
        
        // Find dots container inside the parent section of this carousel
        const parentSection = container.closest('section');
        const dotsContainer = parentSection ? parentSection.querySelector('.carousel-dots') : null;

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
            if (!dotsContainer) return;
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
            if (!dotsContainer) return;
            dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
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

        if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

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
        let autoPlay = setInterval(() => goToSlide(currentIndex + 1), 5000);
        container.addEventListener('mouseenter', () => clearInterval(autoPlay));
        container.addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => goToSlide(currentIndex + 1), 5000);
        });

        // Resize handler
        window.addEventListener('resize', () => {
            slidesPerView = getSlidesPerView();
            totalPages = Math.ceil(slides.length / slidesPerView);
            if (currentIndex >= totalPages) currentIndex = totalPages - 1;
            buildDots();
            goToSlide(currentIndex);
        });

        // Init this carousel
        buildDots();
        goToSlide(0);
    });

    // ========== Interactive Savings Calculator ==========
    const slider = document.getElementById('daily-spend-slider');
    if (slider) {
        const dailySpendVal = document.getElementById('daily-spend-val');
        const monthlySpendVal = document.getElementById('monthly-spend-val');
        const monthlySavingsVal = document.getElementById('monthly-savings-val');
        const yearlySavingsVal = document.getElementById('yearly-savings-val');

        function updateSavings() {
            const dailySpend = parseFloat(slider.value);
            const monthlySpend = dailySpend * 30;
            const monthlySavings = monthlySpend * 0.80; // 80% savings compared to healthy homemade
            const yearlySavings = monthlySavings * 12;

            dailySpendVal.innerText = dailySpend;
            monthlySpendVal.innerText = Math.round(monthlySpend);
            monthlySavingsVal.innerText = Math.round(monthlySavings);
            yearlySavingsVal.innerText = Math.round(yearlySavings).toLocaleString('pt-BR');
        }

        slider.addEventListener('input', updateSavings);
        updateSavings(); // Run initially
    }

});
