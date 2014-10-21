/*
 * debug-replacer
 * https://github.com/render22/debug-replacer
 *
 * Copyright (c) 2014 Viktar
 * Licensed under the MIT license.
 */



var fs= require('fs');


module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('debug_replacer', 'Help to avoid shit debugging code in production', function() {

        //console.log(this.options().dir);
        if(!fs.existsSync(this.options().dir))
            throw new Error('Directory '+this.options().dir+' does not exists');

        var dirs=fs.readdirSync(this.options().dir);
        var currentDir=this.options().dir+'/';
        walkAndReplaceRecursive(dirs,currentDir);


  });

  function walkAndReplaceRecursive(dirs,currentDir){

      for(var i in dirs){

          if(fs.lstatSync(currentDir+dirs[i]).isDirectory()) {
              var prevDir=currentDir;
              currentDir+=dirs[i]+'/';
              walkAndReplaceRecursive(fs.readdirSync(prevDir+dirs[i]),currentDir);
          }else if(~dirs[i].indexOf('.js')){

             var file=fs.readFileSync(currentDir+dirs[i]).toString();
             fs.writeFileSync(currentDir+dirs[i],file.replace(/\/\*%\*\/(.*)\/\*%\*\//g,''));


          }

      }



  }

};
