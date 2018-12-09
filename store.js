import Storage from './utils/storage';
import storageKey from './constant/storageKey';
const { CART_LIST } = storageKey;

export default {
    data: {
        cartsList: Storage.getInstance(CART_LIST, true).get() || []
    }
}