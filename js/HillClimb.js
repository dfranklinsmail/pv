'use strict';

const Model = require('./PVModel.js');

class HillClimb {

    constructor() { //constructor could take a model object?
        
        //this.move = new Moves();
        //var loopId = setInterval(step, 1000);
        this.moves = new Moves();
        this.model = new Model()
        this.loopId = null;

    };

   climb() {
        console.log('climbing....');
        var t = this;
        this.loopId = setInterval(function() {t.step();}, 1000);
       
    } 

    step() {
        var move = this.moves.next();
        if (move == null) {
            //if the current is less then best neighbour
            //then:
                //move to best 
                // recalculate moves
            //else
                //end loop
            clearInterval(this.loopId);
        } else {
            //TODO: need to split this up into two!!!!

            //a nearest neighbour exists
            //move to it, 
            //calculate its value
                //if this value is greater then the current
                //values set the current value to this value
                //and the current move to this move
            //move back to where you came
            console.log(move);
        }
    }
};

class Moves {
    constructor() {
        this.currentIndex = 0;
        this.moves = this.calculateMoves();
    }

    next() {
        if (this.currentIndex < this.moves.length) {
            return this.moves[this.currentIndex++];
        } else {
            return null;
        }
    }

    calculateMoves() {
        this.currentIndex = 0;
        return [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [-1, 0, 0],
            [0, -1, 0],
            [0, 0, -1]
        ];
    }
};

module.exports = HillClimb;

//function test() {
    var hillClimb = new HillClimb();
    hillClimb.climb();
//}

