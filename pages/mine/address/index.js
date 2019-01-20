//index.js
import store from '../../../store'
import create from '../../../utils/create'
import Storage from '../../../utils/storage';
import storageKey from '../../../constant/storageKey';
const { ADDRESS_LIST } = storageKey;
//获取应用实例
const app = getApp()
const addressStore = Storage.getInstance(ADDRESS_LIST);

create(store, {
	data: {
		addressList: []
	},
	onLoad: function (option) {
		if (option.from) {
			this.setData({
				from: option.from
			})
		}
		console.log('1231231', addressStore.get())
		this.setData({
			addressList: addressStore.get()
		})
	},
    changeTab: function(e) {
        this.changeTabId(e.detail.id)
	},
	addAddress: function() {
		wx.navigateTo({
			url: 'add/index?id=0'
		})
	},
	defaultSelect: function(event) {
		event.stopPropagation();
		const id = event.currentTarget.dataset.id;
		this.data.addressList.map(item => {
			item.isDefault = false;
			if (item.id === id) {
				item.isDefault = true;
			}
		})
		this.update();
		addressStore.set(this.data.addressList);
	},
	selectAddressToPay: function(event) {
		if (this.data.from === 'pay') {
			const id = event.currentTarget.dataset.id;
			wx.navigateTo({
				url: `/pages/cart/pay/index?id=${id}`
			})
		}
	},
	edit: function(event) {
		const id = event.currentTarget.dataset.id;
		wx.navigateTo({
			url: `/pages/mine/address/add/index?id=${id}`
		})
	},
	delete: function(event) {
		const id = event.currentTarget.dataset.id;
		const { addressList } = this.data;

		wx.showModal({
			title: '提示',
			content: '确定删除该收获地址吗',
			success: (res) => {
				if (res.confirm) {
					addressList.splice(addressList.findIndex(item => item.id === id), 1);
					this.setData({
						addressList
					})
					this.update();
					addressStore.set(addressList)
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			},
			fail(res) {
				wx.showToast({ title: '删除失败' })
			}
		})
	}
})
