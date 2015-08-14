var gamecanvas = $('#game-canvas');
var canvasWidth = gamecanvas.attr('width');
var canvasHeight = gamecanvas.attr('height');
var context2d = gamecanvas.get(0).getContext("2d");

function toRadians(degrees){return degrees * Math.PI / 180;}
function toDegrees(radians){return radians / Math.PI * 180;}

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
    angle: toRadians(-25),
    pivot: {
      x: 0,
      y: 0
    },
    x: 150,
    y: 600,
    load: function(){
      var parent = this;
      this.img.onload = function() {
        resourcesLoaded += 1;
        this.width *= imageScale;
        this.height *= imageScale;
        parent.pivot.x = this.width*0.333;
        parent.pivot.y = this.height*0.5;
      };
      this.img.src = this.imgPath;
    },
    draw: function () {
      context2d.save();
      //context2d.setTransform(1, 0, 0, 1, 0, 0);
      context2d.translate(this.x+this.pivot.x, this.y+this.pivot.y);
      var rad = this.angle;
      //console.log("angle:", rad / Math.PI * 180)
      context2d.rotate(rad);
      context2d.drawImage(this.img, -this.pivot.x, -this.pivot.y,
                          this.img.width, this.img.height);
      context2d.restore();
    }
};
cannon.load();

var mouse = {
  x: 0,
  y: 0
};

document.onmousemove = function(e){
    mouse.x = e.pageX;
    mouse.y = e.pageY;
    cannon.angle = Math.max(toRadians(-90) , Math.min(Math.atan2(mouse.y-(cannon.y+cannon.pivot.y), mouse.x-(cannon.x+cannon.pivot.x)), 0));
}

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

var loopInterval = setInterval(update, 33);
