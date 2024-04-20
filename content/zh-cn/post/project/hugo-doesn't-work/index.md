---
title: Hugo doesn't work
description: Trouble shooting with Hugo 
slug: hugo-doesn't-work
date: 2022-09-09 15:48:00+0800
categories:
    - 项目
tags:
    - Hugo
    - Trouble Shooting
---

Today, I opened my blog workplace and decided to write something about my latest work.
It was kind of weird that after I ran `hugo server` and visit the development site,
I seen nothing but a white page. I found this kind of strange things bother me a lot,
so I decide to do some more to record them in case I meet them again.

This post can be very easy currently,
wether it will become more complex depends on the amount of problems.

## found no layout file for "HTML" for "page"

**Description:** Run `hugo server` and visit the development site, see nothing but a white page.
Find WARNINGs like 'found no layout file for "HTML" for "page"'.

**Related link:** [How to fix the error 'found no layout file for "HTML" for "page"' in Hugo CMS?](https://stackoverflow.com/questions/60269683/how-to-fix-the-error-found-no-layout-file-for-html-for-page-in-hugo-cms)

**Solution:** Run `hugo mod clean`.

**Guess Cause:** Some of the computer rubbish cleaner software may delete the running essenstial of Hugo as rubbish.
This issue is likely to appear after I clean my computer with rubbish cleaner.
