//获取id的元素
function $(id){
    if(typeof id === "string"){
        return document.getElementById(id);
    }
    return id;
}

//添加事件句柄
function addEvent(ele, type, handler){
    if(ele.addEventListener){
        ele.addEventListener(type, handler, true);
    }else if(ele.attachEvent){
        ele.attachEvent("on"+type, handler);
    }else{
        ele["on"+type] = handler;
    }
}

//阻止默认事件
function stopPro(event){
    if(event.stopPropagation){
        event.stopPropagation();
    }else{
        event.cancelBubble = true;
    }
}

function getOffset(ele){
    return ele.getBoundingClientRect ? ele.getBoundingClientRect() : {left: ele.offsetLeft, top: ele.offsetTop};
}

function limit(num, minNum, maxNum){
    return Math.min(Math.max(num, minNum), maxNum);
}

//获取鼠标相对于文档的坐标，包括页面滚动的距离。浏览器兼容
function getMousePos(event){
    var posX, posY;
    event = event || window.event;
    if(event.pageX){
        posX = event.pageX;
        posY = event.pageY;
    }else{
        var doc = document.documentElement || document.body;
        posX = event.clientX + doc.scrollLeft - doc.clientLeft; //鼠标相对于浏览器窗口坐标 + 页面滚动距离 - 文档边框的宽度
        posY = event.clientY + doc.scrollTop - doc.clientTop;
    }
    return {
        posX: posX,
        posY: posY
    };
}
