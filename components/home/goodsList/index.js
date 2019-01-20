import create from '../../../utils/create';
import Storage from '../../../utils/storage';
import api from '../../../utils/api';
import storageKey from '../../../constant/storageKey';
const { CART_LIST } = storageKey;

create({
	data: {
		
	},
	properties: {
		list: Array
	},
	methods: {
		addCart: function(event) {
			const id = event.currentTarget.dataset.id;
			this.requestAddCart(id);

			const good = this.properties.list.find(item => item.id === id);
			good.count = 1;
			good.isSelected = true;

			// 渲染
			const { cartsList } = this.store.data;
			const idx = cartsList.findIndex(item => item.id === id);
			if (idx !== -1) {
				cartsList[idx].count ++;
			} else {
				cartsList.push(good);
			}
			this.update();

			// storage
			const cartStore = Storage.getInstance(CART_LIST);
			cartStore.set(cartsList);
		},
		requestAddCart: function(id) {
			api.post('/tapi/v1/shoppingCart/add', {
				id,
				sum: 1
			}).then(res => {
				if (res.respCode === 0) {
					wx.showToast({
						title: '加入购物车成功!',
						icon: 'success',
						duration: 1000
					})
				} else {
					wx.showToast({
						title: '加入购物车失败，请重试!',
						icon: 'none',
						// image: '/img/fail.png',
						duration: 3000
					})
				}
				console.log(res);
			}).catch(err => {
				console.error(err);
			})
		}
	}
})