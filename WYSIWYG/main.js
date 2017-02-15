var menubar = wl.$('menubar');

wl.addEvent(menubar, 'click', function(e){
    wl.preDefault(e);
    e = wl.getEvent(e);
    var target = wl.getTarget(e);
    if(target && target.tagName === 'A' || target.parentNode.tagName === 'A'){
        target = target.parentNode.tagName === 'A' ? target.parentNode : target;
        handler.call(null, target);
        wl.stopPropa(e);

    }
});

function handler(ele){
    console.log(ele.dataset.role);
    switch (ele.dataset.role) {
        // 该命令尚不支持
        case 'strickthrough':

            break;
        // 该命令尚不支持
        case 'justifyfull':

            break;
        default:
            document.execCommand(ele.dataset.role, false, null);
    }
}
