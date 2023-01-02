
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

$('#submit').click(function () {
    const email = $('#email').val();
    const password = $('#password').val();
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

