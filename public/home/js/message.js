
axios.interceptors.response.use(res => {
    return res.data
})
axios.defaults.baseURL = 'http://localhost/api/';
var vm = new Vue({
    el: '#app',
    data: {
        group: [],
        messages:[]
    },
    created: function () {
        this.getGroup()
        this.getMessages()
    },
    methods: {
        async getGroup() {
            let res = await axios.get('/group');
            this.group = res.data
        },
        async getMessages(){
            let res=await axios.get('/messages/list')
            this.messages=res.data;
        }
    },
    filters: {
        dateFormat(time) {
            var date = new Date(time);
            var year = date.getFullYear();
            var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            var hour=date.getHours();
            var minute=date.getMinutes()
            var second=date.getSeconds()
            return year + "-" + month + "-" + day+' '+hour+':'+minute+':'+second;
        },
    }
})
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
    let res = await axios.post('/messages', data);
    if (res.meta.status != 200) layer.msg('评论失败', {
        time: 1000
    })
    else {
        layer.msg('评论成功', {
            time: 1000
        })
        vm.getMessages()
    }
    return false;
}
async function handleSubmit(e) {
   
    var cid = $(e.target).data('cid')
    var id = $(e.target).data('id')
    var form = $('#form' + id.slice(3))
    var data = serializeToJson(form);
    data.cid = cid
    let res = await axios.post('/messages', data);
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
        vm.getMessages()
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