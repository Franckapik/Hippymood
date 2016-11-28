
function visual (){
var stream = document.querySelector('audio');
var streamsrc = stream.getAttribute("src");
console.log(streamsrc);
var contexteAudio = new (window.AudioContext || window.webkitAudioContext)();
var analyseur = contexteAudio.createAnalyser();

source = contexteAudio.createMediaElementSource(stream);
source.connect(analyseur);

analyseur.fftSize = 512;
var tailleMemoireTampon = analyseur.frequencyBinCount;
var tableauDonnees = new Uint8Array(tailleMemoireTampon);

analyseur.getByteTimeDomainData(tableauDonnees);


var canvas = document.getElementById('canvas');
if(!canvas)
        {
            alert("Impossible de récupérer le canvas");
            
        }
var contexteCanvas = canvas.getContext('2d');
       
var LARGEUR = 500;
var HAUTEUR = 300;

contexteCanvas.clearRect(0, 0, LARGEUR, HAUTEUR); //clear the canvas

function dessiner() {

	dessin = requestAnimationFrame(dessiner); //make the function looping.
	analyseur.getByteTimeDomainData(tableauDonnees); // get the audio data from the table.

	 var centerX = canvas.width / 3;
      var centerY = canvas.height / 3;
      var radius = tableauDonnees[i]/3;

      contexteCanvas.beginPath();
      contexteCanvas.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      contexteCanvas.fillStyle = 'green';
      contexteCanvas.fill();
      contexteCanvas.lineWidth = 5;
      contexteCanvas.strokeStyle = '#003300';
      contexteCanvas.stroke();

	
};

dessiner();

};


var player = document.getElementById("playerHTML5");
player.addEventListener("playing", visual, true )
