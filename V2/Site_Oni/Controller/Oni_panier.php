<?php

@include 'config_shop.php'; // on include le fichier config.php
if(isset($_POST['update_update_btn'])){ // si on a cliqué sur le bouton modifier
   $update_value = $_POST['update_quantity']; // on récupère la quantité à modifier
   $update_id = $_POST['update_quantity_id']; // on récupère l'id du produit à modifier
   $update_quantity_query = mysqli_query($conn, "UPDATE `cart` SET quantity = '$update_value' WHERE id = '$update_id'"); // on met à jour les données dans la base de données
   if($update_quantity_query){ // si la requête s'est bien passée
      header('location:Oni_panier.php'); // on redirige vers la page panier
   };
};

if(isset($_GET['remove'])){ // si on a cliqué sur le bouton supprimer
   $remove_id = $_GET['remove']; // on récupère l'id du produit à supprimer
   mysqli_query($conn, "DELETE FROM `cart` WHERE id = '$remove_id'"); // on supprime le produit de la base de données
   header('location:Oni_panier.php'); // on redirige vers la page panier
};

if(isset($_GET['delete_all'])){ // si on a cliqué sur le bouton supprimer tout
   mysqli_query($conn, "DELETE FROM `cart`"); // on supprime tous les produits de la base de données
   header('location:Oni_panier.php'); // on redirige vers la page panier
}

?>

<!DOCTYPE html>
<html lang="fr">
<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- pour internet explorer -->
   <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
   <title>Votre panier | Oni korp</title>
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
   <link rel="stylesheet" href="../CSS/style.css"> 
   <link rel="stylesheet" href="../CSS/Oni_Navigation.css">
</head>
<body> 

<header>
<?php include 'Oni_Barre_de_navigation.php'; ?>
</header>

<?php include 'header.php'; ?> <!-- on include le header -->

<div class="container">

<section class="shopping-cart">

   <h1 class="heading">Votre Panier</h1>

   <table> <!-- tableau de panier -->

      <thead> <!-- on met le titre de la table -->
         <th>image</th>
         <th>nom</th>
         <th>prix</th>
         <th>quantité</th>
         <th>Prix total</th>
         <th>action</th>
      </thead>

      <tbody>

         <?php 
         
         $select_cart = mysqli_query($conn, "SELECT * FROM `cart`");  // on selectionne tout les produits dans la base de données
         $grand_total = 0; // on initialise le total à 0
         if(mysqli_num_rows($select_cart) > 0){ // si on a des produits dans le panier
            while($fetch_cart = mysqli_fetch_assoc($select_cart)){ // on boucle sur les produits
         ?>

         <tr>
            <td><img src="uploaded_img/<?php echo $fetch_cart['image']; ?>" height="100" alt=""></td> <!-- on met l'image du produit -->
            <td><?php echo $fetch_cart['name']; ?></td> <!-- on met le nom du produit -->
            <td><?php echo number_format($fetch_cart['price']); ?>€</td> <!-- on met le prix du produit -->
            <td>
               <form action="" method="post"> <!-- on met un formulaire pour modifier la quantité -->
                  <input type="hidden" name="update_quantity_id"  value="<?php echo $fetch_cart['id']; ?>" > <!-- on met l'id du produit -->
                  <input type="number" name="update_quantity" min="1"  value="<?php echo $fetch_cart['quantity']; ?>" > <!-- on met la quantité du produit -->
                  <input type="submit" value="Rafraichir" name="update_update_btn"> <!-- on met le bouton modifier -->
               </form>   
            </td>
            <td><?php echo $sub_total = number_format($fetch_cart['price'] * $fetch_cart['quantity']); ?>€</td> <!-- on met le prix total du produit -->
            <td><a href="Oni_panier.php?remove=<?php echo $fetch_cart['id']; ?>" onclick="return confirm('Voulez vous retirer cette article de votre panier?')" class="delete-btn"> <i class="fas fa-trash"></i> supprimer</a></td> <!-- on met le bouton supprimer -->
         </tr>
         <?php
           $grand_total += $sub_total;   // on ajoute le prix total à la variable grand_total
            };
         };
         ?>
         <tr class="table-bottom"> <!-- on met le prix total -->
            <td><a href="products.php" class="option-btn" style="margin-top: 0;">Retourner a la boutique </a></td> <!-- on met le bouton retourner à la boutique -->
            <td colspan="3">Prix total</td> <!-- on met le titre du prix total -->
            <td><?php echo $grand_total; ?>€</td> <!-- on met le prix total -->
            <td><a href="Oni_panier.php?delete_all" onclick="return confirm('êtes vous sûr de vous ?');" class="delete-btn"> <i class="fas fa-trash"></i> Supprimer tout </a></td> <!-- on met le bouton supprimer tout -->
         </tr>

      </tbody>

   </table>

   <div class="checkout-btn"> <!-- on met le bouton payer -->
      <a href="checkout.php" class="btn <?= ($grand_total > 1)?'':'disabled'; ?>">Passer votre commande</a> <!-- on met le bouton payer -->
   </div>

</section>

</div>
   
<script src="../js/script.js"></script>

</body>
</html>