<template>
  <div
    class="popup"
    v-keydown-esc="closeForm"
    v-keydown-ctrl-s="btnOnClickSave"
  >
    <div class="popup-form">
      <div class="popup-form__header">
        <h2>Chọn tài sản ghi tăng</h2>
        <div class="header__close" @click="closeForm">
          <div class="tooltip">
            <div class="icon-close-popup"></div>
            <span class="tooltip__text">Đóng (ESC)</span>
          </div>
        </div>
      </div>
      <div class="popup-form__body">
        <div class="content__toolbar">
          <div class="toolbar__filter">
            <input-text-filter-vue
              placeholder="Tìm kiếm theo mã, tên tài sản"
              v-model="filterAsset"
              :sizeH="35"
              :sizeW="300"
              :isFocus="true"
            />
          </div>
        </div>
        <base-table-vue
          sizeH="calc(100% - 76px)"
          v-model="model"
          v-model:page="page"
          v-model:pageSize="pageSize"
          :totalPage="totalPage"
          :totalRecord="totalRecord"
          :arrPage="
            MISAResoure.Table.FixedAssetIncrement.FixedAsset.Pages.ArrPage
          "
          :moreInfo="moreInfo"
          ref="tableFixedAsset"
          :columns="MISAResoure.Table.FixedAssetIncrement.FixedAsset.Columns"
          :cells="MISAResoure.Table.FixedAssetIncrement.FixedAsset.Cells"
          send="fixed_asset_id"
          :get="[
            'fixed_asset_id',
            'fixed_asset_code',
            'fixed_asset_name',
            'department_name',
            'fixed_asset_category_name',
            'cost',
            'quantity',
            'accumulated_depreciation',
            'residual_value',
          ]"
          :totalCellPaging="5"
          :isBorder="false"
        />
      </div>
      <div class="popup-form__footer">
        <div class="tooltip">
          <button
            class="btn btn--primary"
            style="width: 120px"
            @click="btnOnClickSave"
          >
            Đồng ý
          </button>
          <span class="tooltip__text">Đồng ý (CTRL + S)</span>
        </div>
        <div class="tooltip">
          <button class="btn" style="width: 120px" @click="closeForm">
            Huỷ bỏ
          </button>
          <span class="tooltip__text">Huỷ bỏ (ESC)</span>
        </div>
      </div>
    </div>
  </div>
  <the-dialog-vue
    ref="dialog"
    v-show="isShowDialog"
    @onChoose="btnOnClickChooseDialog"
  />
  <loading-process-vue v-if="isLoadingProcess" />
</template>
<script>
export default {
  name: "FixedAssetList",
  props: {
    title: {
      type: String,
      required: true,
    },
    fixedAssetIds: {
      type: Array,
    },
    state: {
      type: Number,
      required: true,
    },
    deletedFixedAssets: Array,
  },
  data() {
    return {
      isLoadingProcess: false,
      model: [],
      isShowDialog: false,
      filterAsset: "",
      page: 1,
      pageSize:
        this.MISAResoure.Table.FixedAssetIncrement.FixedAsset.Pages.PageSize,
      totalPage: null,
      totalRecord: null,
      moreInfo: [],
      fixedAssetIdFilter: {}, //danh sách chứa id có hoặc không trong danh sách tài sản
    };
  },
  created() {
    this.fixedAssetIdFilter.inEntityIds = this.deletedFixedAssets;
    this.fixedAssetIdFilter.notInEntityIds = this.fixedAssetIds;
    const api = this.MISAResoure.API.FixedAsset.Increment(
      this.filterAsset,
      this.page,
      this.pageSize
    );
    this.getFixedAssets(api);
  },
  watch: {
    /**
     * @description: Lấy giá trị tìm kiếm
     * @param: {any}
     * Author: NNduc (14/05/2023)
     */
    filterAsset: function (nVal) {
      this.page = 1;
      const api = this.MISAResoure.API.FixedAsset.Increment(
        nVal,
        this.page,
        this.pageSize
      );
      //lấy dữ liệu
      this.getFixedAssets(api);
    },

    /**
     * Lấy dữ liệu tương ứng khi thay đổi giá trị page size
     * Author NNduc (13/3/2023)
     * @param {*} nVal giá trị mới lúc thay đổi
     */
    pageSize: function (nVal) {
      //truyền tham số vào đường dẫn api;
      const api = this.MISAResoure.API.FixedAsset.Increment(
        this.filterAsset,
        this.page,
        nVal
      );
      //lấy dữ liệu từ api
      this.getFixedAssets(api);
    },
    /**
     * Lấy dữ liệu tương ứng khi thay đổi giá trị trang
     * Author NNduc (13/3/2023)
     * @param {*} nVal giá trị mới lúc thay đổi
     */
    page: function (nVal) {
      const api = this.MISAResoure.API.FixedAsset.Increment(
        this.filterAsset,
        nVal,
        this.pageSize
      );
      this.getFixedAssets(api);
    },
  },
  methods: {
    /**
     * Đóng form
     * Author: NNDuc (2/3/2023)
     */
    closeForm: function () {
      this.$emit("closeForm");
    },

    /**
     * Xử lý sự kiện click Lưu form
     * Author: NNduc(5/3/2023)
     */
    btnOnClickSave: function () {
      const fixedAssets = this.$refs.tableFixedAsset.getAllData();
      this.$emit("getFixedAssets", fixedAssets);
    },

    /**
     * Hàm lấy tất cả tài sản theo bộ lọc
     * NNduc (13/3/2023)
     * @param {*} api đường dẫn api để lấy dữ liệu
     */
    getFixedAssets: function (api) {
      this.isLoadingProcess = true;
      this.axios
        .post(api, this.fixedAssetIdFilter)
        .then((response) => {
          this.model = response.data.Data;
          this.totalPage = response.data.TotalPage;
          this.totalRecord = response.data.TotalRecord;
          this.moreInfo = Object.keys(response.data.MoreInfo).map(function (
            key
          ) {
            return response.data.MoreInfo[key];
          });
          this.isLoadingProcess = false;
        })
        .catch((e) => {
          this.isLoadingProcess = false;
          console.log(e);
          if (e.code == "ERR_NETWORK") {
            this.showDialog(
              this.MISAResoure.Dialog.Title.ErrorNetwork,
              this.MISAResoure.Dialog.Button.Close
            );
          } else {
            this.showDialog(
              this.MISAResoure.Dialog.Title.Warning,
              this.MISAResoure.Dialog.Button.Close
            );
          }
        });
    },
    /**
     * Hàm lấy trạng thái từ dialog
     * Author NNduc(5/5/2023)
     * @param {*} choose  gía trị được gửi từ dialog sang
     */
    btnOnClickChooseDialog: function (choose) {
      if (choose == this.MISAResoure.Dialog.Button.Close)
        this.isShowDialog = false;
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.popup-form__body .content__toolbar {
  padding: 16px;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.toolbar__filter .txt-box--filter {
  height: 35px;
  width: 300px;
}

.popup-form__body {
  background-color: #ffff;
  height: calc(100% - 52px - 65px);
  border-top: 1px solid #dddddd;
}

.popup {
  background-color: rgba(0, 0, 0, 0.16);
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  position: fixed;
  z-index: 3;
}
.popup-form {
  background-color: white;
  position: absolute;
  width: 1100px;
  height: 800px;
  top: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  left: 50%;
  transform: translate(-50%, -50%);
}

.popup-form__header {
  display: flex;
  justify-content: space-between;
  padding: 16px 16px 20px 16px;
  height: 65px;
  align-items: center;
}
.popup-form__header .header__close {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.popup-form__grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 16px;
  grid-template-rows: 84px;
  /* row-gap: 20px; */
  border-radius: 3.5px;
  padding: 20px 16px;
  background-color: #ffff;
  height: 188px;
}
.popup-form__grid .grid__item:first-child {
  grid-column: 1/1;
}
.popup-form__grid .grid__item:last-child {
  grid-column: 1/4;
}

.popup-form__footer {
  padding: 0 16px;
  align-items: center;
  flex-direction: row-reverse;
  display: flex;
  column-gap: 16px;
  height: 52px;
  width: 100%;
  background-color: rgba(128, 128, 128, 0.151);
}
.popup-form__footer button {
  height: 36px;
  width: 110px;
}
</style>
