Troll.prototype = Object.create(Agent.prototype);
Troll.prototype.constructor = Troll;
Troll.allTrolls = [];
Troll.DEAD = "dead";
Troll.prototype.draw = function (context){
    if(this.state !== Troll.DEAD){
        Agent.prototype.draw.call(this, context);
    }
};
function Troll(imgSource, initObj){ 
    Agent.call(this, imgSource, initObj);
    Troll.allTrolls.push(this);
}