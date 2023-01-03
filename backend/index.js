// express 框架
const express = require("express");
// argon2 加密
const argon2 = require('argon2');
const jwt = require("jsonwebtoken");
const app = express();
const cors = require('cors');
// 此变量为解析 token 密匙
const SECRET = "MRojcCRvjSg4xb";
const db_file = "db/gallery.db"

// 允许跨域
const corsOptions ={
    origin: '*',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
    allowedHeaders: ['Content-Type', 'Authorization'],
    allowedMethods: ['GET', 'POST']
}
app.use(cors(corsOptions));

// 解析 post 请求体
app.use(express.json()); //express 解析json格式数据
app.use(express.urlencoded({extended: true,}));

// 创建服务器
// 监听8080端口
app.listen(8080, () => {
    console.log("服务器启动，端口：8080");
});

const sqlite3 = require('sqlite3').verbose();

// start sqlite 3 database
const db = new sqlite3.Database(
    db_file,
    function (err) {
        if (err) {
            return console.log(err.message)
        }
        console.log('connect database successfully')
    }
)

app.get('/api', (req, res) => {
    res.send('Hello World!')
    console.log('Hello World!')
})

// 注册
app.post("/api/register", async (req, res) => {
    const {username, password, code} = req.body
    // 检查用户名和密码是否为空
    if (!username || !password) {
        console.log("邮箱或密码为空")
        return res.status(400).json({error: "邮箱或密码不能为空"});
    }
    if (!code) {
        console.log("验证码为空")
        return res.status(400).json({error: "验证码不能为空"});
    }
    // 验证验证码
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
        }
    })
});

// 登录
app.post("/api/login", async (req, res) => {
    const {username, password} = req.body;
    const sql = `select *
                 from users
                 where username = ?`;
    db.all(sql, [username], (err, row) => {
        if (err) {
            console.log(err)
            return res.status(400).json({error: err.message});
        } else {
            if (row.length === 0) {
                console.log("用户不存在")
                return res.status(400).json({error: "用户不存在"});
            }
            const hashedPassword = row[0].password;
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
        }
    });
});

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

const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const assert = require('http-assert')

const transport = nodemailer.createTransport(smtpTransport({
    host: 'smtp.qq.com', // 服务 由于我用的163邮箱
    port: 465, // smtp端口 默认无需改动
    secure: true,
    auth: {
        user: 'hcplantern@foxmail.com', // 用户名
        pass: 'jtahzqaxclcvjbah' // SMTP授权码
    }
}));

const randomFns = () => { // 生成6位随机数
    let code = ""
    for (let i = 0; i < 6; i++) {
        code += parseInt(Math.random() * 10)
    }
    return code
}
const regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/ //验证邮箱正则

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
            function (error, data) {
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