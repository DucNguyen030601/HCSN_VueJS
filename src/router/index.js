import { createRouter, createWebHistory } from "vue-router";
import FixedAssetList from '@/views/fixed-asset/FixedAssetList.vue'
import CustomerList from '@/views/customer/CustomerList.vue'
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component:FixedAssetList
        },
        {
            path: '/fixedasset',
            component:FixedAssetList
        },
        {
            path: '/fixedasset',
            component:CustomerList
        }
    ]
})
export default router