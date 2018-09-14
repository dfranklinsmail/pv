
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
        this.count = 0;
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
        if (this.count > this.maxCount) {
            //finished move to best and finish
            this.model.move(this.bestOrientation);
        } else if (this.currentMove === null) {
            //calculate next move
            this.currentMove = this.calculateNextMove();
            this.count = this.count + 10;
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
        return [this.count % 360*360, this.count % 360, this.count % 360];
    }
}