
(function () {
    "use strict";
    var _generator = null,
        _config = null;

    /*********** INIT ***********/
    var path = require('path');
    var mkdirp = require('mkdirp');

    function init(generator, config) {
        _generator = generator;
        _config = config;

        console.log("initializing plugin with config %j", _config);
        
        var dir = path.join(__dirname, "Output");
        var documentId = 0;
        var layers = { firstLayerIndex: 3, lastLayerIndex: 4, hidden: [] };

        function processLayers() {
            // Flip foreground color
            _generator.getDocumentInfo()
                .then(function (document) {
                    documentId = document.id;
                    console.log("Get pixmap without scaling.");
                    var pixmapParamsNoScale = { scaleX: 1, scaleY: 1, clipToDocumentBounds: true };
                    return _generator.getPixmap(documentId, layers, pixmapParamsNoScale);
                })
                .then(function(pixmap) {
                    var filename = path.join(dir, "sample-no-scale.png");
                    console.log("Creating file " + filename);
                    return _generator.savePixmap(pixmap, filename, { format: 'png', quality: 32, ppi: 72 });
                })

                .then(function() {
                    console.log("Get pixmap with 2x scale.");
                    var pixmapParamsDoubleScale = { scaleX: 2, scaleY: 2, clipToDocumentBounds: true };
                    return _generator.getPixmap(documentId, layers, pixmapParamsDoubleScale);
                })
                .then(function (pixmap) {
                    var filename = path.join(dir, "sample-2x-scale.png");
                    console.log("Creating file " + filename);
                    return _generator.savePixmap(pixmap, filename, { format: 'png', quality: 32, ppi: 72 });
                })
                .then(function() {
                    console.log("Get 2x pixmap not clipped to bounds");
                    var pixmapParamsDoubleScale = { scaleX: 2, scaleY: 2, clipToDocumentBounds: false };
                    return _generator.getPixmap(documentId, layers, pixmapParamsDoubleScale);
                }).then(function (pixmap) {
                    var filename = path.join(dir, "sample-2x-scale-no-clip.png");
                    console.log("Creating file " + filename);
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
