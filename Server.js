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

// Function to show cover from mp3 file
function image_from_arr(picture){
    try {
        var base64String = "";
        for (var i = 0; i < picture.data.length; i++) {
            base64String += String.fromCharCode(picture.data[i]);
        }
        var dataUrl = "data:" + picture.format + ";base64," + Buffer.from(base64String, 'binary').toString('base64');
        return dataUrl;
        //return dataUrl;
    }catch (error) {
        return "images/icon.png"
    }
}

// Some global variables
var fil = [];
var chemin_music = "/songs/";
//function to get tags from mp3 file
function get_tags(next, type, duration, callback){
    jsmediatags.read(next, {
        onSuccess: function(tag) {
            callback(next, type, tag.tags.artist, tag.tags.title, tag.tags.picture, duration);
        },
        onError: function(error) {
          console.log(':(', error.type, error.info);
        }

    });
}
// convet ms to minutes:secondes
function ms_to_minutes(ms){
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    var duration_ = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    return duration_
}
// fill list and write in JSON file
function push_to_fil(next, type, artist, title, picture, duration){
    file_name = path.parse(next).name; // name of the file without extension
    file = path.parse(next).base // name + extension
    path_name_split = file_name.split(" - ");

    if(artist == undefined){
        artist = path_name_split[0];
    }
    if(title == undefined){
        title = path_name_split[1];
    }


    fil.push({"type":type,"artist":artist,"title":title,"path":chemin_music+file,"time":ms_to_minutes(duration),"cover":image_from_arr(picture)});
    write_JSON();
}

function write_JSON(){
    let donnees = JSON.stringify(fil);
    fs.writeFile('playlist.json', '', function(erreur) {
        if (erreur) {
            console.log(erreur)}
        }
    );
    fs.writeFile('playlist.json', donnees, function(erreur) {
        if (erreur) {
            console.log(erreur)}
        }
    );
}

// Extraction des vidéos et audios qui existent dans le serveur et stockage de leurs noms dans un fichier JSON

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
                    buffer = fs.readFileSync(next)
                    duration = getMP3Duration(buffer)                    
                    get_tags(next, "audio", duration, push_to_fil);
                }

            }
		
        }
    }

    catch (error) {

        console.log(error);

    }

    

    //console.log(fil);
}

dir = __dirname + chemin_music;
crawl(dir);

// function returns information about the file
function fetch_info(tag,fil){
    artist = tag.tags.artist;
    title = tag.tags.title;
    fil.push({"type":type,"artist":artist,"title":title,"path":chemin_music+file,"time":millisToMinutesAndSeconds(duration),"cover":""});
}

// Accès au dossier public et affichage du contenu de index.html

app.use(express.static(__dirname + '/'));

app.get('/', function(req, res, next){
  res.render('./index.html');
});

app.post("/", function(req, res){
    if (req.files){
        console.log(req.files)
        var file = req.files.file
        var filename = file.name
        console.log(filename)

        file.mv('./songs/', filename, function(err){
            if(err){
                res.send(err)
            } else {
                res.send("File Uploaded")
            }
        })
    }
})

// Création du port d'ecoute de notre serveur
app.listen(8080, function(){
    console.log(' server running ')
})