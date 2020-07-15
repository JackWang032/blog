Vue.filter('dateFormat', function (date) {
    let time = new Date(date)
    let year = time.getFullYear();
    let month = time.getMonth() + 1
    let day = time.getDay()
    return year + '-' + month + '-' + day
  })
  var vm = new Vue({
    el: '#app',
    data: {
      queryInfo: {
        pagesize: 8,
        pagenum: 1,
        cgid: ''
      },
      articleList: [],
      firstList: [],
      lastList: [],
      selectedLi: 1,
      categoryInfo: {},
      categoryList: [],
      totalpage: 1,
      total: 0,
      dataLoading: false,
      scrolling: false
    },
    created() {
      //this.getQueryString()
      this.getArticleList()
      this.getCategoryInfo()
      this.getCategoryList()
    },
    mounted() {
      this.$nextTick(() => {
        $('.screens .page-item').css('width', document.body.clientWidth)
        $(window).resize(function(){
          $('.screens .page-item').css('width', document.body.clientWidth)
          $('.screens').css('left', -document.body.clientWidth + 'px')
        })
      })
    },
    methods: {
      async getArticleList() {
        let result = await axios.get('articles', {
          params: this.queryInfo
        })
        this.articleList = result.data.articles
        this.totalpage = result.data.totalpage
        this.total = result.data.total
      },
      async getCategoryInfo() {
        let result = await axios.get('categories/' + this.queryInfo.cgid)
        this.categoryInfo = result.data
      },
      async getCategoryList() {
        let result = await axios.get('categories/list')
        this.categoryList = result.data
      },
      async handleTabChange(e) {
        let result = null
        if (this.scrolling || this.dataLoading) return
        let index = parseInt(e.target.dataset.index)
        if (index == this.selectedLi) return
        if (index != 1)
          this.queryInfo.cgid = this.categoryList[index - 2].cgid
        else
          this.queryInfo.cgid = ''
        this.queryInfo.pagenum = 1
        this.getCategoryInfo()
        this.dataLoading = true
        if (this.selectedLi > index) {
          this.selectedLi = index
          this.slidescreen(-1)
          result = await axios.get('articles', {
            params: this.queryInfo
          })
          this.$nextTick(() => {
            this.dataLoading = false
          })
          this.firstList = result.data.articles
          this.totalpage = result.data.totalpage
          this.total = result.data.total
        } else if (this.selectedLi < index) {
          this.selectedLi = index
          this.slidescreen(1)
          result = await axios.get('articles', {
            params: this.queryInfo
          })
          this.$nextTick(() => {
            this.dataLoading = false
          })
          this.lastList = result.data.articles
          this.totalpage = result.data.totalpage
          this.total = result.data.total
        }
        setTimeout(() => {
          this.$nextTick(() => {
            $('.screens').css('left', -document.body.clientWidth + 'px')
          })
          this.lastList = []
          this.firstList = []
          this.articleList = result.data.articles
        }, 500);

      },
      slidescreen(direction) {
        $('.screens').css('transition', 'left .4s ease-in-out')
        this.scrolling = true
        setTimeout(() => {
          if (direction == 1)
            $('.screens').css('left', -document.body.clientWidth * 2 + 'px')
          else
            $('.screens').css('left', 0)
        }, 100);
        setTimeout(() => {
          this.scrolling = false
          $('.screens').css('transition', 'none')
        }, 500);
      },
      getQueryString() {
        var reg = new RegExp("(^|&)" + 'cgid' + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
          this.queryInfo.cgid = unescape(r[2]);
        }
      },
      prevPage() {
        if (this.queryInfo.pagenum - 1 >= 1) {
          this.queryInfo.pagenum--;
          this.getArticleList()
        }
      },
      nextPage() {
        if (this.queryInfo.pagenum + 1 <= this.totalpage) {
          this.queryInfo.pagenum++;
          this.getArticleList()
        }
      },
      changePage(page) {
        this.queryInfo.pagenum = page;
        this.getArticleList()
      }
    }
  })