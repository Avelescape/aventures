// Vérification de l'utilisateur connecté
document.addEventListener("DOMContentLoaded", async () => {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {
        window.location.href = "index.html";
        return;
    }

    chargerAventures();

    document
        .getElementById("logoutBtn")
        .addEventListener("click", deconnexion);

});


// ------------------------------
// Charger les aventures
// ------------------------------

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

        liste.innerHTML = `
            <p style="color:red;">
                ${error.message}
            </p>
        `;

        return;

    }

    if (data.length === 0) {

        liste.innerHTML = `
            <p>Aucune aventure enregistrée.</p>
        `;

        return;

    }

    data.forEach(aventure => {

        liste.innerHTML += `

            <div class="aventure-card">

                <h3>${aventure.titre ?? "Sans titre"}</h3>

                <p><strong>Lieu :</strong> ${aventure.lieu ?? "-"}</p>

                <p><strong>Statut :</strong> ${aventure.statut ?? "-"}</p>

                <span class="badge">
                    ${aventure.id}
                </span>

            </div>

        `;

    });

}



// ------------------------------
// Déconnexion
// ------------------------------

async function deconnexion() {

    await supabaseClient.auth.signOut();

    window.location.href = "index.html";

}
