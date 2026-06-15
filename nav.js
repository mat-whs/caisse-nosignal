document.addEventListener("DOMContentLoaded", async () => {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) return;

    const sessionData = JSON.parse(localStorage.getItem('caisse_session'));
    const activeCompanyId = localStorage.getItem('active_company_id');

    if (!sessionData) {
        window.location.replace('/caisse-nosignal/');
        return;
    }

    // Fonction de récupération des données de navigation
    async function fetchNavData() {
        try {
            const formData = new FormData();
            formData.append('action', 'nav');
            formData.append('userId', sessionData.userId);
            formData.append('token', sessionData.token);

            const response = await fetch(CONFIG.API_URL, {
                method: "POST",
                body: formData
            });

            return await response.json();
        } catch (error) {
            console.error("Erreur réseau navigation :", error);
            return { success: false };
        }
    }

    const result = await fetchNavData();

    if (!result.success) {
        sidebarContainer.innerHTML = `<p class="p-4 text-red-500 text-xs">Erreur de chargement</p>`;
        return;
    }

    const isAdmin = result.isAdmin;
    const entreprisesPatron = result.entreprisesPatron ? result.entreprisesPatron.split(',').map(id => id.trim()) : [];
    
    // Rendu du HTML (identique à ton code original)
    const isPatronOfActive = entreprisesPatron.includes(String(activeCompanyId));
    const path = window.location.pathname;
    const rootPath = "/caisse-nosignal/";
    const isActive = (folder) => path.includes(`/${folder}/`);
    const roleLabel = isAdmin ? "Administrateur" : (isPatronOfActive ? "Patron" : "Employé");

    sidebarContainer.innerHTML = `
    <aside class="w-64 bg-[#111] border-r border-[#222] flex flex-col justify-between h-full shrink-0">
        <div class="p-4 border-t border-[#222] flex items-center justify-between">
            <div class="min-w-0 flex-1 pr-2">
                <p class="font-bold text-white text-sm truncate">${sessionData.username || 'Utilisateur'}</p>
                <p class="text-[10px] text-gray-500 uppercase tracking-wider">${roleLabel}</p>
            </div>
            <button id="btn-logout-nav" class="text-[10px] bg-[#222] hover:bg-red-900 px-3 py-1.5 rounded transition cursor-pointer">Déconnexion</button>
        </div>
    </aside>`;

    document.getElementById('btn-logout-nav').addEventListener('click', () => {
        localStorage.removeItem('caisse_session');
        localStorage.removeItem('active_company_id');
        window.location.replace(rootPath);
    });

    if (typeof window.renderNavDone === 'function') window.renderNavDone();
});
