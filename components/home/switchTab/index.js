Component({
    data: {
        acitveIndex: 0
    },
    methods: {
        switchChange: function() {
            this.setData({
                acitveIndex: this.data.acitveIndex === 0 ? 1 : 0
            })
        }
    }
  })