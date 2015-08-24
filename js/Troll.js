Troll.prototype = Object.create(Agent.prototype);
Troll.prototype.constructor = Troll;
Troll.allTrolls = [];
function Troll(imgSource, initObj){ 
    Agent.call(this, imgSource, initObj);
    Troll.allTrolls.push(this);
}