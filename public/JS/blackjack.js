// initialisation des variables
var dealerSum = 0;
var yourSum = 0;

var dealerAceCount = 0;
var yourAceCount = 0;

var prime = 0.0;
var primeCalc = 1;
var world = 1;
var numberZero = 0;

var hidden;
var deck;

var replayValue = false;


// permet au joueur (vous) de tirer une carte tant que yourSum <= 21
var canHit = true;

// si le total des cartes du joueur (avec des as comptés à 1) est supérieur à 21, il ne peut plus tirer de carte
if (reduceAce(yourSum, yourAceCount) > 21) {
    canHit = false;
}

// fonction appelée lorsque la fenêtre se charge
window.onload = function () {
    // construit un jeu de cartes
    buildDeck();
    // mélange le jeu de cartes
    shuffleDeck();
    // démarre le jeu
    startGame();
}

function replay() {
    // Réinitialiser les variables
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    hidden = null;
    canHit = true;
    replayValue = true;
    message = "";
    numberZero = 0;
    document.getElementById("result").innerHTML = message;

    // Réinitialiser les compteurs d'as
    let dealerAces = document.querySelectorAll("#dealer-cards img[src$='A.png']");
    let yourAces = document.querySelectorAll("#your-cards img[src$='A.png']");
    dealerAceCount = dealerAces.length;
    yourAceCount = yourAces.length;

    // Supprimer les images de cartes
    let dealerCards = document.getElementById("dealer-cards");
    while (dealerCards.firstChild) {
        dealerCards.removeChild(dealerCards.firstChild);
    }

    let yourCards = document.getElementById("your-cards");
    while (yourCards.firstChild) {
        yourCards.removeChild(yourCards.firstChild);
    }

    // // Recommencer le jeu
    // startGame();

    // location.reload();

    // construit un jeu de cartes
    buildDeck();
    // mélange le jeu de cartes
    shuffleDeck();
    // démarre le jeu
    startGame();
}







function buildDeck() {
    // Définition des valeurs des cartes (A, 2, 3, ..., K)
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    // Définition des valeurs bonus (0)
    let valuesBonus = ["0"];
    // Définition des types de cartes (Coeur, Carreau, Trèfle, Pique)
    let types = ["C", "D", "H", "S"];
    // Définition des bonus (BAA, BAB)
    let bonus = ["BAA", "BAB"];

    // Initialisation du paquet de cartes
    deck = [];
    // Initialisation du tableau contenant les cartes déjà utilisées
    let usedCards = [];

    // Boucle pour les bonus
    for (let h = 0; h < bonus.length; h++) {
        // Boucle pour les types de cartes
        for (let i = 0; i < types.length; i++) {
            // Boucle pour les valeurs bonus
            for (let k = 0; k < valuesBonus.length; k++) {
                // Création de la carte avec la valeur bonus et le bonus
                let card = valuesBonus[k] + "-" + bonus[h];
                // Vérification si la carte n'est pas déjà dans le paquet
                if (!usedCards.includes(card)) {
                    // Ajout de la carte au paquet
                    deck.push(card);
                    // Ajout de la carte dans le tableau des cartes déjà utilisées
                    usedCards.push(card);
                }
            }
            // Boucle pour les valeurs de cartes
            for (let j = 0; j < values.length; j++) {
                // Création de la carte avec la valeur et le type de carte
                let card = values[j] + "-" + types[i];
                // Vérification si la carte n'est pas déjà dans le paquet
                if (!usedCards.includes(card)) {
                    // Ajout de la carte au paquet
                    deck.push(card);
                    // Ajout de la carte dans le tableau des cartes déjà utilisées
                    usedCards.push(card);
                }
            }
        }
    }
    // Retourne le paquet de cartes
    return deck;
}







// fonction pour mélanger le jeu de cartes
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}









// fonction pour démarrer le jeu
function startGame() {

    // tirer une carte pour le dealer (carte cachée)
    hidden = deck.pop();
    if (replayValue == true) {
        document.getElementById("dealer-cards").innerHTML += '<img id="hidden" src="public/images/cards_OP/BACK.png">';
    }
    if (getValue(hidden) === 0) { // Vérifier si la carte est d'une valeur de 0
        hidden = deck.pop(); // Piocher une autre carte si la première est d'une valeur de 0
    }
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    // ajouter une seule carte visible pour le dealer
    let visibleCardImg = document.createElement("img");
    let visibleCard = null;

    do {
        visibleCard = deck.pop();
    } while (getValue(visibleCard) === 0);

    visibleCardImg.src = "public/images/cards_OP/" + visibleCard + ".png";
    dealerSum += getValue(visibleCard);
    dealerAceCount += checkAce(visibleCard);
    document.getElementById("dealer-cards").append(visibleCardImg);





    // afficher les scores dès le début
    document.getElementById("dealer-points").innerHTML = "Puissance adversaire : " + getValue(visibleCard);
    document.getElementById("your-points").innerHTML = "Puissance équipe : " + yourSum;
    document.getElementById("primeMessage").innerHTML = "Prime de l'équipe : " + prime + "M berry";

    if (prime < 10) {
        document.getElementById("world").innerHTML = "monde " + world + ": " + "East Blue";
    }
    
    else if (prime >= 10 && prime < 100) {
        world = 2;
        primeCalc = 10;
        document.getElementById("world").innerHTML = "monde " + world + ": " + "GrandLine";
    }
    
    else if (prime >= 100) {
        world = 3;
        primeCalc = 100;
        document.getElementById("world").innerHTML = "monde " + world + ": " + "Nouveau Monde";
    }

    // tirer deux cartes pour le joueur
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "public/images/cards_OP/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);

        // Vérifier si la carte a une valeur de zéro
        if (getValue(card) === 0) {
            numberZero++;
        }

        if (yourSum == 21 && dealerSum < 10) {
            message = "Victoire par abandon";

            // Afficher le résultat
            document.getElementById("result").innerHTML = message;

            // Supprimer les écouteurs d'événements pour empêcher le joueur de continuer à jouer
            document.getElementById("hit").removeEventListener("click", hit);
            document.getElementById("stay").removeEventListener("click", stay);
            document.getElementById("primeMessage").innerHTML = "Prime : " + prime + "M berry";
        }
    }


    console.log(yourSum);
    // ajouter des écouteurs d'événements pour le bouton "hit" et le bouton "stay"
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);

    // ajouter un écouteur d'événements pour le bouton "play"
    document.getElementById("play").addEventListener("click", replay);

    // afficher les scores
    document.getElementById("dealer-points").innerHTML = "Puissance adversaire : " + getValue(visibleCard);
    document.getElementById("your-points").innerHTML = "Puissance équipe : " + yourSum;
    document.getElementById("primeMessage").innerHTML = "Prime : " + prime + "M berry";
}









function hit() {
    // Si le joueur ne peut pas appuyer sur le bouton "Hit", la fonction s'arrête
    if (!canHit) {
        return;
    }

    // Crée une nouvelle image pour la carte qui sera tirée
    let cardImg = document.createElement("img");

    // Prend la carte du dessus du paquet de cartes et l'enlève
    let card = deck.pop();

    // Donne l'emplacement de la carte dans le dossier d'images
    cardImg.src = "public/images/cards_OP/" + card + ".png";

    // Ajoute la valeur de la carte à la somme du joueur
    yourSum += getValue(card);
    if (getValue(card) === 0) {
        numberZero++;
    }

    // Vérifie si la carte est un As et si c'est le cas, ajoute 1 au nombre d'As du joueur
    yourAceCount += checkAce(card);

    // Vérifie si le joueur a dépassé 21 avec un As dans sa main, et s'il en a un, change sa valeur de 11 à 1
    if (yourSum > 21 && yourAceCount > 0) {
        yourSum -= 10;
        yourAceCount -= 1;
    }

    // Ajoute l'image de la carte tirée à la main du joueur
    document.getElementById("your-cards").append(cardImg);

    if (yourSum == 21) {
        // Changer la carte cachée en carte visible
        document.getElementById("hidden").src = "public/images/cards_OP/" + hidden + ".png";
        document.getElementById("your-points").innerHTML = "Puissance équipe : " + yourSum;
        document.getElementById("primeMessage").innerHTML = "Prime : " + prime + "M berry";

        // Faire en sorte que le dealer continue de tirer des cartes tant qu'il n'est pas minimum à 17
        while (dealerSum < 17) {
            let cardImg = document.createElement("img");
            let card = null;

            do {
                card = deck.pop();
            } while (getValue(card) === 0);

            cardImg.src = "public/images/cards_OP/" + card + ".png";
            dealerSum += getValue(card);
            dealerAceCount += checkAce(card);

            // Vérifie si le croupier a dépassé 21 avec un As dans sa main, et s'il en a un, change sa valeur de 11 à 1
            if (dealerSum > 21 && dealerAceCount > 0) {
                dealerSum -= 10;
                dealerAceCount -= 1;
            }

            document.getElementById("dealer-cards").append(cardImg);
        }


        // Vérifier si le joueur dépasse 21
        if (reduceAce(yourSum, yourAceCount) > 21) {
            canHit = false;
        }

        // Afficher les points du joueur et du dealer
        document.getElementById("dealer-points").innerHTML = "Puissance adversaire : " + getValue(visibleCard);
        document.getElementById("your-points").innerHTML = "Puissance équipe : " + yourSum;
        document.getElementById("primeMessage").innerHTML = "Prime : " + prime + "M berry";

        // Déterminer le résultat
        let message = "";
        if (yourSum > 21) {
            message = "MUTINERIE!";
            if (prime < primeCalc) {
                prime = 0;
            }
            else {
                prime -= (primeCalc/2);
            }
        }
        else if (dealerSum > 21) {
            message = "Victoire par abandon";
            prime += primeCalc;
            if (numberZero >= 1) {
                prime += primeCalc;
            }
            if (numberZero >= 2) {
                prime += primeCalc;
            }
            if (numberZero >= 3) {
                prime += primeCalc;
            }
            if (numberZero >= 4) {
                prime += primeCalc;
            }
        }
        // Si les deux joueurs ont un score inférieur ou égal à 21
        else if (yourSum == dealerSum) {
            message = "Match Null";
        }
        else if (yourSum > dealerSum) {
            message = "VICTOIRE!";
            prime += primeCalc;
            if (numberZero >= 1) {
                prime += primeCalc;
            }
            if (numberZero >= 2) {
                prime += primeCalc;
            }
            if (numberZero >= 3) {
                prime += primeCalc;
            }
            if (numberZero >= 4) {
                prime += primeCalc;
            }
        }
        else if (yourSum < dealerSum) {
            message = "DEFAITE!";
            if (prime < primeCalc) {
                prime = 0;
            }
            else {
                prime -= (primeCalc/2);
            }
        }

        // Afficher le résultat
        document.getElementById("result").innerHTML = message;

        document.getElementById("hit").removeEventListener("click", hit);
        document.getElementById("stay").removeEventListener("click", stay);
    }

    // Si le joueur a un As dans sa main et que sa somme dépasse 21, réduit la valeur de l'As à 1
    if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false; // Empêche le joueur d'appuyer sur le bouton "Hit" après avoir dépassé 21
    }

    // Met à jour l'affichage de la somme du joueur et du croupier
    document.getElementById("your-points").innerHTML = "Puissance équipe : " + yourSum;
    document.getElementById("primeMessage").innerHTML = "Prime : " + prime + "M berry";


}










function stay() {

    // Désactiver les boutons Hit et Stay
    document.getElementById("hit").removeEventListener("click", hit);
    document.getElementById("stay").removeEventListener("click", stay);

    // Réduire la valeur des Aces s'il y en a
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    // Désactiver la possibilité de Hit
    canHit = false;
    // Changer la carte cachée en carte visible
    document.getElementById("hidden").src = "public/images/cards_OP/" + hidden + ".png";

    // Faire en sorte que le dealer continue de tirer des cartes tant qu'il n'est pas minimum à 17
    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        if (getValue(card) === 0) {  // Vérifier si la carte est d'une valeur de 0
            continue;  // Passe à la prochaine itération de la boucle
        }
        cardImg.src = "public/images/cards_OP/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }


    // Vérifier si le joueur dépasse 21
    if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;
    }

    // Afficher les points du joueur et du dealer
    document.getElementById("your-points").innerHTML = "Puissance équipe : " + yourSum;
    document.getElementById("dealer-points").innerHTML = "Puissance adversaire : " + dealerSum;
    document.getElementById("primeMessage").innerHTML = "Prime : " + prime + "M berry";

    // Déterminer le résultat
    let message = "";
        if (yourSum > 21) {
            message = "MUTINERIE!";
            if (prime < primeCalc) {
                prime = 0;
            }
            else {
                prime -= (primeCalc/2);
            }
        }
        else if (dealerSum > 21) {
            message = "Victoire par abandon";
            prime += primeCalc;
            if (numberZero >= 1) {
                prime += primeCalc;
            }
            if (numberZero >= 2) {
                prime += primeCalc;
            }
            if (numberZero >= 3) {
                prime += primeCalc;
            }
            if (numberZero >= 4) {
                prime += primeCalc;
            }
        }
        // Si les deux joueurs ont un score inférieur ou égal à 21
        else if (yourSum == dealerSum) {
            message = "Match Null";
        }
        else if (yourSum > dealerSum) {
            message = "VICTOIRE!";
            prime += primeCalc;
            if (numberZero >= 1) {
                prime += primeCalc;
            }
            if (numberZero >= 2) {
                prime += primeCalc;
            }
            if (numberZero >= 3) {
                prime += primeCalc;
            }
            if (numberZero >= 4) {
                prime += primeCalc;
            }
        }
        else if (yourSum < dealerSum) {
            message = "DEFAITE!";
            if (prime < primeCalc) {
                prime = 0;
            }
            else {
                prime -= (primeCalc/2);
            }
        }

    // Afficher le résultat
    document.getElementById("result").innerHTML = message;

}










// Cette fonction prend une carte sous la forme d'une chaîne de caractères et renvoie sa valeur en points.
function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"] // Sépare le numéro et la couleur de la carte dans un tableau.
    let value = data[0];  // Prend la première valeur du tableau qui est le numéro de la carte.


    if (isNaN(value)) { // Si la carte n'est pas un nombre, c'est donc une carte spéciale (A, J, Q, K).
        if (value == "A") { // Si c'est un As, il vaut 11 points.
            return 11;
        }
        return 10; // Si c'est une carte spéciale autre qu'un As, elle vaut 10 points.
    }
    return parseInt(value); // Si la carte est un nombre, on la parse en entier et on la renvoie comme valeur en points.

}

// Cette fonction prend une carte sous la forme d'une chaîne de caractères et renvoie 1 si c'est un As, sinon 0.
function checkAce(card) {
    if (card[0] == "A") {// Si la première lettre de la chaîne de caractères est "A", alors c'est un As.
        return 1;
    }
    return 0;// Sinon, ce n'est pas un As.
}

/* Cette fonction prend la somme des points d'un joueur et le nombre d'As qu'il a et renvoie 
la somme en points réduite en considérant les As comme valant 1 point chacun s'il y a un dépassement de 21 points.*/
function reduceAce(playerSum, playerAceCount) {
    if (playerSum === 21) {
        return playerSum; // Si la somme des points est égale à 21, renvoyer cette somme sans la réduire.
    }
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}
