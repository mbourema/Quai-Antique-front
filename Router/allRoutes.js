import Route from "./route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html"),
    new Route("/galerie", "Galerie", "/pages/galerie.html"),
    new Route("/connexion", "Connexion", "/pages/connexion.html"),
    new Route("/inscription", "Inscription", "/pages/inscription.html"),
    new Route("/account", "Compte", "/pages/account.html"),
    new Route("/editPassword", "Changement de mot de passe", "/pages/editPassword.html"),
    new Route("/reservations", "Réservations", "/pages/reservations.html"),
    new Route("/reserver", "Ma réservation", "/pages/reserver.html")
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Quai Antique";