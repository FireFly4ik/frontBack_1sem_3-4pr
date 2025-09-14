// --- Диалог обратной связи (без падений, если элементов нет) ---
const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
let lastActive = null;

if (openBtn && dlg) {
    openBtn.addEventListener('click', () => {
        lastActive = document.activeElement;
        openBtn.setAttribute('disabled', 'true');
        dlg.showModal();
        dlg.querySelector('input,select,textarea,button')?.focus();
    });
}

if (closeBtn && dlg) {
    closeBtn.addEventListener('click', () => dlg.close('cancel'));
}

if (form) {
    const phone = form.elements?.phone; // безопасно — может быть undefined
    form.addEventListener('submit', (e) => {
        // 1) Сброс кастомных сообщений
        [...form.elements].forEach(el => el.setCustomValidity?.(''));

        // 2) Проверка встроенных ограничений
        if (!form.checkValidity()) {
            e.preventDefault();

            const email = form.elements?.email;
            if (email?.validity?.typeMismatch) {
                email.setCustomValidity('Введите корректный e-mail, например name@example.com');
            }

            // если нужен строгий паттерн для телефона — ставим только если поле есть
            if (phone) {
                phone.setAttribute('pattern', '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$');
            }

            form.reportValidity();

            // A11y: пометить проблемные поля
            [...form.elements].forEach(el => {
                if (el.willValidate) el.toggleAttribute('aria-invalid', !el.checkValidity());
            });

            return;
        }

        // 3) "Успешная отправка" (без сервера)
        e.preventDefault();
        dlg?.close('success');
        form.reset();
    });
}

dlg?.addEventListener('close', () => {
    lastActive?.focus();
    openBtn?.removeAttribute('disabled');
});

// --- Переключатель темы (защищённо) ---
const KEY = 'theme';
const themeBtn = document.querySelector('.theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// --- Применение темы при загрузке ---
const saved = localStorage.getItem(KEY);
if (saved === 'dark' || (!saved && prefersDark)) {
    document.body.classList.add('theme-dark');
}

// --- Кнопка переключения (если она есть на странице) ---
if (themeBtn) {
    themeBtn.setAttribute(
        'aria-pressed',
        String(document.body.classList.contains('theme-dark'))
    );

    themeBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('theme-dark');
        themeBtn.setAttribute('aria-pressed', String(isDark));
        localStorage.setItem(KEY, isDark ? 'dark' : 'light');
    });
}