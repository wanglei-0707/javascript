function getEvent(event){
    return event || window.event;
}

function stopPropagation(event){
    if(event.stopPropagation){
        event.stopPropagation();
    }else{
        event.cancelBubble = true;
    }
}
