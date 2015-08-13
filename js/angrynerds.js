var gamecanvas = $('#game-canvas');
var canvasWidth = gamecanvas.attr('width');
var canvasHeight = gamecanvas.attr('height');
var context2d = gamecanvas.get(0).getContext("2d");

var imageScale = canvasWidth / /*bg width*/ 2211;
var resourcesLoaded = 0;
var backgroundImage = new Image();
backgroundImage.loaded = false;
backgroundImage.onload = function () {
  resourcesLoaded += 1;
};
backgroundImage.src = "img/cenario.png";


var schoolImage = new Image();
schoolImage.onload = function () {
  resourcesLoaded += 1;
  schoolImage.width *= imageScale;
  schoolImage.height *= imageScale;
};
schoolImage.src = "img/escola.png";

var cannonBaseImage = new Image();
cannonBaseImage.onload = function () {
  resourcesLoaded += 1;
  cannonBaseImage.width *= imageScale;
  cannonBaseImage.height *= imageScale;
};
cannonBaseImage.src = "img/suporte_canhao.png";

var cannon = {
    imgPath: "img/canhao.png",
    img: new Image(),
    angle: 30,
    load: function(){
      this.img.onload = function() {
        resourcesLoaded += 1;
        this.width *= imageScale;
        this.height *= imageScale;
      };
      this.img.src = this.imgPath;
    },
    draw: function () {
      context2d.drawImage(this.img, 160, 570,
                          this.img.width, this.img.height);
    }
};
cannon.load();

var alfredo = {
  imgPath: "img/alfredo.png",
  x: 0,
  y: 0,
};

var lastMillis = new Date().getTime()
function update() {
  var currentMillis = new Date().getTime();
  var deltaMillis = currentMillis - lastMillis;
  lastMillis = currentMillis;

  if(resourcesLoaded >= 4) {
		context2d.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
    context2d.drawImage(schoolImage, canvasWidth-schoolImage.width, canvasHeight-schoolImage.height,
                        schoolImage.width, schoolImage.height);
    cannon.draw();
    context2d.drawImage(cannonBaseImage, 160, 620,
                        cannonBaseImage.width, cannonBaseImage.height);
  }

}

setTimeout(update, 33);
