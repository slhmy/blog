---
title: Monotone Stack
description: A simple data structure that is often forgotten when needed
slug: monotone-stack
date: 2022-09-01 20:56:00+0800
categories:
    - Algorithm
tags:
---

Monotone stack is a simple data structure, but I often forget to use it when I need it.
This is a very strange thing, because the monotone stack is indeed a kind of "look at it and you will know"...
The reason for this situation is actually very simple: **I don't understand the essence of the monotone stack**.

## The essence of monotone stack

In fact, the essence of the monotone stack is very simple, and we can understand it by splitting words.

First of all, it is **monotone**, which describes the arrangement of elements in the stack.
It is a form of arrangement that is **ordered** from top to bottom (or from bottom to top).

Then it is **stack**, which represents that we **only care about the top of the stack** in a certain state.

## Problem matching

After understanding the essence, we need to think about what kind of problems are suitable for solving with monotone stack.

First of all, the ordered characteristics of the monotone stack constrain it, it is **only suitable for solving problems where the order is ordered**,
that is to say, if the problem requires random queries, then without pre-tabulation, the monotone stack cannot solve such problems.

Then, the **single-end** feature of the stack actually implies that we seem to need the next maximum (or minimum) information,
because we don't seem to need to pay attention to the other contents of the stack, so it is **a scene of seeking the maximum value in a certain state**.
From another perspective, when only the maximum value is concerned, the values of other parts are ignored,
so the monotone stack also has the characteristic of **ignoring data noise during traversal** (Ex. When ignoring the minimum on the right, we don't care about the other larger values on the right, so we can use the monotone stack to solve it).
