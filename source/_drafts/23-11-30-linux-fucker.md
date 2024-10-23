---
title: Linux fucker
date: 2023-11-30
tags:
  - cplusplus
  - linux
category:
  - backend
  - cpp
description: fuck linux
---

各有各的bug,各有各的体验问题

## journalctl -b0 -p4

```
[Firmware Bug]: TSC_DEADLINE disabled due to Errata; please update microcode to version: 0x52 (or later)
```

https://askubuntu.com/questions/984970/firmware-bug-tsc-deadline-disabled-due-to-errata-what-should-i-do-about-thi

```
sudo apt-get install intel-microcode
```

## tail -f /var/log/syslog

```

kernel: [487543.431431] pcieport 0000:00:1c.5: AER: Corrected error received: 0000:00:1c.5
kernel: [487543.431451] pcieport 0000:00:1c.5: PCIe Bus Error: severity=Corrected, type=Physical Layer, (Receiver ID)
kernel: [487543.431457] pcieport 0000:00:1c.5:   device [8086:a115] error status/mask=00000001/00002000
kernel: [487543.431464] pcieport 0000:00:1c.5:    [ 0] RxErr                  (First)
```


```
lspci -nn

00:1c.5 PCI bridge [0604]: Intel Corporation 100 Series/C230 Series Chipset Family PCI Express Root Port #6 [8086:a115] (rev f1)
```
