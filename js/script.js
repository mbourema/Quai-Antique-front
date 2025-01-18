const tokenCookieName = "accesstoken";
const signOutBtn = document.getElementById("SignoutBtn");
const roleCookieName = "role";
const apiUrl = "http://127.0.0.1:8000/api/";

// Créer un cookie à partir de son nom, de sa valeur et de sa durée d'expiration en jours
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

//Récupérer la valeur d'un cookie à partir de son nom
function getCookie(name) {
    //Cette ligne ajoute un signe = au nom du cookie. Par exemple, si le nom du cookie est "user", alors nameEQ devient "user="
    let nameEQ = name + "=";
    /*document.cookie retourne tous les cookies sous forme d'une chaîne unique, où chaque cookie est séparé par un point-virgule ;
    Cette ligne divise cette chaîne en un tableau (ca) où chaque élément est un cookie.
    */
    let ca = document.cookie.split(';');
    //La boucle for parcourt chaque cookie dans le tableau ca.
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        /*Certains cookies peuvent avoir des espaces en début de chaîne.
        Cette boucle while supprime les espaces en début de la chaîne pour assurer une correspondance correcte.*/
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        /*c.indexOf(nameEQ) vérifie si le cookie commence par la chaîne nameEQ (le nom du cookie suivi de =)
        Si c'est vrai, cela signifie que le cookie recherché a été trouvé.
        Ensuite, on extrait la valeur du cookie en utilisant c.substring(nameEQ.length, c.length), qui commence juste après name= et prend tout le reste de la chaîne. */
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        //Si aucun cookie avec le nom donné n'est trouvé, la fonction retourne null.
    }
    return null;
}

//Création du cookie jeton
function setToken(token){
    setCookie(tokenCookieName, token, 7);
}

//Obtenir la valeur du jeton de connexion
function getToken(){
    return getCookie(tokenCookieName);
}

//Obtenir la valeur du cookie role
function getRole(){
    return getCookie(roleCookieName);
}

// Supprimer un cookie à partir de son nom
function eraseCookie(name) {  
    /* name + '=': Cette partie spécifie le nom du cookie suivi d'une valeur vide (=). Cela réécrit le cookie avec une valeur vide. 
    Path=/: Cela indique que le cookie est défini pour la racine (/) du domaine. Cela garantit que le cookie sera supprimé à tous les niveaux du site.
    Expires=Thu, 01 Jan 1970 00:00:01 GMT;: Cette partie définit une date d'expiration dans le passé (1er janvier 1970).
    Les cookies expirés sont automatiquement supprimés par le navigateur.*/
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// Fonction pour gérer la déconnexion à l'aide de la suppression du cookie token et du cookie role
function signout(){
    eraseCookie(tokenCookieName);
    eraseCookie(roleCookieName);
    //Recharger la page
    window.location.reload();
}

// Bouton de déconnexion
signOutBtn.addEventListener("click", signout);

// Fonction qui vérifie si on est connexté sur le site par la présence ou non du cookie jeton
function isConnected(){
    if(getToken() == null || getToken == undefined){
        return false;
    }
    else{
        return true;
    }
}

function showAndHideElementsForRoles(){
    //Récupération du booleen qui dit si l'utilisateur est connecté ainsi que de la valeur du cookie role
    const userConnected = isConnected();
    const role = getRole();

    //Sélection de tout les attributs data-show de toutes les pages du projet
    let allElementsToEdit = document.querySelectorAll('[data-show]');

    /* Switch case, si la valeur du data-show est 'disconnected' et que l'utilisateur est connecté l'élément est
    masqué, si la valeur est 'connected' et que l'utilisateur n'est pas connecté l'élément est masqué,
    si la valeur est admin et que l'utilisateur n'est pas connecté ou que son rôle n'est pas admin l'élément est masqué,
    si la valeur est client et que l'utilisateur n'est pas connecté ou que son rôle n'est pas client l'élément est masqué*/
    allElementsToEdit.forEach(element =>{
        switch(element.dataset.show){
            case 'disconnected': 
                if(userConnected){
                    element.classList.add("d-none");
                }
                break;
            case 'connected': 
                if(!userConnected){
                    element.classList.add("d-none");
                }
                break;
            case 'admin': 
                if(!userConnected || role != "admin"){
                    element.classList.add("d-none");
                }
                break;
            case 'client': 
                if(!userConnected || role != "client"){
                    element.classList.add("d-none");
                }
                break;
        }
    })
}

//Fonction pour transformer le codes HTML en texte pour éviter l'injection de code HTML via failles XSS
function sanitizeHtml(text){
    // Créez un élément HTML temporaire de type "div"
    const tempHtml = document.createElement('div');
    
    // Affectez le texte reçu en tant que contenu texte de l'élément "tempHtml"
    tempHtml.textContent = text;
    
    // Utilisez .innerHTML pour récupérer le contenu de "tempHtml"
    // Cela va "neutraliser" ou "échapper" tout code HTML potentiellement malveillant
    return tempHtml.innerHTML;
}

//Fonction pour récupérer les informations de l'utilisateur
function getInfoUser() {
    let myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());
    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch(apiUrl + "account/me", requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json(); // Retourne les données JSON si la réponse est valide
            } else {
                throw new Error("Impossible de récupérer les informations utilisateurs");
            }
        })
        .catch(error => {
            console.log('Erreur lors de la récupération des données utilisateurs', error);
            throw error; // Re-propage l'erreur pour permettre une gestion en amont
        });
}
