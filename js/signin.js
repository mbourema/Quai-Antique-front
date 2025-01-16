const mailInput = document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const btnSignin = document.getElementById("btnSignin");


btnSignin.addEventListener("click", checkCredentials);

// Fonction pour gérer la connexion pour la page de connexion
function checkCredentials(){
    //Ici, il faudra appeler l'API pour vérifier les credentials en BDD
    //Si la valeur du champ e-mail est 'test@mail.com' et que la valeur du champ mot de passe est '123'
    if(mailInput.value == "test@mail.com" && passwordInput.value == "123"){
        //Il faudra récupérer le vrai token
        const token = "lkjsdngfljsqdnglkjsdbglkjqskjgkfjgbqslkfdgbskldfgdfgsdgf";
        /* Un cookie est créé avec le nom "accesstoken" et la valeur de la constante token et 
        une durée d'expiration de 7 jours (en utilisant la fonction setCookie) */
        setToken(token);
        //L'utilisateur est redirifé dans la page d'accueil
        window.location.replace("/");
        //Un cookie avec le role d'administrateur est créé pour 7 jours
        setCookie(roleCookieName, "admin", 7);
    }
    else{
        //Sinon les champs du formulaire de connexion s'entourent de rouge
        mailInput.classList.add("is-invalid");
        passwordInput.classList.add("is-invalid");
    }
}