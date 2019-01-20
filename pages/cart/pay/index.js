import store from '../../../store'
import create from '../../../utils/create'
import Storage from '../../../utils/storage';
import storageKey from '../../../constant/storageKey';
const { ADDRESS_LIST } = storageKey;
import api from '../../../utils/api';

create(store, {
	data: {
        customerInfo: {},
        cartsList: [],
        addressList: [],
        totalPrice: 0,
        deliveryInfo: {}
	},
	onLoad: function(option) {
        this.getTotalPrice();
        this.getDefaultAddress(option.id);
    },
    // 计算总价
    getTotalPrice: function() {
        const totalPrice = this.data.cartsList.reduce((total, item) => {
            if (item.isSelected) {
                total += item.resucedPrice * item.count;
            }
            return total;
        }, 0);

        this.setData({
            totalPrice
        })
    },
    // 获取默认联系人信息
    getDefaultAddress: function(addAddressId) {
        let deliveryInfo = {};
        console.log(addAddressId)
        const addressList = Storage.getInstance(ADDRESS_LIST, true).get();
        if (addAddressId) {
            deliveryInfo = addressList.find(item => item.id === Number(addAddressId))
        } else {
            deliveryInfo = this.data.addressList.find(item => item.isDefault);
        }
        console.log(deliveryInfo)
        this.setData({
            deliveryInfo
        })
    },
    // 前往添加联系人信息
    addAddress: function() {
        wx.navigateTo({
			url: '/pages/mine/address/add/index?from=pay' // 前往
		})
    },
    // 改变收货人信息
    changeAddress: function() {
        console.log('9999')
        wx.navigateTo({
            url: '/pages/mine/address/index?from=pay' // 前往
        })
    },
    // 提交订单
    createOrder: function() {
        const { deliveryInfo } = this.data;
        if (deliveryInfo.name) {
            wx.showModal({
                title: '提示',
                content: '创单成功（微信支付功能开发中...）',
                showCancel: false
            })
        } else {
            wx.showToast({
                title: '请先添加联系人信息',
                icon: 'none',
                duration: 2000
            })
        }
    }
})
