// Получаем все разделы лонгрида, которые будем отслеживать
// Используем класс 'nav-section', который ты добавил к своим <section> и <footer>
const sections = Array.from(document.querySelectorAll('.nav-section'));

// Ссылки на кнопки навигации
const prevButton = document.getElementById('prevSection');
const nextButton = document.getElementById('nextSection');
const startButton = document.querySelector('.nav-btn-start-end-wrp:first-child .nav-btn-start-end');
const endButton = document.querySelector('.nav-btn-start-end-wrp:last-child .nav-btn-start-end');

// Переменная для хранения индекса текущего активного раздела
let activeSectionIndex = 0;
// Высота навигационной панели (для корректировки скролла)
let navigationHeight = 0;

// --- Вспомогательные функции ---

// Функция для получения высоты навигационной панели
function getNavigationHeight() {
    return document.querySelector('.nav').offsetHeight;
}

// Функция для получения верхней позиции раздела с учетом sticky-навигации
function getSectionScrollTop(section) {
    // section.offsetTop - это позиция элемента относительно начала документа
    // Вычитаем высоту навигации, чтобы при скролле элемент начинался сразу под ней
    return section.offsetTop - navigationHeight;
}

// Функция для обновления состояния кнопок (активна/неактивна)
// Используем debounce для оптимизации вызовов при скролле
const updateButtonStates = debounce(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;

    // Обновляем высоту навигации при каждом вызове (на случай изменения размера окна)
    navigationHeight = getNavigationHeight();

    // Определяем активный раздел
    let foundActiveIndex = 0;
    for (let i = sections.length - 1; i >= 0; i--) {
        // Если верхняя часть раздела (с учетом навигации) находится выше или на уровне текущего скролла
        // И раздел не является самым первым (чтобы не прыгать на 0, если мы еще не начали скроллить)
        // Добавляем небольшой отступ (например, 1px), чтобы точно попасть в нужный диапазон
        if (scrollTop >= (getSectionScrollTop(sections[i]) - 1)) {
            foundActiveIndex = i;
            break;
        }
    }
    activeSectionIndex = foundActiveIndex;

    // --- Логика для кнопок "Начало" и "Конец" ---
    startButton.disabled = (scrollTop <= 0);
    endButton.disabled = (scrollTop + viewportHeight) >= (documentHeight - 5); // 5px запас для точности

    // --- Логика для кнопок "Предыдущий" и "Следующий" ---
    prevButton.disabled = (activeSectionIndex === 0 && scrollTop <= 0); // Неактивна, если на первом разделе и в самом верху
    nextButton.disabled = (activeSectionIndex === sections.length - 1 && (scrollTop + viewportHeight) >= (documentHeight - 5)); // Неактивна, если на последнем разделе и в самом низу

    // Дополнительная проверка: если мы находимся между разделами (или видимых нет),
    // или на мобильной версии может быть неточная currentSectionIndex,
    // но есть куда скроллить - кнопки должны быть активны
    if (scrollTop > 0 && activeSectionIndex === 0) {
        prevButton.disabled = false; // Можно скроллить вверх
    }
    if ((scrollTop + viewportHeight) < (documentHeight - 5) && activeSectionIndex === sections.length - 1) {
        nextButton.disabled = false; // Можно скроллить вниз
    }


}, 50); // Задержка 50мс

// Функция debounce для оптимизации вызовов
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

// Функция для плавного скролла
function smoothScrollTo(targetPosition) {
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// --- Обработчики кнопок ---

nextButton.addEventListener('click', () => {
    // Если есть следующий раздел
    if (activeSectionIndex < sections.length - 1) {
        const nextSection = sections[activeSectionIndex + 1];
        smoothScrollTo(getSectionScrollTop(nextSection));
    } else {
        // Если это последний раздел, скроллим к самому низу документа (футеру)
        smoothScrollTo(document.documentElement.scrollHeight);
    }
    nextButton.blur();
});

prevButton.addEventListener('click', () => {
    // Если есть предыдущий раздел
    if (activeSectionIndex > 0) {
        const prevSection = sections[activeSectionIndex - 1];
        smoothScrollTo(getSectionScrollTop(prevSection));
    } else {
        // Если это первый раздел, скроллим к самому верху страницы
        smoothScrollTo(0);
    }
    prevButton.blur();
});

startButton.addEventListener('click', () => {
    smoothScrollTo(0); // Скролл к самому верху
    startButton.blur();
});

endButton.addEventListener('click', () => {
    smoothScrollTo(document.documentElement.scrollHeight); // Скролл к самому низу
    endButton.blur();
});

// --- Инициализация и обработчики событий ---

document.addEventListener('DOMContentLoaded', () => {
    navigationHeight = getNavigationHeight(); // Устанавливаем высоту навигации при загрузке
    updateButtonStates(); // Изначальное обновление состояния кнопок
});

window.addEventListener('scroll', updateButtonStates);
window.addEventListener('resize', () => {
    navigationHeight = getNavigationHeight(); // Обновляем высоту навигации при изменении размера
    updateButtonStates(); // Обновляем состояние кнопок
});