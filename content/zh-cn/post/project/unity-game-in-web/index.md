---
title: Unity 游戏发布到浏览器
description: 本文将介绍如何将 Unity 游戏发布到浏览器中，并且在 React 项目中嵌入 Unity 游戏。
slug: unity-game-in-web
date: 2022-09-11 11:22:00+0800
image: preview.png
categories:
    - project
tags:
    - Unity
    - WebGL
    - WebAssembly
    - Node
    - React
---

## 前言

制作游戏一直都是我比较感兴趣的一件事情。
这次有时间自己尝试了一下，发现过程上其实还挺简单的，
关键的可能还是需要对前端有一些基本的认识，然后知道 WebGL、WebAssembly 啥的，
这样在实践的时候不会在大方向上出现问题。

这篇文章会复现整个项目的制作流成，目的是提供一个大致清晰的制作方向给大家。

## 制作你的Unity游戏

这块会使用到的就是一个比较成熟的 Unity 工具链。
这个例子当中，我使用的是一个 Unity 社区当中的教程模板 [Karting Microgame](https://learn.u3d.cn/tutorial/unity-microgame-karting#)，
你可以在 Unity Hub 中新建项目的时候找到它的模板。
这个模板中会简单的教会你一些 Unity 的使用（包括测试、修改属性、添加物体、发布等），
当你简单地对 Unity 有了了解之后，你就可以尝试打包发布你的游戏。

打包完成之后你会得到如下图所示的目录结构：

<img src="unity-webgl-builds-structure.png" width="50%" alt="builds-structure"/>

其中 `Build` 目录下的就是我们游戏打包出来的主体，其它外部的是一些默认的配置和资源。
我们可以利用 Node 的 [http-server](https://www.npmjs.com/package/http-server)，
在 `WebGL Builds`（或者对应的打包出来的根目录）起一个 HTTP Server，
这样就可以在浏览器中看到游戏是否在正常运行。

<img src="unity-webgl-default-view.png" width="50%" alt="default-view">

### 打包时可能会遇到的问题

在 Unity 默认配置下打包的时候，可能发布出来的游戏在加载阶段会报无法加载 gzip 的报错，修改了 HTTP Server 的配置可能还是会出同样的报错。

这个问题目前判断下来是因为 Unity 内核的一些问题导致，
所以可能需要修改一下在 `Edit/Project Settings/Player/Settings for WebGL` 下的打包目标的配置，
配置方法可以参考下图：

<img src="unity-webgl-publishing-settings.png" width="50%" alt="publish-setting">

## 将Unity游戏嵌入到React项目当中

这里就是使用了一个 Node 的依赖，[React Unity WebGL](https://www.npmjs.com/package/react-unity-webgl)

大致的使用方法如下:

``` JavaScript
export default function DashboardPage() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "/game/build/kart.loader.js",
    dataUrl: "/game/build/kart.data.unityweb",
    frameworkUrl: "/game/build/kart.framework.js.unityweb",
    codeUrl: "/game/build/kart.wasm.unityweb",
  });

  return (
    <Unity unityProvider={unityProvider} style={{ width: 800, height: 600 }} />
  );
}
```

这是一个比较简单的使用例子，可以看到在 `useUnityContext` 中，我们提供的信息其实就是之前介绍到的主体。
