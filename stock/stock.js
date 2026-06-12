console.log("Le fichier stock.js est chargé !");

// 1. Récupération des données
async function loadStockData() {
    try {
        const formData = new FormData();
        formData.append('action', 'getFormData');
        formData.append('userId', sessionData.userId);

        const response = await fetch(CONFIG.API_URL, {
            method: "POST",
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // 1. Remplir le menu entreprise (comme dans la caisse)
            populateCompanySelector(result.entreprises);
            
            // 2. Remplir le tableau de stock
            renderStock(result.stocks || []);
        } else {
            console.error("Erreur serveur :", result.message);
        }
    } catch (e) {
        console.error("Erreur technique :", e);
    }
}

// Nouvelle fonction pour gérer le menu
function populateCompanySelector(entreprises) {
    const compSelector = document.getElementById('company-selector');
    if (!compSelector) return;

    compSelector.innerHTML = ""; 
    entreprises.forEach(entreprise => {
        const opt = document.createElement('option');
        opt.value = entreprise.id;
        opt.innerText = entreprise.nom;
        compSelector.appendChild(opt);
    });

    const savedCompany = localStorage.getItem('active_company_id');
    if (savedCompany) compSelector.value = savedCompany;

    compSelector.addEventListener('change', (e) => {
        localStorage.setItem('active_company_id', e.target.value);
        // Optionnel : Recharger le stock quand on change d'entreprise
        loadStockData(); 
    });
}

// 2. La fonction de rendu que vous avez demandée
function renderStock(stocks) {
    const tbody = document.getElementById('stock-body');
    if (!tbody) return; // Sécurité
    
    tbody.innerHTML = '';
    stocks.forEach(item => {
        tbody.innerHTML += `
            <tr class="border-b border-[#222]">
                <td class="p-4">${item.nomElement}</td>
                <td class="p-4">${item.type}</td>
                <td class="p-4">${item.quantite}</td>
                <td class="p-4">
                    <button onclick="editStock(${item.id})" class="text-blue-400">Modifier</button>
                </td>
            </tr>
        `;
    });
}

async function editStock(id) {
    const nouvelleQte = prompt("Entrez la nouvelle quantité :");
    if (nouvelleQte === null) return;

    const formData = new FormData();
    formData.append('action', 'getStockData');
    formData.append('id', id);
    formData.append('quantite', nouvelleQte);

    const response = await fetch(CONFIG.API_URL, { method: "POST", body: formData });
    const result = await response.json();

    if (result.success) {
        alert("Stock mis à jour !");
        loadStockData(); // Recharge la liste
    } else {
        alert("Erreur : " + result.message);
    }
}

function addNewElement() {
    const nom = prompt("Nom de l'élément :");
    if (!nom) return;
    
    // Logique pour envoyer au serveur...
    console.log("Ajout de :", nom);
    alert("Fonctionnalité d'ajout bientôt disponible.");
}

// Lancement au chargement
document.addEventListener('DOMContentLoaded', loadStockData);
