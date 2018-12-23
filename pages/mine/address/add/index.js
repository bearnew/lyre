//index.js
import store from '../../../../store'
import create from '../../../../utils/create'
import Storage from '../../../../utils/storage';
import storageKey from '../../../../constant/storageKey';
const { ADDRESS_LIST } = storageKey;

create(store, {
	data: {
        addressList: [],
        citys: ['成都市', '乐山市', '德阳市', '宜宾市'],
        cityIndex: 0,
        area: '光明城市',
        address: {}
	},
	onLoad: function (option) {
        if (option.id) {
            console.log(option.id)
            console.log(this.data.addressList)
            const address = this.data.addressList.find(item => item.id === Number(option.id));
            console.log(address)
            this.setData({
                address
            })
        }
        if (option.name) {
            this.setData({
                area: option.name
            })
        }
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
        const formData = e.detail.value;
        
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
        this.setStore(formData);        
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
        const { addressList } = this.data;

        const len = addressList.length;
        if (len !== 0) {
            id = this.data.addressList[len - 1].id + 1;   
        }
        addressList.push({
            ...formData,
            id
        })

        const addressStore = Storage.getInstance(ADDRESS_LIST, false);
        addressStore.set(addressList).then(res => {
            wx.navigateTo({
                url: '/pages/mine/address/index'
            })
        });
    }
})