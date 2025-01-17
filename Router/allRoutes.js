import Route from "./route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html", []),
    new Route("/galerie", "Galerie", "/pages/galerie.html", [], "/js/galerie.js"),
    new Route("/connexion", "Connexion", "/pages/connexion.html", ["disconnected"],"/js/signin.js"),
    new Route("/inscription", "Inscription", "/pages/inscription.html", ["disconnected"],"/js/signup.js"),
    new Route("/account", "Compte", "/pages/account.html", ["client", "admin", "ROLE_USER"]),
    new Route("/editPassword", "Changement de mot de passe", "/pages/editPassword.html", ["client", "admin"]),
    new Route("/reservations", "Réservations", "/pages/reservations.html", ["client", "admin", "ROLE_USER"]),
    new Route("/reserver", "Ma réservation", "/pages/reserver.html", ["client", "ROLE_USER"])
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Quai Antique";