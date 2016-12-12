exports.up = function(knex, Promise) {
  
    return Promise.all([
        knex.schema.createTable('albums', function(table) {
                table.increments();
                table.string('name');
        }),
        
        knex.schema.createTable('artists', function(table) {
            table.increments();
            table.string('name');
        }),
        
        knex.schema.createTable('genres', function(table) {
            table.increments();
            table.string('name');
        }),
        
        knex.schema.createTable('songs', function(table) {
            table.increments();
            table.string('name');
            table.string('path');
            table.integer('id_albums').unsigned();
            table.integer('id_artists').unsigned();
        }),

        knex.schema.createTable('genreAssociation', function(table) {
            table.integer('id').references('genres.id');
            table.integer('id_songs').references('songs.id').unsigned();
            table.primary(['id', 'id_songs']);

        }),

        
    ])
        .then(function() {


            return knex.schema.table('songs', function(table) {

                table.foreign('id_albums').references('albums.id');
                table.foreign('id_artists').references('artists.id');

            });
        })
        /*.then(function() {


            return knex.schema.table('genreAssociation', function(table) {

                table.foreign('id').references('genres.id');
                table.foreign('id_songs').references('songs.id');
                
            });
        })*/
        .catch(function(error) {
            console.error(error);
        });
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('albums'),
        knex.schema.dropTable('artists'),
        knex.schema.dropTable('genres'),
        knex.schema.dropTable('songs')
        /*knex.schema.dropTable('sessions')*/
    ]);
};
