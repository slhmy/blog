---
title: Event Publish Model in Javascript
description: A useful design model you should know in front-end developing 
slug: event-publish-model-in-javascript
date: 2022-09-25 17:20:00+0800
categories:
    - Programing Skills
tags:
    - Javascript
---

## 前言 & 场景描述

最近开始上班了，岗位是全栈（SDE），我号称是会写一些React，于是接到的第一个任务就是去搞前端。
虽然项目的前端架构看上去比较老旧，是组件式的React，不过经理允许我按照喜好写函数式的，所以本来推进的还挺顺利。
后来页面架子搭了一点需求之后，经理跟我沟通了一个需求，说是要把原来某个阶段打的log放到组件里显示出来。

简单来说是这样一个场景：

``` Javascript
function xxxPage() {
    useEffect(() => {
        xxxOperation.operationListener();
    });

    return (
        // ...
    )
}
```

`operationListener`会在这个页面启动后，监听某个后台任务，然后用`console.log`打印在控制台里。

`operationListener`的大致情况是这样的：

``` Javascript
class xxxOperation {
    // ...

    function operationListener() {
        // Listen some msg
        while hasMsg {
            console.log();
            if msg.type === xxx {
                console.log();
            } else if {
                // ...
                console.log();
            } else {
                // ...
                console.log();
            }
            // Listen some msg
        }
    }
}
```

要求是在`xxxPage`里动态地把这些log在某处展示出来。
第一次见这种情况，我上来就没了思路，后来就听到经理嘴里蹦出什么event publish啥的，就去网上搜了一下。

## 解读

我查到的是这篇博客：[JavaScript设计模式之发布订阅模式(Publish/Subscribe)](https://www.jianshu.com/p/24586fda48b8)，觉得还是比较好理解的。

我把这篇文章中的一些内容运用到上文的场景中大概就变成了下面这样：

```Javascript
function xxxPage() {
    var Weather = {
        list: [], // 缓存列表
        listen: function(fn) { // 增加订阅者  
            this.list.push(fn)
        },
        publish: function() { // 发布消息
            for(var i=0,fn; fn=this.list[i++];) {
                fn.apply(this,arguments);
            }
        }
    };

    useEffect(() => {
        Weather.listen(function(weather, wind){
            console.log('天气：' + weather, '风力：'+ wind);
            // 利用useState等钩子更新元素
        })
        xxxOperation.operationListener(Weather);
    }, []);

    return (
        // ...
    )
}
```

之后我们在`operationListener`当中调用`publish`就好。
感觉这里还是运用到了一种闭包或者说是函数传递的思想，整个监听和发布行为是在主体代码中设定的。
需要注意的是，`useEffect`需要正确的设定触发条件，否则很容易产生多次调用。
