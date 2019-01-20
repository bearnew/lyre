//index.js
import store from '../../../store';
import create from '../../../utils/create';
import api from '../../../utils/api';
//获取应用实例
const app = getApp()

create(store, {
	data: {
		imgUrls: [
            'http://imgsrc.baidu.com/imgad/pic/item/838ba61ea8d3fd1f36d4a6003b4e251f95ca5f2e.jpg',
            'http://img2.imgtn.bdimg.com/it/u=1767273652,3452916512&fm=26&gp=0.jpg',
            'http://img0.imgtn.bdimg.com/it/u=1355282358,4238062234&fm=11&gp=0.jpg'
        ],
        index: -1
	},
	onLoad: function (option) {
        this.setData({
            index: option.index
        })
	}
})
