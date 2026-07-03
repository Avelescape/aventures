const adventuresList = document.getElementById("adventuresList");
const message = document.getElementById("message");
const newAdventureBtn = document.getElementById("newAdventureBtn");
const logoutBtn = document.getElementById("logoutBtn");

document.addEventListener("DOMContentLoaded", async () => {
  await checkUser();
  await loadAdventures();
});

async function checkUser() {
  const { data, error } = await supabaseClient.auth.getUser();

  if (error || !data.user) {
    window.location.href = "login.html";
  }
}

async function loadAdventures() {
  adventuresList.innerHTML = "Chargement...";
  message.textContent = "";
  message.className = "message";

  const { data, error } = await supabaseClient
    .from("aventures")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    adventuresList.innerHTML = "";
    showMessage("Erreur lors du chargement des aventures.", "error");
    console.error(error);
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

  adventuresList.innerHTML = "";

  data.forEach((aventure) => {
    const card = document.createElement("article");
    card.className = "adventure-card";

    card.innerHTML = `
      <h3>${escapeHtml(aventure.titre || "Aventure sans titre")}</h3>

      <div class="adventure-meta">
        <span class="badge">${escapeHtml(aventure.statut || "brouillon")}</span>
        <span>Type : ${escapeHtml(aventure.type_aventure || "non défini")}</span>
        <span>ID : ${aventure.id}</span>
      </div>
    `;

    adventuresList.appendChild(card);
  });
}

newAdventureBtn.addEventListener("click", async () => {
  message.textContent = "";
  message.className = "message";
  newAdventureBtn.disabled = true;
  newAdventureBtn.textContent = "Création...";

  const nouvelleAventure = {
    titre: "Nouvelle aventure",
    type_aventure: "standard",
    statut: "brouillon"
  };

  const { error } = await supabaseClient
    .from("aventures")
    .insert([nouvelleAventure]);

  if (error) {
    showMessage("Impossible de créer l’aventure.", "error");
    console.error(error);
  } else {
    showMessage("Nouvelle aventure créée.", "success");
    await loadAdventures();
  }

  newAdventureBtn.disabled = false;
  newAdventureBtn.textContent = "+ Nouvelle aventure";
});

logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  window.location.href = "login.html";
});

function showMessage(text, type) {
  message.textContent = text;
  message.className = `message ${type}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
