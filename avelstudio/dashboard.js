const adventuresList = document.getElementById("adventuresList");
const message = document.getElementById("message");
const newAdventureBtn = document.getElementById("newAdventureBtn");
const logoutBtn = document.getElementById("logoutBtn");

document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabaseClient && typeof supabaseClient === "undefined") {
    showMessage("Erreur : Supabase n'est pas chargé. Vérifie le fichier supabase.js.", "error");
    adventuresList.innerHTML = "";
    return;
  }

  await checkUser();
  await loadAdventures();

  newAdventureBtn.addEventListener("click", createAdventure);
  logoutBtn.addEventListener("click", logout);
});

async function checkUser() {
  const { data, error } = await supabaseClient.auth.getUser();

  if (error || !data.user) {
    window.location.href = "login.html";
    return;
  }
}

async function loadAdventures() {
  adventuresList.innerHTML = "Chargement...";
  clearMessage();

  const { data, error } = await supabaseClient
    .from("aventures")
    .select("id, created_at, lieu_id, titre, type_aventure, statut")
    .order("created_at", { ascending: false });

  if (error) {
    adventuresList.innerHTML = "";
    showMessage("Erreur lors du chargement des aventures : " + error.message, "error");
    return;
  }

  if (!data || data.length === 0) {
    adventuresList.innerHTML = `
      <div class="empty-state">
        Aucune aventure pour le moment.
      </div>
    `;
    return;
  }

  adventuresList.innerHTML = data.map(adventure => `
    <article class="adventure-card">
      <h2>${escapeHtml(adventure.titre || "Aventure sans titre")}</h2>
      <p><strong>Type :</strong> ${escapeHtml(adventure.type_aventure || "Non défini")}</p>
      <p><strong>Statut :</strong> ${escapeHtml(adventure.statut || "Non défini")}</p>
      <p><strong>Créée le :</strong> ${formatDate(adventure.created_at)}</p>
    </article>
  `).join("");
}

async function createAdventure() {
  newAdventureBtn.disabled = true;
  newAdventureBtn.textContent = "Création...";

  clearMessage();

  const nouvelleAventure = {
    lieu_id: null,
    titre: "Nouvelle aventure",
    type_aventure: "classique",
    statut: "brouillon"
  };

  const { error } = await supabaseClient
    .from("aventures")
    .insert([nouvelleAventure]);

  if (error) {
    showMessage("Erreur lors de la création : " + error.message, "error");
    newAdventureBtn.disabled = false;
    newAdventureBtn.textContent = "+ Nouvelle aventure";
    return;
  }

  showMessage("Nouvelle aventure créée.", "success");
  await loadAdventures();

  newAdventureBtn.disabled = false;
  newAdventureBtn.textContent = "+ Nouvelle aventure";
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "login.html";
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = "message " + type;
}

function clearMessage() {
  message.textContent = "";
  message.className = "message";
}

function formatDate(dateString) {
  if (!dateString) return "Date inconnue";

  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
