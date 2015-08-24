Resource.totalInstantiated = 0;
Resource.totalLoaded = 0;
Resource.loadingComplete = function(){return Resource.totalLoaded >= Resource.totalInstantiated};
Resource.prototype.onload = function (){
    Resource.totalLoaded += 1;
    if(typeof this.resource.customOnLoad === "function") 
        this.resource.customOnLoad.call(this.resource);
};
Resource.prototype.draw = function (context){
    context.drawImage(this.img, this.x, this.y, this.img.width, this.img.height);
};
function Resource(imgSource, initObj){ 
    Resource.totalInstantiated += 1;
    this.x = initObj ? initObj.x || 0 : 0;
    this.y = initObj ? initObj.y || 0 : 0;
    this.customOnLoad = initObj ? initObj.onload || null : null;
    this.img = new Image();
    this.img.resource = this;
    this.img.onload = this.onload;
    this.img.src=imgSource;
}