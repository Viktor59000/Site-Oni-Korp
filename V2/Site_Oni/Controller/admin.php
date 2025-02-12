<?php

@include 'config_shop.php'; // on inclue le fichier de config de la base de données

if(isset($_POST['add_product'])){  // si on a cliqué sur le bouton ajouter un produit
   $p_name = $_POST['p_name'];  // on récupère le nom du produit
   $p_price = $_POST['p_price'];  // on récupère le prix du produit
   $p_image = $_FILES['p_image']['name'];  // on récupère le nom de l'image
   $p_image_tmp_name = $_FILES['p_image']['tmp_name']; // on récupère le nom temporaire de l'image
   $p_image_folder = 'uploaded_img/'.$p_image;  // on récupère le chemin de l'image

   $insert_query = mysqli_query($conn, "INSERT INTO `products`(name, price, image) VALUES('$p_name', '$p_price', '$p_image')") or die('query failed'); // on insère les données dans la base de données

   if($insert_query){ // si la requête s'est bien passée
      move_uploaded_file($p_image_tmp_name, $p_image_folder); // on déplace l'image dans le dossier uploaded_img
      $message[] = 'Prdouit ajouté avec succès !'; // on affiche un message de succès
   }else{ // sinon
      $message[] = 'Erreur lors de l\'ajout du produit !'; // on affiche un message d'erreur
   }
};
 
if(isset($_GET['delete'])){ // si on a cliqué sur le bouton supprimer
   $delete_id = $_GET['delete']; // on récupère l'id du produit à supprimer
   $delete_query = mysqli_query($conn, "DELETE FROM `products` WHERE id = $delete_id ") or die('query failed'); // on supprime le produit de la base de données
   if($delete_query){ // si la requête s'est bien passée
      header('o:admin.php'); // on redirige vers la page admin.php
      $message[] = 'Produit supprimé avec succès !'; // on affiche un message de succès
   }else{ // sinon 
      header('location:admin.php'); // on redirige vers la page admin.php
      $message[] = 'Erreur lors de la suppression du produit !'; // on affiche un message d'erreur
   };
};

if(isset($_POST['update_product'])){ // si on a cliqué sur le bouton modifier
   $update_p_id = $_POST['update_p_id']; // on récupère l'id du produit à modifier
   $update_p_name = $_POST['update_p_name']; // on récupère le nom du produit à modifier
   $update_p_price = $_POST['update_p_price']; // on récupère le prix du produit à modifier
   $update_p_image = $_FILES['update_p_image']['name']; // on récupère le nom de l'image à modifier
   $update_p_image_tmp_name = $_FILES['update_p_image']['tmp_name']; // on récupère le nom temporaire de l'image à modifier
   $update_p_image_folder = 'uploaded_img/'.$update_p_image; // on récupère le chemin de l'image à modifier

   $update_query = mysqli_query($conn, "UPDATE `products` SET name = '$update_p_name', price = '$update_p_price', image = '$update_p_image' WHERE id = '$update_p_id'"); // on met à jour les données dans la base de données

   if($update_query){ // si la requête s'est bien passée
      move_uploaded_file($update_p_image_tmp_name, $update_p_image_folder);  // on déplace l'image dans le dossier uploaded_img
      $message[] = 'Produit modifié avec succès !'; // on affiche un message de succès
      header('location:admin.php'); // on redirige vers la page admin.php
   }else{ // sinon
      $message[] = 'Erreur lors de la modification du produit !'; // on affiche un message d'erreur
      header('location:admin.php'); // on redirige vers la page admin.php
   }

}

?>

<!DOCTYPE html> <!-- on déclare le doctype -->
<html lang="fr"> <!-- on déclare la langue -->
<head> 
   <meta charset="UTF-8"> 
   <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- on déclare la compatibilité avec les navigateurs -->
   <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
   <title>Page Staff | Oni</title> 
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"> 
   <link rel="stylesheet" href="../CSS/style.css"> 
   <link rel="stylesheet" href="../CSS/Oni_Navigation.css">
<body> 

<header>
<?php include 'Oni_Barre_de_navigation.php'; ?>
</header>
<?php 

if(isset($message)){ // si on a un message
   foreach($message as $message){ // on affiche le message
      echo '<div class="message"><span>'.$message.'</span> <i class="fas fa-times" onclick="this.parentElement.style.display = `none`;"></i> </div>'; 
   }; 
}; 

?> 

<?php include 'header.php'; ?> 

<div class="container"> 

<section>
<!--Formulaire pour ajouté un produit-->
<form action="" method="post" class="add-product-form" enctype="multipart/form-data"> <!-- on déclare le formulaire -->
   <h3>Ajouter un produit : </h3>
   <input type="text" name="p_name" placeholder="Nom du produit" class="box" required> <!-- on déclare le nom du produit -->
   <input type="number" name="p_price" min="0" placeholder="Prix du produit" class="box" required> <!-- on déclare le prix du produit --> 
   <input type="file" name="p_image" accept="image/png, image/jpg, image/jpeg" class="box" required> <!-- on déclare l'image du produit -->
   <input type="submit" value="Ajouté le produit" name="add_product" class="btn"> <!-- on déclare le bouton d'ajout du produit -->
</form>

</section>

<section class="display-product-table">

   <table>
      <!--Un tableau-->
      <thead>
         <th>Image du produit</th>
         <th>Nom du produit</th>
         <th>Prix du produit</th>
         <th>action</th>
      </thead>

      <tbody>
         <?php
         
            $select_products = mysqli_query($conn, "SELECT * FROM `products`");  // on sélectionne tous les produits de la base de données
            if(mysqli_num_rows($select_products) > 0){ // si il y a des produits
               while($row = mysqli_fetch_assoc($select_products)){ // on affiche les produits
         ?>

         <tr> <!-- on déclare une ligne -->
            <td><img src="uploaded_img/<?php echo $row['image']; ?>" height="100" alt=""></td> <!-- on affiche l'image du produit -->
            <td><?php echo $row['name']; ?></td> <!-- on affiche le nom du produit -->
            <td>$<?php echo $row['price']; ?>/-</td> <!-- on affiche le prix du produit -->
            <td>
               <a href="admin.php?delete=<?php echo $row['id']; ?>" class="delete-btn" onclick="return confirm('Vous êtes sûr de vouloir le supprimer ?');"> <i class="fas fa-trash"></i> Supprimer </a> <!-- on affiche le bouton de suppression du produit -->
               <a href="admin.php?edit=<?php echo $row['id']; ?>" class="option-btn"> <i class="fas fa-edit"></i> modifiée </a> <!-- on affiche le bouton de modification du produit -->
            </td>
         </tr>

         <?php
            };    
            }else{ 
               echo "<div class='empty'>Aucun produit ajouté</div>"; 
            };
         ?>
      </tbody>
   </table>

</section>

<section class="edit-form-container">

   <?php
   
   if(isset($_GET['edit'])){ // si on a cliqué sur le bouton de modification
      $edit_id = $_GET['edit']; // on récupère l'id du produit à modifier
      $edit_query = mysqli_query($conn, "SELECT * FROM `products` WHERE id = $edit_id"); // on sélectionne le produit à modifier
      if(mysqli_num_rows($edit_query) > 0){ // si le produit existe
         while($fetch_edit = mysqli_fetch_assoc($edit_query)){ // on affiche le produit à modifier
   ?>

   <form action="" method="post" enctype="multipart/form-data"> <!-- on déclare le formulaire -->
      <img src="uploaded_img/<?php echo $fetch_edit['image']; ?>" height="200" alt=""> <!-- on affiche l'image du produit à modifier -->
      <input type="hidden" name="update_p_id" value="<?php echo $fetch_edit['id']; ?>"> <!-- on cache l'id du produit à modifier -->
      <input type="text" class="box" required name="update_p_name" value="<?php echo $fetch_edit['name']; ?>"> <!-- on affiche le nom du produit à modifier -->
      <input type="number" min="0" class="box" required name="update_p_price" value="<?php echo $fetch_edit['price']; ?>"> <!-- on affiche le prix du produit à modifier -->
      <input type="file" class="box" required name="update_p_image" accept="image/png, image/jpg, image/jpeg"> <!-- on affiche l'image du produit à modifier -->
      <input type="submit" value="Mettre a jour votre produit" name="update_product" class="btn"> <!-- on affiche le bouton de modification du produit -->
      <input type="reset" value="Annuler" id="close-edit" class="option-btn"> <!-- on affiche le bouton de fermeture du formulaire -->
   </form>

   <?php
            };
         };
         echo "<script>document.querySelector('.edit-form-container').style.display = 'flex';</script>"; // on affiche le formulaire
      };
   ?>

</section>

</div>















<script src="../js/script.js"></script>

</body>
</html>