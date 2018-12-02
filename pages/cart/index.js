import store from '../../store'
import create from '../../utils/create'
import Storage from '../../utils/storage';
import storageKey from '../../constant/storageKey';
import { computed } from '../../utils/vuefy';
const { CART_LIST } = storageKey;

create(store, {
	data: {
		cartsList: [],
		selectedAll: false
	},
	onLoad: function() {
		computed(this, {
			totalPrice: function() {
			  return this.data.cartsList.reduce((acc, item) => {
				if (item.isSelected) {
					acc += item.price * item.count;
				}
				return acc;
			  }, 0)
			}
		})
	},
	onUnload: function() {
		const cartStore = Storage.getInstance(CART_LIST);
		cartStore.set(this.store.data.cartsList);
	},
	onShow: function() {
		this.setSelectAll();
	},
	// 页面显示时，判断是否应该选中所有购物车商品
	setSelectAll: function() {
		const { cartsList } = this.store.data;
		console.log(cartsList)

		if (cartsList.length === 0) {
			this.setData({
				selectedAll: false
			});
			return;
		}

		console.log(cartsList)
		if (cartsList.some(item => item.isSelected === false)) {
			this.setData({
				selectedAll: false
			});
			return;
		}

		this.setData({
			selectedAll: true
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
		this.update();
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
					cartsList.splice(cartsList.findIndex(item => item.id === id), 1);
					this.update();
					(new Storage(CART_LIST)).remove()
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			},
			fail(res) {
				wx.showToast({ title: '删除失败' })
			}
		})
	},
	// 减少购物车商品数量
	reduce: function(event) {
		this.data.cartsList.map(item => {
			if (item.id === event.currentTarget.dataset.id) {
				item.count --;
				return;
			}
		})
		this.update();
	},
	// 增加购物车商品数量
	increase: function(event) {
		this.data.cartsList.map(item => {
			if (item.id === event.currentTarget.dataset.id) {
				item.count ++;
				return;
			}
		})
		this.update();
	},
	// 选中所有商品
	selectAll: function() {
		this.setData({
			selectedAll: !this.data.selectedAll
		})
		this.store.data.cartsList.map(item => {
			item.isSelected = this.data.selectedAll;
		})
		this.update();
	}
})