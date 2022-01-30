# Carnet de Voyage documentation
# Sommaire
1. [Les objectifs du projet](#objectifs)
2. [Diagramme Use Case](#diagusecase)
3. [Diagramme de classe de la base de données](#diagclasse)
4. [Documentation de l'API côté backend](#apiback)
    1. [Objets manipules](#objts)
    2. [Webs services](#webservices)
5. [Choix techniques](#choix)
    1. [API intégrée ](#api)
    2. [Gestion des rôles](#groles)
    3. [Parties manquantes](#manque)
6. [Architecture de l'application](#archi)
7. [Screencast](#screencast)
8. [Installation et tests](#test)


## Les objectifs du projet <a name="objectifs"></a>

Le projet est de créer une application de type carnet de voyage où un utilisateur peut planifier ses voyages et toutes les activités prévues lors de ce voyage. La gestion des voyages est collaborative : l'utilisateur peut partager un voyage avec d'autres utilisateurs pour qu'ils puissent eux aussi modifier le voyage ou seulement consulter les informations de ce voyage.

## Diagramme Use Case <a name="diagusecase"></a>

Tout d'abord un schéma des différents cas d'utilisations représentant toutes les actions possibles pour un utilisateur sur ses voyages ( quand il est l'owner) :  

![Alt text](documentation/usecase1.jpg?raw=true "Schéma use case 1 ")

Ensuite pour les voyages partagés, un utilisateur peut avoir le rôle de *READER* ou *WRITER*. Voici le diagramme des cas d'utilisations dans ces deux cas :  


![Alt text](documentation/usecase2.jpg?raw=true "Schéma use case 2")   

## Diagramme de classe de la base de données  <a name="diagclasse"></a>  

Ci-dessous le diagramme de classe de la base de données de notre application :  

![Alt text](documentation/diagramme_class.jpg?raw=true "Diagramme de classe de l'application")

## La documentation de l’API coté backend <a name="apiback"></a>  

Nous avons déployés notre backend sur Heroku pour que tous les utilisateurs aient accès à la même base de données et qu'elle soit cohérente. Lien Heroku : https://carnet-voyage.herokuapp.com .


### Objets manipulés :  <a name="objts"></a>

Voici les différents objets que nous sommes amenés à manipuler :  

* Une activité (*activity*) possède un identifiant unique attribué par le système (id), un nom (name), un type (type), un lieu (place), une date de début (start), une date de fin (end) et l'ID du voyage auquel il est rattaché (id_travel). En JSON, une activité est représentée par un objet :
```
{ 
    'id': <id>, 
    'name': <name>,
    'type': <type>, 
    'place': <place>,
    'start': <start>, 
    'end': <end>, 
    'id_travel' : <id_travel>
}

```

Si l’identifiant n’est pas connu (p.ex. lors de la création d’une nouvelle activité, et avant que le système lui attribue son numéro unique), on peut juste spécifier :
```
{ 
    'name': <name>,
    'type': <type>, 
    'place': <place>,
    'start': <start>, 
    'end': <end>, 
    'id_travel' : <id_travel> 
}

```

* Une liste d'activité (*activity*) est représentée par un tableau :  `[ activite1, activite2,..., activiten ] `.  

* Un voyage (*travel*) possède un identifiant unique attribué par le système (id), un titre (title), un lieu (place), une date de début (start), une date de fin (end) et un utilisateur à qui appartient le voyage (owner). Sa représentation en JSON est :
```
{ 
    'id': <id>, 
    'title': <title>, 
    'place': <place>,
    'start': <start>, 
    'end': <end>,
    'owner' : <'owner_email'>
}  

```
* Dans le cas d'un voyage partagé (*shared travel*), on rajoute les droits (right = READER ou WRITER) de l'utilisateur pour ce voyage. Sa représentation en JSON est :
```
{ 
    'id': <id>, 
    'title': <title>, 
    'place': <place>,
    'start': <start>, 
    'end': <end>,
    'owner' : <'owner_email'>,
    'right' : <right>
}  

```
* Une liste de voyages est un tableau : `[ travel1, travel2,...,traveln]`.  

* L'objet droit (*travel_rights*) possède un type de droit (*right*) qui doit être de type *READER* ou *WRITER* et l'identifiant d'un utilisateur (*user_to_share*). Sa représentation en JSON est :
```
{ 
    'right': <right>, 
    'user_email': <user_email>
}  

```
* L'objet donner_droit (*give_travel_rights*) possède un type de droit (*rights*) qui doit être de type *READER* ou *WRITER* et l'identifiant d'un utilisateur (*user_to_share*). Sa représentation en JSON est :
```
{ 
    'rights': <rights>, 
    'user_to_share': <user_email>
}  

```


* Un utilisateur (*user*) possède un identfiant qui est son email (email), un mot de passe (password), un nom de famille (lastname), un prénom (firstname) et une date de naissance (birthdate). Sa représentation en JSON est :
```
{ 
    'email': <email>, 
    'password': <password>, 
    'lastname': <lastname>,
    'firstname': <firstname>, 
    'birthdate': <birthdate>
}  

```

### Tableaux des webs services : <a name="webservices"></a>

| Path                                | GET             | POST               | PUT                | DELETE             |
| ------------------------------------|:------------------------:|:------------------:|:------------------:|:------------------:|
| /users/profile                      | Renvoie les informations d'un utilisateur (**CR200** ou **CR404** ) | **CR405** | **CR405**| **CR405** |
| /travels | Renvoie la liste des voyages dont l'utilisateur authentifié est le owner ( **CR200** )| Crée un nouveau voyage ( **CR201** ) |**CR405**|**CR405**|
| /travels/shared | Renvoie la liste des voyages partagés de l'utilisateur authentifié ( **CR200** ) |**CR405**|**CR405**|**CR405**|
| /travels/*id* | Renvoie les informations du voyage dont l'ID est *id* ( **CR200** ou **CR404** ) |**CR405** |Modifie les informations du voyage dont l'ID est *id* ( **CR201** ou **CR404** )|Supprime le voyage dont l'ID est *id*, si l'utilisateur en est le propriétaire ( **CR201** ou **CR403** )|
| /travels/*id*/shared               | Renvoie les informations du voyage partagé dont l'ID est *id* ( **CR200** ou **CR403** ) |**CR405** |Modifie les informations du voyage partagé dont l'ID est *id* ( **CR201** ou **CR403** )|**CR405**|
| /travels/*id*/share              | Renvoie la liste des droits accordés pour le voyage dont l'ID est *id* ( **CR200** ou **CR403** ) |Partage du voyage dont l'ID est *id* avec un utilisateur et des droits donnés (**CR201** ou **CR404** ou **CR403** ) |Modifie les droits d'accès d'un utilisateur pour le voyage dont l'ID est *id*  ( **CR201** ou **CR403** )| Supprime les droits d'accès d'un utilisateur pour le  voyage dont l'ID est *id*  ( **CR201** ou **CR403** )|
| /travels/*id*/activities  | Renvoie la liste des activités du voyage dont l'ID est *id* ( **CR200** ou **CR403** ) | Crée une nouvelle activité pour le voyage dont l'ID est *id*  ( **CR201** ou **CR403** )|**CR405** |**CR405** |
| /travels/*id*/activities/*id_act* | Renvoie les informations de l'activité d'ID : *id_act* du voyage dont l'ID est *id* ( **CR200** ou **CR404** ou **CR403** ) |**CR405**| Modifie l'activité d'ID : *id_act* du voyage dont l'ID est *id* ( **CR201** ou **CR404** ou **CR403** )| Supprime l'activité d'ID : *id_act* du voyage dont l'ID est *id* ( **CR201** ou **CR404** ou **CR403** ) |


## Les choix techniques faits <a name="choix"></a>

### API externe utilisée <a name="api"></a>


Nous avons choisi d'utiliser l'api du gouvernement : "https://geo.api.gouv.fr/". Cette API nous permet, dans nos formulaires de création et modification d'activités et de voyages, de faire de l'autocomplétion pour les champs de type adresse (place). Si l'utilisateur rentre "Grenoble" dans l'input alors l'API va retourner toutes les adresses en France contenant Grenoble. L'utilisateur n'a plus qu'à selectionner l'adresse de son choix dans la barre déroulante.
Illustration : ![Alt text](documentation/api_gouv.png?raw=true " Exemple d'utilisation de l'API")  

### Gestion des rôles <a name="groles"></a>
![Alt text](documentation/dia_gestion_droits.jpg?raw=true " Diagramme partie gestion des droits")  

Nous pouvons distinguer trois rôles dans notre application :  

* **OWNER** : quand un utilisateur crée un voyage il est tout de suite connsidéré comme le propriétaire (*owner*) de ce voyage. Cette partie est gérée dans la table *travel* : l'email de l'utilisateur qui a créé le voyage est renseigné dans le champ *owner* du nouveau voyage.   

Ensuite l'utilisateur peut choisir de partager son voyage avec d'autres utilisateurs. Il donne alors le droit de lecture ou le droit d'écriture à un autre utilisateur. Cette partie est gérée grâce à la table *travel_rights* dans la laquelle on retrouve l'email du l'utilisateur à qui le voyage est partagé, l'id du voyage qui lui est partagé et ses droits ( READER ou WRITER). On se retrouve alors avec deux nouveaux rôles :  

* **READER** :  L'utilisateur qui a ce droit sur un voyage partagé peut seulement consulter les informations du voyage et les différentes activités rattachées à ce voyage. Il n'a aucun droit d'ajout, de modification ou de suppression sur le voyage partagé. Cette partie est bien décrite dans [le schéma de cas d'utilisation d'un user READER](#diagusecase)

* **WRITER** :  L'utilisateur qui a ce droit peut consulter le voyage partagé, modifier les informations du voyage, ajouter / consulter / modifier et supprimer des activités au voyage. Par contre il ne peut pas supprimer le voyage car il n'en est pas le owner. Cette partie est bien décrite dans [le schéma de cas d'utilisation d'un user WRITER](#diagusecase) 

Au niveau des web services, la gestion des voyages d'un utilisateur et celle des voyages partagés à l'utilisateur sont différentes. Pour avoir accès à ses voyages, l'utlisateur passe par les endpoints */travels , /travels:id* alors que pour avoir accès à ses voyages partagés, il passe par les endpoints */travels/shared et /travels/:id/shared*.  

### Parties manquantes et non implémentées <a name="manque"></a>

Nous avons choisi de ne pas implémenter la partie relative à l'ajout de documents aux voyages et activités par manque de temps. Cette partie visait à pouvoir ajouter différents documents aux voyages et activités comme, par exemple, des boarding pass, des factures ou des photos prises lors de du voyage ou de l'activité.

Nous n'avons pas eu le temps non plus d'implémenter la partie concernant la gestion des utilisateurs : inscription sur l'application, modification de ses données utilisateurs ( mots de passe, nom ...) ...

## Architecture de l’application <a name="archi"></a>

Tout d'abord, à la racine, nous trouvons deux répertoires : le répertoire *backend*, comprenant tous les fichiers relatifs au backend, et le répertoire *frontend*, comprenant tous les fichiers relatifs au frontend.

Le répertoire backend est organisé comme suit : 

![Alt text](documentation/archi_backend.jpg?raw=true " Architecture de l'application côté backend ")

Le répertoire frontend est organisé comme suit : 
![Alt text](documentation/archi_frontend.jpg?raw=true " Architecture de l'application côté frontend ")

## Screencast <a name="screencast"></a> 

Voir la vidéo nommée screencast_carnetvoyage.webm dans le répertoire /documentation/ du projet.  

## Installation et tests <a name="test"></a>
Installation du projet côté backend :
```
cd backend
npm install
```

Lancement du backend :
```
cd backend
npm start
```

Exécuter les test du backend :
```
cd backend/__tests__
npm test activity.test.js 
npm test travel.share.test.js 
npm test travel.test.js
npm test login.test.js
```

Installation du projet côté frontend :
```
cd frontend
npm install
```

Lancement du frontend :
```
cd frontend  
npx react-native start  
npx react-native run-android  
```

NB : Si la dernière commande échoue, il peut être utile de vider le build avec
```
cd /android/
./gradlew clean
```

Exécuter les test du frontend :
```
detox build
detox test
```
NB : La commande build pouvant être capricieuse, il peut être nécessaire de l'éxécuter plusieurs fois avant qu'elle ne fonctionne.

### Avancé de tests

Pour le backend, seule la partie concernant la gestion des utilisateurs n'a pas été testée ( fonction *getProfile* ).

Pour le frontend, seules les actions de visualisation, création, modification et suppression des voyages et activités possédés par l'utilisateur  et la connexion / déconnexion ont été testées. Il manque les tests concernant :  

* les actions de visualisation et modification des voyages partagés et de leurs activités  
* la création des activités des voyages partagés  
* la gestion des droits de partage  