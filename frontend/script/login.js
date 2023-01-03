
// 主题设置相关
let themes = ["day", "dark"];
let i = 0;
let changeTheme = function () {
    i = (i + 1) % themes.length;
    document.body.className = themes[i];
}
$(document).ready(function () {
    document.body.className = themes[i];
});

$('#submit').click(function () {
    const email = $('#email').val();
    const password = $('#password').val();
    if (email === '' || password === '') {
        alert('邮箱或密码不能为空');
        return false;
    }

    let data = {
        username: email,
        password: password
    }

    const options = {
        url: 'http://localhost:8080/api/login',
        method: 'post',
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        data: data
    }
    axios(options)
        .then((response) => {
            // console.log(response.data);
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
        .catch((error) => {
            console.log(error.response.data.error);
            alert(error.response.data.error);
        })
});

