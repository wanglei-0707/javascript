## 水平居中布局Y轴出现或消失滚动条时，防止页面左右滚动
#### 原博： [小tip:CSS vw让overflow:auto页面滚动条出现时不跳动](http://www.zhangxinxu.com/wordpress/2015/01/css-page-scrollbar-toggle-center-no-jumping/)

1. 利用css3的calc和vw单位实现，在需要居中的元素的父元素添加如下样式：
```
margin-left:calc(100vw - 100%);
或者
padding-leftLcalc(100vw - 100%);
```
解析：100vw相当于浏览器的内部宽度window.innerWidth,包括滚动条的宽度，而100%是可用宽度，不包含滚动条，所以100vw-100%结果就是滚动条的宽度，如果没有滚动条结果就是0。左右都有一个滚动条，内容就可以永远居中了，不会出现跳动。

[demo](https://wanglei-0707.github.io/javascript/scrollbar/demo1.html)

2. 更终极的解决方案, :root选择器，选择根元素，一般为HTML标签：
```
html{
    overflow-y:scroll;
}
body{
    width:100vw;
    overflow:hidden;
}
或者
:root {
  overflow-y: auto;
  overflow-x: hidden;
}
:root body {
  position: absolute;
}
```
[demo](https://wanglei-0707.github.io/javascript/scrollbar/demo2.html)
