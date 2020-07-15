var vm = new Vue({
    el: '#app',
    data: {
        archiveList: {},
        categories: [],
    },
    created() {
        this.getArchiveList()
    },
    methods: {
        async getArchiveList() {
            let result = await axios.get('archive')
            this.archiveList = result.data
        },
    }
})