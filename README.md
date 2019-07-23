# MobileScroll
A small tool for smooth and easy touch in mobile device;

## **Install**

npm install mobilescroll --save

## **Usage**

```
<script src="mobile-scroll.js"></script>

or
import MobileScroll from 'mobilescroll';

when your project is client-side render, you can use mobilescroll as above, but if your project is server-side render, you may use it as follows.

import('mobilescroll').then(({ defalut: MobileScroll }) => {
    // ......
});

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

```
new MobileScroll('.wrapper', //selector or dom element of the wrapper
{
        
    deceleration: 0.002, //Default 0.002
    noOutOfBounds: true, //optional flag which allow to be out of bounds, Default: false
    noBounce: true, //switch of bounce. Default: false. Optional
    wheel: true,    //the property about 3D. Default: false. Optional
    slide: true,    //the property about inertance. Default: false. Optional
    loop: true,     //switch of loop. Default: false. Optional
    step: 200,      //the step at each slide. Optional
    name: 'mscroll',    //the name of your mobilescroll instance. Optional
    vertical: true,     //whether the direction is vertical. Default: false
    bounceThreshold: 0.5,   //the threshod of bounce. Default: 0.5
    min: -100,  //the min value of scoller can move. Required
    max: 0     //the max value of scroll can move. Required
})
```


## **API**

### methods

### slideTo
---
#### Description
    slide to the block with specific index
#### Parameters
    i   index
    duration    slide duration


### getIndex
---
#### Description
    get the current index
#### Parameters
   none

### startAutoPlay
---
#### Description
    open the auto-play mode
#### Parameters
    none

### stopAutoPlay
---
#### Description
    close the auto-play mode
#### Parameters
    none
    
### pause
---
#### Description
    pause auto-play
#### Parameters
    none

    
### destroy
---
#### Description
    destroy the mobilescroll instance
#### Parameters
    none

---
### 
### events

#### start
#### move
#### end

```
ms.on('start', function(){
    // note that the context 'this' is point to MobileScroll instance "ms"
    // or you can give a arrow function an access the instance by "ms" directly
});
```
