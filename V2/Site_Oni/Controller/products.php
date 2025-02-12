<?php

@include 'config_shop.php'; // on inclue le fichier de config de la base de données

if(isset($_POST['add_to_cart'])){ // si on a cliqué sur le bouton ajouter au panier

   $product_name = $_POST['product_name']; // on récupère le nom du produit
   $product_price = $_POST['product_price']; // on récupère le prix du produit
   $product_image = $_POST['product_image']; // on récupère l'image du produit
   $product_quantity = 1; // on récupère la quantité du produit

   $select_cart = mysqli_query($conn, "SELECT * FROM `cart` WHERE name = '$product_name'"); // on selectionne tout les produits dans la base de données

   if(mysqli_num_rows($select_cart) > 0){ // si le produit existe déjà dans le panier
      $message[] = 'Le produit est déjà dans votre panier !'; // on affiche un message
   }else{ // sinon
      $insert_product = mysqli_query($conn, "INSERT INTO `cart`(name, price, image, quantity) VALUES('$product_name', '$product_price', '$product_image', '$product_quantity')"); // on ajoute le produit dans la base de données
      $message[] = 'Produit ajouté au panier'; // on affiche un message
   }

}

?>

<!DOCTYPE html>
<html lang="fr">
<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
   <meta name="viewport" content="width=device-width, initial-scale=1.0">  
   <title>Boutique | Oni korp </title>
   <link rel="icon" href="../Assets/emoji_oni.png">
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
   <link rel="stylesheet" href="../CSS/style.css"> 
   <link rel="stylesheet" href="../CSS/Oni_Navigation.css">
</head>
<body>
   <header>
   <?php include 'Oni_Barre_de_navigation.php'; ?>
   </header>
   
<?php

if(isset($message)){ // si on a un message
   foreach($message as $message){ // on affiche le message
      echo '<div class="message"><span>'.$message.'</span> <i class="fas fa-times" onclick="this.parentElement.style.display = `none`;"></i> </div>'; // on affiche le message
   };
};

?>

<?php include 'header.php'; ?> <!-- on inclue le header -->

<div class="container"> 

<section class="products">

   <h1 class="heading"> Nos Dernier produits :</h1> <!-- on affiche le titre -->

   <div class="box-container">

      <?php
      
      $select_products = mysqli_query($conn, "SELECT * FROM `products`"); // on selectionne tout les produits dans la base de données
      if(mysqli_num_rows($select_products) > 0){ // si il y a des produits
         while($fetch_product = mysqli_fetch_assoc($select_products)){ // on affiche les produits
      ?>

      <form action="" method="post"> <!-- on affiche le formulaire -->
         <div class="box"> <!-- on affiche le box -->
            <img src="uploaded_img/<?php echo $fetch_product['image']; ?>" alt=""> <!-- on affiche l'image -->
            <h3><?php echo $fetch_product['name']; ?></h3> <!-- on affiche le nom -->
            <div class="price"><?php echo $fetch_product['price']; ?>€</div> <!-- on affiche le prix -->
            <input type="hidden" name="product_name" value="<?php echo $fetch_product['name']; ?>"> <!-- on cache le nom du produit -->
            <input type="hidden" name="product_price" value="<?php echo $fetch_product['price']; ?>"> <!-- on cache le prix du produit -->
            <input type="hidden" name="product_image" value="<?php echo $fetch_product['image']; ?>"> <!-- on cache l'image du produit -->
            <input type="submit" class="btn" value="Ajouté au panier" name="add_to_cart"> <!-- on affiche le bouton ajouter au panier -->
         </div>
      </form>

      <?php
         };
      };
      ?>

   </div>

</section>

</div>

<script src="../js/script.js"></script>

</body>
</html>