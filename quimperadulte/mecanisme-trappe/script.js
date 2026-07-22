"use strict";

/*
  ==========================================================
  CONFIGURATION DU MÉCANISME
  ==========================================================

  Tu pourras réutiliser ce code pour une autre aventure
  en modifiant uniquement cet objet CONFIG.
*/

const CONFIG = {
  images: {
    fond: "images/batiment.webp",
    trappe: "images/trappe.webp",
    cavite: "images/cavite.webp",
    objet: "images/coffre.webp"
  },

  enigme: {
    question:
      "Quel roi légendaire est associé à la ville d’Ys ?",

    reponsesAcceptees: [
      "gradlon",
      "roi gradlon",
      "le roi gradlon"
    ],

    indice:
      "Son nom apparaît dans le titre de cette aventure.",

    messageSucces:
      "Bonne réponse ! Un mécanisme se déclenche.",

    messageErreur:
      "Ce n’est pas la bonne réponse."
  },

  /*
    POSITION DE LA TRAPPE EN POURCENTAGES

    x = distance depuis le bord gauche
    y = distance depuis le haut
    largeur = largeur de la trappe
    hauteur = hauteur de la trappe
  */
  trappe: {
    x: 38,
    y: 74,
    largeur: 24,
    hauteur: 13,

    /*
      Valeurs possibles :
      "droite"
      "gauche"
      "haut"
      "bas"
    */
    direction: "droite",

    /*
      Distance parcourue en pourcentage
      de la taille de la trappe.
    */
    distance: 112
  },

  objet: {
    titre: "Un coffre oublié",

    description:
      "Derrière la façade se trouvait un coffre soigneusement dissimulé.",

    texteBouton:
      "Continuer l’aventure",

    /*
      Mets ici le lien de la scène suivante.
      Laisse une chaîne vide pour rester sur la page.
    */
    lienSuite: ""
  },

  comportement: {
    afficherIndiceApres: 3,
    vibrationErreur: true,
    vibrationSucces: true,
    sonsActifs: true
  }
};

/*
  ==========================================================
  ÉLÉMENTS HTML
  ==========================================================
*/

const racine = document.documentElement;

const scene = document.getElementById("scene");
const blocEnigme = document.getElementById("blocEnigme");

const imageFond = document.getElementById("imageFond");
const imageTrappe = document.getElementById("imageTrappe");
const imageCavite = document.getElementById("imageCavite");
const imageObjet = document.getElementById("imageObjet");
const imageObjetModale = document.getElementById("imageObjetModale");

const questionEnigme = document.getElementById("questionEnigme");

const formulaireReponse =
  document.getElementById("formulaireReponse");

const champReponse = document.getElementById("champReponse");
const boutonValider = document.getElementById("boutonValider");

const messageReponse = document.getElementById("messageReponse");
const messageScene = document.getElementById("messageScene");

const boutonIndice = document.getElementById("boutonIndice");

const objetCache = document.getElementById("objetCache");

const modaleObjet = document.getElementById("modaleObjet");
const fermerModale = document.getElementById("fermerModale");

const titreModale = document.getElementById("titreModale");
const texteModale = document.getElementById("texteModale");
const boutonContinuer = document.getElementById("boutonContinuer");

const sonTrappe = document.getElementById("sonTrappe");
const sonSucces = document.getElementById("sonSucces");

/*
  ==========================================================
  ÉTAT DU JEU
  ==========================================================
*/

let nombreErreurs = 0;
let trappeOuverte = false;

/*
  ==========================================================
  INITIALISATION
  ==========================================================
*/

function initialiser() {
  appliquerImages();
  appliquerTextes();
  appliquerPositionTrappe();
  appliquerDirection();
}

function appliquerImages() {
  imageFond.src = CONFIG.images.fond;
  imageTrappe.src = CONFIG.images.trappe;
  imageCavite.src = CONFIG.images.cavite;
  imageObjet.src = CONFIG.images.objet;
  imageObjetModale.src = CONFIG.images.objet;
}

function appliquerTextes() {
  questionEnigme.textContent = CONFIG.enigme.question;

  titreModale.textContent = CONFIG.objet.titre;
  texteModale.textContent = CONFIG.objet.description;

  boutonContinuer.textContent =
    CONFIG.objet.texteBouton;
}

function appliquerPositionTrappe() {
  racine.style.setProperty(
    "--trappe-x",
    `${CONFIG.trappe.x}%`
  );

  racine.style.setProperty(
    "--trappe-y",
    `${CONFIG.trappe.y}%`
  );

  racine.style.setProperty(
    "--trappe-largeur",
    `${CONFIG.trappe.largeur}%`
  );

  racine.style.setProperty(
    "--trappe-hauteur",
    `${CONFIG.trappe.hauteur}%`
  );
}

function appliquerDirection() {
  const distance = CONFIG.trappe.distance;

  let deplacementX = 0;
  let deplacementY = 0;

  switch (CONFIG.trappe.direction) {
    case "gauche":
      deplacementX = -distance;
      break;

    case "haut":
      deplacementY = -distance;
      break;

    case "bas":
      deplacementY = distance;
      break;

    case "droite":
    default:
      deplacementX = distance;
      break;
  }

  racine.style.setProperty(
    "--deplacement-x",
    `${deplacementX}%`
  );

  racine.style.setProperty(
    "--deplacement-y",
    `${deplacementY}%`
  );
}

/*
  ==========================================================
  VÉRIFICATION DE LA RÉPONSE
  ==========================================================
*/

function normaliserTexte(texte) {
  return texte
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function reponseCorrecte(texteUtilisateur) {
  const valeurUtilisateur =
    normaliserTexte(texteUtilisateur);

  return CONFIG.enigme.reponsesAcceptees.some(
    (reponse) =>
      normaliserTexte(reponse) === valeurUtilisateur
  );
}

/*
  ==========================================================
  OUVERTURE DE LA TRAPPE
  ==========================================================
*/

function ouvrirTrappe() {
  if (trappeOuverte) {
    return;
  }

  trappeOuverte = true;

  scene.classList.add("est-ouverte");

  messageReponse.textContent =
    CONFIG.enigme.messageSucces;

  messageReponse.className =
    "enigme__message enigme__message--succes";

  messageScene.hidden = false;

  champReponse.disabled = true;
  boutonValider.disabled = true;
  boutonIndice.hidden = true;

  if (CONFIG.comportement.vibrationSucces) {
    vibrer([70, 45, 130]);
  }

  jouerSon(sonTrappe);

  window.setTimeout(() => {
    jouerSon(sonSucces);
  }, 700);

  window.setTimeout(() => {
    objetCache.focus();
  }, 1500);
}

/*
  ==========================================================
  MAUVAISE RÉPONSE
  ==========================================================
*/

function afficherErreur() {
  nombreErreurs += 1;

  messageReponse.textContent =
    CONFIG.enigme.messageErreur;

  messageReponse.className =
    "enigme__message enigme__message--erreur";

  blocEnigme.classList.remove("secousse");

  /*
    Force le navigateur à recommencer l’animation.
  */
  void blocEnigme.offsetWidth;

  blocEnigme.classList.add("secousse");

  if (CONFIG.comportement.vibrationErreur) {
    vibrer([80, 45, 80]);
  }

  if (
    nombreErreurs >=
    CONFIG.comportement.afficherIndiceApres
  ) {
    boutonIndice.hidden = false;
  }

  champReponse.select();
}

/*
  ==========================================================
  VIBRATION ET SONS
  ==========================================================
*/

function vibrer(sequence) {
  if ("vibrate" in navigator) {
    navigator.vibrate(sequence);
  }
}

function jouerSon(audio) {
  if (!CONFIG.comportement.sonsActifs) {
    return;
  }

  if (!audio) {
    return;
  }

  audio.currentTime = 0;

  audio.play().catch(() => {
    /*
      Certains navigateurs bloquent les sons.
      Le mécanisme continue malgré tout.
    */
  });
}

/*
  ==========================================================
  MODALE DU COFFRE
  ==========================================================
*/

function ouvrirModale() {
  if (!trappeOuverte) {
    return;
  }

  modaleObjet.hidden = false;

  fermerModale.focus();
}

function fermerLaModale() {
  modaleObjet.hidden = true;

  objetCache.focus();
}

function continuerAventure() {
  const lien = CONFIG.objet.lienSuite.trim();

  if (lien) {
    window.location.href = lien;
    return;
  }

  fermerLaModale();
}

/*
  ==========================================================
  ÉVÉNEMENTS
  ==========================================================
*/

formulaireReponse.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    if (trappeOuverte) {
      return;
    }

    const valeur = champReponse.value.trim();

    if (!valeur) {
      messageReponse.textContent =
        "Entre d’abord une réponse.";

      messageReponse.className =
        "enigme__message enigme__message--erreur";

      champReponse.focus();

      return;
    }

    if (reponseCorrecte(valeur)) {
      ouvrirTrappe();
    } else {
      afficherErreur();
    }
  }
);

boutonIndice.addEventListener("click", () => {
  messageReponse.textContent =
    CONFIG.enigme.indice;

  messageReponse.className =
    "enigme__message";
});

objetCache.addEventListener("click", ouvrirModale);

fermerModale.addEventListener(
  "click",
  fermerLaModale
);

boutonContinuer.addEventListener(
  "click",
  continuerAventure
);

modaleObjet.addEventListener("click", (event) => {
  if (event.target === modaleObjet) {
    fermerLaModale();
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    !modaleObjet.hidden
  ) {
    fermerLaModale();
  }
});

/*
  ==========================================================
  LANCEMENT
  ==========================================================
*/

initialiser();
