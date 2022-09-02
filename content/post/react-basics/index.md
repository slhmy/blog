---
title: React Basics
description: 
    Some core principals you may need to know
    when you get in touch with react
slug: react-hooks
date: 2022-08-31 19:00:00+0800
categories:
    - Programming Skills
tags:
    - React
    - JavaScript
---

## Hooks

[【知乎】react-hooks原理解析](https://zhuanlan.zhihu.com/p/443264124)

常见钩子：

- `useState`
- `useEffect`
- `useContext`
- `useReducer`
- `useRef`

生命周期：挂载 --> 更新 --> 卸载

## Virtual Dom

参考链接：
[【知乎】剖析React核心设计原理--Virtual Dom](https://zhuanlan.zhihu.com/p/462727885)

### Virtual Dom的作用

Virtual Dom是对HTML Dom的JavaScript形式的封装

> Virtual DOM是一种编程方式，它以对象的形式保存在内存中，它描述了我们DOM的必要信息，并且用类似react-dom等模块与真实DOM同步，这一过程也叫协调(reconciler)，这种方式可以声明式的渲染相应的ui状态，让我们从DOM操作中解放出来

我理解有了Virtual Dom之后，弱化了开发者对于原生HTML Dom的感知，这样更方便我们在JavaScript层面去修改页面的动态元素。
