Component({
    data: {
        
    },
    properties: {
		tabs: Array
    },
    methods: {
        onTabClick: function(e) {
            this.triggerEvent('changeTab', { id: e.target.dataset.id })
        }
    }
})