//requiring in id3tags.js file.
var config = require('./config');
var mysql = require('mysql');
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database
    }

});

exports.insertSong = function(path, metadata) {
    var title = metadata.title,
        artist = metadata.artist,
        album = metadata.album,
        genre = metadata.genre[0];

    checkGenre(path, metadata);
};

var newlyRegisteredGenre = [];

function checkGenre(path, metadata) {
    var genre = metadata.genre[0];

    knex('genres')
        .where('name', genre)
        .then(function(rows) {

            var nbMatch = rows.length;
            if (nbMatch == 0) {
                // Checking if the genre was already told to be inserted by Mysql
                if (newlyRegisteredGenre.indexOf(genre) == -1) {
                    newlyRegisteredGenre.push(genre);
                    var insertStatement = { id: '', name: genre };

                    knex('genres')
                        .insert(insertStatement)
                        .then(function(rows) {

                            metadata['genre_id'] = rows['insertId'];
                            checkArtist(path, metadata);
                        })
                        .catch(function(error) { console.error(error); });

                }
            } else {
                metadata['genre_id'] = rows[0]['id'];
                checkArtist(path, metadata);

            }
        })
        .catch(function(error) { console.error(error); });
}


var newlyRegisteredArtist = [];

function checkArtist(path, metadata) {
    var artist = metadata.artist;
    knex('artists')
        .where('name', artist)
        .then(function(rows) { 


            var nbMatch = rows.length;// ce code ne semble pas etre exécuté !

            if (nbMatch == 0) {



                if (newlyRegisteredArtist.indexOf(artist) == -1) {
                    newlyRegisteredArtist.push(artist);

                    var insertStatement = { id: '', name: artist };
                    knex('artists').insert(insertStatement)
                        .then(function(rows) {
                            console.log(rows);


                            metadata['artist_id'] = rows['insertId'];
                            checkAlbum(path, metadata);


                        })
                        .catch(function(error) { console.error(error); });
                }
            } else {
                metadata['artist_id'] = rows[0]['id'];
                checkAlbum(path, metadata);
                console.log('d');
            }
        })
        .catch(function(error) { console.error(error); });

}

var newlyRegisteredAlbum = [];

function checkAlbum(path, metadata) {
    var album = metadata.album;
    knex('albums')
        .where('name', album)
        .then(function(rows) {



            nbMatch = rows.length;
            if (nbMatch == 0) {
                if (newlyRegisteredAlbum.indexOf(album) == -1) {
                    newlyRegisteredAlbum.push(album);

                    var insertStatement = { id: '', name: album };
                    knex('albums')
                        .insert(insertStatement)
                        .then(function(rows) {

                            metadata['album_id'] = rows['insertId'];
                            console.log('album id :' + metadata['album_id'])
                            checkSong(path, metadata);
                        })
                        .catch(function(error) { console.error(error); });
                }
            } else {
                metadata['album_id'] = rows[0]['id'];
                checkSong(path, metadata);
            }
        })
        .catch(function(error) { console.error(error); });

}

function checkSong(path, metadata) {
    var genre = metadata.genre[0];
    var genre_id = metadata.genre_id;
    var artist = metadata.artist;
    var artist_id = metadata.artist_id;
    var album = metadata.album;
    var album_id = metadata.album_id;
    var title = metadata.title;

    knex('songs')
        .where('path', path)
        .then(function(rows) {



            // Inserting if match
            nbMatch = rows.length;
            console.log('nbmatch :' + nbMatch);
            if (nbMatch == 0) { //apres un resetdatabase !
                var song = { id: '', name: title, path: path, id_albums: album_id, id_artists: artist_id };
                knex('songs')
                    .insert(song)
                    .then(function(rows) {
                       

                        metadata['song_id'] = rows['insertId']; //n'existe pas!
                        genreAssociation(metadata);
                        
                    })
                    .catch(function(error) { console.error(error); });
            } else {
                
                genreAssociation(metadata);
            }
        })
        .catch(function(error) { console.error(error); });

}

function genreAssociation(metadata) {
    var genre_id = metadata.genre_id;
    
    var song_id = metadata.song_id;
    
    var genreRelation = { id: genre_id, id_songs: song_id };
    
    knex('genreAssociation')
        .insert(genreRelation)
        .catch(function(error) { console.error(error); });
}



/**
// Adding an artist
var artist = {id : '', name: 'Pink Martini'};
connection.query("INSERT INTO artists SET ?", artist, function(err, rows, fields) {
    if (err) throw err;
    console.log('The insert result is: ', rows);
});

// Adding a genre
var genre = {id : '', name: 'Jazz'};
connection.query("INSERT INTO genres SET ?", genre, function(err, rows, fields) {
    if (err) throw err;
    console.log('The insert result is: ', rows);
});

// Adding an album
var album = {id : '', name: 'Sympathique'};
connection.query("INSERT INTO albums SET ?", album, function(err, rows, fields) {
    if (err) throw err;
    console.log('The insert result is: ', rows);
});

// Adding a song
var song = {id : '', name: 'Amado Mio', path: 'Pink Martini/Sympathique/Amado Mio.mp3', id_albums: 2, id_artists : 6};
connection.query("INSERT INTO songs SET ?", song, function(err, rows, fields) {
    if (err) throw err;
    console.log('The insert result is: ', rows);
});

// Adding genre relation
var genreRelation = {id : 3, id_songs: 1};
connection.query("INSERT INTO genreAssociation SET ?", genreRelation, function(err, rows, fields) {
    if (err) throw err;
    console.log('The insert result is: ', rows);
});

// SELECT statement
connection.query("SELECT * FROM songs", function(err, rows, fields) {
    if (err) throw err;
    console.log('The result is: ', rows);
});
*/
