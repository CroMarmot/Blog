---
title: rust真的快
date: 2020-06-03 11:20:14
tags: [rust,cplusplus]
category: [backend]
---

# ProjectEuler 74 题

https://projecteuler.net/problem=74

用rust写了一遍,觉得根据常识1e6数据量，应该1s内随便跑，结果5s+，

就换成C++写了一遍，发现是因为rust没开O2？开了以后还真就和C++差不多的时间

## rust 版本

```rust
use std::collections::HashMap;
const N:usize = 1_000_000;

fn next_value(mut value:usize,fac:&[usize]) -> usize{
    let mut sum = 0;
    while value != 0 {
        sum += fac[value%10];
        value/=10;
    }
    return sum;
}

fn dfs(
    fac:&[usize],
    ans:&mut HashMap<usize,usize>,
    dep:&mut HashMap<usize,usize>,
    value:usize
    ) -> (usize,usize) { // dep, len
    let nv = next_value(value,fac);
    let next_dep = dep.get(&value).unwrap() + 1;
    match dep.get(&nv) {
        Some(rs) => {
            // println!("{} => {}",value,next_dep - rs);
            ans.insert(value,next_dep - rs);
            return (*rs,next_dep - rs);
        },
        None => {
            match ans.get(&nv) {
                Some(res) => {
                    let newres= (*res) + 1;
                    // println!("{} => {}",value,newres);
                    ans.insert(value,newres);
                    return (next_dep,newres);
                },
                None => {
                    dep.insert(nv,next_dep);
                    let mut ret = dfs(fac,ans,dep,nv);
                    if next_dep <= ret.0  {
                        ret.1 += 1;
                    }
                    // println!("{} => {}",value,ret.1);
                    ans.insert(value,ret.1);
                    return ret;
                }
            }
        }
    }
}

fn main() {
    let mut fac = [0;11];
    let mut ans = HashMap::new();
    fac[0] = 1;
    for i in 1..11{
        fac[i] = fac[i-1]*i;
    }
    for i in 1..N+1{
        if ans.contains_key(&i) {
            continue;
        }
        let mut dep = HashMap::new();
        dep.insert(i,0);
        dfs(&fac,&mut ans,&mut dep,i);
    }
    let mut cnt = 0;
    for (k, v) in &ans {
        if *v >= 60 && *k <= N {
            cnt+=1;
            // println!("{}: \"{}\"", k, v);
        }
    }
    println!("{}",cnt);
}
```

## C++版本

```cpp
#include <bits/stdc++.h>
using namespace std;

typedef long long ll;
#define ten5 100000+10
#define MOD 1000000007
#define rep(i,a,n) for (uint i=a;i<n;i++)
#define iif(c,t,f) ((c)?(t):(f))
#define per(i,a,n) for (int i=n-1;i>=a;i--)
#define pb push_back
#define mp make_pair
const double pi = acos(-1.0);

const uint N = 1'000'000;

uint next_value(uint value,uint *fac) {
    uint sum = 0;
    while(value != 0){
        sum += fac[value%10];
        value/=10;
    }
    return sum;
}

pair<uint,uint> dfs(
    uint *fac,
    unordered_map<uint,uint> &ans,
    unordered_map<uint,uint> dep,
    uint value
    ) { // dep, len
    uint nv = next_value(value,fac);
    uint next_dep = dep[value] + 1;
    if(dep.count(nv)){
      auto rs = dep[nv];
      // printf("%d => %d\n",value,next_dep - rs);
      ans[value] = next_dep - rs;
      return {rs,next_dep - rs};
    }else {
      if(ans.count(nv)) {
        auto res = ans[nv];
        auto newres= res + 1;
        // printf("%d => %d\n",value,newres);
        ans[value] = newres;
        return {next_dep,newres};
      }else{
        dep[nv] = next_dep;
        auto ret = dfs(fac,ans,dep,nv);
        if(next_dep <= ret.first){
          ret.second += 1;
        }
        // printf("%d => %d\n",value,ret.second);
        ans[value] = ret.second;
        return ret;
      }
    }
}

int main() {
    uint fac[11];
    unordered_map<uint,uint> ans;
    fac[0] = 1;
    rep(i,1,11){
        fac[i] = fac[i-1]*i;
    }
    rep(i,1,N+1){
        if(ans.count(i)){
            continue;
        }
        unordered_map<uint,uint> dep;
        dep[i] = 0;
        dfs(fac,ans,dep,i);
    }
    auto cnt = 0;
    for (auto [k,v]: ans) {
        if( v >= 60 && k <= N ){
            cnt+=1;
            // println!("{}: \"{}\"", k, v);
        }
    }
    printf("%d",cnt);
    return 0;
}
```

rust不带`-O2` 大概`5s+`,带了和`C++`相近都是`0.3s`左右, 真的快

# env

Intel Core i7-7700HQ @ 8x 3.8GHz

`!clang++ -o "%<" "%" -std=gnu++17 -O2 -g -Wall -Wcomma`

```
clang version 6.0.0-1ubuntu2 (tags/RELEASE_600/final)
Target: x86_64-pc-linux-gnu
Thread model: posix
```

`!rustc "%" -O`

`rustc 1.43.1 (8d69840ab 2020-05-04)`

# 感受

rust写好的代码转换成C++是真的轻松，C++转换成rust就会很累（除非各种 as，unwrap

