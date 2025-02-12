<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/magnific-popup.min.css"
        rel="stylesheet" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <link rel="stylesheet" href="../CSS/Oni_inscription.css">
    <!--On lie le fichier css a la page HTML-->
    <title>Inscription | Oni Korp</title>
    <link rel="stylesheet" href="../CSS/Oni_Navigation.css">
</head>
<body> 

    <div class="login-form">
        <?php 
                if(isset($_GET['reg_err']))
                {
                    $err = htmlspecialchars($_GET['reg_err']);

                    switch($err)
                    {
                        case 'success':
                        ?>
        <div class="alert alert-success">
            <strong>Succès</strong> inscription réussie !
        </div>
        <?php
                        break;

                        case 'password':
                        ?>
        <div class="alert alert-danger">
            <strong>Erreur</strong> mot de passe différent
        </div>
        <?php
                        break;

                        case 'email':
                        ?>
        <div class="alert alert-danger">
            <strong>Erreur</strong> email non valide
        </div>
        <?php
                        break;
                        
                        case 'email_length':
                        ?>
        <div class="alert alert-danger">
            <strong>Erreur</strong> email trop long
        </div>
        <?php 
                        break;

                        case 'pseudo_length':
                        ?>
        <div class="alert alert-danger">
            <strong>Erreur</strong> pseudo trop long
        </div>
        <?php 
                        case 'already':
                        ?>
        <div class="alert alert-danger">
            <strong>Erreur</strong> compte deja existant
        </div>
        <?php 

                    }
                }
                ?>
        <!--Formulaire d'inscription-->
        <form action="Oni_inscription_traitement.php" method="post">
            <h2 class="text-center">S'inscrire</h2>
            <div class="form-group">
                <input type="pseudo" name="pseudo" class="form-control" placeholder="Pseudo" required="required"
                    autocomplete="off">
            </div>
            <div class="form-group">
                <input type="email" name="email" class="form-control" placeholder="Email" required="required"
                    autocomplete="off">
            </div>
            <div class="form-group">
                <input type="password" name="password" class="form-control" placeholder="Mot de passe"
                    required="required" autocomplete="off">
            </div>
            <div class="form-group">
                <input type="password" name="password_retype" class="form-control"
                    placeholder="Re-tapez le mot de passe" required="required" autocomplete="off">
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-primary btn-block">Inscription</button>
                <p class="inscription">J'ai déjà crée un <span><a href="Oni_connexion.php">Compte</a></span>. Je
                    m'y <span><a href="Oni_connexion.php">Connecte</a></span></p>
            </div>
        </form>
    </div>
</body>

</html>