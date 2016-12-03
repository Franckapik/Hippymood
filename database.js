var mysql = require('mysql');

// Loading configuration file with database credentials
var config = require('./config');
var connection = mysql.createConnection({
    host     : config.db.host,
    user     : config.db.user,
    password : config.db.password,
    database : config.db.database
});

exports.insertSong = function(path, metadata) {
    var title = metadata.title
        artist = metadata.artist
        album = metadata.album
        genre = metadata.genre[0]
        ;

    checkGenre(path, metadata);
}

var newlyRegisteredGenre = [];

function checkGenre(path, metadata) {
    var genre = metadata.genre[0];

    connection.query('SELECT * FROM genres WHERE name = "' + genre + '"', function(err, rows, fields) {
        if (err) throw err;

        var nbMatch = rows.length;
        if (nbMatch == 0) {
            // Checking if the genre was already told to be inserted by Mysql
            if (newlyRegisteredGenre.indexOf(genre) == -1 ) {
                newlyRegisteredGenre.push(genre);
                var insertStatement = {id : '', name: genre};
                connection.query("INSERT INTO genres SET ?", insertStatement, function(err, rows, fields) {
                    if (err) {
                        console.log("Error while inserting genre for song : " + metadata.title + ", path : " + metadata.path +", album : " + metadata.album +", artist : " + metadata.artist + ", genre: " + metadata.genre);
                        throw err;
                    }
                    metadata['genre_id'] = rows['insertId'];
                    checkArtist(path, metadata);
                });
            }
        }
        else {
            metadata['genre_id'] = rows[0]['id'];
            checkArtist(path, metadata);
        }
    });
}

var newlyRegisteredArtist = [];

function checkArtist(path, metadata) {
    var artist = metadata.artist;

    connection.query('SELECT * FROM artists WHERE name = "' + artist + '"', function(err, rows, fields) {
        if (err) throw err;

        var nbMatch = rows.length;
        if (nbMatch == 0) {
            /*
             * TO DO : Fix pour éviter d'insérer plusieurs fois le même artiste
             */
            if (newlyRegisteredArtist.indexOf(artist) == -1 ) {
                newlyRegisteredArtist.push(artist);

                var insertStatement = {id : '', name: artist};
                connection.query("INSERT INTO artists SET ?", insertStatement, function(err, rows, fields) {
                    if (err) {
                        console.log("Error while inserting artist for song : " + metadata.title + ", path : " + metadata.path +", album : " + metadata.album +", artist : " + metadata.artist + ", genre: " + metadata.genre);
                        throw err;
                    }
                    metadata['artist_id'] = rows['insertId'];
                    checkAlbum(path, metadata);
                });
            }
        }
        else {
            metadata['artist_id'] = rows[0]['id'];
            checkAlbum(path, metadata);
        }
    });
}

var newlyRegisteredAlbum = [];

function checkAlbum(path, metadata) {
    var album = metadata.album;

    connection.query('SELECT * FROM albums WHERE name = "' + album + '"', function(err, rows, fields) {
        if (err) throw err;

        nbMatch = rows.length;
        if (nbMatch == 0) {
            if (newlyRegisteredAlbum.indexOf(album) == -1 ) {
                newlyRegisteredAlbum.push(album);

                var insertStatement = {id : '', name: album};
                connection.query("INSERT INTO albums SET ?", insertStatement, function(err, rows, fields) {
                    if (err) {
                        console.log("Error while inserting album for song : " + metadata.title + ", path : " + metadata.path +", album : " + metadata.album +", artist : " + metadata.artist + ", genre: " + metadata.genre);
                        throw err;
                    }
                    metadata['album_id'] = rows['insertId'];
                    checkSong(path, metadata);
                });
            }
        }
        else {
            metadata['album_id'] = rows[0]['id'];
            checkSong(path, metadata);
        }
    });
}

function checkSong(path, metadata) {
    var genre = metadata.genre[0];
    var genre_id = metadata.genre_id;
    var artist = metadata.artist;
    var artist_id = metadata.artist_id;
    
    var album = metadata.album;
    var album_id = metadata.album_id;
    var title = metadata.title ;

    connection.query('SELECT * FROM songs WHERE path = "' + path + '"', function(err, rows, fields) {
        if (err) throw err;

        // Inserting if match
        nbMatch = rows.length;
        if (nbMatch == 0) {
            var song = {id : '', name: title, path: path, id_albums: album_id, id_artists : artist_id};
            connection.query("INSERT INTO songs SET ?", song, function(err, rows, fields) {
                if (err) {
                    console.log("Error while inserting song : " + metadata.title + ", path : " + metadata.path +", album : " + metadata.album +", artist : " + metadata.artist + ", genre: " + metadata.genre);
                    throw err;
                }
                metadata['song_id'] = rows['insertId'];
                console.log(metadata['song_id']);
                genreAssociation(metadata);
            });
        }
    });
}

function genreAssociation(metadata) {
    genre_id = metadata.genre_id;
    song_id = metadata.song_id;
    var genreRelation = {id : genre_id, id_songs: song_id};
    connection.query("INSERT INTO genreAssociation SET ?", genreRelation, function(err, rows, fields) {
            if (err) {
                console.log("Error while associating genre to the song : " + metadata.title + ", path : " + metadata.path +", album : " + metadata.album +", artist : " + metadata.artist + ", genre: " + metadata.genre);
                throw err;
            }
            else
                console.log("Song successfully inserted for : " + metadata.title + ", path : " + metadata.path +", album : " + metadata.album +", artist : " + metadata.artist + ", genre: " + metadata.genre);
    });
}

/*
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