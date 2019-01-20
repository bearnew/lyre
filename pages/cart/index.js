import store from '../../store'
import create from '../../utils/create'
import Storage from '../../utils/storage';
import api from '../../utils/api';
import storageKey from '../../constant/storageKey';
import { computed } from '../../utils/vuefy';
const { CART_LIST } = storageKey;

create(store, {
	data: {
		cartsList: [],
		selectedAll: false,
		totalPrice: 0,
		noResult: true,
		customerInfo: {}
	},
	onLoad: function() {
		// computed(this, {
		// 	totalPrice: function() {
		// 	  const totalPrice = this.data.cartsList.reduce((acc, item) => {
		// 		if (item.isSelected) {
		// 			acc += item.price * item.count;
		// 		}
		// 		return acc;
		// 	  }, 0)
		// 	  return totalPrice.toFixed(2);
		// 	}
		// })
	},
	onUnload: function() {
		const cartStore = Storage.getInstance(CART_LIST);
		cartStore.set(this.store.data.cartsList);
	},
	onShow: function() {
		this.setSelectAll();
		this.calculate();
	},
	// 页面显示时，判断是否应该选中所有购物车商品
	setSelectAll: function() {
		const { cartsList } = this.store.data;

		if (cartsList.length === 0) {
			this.setData({
				selectedAll: false,
				noResult: true
			});
			return;
		}

		if (cartsList.some(item => item.isSelected === false)) {
			this.setData({
				selectedAll: false
			});
			return;
		}

		this.setData({
			selectedAll: true,
			noResult: false
		})
	},
	// 选中/取消选中购物车商品
	selectGood: function(event) {
		const id = event.currentTarget.dataset.id;
		this.data.cartsList.map(item => {
			if (item.id === id) {
				item.isSelected = !item.isSelected;
				return;
			}
		});
		this.setSelectAll();
		this.calculate();
	},
	// 删除购物车商品
	removeGood: function(event) {
		const id = event.currentTarget.dataset.id;
		const { cartsList } = this.data;

		wx.showModal({
			title: '提示',
			content: '确定删除吗',
			success: (res) => {
				if (res.confirm) {
					this.requestRemoveGood(id);
					cartsList.splice(cartsList.findIndex(item => item.id === id), 1);
					this.update();
					(new Storage(CART_LIST)).set(cartsList)
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			},
			fail(res) {
				wx.showToast({ title: '删除失败' })
			}
		})
	},
	requestRemoveGood: function(id) {
		api.post('/tapi/v1/shoppingCart/batchDel', {
			ids: id.toString()
		}).then(res => {
			if (res.respCode !== 0) {
				wx.showToast({
					icon: 'none',
					title: res.respMsg,
					duration: 2000
				})
			}
		})
	},
	// 减少购物车商品数量
	reduce: function(event) {
		const id = event.currentTarget.dataset.id;
		this.requestReduce(id);
		this.data.cartsList.map(item => {
			if (item.id === event.currentTarget.dataset.id && item.count !== 1) {
				item.count --;
				return;
			}
		})
		this.calculate();
	},
	requestReduce: function(id) {
		api.post('/tapi/v1/shoppingCart/decrease', {
			ids: id.toString(),
			sum: 1 // 减少数量
		}).then(res => {
			if (res.respCode !== 0) {
				wx.showToast({
					icon: 'none',
					title: res.respMsg,
					duration: 2000
				})
			}
		})
	},
	// 增加购物车商品数量
	increase: function(event) {
		const id = event.currentTarget.dataset.id;
		this.requestIncrease(id);
		this.data.cartsList.map((item, index) => {
			if (item.id === id) {
				item.count ++;
				return;
			}
		})
		this.calculate();
	},
	requestIncrease: function(id) {
		api.post('/tapi/v1/shoppingCart/add', {
			ids: id.toString(),
			sum: 1 // 增加数量
		}).then(res => {
			if (res.respCode !== 0) {
				wx.showToast({
					icon: 'none',
					title: res.respMsg,
					duration: 2000
				})
			}
		})
	},
	// 选中所有商品
	selectAll: function() {
		this.setData({
			selectedAll: !this.data.selectedAll
		})
		this.store.data.cartsList.map(item => {
			item.isSelected = this.data.selectedAll;
		})
		this.calculate();
	},
	// 计算总价
	calculate: function() {
		const totalPrice = this.data.cartsList.reduce((total, item) => {
			if (item.isSelected) {
				return total += item.resucedPrice * Number(item.count);
			}
			return total;
		}, 0);
		this.setData({
			totalPrice: totalPrice.toFixed(2)
		})
		this.update();
	},
	// 结算
	createOrder: function() {
		const {
			id,
			openId,
			regionId
		} = this.data.customerInfo;

		wx.navigateTo({
			url: '/pages/cart/pay/index' // 生成订单，跳转到支付页
		})

		const pids = this.data.cartsList.reduce((ids, item) => {
			if (item.isSelected) {
				ids.push(item.id);
			}
			return ids;
		}, []);

		api.post('/tapi/v1/orderInfo/add', {
			cid: id,
			openId,
			regionId,
			pids: pids.join(',')
		}).then(res => {
			if (res.respCode === 0) {
				wx.navigateTo({
					url: '/pages/cart/pay/index' // 生成订单，跳转到支付页
				})
			} else {
				wx.showToast({
					icon: 'none',
					title: res.respMsg,
					duration: 2000
				})
			}
		}).catch(err => {
			console.error(err);
		})
	}
})