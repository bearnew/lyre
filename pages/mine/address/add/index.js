//index.js
import store from '../../../../store'
import create from '../../../../utils/create'

create(store, {
	data: {
        citys: ['成都市', '乐山市', '德阳市', '宜宾市'],
        cityIndex: 0
	},
	onLoad: function () {
    },
    handleCityChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            cityIndex: e.detail.value
        })
    }
})