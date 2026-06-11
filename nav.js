document.addEventListener("DOMContentLoaded", () => {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) return;

    const sessionData = JSON.parse(localStorage.getItem('caisse_session'));
    console.log("DEBUG SESSION :", sessionData);
    const activeCompanyId = localStorage.getItem('active_company_id');

    // Sécurité : blocage si pas de session
    if (!sessionData) {
        document.body.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; background:#111; color:white; font-family:sans-serif;">
                <h1 style="color:#ef4444;">ERREUR : Session non détectée</h1>
                <button onclick="window.location.replace('/caisse-nosignal/')" style="margin-top:20px; padding:10px 20px; cursor:pointer;">Retour connexion</button>
            </div>
        `;
        return;
    }

    // Logique de droits
    const isAdmin = sessionData.isAdmin === true;
    const entreprisesPatron = sessionData.entreprisesPatron ? sessionData.entreprisesPatron.split(',').map(id => id.trim()) : [];
    const isPatronOfActive = entreprisesPatron.includes(activeCompanyId);

    const path = window.location.pathname;
    const rootPath = "/caisse-nosignal/";
    const isActive = (folder) => path.includes(`/${folder}/`);
    const roleLabel = isAdmin ? "Administrateur" : (isPatronOfActive ? "Patron" : "Employé");

    let navHTML = `
    <aside class="w-64 bg-[#111] border-r border-[#222] flex flex-col justify-between h-full shrink-0">
        <div>
            <div class="p-6 border-b border-[#222]">
                <span class="text-xl font-bold tracking-wider text-white">Caisse.<span class="font-light">NoSignal</span></span>
            </div>
            <nav class="p-4 space-y-1">
                <a href="${rootPath}dashboard/" class="flex items-center space-x-3 p-3 rounded ${isActive('dashboard') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                    <span>📊</span> <span>Tableau de bord</span>
                </a>
                <a href="${rootPath}caisse/" class="flex items-center space-x-3 p-3 rounded ${isActive('caisse') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                    <span>🛒</span> <span>Caisse</span>
                </a>
                <a href="${rootPath}stock/" class="flex items-center space-x-3 p-3 rounded ${isActive('stock') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                    <span>📦</span> <span>Stock</span>
                </a>
                <a href="${rootPath}historique/" class="flex items-center space-x-3 p-3 rounded ${isActive('historique') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                    <span>⏳</span> <span>Historique</span>
                </a>

                ${(isAdmin || isPatronOfActive) ? `
                    <div class="pt-4 pb-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest pl-3">Management</div>
                    <a href="${rootPath}gestion-entreprise/" class="flex items-center space-x-3 p-3 rounded ${isActive('gestion-entreprise') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                        <span>🏢</span> <span>Gestion Entreprise</span>
                    </a>
                ` : ''}

                ${isAdmin ? `
                    <div class="pt-4 pb-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest pl-3">Administration</div>
                    <a href="${rootPath}admin/utilisateurs/" class="flex items-center space-x-3 p-3 rounded ${isActive('utilisateurs') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                        <span>👥</span> <span>Utilisateurs</span>
                    </a>
                    <a href="${rootPath}admin/roles/" class="flex items-center space-x-3 p-3 rounded ${isActive('roles') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                        <span>🔑</span> <span>Rôles & Perms</span>
                    </a>
                    <a href="${rootPath}admin/site/" class="flex items-center space-x-3 p-3 rounded ${isActive('gestion-site') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                        <span>⚙️</span> <span>Configuration Site</span>
                    </a>
                ` : ''}
            </nav>
        </div>
        <div class="p-4 border-t border-[#222] flex items-center justify-between">
            <div class="min-w-0 flex-1 pr-2">
                <p class="font-bold text-white text-sm truncate">${sessionData.username || sessionData.identifiant || 'Utilisateur'}</p>
                <p class="text-[10px] text-gray-500 uppercase tracking-wider">${roleLabel}</p>
            </div>
            <button id="btn-logout-nav" class="text-[10px] bg-[#222] hover:bg-red-900 px-3 py-1.5 rounded transition cursor-pointer">Déconnexion</button>
        </div>
    </aside>
    `;

    sidebarContainer.innerHTML = navHTML;

    document.getElementById('btn-logout-nav').addEventListener('click', () => {
        localStorage.removeItem('caisse_session');
        localStorage.removeItem('active_company_id');
        window.location.replace(rootPath);
    });
});
