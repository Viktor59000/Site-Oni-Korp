<?php

@include 'config_shop.php'; // on inclue le fichier de config de la base de données

if(isset($_POST['order_btn'])){ // si on a cliqué sur le bouton commander

   $name = $_POST['name']; // on récupère le nom de l'utilisateur
   $number = $_POST['number']; // on récupère le numéro de téléphone de l'utilisateur
   $email = $_POST['email']; // on récupère l'email de l'utilisateur
   $method = $_POST['method']; // on récupère le mode de paiement de l'utilisateur
   $flat = $_POST['flat']; // on récupère le numéro de la maison de l'utilisateur
   $street = $_POST['street']; // on récupère le nom de la rue de l'utilisateur
   $city = $_POST['city'];     // on récupère le nom de la ville de l'utilisateur
   $state = $_POST['state'];  // on récupère le nom de la région de l'utilisateur
   $country = $_POST['country']; // on récupère le nom du pays de l'utilisateur
   $pin_code = $_POST['pin_code'];  // on récupère le code postal de l'utilisateur

   $cart_query = mysqli_query($conn, "SELECT * FROM `cart`");
   $price_total = 0;
   if(mysqli_num_rows($cart_query) > 0){
      while($product_item = mysqli_fetch_assoc($cart_query)){
         $product_name[] = $product_item['name'] .' ('. $product_item['quantity'] .') ';
         $product_price = number_format($product_item['price'] * $product_item['quantity']);
         $price_total += $product_price;
      };
   };

   $total_product = implode(', ',$product_name);
   $detail_query = mysqli_query($conn, "INSERT INTO `order`(name, number, email, method, flat, street, city, state, country, pin_code, total_products, total_price) VALUES('$name','$number','$email','$method','$flat','$street','$city','$state','$country','$pin_code','$total_product','$price_total')") or die('query failed');

   if($cart_query && $detail_query){ // si les requêtes sont effectuées
      echo "
      <div class='order-message-container'>
      <div class='message-container'>
         <h3>Merci pour votre achats chez Oni korp !</h3>
         <div class='order-detail'>
            <span>".$total_product."</span>
            <span class='total'> prix total :".$price_total."€  </span>
         </div>
         <div class='customer-details'>
            <p> Votre nom : <span>".$name."</span> </p>
            <p> Votre email : <span>".$email."</span> </p>
            <p> Votre addresse : <span>".$flat.", ".$street.", ".$city.", ".$state.", ".$country." - ".$pin_code."</span> </p>
            <p> Votre mode de paiement : <span>".$method."</span> </p>
            <p>(*Votre produit arrive chez vous dès que possible*)</p>
         </div>
            <a href='products.php' class='btn'>continuer sur Oni korp</a>
         </div>
      </div>
      ";
   }

}

?>

<!DOCTYPE html>
<html lang="fr">
<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
   <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
   <title>Paiement | Oni korp</title>
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
   <link rel="stylesheet" href="../CSS/style.css">
   <link rel="stylesheet" href="../CSS/Oni_Navigation.css">
</head>
<body> 

<header>
<?php include 'Oni_Barre_de_navigation.php'; ?>
</header>


<?php include 'header.php'; ?> <!-- on inclue le fichier header.php -->

<div class="container"> 

<section class="checkout-form">

   <h1 class="heading">Completer votre paiement :</h1> <!-- on affiche le titre de la page -->

   <form action="" method="post">

   <div class="display-order">
      <?php
         $select_cart = mysqli_query($conn, "SELECT * FROM `cart`"); // on selectionne tout les produits dans la base de données
         $total = 0; // on initialise le prix total
         $grand_total = 0;  // on initialise le prix total
         if(mysqli_num_rows($select_cart) > 0){ // si il y a des produits
            while($fetch_cart = mysqli_fetch_assoc($select_cart)){ // on affiche les produits
            $total_price = number_format($fetch_cart['price'] * $fetch_cart['quantity']); // on récupère le prix du produit
            $grand_total = $total += $total_price; // on ajoute le prix au prix total
      ?>
      <span><?= $fetch_cart['name']; ?>(<?= $fetch_cart['quantity']; ?>)</span> 
      <?php
         }
      }else{
         echo "<div class='display-order'><span>Votre panier est vide</span></div>";
      }
      ?>
      <span class="grand-total"> Prix total : <?= $grand_total; ?>€ </span> <!-- on affiche le prix total -->
   </div> 

      <div class="flex">
         <div class="inputBox">
            <span>Votre nom</span>
            <input type="text" placeholder="entrer votre nom" name="name" required>
         </div>
         <div class="inputBox">
            <span>Votre numéro de téléphone</span>
            <input type="number" placeholder="eentrer votre numéro de téléphone" name="number" required>
         </div>
         <div class="inputBox">
            <span>Votre adresse mail</span>
            <input type="email" placeholder="entrer votre adresse mail" name="email" required>
         </div>
         <div class="inputBox">
            <span>Quelle est votre méthode de paiement ?</span>
            <select name="method">
               <option value="credit cart">Carte de crédit</option>
               <option value="paypal">Paypal</option>
            </select>
         </div>
         <div class="inputBox">
            <span>Votre adresse</span>
            <input type="text" placeholder="entrer votre adresse " name="flat" required>
         </div>
         <div class="inputBox">
            <span>Adresse complémentaire</span>
            <input type="text" placeholder="entrer votre adresse complémentaire" name="street" required>
         </div>
         <div class="inputBox">
            <span>Votre ville</span>
            <input type="text" placeholder="entrer le nom de votre ville/Village" name="city" required>
         </div>
         <div class="inputBox">
            <span>Votre région</span>
            <input type="text" placeholder="Entrer le nom de votre region" name="state" required>
         </div>
         <div class="inputBox">
            <span>Pays</span>
            <input type="text" placeholder="Entrer le nom de votre pays" name="country" required>
         </div>
         <div class="inputBox">
            <span>Entrer votre code pin</span>
            <h3>Si vous n'avez pas de code pin pour votre résidence entrer 0</h3>
            <input type="text" placeholder="123456" name="pin_code" required>
         </div>
      </div>
      <input type="submit" value="Finaliser votre commande" name="order_btn" class="btn">
   </form>

</section>

</div>

<script src="../js/script.js"></script>
   
</body>
<note>
   <!--Petite note pour vous Monsieur : Nous n'avons pas de vrai système de paiement donc on s'occupe juste faire faire un récap
et de rediriger l'utilisateur vers une page de notre site ! c'ést assez difficile a faire et je sais pas jusqu'ou on doit allez pour ce projet-->
</note>
</html>
