// loader.js
const scripts = [
    '/caisse-nosignal/config.js',
    '/caisse-nosignal/gateway.js',
    '/caisse-nosignal/nav.js'
];

scripts.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false; // Force le chargement dans l'ordre du tableau
    document.head.appendChild(script);
});
