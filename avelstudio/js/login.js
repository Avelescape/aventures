document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm");
  const message = document.getElementById("message");

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    message.textContent = "";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      message.textContent = "Email ou mot de passe incorrect.";
      return;
    }

    window.location.href = "dashboard.html";

  });

});
