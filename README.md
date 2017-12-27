# MobileScroll
A small tool for smooth and easy touch in mobile device;

## **Install**

npm install mobilescroll --save

## **Usage**

```
new MobileScroll('.wrapper', //selector or dom 外层包装，可为选择器或者dom元素
{
        
    deceleration: 0.006, //参考加速度，可选，默认为0.006
    noOutOfBounds: true, //禁止越界标志，可选，默认为false
    noBounce: true, //禁止单性效果，可选，默认为false
    wheel: true,    //滚动轮效果，可选，默认为false
    slide: true,    //惯性效果，可选，默认为false
    loop: true,     //是否循环，可选，默认为false,
    step: 200,      //步长，可选
    name: 'mscroll',    //名称，可选
    vertical: true,     //是否垂直方向，可选，默认为false
    bounceThreshold: 0.5,//弹性的阀值，可选，默认为0.5
    min: -100,  //最小运动值，必填
    max: 0     //最大运动值，必填
})
```
```
<script src="mobile-scroll.js"></script>

```
```
<div class="wrapper">
    <div class="scroller">
        <p class="item"></p>
        <p class="item"></p>
        <p class="item"></p>
        <p class="item"></p>
    </div>
</div>
```



## **API**

### methods

### slideTo
---
#### 描述
    滑动到某个模块
#### 参数
    i   索引
    duration    滑动时间


### getIndex
---
#### 描述
    获取当前索引
#### 参数
    无

### startAutoPlay
---
#### 描述
    开启自动播放
#### 参数
    无

### stopAutoPlay
---
#### 描述
    停止自动播放
#### 参数
    无
    
### pause
---
#### 描述
    暂停自动播放
#### 参数
    无

    
### destory
---
#### 描述
    销毁mobilescroll
#### 参数
    无

---
### 
### events

#### moveStart
#### move
#### moveEnd

```
mobilescroll.on('moveStart', function(){
    //note that the context 'this' is point to mobilescroll
})
```
