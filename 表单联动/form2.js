var input = $('form-input'),
    labelPage = $('label-page'),
    form2 = document.getElementsByTagName('form')[1],
    ul = $('label-ul'),
    lis = form2.getElementsByTagName('li'),
    dataList = $('data-list'),
    showStr = '', proIndex, cityIndex, districtIndex;

/**
 * 更改当前选中的标签页的样式
 * @param {DOMElement} selectedLi 选中的li元素
 */
function changeSelected(selectedLi){
    for(var i=0;i<lis.length;i++){
        var curLi = lis[i];
        if(curLi.className === 'selected'){
            curLi.className = '';
        }
    }
    selectedLi.className = 'selected';
}

/**
 * 渲染标签页的内容
 * @param {Array} data 需要显示的数据数组
 */
function renderDataList(data){
    if(!data){
        return;
    }
    var fragment = document.createDocumentFragment(),
        type = parseInt(dataList.getAttribute('type')),
        selected;
    switch(type){
        case 0:
            selected = proIndex;
            break;
        case 1:
            selected = cityIndex;
            break;
        case 2:
            selected = districtIndex;
            break;
    }
    for(var i=0,len=data.length;i<len;i++){
        var a = document.createElement('a');
        if(i === selected){
            a.className = 'selected';
        }
        a.setAttribute('attr-id', i);
        a.innerHTML = data[i];
        fragment.appendChild(a);
    }
    dataList.innerHTML = '';
    dataList.appendChild(fragment);
}

input.addEventListener('click', function(e){
    changeSelected(lis[0]);
    labelPage.style.display = 'block';
    dataList.setAttribute('type', 0);
    renderDataList(provinceData);
    e.stopPropagation();
}, false);

//点击空白处标签页隐藏
document.addEventListener('click', function(){
    labelPage.style.display = 'none';
}, false);

lis[0].onclick = function(e){
    liClickHandler(0, e, this);
};
lis[1].onclick = function(e){
    liClickHandler(1, e, this);
};
lis[2].onclick = function(e){
    liClickHandler(2, e, this);
};

/**
 * 选择一个地区之后显示下一级标签页，
 * @param {Number} type 标签页目前所处的类型 0：省份 1：城市 2：县区
 * @param {Object} e 当前触发的事件
 * @param {Object} self 指向当前触发事件所在对象的指针
 */
function liClickHandler(type, e, self){
    dataList.setAttribute('type', type);
    switch(type){
        case 0:
            data = provinceData;
            break;
        case 1:
            data = proIndex === undefined ? [] : cityData[proIndex];
            break;
        case 2:
            data = cityIndex === undefined ? [] : districtData[proIndex][cityIndex];
    }
    changeSelected(self);
    renderDataList(data);
    e.stopPropagation();
}

dataList.addEventListener('click',function(e){
    var target = getTarget(e);
    var type = parseInt(this.getAttribute('type'));
    if(target.tagName === 'A'){
        var arr;
        switch(type){
            case 0:
                proIndex = parseInt(target.getAttribute('attr-id'));
                cityIndex = null;
                districtIndex = null;
                showStr = target.innerHTML;
                break;
            case 1:
                cityIndex = parseInt(target.getAttribute('attr-id'));
                districtIndex = null;
                arr = showStr.split('/');
                if(arr.length === 1){
                    showStr += '/' + target.innerHTML;
                }else{
                    showStr = arr[0] + '/' + target.innerHTML;
                }
                break;
            case 2:
                districtIndex = parseInt(target.getAttribute('attr-id'));
                arr = showStr.split('/');
                if(arr.length === 2){
                    showStr += '/' + target.innerHTML;
                }else{
                    showStr = arr[0] + '/' + arr[1] + '/' + target.innerHTML;
                }
                labelPage.style.display = 'none';
                break;
        }
        input.value = showStr;
        if(type !== 2){
            var eventObj = document.createEvent('Events');
            eventObj.initEvent('click', true, true);
            lis[type+1].dispatchEvent(eventObj);
            // lis[type+1].onclick();
        }
    }
    e.stopPropagation();
}, false);
