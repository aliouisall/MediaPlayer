var data_music;
var data_video;
var title = document.getElementById("title");
var artist = document.getElementById("artist");
var image = document.getElementById("img_track");

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
    image.style.backgroundImage = "url("+music["cover"]+")"
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



//
function validateFile(files){
  const allowedExtensions =  ["mp3"],
        sizeLimit = 20000000; // 20 megabytes
  for (var i = 0; i < files.length ; i++) {
    const { name:fileName, size:fileSize } = files[i];
    const fileExtension = fileName.split(".").pop();

    if(!allowedExtensions.includes(fileExtension)){
      alert("le type de l'un des fichiers n'est pas autorisé");
      return false;
    }else if(fileSize > sizeLimit){
      alert("la taille de l'un des fichiers dépasse 20MB!")
      return false;
    }
  }
  return true;
}
//
let filesDone = 0;
let filesToDo = 0;
let uploadProgress = [];
let progressBar = document.getElementById("progress-bar");

const dropArea = document.getElementById("drop-area");

function preventDefaults(e){
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e){
  dropArea.classList.add("highlight");
}

function unhighlight(e){
  dropArea.classList.remove("highlight");
}

function handleDrop(e){
  // shorthand version
  // ([...e.dataTransfer.files]).forEach((file)=>{console.log("file...",file)});

  const dt = e.dataTransfer;
  const files = dt.files;

  handleFiles(files);
}

function handleFiles(files){
  if (validateFile(files)){
    const filesArray = [...files];
    initializeProgress(filesArray.length);
    filesArray.forEach(uploadFile);
  }
}


function uploadFile(file, i) {
  const url = "../";
  let xhr = new XMLHttpRequest();
  let formData = new FormData();

  xhr.open("POST", url, true);

  xhr.upload.addEventListener("progress", e => {
    updateProgress(i, (e.loaded * 100.0 / e.total) || 100);
  });

  xhr.addEventListener(
    "readystatechange",
    function(resp) {
      if (xhr.status == 200) {
        console.log("done");
      } else{
        let formError = document.getElementById("formError");
        formError.innerHTML = "Une erreur s'est produite lors de l'importation";
        formError.style.visibility = "visible";
      }
    },
    false
    );

  formData.append("file", file);
  xhr.send(formData);
}

["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});
["dragenter", "dragover"].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
});
["dragleave", "drop"].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

dropArea.addEventListener("drop", handleDrop, false);


function initializeProgress(numFiles){
  console.log("entra", numFiles);
  progressBar.style.display = "block";
  progressBar.value = 0;
  uploadProgress = [];

  for (let i = numFiles; i > 0; i--) {
    uploadProgress.push(0);
  }
}

function updateProgress(fileNumber, percent){
  console.log('progress', fileNumber, percent)
  let total;
  uploadProgress[fileNumber] = percent;
  total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length;
  progressBar.value = total;
}

//

function search() {
    var input, filter, table, tr, a, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("table_body");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td0 = tr[i].getElementsByTagName("td")[0];
        td1 = tr[i].getElementsByTagName("td")[1];
        
        txtValue = td0.textContent + td1.textContent;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}
// TODO : PLAYLISTS + MP4