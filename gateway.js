(function () {
    // 1. Détection de la page actuelle
    const pathName = window.location.pathname;
    const isDashboardPage = pathName.includes('/dashboard/');
    const session = localStorage.getItem('caisse_session');

    // 2. Calcul du chemin relatif dynamique
    const relPath = isDashboardPage ? '../' : './';
    const rootPath = '/caisse-nosignal/'; // Définition explicite

    // 3. Système de Redirection Sécurisé (Auth Guard)
    if (isDashboardPage && !session) {
        window.location.replace(relPath + 'index.html');
        return;
    } 
    
    // Redirection ciblée vers le dashboard uniquement depuis la racine
    const isRootPage = pathName === '/caisse-nosignal/' || pathName === '/caisse-nosignal/index.html';
    
    if (isRootPage && session) {
        window.location.replace(rootPath + 'dashboard/');
        return;
    }

    // 4. Injection synchrone du <head> commun
    document.write(`<meta charset="UTF-8">`);
    document.write(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`);
    document.write(`<title>Caisse.NoSignal - ${isDashboardPage ? 'Dashboard' : 'Connexion'}</title>`);
    document.write(`<link rel="stylesheet" href="${relPath}style.css">`);
    // Note : Le script Tailwind provoque l'avertissement console, mais il fonctionnera tant que le réseau suit.
    document.write(`<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>`);
    document.write(`<script src="${relPath}config.js"></script>`);
})();
