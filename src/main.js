import { createApp } from 'vue'
import App from './App.vue'
import axios from "axios";
import router from './router';

import MISAResoure from "@/js/resoure";
import MISACommon from "@/js/common";
import MISAEnum from './js/enum';

import {clickOutSide,esc,ctrlS,shift} from './js/directive';

import BaseComboboxVue from "@/components/BaseCombobox.vue";
import InputMoneyVue from '@/components/BaseInput/InputMoney.vue';
import InputRateVue from '@/components/BaseInput/InputRate.vue';
import InputMountVue from '@/components/BaseInput/InputMount.vue';
import InputNumberVue from '@/components/BaseInput/InputNumber.vue';
import InputTextVue from '@/components/BaseInput/InputText.vue';
import InputDateVue from '@/components/BaseInput/InputDate.vue';
import InputDateCustomVue from '@/components/BaseInput/InputDateCustom.vue';
import BaseTableVue from '@/components/BaseTable.vue'
import BaseContextMenuVue from '@/components/BaseContextMenu.vue';

import BasePagingVue from '@/components/BasePaging.vue'
import LoadingProcessVue from '@/components/LoadingProcess.vue'
import TheDialogVue from "@/components/BaseDialog.vue";
import BaseToastVue from "@/components/BaseToast.vue"
const app = createApp(App);

//khai báo các component global
app.component('base-combobox-vue',BaseComboboxVue);
app.component('input-money-vue',InputMoneyVue);
app.component('input-rate-vue',InputRateVue);
app.component('input-mount-vue',InputMountVue);
app.component('input-number-vue',InputNumberVue);
app.component('input-text-vue',InputTextVue);
app.component('input-date-vue',InputDateVue);
app.component('input-date-custom-vue',InputDateCustomVue);

app.component('the-dialog-vue',TheDialogVue);
app.component('base-paging-vue',BasePagingVue);
app.component('loading-process-vue',LoadingProcessVue);
app.component('base-toast-vue',BaseToastVue);
app.component('base-table-vue',BaseTableVue);
app.component('base-contextmenu-vue',BaseContextMenuVue);

//khai báo các thuộc tính global
app.config.globalProperties.MISAResoure  = MISAResoure;
app.config.globalProperties.MISACommon  = MISACommon;
app.config.globalProperties.MISAEnum  = MISAEnum;
app.config.globalProperties.axios  = axios;

//khai báo các directive
app.directive('click-outside',clickOutSide); 
app.directive('keydown-esc',esc);
app.directive('keydown-ctrl-s',ctrlS); 
app.directive('keydown-shift',shift); 
app.use(router)
app.mount('#app')
