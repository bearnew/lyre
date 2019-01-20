//index.js
import store from '../../store';
import create from '../../utils/create';
import api from '../../utils/api';
import QQMapWX from '../../assets/js/qqmap/qqmap-wx-jssdk.min.js';
//获取应用实例
const app = getApp()

create(store, {
	data: {
		goodsList: [],
		customerInfo: {},
		activeIndex: 0, // 0-正在抢购， 1-下期预告
	},
	onLoad: function () {
		this.getRegion().then(res => {
			this.login(res.data[0].id);
			this.getGoodsList(res.data[0].id);
		});
	},
	// 获取位置信息
	getRegion: function() {
		return this.getLocation().then(res => {
			return {
				latitude: res.latitude,
				longitude: res.longitude
			}
		}).then(res => {
			return this.getCityString(res.latitude, res.longitude)
		}).then(res => {
			return this.getCityId(res.address_component.city);
		}).catch(err => {
			console.error(err);
		});
	},
	// 获取经度纬度
	getLocation: function() {
		return new Promise((resolve, reject) => {
			wx.getLocation({
				type: 'wgs84',
				success(res) {
					resolve(res);
				},
				fail(res) {
					reject(res);
				}
			})
		})
	},
	// 根据经度，纬度获取城市
	getCityString: function(latitude, longitude) {
		// https://lbs.qq.com/console/setting.html?key=SFSBZ-XN4KO-CCHWS-SN7GW-BNCPS-CPFSH
		const qqmapsdk = new QQMapWX({
			key: 'SFSBZ-XN4KO-CCHWS-SN7GW-BNCPS-CPFSH' // 腾讯map 个人账户key
		});
		return new Promise((resolve, reject) => {
			qqmapsdk.reverseGeocoder({
				location: {
					latitude,
					longitude
				},
				success: function(res) {
					resolve(res.result);
				},
				fail: function(res) {
					reject(res);
				}
			});

		})
	},
	// 根据城市，获取城市id
	getCityId: function(cityString) {
		return api.post('/tapi/v1/region/findData', {
			// regionName: cityString
			regionName: '成都市'
		}).then(res => {
			return Promise.resolve(res);
		}).catch(err => {
			console.error(err);
		})
	},

	login: function(regionId) {
		// 登录
		wx.login({
			success: res => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				api.post('/tapi/v1/customerInfo/login', {
					jsCode: res.code,
					regionId
				}).then(res => {
					this.store.data.customerInfo = {
						id: res.data.id,
						customerNumber: res.data.customerNumber,
						regionId: res.data.regionId,
						openId: res.data.openId
					}
					this.update();
				}).catch(err => {
					console.error(err);
				})
			}
		})
	},
	// 获取商品列表
	getGoodsList: function(regionId) {
		api.post('/tapi/v1/productInfo/findPageData', {
			pageNum: 0,
		 	pageSize: 20,
			regionId
		}).then(res => {
			if (res.respCode === 0) {
				this.setData({
					goodsList: res.data.lists
				})
				this.update();
			}
		}).catch(err => {
			console.error(err);
		})

		// 商品列表
		// const data = {
		// 	title: "【福利补贴款】椒香牛肉香辣味400g",
		// 	content: "精选黄牛前腿里脊肉，一口嚼不烂，有嚼劲，味道巴适",
		// 	salesNumber: 332,
		// 	price: 10.9,
		// 	originPrice: 25,
		// 	img: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543159665095&di=858eee477f624d032d9ea7cbc374b8d1&imgtype=0&src=http%3A%2F%2Fwww.cqbahuo.com%2Fuploads%2Fallimg%2F171130%2F1-1G130104H1514.jpg"
		// }
		// const list = []

		// for (let i = 10; i > 0; i--) {
		// 	const item = {
		// 		id: i,
		// 		...data
		// 	}
		// 	list.push(item);
		// }
		// this.setData({
		// 	goodsList: list
		// })
	},
	// 切换到下期预告
	switchTab: function(e) {
		this.setData({
			activeIndex: e.detail
		})
	}
})
