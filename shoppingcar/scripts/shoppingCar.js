window.onload = function(){
	if(!document.getElementsByClassName){
		document.getElementsByClassName = function(cls){
			var ret = [];
			var els = document.getElementsByTagName("*");
			for(var i=0,len=els.length;i<len;i++){
				if(els[i].className === cls
					|| els[i].className.indexOf(cls + " ")
					|| els[i].className.indexOf(" " + cls + " ")
					|| els[i].className.indexOf(" " + cls)){
					ret.push(els[i]);
				}
			}
		}
	}
	var table = document.getElementById("carTable");
	var trs =  table.children[1].rows;
	var checkInputs = document.getElementsByClassName("check");
	var checkOneInputs = document.getElementsByClassName("check-one");
	var checkAllInputs = document.getElementsByClassName("check-all");
	var selectedTotal = document.getElementById("selectedTotal");
	var priceTotal = document.getElementById("priceTotal");
	var selected = document.getElementById("selected");
	var foot = document.getElementById("foot");
	var selectedViewList = document.getElementById("selectedViewList");
	var deleteAll = document.getElementById("deleteAll");

	function getTotal(){
		var selected = 0;
		var price = 0;
		var HTMLstr = '';
		for(var i=0,len=trs.length;i<len;i++){
			if(trs[i].getElementsByTagName("input")[0].checked){
				trs[i].className = "on";
				selected += parseInt(trs[i].getElementsByTagName("input")[1].value);
				price += parseFloat(trs[i].cells[4].innerHTML);
				HTMLstr += '<div><img src="' + trs[i].getElementsByTagName("img")[0].src +'"/><span class="del" index="' + i +'">取消选择</span></div>';
			}
			else{
				trs[i].className = "";
			}
		}
		selectedTotal.innerHTML = selected;
		priceTotal.innerHTML = price.toFixed(2);
		selectedViewList.innerHTML = HTMLstr;
		if(selected==0){
			foot.className = "foot";
		}
	}
	function getSubTotal(tr){
		var tds = tr.cells;
		var price = parseFloat(tds[2].innerHTML);
		var count = tr.getElementsByTagName("input")[1].value;
		var subTotal = price * count;
		tds[4].innerHTML = parseFloat(subTotal).toFixed(2);
	}
	for(var i=0;i<checkInputs.length;i++){
		checkInputs[i].onclick = function(){
			if(this.className == "check-all check"){
				for(var j=0;j<checkInputs.length;j++){
					checkInputs[j].checked = this.checked;
				}
			}
			if(this.checked == false){
				for(var k=0;k<checkAllInputs.length;k++){
					checkAllInputs[k].checked = this.checked;
				}
			}
			if(this.className === "check-one check"){
				var count = 0;
				for(var p=0;p<checkOneInputs.length;p++){
					if(checkOneInputs[p].checked==true)
						count++;
				}
				if(count==checkOneInputs.length){
					for(var q=0;q<checkAllInputs.length;q++){
						checkAllInputs[q].checked = true;
					}
				}
			}
			getTotal();
		}
	}
	selected.onclick = function(){
		if(foot.className=="foot"){
			if(selectedTotal.innerHTML!=0){
				foot.className = "foot show";
			}
		}else{
			foot.className = "foot";
		}
	}
	selectedViewList.onclick = function(e){
		e = e || window.event;
		var el = e.srcElement;
		if(el.className == 'del'){
			var index = el.getAttribute("index");
			var input = trs[index].getElementsByTagName("input")[0];
			input.checked = false;
			input.onclick();
		}
	}
	for(var i=0;i<trs.length;i++){
		trs[i].onclick = function(e){
			e = e || window.event;
			var el = e.srcElement;
			var cls = el.className;
			var input = this.getElementsByTagName("input")[1];
			var val = parseInt(input.value);
			var reduce = this.getElementsByTagName("span")[1];
			switch(cls){
				case "reduce":
					if(input.value>1){
						input.value = val-1;
					}
					if(input.value<=1){
						reduce.innerHTML = "";
					}
					getSubTotal(this);
					break;
				case "add":
					input.value = val+1;
					reduce.innerHTML = "-";
					getSubTotal(this);
					break;
				case "delete":
					var conf = confirm("确定要删除吗？");
					if(conf){
						this.parentNode.removeChild(this);
					}
				default:
					break;
			}
			getTotal();
		}
		trs[i].getElementsByTagName("input")[1].onkeyup = function(){
			var tr = this.parentNode.parentNode;
			var reduce = tr.getElementsByTagName("span")[1];
			var val = parseInt(this.value);
			if(isNaN(val)||val<1){
				val = 1;
			}
			this.value = val;
			if(val<=1){
				reduce.innerHTML = "";
			}else{
				reduce.innerHTML = "-";
			}
			getSubTotal(tr);
			getTotal();
		}
	}
	deleteAll.onclick = function(){
		if(selectedTotal.innerHTML!=0){
			var conf = confirm("确定要删除吗？");
			if(conf){
				for(var i=0;i<trs.length;i++){
					var input = trs[i].getElementsByTagName("input")[0];
					if(input.checked){
						trs[i].parentNode.removeChild(trs[i]);
						i--;
					}
				}
				for(var j=0;j<checkAllInputs.length;j++){
					checkAllInputs[j].checked = false;
				}
				getTotal();
				getSubTotal();
			}
		}
	}
	checkAllInputs[0].checked = true;
	checkAllInputs[0].onclick();
}
