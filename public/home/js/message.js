
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
            let res=await axios.get('/message')
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
window.onload=function(){
    $('.reply').click(function (e) {
        let addcmtEle = $(e.target).nextAll('.addComment-reply') || $(e.target).parent().nextAll(
            '.addComment-reply');
        if (e.target.innerText == '回复') {
            $(e.target).text('收齐回复');
            addcmtEle.css('display', 'block')
        } else {
            $(e.target).text('回复');
            addcmtEle.css('display', 'none')
        }
    })
}