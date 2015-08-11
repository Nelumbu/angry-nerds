var gamecanvas = $('#game-canvas');
var canvasWidth = gamecanvas.attr('width');
var canvasHeight = gamecanvas.attr('height');
var context2d = gamecanvas.get(0).getContext("2d");

var imageScale = 0;
var backgroundImage = new Image();
backgroundImage.loaded = false;
backgroundImage.onload = function () {
	backgroundImage.loaded = true;
};
backgroundImage.src = "img/cenario.png";
imageScale = canvasWidth / /*bg width*/ 2211;

var schoolImage = new Image();
schoolImage.loaded = false;
schoolImage.onload = function () {
	schoolImage.loaded = true;
  schoolImage.width *= imageScale;
  schoolImage.height *= imageScale;
};
schoolImage.src = "img/escola.png";

var lastMillis = new Date().getTime()

function update() {
  var currentMillis = new Date().getTime();
  var deltaMillis = currentMillis - lastMillis;
  lastMillis = currentMillis;

  if (backgroundImage.loaded) {
		context2d.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
	}
  if (schoolImage.loaded) {
    context2d.drawImage(schoolImage, canvasWidth-schoolImage.width, canvasHeight-schoolImage.height,
                        schoolImage.width, schoolImage.height);
  }
}

setTimeout(update, 33);
