let themes = ["day", "dark"];
let i = 0;
document.body.className = themes[i];
let changeTheme = function() {
    i = (i + 1) % themes.length;
    document.body.className = themes[i];
}
