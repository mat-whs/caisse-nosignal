(function () {
    // 1. Détection de la page actuelle (Vérifie si on est dans le dossier dashboard)
    const isDashboardPage = window.location.pathname.includes('/dashboard/');
    const session = localStorage.getItem('caisse_session');

    // 2. Calcul du chemin relatif dynamique (S'adapte parfaitement à GitHub Pages)
    const relPath = isDashboardPage ? '../' : './';

    // 3. Système de Redirection Sécurisé (Auth Guard)
    if (isDashboardPage && !session) {
        // Tentative d'accès au dashboard sans être connecté -> Retour à la connexion
        window.location.replace(relPath + 'index.html');
        return;
    } 
    
    if (!isDashboardPage && session) {
        // Déjà connecté et tente d'aller sur l'index -> Redirection vers le dashboard
        window.location.replace(relPath + 'dashboard/');
        return;
    }

    // 4. Injection synchrone du <head> commun (Évite les bugs de chargement de scripts)
    document.write(`<meta charset="UTF-8">`);
    document.write(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`);
    document.write(`<title>Caisse.NoSignal - ${isDashboardPage ? 'Dashboard' : 'Connexion'}</title>`);
    document.write(`<link rel="stylesheet" href="${relPath}style.css">`);
    document.write(`<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>`);
    document.write(`<script src="${relPath}config.js"></script>`);
})();
