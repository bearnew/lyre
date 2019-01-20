//index.js
import store from '../../../../store'
import create from '../../../../utils/create'
import Storage from '../../../../utils/storage';
import storageKey from '../../../../constant/storageKey';
import api from '../../../../utils/api';
const { ADDRESS_LIST } = storageKey;

const app = getApp()

create(store, {
	data: {
        addressList: [],
        citys: ['成都市', '乐山市', '德阳市', '宜宾市'],
        cityIndex: 0,
        area: '光明城市',
        address: {},
        userInfo: {},
        customerInfo: {}
	},
	onLoad: function (option) {
        if (option.id) {
            const address = this.data.addressList.find(item => item.id === Number(option.id));
            this.setData({
                address
            })
        }
        if (option.name) {
            this.setData({
                area: option.name
            })
        }
        if (option.from) {
            this.setData({
                from: option.from
            })
        }
        this.setData({
            userInfo: app.globalData.userInfo
        })
    },
    handleCityChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            cityIndex: e.detail.value
        })
    },
    handleAreaChange: function() {
        wx.navigateTo({
			url: '/pages/mine/address/areas/index'
		})
    },
    formSubmit(e) {
        console.log('form发生了submit事件，携带数据为：', e.detail)
        console.log('11111', this.data)
        const formData = e.detail.value;

        // 根据城市index获取城市
        formData.city = this.data.citys[formData.city];
        
        if (formData.area === '') {
            this.showMessage('请选择收货小区')
            return;
        }
        if (formData.address === '') {
            this.showMessage('请输入联系人详细地址')
            return;
        }
        if (formData.user === '') {
            this.showMessage('请输入联系人姓名')
            return;
        }
        if (formData.phone === '') {
            this.showMessage('请输入联系人电话')
            return;
        }
        this.updateUserInfo(formData).then(res => {
            if (res.respCode === 0) {
                this.setStore(formData);
                console.log(this.data.from)

            }
        });
    },
    showMessage(msg) {
        wx.showToast({
            title: msg,
            icon: 'none',
            duration: 2000
        })
    },
    setStore(formData) {
        let id = 1;
        let isDefault = true; // 默认地址信息

        const { addressList } = this.data;
        const len = addressList.length;

        if (len !== 0) {
            id = this.data.addressList[len - 1].id + 1;
            isDefault = false
        }
        addressList.push({
            id,
            ...formData,
            isDefault
        })

        const addressStore = Storage.getInstance(ADDRESS_LIST, true);
        addressStore.set(addressList);
        if (this.data.from === 'pay') {
            wx.navigateTo({
                url: `/pages/cart/pay/index?id=${id}`
            })
        } else {
            wx.navigateTo({
                url: '../index'
            })
        }
    },
    updateUserInfo(formData) {
        const {
            userInfo,
            customerInfo
        } = this.data;
        return api.post('/tapi/v1/customerInfo/update', {
            id: customerInfo.id,
            nickName: userInfo.nickName,
            headImg: userInfo.avatarUrl,
            regionId: customerInfo.regionId,
            address: formData.address,
            contact: formData.name,
            phone: formData.phone
		}).then(res => {
			return res;
		}).catch(err => {
			console.error(err);
		})
    }
})