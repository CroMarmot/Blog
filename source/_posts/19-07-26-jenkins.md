---
title: jenkins 入门尝试
mathjax: true
date: 2019-07-26 01:01:01
tags: [server,CI]
categories: [code, devops]
---

# Why

作为被factorio洗脑的人 看到 自动化 自动化 自动化 就会激动

# Steps

首先你需要 java 8(jre/jdk),docker

这两个我之前都安装过了

然后下载jenkins: https://jenkins.io/zh/download/

运行命令`java -jar jenkins.war --httpPort=8080`

打开网页`http://localhost:8080`

输入终端里展示的密码 --> 下一步 --> 等待安装git等一系列工具 --> 创建管理员用户`--> 实例配置(我发现有不少网页开发工具都有意无意的避开了8080端口 这里我直接默认) -->开始使用

我这边最后一步以后白屏了，但是从Network看似乎没有资源卡着，于是我把服务先杀掉再启动一遍，可以进入jenkins了23333

# Hell world

单击 New Item

<!-- more -->

输入名称如 demo

选择multibranch pipeline(多分支流水线)

这里 Branch Sources里 我用Github尝试

在Owner输入 `CroMarmot`会自动拉取所有仓库

找到`jenkinsdemo` ,这个仓库对应代码为`https://github.com/CroMarmot/jenkinsdemo`

其它默认 确定 然后观察 jenkins的输出.....


然后我又迷之触发了

```
WARNING	o.j.p.g.webhook.WebhookManager$2#applyNullSafe: Failed to add GitHub webhook for GitHubRepositoryName[host=github.com,username=CroMarmot,repository=jenkinsdemo]
java.lang.NullPointerException: There are no credentials with admin access to manage hooks on GitHubRepositoryName[host=github.com,username=CroMarmot,repository=jenkinsdemo]
	at com.google.common.base.Preconditions.checkNotNull(Preconditions.java:231)
```

但是 在页面上 我点击配置啥也没改 点确定又看似正常的进行拉取了

又触发了

```
ERROR: [Fri Jul 26 10:38:48 CST 2019] Could not fetch branches from source 2024a3e8-d0cf-4a42-8de6-49de2562570a
java.lang.InterruptedException: sleep interrupted
	at java.base/java.lang.Thread.sleep(Native Method)
	at org.jenkinsci.plugins.github_branch_source.Connector.checkApiRateLimit(Connector.java:635)
	at org.jenkinsci.plugins.github_branch_source.GitHubSCMSourceRequest.checkApiRateLimit(GitHubSCMSourceRequest.java:400)
	at org.jenkinsci.plugins.github_branch_source.GitHubSCMSource.retrieve(GitHubSCMSource.java:932)
	at jenkins.scm.api.SCMSource._retrieve(SCMSource.java:373)
	at jenkins.scm.api.SCMSource.fetch(SCMSource.java:283)
	at jenkins.branch.MultiBranchProject.computeChildren(MultiBranchProject.java:635)
	at com.cloudbees.hudson.plugins.folder.computed.ComputedFolder.updateChildren(ComputedFolder.java:277)
	at com.cloudbees.hudson.plugins.folder.computed.FolderComputation.run(FolderComputation.java:164)
	at jenkins.branch.MultiBranchProject$BranchIndexing.run(MultiBranchProject.java:1026)
	at hudson.model.ResourceController.execute(ResourceController.java:97)
	at hudson.model.Executor.run(Executor.java:429)
[Fri Jul 26 10:38:48 CST 2019] Finished branch indexing. Indexing took 7 min 0 sec
Aborted
Finished: ABORTED
```

再把它在页面上结束了重启..

能在 Console Output 中看到 docker在拉取 node了 XD

但拉取又卡住了，....本地这网络真是艹了,决定去云服务上搞.. 不过操作差异应该不大

最后 也没有其它更改，能成功的看到

```bash
+ npm --version
3.10.3
```

当一次成功以后 再启动，就会很快的直接成功了，从输出看到 github的拉取有再运行一次，但是蛮快，docker就因为之前拉去过node的image，不会再拉去，直接创建了container就也很快了


小总结一下 `出了问题 重启试试?`

## 尝试增加更多steps

首先我切了个分支`nuxt`然后用`npx create-nuxt-app`创建了一个 hello world

进行了push到github

手动在Jenkins 拉取，

修改了Jenkins 配置的steps,增加了`sh 'npm install'` 和`sh 'npm run build'` ，再次push，还需要再次手动拉取

为了让它能自动获取,我更改了配置在空闲时按照设置频率Scan仓库

接着rust分支上 自动进行了第二次构建，失败

npm install的时候

`npm ERR! Error: EACCES: permission denied, mkdir '/.npm'`

没有文件夹创建权限

参考了下面链接，自己也加了`whoami`,`ls -al`等来查看运行时状态 最后配置改成了

```
pipeline {
    agent { docker 'node:8.12' }
    environment {
        HOME = '.'
    }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
                sh 'node -v'
                sh 'pwd'
                sh 'ls -al'
                sh 'npm install'
                sh 'npm run build'
                sh 'whoami'
            }
        }
    }
}
```

虽然还是有错误

```
Error: Cannot find module 'node-emoji'
    at Function.Module._resolveFilename (module.js:548:15)
```

但这已经是具体的npm 的某个package的错误了

至此，算是完成了

1. 多分支
2. 自动scan
3. `npm install` + `npm run 命令`

### 超时、重试和更多

```
pipeline {
    agent any
    stages {
        stage('Deploy') {
            steps {
                retry(3) {
                    sh './flakey-deploy.sh'
                }

                timeout(time: 3, unit: 'MINUTES') {
                    sh './health-check.sh'
                }
            }
        }
    }
}
```

retry 失败 则再尝试，最多尝试3次

timeout 运行时间最长 3 分钟

以上也可以嵌套

```
steps {
    timeout(time: 3, unit: 'MINUTES') {
        retry(5) {
            sh './flakey-deploy.sh'
        }
    }
}
```

表示最多尝试5次，总时间不超过3min

### 完成时

```
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'echo "Fail!"; exit 1'
            }
        }
    }
    post {
        always {
            echo 'This will always run'
        }
        success {
            echo 'This will run only if successful'
        }
        failure {
            echo 'This will run only if failed'
        }
        unstable {
            echo 'This will run only if the run was marked as unstable'
        }
        changed {
            echo 'This will run only if the state of the Pipeline has changed'
            echo 'For example, if the Pipeline was previously failing but is now successful'
        }
    }
}
```

在post部分里，增加 不同 完成状态时要执行的动作

# TODO

先去继续看rust了

https://jenkins.io/zh/doc/pipeline/tour/agents/

# 参考

https://jenkins.io/zh/doc/pipeline/tour/getting-started/

https://github.com/nuxt/nuxt.js

https://github.com/Microsoft/WSL/issues/14

https://stackoverflow.com/questions/42743201/npm-install-fails-in-jenkins-pipeline-in-docker/42957034

所有默认功能:`http://localhost:8083/job/yarnwebpipedocker/pipeline-syntax/html`

# docker

https://github.com/jenkinsci/docker/blob/master/README.md

为了把软件/软件依赖插件/仓库分开

`docker run --rm -d --group-add $(stat -c '%g' /var/run/docker.sock) --name myjenkins -p 10080:8080 -p 50000:50000 -v /var/run/docker.sock:/var/run/docker.sock -v $(which docker):/usr/bin/docker -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts`

解释

`--rm`结束后就自动删除

内部`8080`映射到外部`10080`

使用`docker volume jenkins_home`映射到内部使用的`/var/jenkins_home`

为了在docker内的jenkins能使用docker作为agent，对docker和docker.sock 进行了映射,并通过`--group-add` 授权，

使用官方lts镜像

你需要jenkins中安装 docker pipeline 和 docker 两个插件

//??  为了有权限操作docker 还需要 `sudo usermod -aG docker jenkins`


