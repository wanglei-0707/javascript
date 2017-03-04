var canvas;
var cxt;
var CANVAS_WIDTH = screen.width > 800 ? 300 : screen.width;
var CANVAS_HEIGHT = screen.width > 800 ? 480 : screen.height;
var fortune_cat;
var catReady = false; //记录招财猫的图片是否加载完毕
var lastTime;
var deltaTime; //记录两次画布刷新的事件间隔
var goldIngotArr = []; //存放所有的元宝
var timer = 0;  //记录生成元宝的时间间隔
var downTimer;  //倒计时计时器
var score = 0;
var TOTAL_TIME = 60;  //游戏时间
var time = TOTAL_TIME;
var gameover = false;
var isMouseInCat = false; //鼠标点击位置是否在招财猫区域内
var leftDis;  //鼠标点击位置的x坐标与招财猫的x坐标之间的距离
var scoreSpan = document.getElementById("score");
var timeSpan = document.getElementById("time");
var mask = document.getElementById("mask");
var controler = document.getElementById("controler");
var showScore = document.getElementById("showScore");
var gameAgainBtn = document.getElementById("gameAgain");
var startArea = document.getElementById("startArea");
var gameStartBtn = document.getElementById("gameStart");

//招财猫
var fortuneCat = {
	width:CANVAS_WIDTH * 0.2,
	height:CANVAS_WIDTH * 0.2,
	x:CANVAS_WIDTH * 0.8 / 2,
	y:CANVAS_HEIGHT-CANVAS_WIDTH * 0.2 - 20
};

//绘制背景
function drawBackground(){
	cxt.fillStyle = 'rgb(255,149,136)';
	cxt.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
}

//绘制招财猫
function drawFortuneCat(){
	if(catReady){
		cxt.drawImage(fortune_cat,fortuneCat.x,fortuneCat.y,fortuneCat.width,fortuneCat.height);
	}
}

//绘制元宝
function drawGoldIngot(){
	var del;
	for(var i=0;i<goldIngotArr.length;i++){
		goldIngotArr[i].drawImg();
		if(!gameover){
			goldIngotArr[i].drop();
			if(goldIngotArr[i].y + goldIngotArr[i].height >= fortuneCat.y){
				//招财猫接到了元宝，将元宝实例回收,分数增加
				if(isCatched(goldIngotArr[i])){
					del = goldIngotArr.splice(i,1);
					del = null;
					score++;
					scoreSpan.innerHTML = score;
					continue;
				}
			}
			//没有被接到的元宝到达一定高度自动消失，回收
			if(goldIngotArr[i].y >= CANVAS_HEIGHT-40){
				del = goldIngotArr.splice(i,1);
				del = null;
			}
		}
	}
	//一定时间间隔后生成新的元宝
	if(!gameover){
		timer += deltaTime;
		var timeInterval = Math.floor(Math.random() * 1000 + 500);
		if(timer > timeInterval){
			var goldIngot = new GoldIngot(cxt,"image/gold_ingot.jpg");
			goldIngotArr.push(goldIngot);
			timer = 0;
		}
	}
}

//判断小猫是否接住元宝
function isCatched(goldIngot){
	if(goldIngot.x - fortuneCat.x >= -goldIngot.width && goldIngot.x - fortuneCat.x <= fortuneCat.width){
		return true;
	}
	return false;
}

function gameStart(){
	gameover = false;
	var goldIngot = new GoldIngot(cxt,"image/gold_ingot.jpg");
	goldIngotArr.push(goldIngot);
	countDown();
	lastTime = Date.now();
	gameloop();
}

function gamePause(){
	gameover = true;
	clearInterval(downTimer);
}

function gameOver(){
	gameover = true;
	mask.style.display = "block";
	controler.style.display = "block";
	showScore.innerHTML = score;
}

function gameAgain(){
	gameover = false;
	mask.style.display = "none";
	controler.style.display = "none";
	time = TOTAL_TIME;
	score = 0;
	scoreSpan.innerHTML = 0;
	timeSpan.innerHTML = time;
	for(var i=0;i<goldIngotArr.length;i++){
		goldIngotArr[i] = null;
	}
	goldIngotArr.length = 0;
	fortuneCat.x = CANVAS_WIDTH * 0.8 / 2;
	fortuneCat.y = CANVAS_HEIGHT-CANVAS_WIDTH * 0.2 - 20;
	var goldIngot = new GoldIngot(cxt,"image/gold_ingot.jpg");
	goldIngotArr.push(goldIngot);
	countDown();
	lastTime = Date.now();
}

//倒计时
function countDown(){
	downTimer = setInterval(function(){
		if(time === 0){
			clearInterval(downTimer);
			gameOver();
		}else{
			time--;
			timeSpan.innerHTML = time;
		}
	}, 1000);
}

//渲染背景图，招财猫和元宝
function render(){
	//背景图
	drawBackground();
	//招财猫
	drawFortuneCat();
	//元宝
	drawGoldIngot();
}

function gameloop(){
	window.requestAnimFrame(gameloop);
	var now = Date.now();
	deltaTime = now - lastTime;
	render();
	lastTime = now;
}

function init(){
	var container = document.getElementById("container");
	container.style.width = CANVAS_WIDTH + "px";
	canvas = document.getElementById("canvas");
	cxt = canvas.getContext("2d");
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	timeSpan.innerHTML = TOTAL_TIME;
	drawBackground();
	fortune_cat = new Image();
	fortune_cat.src = "image/fortune_cat.jpg";
	fortune_cat.onload = function(){
		catReady = true;
		drawFortuneCat();
	};
}

init();

//将鼠标的坐标转换成在canvas中的坐标
function windowToCanvas(point){
	var origin = canvas.getBoundingClientRect();
	return {x:point.x - origin.left,y:point.y - origin.top};
}

//判断鼠标位置是否在招财猫区域
function mouseInCat(point){
	if(point.x-fortuneCat.x >= 0 && point.x-fortuneCat.x <= fortuneCat.width && point.y-fortuneCat.y >=0 && point.y-fortuneCat.y <= fortuneCat.height){
		return true;
	}
	return false;
}

function catStartMove(point){
	var mousePos = windowToCanvas({x:point.x,y:point.y});
	isMouseInCat = mouseInCat(mousePos);
	if(isMouseInCat){
		leftDis = mousePos.x - fortuneCat.x;
	}
}

function catMove(point){
	var mousePos = windowToCanvas({x:point.x,y:point.y});
	fortuneCat.x = mousePos.x - leftDis;
	if(fortuneCat.x < 0){
		fortuneCat.x = 0;
	}else if(fortuneCat.x > CANVAS_WIDTH - fortuneCat.width){
		fortuneCat.x = CANVAS_WIDTH - fortuneCat.width;
	}
	drawFortuneCat();
}

function catEndMove(){
	isMouseInCat = false;
}

canvas.onmousedown = function(e){
	e = event || window.event;
	preDefault(e);
	catStartMove({x:e.clientX,y:e.clientY});
};

canvas.onmousemove = function(e){
	e = event || window.event;
	preDefault(e);
	if(isMouseInCat){
		catMove({x:e.clientX,y:e.clientY});
	}
};

canvas.onmouseup = function(e){
	e = event || window.event;
	preDefault(e);
	catEndMove();
};

canvas.onmouseout = function(e){
	e = event || window.event;
	preDefault(e);
	catEndMove();
};

canvas.addEventListener("touchstart",function(e){
	e = event || window.event;
	preDefault(e);
	var pos = e.touches[0];
	catStartMove({x:pos.pageX,y:pos.pageY});
});

canvas.addEventListener("touchmove",function(e){
	e = event || window.event;
	preDefault(e);
	if(isMouseInCat){
		var pos = e.touches[0];
		catMove({x:pos.pageX,y:pos.pageY});
	}
});

canvas.addEventListener("touchend",function(e){
	e = event || window.event;
	preDefault(e);
	catEndMove();
});

gameAgainBtn.onclick = function(){
	gameAgain();
};

gameStartBtn.onclick = function(){
	if(this.innerHTML == "start"){
		this.innerHTML = "pause";
		gameStart();
	}else{
		this.innerHTML = "start";
		gamePause();
	}
};
