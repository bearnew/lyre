//index.js
import store from '../../../store'
import create from '../../../utils/create'
import Storage from '../../../utils/storage';
import storageKey from '../../../constant/storageKey';
const { ADDRESS_LIST } = storageKey;
//获取应用实例
const app = getApp()

create(store, {
	data: {
		addressList: [],
		selectedId: 1
	},
	onLoad: function () {
		console.log(this)
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
		const id = event.currentTarget.dataset.id;
		this.setData({
			selectedId: id
		})
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
					(new Storage(ADDRESS_LIST)).set(addressList)
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
