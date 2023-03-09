import { createRouter, createWebHistory } from "vue-router";
import PropertyList from '@/views/property/PropertyList.vue'
import CustomerList from '@/views/customer/CustomerList.vue'
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component:PropertyList
        },
        {
            path: '/property',
            component:PropertyList
        },
        {
            path: '/customer',
            component:CustomerList
        }
    ]
})
export default router