var HomeController = require('./controllers/HomeController');

// Routes
module.exports = function(app){
    // Main Routes

    app.get('/', HomeController.Index);
    app.get('/app', HomeController.App);
    app.get('/genre/:id', HomeController.Genre);
    app.get('/resetGenre/:id', HomeController.ResetGenre);
    app.get('/search/:keywords', HomeController.Search);
    app.get('/admin', HomeController.Admin);
    app.get('/admin/resetSessions', HomeController.ResetSessions);
    app.get('/admin/resetDatabase', HomeController.ResetDatabase);
    app.get('/admin/scanMusic', HomeController.ScanMusic);
};
