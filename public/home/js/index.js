axios.interceptors.response.use(res => {
    return res.data
})
axios.defaults.baseURL = 'http://localhost/api/';
var vm = new Vue({
    el: '#app',
    data: {
        hotArticles: [],
        categories: [],
        articleQuery: {
            pagesize: 5,
            pagenum: 1
        },
        group: [],
        articles: [],
        bloginfo: {},
        comments: [],
        hotAtl: [],
        totalpage: 0,
        isend: false,
        islast: false
    },
    created: function () {
        this.handleScroll();
        this.getCategories();
        this.getGroup()
        this.getBlogInfo()
        this.getComments()
        this.getHotArticles()
        this.getArticles()
    },
    methods: {
        async queryData() {
            let res = await axios.get('/articles', {
                params: this.articleQuery
            });
            if (res.meta.status!=200) {
                return
            }
            res.data.articles.forEach(item => {
                this.articles.push(item)
            });
        },
        async getCategories() {
            let res = await axios.get('/categories');
            this.categories = res.data
        },
        async getGroup() {
            let res = await axios.get('/group');
            this.group = res.data
        },
        async getBlogInfo() {
            let res = await axios.get('/bloginfo');
            this.bloginfo = res.data
        },
        async getComments() {
            let res = await axios.get('/comments/new');
            this.comments = res.data
        },
        async getHotArticles() {
            let res = await axios.get('/articles/hot');
            this.hotArticles = res.data
        },
        async getArticles() {
            let res = await axios.get('/articles', {
                params: this.articleQuery
            });
            this.articles = res.data.articles
            this.totalpage = res.data.totalpage
        },
        handleScroll() {
            let that = this;
            window.onscroll = function () {
                let screenH = Math.ceil(window.innerHeight + window.scrollY); // 屏幕高度+滚动高度	
                let eleH = document.documentElement.offsetHeight;
                if (eleH == screenH && !that.isend && !that.islast) {
                    that.isend = true;
                    setTimeout(async () => {
                        that.isend = false;
                        if (that.articleQuery.pagenum < that.totalpage) {
                            that.articleQuery.pagenum++;
                            await that.queryData();
                        }
                        else
                         that.islast=true;
                    }, 300);
                }
            }
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

