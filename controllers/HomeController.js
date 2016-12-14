var mysql = require('mysql');
var config = require('../config');
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database

    },

    directory : '../migration',
        
});

//randomize array element by Durstenfeld shuffle algorithm
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// Loading configuration file with database credentials
var config = require('./../config');
var connection = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    multipleStatements: true
});


//render Index.pug
exports.Index = function(req, res) {
    res.render('index');
};

//read database, rendering list of genre, sending by Ajax.
exports.App = function(req, res) {

    knex.select('genres.id', 'genres.name')
        .count('songs.id as nbSongs')
        .from('songs')
        .join('genreAssociation', 'songs.id', '=', 'genreAssociation.id_songs')
        .join('genres', 'genreAssociation.id', '=', 'genres.id')
        .groupBy('genres.id')
        .orderBy('nbSongs', 'desc')
        .then(function(rows) {
            var topGenre = [];
            for (var o = 0; o < config.nbTopGenre; o++) {
                topGenre.push(rows.shift()); //add genre in the array topgenre.

            }
            var randomRows = topGenre.concat(shuffleArray(rows)); //randomize the array (shuffleArray function)
            console.log(randomRows);

            res.render('app', { genres: randomRows });

        })
        .catch(function(error) {
            console.error(error);
        });

};
/**






 var SQLquery = 'SELECT genres.id, genres.name, COUNT(songs.id) AS nbSongs ';
        SQLquery += 'FROM songs ';
        SQLquery += 'JOIN genreAssociation ON songs.id = genreAssociation.id_songs ';
        SQLquery += 'JOIN genres ON genreAssociation.id = genres.id ';
        SQLquery += 'GROUP BY genres.id ';
        SQLquery += 'ORDER BY nbSongs DESC ';

    connection.query(SQLquery, function(err, rows, fields) {
        if (err)
            console.log(err);
        else {
            
            var topGenre = [];
            for (var o = 0; o < config.nbTopGenre; o++) {
                topGenre.push(rows.shift());
            }
            var randomRows = topGenre.concat(shuffleArray(rows));
            console.log(randomRows);
            res.render('app', {genres: randomRows});
        }
    });
};
//renvoie les données genres.

**/
//rendering admin.pug
exports.Admin = function(req, res) {
    res.render('admin');
};

// Function to get song infos by submitting a genre
exports.Genre = function(req, res) {
    // Disabling cache for myurl.com/genre/id URLs to prevent some browser to play the same song again and again and again...
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);

    var genre = req.params.id;
    console.log('genre = ' + genre);

    var query = knex.select('songs.id', 'songs.name as song', 'songs.path') //faire multiples join a la place des where
        .from('songs')
        .join('genreAssociation', 'songs.id', '=', 'genreAssociation.id_songs')

    .join('artists', 'songs.id_artists', '=', 'artists.id')
        .join('albums', 'songs.id_albums', '=', 'albums.id')
        .where('genreAssociation.id', req.params.id);

    if (req.session.playedSongs && req.session.playedSongs.length != 0 && req.session.playedSongs != []) {
        query.whereNotIn('songs.id', req.session.playedSongs);
    }

    query.then(function(rows) {


            if (rows.length > 0) {
                var randomIndex1 = Math.floor(Math.random() * rows.length);

                var randomSongs = [];
                randomSongs.push(rows[randomIndex1]);

                // Selecting next song as well if possible
                if (rows.length > 1) {
                    var randomIndex2 = randomIndex1;
                    do {
                        randomIndex2 = Math.floor(Math.random() * rows.length);
                    } while (randomIndex1 == randomIndex2);
                    randomSongs.push(rows[randomIndex2]);
                }

                // -1 to count the one being played
                var infos = { nbSongLeft: rows.length - 1 };



                // Saving song played id
                if (req.session.playedSongs == undefined)
                    req.session.playedSongs = [randomSongs[0]['id']];
                else
                    req.session.playedSongs.push(randomSongs[0]['id']);

                var response = {
                    songs: randomSongs,
                    infos: infos
                };



                res.send(response);
            } else {
                var error = { "allSongGenrePlayed": 1 };
                res.send({ error });
            }
        })
        .catch(function(error) {
            console.error(error);
        });

};

// Function to get song infos by submitting a genre (search function)
exports.Search = function(req, res) {
    var keywords = req.params.keywords;
    var keywordsUC = '%' + keywords.toUpperCase() + '%';
    console.log(keywordsUC);


    var query = knex.select('songs.id', 'songs.name as song', 'songs.path')
        .from('songs')
        .join('genreAssociation', 'songs.id', '=', 'genreAssociation.id_songs')
        .join('artists', 'songs.id_artists', '=', 'artists.id')
        .join('albums', 'songs.id_albums', '=', 'albums.id')
        .join('genres', 'genres.id', '=', 'genreAssociation.id')


    .where('songs.name', 'like', keywordsUC)
        .orWhere('artists.name', 'like', keywordsUC)
        .orWhere('albums.name', 'like', keywordsUC);


    console.log(query.toSQL());
    query.then(function(rows) {
        console.log(rows);
        console.log(query);
        var data = {};
        if (rows.length > 0)
            data.searchResults = rows;
        res.send(data); //sending results of the search req.params.keywords

    })

    .catch(function(error) {
        console.error(error);
    });


    /*var SQLquery = 'SELECT songs.id, songs.name AS song, artists.name AS artist, songs.path, albums.name AS album, genres.name AS genre ';
    SQLquery += 'FROM songs, genreAssociation, genres, artists, albums ';
    SQLquery += 'WHERE songs.id = genreAssociation.id_songs ';
    SQLquery += 'AND genres.id = genreAssociation.id ';
    SQLquery += 'AND songs.id_artists = artists.id ';
    SQLquery += 'AND songs.id_albums = albums.id ';
    SQLquery += 'AND ( ';
    SQLquery += 'UCASE(songs.name) LIKE "%' + keywordsUC + '%" ';
    SQLquery += 'OR UCASE(artists.name) LIKE "%' + keywordsUC + '%" ';
    SQLquery += 'OR UCASE(albums.name) LIKE "%' + keywordsUC + '%" ';
    SQLquery += ') ';

    connection.query(SQLquery, function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            var data = { err: '' };
            if (rows.length === 0) {
                data.err = "No result found for : " + keywords;
            } else {
                data.searchResults = rows;
            }
            res.send(data); //sending results of the search req.params.keywords
        }
    });*/
};

// Reset list of songs stored in sessions
exports.ResetGenre = function(req, res) {
    var genreId = req.params.id;
    console.log("Reseting session stored played songs for genre " + genreId);

    knex.select('*')
        .from('genreAssociation')
        .where('id', genreId)
        .then(function(rows) {
            rows.forEach(function(entry, index) {
                var i = req.session.playedSongs.indexOf(entry.id_songs);
                req.session.playedSongs.splice(i, 1);
            });
            res.send("Le Genre " + genreId + ' a été supprimé!');

        })
        .catch(function(error) {
            console.error(error);
        });


    /*connection.query('SELECT * FROM genreAssociation WHERE id = ' + genreId, function(err, rows, fields) {
        rows.forEach(function(entry, index) {
            var i = req.session.playedSongs.indexOf(entry.id_songs);
            req.session.playedSongs.splice(i, 1);
        });
        res.send("Genre ID : " + genreId);
    });*/
};

// Reset sessions
exports.ResetSessions = function(req, res) {
    req.session.playedSongs = [];
    res.send("Done");
};

// Reset list of songs stored in sessions
exports.ResetDatabase = function(req, res) {

    knex.migrate.latest()
        /* knex('genreAssociation').del();
         knex('genres').del();
         knex('songs').del();
         knex('artists').del();
         knex('albums').del();/*
         knex('sessions').del() //problem a deletion database. fk
         

         */
        .then(

            res.send("Bim bim") ,
            console.log('migration latest')

        )
        .catch(function(error) {
            console.error(error);
        });

    /*connection.query("DELETE FROM genreAssociation; DELETE FROM genres; DELETE FROM songs; DELETE FROM artists; DELETE FROM albums; DELETE FROM sessions;", function(err, results) {
        res.send("Bim bim");
    });*/
};


exports.ScanMusic = function(req, res) {

    // Loading tags processing
    var id3tags = require('../id3tags');

    var fs = require('fs');
    var path = require('path');

    var walk = function(dir) { //creation of the reading file function (why the name is walk??)
        var results = []
        var list = fs.readdirSync(dir)
        list.forEach(function(file) {
            file = dir + '/' + file
            var stat = fs.statSync(file)
            if (stat && stat.isDirectory()) results = results.concat(walk(file))
            else results.push(file)
        })
        return results
    }

    var files = walk("music"); //reading the music folder

    // loop through array with all new ids
    var i = 0,
        l = files.length;
    console.log("The Groovy scan is on! ");
    (function iterator() {
        var filename = files[i];
        if (filename.slice(-3) == "mp3") {
            id3tags.scan(filename); //id3tags scan function (required).
        }

        if (++i < l) {
            setTimeout(iterator, 50);
        } else {
            console.log("Let's dance now ! (Scan done)");
            res.send("Done"); //Could be usefull to render a file list on the browser ?
        }
    })();
};
