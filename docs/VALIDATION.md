# Verification de DevBoard - 1 novembre 2026

## Site de production

Essais realises sur https://ece-webtech-302.vercel.app, avec le compte de Kardiatou. Ils concernent la version de production, pas une preuve du deploiement des corrections de la branche.

| Controle | Resultat | Preuve / limite |
|---|---|---|
| Session connectee | Observee | Email et bouton Deconnexion visibles dans le menu |
| Creation d'article | Reussie | Article dedie Test Kardiatou visible dans la liste |
| Lecture et modification | Reussies | Nouveau titre visible sur la page de detail |
| Like et commentaire | Affiches | Compteur et commentaire visibles ; conservation et retrait du like confirmes par l'utilisatrice |
| Suppression de l'article de test | Reussie | Absent de la liste apres actualisation |
| Nettoyage dans Supabase | Aucune ligne visible restante | Requetes publiques pour l'article, ses commentaires et likes : HTTP 200 et listes vides. Ne remplace pas un controle administrateur des lignes masquees par RLS |
| Recherche Tailwind | Reussie | Article Tailwind CSS 4 retrouve |
| Filtre Backend | Reussi | Article de categorie Backend affiche |
| Recherche Tailwind + Backend | Reussie | Aucun article trouve, sans contenu de remplacement |
| Reinitialisation des filtres | Reussie | Retour a la liste complete |
| Contact : champs obligatoires | Verifies | Nom, email, objet et message obligatoires |
| Contact : email invalide | Verifie | Une adresse mal formee est signalee invalide par le navigateur |
| Contact : envoi et stockage | Non testes | Aucun message envoye pendant ces essais |
| Affichage mobile | Verifie a 390 x 844 | Articles et contact lisibles, sans debordement horizontal observe |
| Menu mobile | Verifie | Ouverture et fermeture apres navigation vers Contact et Articles |

## Branche de corrections

Proposition : https://github.com/ivanfocsa/ece-webtech-302/pull/1

- Dernieres evolutions du groupe integrees sans modifier main.
- Compilation de production reussie apres integration, avec configuration Supabase locale.
- Tests JavaScript : reponses Supabase simulees ; ils ne prouvent pas les permissions de la base distante.
- GitHub signale le deploiement Vercel de la branche comme reussi ; cela ne valide pas a lui seul tous les parcours utilisateurs.

## Encore necessaire

1. Avec deux comptes de test, verifier qu'un compte B ne peut ni modifier ni supprimer les articles du compte A, y compris par appel direct a l'API. Utiliser uniquement des donnees de test.
2. Faire appliquer la migration supabase/migrations/202610290001_contacts_privacy.sql par un responsable autorise. Elle conserve les messages et restreint leur lecture aux administrateurs declares dans app_metadata.
3. Executer supabase/tests/rls_test.sql dans le SQL Editor apres la migration. Deux comptes existants sont requis ; la transaction annule les donnees creees pour le test.
4. Verifier la liste des URL de retour autorisees dans Supabase pour la connexion locale.
5. Verifier l'envoi du formulaire Contact avec un message de test explicitement autorise et confirmer son stockage.
6. Relire puis valider la proposition GitHub avant fusion et verification du site deploye.

Aucune note d'auto-evaluation ne doit etre interpretee comme une preuve de validation de ces points restants.
