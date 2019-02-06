var view = {//Used to display to the user whats going on.
    displayMessage: function(msg) {//A function that accepts 1 argument
        var messageArea = document.getElementById("messageArea");//messageAre variable is the HTML element "messageArea"
        messageArea.innerHTML = msg;//Change whats inside messageArea element to specified message
    },
    displayHit: function(location) {//A function that accepts one argument
        var cell = document.getElementById(location);//cell is the HTML element with the ID of "location"
        cell.setAttribute("class", "hit");//Set "Cell's" Class to hit
    },
    displayMiss: function(location) {//Function accepting 1 arugment
        var cell = document.getElementById(location);//Cell is the HTML element with the ID of "location" 
        cell.setAttribute("class", "miss");//Set "Cell's" class to miss
    }
};

var model = {//Used to handle the game itself
    boardSize: 7,//Sets game board size to 7
    numShips: 3,//Total number of ships in the game
    shipLength: 3,//How long each ship is
    shipsSunk: 0,//A property we will use to see how many ships are sank so far, when total is 3 we will restart the game.
    ships: [ { locations: ["10", "20", "30"], hits: ["", "", ""] },//ship 0
             { locations: ["32", "33", "34"], hits: ["", "", ""] },//ship 1
             { locations: ["63", "64", "65"], hits: ["", "", ""] } ],//ship 2
    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {//A loop that iterates through all 3 ships
            var ship = this.ships[i];//For each ship
                                     // V if the guess is in the locations array, we have a hit.
            var index = ship.locations.indexOf(guess);//indexof searches an array for a matching value and returns it's location in the array, or -1 if it can't find it.
            if (index >= 0) {//so if the index is greater than or equal to 0 it means we must've had a hit.  If we didn't it would be -1 which is less than 0.
                ship.hits[index] = "hit";//Mark the hits array at the same index
                view.displayHit(guess);//This calls the view.displayHit Method, supplying it's paramater with the user's guess
                view.displayMessage("HIT!");//This calls view.displayMessage method, and supplies a msg as "HIT!"
                if (this.isSunk(ship)) {//If this ship is sunk,
                    view.displayMessage("You sank my Battleship!");//Call the view.displayMessage method and supply a msg of "You sank my Battleship!"
                    this.shipsSunk++;// Add one to the property shipsunk value
                }
                return true;//return true because we had a hit
            }
        }
        view.displayMiss(guess);//For this code to be ran, the guess would've had to not match any of the three ships location array's.  This calls the displayMiss method in view.
        view.displayMessage("You missed.");//This calls the displayMessage method in view with a msg of "You missed."
        return false;//Returns false because we didn't HIT
    },
    isSunk: function(ship) {//The isSunk method accepts one param
        for (var i = 0; i < this.shipLength; i++) {//Iterate through ship objs
            if (ship.hits[i] !== "hit") {//If any of the ship hit properties doesn't contain hit, return false the ship isn't sunk yet.
                return false;
            }
        }
        return true;// If any of the ships have "hit" in all 3 array spots, they're sunk return true.
    }
};

var controller = {//Used to handle guesses
    guesses: 0,//Keeps track of how many total guesses the user has input.

    processGuess: function(guess) {//A function that accepts one argument.
        var location = parseGuess(guess);//location is the returned value from parseGuess function.
        if(location) {//If we get a real location this will be true.  If the guess is completely invalid this will be false because the parseGuess function would return null.
            this.guesses++;//If the player entered a valid guess we add 1 to the hits property.
            var hit = model.fire(location);//This passes the guess to the fire method as a string.  If it hits it's returned true and if it misses it's returned false.
            if(hit && model.shipsSunk === model.numShips) {//If hit is true and model.shipsSunk are equal to the total number of ships then
                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");//Display msg pushed to the displayMessage element
            }
        }
    }
};

function parseGuess(guess) {//A function that accepts one argument
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];//In this array the indexs are [0, 1, 2, 3, 4, 5, 6] This works perfectly for our guesses

    if (guess === null || guess.length !== 2) {//If guess is null or guess.length is larger than 2
        alert("Oops, please enter a letter and a number on the board.");//alert this message
    } else {//If none of the above requirements are met run this;
        var firstChar = guess.charAt(0);//Grab the first character of the guess
        var row = alphabet.indexOf(firstChar);//Using indexOf, we find the index (or place) of that character in the alphabet array, assigning the letter to it's index
        var column = guess.charAt(1);//column variable is the 2nd character in the guess argument

        if(isNaN(row) || isNaN(column)) {//if row variable or colum variable aren't numbers
            alert("Oops, that isn't on the board.");//then alert message
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {//If they are numbers, then check to see if row and column are less than 0 or greated than boardSize variable which is 7
            alert("Oops, that's off the board!");//If they are less than 0 or greater than or equal to 7 then alert this message
        } else {
            return row + column;//If they've met none of the above requirements, they're valid guesses, return them.
        }
    }
    return null;//If they've met any of the requirements to be invalid they will eventually return null.
}


/* This code tests the parseGuess function making sure that invalid guesses are caught, and that valid guesses are type converted from strings to numbers
console.log(parseGuess("A0"));
console.log(parseGuess("A5"));
console.log(parseGuess("B6"));
console.log(parseGuess("C9"));
console.log(parseGuess("L3"));
*/

/*This code tests the controller obj making sure the game ends and that hits are sent to the method obj.
controller.processGuess("B0");

controller.processGuess("C0");
controller.processGuess("D0");
controller.processGuess("D2");

controller.processGuess("D3");
controller.processGuess("G3");
controller.processGuess("G4");

controller.processGuess("G5");
controller.processGuess("F1");
controller.processGuess("D4");
*/

/*Testing for the model obj, messages are displayed and hit and miss images appear:
model.fire("10");
model.fire("20");
model.fire("30");

model.fire("40");
model.fire("52");
*/

/* Values used to test the view object.
view.displayMiss("00");
view.displayHit("34");
view.displayMiss("55");
view.displayHit("12");
view.displayMiss("25");
view.displayHit("26");
view.displayMessage("Tap tap, is this thing on?");
*/