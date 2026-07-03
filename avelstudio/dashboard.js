
document.addEventListener("DOMContentLoaded", async () => {
  const { data: { session } } = await supabaseClient.auth.getSession();

  if (!session) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("logoutBtn").addEventListener("click", deconnexion);
  document.getElementById("newAdventureBtn").addEventListener("click", nouvelleAventure);

  chargerAventures();
});

async function chargerAventures() {
  const loading = document.getElementById("loadingMessage");
  const liste = document.getElementById("aventuresList");

  loading.style.display = "block";
  liste.innerHTML = "";

  const { data, error } = await supabaseClient
    .from("aventures")
    .select("*")
    .order("created_at", { ascending: false });

  loading.style.display = "none";

  if (error) {
    liste.innerHTML = `<p style="color:red;">Erreur : ${error.message}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    liste.innerHTML = `<p>Aucune aventure pour le moment.</p>`;
    return;
  }

  data.forEach((aventure) => {
    const carte = document.createElement("div");
    carte.className = "aventure-card";

    carte.innerHTML = `
      <h3>${aventure.titre || "Sans titre"}</h3>
      <p><strong>Lieu :</strong> ${aventure.lieu || "-"}</p>
      <p><strong>Statut :</strong> ${aventure.statut || "brouillon"}</p>
      <span class="badge">ID : ${aventure.id}</span>
    `;

    liste.appendChild(carte);
  });
}

async function nouvelleAventure() {
  alert("La création d'aventure sera ajoutée à l'étape suivante.");
}

async function deconnexion() {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}
