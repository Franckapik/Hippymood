var contexteAudio = new (window.AudioContext || window.webkitAudioContext)();
var analyseur = contexteAudio.createAnalyser();

source = contexteAudio.createMediaStreamSource(stream);
source.connect(analyseur);

analyseur.fftSize = 2048;
var tailleMemoireTampon = analyseur.frequencyBinCount;
var tableauDonnees = new Uint8Array(tailleMemoireTampon);

analyseur.getByteTimeDomainData(tableauDonnees);

contexteCanvas.clearRect(0, 0, LARGEUR, HAUTEUR); //clear the canvas

function dessiner() {
	dessin = requestAnimationFrame(dessiner); //make the function looping.
	analyseur.getByteTimeDomainData(tableauDonnees); // get the audio data from the table.

	contexteCanvas.fillStyle = 'rgb(200, 200, 200)';
      contexteCanvas.fillRect(0, 0, LARGEUR, HAUTEUR); //fill the background of the canvas

      contexteCanvas.lineWidth = 2; //epaisseur du trait
      contexteCanvas.strokeStyle = 'rgb(0, 0, 0)'; //color

      contexteCanvas.beginPath(); //start du draw

      var largeurSegment = LARGEUR * 1.0 / tailleMemoireTampon; 
      var x = 0;

      for(var i = 0; i < tailleMemoireTampon; i++) {
   
        var v = tableauDonnees[i] / 128.0;
        var y = v * HAUTEUR/2;

        if(i === 0) {
          contexteCanvas.moveTo(x, y);
        } else {
          contexteCanvas.lineTo(x, y);
        }

        x += largeurSegment;
      }

      contexteCanvas.lineTo(canvas.width, canvas.height/2);
      contexteCanvas.stroke();
};

dessiner();