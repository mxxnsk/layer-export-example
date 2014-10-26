
(function () {
    "use strict";
    var _generator = null,
        _config = null;

    /*********** INIT ***********/
    var os = require('os');
    var path = require('path');
    var mkdirp = require('mkdirp');

    function init(generator, config) {
        _generator = generator;
        _config = config;

        console.log("initializing with config %j", _config);
        
        var dir = path.join(os.tmpdir(), "Example");
        var documentId = 0;

        function processLayers() {
            _generator.getDocumentInfo()
                .then(function (document) {
                    documentId = document.id;
                    var layers = { firstLayerIndex: 2, lastLayerIndex: 3, hidden: [] };
                    console.log("Get pixmap by range.");
                    return _generator.getPixmap(documentId, layers, {});
                })
                .then(function(pixmap) {
                    var filename = path.join(dir, "sample.png");
                    console.log("Saving to file " + filename);
                    return _generator.savePixmap(pixmap, filename, { format: 'png', quality: 32, ppi: 72 });
                })
                .then(function() {
                    console.log("Get pixmap by id.");
                    return _generator.getPixmap(documentId, 2, {});
                }).then(function (pixmap) {
                    var filename = path.join(dir, "sample-by-id.png");
                    console.log("Saving to file " + filename);
                    return _generator.savePixmap(pixmap, filename, { format: 'png', quality: 32, ppi: 72 });
                }, function (error) { console.log(error); })
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
