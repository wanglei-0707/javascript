function Lottery(ops){
    var _ops = {
        userList: "user-list",
        dotList: "dot-list",
        controlBtn: "control-btn",
        winnerNum: "winner-num",
        onlineNum: "online-num",
        winnerList: "winner-list"
    };
    for(var k in ops){
        _ops[k] = ops[k];
    }
    this.userList = $(_ops.userList);
    this.dotList = $(_ops.dotList);
    this.controlBtn = $(_ops.controlBtn);
    this.winnerNumELe = $(_ops.winnerNum);
    this.onlineNumEle = $(_ops.onlineNum);
    this.winnerList = $(_ops.winnerList);
    var lis = this.userList.getElementsByTagName("li");
    this.onlineNum = lis.length;
    this.onlineNumEle.innerHTML = this.onlineNum;
    this.liHeight = lis[0].offsetHeight;
    this.timer = null;
    this.speed = 0.002;
    this.topLimit = -this.liHeight;
    this.winnerNum = 0;
    this.bind();
}
Lottery.prototype.getStyle = function(ele, property){
    if(window.getComputedStyle){
        return window.getComputedStyle(ele, null)[property];
    }else if(ele.currentStyle){
        return ele.currentStyle[property];
    }
};
Lottery.prototype.startLottery = function(self){
    var userList = self.userList;
    var dot = self.dotList;
    var liHeight = self.liHeight;
    var top = parseInt(self.getStyle(userList, 'top'));
    var topLimit = self.topLimit;
    var changeTop = function(){
        userList.style.top = top + 'px';
        if(top < topLimit){
            var firstLi = userList.getElementsByTagName("li")[0];
            top += liHeight;
            userList.style.top = top + 'px';
            userList.removeChild(firstLi);
            userList.appendChild(firstLi);
        }
    };
    var dotLeft = parseInt(self.getStyle(dot, 'left'));
    var startTime = Date.now();
    var curTime = 0, deltaTime = 0;
    var moveDot = function(){
        curTime = Date.now();
        deltaTime += (curTime - startTime);
        startTime = curTime;
        if(deltaTime > 500){
            dotLeft += 42;
            if(dotLeft > 752){
                dotLeft = 668;
            }
            dot.style.left = dotLeft + 'px';
            deltaTime = 0;
        }
    };
    var start = function(){
        if(self.speed < 10){
            self.speed *= 1.5;
        }
        top -= self.speed;
        changeTop();
        moveDot();
        self.timer = setTimeout(start, 10);
    };
    setTimeout(start, 500);
};
Lottery.prototype.stopLottery = function(self){
    var userList = self.userList;
    var winnerList = self.winnerList;
    var top = parseInt(self.getStyle(userList, 'top'));
    var topLimit = self.topLimit;
    var winnerli = $('winner-li');
    clearTimeout(self.timer);
    var stop = function(){
        if(top > topLimit){
            self.speed -= 0.05;
            top -= self.speed;
            userList.style.top = top + 'px';
            self.timer = setTimeout(stop, 10);
        }else{
            self.winnerNum++;
            top = topLimit;
            userList.style.top = top + 'px';
            clearTimeout(self.timer);
            var winner = userList.getElementsByTagName("li")[2];
            winnerli.innerHTML = winner.innerHTML;
            winner.style.visibility = "hidden";
            winnerli.className = 'limove';
            setTimeout(function(){
                winner.className = 'delete';
            },2000);
            setTimeout(function(){
                winnerli.innerHTML = "";
                winnerli.className = "";
                winner.innerHTML = self.winnerNum + "、   " + winner.innerHTML;
                self.winnerNumELe.innerHTML = self.winnerNum;
                winner.style.visibility = "visible";
                userList.removeChild(winner);
                var firstLi = winnerList.getElementsByTagName("li")[0];
                if(firstLi){
                    winnerList.insertBefore(winner, firstLi);
                }else{
                    winnerList.appendChild(winner);
                }
            }, 3001);
        }
    };
    setTimeout(stop, 10);
};
Lottery.prototype.bind = function(){
    var self = this;
    var on = false;
    var control = self.controlBtn.getElementsByTagName("span")[0];
    addEvent(self.controlBtn, "click", function(){
        if(on){
            control.style.backgroundPosition = '-1000px -466px';
            self.stopLottery(self);
            on = false;
        }else{
            control.style.backgroundPosition = '-1088px -466px';
            self.startLottery(self);
            on = true;
        }
    });
};
