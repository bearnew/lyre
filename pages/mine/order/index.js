//index.js
import store from '../../../store'
import create from '../../../utils/create'
//获取应用实例
const app = getApp()

create(store, {
	data: {
		tabs: [
            {
                id: 0,
                text: '全部',
                isSelected: true
            },
            {
                id: 1,
                text: '待付款',
                isSelected: false
            },
            {
                id: 2,
                text: '待发货',
                isSelected: false
            },
            {
                id: 3,
                text: '配送中',
                isSelected: false
            },
            {
                id: 4,
                text: '交易成功',
                isSelected: false
            },
            {
                id: 5,
                text: '退货/退款',
                isSelected: false
            }
        ]
	},
	onLoad: function (option) {
        console.log(option)
        this.changeTabId(Number(option.id));
	},
    changeTab: function(e) {
        this.changeTabId(e.detail.id)
    },
    changeTabId: function(id) {
        this.data.tabs.map(item => {
            if (item.id === id) {
                item.isSelected = true;
            } else {
                item.isSelected = false;
            }
        })
        this.setData({
            tabs: this.data.tabs
        })
    }
})
