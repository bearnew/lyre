//index.js
import store from '../../../../store'
import create from '../../../../utils/create'

create(store, {
	data: {
        areas: [{
            id: 1,
            name: '光明城市',
            address: '成都市天府新区华府大道996号'
        }, {
            id: 2,
            name: '天府软件园',
            address: '成都市高新区天府三街'
        }, {
            id: 3,
            name: '世纪城',
            address: '成都市高新区天府一街'
        }, {
            id: 4,
            name: '金融城',
            address: '成都市高新区地铁1号线金融城'
        }, {
            id: 5,
            name: '长城馨苑',
            address: '成都市高新区华府大道地铁口'
        }],
        areaResults: []
	},
	onLoad: function () {
        this.setData({
            areaResults: this.data.areas
        })
    },
    inputChange: function (e) {
        const inputValue = e.detail.value;
        const areaResults = [];
        this.data.areas.map(item => {
            if (item.name.indexOf(inputValue) !== -1) {
                areaResults.push(item);
            }
        })
        this.setData({
            areaResults
        })
    },
    selectArea: function(e) {
        wx.navigateTo({
			url: `/pages/mine/address/add/index?name=${e.currentTarget.dataset.name}`
		})
    }
})