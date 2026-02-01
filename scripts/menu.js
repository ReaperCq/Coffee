const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const scrollTopButton = document.getElementById('scrollTop');

const navOverlay = document.createElement('div');
navOverlay.className = 'nav-overlay';
document.body.appendChild(navOverlay);


// ФУНКЦИИ УПРАВЛЕНИЯ МЕНЮ

function toggleMenu() {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

    menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    mainNav.classList.toggle('active');
    navOverlay.classList.toggle('active');

    if (mainNav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}


function closeMenu() {
    if (mainNav.classList.contains('active')) {
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ОБРАБОТЧИКИ СОБЫТИЙ ДЛЯ МЕНЮ


menuToggle.addEventListener('click', toggleMenu);

navOverlay.addEventListener('click', closeMenu);

const navLinks = document.querySelectorAll('.header__nav a');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            closeMenu();
        }

        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                setTimeout(() => {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 300);
            }
        }
    });
});


document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMenu();
    }
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    }, 250);
});


// КНОПКА "НАВЕРХ"

function handleScroll() {
    if (window.scrollY > 300) {
        scrollTopButton.classList.add('visible');
    } else {
        scrollTopButton.classList.remove('visible');
    }
}


let scrollTimer;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(handleScroll, 100);
});


scrollTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    scrollTopButton.style.transform = 'scale(0.9)';
    setTimeout(() => {
        scrollTopButton.style.transform = '';
    }, 200);
});


// АКТИВНАЯ ССЫЛКА ПРИ СКРОЛЛЕ


function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });

            const activeLink = document.querySelector(`.header__nav a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}


window.addEventListener('scroll', () => {
    if (window.innerWidth > 768) {
        updateActiveLink();
    }
});


// УЛУЧШЕНИЯ ДЛЯ ACCESSIBILITY


function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    });
}

// Применяем ловушку фокуса к меню
trapFocus(mainNav);

// Фокус на первую ссылку при открытии меню
menuToggle.addEventListener('click', () => {
    if (mainNav.classList.contains('active')) {
        setTimeout(() => {
            const firstLink = mainNav.querySelector('a');
            if (firstLink) {
                firstLink.focus();
            }
        }, 100);
    }
});


// ИНИЦИАЛИЗАЦИЯ


document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth > 768) {
        closeMenu();
    }
    handleScroll();
    updateActiveLink();

    console.log('✅ Мобильное меню и кнопка "Наверх" инициализированы');
});


// ДОПОЛНИТЕЛЬНЫЕ УЛУЧШЕНИЯ


if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function () { }, { passive: true });
}


window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    }, 200);
});
