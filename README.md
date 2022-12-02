# 2022 Web Programming hw

## hw1

出题作业，略过

## hw2

实现登陆、注册界面和画册界面，并支持点击显示原图

示例图：

- 登陆界面
  ![登陆界面](https://cdn.hcplantern.cn/img/2022/11/25/20221125-162425.png-default)
- 注册界面
  ![注册界面](https://cdn.hcplantern.cn/img/2022/11/25/20221125-162741.png-default)
- 画册界面
  ![画册界面](https://cdn.hcplantern.cn/img/2022/11/25/20221125-162813.png-default)

## hw3

要求：

在作业二基础上，新增一个二级页面实现前端水印，包括：

- 1.动态水印：基于 svg 的方案，水印需包含个人昵称+学号，可见；
- 2.频域水印：基于傅立叶变换的方案，不可见。可参考文献 4。

### task1: svg 动态水印

实现思路：

- 将带有水印信息的 svg 转换成 base64 编码的字符串

```html

<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <text x="50%" y="50%" font-size="30" fill="#a2a9b6" fill-opacity="0.3" font-family="system-ui, sans-serif"
          text-anchor="middle" dominant-baseline="middle" transform='rotate(-45, 100 100)'>201250035 邓尤亮
    </text>
</svg>
```

得到

```text
url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjMwIiBmaWxsPSIjYTJhOWI2IiBmaWxsLW9wYWNpdHk9IjAuMyIgZm9udC1mYW1pbHk9InN5c3RlbS11aSwgc2Fucy1zZXJpZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdHJhbnNmb3JtPSdyb3RhdGUoLTQ1LCAxMDAgMTAwKSc+MjAxMjUwMDM1IOmCk+WwpOS6rjwvdGV4dD4KPC9zdmc+");
```

- 使用 `background-image` 设置背景图片为该编码后的字符串即可

```css
.watermark {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background-size: 100px;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjMwIiBmaWxsPSIjYTJhOWI2IiBmaWxsLW9wYWNpdHk9IjAuMyIgZm9udC1mYW1pbHk9InN5c3RlbS11aSwgc2Fucy1zZXJpZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdHJhbnNmb3JtPSdyb3RhdGUoLTQ1LCAxMDAgMTAwKSc+MjAxMjUwMDM1IOmCk+WwpOS6rjwvdGV4dD4KPC9zdmc+");
}
```

效果展示：![svg 水印展示](https://cdn.hcplantern.cn/img/2022/12/02/20221202-222943.png-default)

