var view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
}

/* Values used to test the view object.
view.displayMiss("00");
view.displayHit("34");
view.displayMiss("55");
view.displayHit("12");
view.displayMiss("25");
view.displayHit("26");
view.displayMessage("Tap tap, is this thing on?");
*/
var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    sipsSunk: 0,
    ships: [ { locations: ["10", "20", "30"], hits: ["", "", ""] },//ship 0
             { locations: ["32", "33", "34"], hits: ["", "", ""] },//ship 1
             { locations: ["63", "64", "65"], hits: ["", "", ""] } ],//ship 2
    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];//For each ship
                                     // V if the guess is in the locations array, we have a hit.
            var index = ship.locations.indexOf(guess);//indexof searches an array for a matching value and returns it's location in the arry, or -1 if it can't find it.
            if (index >= 0) {//so if the index is greater than or equal to 0 it means we must've had a hit.  If we didn't it would be -1 which is less than 0.
                ship.hits[index] = "hit";//Mark the hits array at the same index
                view.displayHit(guess);
                view.displayMessage("HIT!");
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my Battleship!");
                    this.shipsSunk++;
                }
                return true;//return true because we had a hit
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
    },
    isSunk: function(ship) {

    }
};