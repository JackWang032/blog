document.addEventListener('scroll', function () {
  var boxs = document.querySelectorAll('.article-box')
  for (var i = 0; i < boxs.length; i++) {
    //box距离浏览器底部距离
    var clientBottom = document.documentElement.clientHeight - boxs[i].getBoundingClientRect().top
    if (clientBottom >= 50) boxs[i].style.opacity = '1'
    else boxs[i].style.opacity = '0'
  }

  var asideBox = document.querySelector('.aside')
  if (asideBox.getBoundingClientRect().top <= 0) {
    asideBox.style.position = 'fixed'
    asideBox.style.top = "5px"
  }
  if (document.documentElement.scrollTop < 360) {
    asideBox.style.position = 'relative'
    asideBox.style.top = "0"
  }


  var scrollTop = document.documentElement.scrollTop
  var innerHeight = window.innerHeight
  var domHeight = document.body.scrollHeight
  if (domHeight <= scrollTop + innerHeight + 10) {
    if (!vm.isloading && vm.queryInfo.pagenum < vm.totalpage)
      vm.isloading = true
  }
})
Vue.filter('dateFormat', function (date) {
  let time = new Date(date)
  let year = time.getFullYear();
  let month = time.getMonth() + 1
  let day = time.getDate()
  return year + '年' + month + '月' + day + '日'
})
var vm = new Vue({
  el: '#app',
  data: {
    queryInfo: {
      pagesize: 5,
      pagenum: 1
    },
    articleList: [],
    blogInfo: {},
    hotArticles: [],
    comments: [],
    isloading: false,
    totalpage: 1
  },
  created() {
    this.getArticleList()
    this.getBlogInfo()
    this.gethotArticles()
    this.getComments()
  },
  watch: {
    isloading: function (load) {
      if (load == true) {
        let that = this
        setTimeout(() => {
          that.queryInfo.pagenum++
          that.getArticleList()
        }, 300);
      }
    }
  },
  methods: {
    async getArticleList() {
      if (this.queryInfo.pagenum > this.totalpage) {
        this.isloading = false
        return false
      }
      let result = await axios.get('articles', {
        params: this.queryInfo
      })
      this.totalpage = result.data.totalpage
      this.articleList = this.articleList.concat(result.data.articles)
      this.isloading = false

    },
    async getBlogInfo() {
      let result = await axios.get('bloginfo')
      this.blogInfo = result.data
    },
    async gethotArticles() {
      let result = await axios.get('articles/hot')
      this.hotArticles = result.data
    },
    async getComments() {
      let result = await axios.get('comments/new')
      let data = result.data
      //获取头像
      data.forEach(async item => {
        let res = await axios.get('https://api.uomg.com/api/qq.info?qq=' + item.qq)
        item.avatar = res.qlogo
      })
      this.comments = data
    },
    handlePageJump(id) {
      if(document.documentElement.clientWidth<=750)
        window.location.href='/article?aid='+id
    }
  }
})