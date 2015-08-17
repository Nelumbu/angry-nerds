var gamecanvas = $('#game-canvas');
var canvasWidth = gamecanvas.attr('width');
var canvasHeight = gamecanvas.attr('height');
var canvasRect = gamecanvas.get(0).getBoundingClientRect();
var context2d = gamecanvas.get(0).getContext("2d");

function toRadians(degrees){return degrees * Math.PI / 180;}
function toDegrees(radians){return radians / Math.PI * 180;}

var nerdIndex = 0;
var nerdsPositions = [{x:330,y:680}, {x:430,y:680}, {x:520,y:680}];
var trollPositions = [{x:880,y:660}, {x:1030,y:445}, {x:1190,y:340}];
var imageScale = canvasWidth / /*bg width*/ 2211;
var resourcesLoaded = 0;
var backgroundImage = new Image();
backgroundImage.loaded = false;
backgroundImage.onload = function () {
  resourcesLoaded += 1;
};
backgroundImage.src = "img/cenario.png";

function onResourceLoaded() {
  resourcesLoaded += 1;
  this.width *= imageScale;
  this.height *= imageScale;
}

var schoolImage = new Image();
schoolImage.onload = onResourceLoaded;
schoolImage.src = "img/escola.png";

var forceImage = new Image();
forceImage.onload = onResourceLoaded;
forceImage.src = "img/barra_de_forca.png";

var cannonBaseImage = new Image();
cannonBaseImage.onload = onResourceLoaded;
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
      context2d.setTransform(1, 0, 0, 1, 0, 0);
      context2d.translate(this.x+this.pivot.x, this.y+this.pivot.y);
      var rad = this.angle;
      context2d.rotate(rad);
      context2d.drawImage(this.img, -this.pivot.x, -this.pivot.y,
                          this.img.width, this.img.height);
      context2d.restore();
    },
    update: function (deltaMillis) {
      if(forceArrow.active) {
        this.angle = Math.max(toRadians(-90), 
                     Math.min(Math.atan2(mouse.y-(this.y+this.pivot.y),
                     mouse.x-(this.x+this.pivot.x)), 0));
      } else {
        //this.angle = toRadians(-25);
      }
    }
};
cannon.load();

var forceArrow = {
  imgPath: "img/seta_forca.png",
  img: new Image(),
  x: 50,
  y: canvasHeight * 0.5,
  maxY: 0,
  minY: 0,
  force: 0,
  signal: 1,
  active: false,
  load: function(){
    this.img.onload = onResourceLoaded;
    this.img.src = this.imgPath;
  },
  draw: function () {
    if (this.maxY == 0 || this.minY == 0) {
      this.minY = 10+canvasHeight*0.5-forceImage.height*0.5;
      this.maxY = this.minY + forceImage.height-10;
    }
    this.y = this.maxY - (this.maxY - this.minY) * this.force;
    context2d.drawImage(this.img, this.x, this.y-this.img.height*0.5,
                        this.img.width, this.img.height);
  },
  update: function (deltaMillis) {
    if(this.active){
      this.force += deltaMillis/1000 * this.signal;
      if (this.force >= 1 && this.signal > 0){
        this.force = 1;
        this.signal *= -1;
      } else if (this.force <= 0 && this.signal < 0) {
        this.force = 0;
        this.signal *= -1;
      }
    } else {
      this.force = 0;
      this.signal = 1;
    }
  }
};
forceArrow.load();

function collisionDetection(objA, objB){
  var result = false;
  var distanceX = (objB.x-objB.img.width*0.5)-(objA.x-objA.img.width*0.5);
  var distanceY = (objB.y-objB.img.height*0.5)-(objA.y-objA.img.height*0.5);
  var distanceLen = Math.sqrt(distanceX*distanceX + distanceY*distanceY);
  var radiusA = Math.max(objA.img.width, objA.img.height) * 0.5;
  var radiusB = Math.max(objB.img.width, objB.img.height) * 0.5;
  if(distanceLen <= (radiusA+radiusB)){
    result = true;
  }
  return result;
}

var IDLE = "idle";
var TO_BE_SHOT = "to be shot";
var FLYING = "flying";
var DEAD = "dead";
var maxForce = 900;
var minForce = 300;
var gravity = 400;

function nerdDraw() {
      if(this.state === IDLE || this.state === FLYING)
      context2d.drawImage(this.img, this.x-this.img.width*0.5, this.y-this.img.height*0.5,
                          this.img.width, this.img.height);
    }

function nerdUpdate (deltaMillis) {
      if(this.state === FLYING) {
        var deltaSecs = deltaMillis/1000.0;
        this.x += this.speed.x * deltaSecs;
        this.y += this.speed.y * deltaSecs;
        this.speed.y += gravity * deltaSecs;
        for(var i=0; i<3; i++){
          if(collisionDetection(this, allTrolls[i])){
            this.state = DEAD;
            allTrolls[i].state = DEAD;
          }
        }
        if(this.x > canvasWidth || this.y > canvasHeight){
          this.state = DEAD;
        }
      } else if(this.state === TO_BE_SHOT) {
        this.x = cannon.x + cannon.pivot.x;
        this.y = cannon.y + cannon.pivot.y;
      }
    }

var alfredo = {
  imgPath: "img/alfredo.png",
  img: new Image(),
  x: nerdsPositions[0].x,
  y: nerdsPositions[0].y,
  speed: {x:0, y:0},
  state: IDLE,
  load: function(){
      this.img.onload = onResourceLoaded;
      this.img.src = this.imgPath;
    },
    draw: nerdDraw,
    update: nerdUpdate
};
alfredo.load();

var fuvio = {
  imgPath: "img/fuvio.png",
  img: new Image(),
  x: nerdsPositions[1].x,
  y: nerdsPositions[1].y,
  speed: {x:0, y:0},
  state: IDLE,
  load: function(){
      this.img.onload = onResourceLoaded;
      this.img.src = this.imgPath;
    },
  draw: nerdDraw,
  update: nerdUpdate
};
fuvio.load();

var leonel = {
  imgPath: "img/leonel.png",
  img: new Image(),
  x: nerdsPositions[2].x,
  y: nerdsPositions[2].y,
  speed: {x:0, y:0},
  state: IDLE,
  load: function(){
      this.img.onload = onResourceLoaded;
      this.img.src = this.imgPath;
    },
    draw: nerdDraw,
    update: nerdUpdate
};
leonel.load();

var allNerds = [alfredo, fuvio, leonel];

function trollDraw () {
      if(this.state === IDLE)
      context2d.drawImage(this.img, this.x-this.img.width*0.5, this.y-this.img.height*0.5,
                          this.img.width, this.img.height);
    }
var troll01 = {
  imgPath: "img/troll01.png",
  img: new Image(),
  x: trollPositions[0].x,
  y: trollPositions[0].y,
  state: IDLE,
  load: function(){
      this.img.onload = onResourceLoaded;
      this.img.src = this.imgPath;
    },
    draw: trollDraw,
};
troll01.load();

var troll02 = {
  imgPath: "img/troll02.png",
  img: new Image(),
  x: trollPositions[1].x,
  y: trollPositions[1].y,
  state: IDLE,
  load: function(){
      this.img.onload = onResourceLoaded;
      this.img.src = this.imgPath;
    },
    draw: trollDraw
};
troll02.load();

var troll03 = {
  imgPath: "img/troll03.png",
  img: new Image(),
  x: trollPositions[2].x,
  y: trollPositions[2].y,
  state: IDLE,
  load: function(){
      this.img.onload = onResourceLoaded;
      this.img.src = this.imgPath;
    },
    draw: trollDraw
};
troll03.load();

var allTrolls = [troll01, troll02, troll03];

var mouse = {
  x: 0,
  y: 0
};

document.onmousemove = function(e){
    mouse.x = e.pageX - canvasRect.left;
    mouse.y = e.pageY - canvasRect.top;
}

document.onmousedown = function(e){
    if(e.pageX > canvasRect.left && e.pageX < canvasRect.right &&
       e.pageY > canvasRect.top && e.pageY < canvasRect.bottom && e.button == 0){
      if(!forceArrow.active && nerdIndex < allNerds.length){
        allNerds[nerdIndex].state = TO_BE_SHOT; 
        forceArrow.active = true;
      }
    }
}

document.onmouseup = function(e){
    if(e.pageX > canvasRect.left && e.pageX < canvasRect.right &&
       e.pageY > canvasRect.top && e.pageY < canvasRect.bottom && e.button == 0){
      if(forceArrow.active && nerdIndex < allNerds.length){
        allNerds[nerdIndex].speed.x = Math.cos(cannon.angle) * (minForce + forceArrow.force * (maxForce - minForce));
        allNerds[nerdIndex].speed.y = Math.sin(cannon.angle) * (minForce + forceArrow.force * (maxForce - minForce));
        allNerds[nerdIndex].state = FLYING;
        nerdIndex += 1;
        forceArrow.active = false;
      }
    }
}

var lastMillis = new Date().getTime()
function update() {
  var currentMillis = new Date().getTime();
  var deltaMillis = currentMillis - lastMillis;
  lastMillis = currentMillis;

  if(resourcesLoaded >= 12) {
    context2d.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
    context2d.drawImage(schoolImage, canvasWidth-schoolImage.width, canvasHeight-schoolImage.height,
                        schoolImage.width, schoolImage.height);
    context2d.drawImage(forceImage, 20, canvasHeight*0.5-forceImage.height*0.5,
                        forceImage.width, forceImage.height);
    context2d.fillStyle = "white";
    context2d.font = "24px Helvetica"
    context2d.textBaseline = "top";
    context2d.textAlign = "left";
    context2d.fillText("Instruções: Clique e segure para atirar e mova o mouse para mirar", 20, 20);
    for(var i=0; i<3; i++){
      allNerds[i].update(deltaMillis);
      allNerds[i].draw();
      allTrolls[i].draw();
    }
    cannon.update(deltaMillis);
    cannon.draw();
    context2d.drawImage(cannonBaseImage, 160, 620,
                        cannonBaseImage.width, cannonBaseImage.height);
    forceArrow.update(deltaMillis);
    forceArrow.draw();
  }
  else {
    context2d.fillStyle="#000000";
    context2d.clearRect(0, 0, canvasWidth, canvasHeight);
    context2d.font = "bold 32px Helvetica"
    context2d.textBaseline = "middle";
    context2d.textAlign = "center";
    context2d.fillText("Carregando...", canvasWidth*0.5, canvasHeight*0.5);
  }

}

var loopInterval = setInterval(update, 33);

