document.addEventListener("DOMContentLoaded", () => {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) return;

    // Récupération sécurisée de la session locale
    const sessionData = JSON.parse(localStorage.getItem('caisse_session'));
    if (!sessionData) {
        // Si aucune session, on tente de revenir intelligemment à la racine de connexion
        const isSubFolder = window.location.pathname.includes('/caisse/') || 
                            window.location.pathname.includes('/dashboard/') || 
                            window.location.pathname.includes('/stock/') || 
                            window.location.pathname.includes('/historique/') ||
                            window.location.pathname.includes('/gestion-entreprise/') ||
                            window.location.pathname.includes('/gestion-site/');
        window.location.replace(isSubFolder ? '../' : './');
        return;
    }

    const path = window.location.pathname;
    
    // Détection stricte : si l'URL contient un des sous-dossiers de l'application, 
    // le préfixe doit obligatoirement être "../" pour pouvoir en sortir.
    const isSubFolder = path.includes('/caisse/') || 
                        path.includes('/dashboard/') || 
                        path.includes('/stock/') || 
                        path.includes('/historique/') ||
                        path.includes('/gestion-entreprise/') ||
                        path.includes('/gestion-site/');
                        
    const prefix = isSubFolder ? "../" : "./";

    // Fonction de détection pour savoir si l'onglet analysé est l'onglet actif
    const isActive = (folder) => path.includes(`/${folder}/`);

    // Vérification des rôles et des accès administratifs
    const isAdmin = sessionData.permissions && sessionData.permissions.includes("Admin");
    const isPatron = sessionData.permissions && sessionData.permissions.includes("Patron");

    let roleLabel = "Employé";
    if (isAdmin) roleLabel = "Administrateur";
    else if (isPatron) roleLabel = "Patron";

    // Construction dynamique de la structure HTML du menu de navigation
    let navHTML = `
    <aside class="w-64 bg-[#111] border-r border-[#222] flex flex-col justify-between h-full shrink-0">
        <div>
            <div class="p-6 border-b border-[#222]">
                <span class="text-xl font-bold tracking-wider text-white">Caisse.<span class="font-light">NoSignal</span></span>
            </div>
            <nav class="p-4 space-y-2">
                <a href="${prefix}dashboard/" class="flex items-center space-x-3 p-3 rounded font-medium transition ${isActive('dashboard') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                    <span>📊</span> <span>Tableau de bord</span>
                </a>
                <a href="${prefix}caisse/" class="flex items-center space-x-3 p-3 rounded font-medium transition ${isActive('caisse') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                    <span>🛒</span> <span>Caisse</span>
                </a>
                <a href="${prefix}stock/" class="flex items-center space-x-3 p-3 rounded font-medium transition ${isActive('stock') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                    <span>📦</span> <span>Stock</span>
                </a>
                <a href="${prefix}historique/" class="flex items-center space-x-3 p-3 rounded font-medium transition ${isActive('historique') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                    <span>⏳</span> <span>Historique</span>
                </a>
    `;

    // Affichage conditionnel de l'onglet Gestion Entreprise
    if (isAdmin || isPatron) {
        navHTML += `
                <a href="${prefix}gestion-entreprise/" class="flex items-center space-x-3 p-3 rounded font-medium transition ${isActive('gestion-entreprise') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                    <span>🏢</span> <span>Gestion Entreprise</span>
                </a>
        `;
    }

    // Affichage conditionnel de l'onglet Gestion Site
    if (isAdmin) {
        navHTML += `
                <a href="${prefix}gestion-site/" class="flex items-center space-x-3 p-3 rounded font-medium transition ${isActive('gestion-site') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                    <span>⚙️</span> <span>Gestion Site</span>
                </a>
        `;
    }

    // Fermeture des balises et injection des données de l'utilisateur
    navHTML += `
            </nav>
        </div>
        <div class="p-4 border-t border-[#222] flex items-center justify-between">
            <div class="min-w-0 flex-1 pr-2">
                <p class="font-bold text-white text-sm truncate">${sessionData.username}</p>
                <p class="text-xs text-gray-500 uppercase tracking-wider">${roleLabel}</p>
            </div>
            <button id="btn-logout-nav" class="text-xs bg-[#222] hover:bg-red-900 px-3 py-1.5 rounded transition cursor-pointer shrink-0">Déconnexion</button>
        </div>
    </aside>
    `;

    // Injection propre dans le conteneur HTML
    sidebarContainer.innerHTML = navHTML;

    // Écouteur pour la déconnexion
    document.getElementById('btn-logout-nav').addEventListener('click', () => {
        localStorage.removeItem('caisse_session');
        localStorage.removeItem('active_company_id');
        window.location.replace(prefix);
    });
});
