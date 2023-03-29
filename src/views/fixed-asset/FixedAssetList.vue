<template>
  <div class="content">
    <div class="content__toolbar">
      <div class="toolbar__filter">
        <div class="txt-box--filter">
          <div class="icon-search"></div>
          <input
            class="txt-box"
            placeholder="Tìm kiếm tài sản"
            @keydown="stateKeyDown($event)"
            v-model="filterAsset"
          />
        </div>
        <base-combobox-vue
          placehoder="Loại tài sản"
          :filter="true"
          :checkActive="true"
          :api="MISAResoure.API.Cat.Get"
          get="fixed_asset_category_name"
          v-model="filterCat"
        />
        <base-combobox-vue
          placehoder="Bộ phận sử dụng"
          :filter="true"
          :checkActive="true"
          :api="MISAResoure.API.Dept.Get"
          get="department_name"
          v-model="filterDept"
        />
      </div>
      <div class="toolbar__feature">
        <button
          class="btn btn--primary"
          style="width: 110px; height: 36px"
          @click="openForm(MISAEnum.FormState.Add)"
        >
          + Thêm tài sản
        </button>

        <div class="tooltip">
          <button class="btn feature__btn">
            <div class="icon-excel"></div>
          </button>
          <span class="tooltip__text">Xuất Excel</span>
        </div>

        <div class="tooltip">
          <button class="btn feature__btn" @click="removefixedAssets()">
            <div class="icon-bin"></div>
          </button>
          <span class="tooltip__text">Xoá</span>
        </div>
      </div>
    </div>
    <base-table-vue
      v-model="model"
      v-model:totalPage="totalPage"
      v-model:totalRecord="totalRecord"
      v-model:page="page"
      v-model:pageSize="pageSize"
      :moreInfo="moreInfo"
      @openForm="openForm"
      ref="table"
      :key="forceReload"
    />
  </div>

  <the-dialog-vue
    ref="dialog"
    v-show="isShowDialog"
    @onChoose="btnOnClickChooseDialog"
  />

  <the-form-vue
    v-if="isShowForm"
    :title="titleForm"
    :fixedAsset="fixedAsset"
    @closeForm="isShowForm = !isShowForm"
    :state="state"
    @load="loadPage"
  />

  <loading-process-vue v-if="isLoadingProcess" />
  <base-toast-vue v-if="isShowToast" />
</template>

<script>
export default {
  name: "FixedAssetList",
  props: {
    msg: String,
  },
  data() {
    return {
      isShowForm: false,
      model: [{}],
      fixedAsset: {},
      fixedAssetId: null,
      fixedAssetCode: null,
      state: null,
      isShowDialog: false,
      isShowToast: false,
      filterDept: "",
      filterCat: "",
      filterAsset: "",
      page: 1,
      pageSize: 20,
      totalPage: null,
      totalRecord: null,
      arrPage: ["10", "20", "30", "50", "100"],
      isLoadingProcess: false,
      moreInfo: [],
    };
  },
  created() {
    const api = this.MISAResoure.API.FixedAsset.Get(
      "",
      "",
      this.filterAsset,
      this.page,
      this.pageSize
    );
    this.getFixedAssets(api);
  },
  watch: {
    /**
     * Lấy dữ liệu tương ứng khi thay đổi giá trị page size
     * Author NNduc (13/3/2023)
     * @param {*} nVal giá trị mới lúc thay đổi
     */
    pageSize: function (nVal) {
      //truyền tham số vào đường dẫn api;
      const api = this.MISAResoure.API.FixedAsset.Get(
        this.filterDept,
        this.filterCat,
        this.filterAsset,
        this.page,
        nVal
      );
      //lấy dữ liệu từ api
      this.getFixedAssets(api);
    },

    /**
     * Lấy dữ liệu tương ứng khi thay đổi giá trị combobox loại tài sản
     * Author NNduc (13/3/2023)
     * @param {*} nVal giá trị mới lúc thay đổi
     */
    filterCat: function (nVal) {
      const api = this.MISAResoure.API.FixedAsset.Get(
        this.filterDept,
        nVal,
        this.filterAsset,
        this.page,
        this.pageSize
      );
      this.getFixedAssets(api);
    },

    /**
     * Lấy dữ liệu tương ứng khi thay đổi giá trị bộ phận sử dụng
     * Author NNduc (13/3/2023)
     * @param {*} nVal giá trị mới lúc thay đổi
     */
    filterDept: function (nVal) {
      const api = this.MISAResoure.API.FixedAsset.Get(
        nVal,
        this.filterCat,
        this.filterAsset,
        this.page,
        this.pageSize
      );
      this.getFixedAssets(api);
    },

    /**
     * Lấy dữ liệu tương ứng khi thay đổi giá trị trang
     * Author NNduc (13/3/2023)
     * @param {*} nVal giá trị mới lúc thay đổi
     */
    page: function (nVal) {
      const api = this.MISAResoure.API.FixedAsset.Get(
        this.filterDept,
        this.filterCat,
        this.filterAsset,
        nVal,
        this.pageSize
      );
      this.getFixedAssets(api);
    },
  },
  methods: {
    /**
     * Làm mới lại trang
     * Author NNduc(13/03/2023)
     */
    loadPage: function () {
      //Đóng dialog
      this.isShowDialog = false;
      //Đóng form
      this.isShowForm = false;
      //Show toast
      this.isShowToast = true;
      //đặt lại các trường về mặc định
      this.page = 1;
      this.pageSize = 20;
      this.filterAsset = "";
      this.filterDept = "";
      this.filterCat = "";
      const api = this.MISAResoure.API.FixedAsset.Get(
        this.filterDept,
        this.filterCat,
        this.filterAsset,
        this.page,
        this.pageSize
      );
      //lấy dữ liệu
      this.getFixedAssets(api);
      //làm mới component
      this.forceReload++;
      setTimeout(() => {
        this.isShowToast = false;
      }, 1500);
    },

    /**
     * Hàm xử lý nhấn enter để tìm kiếm tài sản
     * Author NNduc(13/3/2023)
     */
    stateKeyDown: function (evt) {
      //lấy code key của sự kiện keydown
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      //nếu ấn enter sẽ lấy giá trị của text box
      if (charCode == this.MISAEnum.KeySate.Enter) {
        const api = this.MISAResoure.API.FixedAsset.Get(
          this.filterDept,
          this.filterCat,
          this.filterAsset,
          this.page,
          this.pageSize
        );
        //lấy dữ liệu
        this.getFixedAssets(api);
      }
    },

    /**
     * Hàm lấy tất cả tài sản theo bộ lọc
     * NNduc (13/3/2023)
     * @param {*} api đường dẫn api để lấy dữ liệu
     */
    getFixedAssets: function (api) {
      this.isLoadingProcess = true;
      this.axios
        .get(api)
        .then((response) => {
          this.model = response.data.Data;
          this.totalPage = response.data.TotalPage;
          this.totalRecord = response.data.TotalRecord;
          this.moreInfo = Object.keys(response.data.MoreInfo).map(function (key) {
            return response.data.MoreInfo[key];
          });
          this.isLoadingProcess = false;
        })
        .catch((e) => {
          this.isLoadingProcess = false;
          let title =
            this.MISAResoure.Dialog.Title.NetworkWarning + "</br>" + e;
          let titleBtnPr = this.MISAResoure.Dialog.Button.Close;
          this.showDialog(title, titleBtnPr);
        });
    },

    /**
     * Hàm xoá nhân viên
     * Author NNduc (7/3/2023)
     */
    removefixedAssets: function () {
      const fixedAssets = this.$refs.table.getAllCheckBoxfixedAssets();
      this.isShowDialog = true;
      if (fixedAssets.length == 0) {
        //gán các thông tin vào cảnh báo
        let title = this.MISAResoure.Dialog.Title.DeleteWarningChoose;
        let titleBtnPr = this.MISAResoure.Dialog.Button.Close;
        this.showDialog(title, titleBtnPr);
      } else if (fixedAssets.length == 1) {
        //gán các thông tin vào cảnh báo
        let s = fixedAssets[0].code + " - " + fixedAssets[0].name;
        let title = this.MISAResoure.Dialog.Title.Delete(s);
        let titleBtnPr = this.MISAResoure.Dialog.Button.Delete;
        let titleBtnOut = this.MISAResoure.Dialog.Button.No;
        this.showDialog(title, titleBtnPr, titleBtnOut);
      } else {
        //gán các thông tin vào cảnh báo
        let title = this.MISAResoure.Dialog.Title.DeleteALot(
          fixedAssets.length
        );
        let titleBtnPr = this.MISAResoure.Dialog.Button.Delete;
        let titleBtnOut = this.MISAResoure.Dialog.Button.No;
        this.showDialog(title, titleBtnPr, titleBtnOut);
      }
    },

    /**
     * Hàm để chỉnh các thông số của dialog: title, button, title_button
     * Author NNduc (5/3/2023)
     * @param {*} titleDialog  tiêu đề của dialog
     * @param {*} titleBtnPr  tiêu đề của nút xanh
     * @param {*} titleBtnOut  tiêu đề của nút viền đen
     * @param {*} titleDialog  tiêu đề của nút viền trắng
     */
    showDialog: function (
      titleDialog,
      titleBtnPr = null,
      titleBtnOut = null,
      titleBtnSub = null
    ) {
      //set properties it's dialog
      const dialog = this.$refs.dialog;
      dialog.title = titleDialog;
      dialog.titleBtnPr = titleBtnPr;
      dialog.titleBtnOut = titleBtnOut; //button đường viền đen
      dialog.titleBtnSub = titleBtnSub; //button đường viền xanh
      //show dialog
      this.isShowDialog = true;
    },

    /**
     * Hàm lấy trạng thái từ dialog
     * Author NNduc(5/5/2023)
     * @param {*} choose  gía trị được gửi từ dialog sang
     */
    btnOnClickChooseDialog: function (choose) {
      if (
        choose == this.MISAResoure.Dialog.Button.Close ||
        choose == this.MISAResoure.Dialog.Button.No ||
        choose == this.MISAResoure.Dialog.Button.Yes
      ) {
        this.isShowDialog = false;
      } else {
        //Xử lý dialog form xoá
        this.isLoadingProcess = true;
        const fixedAssets = this.$refs.table.getAllCheckBoxfixedAssets();
        fixedAssets.forEach(async (element) => {
          const api = this.MISAResoure.API.FixedAsset.DeleteId(element.id);
          await this.axios
            .delete(api)
            .then((response) => {
              this.isLoadingProcess = false;
              if (response.status == 200) {
                this.loadPage();
              } else if (response.status == 400) {
                let title = response.data.title;
                let titleBtnPr = this.MISAResoure.Dialog.Button.Close;
                this.showDialog(title, titleBtnPr);
              } else {
                let title = response.data.title;
                let titleBtnPr = this.MISAResoure.Dialog.Button.Close;
                this.showDialog(title, titleBtnPr);
              }
            })
            .catch((e) => {
              this.isLoadingProcess = false;
              let title =
                this.MISAResoure.Dialog.Title.NetworkWarning + "</br>" + e;
              let titleBtnPr = this.MISAResoure.Dialog.Button.Close;
              this.showDialog(title, titleBtnPr);
            });
        });
      }
    },

    /**
     * Hàm mở form
     * Author NNduc (3/3/2023)
     */
    openForm: async function (state, id = null) {
      //trạng thái thêm
      if (state == this.MISAEnum.FormState.Add) {
        //Set tài sản làm mặc định
        this.fixedAsset = {};
        //Set trường fixedAssetId làm mặc định
        this.fixedAssetId = null;
        //Đặt tiêu đề form
        this.titleForm = this.MISAResoure.Form.FixedAsset.Title.Add;

        //Set các trường mặc định form thêm
        this.fixedAsset.quantity = 1;
        this.fixedAsset.cost = 0;
        this.fixedAsset.life_time = 0;
        this.fixedAsset.depreciation_rate = 0;
        this.fixedAsset.tracked_year = 2023;
        this.fixedAsset.purchase_date = new Date();
        this.fixedAsset.production_year = new Date();
        //lấy mã code mới
        this.fixedAsset.fixed_asset_code = await this.getNewFixedAssetCode();
      } else if (state == this.MISAEnum.FormState.Edit) {
        //trạng thái sửa
        //nếu id khác id ban đầu thì lấy tài sản theo id mới, và gán mã code cũ (trong trường hợp trạng thái là nhân bản sẽ gán mã code mới)
        //còn không sẽ lấy tài sản được gán từ lúc ban đầu và gán lại mã code cũ
        if (this.fixedAssetId != id) {
          this.fixedAssetId = id;
          this.fixedAsset = await this.getFixedAssetId(id);
          this.fixedAssetCode = this.fixedAsset.fixed_asset_code;
        }
        this.fixedAsset.fixed_asset_code = this.fixedAssetCode;
        this.titleForm = this.MISAResoure.Form.FixedAsset.Title.Edit;
      } else {
        if (this.fixedAssetId != id) {
          this.fixedAssetId = id;
          this.fixedAsset = await this.getFixedAssetId(id);
          this.fixedAssetCode = this.fixedAsset.fixed_asset_code;
        }
        this.fixedAsset.fixed_asset_code = await this.getNewFixedAssetCode();
        this.titleForm = this.MISAResoure.Form.FixedAsset.Title.Clone;
      }
      this.fixedAsset.purchase_date = this.MISACommon.formatDate(
        this.fixedAsset.purchase_date
      );
      this.fixedAsset.production_year = this.MISACommon.formatDate(
        this.fixedAsset.production_year
      );
      this.state = state;
      this.isShowForm = true;
    },

    /**
     * Lấy mã code tài sản từ api
     * Author NNduc(13/3/2023)
     */
    getNewFixedAssetCode: async function () {
      var s = "";
      const api = this.MISAResoure.API.FixedAsset.NewFixedAssetCode;
      // const axios = await ;
      await this.axios
        .get(api)
        .then((response) => {
          //          this.isLoadingProcess = false;
          s = response.data;
        })
        .catch((e) => {
          //          this.isLoadingProcess = false;
          let title =
            this.MISAResoure.Dialog.Title.NetworkWarning + "</br>" + e;
          let titleBtnPr = this.MISAResoure.Dialog.Button.Close;
          this.showDialog(title, titleBtnPr);
        });
      return s;
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
          let title =
            this.MISAResoure.Dialog.Title.NetworkWarning + "</br>" + e;
          let titleBtnPr = this.MISAResoure.Dialog.Button.Close;
          this.showDialog(title, titleBtnPr);
        });
      return fixedAsset;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
