var express = require('express'); // npm install express
var app = express();
var fs = require('fs');
var path = require('path');
var jsmediatags = require('jsmediatags') // npm install jsmediatags --save   // https://github.com/aadsm/JavaScript-ID3-Reader
getMP3Duration = require('get-mp3-duration') // npm install --save get-mp3-duration


// Extraction du nom d'un fichier. On élémine toutes les \ avant le nom fu fichier

function extpath(dir){
    var i = dir.lastIndexOf('\\');
    var ch = ''
    for(var j=i+1;j<dir.length;j++){
        ch+=dir[j];
    }
        return ch
    }
// Converting milliseconds to minutes and seconds
function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

// Extraction des vidéos et audios qui existent dans le serveur et stockage de leurs noms dans un fichier JSON

var j=0;
var fil = [];
var chemin_music = "/songs/";
function crawl(dir){

	var files = fs.readdirSync(dir);

	try {

        for (var x in files) {
                
            var next = path.join(dir,files[x]);
            
            if (fs.lstatSync(next).isDirectory()==true) {

                crawl(next);

            }
            else {
                
                var ext = path.extname(next); // extension of the file
                file_name = path.parse(next).name; // name of the file without extension
                file = path.parse(next).base // name + extension

                path_name_split = file_name.split(" - ");

                if (ext=='.mp3'){

                    artist = path_name_split[0];
                    title = path_name_split[1];
                    type = "audio";
                    cover = "";

                    jsmediatags.read(next, {
                        onSuccess: function(tag) {
                            artist = tag.tags.artist;
                            title = tag.tags.title;
                            console.log(tag.tags.artist);
                            type = "audio";
                            cover = "";
                        }
                    });
                    buffer = fs.readFileSync(next)
                    duration = getMP3Duration(buffer)
                    

                    fil.push({"type":type,"artist":artist,"title":title,"path":chemin_music+file,"time":millisToMinutesAndSeconds(duration),"cover":""});
                    
                    j+=1;
                
                }

            }
		
        }
    }

    catch (error) {

        console.log(error);

    }

    let donnees = JSON.stringify(fil);
    fs.writeFile('playlist.json', donnees, function(erreur) {
        if (erreur) {
            console.log(erreur)}
        }
    );

    //console.log(fil);
}

dir = __dirname + chemin_music;
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