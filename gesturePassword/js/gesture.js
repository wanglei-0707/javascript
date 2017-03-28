(function(){
    function GesturePsw(opt){
        this.settings = {
            canvasId: 'canvas',
            width: window.innerWidth,
            height: window.innerHeight * 0.5,
            messageId: 'message',
            radius: 20,
            circleDis: 50,
            circleFillColor: '#ffa726',
            circleStrokeColor: '#fda11d',
            lineColor: '#e68183',
            lineWidth: 2,
            setPsw: 'setPsw',
            verifyPsw: 'verifyPsw'
        };
        for(var key in opt){
            if(opt.hasOwnProperty(key)){
                this.settings[key] = opt[key];
            }
        }
        this.canvas = wl.$(this.settings.canvasId);
        this.cxt = this.canvas.getContext('2d');
        this.message = wl.$(this.settings.messageId);
        this.setPsw = wl.$(this.settings.setPsw);
        this.verifyPsw = wl.$(this.settings.verifyPsw);
        this.points = [];
        this.init();
        this.initEvent();
    }
    /**
     * 初始化，设置canvas的宽高，将9个点的坐标保存到points数组中，绘制9个点，并且选中设置密码单选框
     */
    GesturePsw.prototype.init = function(){
        var settings = this.settings,
            width = settings.width,
            height = settings.height,
            radius = settings.radius,
            circleDis = settings.circleDis,
            left = Math.floor((width - radius * 6 - circleDis * 2) / 2),
            top = Math.floor((height - radius * 6 - circleDis * 2) / 2),
            x, y;
        //设置canvas的宽高
        this.canvas.width = width;
        this.canvas.height = height;
        //points数组保存9个点的坐标
        for(var i=0;i<3;i++){
            for(var j=0;j<3;j++){
                x = left + (2 * j + 1) * radius + j * circleDis;
                y = top + (2 * i + 1) * radius + i * circleDis;
                this.points.push([x, y]);
            }
        }
        //绘制9个点
        this.drawCircle();
        //设置为设置密码状态
        this.setPsw.checked = true;
        this.message.innerHTML = '请输入手势密码';
    };
    /**
     * 绘制9个点
     */
    GesturePsw.prototype.drawCircle = function(){
        var points = this.points,
            cxt = this.cxt;
        cxt.save();
        cxt.fillStyle = '#fff';
        cxt.strokeStyle = '#ccc';
        for(var i=0;i<9;i++){
            var cur = points[i];
            cxt.beginPath();
            cxt.arc(cur[0], cur[1], this.settings.radius, 0, 2 * Math.PI);
            cxt.fill();
            cxt.stroke();
            cxt.closePath();
        }
        cxt.restore();
    };
    /**
     * 获取touch事件发生时手相对于canvas左上角的坐标
     * @param {object} e touch事件
     * @return {object} 返回包含触摸点相对于canvas左上角的坐标的对象
     */
    GesturePsw.prototype.getEventPos = function(e){
        e = e || window.event;
        var pos = e.touches[0];
        var canvasPos = this.canvas.getBoundingClientRect();
        pos.x = Math.round(pos.pageX - canvasPos.left);
        pos.y = Math.round(pos.pageY - canvasPos.top);
        return pos;
    };
    /**
     * 判断touch事件发生时触摸点是否在9个点的某个点内
     * @param {object} pos touch事件发生时触摸点的坐标
     * @return {number} 如果在，返回点的点数，如果不在返回0
     */
    GesturePsw.prototype.inWhichPoint = function(pos){
        for(var i=0;i<9;i++){
            var cur = this.points[i];
            var dis = Math.sqrt((pos.x - cur[0]) * (pos.x - cur[0]) + (pos.y - cur[1]) * (pos.y - cur[1]));
            if(dis < this.settings.radius){
                return i+1;
            }
        }
        return 0;
    };
    /**
     * 根据已选择的路径，绘制被选中的点和路线
     * @param {string} path 已选中的点组成的字符串
     * @param {object} curPos 移动过程中当前点的坐标，
     */
    GesturePsw.prototype.drawPath = function(path, curPos){
        if(!path || path.length === 0){
            return;
        }
        var settings = this.settings,
            cxt = this.cxt,
            pos;
        //绘制路线
        // cxt.save();
        cxt.beginPath();
        for(var i=0;i<path.length;i++){
            pos = this.points[+path[i]-1];
            cxt.lineTo(pos[0], pos[1]);
        }
        cxt.lineWidth = settings.lineWidth;
        cxt.strokeStyle = settings.lineColor;
        cxt.stroke();
        //绘制当前触摸点和路线的最后一个点之间的线段
        if(curPos){
            var lastPoint = this.points[+path[path.length-1]-1];
            cxt.beginPath();
            cxt.moveTo(lastPoint[0], lastPoint[1]);
            cxt.lineTo(curPos.x, curPos.y);
            cxt.stroke();
        }
        // cxt.restore();
        // cxt.save();
        //绘制经过的点的颜色为选中状态
        for(i=0;i<path.length;i++){
            pos = this.points[+path[i]-1];
            cxt.beginPath();
            cxt.arc(pos[0], pos[1], settings.radius, 0, 2 * Math.PI);
            cxt.fillStyle = settings.circleFillColor;
            cxt.strokeStyle = settings.circleStrokeColor;
            cxt.fill();
            cxt.stroke();
        }
        // cxt.restore();
    };
    /**
     * 每次操作之后的，经过一段时间重绘画布为初始状态，设置相应的文字提示
     * @param {string} msg 每次操作后相应的文字提示
     */
    GesturePsw.prototype.repaintCircle = function(msg){
        var self = this;
        setTimeout(function(){
            self.cxt.clearRect(0, 0, self.settings.width, self.settings.height);
            self.drawCircle();
            self.message.innerHTML = msg;
        }, 2000);
    };
    /**
     * 绑定事件
     */
    GesturePsw.prototype.initEvent = function(){
        var canvas = this.canvas;
        var self = this;
        var path = '';
        var firstFlag = false;
        var firstPath = '';
        var message = self.message;
        var isEnd = false;
        wl.addEvent(canvas, 'touchstart', function(e){
            path = '';
            isEnd = false;
            var pos = self.getEventPos(e);
            var ret = self.inWhichPoint(pos);
            if(ret){
                path += ret;
            }
        });
        wl.addEvent(canvas, 'touchmove', function(e){
            if(!isEnd){
                var pos = self.getEventPos(e);
                var ret = self.inWhichPoint(pos);
                if(ret && (path.indexOf(ret+'') === -1)){
                    path += ret;
                }else if(ret && (ret !== +path[path.length-1])){
                    var evt = document.createEvent('Event');
                    evt.initEvent('touchend', false, false);
                    this.dispatchEvent(evt);
                    return;
                }
                self.cxt.clearRect(0, 0, self.settings.width, self.settings.height);
                self.drawCircle();
                self.drawPath(path, pos);
            }
        });
        wl.addEvent(canvas, 'touchend', function(e){
            if(!isEnd){
                isEnd = true;
                self.cxt.clearRect(0, 0, self.settings.width, self.settings.height);
                self.drawCircle();
                self.drawPath(path, null);
                if(self.setPsw.checked && !firstPath){
                    if(path.length < 5){
                        message.innerHTML = "密码太短， 至少需要5个点";
                        self.repaintCircle("请输入手势密码");
                    }else{
                        firstPath = path;
                        message.innerHTML = "已记录图案";
                        self.repaintCircle("请再次输入手势密码");
                    }
                }else if(firstPath){
                    if(firstPath !== path){
                        message.innerHTML = "两次输入的密码不一致";
                        firstPath = '';
                        self.repaintCircle("请重新输入手势密码");
                    }else{
                        message.innerHTML = "密码设置成功";
                        localStorage.setItem('psw', firstPath);
                        firstPath = '';
                        self.repaintCircle("请输入手势密码");
                    }
                }else{
                    var psw = localStorage.getItem('psw');
                    if(!psw){
                        message.innerHTML = "请先设置密码";
                        self.setPsw.checked = true;
                        self.repaintCircle("请输入手势密码");
                        return;
                    }
                    if(psw !== path){
                        message.innerHTML = "输入的密码不正确";
                        self.repaintCircle("请输入手势密码");
                    }else{
                        message.innerHTML = "密码正确";
                        self.repaintCircle("请输入手势密码");
                    }
                }
            }
        });
    };

    window.GesturePsw = GesturePsw;
})();
