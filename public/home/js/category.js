axios.interceptors.response.use(res => {
    return res.data
})
axios.defaults.baseURL = 'http://localhost/api/';
var vm = new Vue({
    el: '#app',
    data: {
        categories: [],
        articleQuery: {
            pagesize: 7,
            pagenum: 1,
            cgid:'1'
        },
        currCategory: {},
        group: [],
        articles: [],
        totalpage: 0,

    },
    created: function () {
        this.getUrlParam()
        this.getCategories();
        this.getCurrCategory();
        this.getGroup()
        this.getArticles()
    },
    methods: {
        getUrlParam() {
            var reg = new RegExp("(^|&)" + 'cgid' + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg); 
            this.articleQuery.cgid=unescape(r[2])
        },
        async getCategories() {
            let res = await axios.get('/categories');
            this.categories = res.data
        },
        async getGroup() {
            let res = await axios.get('/group');
            this.group = res.data
        },
        async getCurrCategory() {
            let res=await axios.get('/categories/'+this.articleQuery.cgid);
            this.currCategory=res.data
        },
        async getArticles() {
            let res = await axios.get('/articles', {
                params: this.articleQuery
            });
            this.articles = res.data.articles;
            this.totalpage = res.data.totalpage;
            if (this.articleQuery.pagenum < this.totalpage)
                this.articleQuery.pagenum++;
        }
    },
    filters: {
        dateFormat(time) {
            var date = new Date(time);
            var year = date.getFullYear();
            var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            return year + "-" + month + "-" + day;
        },
    }
})
window.onload=function(){
    $('title').html(vm.currCategory.cgname+' · JackWang Blog- 个人博客~')
}