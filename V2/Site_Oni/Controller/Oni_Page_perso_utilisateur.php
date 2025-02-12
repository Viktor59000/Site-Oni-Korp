<?php 
    session_start();
    require_once 'Oni_config.php'; /*On lie la page a la BDD*/
    /*si la session existe pas soit si l'on est pas connecté on redirige*/
    if(!isset($_SESSION['user'])){
        header('Location:Oni_connexion.php');
        die();
    }

    /*On récupere les données de l'utilisateur*/
    $req = $bdd->prepare('SELECT * FROM utilisateurs WHERE token = ?');
    $req->execute(array($_SESSION['user']));
    $data = $req->fetch();
   
?>

<head>
    <!doctype html>
    <html lang="fr">


    <title>Espace membre | Oni korp</title>
    <link rel="icon" href="../Assets/emoji_site_oni.png">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="../CSS/Oni_Navigation.css">
    <link rel="stylesheet" href="../CSS/Oni_Page_perso_utilisateur.css">
    <link rel="stylesheet" href="../CSS/Oni_Navigation.css">
</head>
<body> 

<header>
<?php include 'Oni_Barre_de_navigation.php'; ?>
</header>


    <main>
        </div>

        <div class="Présentation_general">
            <img src="../Assets/banniere.png" class="Banniere">
            <!--On crée une classe pour la bannière-->
            <img src="../Assets/Oni_Fan.png" alt="Photo profil" class="Photo_Profile">
            <button type="menu" class="edit_profile">Personnaliser votre profil</button>
            <p class="Bienvenue">Bienvenue chez Oni Korp</p>
            <p class="Pseudo"><?php echo $data['pseudo']; ?> !</p>

        </div>
        </div>
        <div class="Information_compte">
            <p>Information de votre compte :</p>
            <p class="P2">Ces informations vous sont personnelle.<br>Par conséquent la Oni korp a pour objectif de
                garantir la sécurité de ses informations.</p>

            <p class="P3">Votre email :</p>
            <input type="email" placeholder="<?php echo $data['email']; ?>" class="PL4">
            <!--Sert a afficher les donnée.-->

            <p class="P3">Votre pseudo :</p>
            <input type="email" placeholder="<?php echo $data['pseudo']; ?>" class="PL4">

            <p class="P3">Votre mots de passe :</p>
            <input type="password" placeholder="******************" class="PL4">
        </div>
        
        <!--On n'a pas eu le temps de finir cette rubrique-->
        <!--Enfaite je comptais utiliser l'application google authentificator qui gènére un code toute les 30seconde et a la connexion l'utilisateur aurait du rentrer le code-->
        <div class="Sécurité_du_compte">
            <p>Sécurité de votre compte : (Fonction programmer pour une future Mise à jour)</p>
            <p class="P2">Cette rubrique répertorie des solution pour protéger votre compte.</p>
            <p class="P3">Authentification à deux facteur :</p>
            <input type="email" placeholder="<?php echo $data['email']; ?>" class="PL4">
            <p class="P2">Protège votre compte en vous envoyant un mail de confirmation <br> a chaque nouvelle
                connexion
            </p>
        </div>


        <!--On n'a pas eu le temps de finir cette rubrique-->
        <div class="Communication">
            <p>Communiquer de la Oni korp : (Fonction programmer pour une future Mise à jour)</p>
            <p class="P2">Cette rubrique repertorie l'activation de la newsletter de la Oni Korp.</p>
            <p class="P3">Newsletter :</p>
            <input type="email" placeholder="<?php echo $data['email']; ?>" class="PL4">
            <button type="submit" class="News_button">Activez</button>
            <p class="P2">Recevez nos news en vous abonnant à notre newsletter mensuel</p>

        </div>




        </div>
    </main>

</body>