---
title: 使 Obsidian 在博客中发挥作用
description: 
slug: blogging-with-obsidian
date: 2024-04-21 16:42:51+0800
image: 
categories:
    - recommend
tags:
    - 
---

Markdown 是我用的最多的文档语言，
随着文档的增加，我也意识到了双链笔记的重要性，于是我就了解到了 Obsidian。
它的可扩展性做的是比较优秀的，我喜欢它的 graph view，它能让有关联的文档自动通过 Tag 联系起来。

Obsidian 优秀的使用体验，让我想在更多地方也能够使用它，比如在自建的静态博客中（或者在像 Docusaurus 这类的知识库框架中）。
但在这些框架中，往往也有不少部分是和 Obsidian 存在冲突的，比如 Obsidian 并不能支持 MDX， Callout 语法有所区别等...

经过一些折腾，终于算是找到了一个比较好的方案，需要额外安装的插件很少，几乎没有配置的负担，下面分享给各位。

## Syncing

这是所有人都关心的问题，官方的同步方案比较昂贵，很难作为第一手的选择方案。这里我推荐安装：

1. [Remotely Save](https://github.com/remotely-save/remotely-save) 我自己是用的个人版的 Onedrive 来作为存储，在有多个 Windows 设备时，可以直接在 Onedrive 文件夹中打开 Vault 进行编辑
2. [Git](https://github.com/denolehov/obsidian-git)  像博客这种需要使用 GitHub Action 进行发布的情况，有 Git 插件也会更方便一些

如果有 IOS 或 Mac 设备，Obsidian 是天生支持 iCloud 的，但 Windows 的 iCloud 真的很垃圾。
所以我通常是创建一个同名的打开了 iCloud 的 Vault ，再使用 Remotely Save 进行第一次同步，
这样就可以在苹果设备上进行同步了。

## Markdown 编辑

Obsidian 的 Markdown 使用体验相对来说也是比较传统的，我自己在使用过程中主要遇到了以下两个问题。

### 支持 img 标签的相对路径

在 Obsidian 中，我们更多的是使用 `![](url)` 的方式来插入图片。
但是由于一些特殊的原因（比如我不想让 Hugo 处理我的 GIF，因为那样会卡住），我们还是会需要使用 `<img src="url" />` 的方式来插入图片。

这时候你就会发现，img 标签是不支持使用相对路径的。
这里我通过 [Display Relative Path Img](https://github.com/dyc2424748461/obsidian-display-relative-path-img) 来解决这个问题，虽然是一个很小众的插件，但目前工作下来，没有出现明显的问题。

### Obsidian 中的文章标题

在 Obsidian 中，文章的标题就是 Markdown 文件的名称，
这对很多需要参与建站的 Markdown 文件来说会非常不友好。
比如在 Hugo 当中 Post 的 Markdown 必须是 index.md，而真正的 title 是在 Markdown properties 中配置的。

因此我们需要使用 [Front Matter Title](https://github.com/snezhig/obsidian-front-matter-title) ,
在设置里打开 Graph、 Inline、 Search、 Tabs 等覆盖 Feature，
这样就能看到 Markdown properties 中配置的文章标题了。
