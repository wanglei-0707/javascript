function BoyWalk(){
    var $content = $('#content'),
        visualWidth = $content.width(),
        visualHeight = $content.height(),
        $boy = $('#boy'),
        boyHeight = $boy.height(),
        swipe = Swipe($content),
        pathY, instanceX;

    pathY = function(){
        var data = getValue('.a_background_middle');
        return data.top + data.height / 2;
    }();

    //设置小男孩的位置
    $boy.css({
        top: (pathY - boyHeight) + 25 + 'px'
    });
    //暂停走路
    function pauseWalk(){
        $boy.addClass('pauseWalk');
    }
    //恢复走路
    function restoreWalk(){
        $boy.removeClass('pauseWalk');
    }

    function slowWalk(){
        $boy.addClass('slowWalk');
    }

    function calcutateDist(direction, proportion){
        return (direction === 'x' ? visualWidth : visualHeight) * proportion;
    }

    function startRun(options, runTime){
        var dfdPlay = $.Deferred();
        restoreWalk();
        $boy.transition(options, runTime, 'linear', function(){
            dfdPlay.resolve(); //动画完成
        });
        return dfdPlay;
    }

    function walkRun(time, distX, distY){
        time = time || 3000;
        slowWalk();
        var d1 = startRun({
            'left': distX + 'px',
            'top': distY ? distY + 'px' : undefined
        }, time);
        return d1;
    }

    //走进商店
    function walkToShop(runTime){
        var defer = $.Deferred(),
            doorObj = $('.door'),
            offsetDoor = doorObj.offset(),
            doorOffsetLeft = offsetDoor.left,
            offsetBoy = $boy.offset(),
            boyOffsetLeft = offsetBoy.left;
        instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyOffsetLeft + $boy.width() / 2);
        startRun({
            transform: 'translateX(' + instanceX + 'px),scale(0.3, 0.3)',
            opacity: 0.1
        }, runTime).done(function(){
            $boy.css({
                opacity: 0
            });
            defer.resolve();
        });
        return defer;
    }

    //走出商店
    function walkOutShop(runTime){
        var defer = $.Deferred();
        restoreWalk();
        startRun({
            transform: 'translateX(' + instanceX + 'px),translateY(0),scale(1, 1)',
            opacity: 1
        }, runTime).done(function(){
            defer.resolve();
        });
        return defer;
    }

    //买花
    function buyFlower(){
        var defer = $.Deferred();
        setTimeout(function(){
            $boy.removeClass('slowWalk').addClass('slowFlowerWalk');
            defer.resolve();
        }, 1000);
        return defer;
    }

    return {
        walkTo:function(time, proportionX, proportionY){
            var distX = calcutateDist('x', proportionX);
            var distY = calcutateDist('y', proportionY);
            return walkRun(time, distX, distY);
        },
        stopWalk: function(){
            pauseWalk();
        },
        setColor: function(value){
            $boy.css({
                'background': value
            });
        },
        toShop:function(){
            return walkToShop.apply(null, arguments);
        },
        outShop:function(){
            return walkOutShop.apply(null, arguments);
        },
        buyFlower:buyFlower,
        getWidth:function(){
            return $boy.width();
        },
        resetOriginal:function(){
            this.stopWalk();
            $boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal');
        },
        setFlowerWalk:function(){
            $boy.addClass('slowFlowerWalk');
        },
        rotate:function(callback){
            restoreWalk();
            $boy.addClass('boy-rotate');
            // 监听转身完毕
            if (callback) {
                $boy.on(animationEnd, function() {
                    callback();
                    $(this).off();
                });
            }
        }
    };
}
