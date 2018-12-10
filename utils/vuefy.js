/**
 * 检测函数的变化
 * data 当前上下文的data，key 键名，val 键值，fn 回调函数
 */
function defineReactive(ctx, key, val, watchFn, computedFn) {
	const data = ctx.data;
	Object.defineProperty(data, key, {
		configurable: true,
		enumerable: true,
		get: function () {
			return val
		},
		set: function (newVal) {
			if (newVal === val) return
			// 如果新值和老值不相同则返回回调函数 fn
			watchFn && watchFn(newVal, val, key);
			val = newVal;
			if (computedFn && computedFn.length) {
				// 执行 computed的更新设置值
				setTimeout(() => {
					computedFn.forEach(sub => sub());
				})
			}
		},
	})
	for (let i in data) {
		if (['Object', 'Array'].includes(Object.prototype.toString.call(data[i]))) {
			ctx.data[i] = new Proxy(data[i], {
				get: function(target, key, receiver) {
					return Reflect.get(target, key, receiver);
				},
				set: function(target, key, val, receiver) {
					data[i]
					return Reflect.set(target, key, val, receiver);
				}
			})
		}
	}
}
	
	// vue watch 方法 监听值的变化
	function watch(ctx, obj) {
	// obj是watch监听的一个一个对象集合 
	Object.keys(obj).forEach(key => {
		// console.log(key);
		defineReactive(ctx.data, key, ctx.data[key], function (newVal, oldVal, realKey) {
		// obj[key] 对应监听值的回调函数,key值判断当前是否是需要watch的字段
		realKey == key && obj[key].call(ctx, newVal, oldVal);
		})
	})
	}
	
	// computed 函数
	function computed(ctx, obj) {
	let computedKeys = Object.keys(obj)//computed 对象集合
	let computedFn = [];//computedFn存储computed计算操作
	let computedObj = computedKeys.reduce((total, next) => {
		computedFn.push(function () {
		ctx.setData({ [next]: obj[next].call(ctx) })
		})
		total[next] = obj[next].call(ctx);
		return total
	}, {})
	// 首次加载先设置一次
	ctx.setData(computedObj)
	// 绑定数据变化时，动态computed
	let dataKeys = Object.keys(ctx.data)
	dataKeys.forEach(dataKey => {
		defineReactive(ctx, dataKey, ctx.data[dataKey], false, computedFn)
	})
	}
	
	// 对外抛出 watch、computed 方法
	module.exports = { watch, computed }