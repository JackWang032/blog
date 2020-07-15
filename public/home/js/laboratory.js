Vue.filter('dateFormat', function (date) {
    let time = new Date(date)
    let year = time.getFullYear();
    let month = time.getMonth() + 1
    let day = time.getDate()
    return year + '-' + month + '-' + day
  })
  var vm = new Vue({
    el: '#app',
    data: {
      queryInfo: {
        pagesize: 16,
        pagenum: 1
      },
      projects: []
    },
    created() {
      this.getprojects()
    },
    methods: {
      async getprojects() {
        let result = await axios.get('laboratory', {
          params: this.queryInfo
        })
        this.projects = result.data.projects
      }
    }
  })