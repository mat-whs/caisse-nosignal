document.addEventListener("DOMContentLoaded", async () => {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) return;

    const sessionData = JSON.parse(localStorage.getItem('caisse_session'));
    const activeCompanyId = localStorage.getItem('active_company_id');
    const rootPath = "/caisse-nosignal/";

    if (!sessionData) {
        window.location.replace(rootPath);
        return;
    }

    try {
        const formData = new FormData();
        formData.append('action', 'nav');
        formData.append('userId', sessionData.userId);
        formData.append('token', sessionData.token);
        formData.append('activeCompanyId', activeCompanyId || "");

        const response = await fetch(CONFIG.API_URL, {
            method: "POST",
            body: formData
        });
        
        const result = await response.json();

        // Sécurité critique : si pas d'entreprise active valide ou droit révoqué, redirection forcée
        if (!result.success || !result.isAuthorized) {
            window.location.replace(`${rootPath}choix-entreprise/`);
            return;
        }

        const isAdmin = result.isAdmin;
        const entreprisesPatron = result.entreprisesPatron ? result.entreprisesPatron.split(',').map(id => id.trim()) : [];
        const isPatronOfActive = entreprisesPatron.includes(String(activeCompanyId));
        const isActive = (folder) => window.location.pathname.includes(`/${folder}/`);
        const roleLabel = isAdmin ? "Administrateur" : (isPatronOfActive ? "Patron" : "Employé");

        sidebarContainer.innerHTML = `
        <aside class="w-64 bg-[#111] border-r border-[#222] flex flex-col justify-between h-full shrink-0">
            <div class="overflow-y-auto flex-1 custom-scrollbar">
                <div class="p-6 border-b border-[#222]">
                    <span class="text-xl font-bold tracking-wider text-white">Caisse.<span class="font-light">NoSignal</span></span>
                </div>
                <nav class="p-4 space-y-1">
                    <div class="pb-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest pl-3">Espace Général</div>
                    
                    <a href="${rootPath}dashboard/" class="flex items-center space-x-3 p-3 rounded ${isActive('dashboard') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                        <span>📊</span> <span>Tableau de bord</span>
                    </a>
                    <a href="${rootPath}caisse/" class="flex items-center space-x-3 p-3 rounded ${isActive('caisse') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                        <span>🛒</span> <span>Caisse (Ventes)</span>
                    </a>
                    <a href="${rootPath}stock/" class="flex items-center space-x-3 p-3 rounded ${isActive('stock') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                        <span>📦</span> <span>Stock & Inventaire</span>
                    </a>
                    <a href="${rootPath}historique/" class="flex items-center space-x-3 p-3 rounded ${isActive('historique') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                        <span>⏳</span> <span>Historique Ventes</span>
                    </a>
                    <a href="${rootPath}pointage/" class="flex items-center space-x-3 p-3 rounded ${isActive('pointage') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                        <span>⏱️</span> <span>Prise de Service</span>
                    </a>

                    ${(isAdmin || isPatronOfActive) ? `
                        <div class="pt-4 pb-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest pl-3">Management</div>
                        <a href="${rootPath}gestion-entreprise/" class="flex items-center space-x-3 p-3 rounded ${isActive('gestion-entreprise') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                            <span>🏢</span> <span>Gestion Entreprise</span>
                        </a>
                        <a href="${rootPath}primes/" class="flex items-center space-x-3 p-3 rounded ${isActive('primes') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                            <span>💰</span> <span>Suivi des Primes</span>
                        </a>
                    ` : ''}

                    ${isAdmin ? `
                        <div class="pt-4 pb-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest pl-3">Administration</div>
                        <a href="${rootPath}admin/site/" class="flex items-center space-x-3 p-3 rounded ${isActive('admin/site') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                            <span>⚙️</span> <span>Configuration Site</span>
                        </a>
                        <a href="${rootPath}admin/utilisateurs/" class="flex items-center space-x-3 p-3 rounded ${isActive('admin/utilisateurs') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                            <span>👥</span> <span>Utilisateurs</span>
                        </a>
                        <a href="${rootPath}admin/roles/" class="flex items-center space-x-3 p-3 rounded ${isActive('admin/roles') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                            <span>🛡️</span> <span>Rôles & Droits</span>
                        </a>
                        <a href="${rootPath}admin/logs/" class="flex items-center space-x-3 p-3 rounded ${isActive('admin/logs') ? 'bg-[#222] text-white' : 'text-gray-400 hover:bg-[#222] hover:text-white'}">
                            <span>📋</span> <span>Logs Système</span>
                        </a>
                    ` : ''}
                </nav>
            </div>
            
            <div class="p-4 border-t border-[#222] bg-[#0d0d0d] flex items-center justify-between gap-2 shrink-0">
                <div class="min-w-0 flex-1">
                    <p class="font-bold text-white text-sm truncate">${result.username || 'Utilisateur'}</p>
                    <p class="text-[10px] text-gray-500">${roleLabel}</p>
                    <p class="text-[11px] text-emerald-400 font-semibold truncate mt-0.5 bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-900/40 w-max max-w-full">${result.activeCompanyName || 'Aucune'}</p>
                </div>
                <div class="flex items-center space-x-1 shrink-0">
                    ${result.hasMultipleCompanies ? `
                        <button id="btn-change-company-nav" class="text-[10px] bg-[#222] hover:bg-neutral-800 border border-[#333] text-gray-300 px-2 py-1.5 rounded cursor-pointer transition">Changer</button>
                    ` : ''}
                    <button id="btn-logout-nav" class="text-[10px] bg-[#222] hover:bg-red-900 border border-[#333] px-2 py-1.5 rounded cursor-pointer transition text-white">Quitter</button>
                </div>
            </div>
        </aside>`;

        // Listeners
        document.getElementById('btn-logout-nav').addEventListener('click', () => {
            localStorage.clear();
            window.location.replace(rootPath);
        });

        if (result.hasMultipleCompanies) {
            document.getElementById('btn-change-company-nav').addEventListener('click', () => {
                window.location.replace(`${rootPath}choix-entreprise/`);
            });
        }

    } catch (e) {
        console.error("Erreur navigation :", e);
        sidebarContainer.innerHTML = `<p class="p-4 text-red-500 text-xs">Accès refusé ou erreur serveur.</p>`;
    }
});
