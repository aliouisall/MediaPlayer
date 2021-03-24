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
function read_music(data){
    var index = 1; 
    for (var key in data) {
        table_body.innerHTML += '<tr><th scope="row">'+index+'</th><td>'+escapeHtml(data[key])+'</td><td>'+escapeHtml(data[key])+'</td><td>'+escapeHtml(data[key])+'</td></tr>';
        console.log(key + " -> " + data[key]);
        index++;
    }
}
// this requests the file and executes a callback with the parsed result once
fetchJSONFile('playlist.json', function(data){
    read_music(data);
    console.log(data);
});