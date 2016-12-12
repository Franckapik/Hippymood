// Update with your config settings.
var config = require('./config');
   

module.exports = {

  development: {
    client: 'mysql',
    connection: {
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database
  },
  pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

};
