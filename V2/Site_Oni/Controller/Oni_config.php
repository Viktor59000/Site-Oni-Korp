<?php /*On applique la balise php*/
        
    try  /*On essaye de faire ce qui est entre les accolades*/
    {
        $bdd = new PDO("mysql:host=localhost;dbname=oni_korp;charset=utf8", "root", "root"); /*On se connecte a la base de donnée*/
    }
    catch(PDOException $e) /*Si il y a une erreur*/
    {
        die('Erreur : '.$e->getMessage()); /*On affiche l'erreur*/
    }