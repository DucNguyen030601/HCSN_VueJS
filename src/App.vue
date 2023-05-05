<template>
  <the-sidebar-vue  />
  <the-header-vue  />
  <the-content-vue />
  <!-- <task-vue
    v-model="model"
    :arrData="arrData"
    @closeForm="show = false"
    v-if="show"
    :api="apiUpdate"
  />
  <base-toast-vue v-if="isShowToast" /> -->
</template>

<script>
//import TaskVue from "./components/BaseTask/Task.vue";
import TheContentVue from "./layout/TheContent.vue";
import TheHeaderVue from "./layout/TheHeader.vue";
import TheSidebarVue from "./layout/TheSidebar.vue";
export default {
  name: "App",
  components: {
    TheContentVue,
    TheHeaderVue,
    TheSidebarVue,
    //TaskVue,
  },
  async created() {
    // this.model = await this.getFixedAssetId('01a0dcf7-d453-11ed-8a61-c85b767acdfd');
    // this.arrData = await this.getBudgets();
    // this.show = true;
    // this.apiUpdate =  this.MISAResoure.API.FixedAsset.UpdateId('01a0dcf7-d453-11ed-8a61-c85b767acdfd');
  },
  data() {
    return {
      model: {},
      arrData: [],
      show: false,
      apiUpdate: null
    };
  },
  methods: {
    getBudgets: async function () {
      var budget = [];
      const api = this.MISAResoure.API.Budget.Get;
      this.isLoadingProcess = true;
      await this.axios
        .get(api)
        .then((response) => {
          budget = response.data;
          this.isLoadingProcess = false;
        })
        .catch((e) => {
          this.isLoadingProcess = false;
          let title = this.MISAResoure.Dialog.Title.Warning + "</br>" + e;
          let titleBtnPr = this.MISAResoure.Dialog.Button.Close;
          this.showDialog(title, titleBtnPr);
        });
      return budget;
    },
    getFixedAssetId: async function (fixedAssetId) {
      var fixedAsset = {};
      const api = this.MISAResoure.API.FixedAsset.GetId(fixedAssetId);
      this.isLoadingProcess = true;
      await this.axios
        .get(api)
        .then((response) => {
          fixedAsset = response.data;
          this.isLoadingProcess = false;
        })
        .catch((e) => {
          this.isLoadingProcess = false;
          let title = this.MISAResoure.Dialog.Title.Warning + "</br>" + e;
          let titleBtnPr = this.MISAResoure.Dialog.Button.Close;
          this.showDialog(title, titleBtnPr);
        });
      return fixedAsset;
    },
  },
};
</script>
<style>
@import url(./css/layout/main.css);
#app {
  display: grid;
  grid-template-columns: auto 1fr;
}
</style>