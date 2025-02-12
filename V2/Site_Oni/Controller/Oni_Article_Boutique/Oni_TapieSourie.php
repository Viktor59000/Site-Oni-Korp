<!--Ici on va crée la page pour le Maillot de la Oni-->

<head>
    <!doctype html>
    <html lang="fr">


    <title>Sweat | Oni korp</title>
    <link rel="icon" href="../../Assets/emoji_oni.png">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="../../CSS/Oni_Navigation.css">
    <link rel="stylesheet" href="../../CSS/Oni_Article.css">
</head>
<div>
    <nav>
      <ul>
        <a href="../index.html"><img src="../../Assets/emoji_oni.png" class="bouton_oni"></a></li>  
      <li class="menu-deroulant">
        <a href="#">Nos Réseaux</a><!--ici on mets tout nos réseaux-->
        <ul class="sous-menu">
        <li><a href="https://twitter.com/OniKorpPro">Twitter</a></li>
          <li><a href="https://www.twitch.tv/oni_korp">Twitch</a></li>
          <li><a href="https://youtube.com/channel/UCbjfbZaMnTJBZkIXrjQGsNQ">Youtube</a></li>
        <li><a href="https://www.tiktok.com/@onikorp.officiel?lang=fr">TikTok</a></li>
        </ul>
        </li>
        <li class="menu-deroulant">
        <a href="#">Oni Korp</a>  <!--ici on place des lien vers d'autre page de la oni-->
        <ul class="sous-menu">
           <li><a href="../Pages/Oni_qui_sommes_nous.html">Qui sommes nous ?</a></li>
           <li><a href="../Pages/Oni_effectif.html">Effectif</a></li>
            <li><a href="../Pages/Oni_partenaires.html">Partenaires</a></li>
          <li><a href="../Pages/Oni_recrutement.html">Recrutement</a></li>
        </ul>
        </li>
        <li><a href="../Pages/Oni_boutique.html" class="boutique">Boutique</a></li>
        <li class="menu-deroulant">
        <a href="#">Votre compte</a><!--ici on mets tout nos réseaux-->
        <ul class="sous-menu">
        <li><a href="../Controller/Oni_connexion.php">Se connecter</a></li> <!--A rajouter-->
        <li><a href="../Controller/Oni_inscription.php">S'inscrire</a></li>
        <li><a href="../Controller/Oni_page_perso.php">Page personnelle</a></li> <!--A rajouter-->
        <li><a href="../Controller/Oni_deconnexion.php">Se déconnecter</a></li>

        </ul>
      </ul>
      </nav>
  </div>

  <main> <!--ici on mettent tout ce qui est relatif au produit-->
    <div class="Article_global">
        <div class="Article_titre">
            <h1>Ex de troisième article</h1>
        </div>
        <div class="Article_image">
            <img src="../../Assets/red youtube.png" alt="masque">
        </div>
        <div class="Article_taille">
            <p>Tailles</p>
            <div class="Article_taille_choix">
                <form action="../Oni_Article_traitement.php" method="post">
                    <input type="radio" name="taille" value="3-U">Unique<br>
                    <input type="submit" value="Ajouter au panier">
                </form>
            </div>
        </div>
        <div class="Article_delivrance">
            <p>Information de livraison</p>
            <div class="Article_delivrance_choix">
                <p>Livraison en 7 jours <br> Livraison gratuite a partir de 50€ d'achats</p>
            </div>
            <div class="Article_description">
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti veritatis odit deserunt, perspiciatis sapiente deleniti exercitationem! Rem numquam voluptate atque? Totam quas ipsa officiis cum! Fugit asperiores rerum reiciendis aperiam.</p>
        </div>
        </div>
    </div>
</main>

