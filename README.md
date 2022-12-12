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

此次作业我设计了一个html页面：`watermark.html`，允许用户上传图片，输入水印信息。随后可以展示加上了 svg 水印和 dct 水印的图片，并从 dct 水印图片中读取 dct 水印信息。

界面展示如下：

![image-20221203145336319](https://cdn.hcplantern.cn/img/2022/12/03/20221203-145338.png-default)

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

### task2: DCT(Discrete cosine transform) 水印

该部分使用了 jQuery 和手册中提供的 [CryptoStego](https://github.com/zeruniverse/CryptoStego) 库

实现思路：

- 为上传图片的 `input` 框添加`change` 的事件响应函数。用户上传图片之后，展示原图和 svg 水印图。具体代码实现如下：（大部分为创建 DOM 元素，使用了 jQuery 方便编写代码）

```javascript
    // after uploading image, show it
    $('#file').change(function () {
        console.log('file changed');
        const originalDiv = $('#original');
        const svgWatermarkDiv = $('#svgWatermark');
        const dctWatermarkDiv = $('#dctWatermark');
        if (this.files && this.files[0]) {
            // remove all child elements
            originalDiv.empty();
            originalDiv.append('<h1>原图</h1>');

            svgWatermarkDiv.empty()
            svgWatermarkDiv.append('<h1>SVG 水印</h1>');
            // for svg image and svg watermark
            const svgImgAndMarkDiv = $('<div class="imgAndMark" style="position: relative"></div>');
            svgWatermarkDiv.append(svgImgAndMarkDiv);

            // for dct image
            dctWatermarkDiv.empty();
            dctWatermarkDiv.append('<h1>DCT 水印</h1>');

            const img = document.createElement('img');
            img.src = URL.createObjectURL(this.files[0]);
            img.onload = function () {
                // 加载原图
                originalDiv.append(img);
                console.log('original image loaded');
                // 加载 svg 水印图
                svgImgAndMarkDiv.append(img.cloneNode());

                const markDiv = $('<div class="watermark"></div>');
                svgImgAndMarkDiv.append(markDiv);

                console.log('svg watermark image loaded');
            }
        }
    });

```

- 用户输入 dct 水印信息并点击按钮之后，调用 `writeIMG()` 函数。
  - 该函数首先清空读取到的信息和 dct 水印图
  - 随后，调用 `CryptoStego` 库中的 `loadIMGtoCanvas` 函数。该函数读入一个图片并生成 canvas，最后调用传入的 callback 函数
  - 在传入的 callback 函数中，首先将用户输入的水印信息写入到图片中，此处需要调用 `writeMsgToCanvas` 函数
  - 然后再调用 `readMsgFromCanvas` 函数，从生成的水印图片中读取水印信息

`writeIMG()` 函数代码如下：

```javascript
    function writeIMG() {
        const dctWatermarkDiv = $('#dctWatermark');
        // 清空读取到的信息和 dct 水印图
        $('msgRead').val('');
        dctWatermarkDiv.find('img:last').remove();

        // 将上传的图片加载到 canvas 中，并通过 callback 函数写入水印信息
        loadIMGtoCanvas('file', 'canvas', callbackFunc, 1000);

        function callbackFunc() {
           writeMsg();
           readMsg();
        }

        function writeMsg() {
            const t = writeMsgToCanvas('canvas', $("#msg").val(), '', 1);
            if (t === true) {
                const myCanvas = document.getElementById("canvas");
                const image = myCanvas.toDataURL("image/png");
                const imageElem = $('<img alt="dct image">').attr('src', image);
                dctWatermarkDiv.append(imageElem);
                console.log('DCT watermark written');
            } else {
                console.log('writ DCT watermark failed');
                console.log(t);
            }
        }

        function readMsg() {
            const msg = readMsgFromCanvas('canvas', '', 1);
            console.log('read msg from canvas: ' + msg);
            $('#msgRead').val(msg);
        }
    }

```

一个可能的 DCT 水印照片如图：

![image-20221203150405457](https://cdn.hcplantern.cn/img/2022/12/03/20221203-150406.png-default)



为了减轻浏览器压力，用户上传图片后将会对其进行压缩，使其不超过 500KB。

## hw4

要求：
- 在前面一级页面中，实现主题切换。
