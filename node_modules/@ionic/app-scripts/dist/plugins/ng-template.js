"use strict";
var template_1 = require('../template');
function ngTemplate(options) {
    if (options === void 0) { options = {}; }
    var pluginutils = require('rollup-pluginutils');
    options.exclude = options.exclude || [
        'node_modules/@angular/**',
        'node_modules/ionic-angular/**',
        'node_modules/rxjs/**'
    ];
    var filter = pluginutils.createFilter(options.include, options.exclude);
    return {
        name: 'ng-template',
        transform: function (source, sourcePath) {
            if (filter(sourcePath)) {
                return template_1.inlineTemplate(options, source, sourcePath);
            }
            return null;
        }
    };
}
exports.ngTemplate = ngTemplate;
