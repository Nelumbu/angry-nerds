Nerd.prototype = Object.create(Agent.prototype);
Nerd.prototype.constructor = Nerd;
Nerd.allNerds = [];
Nerd.IDLE = "idle";
Nerd.TO_BE_SHOT = "to be shot";
Nerd.FLYING = "flying";
Nerd.DEAD = "dead";
var gravity = 400;
Nerd.prototype.update = function (deltaMillis, canvas, cannon){
    Agent.prototype.update.call(this, deltaMillis);
    if(cannon && canvas){
        if(this.state === Nerd.FLYING) {
            var deltaSecs = deltaMillis/1000.0;
            this.x += this.speed.x * deltaSecs;
            this.y += this.speed.y * deltaSecs;
            this.speed.y += gravity * deltaSecs;
            for(var i=0; i<3; i++){
                if(Troll.allTrolls[i].state !== Troll.DEAD && 
                   collisionCircle(this, Troll.allTrolls[i]))
                {
                    this.state = Nerd.DEAD;
                    Troll.allTrolls[i].state = Nerd.DEAD;
                }
            }
            if(this.x > canvas.width || this.y > canvas.height){
                this.state = Nerd.DEAD;
            }
        } else if(this.state === Nerd.TO_BE_SHOT) {
            this.x = cannon.x + cannon.pivot.x - this.img.width * 0.5;
            this.y = cannon.y + cannon.pivot.y - this.img.height * 0.5;
        }
    }
};
Nerd.prototype.draw = function (context){
    if(this.state === Nerd.IDLE || this.state === Nerd.FLYING){
        Agent.prototype.draw.call(this, context);
    }
};
function Nerd(imgSource, initObj){ 
    Agent.call(this, imgSource, initObj);
    Nerd.allNerds.push(this);
    this.speed = {x:0, y:0};
    this.state = Nerd.IDLE;
}

function collisionCircle(objA, objB){
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