function Swipe(container){
    var element = container.find(':first'),
        swipe = {},
        slides = element.find('>'),
        width = container.width();
        height = container.height();
    //设置ul页面总宽高
    element.css({
        width: (slides.length * width) + 'px',
        height: height + 'px'
    });
    //设置每一个li页面的宽高
    $.each(slides, function(index){
        var slide = slides.eq(index);
        slide.css({
            width: width + 'px',
            height: height + 'px'
        });
    });
    //监控完成与移动
    swipe.scrollTo = function(x, speed){
        element.css({
            'transition-timing-function': 'linear',
            'transition-duration': speed + 'ms',
            'transform': 'translate3d(-' + x + 'px, 0px, 0px)'
        });
        return this;
    };
    return swipe;
}
