import { createRouter, createWebHistory } from "vue-router";
import FixedAssetList from '@/views/fixed-asset/FixedAssetList.vue'
import CustomerList from '@/views/customer/CustomerList.vue'
import FixedAssetIncrementList from '@/views/fixed-asset-increment/FixedAssetIncrementList.vue'
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: FixedAssetList
        },
        {
            path: '/fixedasset',
            component: FixedAssetList
        },
        {
            path: '/fixedasset',
            component: CustomerList
        },
        {
            path: '/fixedassetincrement',
            component: FixedAssetIncrementList
        }

    ]
})
export default router