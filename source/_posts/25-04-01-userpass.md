---
title: user password
date: 2025-04-01
tags:
  - 加密
  - RSA
category:
  - backend
description: 常见的用户名密码
---


## **传统明文传输（HTTP）**

**关键细节**  
在早期 HTTP 协议中，用户名和密码以 ASCII 或 Unicode 编码直接传输，例如：
- 用户输入：`username=alice`, `password=123456`
- 传输内容：`GET /login?username=alice&password=123456 HTTP/1.1`

**攻击实例**  
- **中间人攻击（MITM）**：攻击者通过 ARP 欺骗截获数据包，直接获取明文。
- **Firesheep 工具**：利用 WiFi 嗅探还原 Cookie，劫持会话。

<!--more-->

## **2. 加密传输（HTTPS/TLS）**

**核心改进**  
引入 TLS 协议，结合对称加密（AES）与非对称加密（RSA/ECC），实现**保密性**与**完整性**。

**数学原理**  
1. **密钥交换（RSA）**  
   - 生成大素数$p, q$，计算$n = pq$,$\phi(n) = (p-1)(q-1)$。  
   - 选择$e$满足$\gcd(e, \phi(n)) = 1$，计算$d \equiv e^{-1} \mod \phi(n)$。  
   - 公钥$(e, n)$加密：$c \equiv m^e \mod n$。  
   - 私钥$(d, n)$解密：$m \equiv c^d \mod n$。  

2. **对称加密（AES）**  
   - 将明文分块为 128 位，通过多轮非线性变换（S 盒、行移位、列混淆）生成密文。  
   - 数学基础：有限域$\text{GF}(2^8)$上的多项式运算。  

3. **哈希函数（SHA-256）**  
   - 输入分块为 512 位，通过压缩函数迭代：  
     $H_i = \text{Compress}(H_{i-1}, M_i)$
   - 抗碰撞性依赖**生日攻击复杂度**$O(2^{n/2})$，SHA-256 需$O(2^{128})$次操作。

**解决的问题**  
- 抵御窃听与篡改，通过混合加密降低计算开销。

---

## **WiFi 安全协议：WPA2 与 WPA3**

### **3.1 WPA2（基于 AES-CCMP 与四次握手）**

**四次握手流程**  

- PSK(Wi-Fi密码)
- PMK(Pairwise Master Key)=PBKDF2(PSK)
- 接入点（AP）发送随机数$\text{ANonce}$。(AP Nonce) 
- 客户端生成$\text{SNonce}$ (Supplicant Nonce)，计算 PTK(Pairwise Transient Key)：  
  $\text{PTK} = \text{PRF}(\text{PMK}, \text{ANonce}, \text{SNonce}, \text{MAC}_{AP}, \text{MAC}_{Client})$
   （PRF 为伪随机函数，PMK 由预共享密码派生）  
- 交换 MIC（Message Integrity Code）验证密钥一致性。  

**数学漏洞**  
- **KRACK 攻击**：利用四次握手重放，重置加密 Nonce，导致密钥重用。  
- **PMK 派生缺陷**：若预共享密码熵低，易受离线字典攻击。

##### **3.2 WPA3（引入 SAE 与 Dragonfly 协议）**
**SAE（Simultaneous Authentication of Equals）**  
- 基于椭圆曲线密码学（ECC），取代预共享密码。  
- **Dragonfly 握手**：  
  1. 双方选择椭圆曲线$E: y^2 = x^3 + ax + b$和基点$G$。  
  2. 生成随机数$a, b$，计算承诺$P = aG$,$Q = bG$。  
  3. 交换后计算共享密钥：  
     \[
     K = a \cdot Q = b \cdot P = abG
     \]  
- **抗暴力破解**：每次尝试需一次在线交互，复杂度为$O(2^n)$。  

**数学优势**  
- 椭圆曲线离散对数问题（ECDLP）：已知$P = kG$，求$k$的复杂度为$O(\sqrt{n})$，远高于 RSA 的亚指数时间。  
- **前向保密**：每次会话生成临时密钥，防止历史数据解密。

---

#### **4. 安全性对比与数学总结**
| 协议  | 核心数学原理        | 改进点               | 解决的问题           |
| ----- | ------------------- | -------------------- | -------------------- |
| 明文  | ASCII 编码          | 无                   | 无                   |
| HTTPS | RSA + AES + SHA-256 | 混合加密与哈希链     | 中间人攻击、数据篡改 |
| WPA2  | AES-CCMP + PRF 函数 | 四次握手实现密钥协商 | 无线窃听             |
| WPA3  | ECC + SAE 协议      | 前向保密与抗字典攻击 | KRACK 漏洞、离线破解 |

**未来方向**  
- **后量子密码**：如基于格的 NTRU 算法，抵御 Shor 算法攻击。  
- **零知识证明**：实现无需传输密码的认证（如 ZK-SNARKs）。

---

通过数学工具的不断升级，认证协议从明文到 WPA3 的演进，本质上是**计算复杂性理论**与**密码学实践**的结合。每一次改进均针对特定数学问题的破解难度提升，确保攻击成本远高于收益。

