//index.js
import store from '../../../store'
import create from '../../../utils/create'
//获取应用实例
const app = getApp()

create(store, {
	data: {

	},
	onLoad: function () {
	},
    changeTab: function(e) {
        this.changeTabId(e.detail.id)
    },
})
