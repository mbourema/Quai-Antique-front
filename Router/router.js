import Route from "./route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Création d'une route pour la page 404 (page introuvable)
const route404 = new Route("404", "Page introuvable", "/pages/404.html");

// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
  let currentRoute = null;
  // Parcours de toutes les routes pour trouver la correspondance
  allRoutes.forEach((element) => {
    if (element.url == url) {
      currentRoute = element;
    }
  });
  // Si aucune correspondance n'est trouvée, on retourne la route 404
  if (currentRoute != null) {
    return currentRoute;
  } else {
    return route404;
  }
};

// Fonction pour charger le contenu de la page
const LoadContentPage = async () => {
  const path = window.location.pathname;
  // Récupération de l'URL actuelle
  const actualRoute = getRouteByUrl(path);
  //Vérifier les droits d'accès à la page
  const allRolesArray = actualRoute.authorize;
  if(allRolesArray.length > 0){
    if(allRolesArray.includes("disconnected")){
      if(isConnected()){
        window.location.replace("/");
      }
    }
    else{
      const roleUser = getRole();
      if(!allRolesArray.includes(roleUser)){
        window.location.replace("/");
      }
    }
  }
  // Récupération du contenu HTML de la route
  // Ici, l'argument data est un objet Response qui représente la réponse de la requête HTTP
  const html = await fetch(actualRoute.pathHtml).then((data) => data.text());
  // Ajout du contenu HTML à l'élément avec l'ID "main-page"
  document.getElementById("main-page").innerHTML = html;

  // Ajout du contenu JavaScript
  if (actualRoute.pathJS != "") {
    // Création d'une balise script
    let scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", actualRoute.pathJS);

    // Ajout de la balise script au corps du document
    document.querySelector("body").appendChild(scriptTag);
  }
  // Changement du titre de la page
  document.title = actualRoute.title + " - " + websiteName;
  // Afficher et masquer les éléments en fonction du rôle
  showAndHideElementsForRoles();
};


// Fonction pour gérer les événements de routage (clic sur les liens)
const routeEvent = (event) => {
  /* Si event est undefined ou null (ce qui peut arriver dans certains environnements plus anciens), elle le remplace par window.event. 
  C'est une technique de compatibilité avec d'anciens navigateurs (comme Internet Explorer) où window.event était utilisé à la place d'un argument explicite.*/
  event = event || window.event;
  /* Elle empêche l'action par défaut associée à l'événement. Pour un lien <a>, cela signifie empêcher la navigation automatique vers l'URL spécifiée dans href.
  L'objectif est de gérer manuellement la navigation (par exemple, via JavaScript) au lieu de laisser le navigateur charger une nouvelle page.*/ 
  event.preventDefault();
  /* Utilisation de l'API history.pushState pour ajouter une nouvelle entrée dans l'historique du navigateur. 
  history.pushState(state, title, url); state est une donnée arbitraire qu'on peut associer à l'entrée d'historique.
  Lorsque l'utilisateur navigue dans l'historique (en cliquant sur les boutons "Précédent" ou "Suivant"), l'objet state associé à l'entrée est disponible via l'événement popstate.
  url représente l'URL qu'on veut associer à cette entrée d'historique (point de navigation enregistré dans l'historique du navigateur chaque fois qu'on charge une nouvelle page
  ou qu'on utilise history.pushState pour ajouter une URL.). 
  Elle apparaît dans la barre d'adresse du navigateur sans provoquer de rechargement de la page.
  Dans cet exemple, event.target.href est l'attribut href de l'élément HTML sur lequel l'utilisateur a cliqué.*/
  window.history.pushState({}, "", event.target.href);
  // Chargement du contenu de la nouvelle page
  LoadContentPage();
};

// Gestion de l'événement de retour en arrière dans l'historique du navigateur
window.onpopstate = LoadContentPage;
// Assignation de la fonction routeEvent à la propriété route de la fenêtre
window.route = routeEvent;
// Chargement du contenu de la page au chargement initial
LoadContentPage();
