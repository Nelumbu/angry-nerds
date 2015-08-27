Agent.prototype = Object.create(Resource.prototype);
Agent.prototype.constructor = Agent;
Agent.prototype.draw = function (context){
    if(typeof this.customDraw === "function") 
        this.customDraw(context);
    else 
        Resource.prototype.draw.call(this, context);
};
Agent.prototype.update = function (deltaMillis){
    if(typeof this.customUpdate === "function") 
        this.customUpdate(deltaMillis);
};
function Agent(imgSource, initObj){ 
    Resource.call(this, imgSource, initObj);
    this.customUpdate = initObj ? initObj.update || null : null;
    this.customDraw = initObj ? initObj.draw || null : null;
} 