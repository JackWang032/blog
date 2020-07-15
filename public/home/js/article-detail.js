cmtTem = ` <div class="add-reply">
<form method="post">
    <textarea name="content" required v-model='form.content'  :placeholder="this.cid?'@'+this.default+': ':'你想说点啥？'" cols="30"
        rows="5"></textarea>
    <div class="input-userinfo">
        <input class="comment-input input-qq" type="text" @input="handleInput()"
            name="qq" placeholder="请输入QQ号 *" v-model='form.qq' required="">
        <input class="comment-input" type="text" name="nickname" placeholder="自动获取昵称"
        v-model='form.nickname' required="">
    </div>
    <input v-if="this.enabled" type="button" value="提交评论" class="com-submit-button son-submit"
        @click='sendComment' >
    <div v-else class="disabled-com com-submit-button son-submit"><i class="layui-icon">&#xe673;</i>已关闭评论</div>
</form>
</div>`
Vue.component('add-reply', {
    template: cmtTem,
    props: {
        aid: String,
        cid: String,
        default: String,
        enabled: {
            default: true,
            type: Boolean
        }
    },
    data() {
        return {
            form: {
                content: '',
                qq: '',
                nickname: ''
            },
            timer: null
        }
    },
    methods: {
        async sendComment() {
            if (this.cid)
                this.form.cid = this.cid
            if (!this.form.qq || !this.form.content || !this.form.nickname) {
                layer.msg('请输入必填项', {
                    time: 1000
                })
                return false
            }
            let res = await axios.post('comments/' + this.aid, this.form)
            if (res.meta.status != 200) layer.msg('评论失败，原因：' + res.meta.msg, {
                time: 1500
            })
            else {
                if (window.setting && window.setting.approvalCmt == 1)
                    layer.msg('已提交，等待审核', {
                        time: 1000
                    })
                else
                    layer.msg('评论成功', {
                        time: 1000
                    })
            }
            this.form.content = ""
            this.$emit('refreshdate')
        },
        async handleInput() {
            let that = this
            clearTimeout(this.timer)
            this.timer = setTimeout(async function () {
                let qqInfo = await axios.get('qqapi/' + that.form.qq)
                if (qqInfo.meta.status != 200 || !qqInfo.data.name) that.form.nickname =
                    '请输入正确的qq'
                else that.form.nickname = qqInfo.data.name
            }, 500)

        }
    }
})
Vue.filter('dateFormat', function (date) {
    let time = new Date(date)
    let year = time.getFullYear();
    let month = time.getMonth() + 1
    let day = time.getDate()
    let hour= time.getHours() 
    let mi= time.getMinutes() 
    let ss= time.getSeconds() 
    if(hour<10)hour='0'+hour
    if(mi<10)mi='0'+mi
    if(ss<10)ss='0'+ss
    return year + '-' + month + '-' + day + ' ' + hour+':'+mi+':'+ss
})
var vm = new Vue({
    el: '#app',
    data: {
        article: {},
        currentShow: -1,
        replyUserName: '',
        replycid: '',
        comments: [],
        commentCount: 0,
        aid: '',
        tags: [],
        public:true
    },
    created() {
        this.getQueryString()
        this.getArticle()
        this.getComments()
    },
    mounted() {},
    methods: {
        async getComments() {
            let result = await axios.get('comments/' + this.aid)
            this.comments = result.data.comments
            this.commentCount = result.data.total
        },
        async getArticle() {
            let result = await axios.get('articles/' + this.aid)
            this.article = result.data
            this.article.openCmt = this.article.openCmt && window.setting.openCmt
            document.title = result.data.title + "  " + window.setting.sitename
            this.tags = result.data.tags && result.data.tags.split(';')
            this.$nextTick(()=>{
                addCodeTag();
                hljs.initHighlighting();
            })
        },
        getQueryString() {
            var reg = new RegExp("(^|&)" + 'aid' + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                this.aid = unescape(r[2]);
            }
        },
        handleRefresh() {
            this.getComments();
            this.currentShow = -1;
            this.replyUserName = "";
            this.replycid = ""
        }
    }
})

function addCodeTag() {
    var allpre = document.getElementsByTagName("pre");
    for (i = 0; i < allpre.length; i++) {
        var onepre = document.getElementsByTagName("pre")[i];
        var mycode = document.getElementsByTagName("pre")[i].innerHTML;
        onepre.innerHTML = '<code id="mycode" >' + mycode + '</code>';
    }
}
