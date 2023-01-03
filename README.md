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

实现方法：

为不同的类名设置不同的根变量，在 CSS 文件中通过调用这些颜色变量来实现不同的主题颜色效果；通过 JS 脚本实现点击按钮切换 `body` 类名，从而实现主题切换。

例如，在`root.css`中，定义如下变量：

```css

.day {
    --backgound-color: #fff;
    --text-color: #353a40;
    --grey-text-color: #6c757d;
    --backgound-grey-color: #e9eaf2;
    --border-color: #e9eaf2;
    --text-hover-color: #5b5f62;
    /* 登陆框相关颜色 */
    --input-color: #f5f6fa;
    --input-focus-color: #e8eaf3;
    --submit-button-color: #3b5998;
    --submit-text-color: #fafbfc;
    --submit-button-hover-color: #38487e;
    --foot-color: #f8f9fa;
    --foot-text-color: #6c757d;
}

.dark {
    --backgound-color: #181a1b;
    --text-color: #c2beb6;
    --grey-text-color: #c2beb6;
    --backgound-grey-color: #232526;
    --border-color: #272b48;
    --text-hover-color: #5b5f62;
    /* 登陆框相关颜色 */
    --input-color: #1d1f20;
    --input-focus-color: #232526;
    --submit-button-color: #37467c;
    --submit-text-color: #fafbfc;
    --submit-button-hover-color: #2d3964;
    --foot-color: #1c1e1f;
    --foot-text-color: #6c757d;
}

```

`login.html` `regiser.html` `watermakr.html` 均支持主题切换。

登陆界面如下：

![image-20221213000658282](https://cdn.hcplantern.cn/img/2022/12/13/20221213-000659.png-default)

![image-20221213000702578](https://cdn.hcplantern.cn/img/2022/12/13/20221213-000703.png-default)



画册界面如下：

![image-20221213000717592](https://cdn.hcplantern.cn/img/2022/12/13/20221213-000719.png-default)

![image-20221213000723011](https://cdn.hcplantern.cn/img/2022/12/13/20221213-000724.png-default)

点击页面中的 `切换主题` 即可。



## hw5

### 简介

- 实现登陆、注册功能
- 使用 Node.js 搭建后端，数据库使用 SQLite3
- 使用邮箱注册和登录，实现邮箱验证码
- 后端使用 argon2 对密码进行加密
- 后端使用 jwt 实现鉴权接口

演示视频：https://box.nju.edu.cn/f/a97588d68de647c78071/

项目地址：[HCPlantern/2022-Web-Programming-hw: Web-Programming-hw archive 前端开发课程作业](https://github.com/HCPlantern/2022-Web-Programming-hw)

### 运行

- 前端：静态页面，点击 `/frontend/index.html` 即可
- 后端：命令行运行 `node index.js` 即可，Node.js 版本推荐为 `19.3.0`

### 前端部分

#### 图库

图库页面为 `index.html` ，界面见演示视频。

鉴权部分：进入图库时，会验证本地 localStorage 是否存在 token，并调用后端接口对 token 进行验证，若成功，后端将会返回用户信息。否则将拒绝用户进入图库，界面跳转至登陆界面。见演示视频。

#### 登陆

登陆页面为 `login.html`，界面与 hw4 基本一致

#### 注册

注册页面为 `register.html`，可通过登陆界面跳转

#### 正则表达式验证邮箱和密码

`register.js` 中会对邮箱格式和密码强度进行验证：

```js
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

// 密码需要包含大写字母，小写字母和数字，长度 6-16 位
const validatePassword = (password) => {
    return String(password).match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,16}$/);
}
```

此外，注册时还会对其他方面进行验证，比如两次密码是否正确、是否勾选同意服务条款。

### 功能详解

#### 数据库

数据库使用轻量级 SQLite3，数据库文件为 `/backend/db/gallery.db` ，其中存在两张表，`users` 为邮箱和加密密码，`code` 存放已发送的邮箱验证码。

#### 用户密码加密

用户密码使用 argon2 进行加密，注册时，调用接口并存入数据库：

```javascript
            // 密码进行加密
            try {
                const hashedPassword = await argon2.hash(password).then((hash) => hash);
                // 将用户名和密码存入数据库
                const sql = `insert into users (username, password)
                             values (?, ?)`;
                db.run(sql, [username, hashedPassword], (err) => {
                    if (err) {
                        console.log(err)
                        if (err.errno === 19) {
                            return res.status(400).json({error: "用户名已存在，请登录"});
                        }
                        return res.status(400).json({error: err.message});
                    } else {
                        return res.send("用户注册成功");
                    }
                });
            } catch (err) {
                console.log(err);
                return res.status(500).json({error: err.message});
            }
```

登陆时，调用接口进行验证：

```javascript
        const hashedPassword = row[0].password; // 从数据库取出的密码
        // 使用 argon2 进行密码验证
        argon2.verify(hashedPassword, password).then((match) => {
            if (match) {
                const token = jwt.sign({id: row[0].username}, SECRET);
                console.log('token: ', token);
                return res.json({username, token});
            } else {
                console.log("密码错误")
                return res.status(400).json({error: "邮箱或密码错误"});
            }
        });
```

#### 鉴权

用户登陆时，后端会调用jwt生成token并返回给前端：

```javascript
const token = jwt.sign({id: row[0].username}, SECRET);
return res.json({username, token});
```

前端收到后存入localStorage

```javascript
    const options = {
        url: 'http://localhost:8080/api/login',
        method: 'post',
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        data: data
    }
    axios(options)
        .then((response) => {
            if (response.status === 200) {
                // 登陆成功，保存 token
                window.localStorage.setItem("token", response.data.token);
                // 跳转到首页
                window.location.href = "./index.html";
            } else {
                console.log(response.data)
                alert(response.data.error);
            }
        })
```

在用户访问图库页面 `index.html`时，将会调用后端接口进行鉴权并取得用户信息，若鉴权失败则跳转至登陆界面

```javascript
    let options = {
        url: 'http://localhost:8080/api/auth',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + token}
    }
    // token 存在，检查是否过期
    axios(options)
        .then((response) => {
            console.log(response);
            if (response.status === 200) {
                console.log("token 有效，可以访问");
                let username = response.data.username;
                $("#userInfo").text(username);
            } else {
                console.log("token 无效，需要重新登陆");
                alert("请重新登陆！")
                window.localStorage.removeItem("token");
                window.location.href = "login.html";
            }
        });
```

后端接口部分，通过 jwt 进行 token 验证

```javascript
// 判断是否有权限
app.get("/api/auth", (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    // 使用 jwt 进行 token 验证
    try {
        const {id} = jwt.verify(token, SECRET);
        if (id) {
            return res.status(200).json({username: id, msg: "已鉴权"});
        }
    } catch (err) {
        console.log(err);
        return res.status(401).json({error: err.message});
    }
});
```

#### 邮箱验证码

使用 `nodemailer` 和 `nodemailer-smtp-transport` 模块。

smtp 选用了qq邮箱提供的服务.

前端通过 `/api/email`接口传入一个邮箱，后端首先生成验证码，并发送给邮箱，同时将该验证码存入数据库中，设置5分钟自动删除。

后端接口实现：

```javascript
app.post('/api/email', async (req, res) => {
    const {email} = req.body;
    if (regEmail.test(email)) {
        let code = randomFns();
        await transport.sendMail({
                from: 'hcplantern@foxmail.com', // 发件邮箱
                to: email, // 收件列表
                subject: '验证你的电子邮件', // 标题
                html: `
            <p>你好！</p>
            <p>您正在注册 Another Simple Gallery 账号</p>
            <p>你的验证码是：<strong style="color: #ff4e2a;">${code}</strong></p>
            <p>***该验证码5分钟内有效***</p>` // html 内容
            },
            function (error) {
                if (error) {
                    console.log(error);
                    return res.status(400).json({error: error.message});
                }
                transport.close(); // 如果没用，关闭连接池
            })
        const deleteSql = `delete
                           from code
                           where email = ?`;
        const insertSql = `insert into code (email, code)
                           values (?, ?)`;
        // 首先删除该邮箱之前的验证码
        db.serialize(() => {
            db.run(deleteSql, [email], (err) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({error: err.message});
                }
            })
            // 然后插入新的验证码
            db.run(insertSql, [email, code], (err) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({error: err.message});
                }
            })
        })
        setTimeout(async () => {
            await db.run(deleteSql, [email], (err) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({error: err.message});
                }
            })
        }, 1000 * 60 * 5)
    } else {
        return res.status(400).json({error: "邮箱格式错误！"});
    }

})

```

在用户注册时，会同时验证用户输入的验证码，验证成功则删除该验证码 。`/api/register` 部分实现：

```javascript
    const codeSql = `SELECT *
                     FROM code
                     WHERE email = ?
                       AND code = ?`
    db.all(codeSql, [username, code], async function (err, rows) {
        if (err) {
            console.log(err)
            return res.status(400).json({error: "验证码错误"});
        } else {
            if (rows.length !== 1) {
                console.log("验证码错误")
                return res.status(400).json({error: "验证码错误"});
            }
            // 验证通过，删除验证码
            console.log("验证码验证通过")
            const deleteCodeSql = `DELETE
                                   FROM code
                                   WHERE email = ?`
            db.run(deleteCodeSql, [username]);

```



