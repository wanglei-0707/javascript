;(function($){
	var Slide = function(slide){
		var self = this;
		this.slide = slide;
		this.prevBtn = this.slide.find("span.slide-prev-btn");
		this.nextBtn = this.slide.find("span.slide-next-btn");
		this.itemsArea = this.slide.find("ul.slide-list");
		this.items = this.itemsArea.find("li.slide-item");
		if(this.items.size() % 2 === 0){
			this.itemsArea.append(this.items.eq(0).clone());
			this.items = this.itemsArea.children();
		}
		this.firstItem = this.items.first();
		this.lastItem = this.items.last();
		//配置默认参数
		this.settings = {
			"width":800,   //幻灯片区域宽度
			"height":270,  //幻灯片区域高度
			"firstPicWidth":450,  //第一张图片宽度
			"firstPicHeight":270,  //第一场图片高度
			"scale":0.9,
			"speed":500,
			"autoPlay":false,
			"delay":2000,
			"verticalAlign":"middle"
		}
		$.extend(this.settings,this.getSettings());
		this.setSettingsValue();
		this.setSlidePos();
		this.block = true;
		this.prevBtn.click(function(){
			if(self.block == true){
				self.block = false;
				self.slideRotate("right");
			}
		});
		this.nextBtn.click(function(){
			if(self.block == true){
				self.block = false;
				self.slideRotate("left");
			}
		});
		//是否自动播放
		if(this.settings.autoPlay){
			this.autoPlay();
			this.slide.hover(function(){
				window.clearInterval(self.timer);
			},function(){
				self.autoPlay();
			});
		}
	};

	Slide.prototype = {
		//获取人工设置的参数
		getSettings:function(){
			var settings = this.slide.attr("data-setting");
			if(settings && settings != ""){
				return $.parseJSON(settings);  //将settings转换成JSON对象
			}else{
				return {};
			}
		},
		//设置配置参数去控制基本的宽度高度
		setSettingsValue:function(){
			this.slide.css({
				width:this.settings.width,
				height:this.settings.height
			});
			this.itemsArea.css({
				width:this.settings.width,
				height:this.settings.height
			});
			var w = (this.settings.width - this.settings.firstPicWidth) / 2;
			this.prevBtn.css({
				width:w,
				height:this.settings.height,
				zIndex:Math.ceil(this.items.size() / 2)
			});
			this.nextBtn.css({
				width:w,
				height:this.settings.height,
				zIndex:Math.ceil(this.items.size() / 2)
			});
			this.firstItem.css({
				left:w,
				zIndex:Math.floor(this.items.size() / 2)
			});
		},
		//获取top值
		setTopValue:function(height){
			var verticalAlign = this.settings.verticalAlign;
			var top = 0;
			if(verticalAlign === "top"){
				top = 0;
			}else if(verticalAlign === "middle"){
				top = (this.settings.height - height) / 2;
			}else if(verticalAlign === "bottom"){
				top = this.settings.height - height;
			}else{
				top = (this.settings.height - height) / 2;
			}
			return top;
		},
		//设置左右两边剩余的帧的位置
		setSlidePos:function(){
			var self = this;
			var sliceItems = this.items.slice(1);
			var sliceSize = sliceItems.size() / 2;
			var rightSlice = sliceItems.slice(0,sliceSize);
			var leftSlice = sliceItems.slice(sliceSize);
			var rw = this.settings.firstPicWidth;
			var rh = this.settings.firstPicHeight;
			var level = Math.floor(sliceSize);
			var gap = ((this.settings.width - this.settings.firstPicWidth) / 2) / sliceSize;
			var baseLeft = (this.settings.width - this.settings.firstPicWidth) / 2 + rw;
			//设置右边的位置关系
			rightSlice.each(function(i){
				rw *= self.settings.scale;
				rh *= self.settings.scale;
				$(this).css({
					width:rw,
					height:rh,
					zIndex:--level,
					opacity:1/++i,
					left:baseLeft + gap * i - rw,
					top:self.setTopValue(rh)
				});
			});
			var lw = rightSlice.last().width();
			var lh = rightSlice.last().height();
			var level = Math.floor(sliceSize);
			//设置左边的位置关系
			leftSlice.each(function(i){
				$(this).css({
					width:lw,
					height:lh,
					zIndex:i,
					opacity:1/--level,
					left:i * gap,
					top:self.setTopValue(lh)
				});
				lw /= self.settings.scale;
				lh /= self.settings.scale;
			});
		},
		//旋转
		slideRotate:function(dir){
			var self = this;
			var indexArr = [];
			if(dir === "left"){
				this.items.each(function(){
					var prev = $(this).prev().get(0) ? $(this).prev() : self.lastItem;
					indexArr.push(prev.css("zIndex"));
					$(this).animate({
						width:prev.width(),
						height:prev.height(),
						opacity:prev.css("opacity"),
						left:prev.css("left"),
						top:prev.css("top")
					},self.settings.speed,function(){
						self.block = true;
					});
				});
			}else if(dir === "right"){
				this.items.each(function(){
					var next = $(this).next().get(0) ? $(this).next() : self.firstItem;
					indexArr.push(next.css("zIndex"));
					$(this).animate({
						width:next.width(),
						height:next.height(),
						opacity:next.css("opacity"),
						left:next.css("left"),
						top:next.css("top")
					},self.settings.speed,function(){
						self.block = true;
					});
				});
			}
			this.items.each(function(i){
				$(this).css("zIndex",indexArr[i]);
			});
		},
		//自动播放
		autoPlay:function(){
			var self = this;
			this.timer = window.setInterval(function(){
				self.nextBtn.click();
			}, this.settings.delay);
		},
	};

	Slide.init = function(slides){
		slides.each(function(){
			new Slide($(this));
		})
	}

	window["Slide"] = Slide;
})(jQuery);
