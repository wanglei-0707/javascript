//画图类
function Draw(posX, posY){
    this.posX = posX;
    this.posY = posY;
    this.message = "";
}
Draw.prototype.consoleMessage = function(){
    console.log(this.message);
};
//画方块类
function DrawBlock(posX, posY){
    Draw.apply(this, arguments);
    this.sideLen = 100;
    this.message = "Hello, I am block!!!";
}
DrawBlock.prototype = new Draw();
DrawBlock.prototype.drawBlock = function(){
    var div = document.createElement("div");
    var style = div.style;
    var self = this;
    style.width = this.sideLen + 'px';
    style.height = this.sideLen + 'px';
    style.border = '1px solid black';
    style.position = 'absolute';
    style.left = (this.posX - this.sideLen/2) + 'px';
    style.top = (this.posY - this.sideLen/2) + 'px';
    document.body.appendChild(div);
    div.onclick = function(event){
        event = getEvent(event);
        stopPropagation(event);
        self.consoleMessage();
    };
};
//画圆类
function DrawCircle(posX, posY){
    Draw.apply(this, arguments);
    this.radius = 50;
    this.message = "Hello, I am cirle!!!";
}
DrawCircle.prototype = new Draw();
DrawCircle.prototype.drawCircle = function(){
    var div = document.createElement("div");
    var style = div.style;
    var self = this;
    style.width = 2 * this.radius + 'px';
    style.height = 2 * this.radius + 'px';
    style.borderRadius = '50%';
    style.border = '1px solid black';
    style.position = 'absolute';
    style.left = this.posX - this.radius + 'px';
    style.top = this.posY - this.radius + 'px';
    document.body.appendChild(div);
    div.onclick = function(event){
        event = getEvent(event);
        stopPropagation(event);
        self.consoleMessage();
        self.message = self.message[0] === 'H' ? 'GoodBye!!!' : 'Hello, I am circle!!!';
        if(self.message[0] === 'H'){
            this.style.display = 'none';
            this.onclick = null;
        }
    };
};
