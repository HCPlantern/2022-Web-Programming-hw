// 引入其他相关包
const express = require("express");
const bodyParser = require("body-parser");
crypto = require('crypto');
const argon2 = require('argon2');
const jwt = require("jsonwebtoken");
const app = express();
// 此变量为解析 token 密匙
const SECRET = "MRojcCRvjSg4xb";
const db_file = "db/users.db"

app.use(express.json())

// 解析 post 请求体
app.use(bodyParser.json({limit: "1mb"})); //body-parser 解析json格式数据
app.use(
    bodyParser.urlencoded({
        //此项必须在 bodyParser.json 下面,为参数编码
        extended: true,
    })
);

// 创建服务器
// 监听3001端口
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
    const params = req.body;
    const username = params.username;
    const password = params.password;
    // 检查用户名和密码是否为空
    if (!params) {
        console.log("邮箱或密码为空")
        return res.status(400).send("邮箱或密码不能为空");
    }
    // 密码进行加密
    try {
        const hashedPassword = await argon2.hash(password).then((hash) => hash);
        // 将用户名和密码存入数据库
        const sql = `insert into users (username, password)
                     values (?, ?)`;
        db.run(sql, [username, hashedPassword], (err) => {
            if (err) {
                console.log(err)
                return res.status(400).json({error: err.message});
            } else {
                return res.send("用户注册成功");
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: err.message});
    }
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
                return res.status(400).json({error: "用户不存在"});
            }
            const hashedPassword = row[0].password;
            // 使用 argon2 进行密码验证
            argon2.verify(hashedPassword, password).then((match) => {
                if (match) {
                    const token = jwt.sign({id: row[0].username}, SECRET);
                    return res.json({username, token});
                } else {
                    return res.status(400).json({error: "邮箱或密码错误"});
                }
            });
        }
    });
});

app.get("/api/profile", (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const {id} = jwt.verify(token, SECRET);
    const sql = `select * from users where username = ?`;
    db.all(sql, [id], (err, row) => {
        if (err) {
            console.log(err)
            return res.status(400).json({error: err.message});
        } else {
            return res.json(row);
        }
    });
});

// close the database connection
// db.close((err) => {
//     if (err) {
//         return console.error(err.message);
//     }
//     console.log('Close the database connection.');
// });
