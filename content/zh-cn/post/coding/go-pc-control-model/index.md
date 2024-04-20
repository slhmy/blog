---
title: Golang Production and Consumption Controller Model
description: High level but basic goroutine model you need to know
slug: go-pc-control-model
date: 2022-09-03 11:09:00+0800
image: cover.png
categories:
    - 编程
tags:
    - Golang
    - Goroutine
---

**前情提要是这样的：**

我昨天参加了我非常喜欢的某公司的全栈开发工程师的面试，
在介绍了我各种过往奇奇怪怪的（真的是非常奇怪的，面试官听了以后直皱眉😂）项目之后，
面试官开始考核我的一些实战能力。
然后上来的第一道代码设计的题目就把我考到了，**要我用协程实现多生产多消费，并且能控制协程创建退出**。

可能是我Golang只接触了一个月左右的时间，
虽然之前确实有一次被考到`channel`的用法（但复盘的时候也就是简单补习了一下`make channel`）。
这次上来直接动手要写代码，还是很多反应不过来，我直接就寄了...
查了一会`channel`的用法，后面憋出几行又发现为了不让进程过早退出还要使用`waitGroup`这些😇。
然后上面说到的模型确实比较重要的，毕竟我简历上也吹嘘自己掌握各种异步任务设计...
结果就是啪啪打脸。

于是在这场被虐的非常惨烈的面试之后，我决定把这样一个生产消费模型好好补一下。
最后补习完了以后发现，大量的内容还是跟Golang的`channel`用法有关，那么这篇文章就主要对其做一个梳理。

**相关完整代码**：[producer-consumer-control](https://github.com/slhmy/golang-programming-models/tree/main/producer-consumer-control)

## Basics

我不会讲太多，因为很多地方可以查到，介绍的肯定也更详细。
这里只是提供一个较快的了解。

### channel

首先对channel需要掌握它的类型声明、创建和操作方法。

#### channel的类型声明

在Golang当中，我们通过`[VARIABLE NAME] <-chan | chan | chan<- [TYPE]`这样的句式来声明一个`channel`和它内部的数据类型。
这里`chan`有点像一个前缀的修饰词，可能由于是关键字的原因，在用法上和普通泛型上有区分。
我认为关键是要使用**象形**的记忆方式，把`chan`本身就想象成一个管道，你可以在`chan`的两侧用`<-`来标记`chan`在这个作用域中的可以使用的端口是写端还是读端，没有标记时代表允许双端的操作

#### channel的创建

通过`make`我们可以创建一个`channel`，这里值得注意的是`make`分配的容量是根据对象的原子个数分配的。
像`string`类型，分配的是字符串的长度，这里是容易理解错的。
但如果你是创建的一个`struct`，那分配的容量是“多少个struct”。

#### channel的操作

`chan`最基本的操作就是写值和取值操作。

写值的语法是`[CHANNEL] <- [VARIABLE] | [VALUE]`，是象形的操作方式。

取值的语法是`[VARIABLE] := <-[CHANNEL]`，代表从写端取值，
此外还有和`range`一起使用的一些语法糖（这里就不过多介绍了）。

### Context

`Context`的中文含义是上下文，这类设计其实在很多服务框架中有做到。
像在Rust的一些Web框架中，会有`app.data`的设计，这样做的目的主要就是方便线程/协程之间实现数据的共享。

在Golang当中，我认为`Context`也起到了类似的作用。
但在这样一个功能的基础上，`Context`还提供了一些特殊字段和控制方法，用来实现对协程的控制。
最重要的一种用法如下：

``` Golang
select {
case <-ctx.Done():
    return
default:
    // normal works when this goroutine is up
    // ...
}
```

我们通过`ctx.Done`这个管道来判断协程是否需要终止，
这个管道的消息可以通过设置`TimeOut`或者手动`cancel`等方法来发送。
具体可以查阅相关的资料。

## Practice

最后我们来提一下多生产多消费这个模型的实践。
思路其实很简单，我们需要创建一个`channel`来作为消息队列，另外我们还需要一个`Context`来控制协程的退出。

我们首先定义消息的格式，并准备`channel`和`Context`。

``` Golang
type Message struct {
    Content string
}

func main() {
    var ctx, cancel = context.WithCancel(context.Background())
    dataChannel := make(chan Message)
    countChannel := make(chan int, 1)
    // ...
```

`dataChannel`是用来生产的消息队列，`countChannel`是生产者之间用来协同控制消息号的。
由于`countChannel`的读写会发生在一个生产者当中，我们需要设置一个大小为1的缓冲，
每次生产者进行生产之前，生产者会先读取缓冲中的值，并把最新的消息号更新。

最后结合`Context`的基本用法，我们得到的核心逻辑如下：

### Producer核心逻辑

``` Golang
select {
// Handle <-ctx.Done()
case <-ctx.Done():
    fmt.Printf("Producer_%d quit\n", id)
    return
default:
    // Get message count
    Count := <-countCh
    Count += 1
    countCh <- Count

    // Produce
    dataCh <- Message{
        Content: fmt.Sprintf("Producer_%d sending message_%d", id, Count),
    }
    time.Sleep(1 * time.Second)
}
```

### Consumer核心逻辑

``` Golang
// Consume
data := <-dataCh
fmt.Printf("Consumer_%d get message: %s\n", id, data.Content)
```
