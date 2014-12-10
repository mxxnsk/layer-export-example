
(function () {
    "use strict";
    var _generator = null,
        _config = null;

    /*********** INIT ***********/
    var path = require('path'),
        mkdirp = require('mkdirp'),
        jf = require('jsonfile');

    function init(generator, config) {
        _generator = generator;
        _config = config;

        console.log("initializing plugin with config %j", _config);
        
        var dir = path.join(__dirname, "Output");
        var documentId = 0;

        //var layers = { firstLayerIndex: 1, lastLayerIndex: 3}; // Config for sample.psd
        var layers = { firstLayerIndex: 2, lastLayerIndex: 5}; // Config for sample_with_groups.psd
        function processLayers() {
            _generator.getDocumentInfo()
                .then(function (document) {
                    documentId = document.id;
                    jf.writeFile(path.join(dir, "document.json"), document, function(error) { console.log("Error: " + error); });

                    console.log("Get pixmap");
                    return _generator.getPixmap(documentId, layers, {});
                })
                .then(function(pixmap) {
                    var filename = path.join(dir, "sample.png");
                    console.log("Creating file " + filename);
                    return _generator.savePixmap(pixmap, filename, { format: 'png', quality: 32, ppi: 72 });
                })                
                .then(function() {
                    console.log("All set.");
                }); 
            }

        process.nextTick(function() {
            mkdirp(dir, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    processLayers();
                }
            });
        });
    }

    exports.init = init;
}());
