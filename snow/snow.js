(function SnowModule(factory) {
    "use strict";

    if (typeof define === "function" && define.amd) {
        define(factory);
    } else if (typeof module != "undefined" && typeof module.exports != "undefined") {
        module.exports = factory();
    } else if (typeof Package !== "undefined") {
        //noinspection JSUnresolvedVariable
        Snow = factory(); // export for Meteor.js
    } else {
        /* jshint sub:true */
        window["Snow"] = factory();
    }
})(function SnowFactory(){
    function Snow(option){
        option = option || {};
        this.snowmax = option.snowmax || 50;
        this.snowcolor = option.snowcolor || ["#FFDA65", "#00AADD", "#aaaacc", "#ddddff", "#ccccdd", "#f3f3f3", "#f0ffff", "#bbf7f9"];
        this.snowtype = option.snowtype || ["Times", "Arial", "Verdana"];
        this.snowletter = option.snowletter || "*";
        this.sinkspeed = option.sinkspeed || 0.6;
        this.snowmaxsize = option.snowmaxsize || 30;
        this.snowminsize = option.snowminsize || 8;
        // Set 1 for all-over-snowing, set 2 for left-side-snowing
        // Set 3 for center-snowing, set 4 for right-side-snowing
        this.snowingzone = option.snowingzone || 1;
        this.showSnow = option.showSnow || true;
        this.snow = [];
        this.marginbottom;
        this.marginright;
        this.timer;
        this.x_mv = [];
        this.crds = [];
        this.lftrght = [];
        this.browerinfos = window.navigator.userAgent;
        this.ie5 = document.all && document.getElementById && !this.browerinfos.match(/Opera/);
        this.ns6 = document.getElementById && !document.all;
        this.opera = this.browerinfos.match(/Opera/);
        this.browserok = this.ie5 || this.ns6 || this.opera;

        if(this.showSnow){
            this.startSnow();
        }
    }
    Snow.prototype.randommaker = function(range){
        return Math.floor(range * Math.random());
    };
    Snow.prototype.initsnow = function(){
        if(this.ie5 || this.opera){
            this.marginbottom = document.body.scrollHeight;
            this.marginright = document.body.clientWidth - 15;
        }else if(this.ns6){
            this.marginbottom = document.body.scrollHeight;
            this.marginright = window.innerWidth - 15;
        }
        this.snowsizerange = this.snowmaxsize - this.snowminsize;
        for(var i=0;i<this.snowmax;i++){
            this.crds[i] = 0;
            this.lftrght[i] = Math.random() * 15;
            this.x_mv[i] = 0.03 + Math.random() / 10;
            this.snow[i] = document.getElementById('s' + i);
            this.snow[i].style.fontFamily = this.snowtype[this.randommaker(this.snowtype.length)];
            this.snow[i].size = this.randommaker(this.snowsizerange) + this.snowminsize;
            this.snow[i].style.fontSize = this.snow[i].size + 'px';
            this.snow[i].style.color = this.snowcolor[this.randommaker(this.snowcolor.length)];
            this.snow[i].style.zIndex = 1000;
            this.snow[i].sink = this.sinkspeed * this.snow[i].size / 5;
            if(this.snowingzone == 1){
                this.snow[i].posx = this.randommaker(this.marginright - this.snow[i].size);
            }else if(this.snowingzone == 2){
                this.snow[i].posx = this.randommaker(this.marginright / 2 - this.snow[i].size);
            }else if(this.snowingzone == 3){
                this.snow[i].posx = this.randommaker(this.marginright / 2 - this.snow[i].size) + this.marginright / 4;
            }else if(this.snowingzone == 4){
                this.snow[i].posx = this.randommaker(this.marginright / 2 - this.snow[i].size) + this.marginright / 2;
            }
            this.snow[i].posy = this.randommaker(this.marginbottom - 2 * this.snow[i].size);
            this.snow[i].style.left = this.snow[i].posx + 'px';
            this.snow[i].style.top = this.snow[i].posy + 'px';
        }
        this.movesnow();
    };
    Snow.prototype.movesnow = function(){
        for(var i=0;i<this.snowmax;i++){
            this.crds[i] += this.x_mv[i];
            this.snow[i].posy += this.snow[i].sink;
            this.snow[i].style.left = this.snow[i].posx + this.lftrght[i] * Math.sin(this.crds[i]) + 'px';
            this.snow[i].style.top = this.snow[i].posy + 'px';
            if(this.snow[i].posy >= this.marginbottom - 2 * this.snow[i].size || parseInt(this.snow[i].style.left) > (this.marginright - 3 * this.lftrght[i])){
                if(this.snowingzone == 1){
                    this.snow[i].posx = this.randommaker(this.marginright - this.snow[i].size);
                }else if(this.snowingzone == 2){
                    this.snow[i].posx = this.randommaker(this.marginright / 2 - this.snow[i].size);
                }else if(this.snowingzone == 3){
                    this.snow[i].posx = this.randommaker(this.marginright / 2 - this.snow[i].size) + this.marginright / 4;
                }else if(this.snowingzone == 4){
                    this.snow[i].posx = this.randommaker(this.marginright / 2 - this.snow[i].size) + this.marginright / 2;
                }
                this.snow[i].posy = 0;
            }
        }
        var that = this;
        this.snowTimer = window.setTimeout(function(){
            that.movesnow();
        }, 50);
    };
    Snow.prototype.createSnow = function(){
        var body = document.getElementsByTagName('body')[0],
            fragment = document.createElement('div'),
            _html = '';
        for(var i=0;i<=this.snowmax;i++){
            _html += '<span id="s' + i + '" style="position:absolute;top:-"' + this.snowmaxsize + 'px">' + this.snowletter + '</span>';
        }
        fragment.innerHTML = _html;
        this.fragment = fragment;
        body.appendChild(fragment);
    };
    Snow.prototype.startSnow = function(){
        this.createSnow();
        if(this.browserok){
            this.initsnow();
        }
    };
    Snow.prototype.removeSnow = function(){
        var body = document.getElementsByTagName('body')[0];
        body.removeChild(this.fragment);
        clearTimeout(this.snowTimer);
        this.snowTimer = null;
    };
    Snow.create = function(options){
        return new Snow(options);
    };
    return Snow;
});
