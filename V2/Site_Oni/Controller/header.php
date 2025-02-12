<header class="header"> <!-- on affiche le header -->

   <div class="flex"> <!-- on affiche le header -->

      <a href="#" class="logo">Oni shop</a>

      <nav class="navbar">
         <a href="admin.php">Ajouté produit</a> <!-- on affiche le lien vers la page d'ajout de produit -->
         <a href="products.php">Voir les produit</a> <!-- on affiche le lien vers la page de vue des produits -->
      </nav>

    <?php
      
      $select_rows = mysqli_query($conn, "SELECT * FROM `cart`") or die('query failed'); // on selectionne tout les produits dans la base de données
      $row_count = mysqli_num_rows($select_rows); // on récupère le nombre de produits

      ?>

      <a href="Oni_panier.php" class="cart">panier <span><?php echo $row_count; ?></span> </a> <!-- on affiche le nombre de produits dans le panier -->

      <div id="menu-btn" class="fas fa-bars"></div>

   </div>

</header>