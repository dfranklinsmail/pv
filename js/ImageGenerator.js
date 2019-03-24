'use strict';

$( document ).ready(function() {
    $('#imageGenerator').click(function () {
        
        var generator = new ImageGenerator();
        generator.getNextProtein();
    
    });
});

class ImageGenerator {

    constructor() {
        this.intervalId = 0
        this.model = new Model()
       
    };

    start(protein) {
        //load a protein
        if (protein && protein.length > 0) {
            var proteinName = protein.substring(0,4);
            
            var t = this;
            var chain = '';
            var start = '';
            var end = '';
            if (protein.length > 4) {
                chain = protein.substring(4,5);
                if (protein.length > 5) {
                    var chainSubComponent = protein.substring(6, protein.length).split("-");
                    start = chainSubComponent[0];
                    end = chainSubComponent[1];
                }
            }

            this.loadProtein(proteinName, chain, start, end);
            this.intervalId = setInterval(function() {t.rotateAndSave(protein);}, 1000);
        }
    };

    loadProtein(protein, chainName, start, end) {
        require(['pv'], function(PV) {
            var url = 'http://www.rcsb.org/pdb/files/' + protein + '.pdb';
            
            pv.io.fetchPdb(url, function(s) {
                viewer.clear();
                if (chainName.length > 0 && chainName != '_') {
                    console.log("in extract chains");
                    var isolatedChain = null;
                    for (var i in s._chains) {
                        if (s._chains[i]._name == chainName) {
                            isolatedChain = s._chains[i];
                        }
                    }
                    if (start.length>0) {
                        var newResidues = [];
                        for (var i in isolatedChain._residues) {
                            if (isolatedChain._residues[i]._num >= start && isolatedChain._residues[i]._num <= end) {
                                newResidues.push(isolatedChain._residues[i])
                            }
                        }
                        isolatedChain._residues = newResidues;
                    }
                    s._chains = [isolatedChain];
                }
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
            
            var iterateSearch = new FiniteIterateSearch(this.model);
            var nextProtein = null;
            var self = this;
            
            iterateSearch.start(protein, function() {
                //save the image to a file
                
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
                console.log('next protein is ', nextProtein);
                this.start(nextProtein);
            }
        }.bind(this));
    }
}