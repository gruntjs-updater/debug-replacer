/*
 * debug-replacer
 * https://github.com/render22/debug-replacer
 *
 * Copyright (c) 2014 Viktar
 * Licensed under the MIT license.
 */


var fs = require('fs');

var skipDir=[];
module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('debug_replacer', 'Help to avoid shit debugging code in production', function () {

        var scanDir = this.options().dir;
        skipDir = this.options().skip ? this.options().skip : [];
        if (!fs.existsSync(scanDir))
            throw new Error('Directory ' + scanDir + ' does not exists');

        var dirs = fs.readdirSync(scanDir);
        var startDir = scanDir;
        walkAndReplaceRecursive(dirs, startDir);


    });

    function walkAndReplaceRecursive(dirs, currentDir) {

        for (var i in dirs) {

            if (fs.lstatSync(currentDir + '/' + dirs[i]).isDirectory()) {
                if (~skipDir.indexOf(dirs[i]))
                    continue;
                walkAndReplaceRecursive(fs.readdirSync(currentDir + '/' + dirs[i]), currentDir + '/' + dirs[i]);
            } else if (~dirs[i].indexOf('.js')) {

                var file = fs.readFileSync(currentDir + '/' + dirs[i]);
                if(file){
                    var fileContent=file.toString();
                    fs.writeFileSync(currentDir + '/' + dirs[i], fileContent.replace(/\/\*%\*\/([\s\S]*)\/\*%\*\//g, ''));
                }



            }

        }


    }

};
