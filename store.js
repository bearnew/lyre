import Storage from './utils/storage';
import storageKey from './constant/storageKey';
const { CART_LIST } = storageKey;
Storage.getInstance('test', true).set(123)
console.log(Storage.getInstance(CART_LIST, true))

export default {
    data: {
        cartsList: Storage.getInstance(CART_LIST, true).get() || []
    }
}