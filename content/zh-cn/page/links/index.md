---
title: 链接
slug: links
links:
  - title: CSL 讲废话
    website: https://blog.cubercsl.site/
    image: https://avatars.githubusercontent.com/u/22931465
  - title: Zztrans's blog
    website: https://blog.zztrans.top/
    image: https://avatars.githubusercontent.com/u/53961131
  - title: compute's blog
    website: https://akamya.moe/
    image: https://avatars.githubusercontent.com/u/44839751
  - title: Unsplash
    description: 博客中的部分图片来自 Unsplash
    website: https://unsplash.com/
menu:
    main: 
        weight: 4
        params:
            icon: link

comments: false
---

要在页面上显示链接，您可以在 frontmatter 中添加 `links` 部分。

请在 GitHub 上编辑[此页面](https://github.com/slhmy/blog/blob/master/content/zh-cn/page/links/index.md)，
可参考示例：

```yaml
links:
  - title: GitHub
    description: GitHub is the world's largest software development platform.
    website: https://github.com
    image: https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png
```

`image` 字段接受本地和外部图片。
