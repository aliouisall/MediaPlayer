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
    music = data_music[index];
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

function stopDefault(event) {
    event.preventDefault();
    event.stopPropagation();
}
function dragOver(label, text) {
    /* ADD ALMOST ANY STYLING YOU LIKE */
    label.style.animationName = "dropbox";
    label.innerText = text;
}
function dragLeave(label) {
    /* THIS SHOULD REMOVE ALL STYLING BY dragOver() */
    var len = label.style.length;
    for(var i = 0; i < len; i++) {
        label.style[label.style[i]] = "";
    }
    label.innerText = "Click to choose images or drag-n-drop them here";
}
function addFilesAndSubmit(event) {
    var files = event.target.files || event.dataTransfer.files;
    document.getElementById("filesfld").files = files;
    submitFilesForm(document.getElementById("filesfrm"));
}
function submitFilesForm(form) {
    var label = document.getElementById("fileslbl");
    dragOver(label, "Uploading images..."); // set the drop zone text and styling
    var fd = new FormData();
    for(var i = 0; i < form.filesfld.files.length; i++) {
        var field = form.filesfld;
        fd.append(field.name, field.files[i], field.files[i].name);
    }
    var progress = document.getElementById("progress");
    var x = new XMLHttpRequest();
    if(x.upload) {
        x.upload.addEventListener("progress", function(event){
            var percentage = parseInt(event.loaded / event.total * 100);
            progress.innerText = progress.style.width = percentage + "%";
        });
    }
    x.onreadystatechange = function () {
        if(x.readyState == 4) {
            progress.innerText = progress.style.width = "";
            form.filesfld.value = "";
            dragLeave(label); // this will reset the text and styling of the drop zone
            if(x.status == 200) {
                var images = JSON.parse(x.responseText);
                for(var i = 0; i < images.length; i++) {
                    var img = document.createElement("img");
                    img.src = images[i];
                    document.body.appendChild(img);
                }
            }
            else {
                // failed - TODO: Add code to handle server errors
            }
        }
    };
    x.open("post", form.action, true);
    x.send(fd);
    return false;
}