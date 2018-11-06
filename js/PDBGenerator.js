'use strict';

$( document ).ready(function() {
    $('#PDBGenerator').click(function () {
        
        var generator = new PDBGenerator();
        generator.getNextProtein();
    
    });
});

class PDBGenerator {

    constructor() {
        this.intervalId = 0
        this.model = new Model()
    };

    start(protein) {
        //load a protein
        if (protein && protein.length > 0) {
            protein = protein.substring(0,4);
            this.loadProtein(protein);
            var t = this;
            this.intervalId = setInterval(function() {t.rotateAndSave(protein);}, 1000);
        }
    };

    loadProtein(protein) {
        require(['pv'], function(PV) {
            var url = 'http://www.rcsb.org/pdb/files/' + protein + '.pdb';
            
            pv.io.fetchPdb(url, function(s) {
                viewer.clear();
                var go = viewer.cartoon('structure', s, {
                    color : pv.color.ssSuccession(), showRelated : '1',
                });
                var rotation = pv.viewpoint.principalAxes(go);
                //go.setSelection(go.select({rtype : 'C' }));
                viewer.setRotation(rotation);
                viewer.forEach(function(go) {
                    go.colorBy(pv.color.bySS());
                    });
                viewer.autoZoom();
            });
        });
    };


    rotateAndSave(protein) {
        if (this.intervalId > 0) {
            clearInterval(this.intervalId);
            //calculate its best orientation
            var iterateSearch = new IterateSearch(this.model);
            var nextProtein = null;
            var self = this;
            iterateSearch.start(function() {
                //save the image to a file
                //model.saveToFile(protein);
                this.model.sendToServer(protein);
                this.getNextProtein();
                //saveProtein(protein);
            }.bind(this));
        }
    };
    
    getNextProtein() {
        this.model.getNextProtein(function(nextProtein) {
            if (!nextProtein) {
                console.log('no new protein')
            } else {
                this.start(nextProtein);
            }
        }.bind(this));
    }

}