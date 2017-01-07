var select1 = $('select1'),
    select2 = $('select2'),
    select3 = $('select3');

function renderOption(data, select){
    var fragment = document.createDocumentFragment();
    for(var i=0,len=data.length;i<len;i++){
        var option = document.createElement('option');
        option.value = i;
        option.text = data[i];
        fragment.appendChild(option);
    }
    select.innerHTML = '';
    select.appendChild(fragment);
}
function init(){
    renderOption(provinceData, select1);
    renderOption(cityData[0], select2);
    renderOption(districtData[0][0], select3);
}
select1.onchange = function(){
    renderOption(cityData[this.value], select2);
    renderOption(districtData[this.value][0], select3);
};
select2.onchange = function(){
    renderOption(districtData[select1.value][this.value], select3);
};
init();
