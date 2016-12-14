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
            table.integer('id').unsigned();
            table.integer('id_songs').unsigned();
            table.primary(['id', 'id_songs']);

        }),

        
    ])
        .then(function() {


            return knex.schema.table('songs', function(table) {

                table.foreign('id_albums').references('albums.id').onUpdate('CASCADE').onDelete('CASCADE');
                table.foreign('id_artists').references('artists.id').onUpdate('CASCADE').onDelete('CASCADE');

            });
        })
        .then(function() {


            return knex.schema.table('genreAssociation', function(table) {

                table.foreign('id').references('genres.id').onUpdate('CASCADE').onDelete('CASCADE');
                table.foreign('id_songs').references('songs.id').onUpdate('CASCADE').onDelete('CASCADE');
                
            });
        })
        .catch(function(error) {
            console.error(error);
        });
};

exports.down = function(knex, Promise) {
    return Promise.all([
    	knex.schema.dropTableIfExists('genreAssociation'),
    	knex.schema.dropTableIfExists('genres'),
    	knex.schema.dropTableIfExists('songs'),
    	knex.schema.dropTableIfExists('artists'),
        knex.schema.dropTableIfExists('albums'),
        knex.schema.dropTableIfExists('sessions')
        
        
        
        /*knex.schema.dropTable('sessions')*/
    ]);
};
