
axios.interceptors.response.use(res => {
    return res.data
})
axios.defaults.baseURL = 'http://localhost/api/';
var vm = new Vue({
    el: '#app',
    data: {
        group: []
    },
    created: function () {
        this.getGroup()
    },
    methods: {
        async getGroup() {
            let res = await axios.get('/group');
            this.group = res.data
        }
    }
})
