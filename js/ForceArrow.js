ForceArrow.prototype = Object.create(Agent.prototype);
ForceArrow.prototype.constructor = ForceArrow;
ForceArrow.prototype.update = function (deltaMillis){
    Agent.prototype.update.call(this, deltaMillis);
    if(this.active){
        this.force += deltaMillis * 0.001 * this.speed * this.signal;
        if (this.force >= 1 && this.signal > 0){
            this.force = 1;
            this.signal *= -1;
        } else if (this.force <= 0 && this.signal < 0) {
            this.force = 0;
            this.signal *= -1;
        }
    }
    else {
        this.force = 0;
        this.signal = 1;
    }
};

function ForceArrow(imgSource, initObj){ 
    Agent.call(this, imgSource, initObj);
    this.minY = initObj ? initObj.minY || 0 : 0;
    this.maxY = initObj ? initObj.maxY || 0 : 0;
    this.speed = initObj ? initObj.speed || 1 : 1;
    this.force = 0;
    this.active = false;
    this.signal = 1;
}