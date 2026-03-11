(() => {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('#siteNav');

    if (!header || !toggle || !nav) return;

    const setOpen = (open) => {
        header.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    const isOpen = () => header.classList.contains('is-open');

    toggle.addEventListener('click', () => {
        setOpen(!isOpen());
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setOpen(false);
    });

    document.addEventListener('click', (e) => {
        if (!isOpen()) return;
        if (header.contains(e.target)) return;
        setOpen(false);
    });

    nav.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        setOpen(false);
    });
})();
