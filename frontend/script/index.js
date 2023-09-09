

// 主题设置相关
let themes = ["day", "dark"];
let i = 1;
let changeTheme = function() {
    i = (i + 1) % themes.length;
    document.body.className = themes[i];
}
$(document).ready(function () {
    document.body.className = themes[i];
})

// let token = window.localStorage.getItem("token");
// // token 不存在，需要登陆
// if (token === null) {
//     console.log("token 不存在，需要登陆");
//     window.location.href = "login.html";
// } else {
//     let options = {
//         url: 'http://localhost:8080/api/auth',
//         method: 'get',
//         headers: {'Authorization': 'Bearer ' + token}
//     }
//     // token 存在，检查是否过期
//     axios(options)
//         .then((response) => {
//             console.log(response);
//             if (response.status === 200) {
//                 console.log("token 有效，可以访问");
//                 let username = response.data.username;
//                 $("#userInfo").text(username);
//             } else {
//                 console.log("token 无效，需要重新登陆");
//                 alert("请重新登陆！")
//                 window.localStorage.removeItem("token");
//                 window.location.href = "login.html";
//             }
//         });
// }

let logout = () => {
    window.localStorage.removeItem("token");
    window.location.href = "login.html";
}
