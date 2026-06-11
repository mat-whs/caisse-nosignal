document.addEventListener("DOMContentLoaded", () => {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) return;

    // Récupération sécurisée de la session
    const sessionData = JSON.parse(localStorage.getItem('caisse_session'));
    if (!sessionData) {
        // Redirection vers la racine si non connecté
        window.location.replace('../'); 
        return;
    }

    const path = window.location.pathname;
    
    // Détection stricte des sous-dossiers pour définir le niveau de navigation (../)
    // Cela évite que le script ne se perde dans les URLs de GitHub Pages
    const isSubFolder = path.includes('/caisse/') || 
                        path.includes('/dashboard/') || 
                        path.includes('/stock/') || 
                        path.includes('/historique/') ||
                        path.includes('/gestion-entreprise/') ||
                        path.includes('/gestion-site/');
                        
    const prefix = isSubFolder ? "../" : "./";

    // Fonction pour surligner le menu actif
    const isActive = (folder) => path.includes(`/${folder}/`);

    // Vérification des droits (basée sur les rôles)
    const isAdmin = sessionData.permissions && sessionData.permissions.includes("Admin");
    const isPatron = sessionData.permissions && sessionData.permissions.includes("Patron");

    let roleLabel = isAdmin ? "Administrateur" : (isPatron ? "Patron" : "Employé");

    // Génération du menu
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

    if (isAdmin || isPatron) {
        navHTML += `
                <a href="${prefix}gestion-entreprise/" class="flex items-center space-x-3 p-3 rounded font-medium transition ${isActive('gestion-entreprise') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                    <span>🏢</span> <span>Gestion Entreprise</span>
                </a>
        `;
    }

    if (isAdmin) {
        navHTML += `
                <a href="${prefix}gestion-site/" class="flex items-center space-x-3 p-3 rounded font-medium transition ${isActive('gestion-site') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                    <span>⚙️</span> <span>Gestion Site</span>
                </a>
        `;
    }

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

    sidebarContainer.innerHTML = navHTML;

    // Gestion de la déconnexion
    document.getElementById('btn-logout-nav').addEventListener('click', () => {
        localStorage.removeItem('caisse_session');
        localStorage.removeItem('active_company_id');
        window.location.replace(prefix);
    });
});
