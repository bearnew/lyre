//index.js
import store from '../../store'
import create from '../../utils/create'
//获取应用实例
const app = getApp()

create(store, {
	data: {
		goodsList: []
	},
	onLoad: function () {
		this.getGoodsList();
		console.log(app)
	},
	ready: function() {
		console.log('index')
	},
	getGoodsList: function() {
		// 商品列表
		const data = {
			title: "【福利补贴款】椒香牛肉香辣味400g",
			content: "精选黄牛前腿里脊肉，一口嚼不烂，有嚼劲，味道巴适",
			salesNumber: 332,
			price: 10.9,
			originPrice: 25,
			img: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543159665095&di=858eee477f624d032d9ea7cbc374b8d1&imgtype=0&src=http%3A%2F%2Fwww.cqbahuo.com%2Fuploads%2Fallimg%2F171130%2F1-1G130104H1514.jpg"
		}
		const list = []

		for (let i = 10; i > 0; i--) {
			const item = {
				id: i,
				...data
			}
			list.push(item);
		}
		this.setData({
			goodsList: list
		})
	}
})
