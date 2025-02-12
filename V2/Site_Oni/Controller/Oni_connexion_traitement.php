<?php 
    session_start(); 
    require_once 'Oni_config.php'; /*On lie la page a la BDD*/

    if(!empty($_POST['email']) && !empty($_POST['password'])) /*On vérifie si l'utilisateur a rempli le formulaire*/
    {
        /*Patch XSS*/
        $email = htmlspecialchars($_POST['email']); 
        $password = htmlspecialchars($_POST['password']);
        
        $email = strtolower($email); /*On mets l'email en minuscule*/
        
        /* On regarde si l'utilisateur est inscrit dans la table utilisateurs*/
        $check = $bdd->prepare('SELECT pseudo, email, password, token FROM utilisateurs WHERE email = ?');  /*On prépare la requête*/
        $check->execute(array($email)); /*On execute la requête*/
        $data = $check->fetch(); /*On récupère les données*/
        $row = $check->rowCount(); /*On récupère le nombre de ligne*/
        
        

        /* Si > à 0 alors l'utilisateur existe */
        if($row > 0)
        {
            // Si le mail est bon niveau format
            if(filter_var($email, FILTER_VALIDATE_EMAIL))
            {
                /* Si le mot de passe est le bon */
                if(password_verify($password, $data['password']))
                {
                   /* On créer la session et on redirige sur la page personnel */
                    $_SESSION['user'] = $data['token'];
                    header('Location: Oni_Page_perso_utilisateur.php');
                    die();
                }else{ header('Location: Oni_connexion.php?login_err=password'); die(); }
            }else{ header('Location: Oni_connexion.php?login_err=email'); die(); }
        }else{ header('Location: Oni_connexion.php?login_err=already'); die(); }
    }else{ header('Location: Oni_connexion.php'); die();} /*Si il n'a pas remplie le formulaire on le laisse sur la page de connexion*/