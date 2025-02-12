<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/magnific-popup.min.css"
        rel="stylesheet" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <link rel="stylesheet" href="../CSS/Oni_connexion.css">
    <title>Connexion | Oni Korp</title>
    <link rel="icon" href="Assets/emoji_site_oni.png">
    <link rel="stylesheet" href="../CSS/Oni_Navigation.css">
</head>
<body class="body_CO"> 


    <div class="login-form"> <!-- Début du formulaire de connexion -->
        <?php  /*Si il y a une erreur*/
                if(isset($_GET['login_err'])) /*Si il y a une erreur*/
                { /*Si il y a une erreur*/
                    $err = htmlspecialchars($_GET['login_err']); /*On récupère le type d'erreur*/

                    switch($err) 
                    { /*On regarde le type d'erreur*/
                        case 'password': /*Si le mot de passe est incorrect*/
                        ?> 
        <div class="alert alert-danger">
            <strong>Erreur</strong> mot de passe incorrect
        </div>  
        <?php
                        break; /*On sort de la condition*/

                        case 'email': /*Si le mail est incorrect*/
                        ?>
        <div class="alert alert-danger"> <!-- On affiche une erreur -->
            <strong>Erreur</strong> email incorrect
        </div> <!-- On affiche une erreur -->
        <?php
                        break; /*On sort de la condition*/

                        case 'already': /*Si l'utilisateur est déjà inscrit*/
                        ?> <!-- On affiche une erreur -->
        <div class="alert alert-danger">  <!-- On affiche une erreur -->
            <strong>Erreur</strong> compte non existant
        </div> <!-- On affiche une erreur -->
        <?php /*On sort de la condition*/
                        break; /*On sort de la condition*/
                    }
                }
                ?>
        <!--Formulaire de connexion-->
        <form action="Oni_connexion_traitement.php" method="post"> <!-- On lance le formulaire de connexion -->
            <h2 class="text-center">Connexion</h2> <!-- Titre du formulaire -->
            <div class="form-group"> <!-- On crée un champ de texte -->
                <input type="email" name="email" class="form-control" placeholder="Email" required="required"
                    autocomplete="off"> <!-- On met le champ de texte -->
            </div> <!-- On crée un champ de texte -->
            <div class="form-group"> <!-- On crée un champ de texte -->
                <input type="password" name="password" class="form-control" placeholder="Mot de passe"
                    required="required" autocomplete="off"> <!-- On met le champ de texte -->
            </div>
            <div class="form-group"> <!-- On crée un champ de texte -->
                <button type="submit" class="btn btn-primary btn-block">Connexion</button>
            </div> <!-- On crée un champ de texte -->
        </form> <!-- On lance le formulaire de connexion -->
        <p class="inscription">Je n'ai pas de <span>Compte</span>. Je m'en <span><a href="Oni_inscription.php">Crée
                    un</a></span>.</p> <!-- Lien vers la page d'inscription -->

    </div>
</body>

</html>