const baseUrl = 'http://47.110.59.224:8091';

const http = ({ url = '', param = {}, ...other } = {}) => {
    wx.showLoading({
        title: '请求中，请耐心等待..'
    });
    let timeStart = Date.now();
    return new Promise((resolve, reject) => {
        console.log('111', url)
        console.log('222', param)
        wx.request({
            url: getUrl(url),
            data: param,
            header: {
                'content-type': 'application/json' // 默认值 ,另一种是 "content-type": "application/x-www-form-urlencoded"
            },
            ...other,
            complete: res => {
                wx.hideLoading();
                console.log(`耗时${Date.now() - timeStart}`);
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(res.data)
                } else {
                    reject(res)
                }
            }
        })
    })
}

const getUrl = (url) => {
    if (url.indexOf('://') == -1) {
        url = baseUrl + url;
    }
    return url
}

// get方法
const get = (url, param = {}) => {
    return http({
        url,
        param
    })
}

const post = (url, param = {}) => {
    console.log('post', url, param)
    return http({
        url,
        param,
        method: 'post'
    })
}

const put = (url, param = {}) => {
    return http({
        url,
        param,
        method: 'put'
    })
}

// const delete = (url, param = {}) => {
//     return http({
//         url,
//         param,
//         method: 'put'
//     })
// }

export default {
    get,
    post,
    put,
    // delete
}
