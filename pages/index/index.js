//index.js
import store from '../../store';
import create from '../../utils/create';
import api from '../../utils/api';
import QQMapWX from '../../assets/js/qqmap/qqmap-wx-jssdk.min.js';
//获取应用实例
const app = getApp()

create(store, {
	data: {
		goodsList: []
	},
	onLoad: function () {
		this.getGoodsList();
		this.getRegion();
	},
	// 获取位置信息
	getRegion: function() {
		this.getLocation().then(res => {
			return {
				latitude: res.latitude,
				longitude: res.longitude
			}
		}).then(res => {
			return this.getCityString(res.latitude, res.longitude)
		}).then(res => {
			this.getCityId(res.address_component.city);
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
		api.post('/v1/region/findData', {
			regionName: cityString
		}).then(res => {
			console.log(res);
		}).catch(err => {
			console.error(err);
		})
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
