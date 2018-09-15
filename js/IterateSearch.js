
'use strict';

$( document ).ready(function() {
    $('#iterateSearch').click(function () {
        
        var model = new Model();
        var iterateSearch = new IterateSearch(model);
        
        iterateSearch.start();
    
    });
});
class IterateSearch {

    constructor(Model) { //constructor could take a model object?
        //helpers variables
        this.currentOrientation = null
        this.currentMove = null;
        this.model = Model;

        //loop variables
        this.countX = 0;        
        this.countY = 0;
        this.countZ = 0;
        this.maxCount = 360*360*360;
        this.loopId = null;

        //max variables
        this.best = 0.0;
        this.bestOrientation = null;
    };

   start() {
        this.model.setStyleHemilight();

        console.log('iterative search....');
        var t = this;  
        this.loopId = setInterval(function() {t.loop();}, 1000);
    } 

    loop() {
        if (this.countZ >= 360) {
            //finished move to best and finish
            this.model.move(this.bestOrientation);
            clearInterval(this.loopId);
	
        } else if (this.currentMove === null) {
            //calculate next move
            this.currentMove = this.calculateNextMove();
            //move to next move
            this.currentOrientation = this.model.rotate(this.currentMove[0], 
                this.currentMove[1], this.currentMove[2]);
        } else {
            //set current move to null
            this.currentMove = null;
            //calculate value of current oritation
            var current =  this.model.calculateValue();
            //compare with global best to see if current
            //is better, update best or continue
            if (this.best < current) {
                this.best = current;
                this.bestOrientation = this.currentOrientation;
            }
        }
    }

    calculateNextMove() {
        var nextMove;
        if (this.countX == 360) {
            this.countX = 0;
            this.countY = this.countY + 10;
            nextMove = [0, 10, 0];
        } else if (this.countY == 360) {
            this.countY = 0;
            this.countZ = this.countZ + 10;
            nextMove = [0, 0, 10];
        } else {
            this.countX = this.countX + 10;
            nextMove = [10, 0, 0];
        }

        return nextMove;
    }
}
