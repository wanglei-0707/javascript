## HTML
1. **HTML5 为什么只需要写 !DOCTYPE HTML？**

    HTML5 不基于 SGML，因此不需要对DTD进行引用，但是需要doctype来规范浏览器的行为（让浏览器按照它们应该的方式来运行）；而HTML4.01基于SGML,所以需要对DTD进行引用，才能告知浏览器文档所使用的文档类型。
2. **Doctype作用？标准模式与兼容模式各有什么区别?**

    !DOCTYPE声明位于位于HTML文档中的第一行，处于html 标签之前。告知浏览器的解析器用什么文档标准解析这个文档。DOCTYPE不存在或格式不正确会导致文档以兼容模式呈现。

    标准模式的排版 和JS运作模式都是以该浏览器支持的最高标准运行。在兼容模式中，页面以宽松的向后兼容的方式显示,模拟老式浏览器的行为以防止站点无法工作。
3. **页面有一个按钮button id为 button1，通过原生的js如何禁用？**

    A. document.getElementById("button1").readolny=true;      
    B. document.getElementById("button1").setAttribute(“readolny”,”true”);      
    C. document.getElementById("button1").disabled = true;       
    D. document.getElementById("button1").setAttribute(“disabled”,”true”);

    正确答案 : C
4. **http，https默认端口号**

    1. HTTP服务器，默认的端口号为80/tcp；
    2. HTTPS（securely transferring web pages）服务器，默认的端口号为443/tcp 443/udp；
    3. Telnet（不安全的文本传送），默认端口号为23/tcp；
    4. FTP，默认的端口号为21/tcp；
5. **检测页面的兼容模式**

    1. document.compatMode === "CSS1Compat" // 标准模式
    2. document.compatMode === "BackCompat" // 兼容模式
## CSS
1. **简述一下src与href的区别**

    href 是指向网络资源所在位置，建立和当前元素（锚点）或当前文档（链接）之间的链接，用于超链接。

    src是指向外部资源的位置，指向的内容将会嵌入到文档中当前标签所在位置；在请求src资源时会将其指向的资源下载并应用到文档内，例如js脚本，img图片和frame等元素。当浏览器解析到该元素时，会暂停其他资源的下载和处理，直到将该资源加载、编译、执行完毕，图片和框架等元素也如此，类似于将所指向资源嵌入当前标签内。这也是为什么将js脚本放在底部而不是头部的原因。
2. **什么叫优雅降级和渐进增强？**

    渐进增强 progressive enhancement：针对低版本浏览器进行构建页面，保证最基本的功能，然后再针对高级浏览器进行效果、交互等改进和追加功能达到更好的用户体验。

    优雅降级 graceful degradation：一开始就构建完整的功能，然后再针对低版本浏览器进行兼容。

    区别：

    a. 优雅降级是从复杂的现状开始，并试图减少用户体验的供给     
    b. 渐进增强则是从一个非常基础的，能够起作用的版本开始，并不断扩充，以适应未来环境的需要    
    c. 降级（功能衰减）意味着往回看；而渐进增强则意味着朝前看，同时保证其根基处于安全地带
3. **设置元素浮动后，该元素的display值是多少？**

    自动变成display:block
4. **怎么让Chrome支持小于12px 的文字？**

    -webkit-text-size-adjust:none.这种方法在新版chrome下已经无效。

    可以使用：transform:scale()
5. **如何修改chrome记住密码后自动填充表单的黄色背景 ？**
```
input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
}
```

6. **页面导入样式时，使用link和@import有什么区别？**

    1. link属于XHTML标签，除了加载CSS外，还能用于定义RSS, 定义rel连接属性等作用；而@import是CSS提供的，只能用于加载CSS;
    2. 页面被加载的时，link会同时被加载，而@import引用的CSS会等到页面被加载完再加载;
    3. import是CSS2.1 提出的，只在IE5以上才能被识别，而link是XHTML标签，无兼容问题;

7. **介绍一下你对浏览器内核的理解？**

    主要分成两部分：渲染引擎(layout engineer或Rendering Engine)和JS引擎。

    渲染引擎：负责取得网页的内容（HTML、XML、图像等等）、整理讯息（例如加入CSS等），以及计算网页的显示方式，然后会输出至显示器或打印机。浏览器的内核的不同对于网页的语法解释会有不同，所以渲染的效果也不相同。所有网页浏览器、电子邮件客户端以及其它需要编辑、显示网络内容的应用程序都需要内核。

    JS引擎：解析和执行javascript来实现网页的动态效果。

    最开始渲染引擎和JS引擎并没有区分的很明确，后来JS引擎越来越独立，内核就倾向于只指渲染引擎。
8. **CSS隐藏元素的几种方法（至少说出三种）**

    1. Opacity:元素本身依然占据它自己的位置并对网页的布局起作用。它也将响应用户交互;
    2. Visibility:与 opacity 唯一不同的是它不会响应任何用户交互。此外，元素在读屏软件中也会被隐藏;
    3. Display:display 设为 none 任何对该元素直接打用户交互操作都不可能生效。此外，读屏软件也不会读到元素的内容。这种方式产生的效果就像元素完全不存在;
    4. Position:不会影响布局，能让元素保持可以操作;
    5. Clip-path:clip-path 属性还没有在 IE 或者 Edge 下被完全支持。如果要在你的 clip-path 中使用外部的 SVG 文件，浏览器支持度还要低;
## JavaScript
1. **简述同步和异步的区别**

    同步是阻塞模式，异步是非阻塞模式。

    同步就是指一个进程在执行某个请求的时候，若该请求需要一段时间才能返回信息，那么这个进程将会一直等待下去，直到收到返回信息才继续执行下去；

    异步是指进程不需要一直等下去，而是继续执行下面的操作，不管其他进程的状态。当有消息返回时系统会通知进程进行处理，这样可以提高执行的效率。
2. **Javascript中callee和caller的作用？**

    caller是返回一个对函数的引用，该函数调用了当前函数；
    functionName.caller //functionName 对象是所执行函数的名称。
    ```
    function callerDemo() {
        if (callerDemo.caller) {
            var a= callerDemo.caller;
            alert(a);//function handleCaller() {callerDemo();}
        } else {
            alert("this is a top function");
        }
    }
    function handleCaller() {
        callerDemo();
    }
    ```
    callee是返回正在被执行的function函数，也就是所指定的function对象的正文。callee 属性是 arguments 对象的一个成员，它表示对函数对象本身的引用，这有利于匿名函数的递归或者保证函数的封装性，

3. **请描述一下cookies，sessionStorage和localStorage的区别**

   sessionStorage用于本地存储一个会话（session）中的数据，这些数据只有在同一个会话中的页面才能访问并且当会话结束后数据也随之销毁。因此sessionStorage不是一种持久化的本地存储，仅仅是会话级别的存储。而localStorage用于持久化的本地存储，除非主动删除数据，否则数据是永远不会过期的。

   web storage和cookie的区别

   Web Storage的概念和cookie相似，区别是它是为了更大容量存储设计的。Cookie的大小是受限的，并且每次你请求一个新的页面的时候Cookie都会被发送过去，这样无形中浪费了带宽，另外cookie还需要指定作用域，不可以跨域调用。
   除此之外，Web Storage拥有setItem,getItem,removeItem,clear等方法，不像cookie需要前端开发者自己封装setCookie，getCookie。但是Cookie也是不可以或缺的：Cookie的作用是与服务器进行交互，作为HTTP规范的一部分而存在 ，而Web Storage仅仅是为了在本地“存储”数据而生。

4. **写一个function，清除字符串前后的空格。（兼容所有浏览器）**
    ```
    function trim(str) {
        if (str & typeof str === "string") {
            return str.replace(/(^s*)|(s*)$/g,""); //去除前后空白符
        }
    }
    ```
5. **输出结果是？**
    ```
    (function(x){   
        delete x;   
        return x;//1   
    })(1);
    ```
    delete操作符只能作用在对象的属性上，对变量和函数名无效。也就是说delete x是没有意义的。delete是不会直接释放内存的，她只是间接的中断对象引用

6. **这是一个名字是g的function expression，然后又被赋值给了变量f。**
    ```
    var f = function g(){ return 23; };   
    typeof g();//报错
    ```

    这里的函数名g和被其赋值的变量f有如下差异：
    1. 函数名g不能变动，而变量f可以被重新赋值
    2. 函数名g只能在函数体内部被使用，试图在函数外部使用g会报错的

## 其他
1. **下列排序算法不稳定的有?**

    A 插入排序  B 希尔排序  C 冒泡排序  D 堆排序  E 归并排序  F 快速排序  G 选择排序

    正确答案 : BDFG
2. **下面那个页面调度算法,当进程分配到的页面数增加时,缺页中断的次数可能增加也可能减少**

    A FIFO算法 B LRU算法 C Clock算法 D LFU算法

    正确答案 : A
