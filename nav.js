document.addEventListener("DOMContentLoaded", async () => {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) return;

    const sessionData = JSON.parse(localStorage.getItem('caisse_session'));
    const activeCompanyId = localStorage.getItem('active_company_id');

    if (!sessionData) {
        window.location.replace('/caisse-nosignal/');
        return;
    }

    try {
        // --- MODIFICATION : Utilisation de FormData et requête POST comme le Dashboard ---
        const formData = new FormData();
        formData.append('action', 'nav');
        formData.append('userId', sessionData.userId);
        formData.append('token', sessionData.token);

        const response = await fetch(CONFIG.API_URL, {
            method: "POST",
            body: formData
        });
        
        const result = await response.json();

        if (!result.success) throw new Error(result.message);

        const isAdmin = result.isAdmin;
        const entreprisesPatron = result.entreprisesPatron ? result.entreprisesPatron.split(',').map(id => id.trim()) : [];
        const isPatronOfActive = entreprisesPatron.includes(String(activeCompanyId));
        const rootPath = "/caisse-nosignal/";
        const isActive = (folder) => window.location.pathname.includes(`/${folder}/`);
        const roleLabel = isAdmin ? "Administrateur" : (isPatronOfActive ? "Patron" : "Employé");

        sidebarContainer.innerHTML = `
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
                </nav>
            </div>
            <div class="p-4 border-t border-[#222] flex items-center justify-between">
                <div><p class="font-bold text-white text-sm">${sessionData.username || 'Utilisateur'}</p><p class="text-[10px] text-gray-500">${roleLabel}</p></div>
                <button id="btn-logout-nav" class="text-[10px] bg-[#222] hover:bg-red-900 px-3 py-1.5 rounded cursor-pointer">Déconnexion</button>
            </div>
        </aside>>`;

        document.getElementById('btn-logout-nav').addEventListener('click', () => {
            localStorage.clear();
            window.location.replace(rootPath);
        });

    } catch (e) {
        console.error("Erreur navigation :", e);
        sidebarContainer.innerHTML = `<p class="p-4 text-red-500 text-xs">Accès refusé ou erreur serveur.</p>`;
    }
});
