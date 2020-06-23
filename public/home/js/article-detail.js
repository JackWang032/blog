axios.interceptors.response.use(res => {
    return res.data
})
axios.defaults.baseURL = 'http://localhost/api/';
var vm = new Vue({
    el: '#app',
    data: {
        categories: [],
        aid: '',
        group: [],
        comments: [],
        articleInfo: {},
        openCmt: true,
        total: 0
    },
    created: function () {
        this.getUrlParam()
        this.getCategories();
        this.getGroup()
        this.getArticle()
        this.getComments()

    },
    watch: {
        comments: function () {
            var that = this;
            that.$nextTick(function () {
                document.title = that.articleInfo.title
            })
        }
    },
    methods: {
        getUrlParam() {
            var reg = new RegExp("(^|&)" + 'aid' + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            this.aid = unescape(r[2]);
        },
        async getCategories() {
            let res = await axios.get('/categories');
            this.categories = res.data
        },
        async getGroup() {
            let res = await axios.get('/group');
            this.group = res.data
        },
        async getArticle() {
            let res = await axios.get('/articles/' + this.aid)
            this.articleInfo = res.data
        },
        async getComments() {
            let res = await axios.get('/comments/' + this.aid)
            this.comments = res.data.comments;
            this.total = res.data.total
        }
    },
    filters: {
        dateFormat(time) {
            var date = new Date(time);
            var year = date.getFullYear();
            var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes()
            var second = date.getSeconds()
            return year + "-" + month + "-" + day + ' ' + hour + ':' + minute + ':' + second;
        },
    }
})

window.onload = function () {
    //代码块主题
    var allpre = document.getElementsByTagName("pre");
    for (i = 0; i < allpre.length; i++) {
        var onepre = document.getElementsByTagName("pre")[i];
        var mycode = document.getElementsByTagName("pre")[i].innerHTML;
        onepre.innerHTML = '<code id="mycode" >' + mycode + '</code>';
    }
    hljs.initHighlighting();
    //$('title').html(vm.articleInfo&&vm.articleInfo.title + ' · JackWang Blog- 个人博客~')
    //检测评论是否开启
    var openCmt = JSON.parse(localStorage.getItem('setting')).openCmt;
    vm.openCmt = openCmt == 1 ? true : false

}
//表单数组转换为Json对象
function serializeToJson(form) {
    var arr = form.serializeArray(); //获取表单内容数组
    var result = {};
    arr.forEach(element => {
        result[element.name] = element.value;
    });
    return result;
}
async function handleSubmitMain() {
    var form = $('#form_main');
    var data = serializeToJson(form);
    let res = await axios.post('/comments/' + vm.articleInfo._id, data);
    if (res.meta.status != 200) layer.msg('评论失败', {
        time: 1000
    })
    else {
        layer.msg('评论成功', {
            time: 1000
        })
        vm.getComments()
    }
    return false;
}
async function handleSubmit(e) {
   
    var cid = $(e.target).data('cid')
    var id = $(e.target).data('id')
    var form = $('#form' + id.slice(3))
    var data = serializeToJson(form);
    data.cid = cid
    let res = await axios.post('/comments/' + vm.articleInfo._id, data);
    var formBox = form.parent()
    formBox.css('display', 'none')
    var reply = formBox.siblings()
    reply.text('回复')
    if (res.meta.status != 200) layer.msg('评论失败' + res.meta.msg, {
        time: 1000
    })
    else {
        layer.msg('评论成功', {
            time: 1000
        })
        vm.getComments()
    }
    return false
}

function extendBox(e) {
    var addcmtEle = $(e.target).nextAll('.addComment-reply') || $(e.target).parent().nextAll(
        '.addComment-reply');
    if (e.target.innerText == '回复') {
        $(e.target).text('收齐回复');
        addcmtEle.css('display', 'block')
    } else {
        $(e.target).text('回复');
        addcmtEle.css('display', 'none')
    }
}
var timeout = null;
function handleInput(e) {
    var qqBox = $(e.target)
    var nicknameBox = qqBox.nextAll()
    var qq = qqBox.val()
    
    clearTimeout(timeout)
    if (qq.length >= 6) {
        timeout = setTimeout(function () {
            axios.get('/qqapi/' + qq).then(data => {
                nicknameBox.val(data.data.name)
            })    
        }, 1000)
    }
    else{
        nicknameBox.val("")
    }

}