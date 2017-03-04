function GoldIngot(cxt,src){
	var that = this;
	this.cxt = cxt;
	this.img = new Image();
	this.img.src = src;
	this.goldReady = false;
	this.img.onload = function(){
		that.goldReady = true;
	};
	this.x = Math.random() * (CANVAS_WIDTH - 58);
	this.y = 70;
	this.width = 40;
	this.height = 30;
	this.speed = 5;
}

GoldIngot.prototype = {
	drawImg:function(){
		if(this.goldReady){
			this.cxt.drawImage(this.img,this.x,this.y,this.width,this.height);
		}
	},
	drop:function(){
		this.y += this.speed * deltaTime * 0.04;
	},
};
