var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');

// Extraction du nom d'un fichier. On élémine toutes les \ avant le nom fu fichier. 
function extpath(dir){
    var i = dir.lastIndexOf('\\');
    var ch = ''
    for(var j=i+1;j<dir.length;j++){
        ch+=dir[j];
    }
        return ch
    }