axios.interceptors.response.use(res => {
    return res.data
})
var vm = new Vue({
    el: '#app',
    data: {
        articles: [],
        isend: false,
        page: 1,
        islast: false
    },
    mounted: function () {
        this.queryData(this.page);
        let that = this;
        window.onscroll =  function () {
            let screenH = Math.ceil(window.innerHeight + window.scrollY); // 屏幕高度+滚动高度	
            let eleH = document.documentElement.offsetHeight;
            if (eleH == screenH && !that.isend && !that.islast) {
                that.isend = true;    
                setTimeout(async() => {
                    that.isend = false;
                    that.page++;
                    await that.queryData(that.page);
                }, 300);
                
            } 

        }
    },
    methods: {
        queryData: function (page) {
            axios.get('/home/api/article/' + page).then(data => {
                let that = this;
                if (data.length != 0)
                    data.forEach(item => {
                        that.articles.push(item)
                    });
                else
                    that.islast = true;
            })

        }
    }
}) 
$('.login_bt').hover(function () {
    $('.login_bt').css('background-color', 'rgb(255,121,0)');
    $('.home_bt').css('background-color', 'rgb(62, 67, 76)');
}, function () {
    $('.login_bt').css('background-color', 'rgb(62, 67, 76)');
    $('.home_bt').css('background-color', 'rgb(255,121,0)');
})
var onScrolling = false;
var rbHeight = $('.rightbox-main').innerHeight();
function getElementToPageTop(el) {
if(el.parentElement) {
return this.getElementToPageTop(el.parentElement) + el.offsetTop
}
return el.offsetTop
}
var orginalTopR=getElementToPageTop($('.hotAtl').get(0))-140;
var orginalTopL=getElementToPageTop($('.datetime').get(0))-140;
$(document).scroll(function () {
    var scroH = $(document).scrollTop();
    var elementTopR=getElementToPageTop($('.hotAtl').get(0))-140;
    var elementTopL=getElementToPageTop($('.datetime').get(0))-140;
    if (scroH >= elementTopR&&scroH>=orginalTopR)
         $('.hotAtl').css('position', 'fixed')
     else
        $('.hotAtl').css('position', 'unset');
    if (scroH >= elementTopL&&scroH>=orginalTopL)
         $('.datetime').css('position', 'fixed')
     else
        $('.datetime').css('position', 'unset');
    


    if (scroH > 1000 ) {
        $('.back-line').css('height', '783px');
        $('.backArrow').css('height', '72px');
    }
    else {
        $('.back-line').css('height', '0px');
        $('.backArrow').css('height', '0px');
    }
})
$('.backArrow').click(function () {
    onScrolling = true;
    $('html,body').animate({
        scrollTop: 0
    }, 600);
    $('.backArrow').animate({
        height: 0
    }, 1200);
    $('.back-line').animate({
        height: 0
    }, 400, function () {
        onScrolling = false;
    });
})
$(window).resize(function () {
    var offsetLeft = $('.main').offset().left;
    var width = $('.main').innerWidth();
    $('.backTop').offset({
        left: offsetLeft + width
    })

})

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