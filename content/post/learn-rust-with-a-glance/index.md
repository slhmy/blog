---
title: 快速学习Rust编程语言
description: 
slug: learn-rust-with-a-glance
date: 2023-07-02 16:33:00+0800
categories:
    - Programing Skills
tags:
    - Rust
    - Tutorial
    - Starter
---

## 前言

写这篇Post的起因是我希望有更多的人能参与到我的开源项目中来，
但它是用Rust写的，这让不少想要了解这项目的人无法快速加入到其中来。
当然我也希望能通过这篇文章，能够让更多的人不再畏惧对新语言的学习。

老实说在半年之前，我也会经常畏惧我没有接触过的高级编程语言
（例如：我也曾因为没接触过Go而感到困扰）。
而现在，我已经能够快速适应多种不同高级编程语言的使用
（请注意我说的是高级编程语言）。
到目前为止，
我会在不同情景下使用Go、Rust、JS/TS、C#、Python、C/C++、Java这些高级编程语言。
之所以能够快速接触到这么多语言，我认为有一些经验是需要指出的，
无论是在学习Rust还是任何一门其他的高级编程语言。

### 如何快速入门一个新的高级编程语言

首先，如果你有过几年的编程经验，<u>我不提倡为了学一门语言而去做专项的学习</u>。
因为在没有项目参考的情况下，学习编程语言的成本是比较高的，
这会不明所以地消耗你大量的时间。

你需要变得自信：<u>高级编程语言本身就是人类可读的文本，基本没有理由看不懂</u>。
会造成困扰的是它们当中**不同的语义符号和一些较为特殊的语言机制**，
通常来说这些不同会让你在空手进行开发时给你造成比较大的困扰，
但如果仅是进行阅读，理解代码的逻辑含义还是较为轻松的。

<u>丰富的RealWorld项目经历会降低学习的成本</u>。
代码和读书虽然很接近，但也还是略有不同，
因为写的代码层次一旦开始变得复杂，你就需要使用一些常见的方法去帮忙降低构思的复杂度，
例如：面向对象、设计模式、函数式编程等等。
你不一定会在所有语言中使用到它们，但实战经历会让你更方便理解和写出更好的代码。
除此以外，项目中时常会用到扩展依赖，比如说序列化工具、数据库驱动、Web框架等，
每个语言都有，并且用途和功能都是可以总结的。

最后，2023年了<u>搞一个AI联想帮下忙吧</u>。
在编写自己不熟悉的语言时，陌生的声明式和符号会让人感到懊恼。
AI能帮助你尽可能规避类似的问题，多一份联系也是多了一份参考。

## Rust快速入门

进入正题，其实上面说了那么多，也是为了在这个环节尽量少说一些。
接受下划线标注出的关键点，我认为通常来说已经足够了。
但作为一门相对小众的语言（以及为了能让更多人了解Rust），
我们还是不得不讨论一些细节的东西。

### Rust的大致画像

以防你可能会问：“Rust有什么好的？”
类似这样的问题，我会先简要介绍一下Rust的大致画像。

<u>Rust是一门，性能足以和C/C++媲美的，主打**标准现代工程化**的静态编程语言</u>，
为了实现高效的运行效率和足够现代和安全的开发流程，
Rust会比任何同类型的编程语言看上去更加繁琐。
它是一个较好的C++的同类替代品，在较为基础的模块编写上，能够做到非常优秀的工程输出。
对于不熟悉使用C++进行工程开发的人来说，
Rust项目的工具链（cargo）更容易上手，编写的代码也不容易出错。

语法形式上Rust和Typescript、Scala等语言类似，
使用这些语言的领域的程序员会更容易上手Rust。
但同时Rust的unsafe特性又可以使其下探到系统级别的编程领域，
这些领域也带来一批更加高级的玩法。

Rust的开源社区破事比较多，但也确实有不少大佬也喜欢使用Rust。

#### 我的项目为什么选择Rust

对我来说Rust足够存粹，我可以在任何地方任何场合，快速构建Rust的项目环境
（cargo、VSCode+插件）。
cargo这个工具可以帮助我快速引入我想要的依赖，生成足够清晰的文档，并且做好模块划分，
相反我对C++该如何做这些事情并不非常熟悉。
*对于未来参与贡献的人来说，我希望在提交代码之前就解决大部分潜在的代码问题，
Rust足够安全的特性大幅度减轻了我的心理负担。
（你写出来的代码通常来说只要通过编译，就不会产生任何无法追查的恶性BUG）*

### Rust的开发工具链

当你在阅读或者开发Rust程序时，你需要安装：

1. rustup（包含cargo）[官网地址](https://www.rust-lang.org/tools/install)
2. VSCode/Clion + Rust插件包（包含rust-analyzer）（+tabnine/copilot）

接下来你需要掌握Cargo的使用，文档可以参考[Cargo Book](https://doc.rust-lang.org/cargo/)。
<u>你需要知道如何使用`cargo new/build/run/test + fmt/clippy`的使用，其中fmt和clippy可以帮助你编写更优秀的代码</u>。

### Rust的语法和特性

[The Rust Programming Language](https://doc.rust-lang.org/book/ch03-00-common-programming-concepts.html)
是你在感到疑惑时最优先参照的资料，这是最官方的语法教程。
但正如我之前说的一样，我并不建议你在完全没有项目作为出发点的时候去通读这本书，
这很消耗时间。

接下来我会列出一些小的章节，来解释一些你需要在入门时就习惯的的Rust语法和特性。

#### 【Common】通用语法

这个章节包含的是如何申明变量，如何使用注释和循环等在其他编程语言当中也非常常见的语法。
[Common Programming Concepts](https://doc.rust-lang.org/book/ch03-00-common-programming-concepts.html)
和它的子章节基本就能解决所有这些问题，但我同样不建议你直接阅读这些章节，
在我看来这些语法稀疏平常，直接阅读通常也能理解它的含义。

有可能会带来困扰的是声明相关的内容，不过你只需要了解下面这些就足够了。
如果你想创建一个由名字指代的值，只要这么写就可以了：

```plain-text
let (mut) {value_name}: {type} = {value}
```

如你所见，类型声明的位置和其他语言是稍有区别的，显然这不是很影响理解
`mut`你可能之前并没有见过，它的意思是mutable，
如果你想创建的时一个变量，你需要在声明时指定`mut`。
<u>Rust的语法是相对繁复的，
这种设计的目的是为了让编写的人时刻清楚，自己具体在做什么</u>。

#### 【Common】Option可选变量（入门Enum和模式匹配）

我们开始接触一些真正奇怪的东西了，
入门Rust第一个坏消息是，你可能不会再见到`Null`或者`nil`了。
（至于为什么这样可以翻阅这个章节：[The Option Enum and Its Advantages Over Null Values](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html#the-option-enum-and-its-advantages-over-null-values))
不过好在这件事其实挺容易接受的，
Option会是你在Rust当中接触的非常多的一种枚举类型：

```rust
enum Option<T> {
    None,
    Some(T),
}
```

**如果你掌握其他语言中泛型的使用**，那么你应该不难理解上面的代码。

> 如果你并不清楚什么时泛型，或者说你完全无法理解`<>`，
可以先尝试阅读
[Generic Types, Traits, and Lifetimes](https://doc.rust-lang.org/book/ch10-00-generics.html)
中的Generic部分，或者尝试从其他语言中获取参考，请一定记住，你只需要浅显地理解即可

在展开`Option`包裹的值时，你只会遇到两种情况，一种是`None`一种是有值的`Some`。

**那么如何展开一个Enum呢？
常见的方法有两种(`match`和`if let`)**：

```rust
    let config_max = Some(3u8);
    match config_max {
        Some(max) => println!("The maximum is configured to be {}", max),
        _ => (),
    }
```

```rust
    let config_max = Some(3u8);
    if let Some(max) = config_max {
        println!("The maximum is configured to be {}", max);
    }
```

请一定尝试用自然语言的理解方式理解这些代码，我认为这些设计都是足够自然的，
当没枚举类型不是Option时也是可以使用的。

通常来说，当你只专注于解开Enum当中一种情况的值时，你可以使用`if let`句式，
从而缩减代码量。

> 你不需要担心无法正确地挑选`match`和`if let`句式，
因为你可以在命令行中输入`cargo clippy`来获取代码建议，
如果你的`match`时非常简单的双项选择，`cargo clippy`会告诉你如何转换成`if let`的。

最后，这部分的所有内容都包含在[Enums and Pattern Matching](https://doc.rust-lang.org/book/ch06-00-enums.html)下。

#### 【Common】Result错误处理的小问号？

接下来我们要继续认识下一个特别的枚举类型`Result`。
在进行下面的阅读之前，我认为可以提醒你一些小关键点：
如你所见，我单独拿出来举例的都是Enum的类型，
这可能会对读者有一定的误导，认为它们各自时特殊的类型。
<u>请记住同一种类型它们是共享同一种特性的，如`match`和`if let`对任何Enum都可以使用</u>

对Result来说可以单独拿出来讲的是`?`:

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut username_file = File::open("hello.txt")?;
    let mut username = String::new();
    username_file.read_to_string(&mut username)?;
    Ok(username)
}
```

这是Rust当中上抛错误的简易写法，**当上层的Result的枚举可以提取上抛的错误类型时，
就可以使用`?`来使代码在函数返回Error的枚举值的时候，直接return**。

> 请注意，`?`的用法时可以用`match`这种通用方法替代的，它就是在匹配到`Err(_)`时return的含义。

#### 【Common】结构体和面向对象

如果你使用过Golang这样的较为新式的编程语言，你可能已经接受了不完整的面向对象的使用。
Rust也是如此，`impl`取代了Golang中的接口，使用起来通常比传统的面向对象更加简易。

我认为在这一部分，你需不需要有太多的学习负担，毕竟这块设计并不是非常有特色的，
因该能快速适应的。
相关的章节在：[Using Structs to Structure Related Data](https://doc.rust-lang.org/book/ch05-00-structs.html)。

> 对结构体的使用更多是在程序设计方面，出色的设计可以制作出优秀的代码流，可以利用到函数式编程这种优秀的编写方式。

#### 【Project】模块的编排

我非常讨厌单文本代码，代码量一旦变大，我们就需要把代码拆分成多个文件。
这就会需要考虑我们的代码是否需要进行公开，以及如何在其他地方引用它们。

```rust
use crate::garden::vegetables::Asparagus;

pub mod garden;

fn main() {
    let plant = Asparagus {};
    println!("I'm growing {:?}!", plant);
}
```

你需要掌握两种标记，`pub`和`use`：

- `pub`很容易理解，就是公开模块中的某个元素（元素可以是，函数、结构体、结构体中的成员等）
- `use`用于引用我们需要使用的元素模块，其后会跟随一串路径，路径的开头可能会有些特殊的起始标记，例如`crate`和`super`，前者是项目的起始路径标记，后者是同级模块的相对路径起始标记。

你可以在遇到疑惑时再翻阅下面的文档[Managing Growing Projects with Packages, Crates, and Modules](https://doc.rust-lang.org/book/ch07-02-defining-modules-to-control-scope-and-privacy.html?highlight=mod#modules-cheat-sheet)

#### 【Magic】生命周期

压轴部分，也是Rust当中最难以理解的特性之一，它在教程的第三章就进行了介绍：
[Understanding Ownership](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html)。
Rust还有一些其他的高级用法，但生命周期是你几乎无法规避的，
它的存在造就了Rust既块有编写安全的特征，也使代码的编写不那么顺心如意。

在Rust的设计当中，**任何非常量的值，默认只存活于它的作用域当中，且只有一个真正的实体**。

我稍微修改了一份官方的例子，这个例子在其他编程语言中通常是能通过编译的，但是Rust不行。
原因就是上面的规约造成的，在`let s3 = takes_and_gives_back(s2);`执行时，`s2`的实体已经发生了转移。

> Rust的编写过程当中，非常大部分的编译报错都是由不合法的生命周期造成的。
对此你需要额外地进行一些适应，但请理解，这也可以帮助你在较低的关注成本下关注到每个值的分配和释放的情况。

```rust
fn main() {
    let s1 = gives_ownership();         // gives_ownership moves its return
                                        // value into s1

    let s2 = String::from("hello");     // s2 comes into scope

    let s3 = takes_and_gives_back(s2);  // s2 is moved into
                                        // takes_and_gives_back, which also
                                        // moves its return value into s3
    
    // !!! WILL FAILED TO COMPILE !!!
    let s4 = takes_and_gives_back(s2);

} // Here, s3 goes out of scope and is dropped. s2 was moved, so nothing
  // happens. s1 goes out of scope and is dropped.

fn gives_ownership() -> String {             // gives_ownership will move its
                                             // return value into the function
                                             // that calls it

    let some_string = String::from("yours"); // some_string comes into scope

    some_string                              // some_string is returned and
                                             // moves out to the calling
                                             // function
}

// This function takes a String and returns one
fn takes_and_gives_back(a_string: String) -> String { // a_string comes into
                                                      // scope

    a_string  // a_string is returned and moves out to the calling function
}
```

要修复上面的编译报错也很简单，只需对s2进行拷贝即可`let s3 = takes_and_gives_back(s2.clone());`。
*在很多语言，例如Golang和Java中这一动作是自动发生的，
而在Rust当中，你需要在代码中体现这一个动作。*

#### 【Magic】宏和代码生成

宏是Rust的一种高级特性，但作为入门者你不需要过于担心，我不曾深入过宏的使用，
在这里提到宏，仅仅是因为你会在代码里看到它们，它能提供更加灵活的功能构建，为代码的编写带来便利。
作为使用者，我通常用它完成输入输出日志、格式化字符串、添加（反）序列化、编写WebHandler等高级功能。

宏会以三种形式出现：

1. `macro_name!(...)` 这种宏的使用无异于函数，也叫做函数宏，只是在函数名后有`!`标注，
它能带来比函数更加灵活的使用，典型的代表就是`format!/println!()`宏。
2. `#[...]` 如果你接触过C#的Attribute，理解这种宏会更加简单，它叫属性宏，可以出现在非常多的代码块的头部
（比如Enum、struct、func等，也可以出现在文件的头部）为这些代码块添加属性，可以使代码块获得额外的能力
3. `#[derive(...)]` 你可以理解派生宏为一种特殊的属性宏，但它只能作用于Enum和struct之上

> 你可以理解宏是通过某种声明实现的Rust代码的生成能力，宏在编译时会在target当中自动生成一串相应的代码，
通常来说你不需要了解具体它们是如何生成的。

更多可以参考文档[Macros](https://doc.rust-lang.org/book/ch19-06-macros.html?highlight=macro#macros)

## 结语

以上就是我认为你需要快速学习Rust所需要的全部了，
在最后我对自己所写的内容进行一些反思。

我试图让Rust的具体部分变得更加地简短易懂，单我不认为我做的非常出色。
我通过接受难易程度，对语法和特性进行了排列，但知识结构依旧显得较为平面。

所以在最后，我为每个小章节加上了标头，Common、Project、Magic，
我认为在任何语言时，可以对语法和特性进行这三大块的分类，
其中前两者通常不会带来较多的学习成本，
而Magic是可能带来困扰，但也是真正能产生差异的部分（例如golang的协程，JS/TS的Promise等）。
<u>在消化Magic部分的内容时，请务必明白它解决的是什么样的一个问题</u>。

我在文章中有大量的内容提到了，我不希望各位在入门时就对特性进行过多的深挖，
因为这是一种很消耗时间的行为，但并不是说完全拒绝类似源码阅读这样的事情。
只是这些事情通常不应该在初学时就发生，但如果你是位相关经验较为丰富的“初学者”，
阅读源码也是被允许的，这可能可以帮助你更好地理解一些事情。

(全文终)

😩 写的好累，希望各位喜欢 💕

📕 ~欢迎在评论区给我留言~ ⌨️
