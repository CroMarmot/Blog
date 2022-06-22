---
title: select/poll/epoll
date: 2019-12-27 11:20:14
tags: [computer,backend,io,system,select,poll,epoll]
category: [software, linux]
---

同步多路IO复用

# CODE

五个子进程 2000本地端口`SOCK_STREAM`的demo

```c++
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <wait.h>
#include <signal.h>
#include <errno.h>
#include <sys/select.h>
#include <sys/time.h>
#include <unistd.h>
#include <string.h>
#include <arpa/inet.h>

#include <poll.h>

#include <sys/epoll.h>

#define MAXBUF 256
#define CHILD 5

void child_process(void) {
  sleep(2);
  char msg[MAXBUF];
  struct sockaddr_in addr = {0};
  int sockfd,num=1;
  srandom(getpid());
  /* Create socket and connect to server */
  sockfd = socket(AF_INET, SOCK_STREAM, 0);
  addr.sin_family = AF_INET;
  addr.sin_port = htons(2000);
  addr.sin_addr.s_addr = inet_addr("127.0.0.1");

  connect(sockfd, (struct sockaddr*)&addr, sizeof(addr));

  printf("child {%d} connected \n", getpid());
  while(true){
    int sl = (random() % 10 ) +  1;
    num++;
    sleep(sl);
    sprintf (msg, "Test message %d from client %d", num, getpid());
    write(sockfd, msg, strlen(msg));	/* Send message -> 127.0.0.1:2000 */
  }
}

void selectDemo(int sockfd){
  int fds[CHILD];
  fd_set rset;
  socklen_t maxfd=0;
  for (int i=0;i<CHILD;i++) {
    fds[i] = accept(sockfd,NULL,NULL);
    printf("fds[%d]=%d\n",i,fds[i]);
    if(fds[i] > maxfd)
      maxfd = fds[i];
  }

  while(true){
    FD_ZERO(&rset);
    for (int i = 0; i< CHILD; i++ ) {
      FD_SET(fds[i],&rset);
    }

    puts("round again");
    select(maxfd+1, &rset, NULL, NULL, NULL); // 返回值是 ready的个数 >= 0

    for(int i=0;i<CHILD;i++) {
      if (FD_ISSET(fds[i], &rset)){
        char buffer[MAXBUF];
        int n = read(fds[i], buffer, MAXBUF);
        buffer[n] = '\0';
        puts(buffer); // 主进程把子进程的内容打印
      }
    }
  }
}

void pollDemo(int sockfd){
  pollfd pollfds[CHILD]; // 这里变成了 数组，因此长度不再受到限制
  for(int i=0;i<CHILD;i++){
    pollfds[i].fd = accept(sockfd,NULL,NULL);
    pollfds[i].events = POLLIN;
  }
  sleep(1);
  while(true){
    puts("round again");
    poll(pollfds, CHILD, 50000);

    for(int i=0;i<CHILD;i++) { // 但这里检查状态时 依然是 轮询
      if (pollfds[i].revents & POLLIN){
        pollfds[i].revents = 0; // 不需要每次 把所有的重设置到set里，只需要把已经就绪的状态恢复掉
        char buffer[MAXBUF];
        int n = read(pollfds[i].fd, buffer, MAXBUF);
        buffer[n] = '\0';
        puts(buffer);
      }
    }
  }
}

void epollDemo(int sockfd){
  int epfd = epoll_create(233); // create a context in the kernel 文档说 只要是正值就行 具体值被忽略了
  for(int i=0;i<CHILD;i++) {
    static struct epoll_event ev; // 注意这里是static
    ev.data.fd = accept(sockfd,NULL,NULL); // 这也可以 自定义其它的data值
    ev.events = EPOLLIN; // 这里还可以设置 EPOLLET 的bit位 启用edge-triggered
    epoll_ctl(epfd, EPOLL_CTL_ADD, ev.data.fd, &ev); // add and remove file descriptors to/from the context using epoll_ctl
  }
  while(true){
    puts("round again");
    struct epoll_event events[CHILD];
    int nfds = epoll_wait(epfd, events, CHILD, 50000); // 把就绪的写入到events中 写了nfds个

    for(int i=0;i<nfds;i++) { // 遍历的都是就绪的
      char buffer[MAXBUF];
      int n = read(events[i].data.fd, buffer, MAXBUF);
      buffer[n] = '\0';
      puts(buffer);
    }
  }
}


int main() {
  int sockfd;
  struct sockaddr_in addr;
  for(int i=0;i<CHILD;i++) {
    if(fork() == 0) {
      child_process(); // 子进程
      exit(0);
    }
  }
  // 主进程

  sockfd = socket(AF_INET, SOCK_STREAM, 0);
  memset(&addr, 0, sizeof (addr));
  addr.sin_family = AF_INET;
  addr.sin_port = htons(2000);
  addr.sin_addr.s_addr = INADDR_ANY;
  bind(sockfd,(struct sockaddr*)&addr ,sizeof(addr));
  listen (sockfd, CHILD);

  // 三种 demo 解除注释 使用
  // selectDemo(sockfd);
  // pollDemo(sockfd);
  // epollDemo(sockfd);
  return 0;
}

```

# select

`man 2 select`

```cpp
int select(int nfds, fd_set *readfds, fd_set *writefds, fd_set *exceptfds, struct timeval *timeout);

void FD_CLR(int fd, fd_set *set); // 从set中移除fd
int  FD_ISSET(int fd, fd_set *set); // 测试set中是否设置fd
void FD_SET(int fd, fd_set *set); // 在set中设置fd
void FD_ZERO(fd_set *set); // fd zero

int pselect(int nfds, fd_set *readfds, fd_set *writefds, fd_set *exceptfds, const struct timespec *timeout, const sigset_t *sigmask);
```

`nfds` should be set to the highest-numbered file descriptor in any of the three  sets,  plus  1. The indicated file descriptors in each set are checked, up to this limit (but see BUGS).

Three independent sets of file descriptors are watched.

The file descriptors listed in `readfds` will be watched to see if characters become available for reading (more precisely, to see if  a read  will not block; in particular, a file descriptor is also ready on end-of-file).

The file descriptors in `writefds` will be watched to see if space is available for write (though a  large write may still block).

The file descriptors in `exceptfds` will be watched for exceptional conditions.  (For examples of some exceptional  conditions,  see  the  discussion  of  `POLLPRI`  in `poll(2)`.)


The time structures involved are defined in `<sys/time.h>` and look like

```cpp
struct timeval {
    long    tv_sec;         /* seconds */
    long    tv_usec;        /* microseconds */
};
```

and

```cpp
struct timespec {
    long    tv_sec;         /* seconds */
    long    tv_nsec;        /* nanoseconds */
};
```

我们可以看到有时 会多个fd同时 就绪，

并且每次select后需要 再走一边`FD_ZERO` -> `FD_SET`

当就绪(或者超时)的时候，需要for所有的fd用`FD_ISSET`来判断就绪状态

单个进程能够监视的文件描述符的数量存在最大限制，它由`FD_SETSIZE`设置通常为1024，最大数量可以通过修改宏定义甚至重新编译内核的方式来满足。

[select.h](https://sites.uclouvain.be/SystInfo/usr/include/sys/select.h.html)

内核/用户空间的拷贝问题，select需要维护一个用来存放大量fd的数据结构，这样会使得用户空间和内核空间在传递该结构时复制开销大。

轮询扫描: 也就是for+`FD_ISSET`

水平触发:应用程序如果没有完成对一个已经就绪的文件描述符进行IO,那么之后再次select调用还是会将这些文件描述符通知进程。


# poll

```c++
int poll(struct pollfd *fds, nfds_t nfds, int timeout);

struct pollfd {
    int   fd;         /* file descriptor */
    short events;     /* requested events */
    short revents;    /* returned events */
};
```

采用`数组指针`+`长度`的参数形式

返回值

```
On success, a positive number is returned; this is the number of
structures which have nonzero revents fields (in other words, those
descriptors with events or errors reported).  A value of 0 indicates
that the call timed out and no file descriptors were ready.  On
error, -1 is returned, and errno is set appropriately.
```

水平触发

其和select不同的地方：采用数组的方式替换原有`fd_set`数据结构,而使其没有连接数的限制。

虽然也是轮询，但是假设是单个fd,但fd的值很大的情况下，poll就会比select效率好

上面看到了只需要一次初始化，和恢复已经就绪的fd,不需要每次初始化

可移植性:`select( ) is more portable, as some Unix systems do not support poll( )`

# epoll

```c++
int epoll_create(int size); // Since Linux 2.6.8, the size argument is ignored, but must be greater than zero;
int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event);
int epoll_wait(int epfd, struct epoll_event *events,int maxevents, int timeout);

typedef union epoll_data {
    void        *ptr;
    int          fd;
    uint32_t     u32;
    uint64_t     u64;
} epoll_data_t;

struct epoll_event {
    uint32_t     events;      /* Epoll events */
    epoll_data_t data;        /* User data variable */
};
```

前面两种，都是 user space设置，要用时调用 select/poll 进入 kernel 态

 * create a context in the kernel using `epoll_create`
 * add and remove file descriptors to/from the context using `epoll_ctl`
 * wait for events in the context using `epoll_wait` ,据说这里做了内存映射优化

`epoll_ctl`这里要有fd参数，`epoll_event`中也有`epoll_data` 中有`fd`

然而 里面的`epoll_data`是个`union`也就是调用者自己喜欢放什么就放什么,不论是下面的fd还是

Level-triggered(默认) and edge-triggered

LT模式：若就绪的事件一次没有处理完要做的事件，就会一直去处理。即就会将没有处理完的事件继续放回到就绪队列之中（即那个内核中的链表），一直进行处理。 

ET模式：就绪的事件只能处理一次，若没有处理完会在下次的其它事件就绪时再进行处理。而若以后再也没有就绪的事件，那么剩余的那部分数据也会随之而丢失。 

由此可见：ET模式的效率比LT模式的效率要高很多。只是如果使用ET模式，就要保证每次进行数据处理时，要将其处理完，不能造成数据丢失，这样对编写代码的人要求就比较高。 
注意：ET模式只支持非阻塞的读写：为了保证数据的完整性。

# 总结


上面的函数都有一些保证`原子性`的操作函数，例如`pselect`,`epoll_pwait`等

例如`epoll_pwait()`等价于

```c++
sigset_t origmask;

pthread_sigmask(SIG_SETMASK, &sigmask, &origmask);
ready = epoll_wait(epfd, &events, maxevents, timeout);
pthread_sigmask(SIG_SETMASK, &origmask, NULL);
```

> 有的地方说

表面上看epoll的性能最好，但是在连接数少并且连接都十分活跃的情况下，select和poll的性能可能比epoll好，毕竟epoll的通知机制需要很多函数回调

# reference

[man 2 listen](http://man7.org/linux/man-pages/man2/listen.2.html)

[man 2 read](http://www.man7.org/linux/man-pages/man2/read.2.html)

[man 2 select](http://man7.org/linux/man-pages/man2/select.2.html)

[man 2 poll](http://man7.org/linux/man-pages/man2/poll.2.html)

[man 7 epoll](http://man7.org/linux/man-pages/man2/poll.2.html)

[man 2 epoll_create](http://man7.org/linux/man-pages/man2/epoll_create.2.html)

[man 2 epoll_ctl](http://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

http://www.ulduzsoft.com/2014/01/select-poll-epoll-practical-difference-for-system-architects/

https://devarea.com/linux-io-multiplexing-select-vs-poll-vs-epoll/

[Using poll() instead of select()](https://www.ibm.com/support/knowledgecenter/ssw_ibm_i_71/rzab6/poll.htm)

[Example: Using asynchronous I/O](https://www.ibm.com/support/knowledgecenter/ssw_ibm_i_71/rzab6/xasynchi0.htm)

[Example: Nonblocking I/O and select()](https://www.ibm.com/support/knowledgecenter/ssw_ibm_i_71/rzab6/xnonblock.htm)

[The method to epoll’s madness](https://medium.com/@copyconstruct/the-method-to-epolls-madness-d9d2d6378642)
