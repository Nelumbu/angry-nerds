var gameCanvas = document.getElementById("game-canvas");
var context2d = gameCanvas.getContext("2d");
var canvasRect = gameCanvas.getBoundingClientRect();
var canvasWidth = gameCanvas.width;
var canvasHeight = gameCanvas.height;

function toRadians(degrees) {return degrees * Math.PI / 180;}
function toDegrees(radians) {return radians / Math.PI * 180;}

var background;
var school;
var cannonBase;
var cannon;
var forceBar;
var forceArrow;
var alfredo, leonel, fuvio;
var troll01, troll02, troll03;
var allInstantiated = false;
function bgLoaded(){
  // this = background
  var imageScale = Math.max(canvasWidth / this.img.width, canvasHeight / this.img.height);
  function applyImageScale() {
     // this = Resource que foi carregado
    this.img.width *= imageScale;
    this.img.height *= imageScale;
  }
  // Chamar o método call de uma função, 
  // a executa dentro do escopo especificado pelo parâmetro
  applyImageScale.call(this);
  school = new Resource("img/escola.png", {onload:applyImageScale, x:820, y:300});
  cannonBase = new Resource("img/suporte_canhao.png", {onload:applyImageScale, x:200, y:600});
  forceBar = new Resource("img/barra_de_forca.png", {onload:applyImageScale, x:50, y:300});
  cannon = new Cannon("img/canhao.png", {onload:function(){
      // this = cannon
      applyImageScale.call(this);
      this.pivot = {x:this.img.width/3, y:this.img.height/2};
    }, update: function() {
      // this = cannon
      if(localMouse.x > 0 && localMouse.y > 0) {
        this.angle = Math.atan2(localMouse.y-(this.y+this.pivot.y), localMouse.x-(this.x+this.pivot.x));
      }
    }, x:188, y:586});
  forceArrow = new ForceArrow("img/seta_forca.png", {onload:applyImageScale, x:85, y:600, minY:300, maxY:600});
  alfredo = new Nerd("img/alfredo.png", {onload:applyImageScale, x:370, y:640});
  fuvio = new Nerd("img/fuvio.png", {onload:applyImageScale, x:480, y:635});
  leonel = new Nerd("img/leonel.png", {onload:applyImageScale, x:570, y:635});
  troll01 = new Troll("img/troll01.png", {onload:applyImageScale, x:815, y:600});
  troll02 = new Troll("img/troll02.png", {onload:applyImageScale, x:915, y:330});
  troll03 = new Troll("img/troll03.png", {onload:applyImageScale, x:1115, y:200});
  allInstantiated = true;
}
background = new Resource("img/cenario.png", {onload:bgLoaded});
var maxForce = 900;
var minForce = 300;

var localMouse = {x:-1, y:-1};
gameCanvas.onmousemove = function(evt){
  if(cannon && evt.clientX >= canvasRect.left && 
     evt.clientX <= canvasRect.right && evt.clientY >= canvasRect.top && 
     evt.clientY <= canvasRect.bottom)
  {
    localMouse.x = evt.clientX-canvasRect.left;
    localMouse.y = evt.clientY-canvasRect.top;
  }
};

var nerdIndex = 0;
gameCanvas.onmousedown = function(evt) {
  if(forceArrow && nerdIndex < Nerd.allNerds.length){
    forceArrow.active = true;
    Nerd.allNerds[nerdIndex].state = Nerd.TO_BE_SHOT;
  }
};

gameCanvas.onmouseup = function(evt) {
  if(forceArrow && nerdIndex < Nerd.allNerds.length){
    forceArrow.active = false;
    var shootForce = minForce + forceArrow.force * (maxForce - minForce);
    Nerd.allNerds[nerdIndex].speed.x = Math.cos(cannon.angle) * shootForce;
    Nerd.allNerds[nerdIndex].speed.y = Math.sin(cannon.angle) * shootForce;
    Nerd.allNerds[nerdIndex].state = Nerd.FLYING;
    nerdIndex += 1;
  }
};

//gameCanvas.onclick = function(evt) {
//  if(forceArrow){
//    forceArrow.active = !forceArrow.active;
//  }
//};

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var lastMillis = new Date().getTime();
(function animloop(){
  var currentMillis = new Date().getTime();
  var deltaMillis = currentMillis - lastMillis;
  lastMillis = currentMillis;
  
  requestAnimFrame(animloop);
  if(allInstantiated && Resource.loadingComplete){
    background.draw(context2d);
    school.draw(context2d);
    for(var i=0;i<Nerd.allNerds.length;i++){
      Nerd.allNerds[i].update(deltaMillis, gameCanvas, cannon);
      Nerd.allNerds[i].draw(context2d);
    }
    for(var i=0;i<Troll.allTrolls.length;i++){
      Troll.allTrolls[i].update(deltaMillis);
      Troll.allTrolls[i].draw(context2d);
    }
    cannon.update();
    cannon.draw(context2d);
    cannonBase.draw(context2d);
    forceBar.draw(context2d);
    context2d.fillRect(cannon.x+cannon.pivot.x-2,
      cannon.y+cannon.pivot.y-2, 4, 4);
    forceArrow.update(deltaMillis);
    forceArrow.draw(context2d);
  } else {
    context2d.fillStyle="#000000";
    context2d.clearRect(0, 0, canvasWidth, canvasHeight);
    context2d.font = "bold 32px Helvetica"
    context2d.textBaseline = "middle";
    context2d.textAlign = "center";
    context2d.fillText("Carregando...", canvasWidth*0.5, canvasHeight*0.5);
  }
})();
