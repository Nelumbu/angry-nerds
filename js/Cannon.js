Cannon.prototype = Object.create(Agent.prototype);
Cannon.prototype.constructor = Cannon;
Cannon.prototype.customDraw = function (context){
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.translate(this.x + this.pivot.x, this.y + this.pivot.y);
    context.rotate(this.angle);
    context.drawImage(this.img, -this.pivot.x, -this.pivot.y, this.img.width, this.img.height);
    context.restore();
};
function Cannon(imgSource, initObj){ 
    Agent.call(this, imgSource, initObj);
    this.angle = initObj ? initObj.angle || 0 : 0;
    this.pivot = { x: initObj && initObj.pivot ? initObj.pivot.x || 0 : 0,
                   y: initObj && initObj.pivot ? initObj.pivot.y || 0 : 0 };
    this.customDraw = this.customDraw || Cannon.prototype.customDraw;
} 