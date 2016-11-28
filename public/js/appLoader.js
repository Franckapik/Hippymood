var robotoLoaded = 0
    genericFunctionsLoaded = 0
    appHTMLLoaded = 0
    appHTML = ""; //at the beginning, appHTML is empty (before display function)
    ;
function initGenrePlayer() {
    function display() {
        // Load app HTML
        var appData = document.getElementById("appData"); //here is the div of the app, loading with data.
        appData.innerHTML = appHTML; //fill the div balise with the data.
        // Getting MDL working with the new elements
        componentHandler.upgradeDom();


        loadScript(
            "/public/js/ui.js", 
            function() {
                loadScript("/public/js/events.js");
            }
        );

        /* Loading dialog polyfill */
        loadScript(
            "/public/js/dialog-polyfill/dialog-polyfill.js", //polyfill for browsers which do not support <dialog>.
            function () {
                var button = document.getElementById('show-dialog');
                var dialog = document.getElementsByClassName('mdl-dialog')[0];

                if (! dialog.showModal)
                    dialogPolyfill.registerDialog(dialog);

                button.addEventListener('click', function() {
                    dialog.showModal();
                });
                dialog.querySelector('.close').addEventListener('click', function() {
                    dialog.close();
                });
            }
        );

        // Hide spinner when app is loaded
        var appSpinner = document.getElementById("appLoadSpinner");
        addClass(appSpinner,"hideOpacity");

        // Update UI on first genre click
        var buttons = document.querySelectorAll("div.genreList button");
        Array.prototype.forEach.call(buttons, function(el) {
            el.addEventListener("click", playerInit, false);
        });
    }
    if (robotoLoaded && genericFunctionsLoaded && appHTMLLoaded) {
        // Stopping timeout and loading
        window.clearTimeout(loaderTimeout);
        display();
    }
    else {
        // Starting 
        if (typeof loaderTimeout == 'undefined')
            loaderTimeout = window.setTimeout(display, 5000);
    }
}
loadScript("/public/js/fontdetect.js", function() {
    FontDetect.onFontLoaded (
        'Roboto', 
        function() {
            robotoLoaded = 1;
            initGenrePlayer();
        },
        onItDidntLoad, 
        {msTimeout: 3000}
    );
    function onItDidntLoad (fontname) {
        console.log(fontname + " didn't load within 3 seconds");
    }
});
loadScript(
    "/public/js/vue.js", 
    function() {
        loadScript(
            "/public/js/genericFunctions.js", 
            function() {
                genericFunctionsLoaded = 1;
                retrieveAppHTML();
                initGenrePlayer();
            }
        );
    }
);




/* Function to display player and hide intro text */
var playerInit = function (event) {
    var intro = document.getElementById("intro");
    intro.setAttribute("style", "display: none");
    var app = document.getElementById("app");
    app.style.display = "";
    var title = document.getElementById("title");
    title.style.display = "";

    window.removeEventListener('click',playerInit, false );
    loadScript("/public/js/audiovue.js", function(){});
};
function retrieveAppHTML() { //get the app 
    getAjax("/app", function(data){ 
        appHTML = data;
        appHTMLLoaded = 1;
        initGenrePlayer();
    });
}
loadStyleSheet("/public/css/style.css", function() {});
loadStyleSheet("/public/js/dialog-polyfill/dialog-polyfill.css", function() {});
