---
title: 'Implementing and Optimizing GCRA (redis-rate-rs Development Notes)'
description: 'Development notes on redis-rate-rs, a Redis-backed rate limiter for Rust web applications.'
pubDate: '2026-09-03'
updatedDate: '2026-09-03'
tags: [rust, redis, rate-limiting, gcra]
---

Here is something I built six months ago: [redis-rate-rs](https://github.com/slhmy/redis-rate-rs), a rate-limiting library for Rust web applications. I originally used [go-redis/redis-rate](https://github.com/go-redis/redis_rate) while writing a backend in Go. After taking a closer look, I found that the underlying idea was actually quite simple, so I quickly recreated it in Rust. I also added a straightforward `local_accelerate` feature based on my own understanding, with the goal of preventing excessive requests from overwhelming Redis.

## How It Works

The rate-limiting algorithm used here is GCRA. I will only give a brief explanation: it is a leaky-bucket algorithm that is relatively easy to implement in practice while remaining flexible enough to support configurable bursts. For more details, see [Generic cell rate algorithm - Wikipedia](https://en.wikipedia.org/wiki/Generic_cell_rate_algorithm).

The central value in GCRA is the TAT, or Theoretical Arrival Time. It represents when a request is expected to arrive. For example, if one request is allowed per second, every accepted request advances the TAT by one second. For each incoming request, the limiter calculates a new TAT by adding the request's increment to the later of the current TAT and the current time. The request can be accepted as long as this new schedule remains within the burst tolerance.

The core implementation is therefore just a Lua script backed by Redis, which guarantees that every check is atomic. In my project, this is the code in [redis-rate-rs/src/scripts.rs](https://github.com/slhmy/redis-rate-rs/blob/main/src/scripts.rs). Everything around it is fairly simple: calculate the average time window occupied by a request, then derive the TAT increment and the offset allowed for bursts.

## Optimization

In [go-redis/redis-rate](https://github.com/go-redis/redis_rate), every GCRA calculation happens in Redis, and Redis performs one calculation for every incoming request. Redis is fast, but its capacity is not unlimited. Too many requests can easily saturate it and interfere with other workloads.

The general optimization is to move calculations that do not need to be atomic, such as the TAT and burst increments, to the client. Once the client knows that no quota is available, it can reject the request without asking Redis to perform another calculation.

The `local_accelerate` feature therefore keeps a global in-memory `RESET_TIME` value. When it is present, the client can use it together with the TAT increment and burst offset to determine whether a request must still be rate-limited. If so, there is clearly no need to query Redis again. At the time, I also rather foolishly added a Redis Pub/Sub channel to synchronize `RESET_TIME` across instances. Looking back, that was not really necessary.

## Summary

After finishing [redis-rate-rs](https://github.com/slhmy/redis-rate-rs), I found that it produced some worthwhile performance results. I ran several benchmarks in the project's [performance section](https://github.com/slhmy/redis-rate-rs?tab=readme-ov-file#performance). When the emission interval is relatively long, especially above one second, the throughput improvement is very noticeable.

Overall, GCRA is indeed quite simple to implement. However, Wikipedia also notes that because the leaky bucket involves units of time, GCRA does not adapt particularly well to every scenario:

> whereas, with the GCRA as described, the water in the bucket has units of time, for variable length packets it would have to have units that are the product of packet length and time. Hence, applying the GCRA to limit the bandwidth of variable length packets without access to a fast, hardware multiplier (as in an [FPGA](https://en.wikipedia.org/wiki/FPGA "FPGA")) may not be practical.

For web applications, though, it remains very convenient to implement and use.
