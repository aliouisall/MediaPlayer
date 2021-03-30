var data_music;
var data_video;
var title = document.getElementById("title");
var artist = document.getElementById("artist");

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
    music = data_music[index];
    console.log(music);
    title.innerText = music["title"];
    artist.innerText = music["artist"];

    var audio = document.getElementById('audio');
    var source = document.getElementById('audioSource');
    source.src = music["path"];

    audio.load(); //call this to just preload the audio without playing
    audio.play(); //call this to play the song right away
}
//
function read_music(){
    for (var i=0; i<data_music.length; i++) {
        table_body.innerHTML += '<tr onclick="play_music('+i+')"><th scope="row">'+(i+1)+'</th><td>'+escapeHtml(data_music[i].artist)+'</td><td>'+escapeHtml(data_music[i].title)+'</td><td>'+escapeHtml(data_music[i].time)+'</td></tr>';
    }
}
// this requests the file and executes a callback with the parsed result once
fetchJSONFile('playlist.json', function(data){
    data_music = data;
    play_music(0);
    read_music();
});

