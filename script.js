var data_music;
var data_video;

//function returns the file without the extension
function extract_name(path){
  return path.split('.').slice(0, -1).join('.');
}
//
function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send(); 
}

//
function escapeHtml(str)
{
    var map =
    {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, function(m) {return map[m];});
}
//
function play_music(index){
    title.innerText = data_music["chemin"+(index-1)];
    artist.innerText = data_music["chemin"+(index-1)];

    var audio = document.getElementById('audio');
    var source = document.getElementById('audioSource');
    source.src = data_music["chemin"+(index-1)];

    audio.load(); //call this to just preload the audio without playing
    audio.play(); //call this to play the song right away
}
//
function read_music(){
    var index = 1; 
    for (var key in data_music) {
        table_body.innerHTML += '<tr onclick="play_music('+index+')"><th scope="row">'+index+'</th><td>'+escapeHtml(data_music[key])+'</td><td>'+escapeHtml(data_music[key])+'</td><td>'+escapeHtml(data_music[key])+'</td></tr>';
        index++;
    }
}
// this requests the file and executes a callback with the parsed result once
fetchJSONFile('playlist.json', function(data){
    data_music = data;
    read_music();
    console.log(data);
});


