---
title: Linux 命令速查
description: 服务器日常操作常用的 Linux 命令速查——文件目录、进程管理、systemd 服务、环境变量、网络排查。
pubDate: 2026-11-18
type: tech
tags: [Linux, 命令行, 运维]
---

## 文件与目录

```bash
pwd                             # 当前所在路径
ls -la                          # 列出全部文件（含隐藏），长格式
cd /etc/supervisor              # 切目录，cd .. 返回上级，cd ~ 回家
mkdir -p /data/logs/worker      # 递归创建目录（父目录不存在也自动建）
cp -r src dst                   # 复制目录要加 -r
mv old new                      # 移动 / 重命名
rm -rf dir                      # 递归强删，执行前看清路径
find /etc -name "*.ini"         # 按名字找文件
grep -rl "queue:work" /data     # 按内容找文件，只列出命中的文件名
grep -rln --include="*.php" "queue:work" /data  # 限定文件类型再按内容搜
find /data -name "*.log" | xargs grep -l "error"  # 先按名字筛，再按内容搜
du -sh /data                    # 查看目录总大小
```

## 查看与编辑文件

```bash
cat file.conf                   # 小文件直接输出
less file.log                   # 大文件分页看，/ 关键词 搜索，q 退出
tail -f app.log                 # 实时追踪日志滚动，Ctrl+C 退出
tail -n 200 app.log             # 看最后 200 行
grep -i "error" app.log         # 忽略大小写搜关键词
grep -rn "inet_http_server" /etc/supervisor  # 递归搜目录，带行号
vim file.ini                    # 编辑：i 进入插入模式，Esc 后 :wq 保存退出
```

## 进程查看

```bash
ps aux                          # 看所有进程（BSD 风格，最常用）
ps -ef | grep php               # 全格式 + 过滤，找某进程
ps -p 1                         # 看 PID 1 是什么——判断 init 系统（systemd 还是别的）
top                             # 实时资源占用，P 按CPU排、M 按内存排，q 退出
kill 12345                      # 终止进程
kill -9 12345                   # 强杀，最后手段
which supervisord               # 确认命令装在哪、是否存在
```

## 服务管理（systemd）

系统级服务统一由 systemd 管，看 PID 1 是不是它就知道了。

```bash
systemctl status nginx          # 看服务状态（running / failed / dead）
systemctl start nginx           # 启动
systemctl stop nginx            # 停止
systemctl restart nginx         # 重启
systemctl enable nginx          # 设开机自启
systemctl daemon-reload         # 改了 unit 文件后先重载再操作
journalctl -u nginx -f          # 实时追踪某服务的日志
journalctl -u supervisord --since today  # 看某服务今天的日志
```

## 进程托管（Supervisor）

Supervisor 是 Python 编写的进程守护工具，程序崩溃自动拉起，systemd 管系统服务、它管业务进程。[Supervisor 进程托管速查](/blog/posts/supervisor-cheatsheet/)。

## 环境变量

Supervisor 由 systemd 拉起时继承的是极简环境变量，业务进程缺库找不到路径多半是这个原因。

```bash
echo $PATH                      # 看当前变量值
env                             # 列出全部环境变量
export LD_LIBRARY_PATH=/opt_dm/bin  # 当前 shell 临时设置
env -i /usr/bin/php -v          # 极简环境运行命令，模拟 systemd 拉起的效果
bash -lc 'echo $LD_LIBRARY_PATH' # -l 按 login shell 加载 profile，验证变量能否继承
```

## 网络排查

```bash
ping -c 4 example.com           # 发 4 个包测连通性和延迟
curl -I http://127.0.0.1:9001   # 只看响应头，快速验证服务是否响应
ss -tlnp                        # 看端口监听（新版），netstat -tlnp 是老版等价
netstat -tlnp | grep 9001       # 确认某端口是否真的在监听
```

## 查帮助：忘了参数去哪查

### 常用命令

```bash
man ls                          # 完整官方手册：空格翻页、/关键词 搜索、q 退出
ls --help                       # 内置快速帮助，只列参数不跑题
help cd                         # shell 内建命令（cd/export/alias）用 help，man 里查不到正文
tldr tar                        # 社区简明示例（apt install tldr）
```

### 在线推荐 

- [菜鸟教程 Linux 命令大全](https://www.runoob.com/linux/linux-command-manual.html)
- [命令解释工具](https://explainshell.com)