'use strict';

$( document ).ready(function() {
    $('#PDBGenerator').click(function () {
        
        var generator = new PDBGenerator();
        generator.start();
    
    });
});

class PDBGenerator {

    constructor() {
        this.intervalId = 0
    };

    start() {
        
        var protein = '1A6M';
        //load a protein
        this.loadProtein(protein);
        var t = this;
        this.intervalId = setInterval(function() {t.rotateAndSave(protein);}, 1000);
        
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
            var model = new Model();
            var iterateSearch = new IterateSearch(model);
            
            iterateSearch.start(function() {
                //save the image to a file
                //model.saveToFile(protein);
                model.sendToServer(protein);
                //saveProtein(protein);
            });
        }
    };

}