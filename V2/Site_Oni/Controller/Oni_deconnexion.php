<?php   
    session_start();  /*On démarre la session*/
    session_destroy();  /*On détruit la session*/
    header('Location:Oni_connexion.php');  /*On redirige vers la page de connexion*/
    die(); /*On arrête le script*/