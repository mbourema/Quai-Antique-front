const mailInput = document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const btnSignin = document.getElementById("btnSignin");
const formConnexion = document.getElementById("fomulaireConnexion");


btnSignin.addEventListener("click", checkCredentials);

// Fonction pour gérer la connexion pour la page de connexion
function checkCredentials(){
    //On récupère les données du formulaire de connexion
    let dataForm = new FormData(formConnexion);
    //On défini le header
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    //On récupère les données des champs du formulaire dans un fichier JSON
    let raw = JSON.stringify({
        "username": dataForm.get("Email"),
        "password": dataForm.get("Password")
    });
    //On met les options de la requête dans un objet
    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch(apiUrl+"login", requestOptions)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        else{
            mailInput.classList.add("is-invalid");
            passwordInput.classList.add("is-invalid");
        }
    })
    .then(result => {
        const token = result.apiToken;
        setToken(token);
        //placer ce token en cookie

        setCookie(roleCookieName, result.roles[0], 7);
        window.location.replace("/");
    })
    .catch(error => console.log('error', error));   
}