# MobileScroll
A small tool for smooth and easy touch in mobile device;
一个方便在移动端流畅简易滑动的工具

install
npm install mobilescroll

Usage
new MobileScroll('.wrapper', {<br>
    deceleration: 0.006, //参考加速度，可选，默认为0.006<br>
    noOutOfBounds: true, //禁止越界标志，可选，默认为false<br>
    noBounce: true, //禁止单性效果，可选，默认为false<br>
    wheel: true,    //滚动轮效果，可选，默认为false<br>
    slide: true,    //惯性效果，可选，默认为false<br>
    loop: true,     //是否循环，可选，默认为false,<br>
    step: 200,      //步长，可选<br>
    bounceThreshold: 0.5,   //弹性阀值，可选，默认为0.5<br>
    name: 'mscroll',    //名称，可选<br>
    vertical: true,     //是否垂直方向，可选，默认为false<br>
    min: -100,  //最小运动值，必填<br>
    max: 0     //最大运动值，必填<br>
})


API
methods:

|     name     |     arguments     |     description     |
|--------------|-------------------|---------------------|
        