var visualWidth = $('#content').width();
var visualHeight = $('#content').height();

function scrollTo(time, proportionX){
    var distX = container.width() * proportionX;
    swipe.scrollTo(distX, time);
}

var animationEnd = (function(){
    var explorer = navigator.userAgent;
    if(~explorer.indexOf('Webkit')){
        return 'webkitAnimationEnd';
    }
    return 'animationend';
})();

//灯  明亮  昏暗
var lamp = {
    elem:$('.b_background'),
    bright:function(){
        this.elem.addClass('lamp-bright');
    },
    dark:function(){
        this.elem.removeClass('lamp-bright');
    }
};

//鸟
var bird = {
    elem:$('.bird'),
    fly:function(){
        this.elem.addClass('birdFly');
        this.elem.transition({
            right:visualWidth
        }, 15000, 'linear');
    }
};

var getValue = function(className){
    var $elem = $('' + className);
    return {
        height: $elem.height(),
        top: $elem.position().top
    };
};

var bridgeY = function(){
    var data = getValue('.c_background_middle');
    return data.top;
};

// 小女孩
var girl = {
    elem: $('.girl'),
    getHeight:function(){
        return this.elem.height();
    },
    getWidth:function(){
        return this.elem.width();
    },
    rotate:function(){
        this.elem.addClass('girl-rotate');
    },
    setPosition:function(){
        this.elem.css({
            left:visualWidth / 2,
            top:bridgeY() - this.getHeight()
        });
    },
    getPosition:function(){
        return this.elem.position();
    },
};

var logo = {
    elem:$('.logo'),
    run:function(){
        this.elem.addClass('logolightSpeedIn')
            .on(animationEnd, function(){
                $(this).addClass('logoshake').off();
            });
    }
};

function doorAction(left, right, time){
    var $doow = $('.door');
    var doorLeft = $('.door-left');
    var doorRight = $('.door-right');
    var defer = $.Deferred();
    var count = 2;
    //等待开门完成
    var complete = function(){
        if(count === 1){
            defer.resolve();
            return;
        }
        count--;
    };
    doorLeft.transition({
        'left':left
    }, time, complete);
    doorRight.transition({
        'left':right
    }, time, complete);
    return defer;
}
//开门
function openDoor(){
    return doorAction('-50%', '100%', 2000);
}
//关门
function shutDoor(){
    return doorAction('0%', '50%', 2000);
}

var audioConfig = {
    enable: true,
    playURL: 'music/happy.wav',
    cycleURL: 'music/circulation.wav'
};

function Html5Audio(url, isloop){
    var audio = new Audio(url);
    audio.autoPlay = true;
    audio.loop = isloop || false;
    audio.play();
    return {
        end: function(callback){
            audio.addEventListener('ended', function(){
                callback();
            }, false);
        }
    };
}
