console.log("Le fichier stock.js est chargé !");

// 1. Récupération des données
async function loadStockData() {
    // Appel à votre API (identique à la caisse)
    const response = await fetch(CONFIG.API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "getFormData", userId: sessionData.userId })
    });
    const result = await response.json();
    
    if (result.success) {
        renderStock(result.stocks);
    }
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
    formData.append('action', 'updateStock');
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
