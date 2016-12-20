var fs = require('fs');
var mm = require('musicmetadata');
var db = require('./database');

exports.scan = function(path) {
    // create a new parser from a node ReadStream
    var parser = mm(fs.createReadStream(path), function (err, metadata) { //mm is the musicmetadata module function.
        if (err) throw err;
        var songMetadata = "Title : " + metadata.title + ", ";
        songMetadata += "Artist : " + metadata.artist[0] + ", ";
        songMetadata += "Album : " + metadata.album + ", ";
        songMetadata += "Genre : " + metadata.genre[0];
        /**console.log('ici :' +  songMetadata); //What about songMetadata ? What is it for ?**/



        // TO DO : properly check the title, artist, album and genre before inserting
        if (metadata.genre[0]) {
            if (metadata.artist[0]) {
                db.insertSong(path, metadata); //database.js function INSERTSONG.
            }
            else {
                console.log("Hey dude! What's happened ? You miss this metadata : " + metadata.title + ", path : " + path +", album : " + metadata.album +", artist : " + metadata.artist + ", genre: " + metadata.genre);
            }
        }
        
    });
};
