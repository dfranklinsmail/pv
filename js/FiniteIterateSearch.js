
'use strict';

$( document ).ready(function() {
    $('#finiteIterateSearch').click(function () {
        
        var model = new Model();
        var iterateSearch = new FiniteIterateSearch(model);
        
        iterateSearch.start();
    
    });
});
class FiniteIterateSearch {

    constructor(Model) { //constructor could take a model object?
        //helpers variables
        this.model = Model;
        this.protein;

        this.index = 0;
        this.nextIndex = 1;
        this.loopId = null;

        this.moves = [ //6 moves to capture all 90 degree rotations of the protein
            [0,0,0],
            [90,0,0],
            [180,0,0],
            [270,0,0],
            [0,90,0],
            [0, 270, 0]
        ];
    };
    
    start(protein, callBackFunction) {
        this.protein = protein;
        this.callBackFunction = callBackFunction;

        this.model.setStyleHemilight();

        console.log('iterative search....');
        var t = this;  
        this.loopId = setInterval(function() {t.loop();}, 500);
    } 

    loop() {
        //console.log("contZ="+this.countZ+", countY="+this.countY+", countX="+this.countX);
        if (this.index == this.nextIndex) {
            ++this.nextIndex; //increment the next index
            
            //record the image
            this.model.sendToServer(this.protein);
        } else if (this.index < this.moves.length) {
            //move the model to the next orientation
            var currentMove = this.moves[this.index];
            this.model.rotate(currentMove[0], currentMove[1], currentMove[2]);
            
            //get next move
            this.index = this.nextIndex
        } else {
            //No more moves get the next protein with the call back function
            clearInterval(this.loopId);
            if (this.callBackFunction) {
                this.callBackFunction();
            }
        }
    }
}
