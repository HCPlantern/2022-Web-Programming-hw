// 主题设置相关
let themes = ["day", "dark"];
let i = 0;
let changeTheme = function () {
    i = (i + 1) % themes.length;
    document.body.className = themes[i];
}
$(document).ready(function () {
    document.body.className = themes[i];
})

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

// 点击之后首先检查邮箱和密码是否正确
// 判断两次输入的密码是否一致，如果不一致则提示用户两次输入的密码不一致
// 如果一致则发送axios请求，将用户输入的信息发送到服务器端
// 如果注册成功则跳转到登录页面，如果注册失败则提示用户注册失败
$('#submit').click(function () {
    const email = $('#email').val();
    const password = $('#password').val();
    const password2 = $('#password2').val();
    const code = $('#code').val();
    // 验证邮箱
    if (validateEmail(email) === null) {
        alert("邮箱格式不正确");
        return false;
    }
    // 验证密码
    if (validatePassword(password) === null) {
        alert("密码需包含大小写字母和数字，长度 6-16 位");
        return false;
    }
    if (password !== password2) {
        alert("两次输入的密码不一致");
        return false;
    }
    // 检查验证码
    if (code === null) {
        alert("验证码不能为空");
        return false;
    }
    // 检查是否勾选了同意协议
    if (!$('#terms-check').is(':checked')) {
        alert("请勾选同意协议");
        return false;
    }

    let data = {
        username: email,
        password: password,
        code: code
    }
    const options = {
        url: 'http://localhost:8080/api/register',
        method: 'post',
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        data: data
    }
    axios(options)
        .then((response) => {
            if (response.status === 200) {
                alert("注册成功");
                window.location.href = "login.html";
            } else {
                console.log(response.data)
                alert(response.data.error);
            }
        })
        .catch((error) => {
            console.log(error.response.data.error);
            alert(error.response.data.error);
        })
})

$('#codeSubmit').click(function () {
    const email = $('#email').val();
    // 检查邮箱
    if (email === null) {
        alert("邮箱不能为空");
        return false;
    } else if (validateEmail(email) === null) {
        alert("邮箱格式不正确");
        return false;
    }
    const options = {
        url: 'http://localhost:8080/api/email',
        method: 'post',
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        data: {
            email: email
        }
    }
    axios(options)
})
