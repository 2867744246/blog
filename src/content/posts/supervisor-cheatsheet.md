---
title: Supervisor 进程托管速查
description: Supervisor 进程守护工具速查——常用命令、发行版目录差异、最小配置示例与实战踩坑。
pubDate: 2026-11-18
type: tech
tags: [Linux, Supervisor, 运维]
---

Supervisor 是 Python 编写的 Linux 进程守护工具：程序崩溃自动拉起、随 supervisord 启动、统一管理，是托管业务进程。生产环境标准分层是 systemd 托管 supervisord，supervisord 再托管业务进程。

## 为什么不直接写 systemd unit

业务进程变更频繁、数量多、归属开发团队，每次增删都要写 unit、daemon-reload，摩擦成本高；而 Supervisor 只需往片段目录丢一个 ini。另外 systemd 重试超限后会放弃拉起，Supervisor 永远兜底重启。systemd 管系统级服务，Supervisor 管业务进程，各干各的。

## 日常命令

```bash
supervisorctl status            # 看所有托管程序状态（RUNNING / FATAL / EXITED）
supervisorctl start wos-queue   # 启动某个程序
supervisorctl stop wos-queue    # 停止
supervisorctl restart all       # 重启全部
supervisorctl tail -f wos-queue # 追踪某程序的 stdout 日志

# 配置刷新
supervisorctl reread            # 只扫描配置变更，不动任何进程
supervisorctl update            # 应用变更，只重启有变动的 program
supervisorctl reload            # 重启所有托管进程——改全局配置 [supervisord] 才需要
```

## 目录结构（发行版不同路径不同）

```bash
# Ubuntu/Debian：主配置 + conf.d 片段目录
/etc/supervisor/supervisord.conf
/etc/supervisor/conf.d/*.conf

# CentOS：主配置 + supervisord.d 片段目录
/etc/supervisord.conf
/etc/supervisord.d/*.ini
```

## 最小配置示例

以 PHP 项目消息队列为例：
```ini
[program:name]
command=/usr/bin/php artisan queue:work redis   ; 启动命令
directory=/data/html/project-name               ; 工作目录
autostart=true                                  ; supervisord 启动时自动拉起
autorestart=true                                ; 崩溃自动重启（行为与退出码相关）
user=www                                        ; 运行身份
stdout_logfile=/data/logs/worker/queue.log      ; 日志路径，目录必须提前建好
```

## 踩过的坑

- **改的文件和实际加载的文件不一致**是常见配置更改无效原因：用 `ps -ef | grep supervisord` 看启动参数用的哪个配置，或 `supervisord -c /path/to.conf` 显式指定。
- **不会自动创建日志目录**：stdout_logfile 指向的目录不存在就直接启动失败，先 `mkdir -p` 建好。
- **systemd 拉起的进程环境极简**：手动跑正常、交给 supervisor 就秒退，先怀疑环境变量缺失。用 `env -i` 复现，全局注入用 `[supervisord]` 的 environment 字段，或让 systemd unit 改用 `/bin/bash -lc` 启动以继承 profile。
