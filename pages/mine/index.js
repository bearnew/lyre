//index.js
import store from '../../store'
import create from '../../utils/create'
//获取应用实例
const app = getApp()

create(store, {
	data: {
		userInfo: {},
		orderTabs: [
			{
				id: 1,
				icon: 'icon-weibiaoti2fuzhi04',
				text: '待付款'
			},
			{
				id: 2,
				icon: 'icon-daifahuo',
				text: '待发货'
			},
			{
				id: 3,
				icon: 'icon-icon3',
				text: '配送中'
			},
			{
				id: 4,
				icon: 'icon-jiaoyichenggong',
				text: '交易成功'
			},
			{
				id: 5,
				icon: 'icon-tuihuo',
				text: '退货/退款'
			}
		]
	},
	onLoad: function () {
		this.setData({
            userInfo: app.globalData.userInfo
        })
	},
	gotoOrder: function(e) {
		console.log(e)
		wx.navigateTo({
			url: `order/index?id=${e.currentTarget.dataset.id}`
		})
	},
	gotoAddress: function(e) {
		wx.navigateTo({
			url: 'address/index'
		})
	}
})
