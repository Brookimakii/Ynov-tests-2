Lien du repo: https://github.com/Brookimakii/Ynov-tests


J'ai commencer par écrire la logique de RegistrationForm.jsx. Toute la logique du formatage. J'ai ensuite écrit les tests afin de vérifier si cela marchait bien.

J'ai ensuite écrit les tests de la validation pensant à tous les cas pouvant arrivé.
J'ai décider d'ignorer les cas n'étant pas possible (comme tester l’existence des champs dans personne étant donnée que l'objet personne est créer avec les les champs nécessaire). Et ce par contrainte de temps

J'ai ensuite modifier mon code afin que les tests fonctionne comme le bouton valider qui n'était pas désactivé dès le départ. Puis le formulaire acceptait les champs vide créant un objet vide dans le local storage.

Tableau des TI:

| Fonctionnalité           | Cas testé                         | Description                                                                                                      |
| ------------------------ | --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Affichage des erreurs    | Saisie invalide                   | Les messages d’erreur apparaissent en **rouge** sous chaque champ incorrect                                      |
| Disparition des erreurs  | Correction champ invalide         | L’erreur disparaît dès que le champ devient valide                                                               |
| Bouton de soumission     | Formulaire invalide               | Bouton désactivé (`disabled`)                                                                                    |
|                          | Formulaire valide                 | Bouton activé                                                                                                    |
| Soumission du formulaire | Formulaire valide                 | Sauvegarde de l’objet `person` dans **localStorage**, message de succès en **vert**, réinitialisation des champs |
| Tentative de soumission  | Formulaire invalide               | Le bouton étant désactivé, aucun enregistrement ne doit se faire                                                 |
| Couleur des messages     | Erreur / succès                   | Vérifier que les erreurs sont en **rouge** et le toast de succès en **vert**                                     |
| Persistances             | LocalStorage                      | Vérifier que `localStorage` est vidé avant chaque test et rempli correctement après soumission                   |
| Comportement chaotique   | Saisie incorrecte puis correction | Vérifie la **réactivité dynamique des erreurs** et du bouton                                                     |
