if(!localStorage.getItem('setting')){
    axios.get('/api/setting').then(res=>{
        setting=res.data.data
        localStorage.setItem('setting',JSON.stringify(setting))
        $('body').css('background-image',`url('${setting.bg}')`)
        $("link[rel=icon]").attr('href',setting.favicon)
    })
}
else{
    let setting=JSON.parse(localStorage.getItem('setting'))
    $('body').css('background-image',`url('${setting.bg}')`)
    $("link[rel=icon]").attr('href',setting.favicon)
}
function browserRedirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return false
    } else {
        return true
    }
}
$(function () {
    var a_idx = 0,
        b_idx = 0;
    c_idx = 0;
    jQuery(document).ready(function ($) {
        if (browserRedirect())
            $("body").click(function (e) {
                var a = new Array("&#xe68f;", "&#xe68f;", "&#xe68f;", "&#xe68f;",
                        "&#xe68f;", "&#xe68f;", "&#xe68f;",
                        "&#xe68f;", "&#xe68f;", "&#xe68f;", "&#xe68f;", "&#xe68f;"),
                    b = new Array("#09ebfc", "#ff6651", "#ffb351", "#51ff65", "#5197ff",
                        "#a551ff", "#ff51f7", "#ff518e", "#ff5163", "#efff51"),
                    c = new Array("14", "14", "14", "14", "14", "14", "14", "14", "14",
                        "14");
                var $i = $("<i/>").html(a[a_idx]);
                a_idx = (a_idx + 1) % a.length;
                b_idx = (b_idx + 1) % b.length;
                c_idx = (c_idx + 1) % c.length;
                var x = e.pageX,
                    y = e.pageY;
                $i.css({
                    "z-index": 999,
                    "top": y - 20,
                    "left": x - 10,
                    "position": "absolute",
                    "font-size": c[c_idx] + "px",
                    "color": b[b_idx]
                });
                $i.addClass('layui-icon');
                $("body").append($i);
                $i.animate({
                    "top": y - 180,
                    "opacity": 0
                }, 1500, function () {
                    $i.remove();
                });

            });

    });
});

layui.use('element', function () {
    var element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块

    //监听导航点击
    element.on('nav(demo)', function (elem) {
        //console.log(elem)
        layer.msg(elem.text());
    });
});
layui.use('laydate', function () {
    var laydate = layui.laydate;
    laydate.render({
        elem: '#test-n1',
        position: 'static'
    });
})