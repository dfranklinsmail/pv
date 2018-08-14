'use strict';

class HillClimb {

    constructor(Model) { //constructor could take a model object?
        //helpers variables
        this.moves = new Moves();
        this.model = Model;

        //loop variables
        this.loopId = null;

        //step variables
        this.localMaxValue = 0.0;
        this.localMaxOrientation = null;

        this.maxNeighbourValue = 0.0;
        this.maxNeighbourMove = null;

        this.currentMove = null;
    };

   climb() {
        this.model.setStyleHemilight();
        console.log('climbing....');
        var t = this;  
        this.loopId = setInterval(function() {t.step();}, 1000);
    } 

    step() {
        if (this.moves.isempty()) {
            //if the known localMax is less or equal then max neighbour
            if (this.localMaxValue <= this.maxNeighbourValue) {
                //then:
                 // recalculate moves
                this.moves.calculateMoves();
                //set the new localMax
                this.localMaxValue = this.maxNeighbourValue;
                //add the move to history
                this.moves.newMaxMove(this.maxNeighbourMove);
                //move to local max
                console.log(">>>> new local max move " + this.maxNeighbourMove + ' with value' + this.maxNeighbourValue);
                this.model.rotate(this.maxNeighbourMove[0], this.maxNeighbourMove[1], this.maxNeighbourMove[2]);
                this.localMaxOrientation = this.model.currentRotation;
            } else {
                //display accumulated moves
                console.log('accumulated moves');
                console.log(this.accumulatedMoves);
                console.log('orientation of best orientation');
                console.log(this.localMaxOrientation)
                console.log('the local max value '+this.localMaxValue);

                //end loop
                clearInterval(this.loopId);
            }
        } else {
            //TODO: need to split this up into two!!!!
            if (this.currentMove === null) {
                this.currentMove = this.moves.peak();
                console.log('moving to new neighbour');
                console.log(this.currentMove);
                this.model.rotate(this.currentMove[0], this.currentMove[1], this.currentMove[2]);
            } else {
                //remove a move
                var cMove = this.moves.pop();
                //
                console.log('calculate and move back');
                var cValue = this.model.calculateValue();
                console.log('cValue ' + cValue);
                if (cValue > this.maxNeighbourValue) {
                    this.maxNeighbourValue = cValue;
                    this.maxNeighbourMove = cMove;
                }
                
                var negativeMove = this.moves.negate(cMove);
                this.model.rotate(negativeMove[0], negativeMove[1], negativeMove[2]);
                //reset
                this.currentMove = null;
                console.log('moved back');
            }
            //a nearest neighbour exists
            //move to it, 
            //calculate its value
                //if this value is greater then the current
                //values set the current value to this value
                //and the current move to this move
            //move back to where you came
            //console.log(move);
            //this.model.rotate(move[0], move[1], move[2]);
        }
    }
};

class Moves {
    constructor() {
        this.currentIndex = 0;
        this.accumulatedMoves = [];
        
        this.moves = this.calculateMoves();

    }

    newMaxMove(move) {
        this.accumulatedMoves.push(move);
    }

    pop() {
        if (this.currentIndex < this.moves.length) {
            return this.moves[this.currentIndex++];
        } else {
            return null;
        }
    }

    peak() {
        if (this.currentIndex < this.moves.length) {
            return this.moves[this.currentIndex];
        } else {
            return null;
        }
    }

    isempty() {
        return this.currentIndex >= this.moves.length;
    }

    calculateMoves() {
        this.currentIndex = 0;
        var minMoveValue = 5;
        var newMoves =  [
            [minMoveValue, 0, 0],
            [0, minMoveValue, 0],
            [0, 0, minMoveValue],
            [-minMoveValue, 0, 0],
            [0, -minMoveValue, 0],
            [0, 0, -minMoveValue]
        ];

        //remove the last move from the list of new moves
        if (this.accumulatedMoves.length > 0) {
            //get the last move
            var moveToBeRemoved = this.accumulatedMoves.pop();
            this.accumulatedMoves.push(moveToBeRemoved);

            //negate it to remove the move that goes back
            moveToBeRemoved = this.negate(moveToBeRemoved);
            var indexToRmove = -1;
            
            newMoves.forEach(function(elements, index) {
                if (elements[0] === moveToBeRemoved[0]
                    && elements[1] === moveToBeRemoved[1]
                    && elements[2] === moveToBeRemoved[2]) {
                        indexToRmove = index;
                    }
            }, this);

            if ( indexToRmove >= 0 ) {
                newMoves.splice(indexToRmove, 1);
            }
        }

        return newMoves;
        // return [
        //     [1, 0, 0],
        //     [0, 1, 0],
        //     [0, 0, 1],
        //     [-1, 0, 0],
        //     [0, -1, 0],
        //     [0, 0, -1]
        // ];
    }

    negate(move) {
        return move.map(value => -value);
    }
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = HillClimb;
  else
window.HillClimb = HillClimb;

