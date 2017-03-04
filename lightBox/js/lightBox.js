;(function(){
	var LightBox = function(settings){
		var self = this;
		this.settings = {
			speed : 500,
			maxWidth : 0.9,
			maxHeight :0.9
		}
		$.extend(this.settings,settings || {});
		//创建遮罩层和弹出层
		this.popupMask = $('<div id="G-lightbox-mask">');
		this.popupWin = $('<div id="G-lightbox-popup">');
		//保存body
		this.bodyNode = $(document.body);
		//渲染剩余的DOM，并插入到body
		this.renderDOM();

		this.picViewArea = this.popupWin.find("div.lightbox-pic-view"); //图片预览区域
		this.popupPic = this.popupWin.find("img.lightbox-image"); //图片
		this.picCaptionArea = this.popupWin.find("div.lightbox-pic-caption"); //图片描述区域
		this.prevBtn = this.popupWin.find("span.light-prev-btn");
		this.nextBtn = this.popupWin.find("span.light-next-btn");
		this.captionText = this.popupWin.find("p.lightbox-pic-desc"); //图片描述
		this.currentIndex = this.popupWin.find("span.lightbox-of-index"); //图片当前索引
		this.closeBtn = this.popupWin.find("span.lightbox-close-btn"); //关闭按钮

		this.addEvent();
	};

	LightBox.prototype = {
		loadPicSize:function(sourceSrc){
			var self = this;
			self.popupPic.css({width:"auto",height:"auto"}).hide();
			self.picCaptionArea.hide();
			this.preLoadImg(sourceSrc,function(){
				self.popupPic.attr("src",sourceSrc);
				var picWidth = self.popupPic.width();
				var picHeight = self.popupPic.height();
				self.changePic(picWidth,picHeight);
			});
		},
		changePic:function(width,height){
			var self = this;
			var winWidth = $(window).width() * this.settings.maxWidth;
			var winHeight = $(window).height() * this.settings.maxHeight;
			var scale = Math.min(winWidth/(width+10),winHeight/(height+10),1);
			width *= scale;
			height *= scale;
			this.picViewArea.animate({
				width:width-10,
				height:height-10
			},self.settings.speed);
			this.popupWin.animate({
				width:width,
				height:height,
				marginLeft:-(width/2),
				top:(winHeight/self.settings.maxHeight - height)/2
			},self.settings.speed,function(){
				self.popupPic.css({
					width:width-10,
					height:height-10
				}).fadeIn();
				self.picCaptionArea.fadeIn();
				self.flag = true;
				self.clear = true;
			});
			//设置描述文字和当前索引
			this.captionText.text(this.groupData[this.index].caption);
			this.currentIndex.text("当前索引："+(this.index+1)+" of "+this.groupData.length);
		},
		preLoadImg:function(src,callBack){
			var img = new Image();
			if(!!window.ActiveXObject){  //判断是否是IE浏览器
				img.onreadystatechange = function(){
					if(this.readyState == "complete"){
						callBack();
					}
				};
			}else{
				img.onload = function(){
					callBack();
				};
			}
			img.src = src;
		},
		getIndexOf:function(currentId){
			var index = 0;
			$(this.groupData).each(function(i){
				index = i;
				if(this.id === currentId){
					return false;
				}
			});
			return index;
		},
		showMaskAndPopup:function(sourceSrc,currentId){
			var self = this;
			this.popupPic.hide();
			this.picCaptionArea.hide();
			this.popupMask.fadeIn();
			var winWidth = $(window).width();
			var winHeight = $(window).height();
			this.picViewArea.css({
				width:winWidth/2,
				height:winHeight/2
			});
			var viewWidth = winWidth/2+10;
			var viewHeight = winHeight/2+10;
			this.popupWin.fadeIn();
			this.popupWin.css({
				width:viewWidth,
				height:viewHeight,
				marginLeft:-viewWidth/2,
				top:-viewHeight
			}).animate({
				top:(winHeight-viewHeight)/2
			},self.settings.speed,function(){
				//加载图片
				self.loadPicSize(sourceSrc);
			});
			//根据当前点击的元素ID获取在当前组别里面的索引
			this.index = this.getIndexOf(currentId);
			var groupDataLength = this.groupData.length;
			if(groupDataLength > 1){
				if(this.index === 0){
					this.prevBtn.addClass("disabled");
					this.nextBtn.removeClass("disabled");
				}else if(this.index === groupDataLength-1){
					this.prevBtn.removeClass("disabled");
					this.nextBtn.addClass("disabled");
				}else{
					this.prevBtn.removeClass("disabled");
					this.nextBtn.removeClass("disabled");
				}
			}
		},
		initPopup:function(currentObj){
			var self = this;
			var sourceSrc = currentObj.attr("data-source");
			var currentId = currentObj.attr("data-id");

			this.showMaskAndPopup(sourceSrc,currentId);
		},
		getGroup:function(){
			var self = this;
			//根据当前的组别名称获取页面中所有相同组别的对象
			var groupList = this.bodyNode.find("*[data-group=" + this.groupName + "]");
			self.groupData.length = 0;
			groupList.each(function(){
				self.groupData.push({
					src:$(this).attr("data-source"),
					id:$(this).attr("data-id"),
					caption:$(this).attr("data-caption")
				});
			});
		},
		renderDOM:function(){
			var strDOM = '<div class="lightbox-pic-view">' +
						    '<span class="lightbox-btn light-prev-btn"></span>' +
						    '<img class="lightbox-image" src="" alt="">' +
						    '<span class="lightbox-btn light-next-btn"></span>' +
					     '</div>' +
					     '<div class="lightbox-pic-caption">' +
						    '<div class="lightbox-caption-area">' +
							   '<p class="lightbox-pic-desc"></p>' +
							   '<span class="lightbox-of-index"></span>' +
						    '</div>' +
						    '<span class="lightbox-close-btn"></span>' +
					     '</div>';
			//插入到this.popupWin
			this.popupWin.html(strDOM);
			//把遮罩层和弹出层插入到body
			this.bodyNode.append(this.popupMask,this.popupWin);
		},
		goTo:function(dir){
			if(dir === "prev"){
				this.index--;
				if(this.index <= 0){
					this.prevBtn.addClass("disabled").removeClass("light-prev-btn-show");
				}
				if(this.index != this.groupData.length-1){
					this.nextBtn.removeClass("disabled");
				}
			}else if(dir === "next"){
				this.index++;
				if(this.index >= this.groupData.length - 1){
					this.nextBtn.addClass("disabled").removeClass("light-next-btn-show");
				}
				if(this.index != 0){
					this.prevBtn.removeClass("disabled");
				}
			}
			var src = this.groupData[this.index].src;
			this.loadPicSize(src);
		},
		closeMaskAndPopup:function(){
			this.popupMask.fadeOut();
			this.popupWin.fadeOut();
			this.clear = false;
		},
		addEvent:function(){
			var self = this;
			//事件委托,获取数据组
			this.groupName = null;
			this.groupData = [];
			this.bodyNode.delegate(".js-lightbox, *[data-role=lightbox]","click",function(e){
				//阻止事件冒泡
				e.stopPropagation();
				var currentGroupName = $(this).attr("data-group");
				if(currentGroupName != self.groupName){
					self.groupName = currentGroupName;
					self.getGroup();
				}
				//初始化弹出框
				self.initPopup($(this));
			});
			this.popupMask.click(function(){
				self.closeMaskAndPopup();
			});
			this.closeBtn.click(function(){
				self.closeMaskAndPopup();
			});
			this.flag = true;//给按钮加锁，防止连续点击
			this.prevBtn.hover(function(){
				if(!$(this).hasClass("disabled") && self.groupData.length>1){
					$(this).addClass("light-prev-btn-show");
				}
			},function(){
				if(!$(this).hasClass("disabled") && self.groupData.length>1){
					$(this).removeClass("light-prev-btn-show");
				}
			}).click(function(e){
				self.btnClick(e,$(this),"prev");
			});
			this.nextBtn.hover(function(){
				if(!$(this).hasClass("disabled") && self.groupData.length>1){
					$(this).addClass("light-next-btn-show");
				}
			},function(){
				if(!$(this).hasClass("disabled") && self.groupData.length>1){
					$(this).removeClass("light-next-btn-show");
				}
			}).click(function(e){
				self.btnClick(e,$(this),"next");
			});
			//绑定窗口调整事件
			var timer = null;
			this.clear = false;
			$(window).resize(function(){
				if(self.clear){
					window.clearTimeout(timer);
					timer = window.setTimeout(function(){
						self.loadPicSize(self.groupData[self.index].src);
					}, 500);
				}
			}).keyup(function(e){
				var keyValue = e.which;
				if(self.clear){
					if(keyValue == 37 || keyValue == 38){
						self.prevBtn.click();
					}else if(keyValue == 39 || keyValue == 40){
						self.nextBtn.click();
					}
				}
			});
		},
		btnClick:function(e,btn,dir){
			if(!btn.hasClass("disabled") && this.groupData.length>1 && this.flag){
				this.flag = false;
				e.stopPropagation();
				this.goTo(dir);
			}
		}
	};

	window.LightBox = LightBox;
})();
