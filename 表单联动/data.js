var provinceData = ['安徽', '福建', '甘肃'],
    cityData = [
        ['合肥', '芜湖', '淮南'],
        ['福州', '厦门', '三明'],
        ['兰州', '白银', '金昌']
    ],
    districtData = [
        [
            ['瑶海', '庐阳', '蜀山'],
            ['镜湖', '弋江', '繁昌'],
            ['大通', '谢家集', '八公山']
        ],
        [
            ['鼓楼', '台江', '仓山'],
            ['思明', '海沧', '湖里'],
            ['梅列', '三元', '明溪']
        ],
        [
            ['城关', '七里河', '西固'],
            ['白银', '平川', '靖远'],
            ['金川', '永昌']
        ]
    ];

function $(id){
    return document.getElementById(id);
}

function stopPropagation(event){
    if(event.stopPropagation){
            event.stopPropagation();
    }else{
            event.cancelBubble  = true;
    }
}

function getEvent(event){
    return event || e.window.event;
}

function getTarget(e){
    e = e || window.event;
    var target = e.target || e.srcElement;
    return target;
}
