Component({
    data: {
        acitveIndex: 0
    },
    methods: {
        switchChange: function() {
            const acitveIndex = this.data.acitveIndex === 0 ? 1 : 0;
            this.setData({
                acitveIndex
            })
            this.triggerEvent('switchtab', acitveIndex)
        }
    }
  })