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
    <input type="button" value="提交留言" class="com-submit-button son-submit"
        @click='sendComment' >
</form>
</div>`
Vue.component('add-reply', {
    template: cmtTem,
    props: {
        cid: String,
        default: String
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
            if (!this.form.qq || !this.form.content || !this.form.nickname || this.form.nickname == '请输入正确的qq') {
                layer.msg('请输入必填项', {
                    time: 1000
                })
                return false
            }
            let res = await axios.post('messages', this.form)
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
            this.form.content = ''
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
        currentShow: -1,
        replyUserName: '',
        replycid: '',
        messages: [],
    },
    created() {
        this.getMessages()
    },
    mounted() {},
    methods: {
        async getMessages() {
            let result = await axios.get('messages/list')
            this.messages = result.data
        },
        handleRefresh() {
            this.getMessages();
            this.currentShow = -1;
            this.replyUserName = ""
            this.replycid = ""
        }
    }
})