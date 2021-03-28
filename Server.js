var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');

// Extraction du nom d'un fichier. On élémine toutes les \ avant le nom fu fichier

function extpath(dir){
    var i = dir.lastIndexOf('\\');
    var ch = ''
    for(var j=i+1;j<dir.length;j++){
        ch+=dir[j];
    }
        return ch
    }


// Extraction des vidéos et audios qui existent dans le serveur et stockage de leurs noms dans un fichier JSON

var j=0;
var fil = {};
var chemin = "";
function crawl(dir){

	var files = fs.readdirSync(dir);

	try {

        for (var x in files) {
                
            var next = path.join(dir,files[x]);
            
            if (fs.lstatSync(next).isDirectory()==true) {

                crawl(next);

            }

            else {
                
                var ext = next[next.length-3]+ next[next.length-2] + next[next.length-1];

                if (ext=='mp3' || ext=="mp4") {
                
                chemin ="chemin"+j;
                fil[chemin] = extpath(next);
                
                j+=1;
                
                }

            }
		
        }
    }

    catch (error) {

        console.log(error);

    }

    let donnees = JSON.stringify(fil);
//     fs.writeFile('playlist.json', donnees, function(erreur) {
//         if (erreur) {
//             console.log(erreur)}
//         }
// );


// console.log(fil);

}

dir = __dirname;
crawl(dir);

// Accès au dossier public et affichage du contenu de index.html

app.use(express.static(__dirname + '/'));

app.get('/', function(req, res, next){
  res.render('./index.html');
});


// Création du port d'ecoute de notre serveur
app.listen(8080, function(){
    console.log(' server running ')
})