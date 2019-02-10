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
    ships: [ { locations: [0, 0, 0], hits: ["", "", ""] },//ship 0
             { locations: [0, 0, 0], hits: ["", "", ""] },//ship 1
             { locations: [0, 0, 0], hits: ["", "", ""] } ],//ship 2
    spacesGuessed: [],
    /**
     * Fires at guessed location. Tries to hit a ship.
     * 
     * @method fire
     * @param {Number} guess - The space to fire at
     * @returns {boolean} true if hit, false if not hit
     */    
    fire: function(guess) {

        var isRepeatGuess = this.spacesGuessed.includes(guess);
        if(isRepeatGuess){
            alert('space has already been guessed.');
            return;
        }
        this.spacesGuessed.push(guess);



        // 1. Iterates over all ships
        // 2. Checks to see if our guess hit
        // 3. If hit, updates hits and checks if ship is sunk
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];

            var indexOfGuess = ship.locations.indexOf(guess);
            var didGuessHit = indexOfGuess >= 0;
            if (didGuessHit) {//so if the index is greater than or equal to 0 it means we must've had a hit.  If we didn't it would be -1 which is less than 0.
                ship.hits[indexOfGuess] = "hit";//Mark the hits array at the same index
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
    },
    generateShipLocations: function () { 
        var locations; //Creates undefined variable locations
        for (var i = 0; i < this.numShips; i++) { //For loop, iterates through .numShips
            do {//Do whats within these brackets no matter what, if the while loop is true, continue to do them until it's no longer true.
                locations = this.generateShip();//Locations is the coordinates generated from generateShip method
            } while (this.collision(locations));//If any ships overlap, re-generate another ship because the while loop would evaluate as true.
            this.ships[i].locations = locations;//assigns the locations to the ships array[i]
            console.log('~~~ generateShipLocations Called')
            console.table(this.ships)
        }
    },
    generateShip: function () {
        var direction = Math.floor(Math.random() * 2); // Math.random generates a number between 0 and 2 not including 2,(0-1) and math.floor rounds that number down
        var row;//Creates an undefined row var
        var col;//Creates an undefined col var
        if (direction === 1) {// if direction === 1 create a horizontal ship
            row = Math.floor(Math.random() * this.boardSize);//row is A random number rounded down that can be up to 6
            col = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));//col is a random number rounded down up to 4 (so ship isn't off board)
        } else {// if direction is at 0 create a vertical ship
            row = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));//row is a random number rounded down up to 4 (so ship isn't off board)
            col = Math.floor(Math.random() * this.boardSize);//col is a random number rounded down that can be up to 6
        }
        var newShipLocations = [];//This is the generated ships locations, the iteration below puts the locations at 0,1,2 indexs in the array.
        for (var i = 0; i < this.shipLength; i++) {//iterate through the number of locations in a ship (3)
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));//pushes new location onto array, partentheses to make sure i is added to col before converted to a string
                //the location is a string made up of the row (starting row we just computed). Horizontal ship.
            } else {
                newShipLocations.push((row + i) + "" + col);//pushes new location onto array, parthentheses to make sure i is added to row before converted to a string
                //the location is a string made up of the col
            }
        }
        return newShipLocations;//After we fill the array with the ships locations, return it to the calling method, generateShipLocations.
    },
    collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {//For each ship already on the board.
            var ship = this.ships[i];
            for (var j = 0; j < locations.length; j++) {//check to see if any of the locations in the new ship's locations array are in an existing ship's location array.
                if (ship.locations.indexOf(locations[j]) >= 0) {//indexOf checks if the location already exists in a ship.  If the index is greater than or equal to 0 we found a collision.  (index of returns a value of -1 if it cannot find an index)
                    return true;//Stops both loops immediately exiting the function and returning true.
                }
            }
        }
        return false; // if we get here then theres been no match on the index.  Which means there was no collision.
    }
};

var controller = {//Used to handle guesses
    guesses: 0,//Keeps track of how many total guesses the user has input.

    processGuess: function(guess) {//A function that accepts one argument.
        var location = parseGuess(guess);//location is the returned value from parseGuess function.
        if(location) {//If we get a real location this will be true.  If the guess is completely invalid this will be false because the parseGuess function would return null.
            this.guesses++;//If the player entered a valid guess we add 1 to the hits property.
            var hit = model.fire(location);//This passes the guess to the fire method as a string.  If it hits it's returned true and if it misses it's returned false.
            if(hit === undefined){
                alert("not a valid guess");
            }else if(hit && model.shipsSunk === model.numShips) {//If hit is true and model.shipsSunk are equal to the total number of ships then
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
function init () {//A function 
    var fireButton = document.getElementById("fireButton");//Sets the element fireButton as the var fireButton
    fireButton.onclick = handleFireButton;//Whenever the button is clicked the handleFireButton function is called.
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;//Adds a new handler event that handles key press events from html input field

    model.generateShipLocations();//Calls the generateShipLocations method which will fill in empty array locations. because it's in init function it will load before you even play the game.
}
function handleFireButton () {
    var guessInput = document.getElementById("guessInput");//Creates a var for the element "guessInput"
    var guess = guessInput.value;//Guess is the value of the guess input element, which is whatever the user inputs into the text prompt.
    controller.processGuess(guess);//passes the guess value to the controller method processGuess

    guessInput.value = "";//This resets the form inputs value to blank so you don't have to delete whatever you guess from the text box each time you fire.
}
function handleKeyPress (e) {//Browser passes an event object to the handler, this object has info about which key was pressed
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {//If you press the return key, the e.keyCode will be 13, which will trigger the code below. 
        fireButton.click();//This will cause the fireButton to act like it was clicked.
        return false;//We return false so the form doesn't do anything else like try to submit itself.
    }
}
window.onload = init; //The browser will run init after the page is fully loaded.

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