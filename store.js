import Storage from './utils/storage';
import storageKey from './constant/storageKey';
const {
    CART_LIST,
    ADDRESS_LIST
} = storageKey;
const app = getApp()

export default {
    data: {
        cartsList: Storage.getInstance(CART_LIST, true).get() || [],
        addressList: Storage.getInstance(ADDRESS_LIST, true).get() || [],
        customerInfo: {}
    }
}