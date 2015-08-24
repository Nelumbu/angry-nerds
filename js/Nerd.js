Nerd.prototype = Object.create(Agent.prototype);
Nerd.prototype.constructor = Nerd;
Nerd.allNerds = [];
Nerd.prototype.update = function (deltaMillis){
    Agent.prototype.update.call(this, deltaMillis);
};
function Nerd(imgSource, initObj){ 
   Agent.call(this, imgSource, initObj);
   Nerd.allNerds.push(this);
} 