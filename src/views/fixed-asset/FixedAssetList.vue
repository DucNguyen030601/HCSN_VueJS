<template>
  <div
    class="content"
    v-keydown-ctrl-shift-D="openFormDelete"
    v-keydown-ctrl-1="openFormAdd"
  >
    <div class="content__toolbar">
      <div class="toolbar__filter">
        <input-text-filter-vue
          placeholder="Tìm kiếm tài sản"
          ref="filterAsset"
          name="filterAsset"
          v-model="filterAsset"
          :sizeH="35"
          :sizeW="179"
          :isFocus="true"
          @onFocusInputListener="onFocusInputListener"
        />
        <base-combobox-vue
          placeholder="Loại tài sản"
          ref="filterCat"
          name="filterCat"
          :filter="true"
          :checkActive="true"
          :api="MISAResoure.API.Cat.Get"
          get="fixed_asset_category_name"
          v-model="filterCat"
          styleplaceholder="normal"
          @onFocusInputListener="onFocusInputListener"
        />
        <base-combobox-vue
          placeholder="Bộ phận sử dụng"
          ref="filterDept"
          name="filterDept"
          :filter="true"
          :checkActive="true"
          :api="MISAResoure.API.Dept.Get"
          get="department_name"
          v-model="filterDept"
          styleplaceholder="normal"
          @onFocusInputListener="onFocusInputListener"
        />
      </div>
      <div class="toolbar__feature">
        <div class="tooltip">
          <button
            class="btn btn--primary"
            style="width: 110px; height: 36px"
            @click="openForm(MISAEnum.FormState.Add)"
          >
            + Thêm tài sản
          </button>
          <span class="tooltip__text">Thêm tài sản (CTRL + 1)</span>
        </div>
        <div class="tooltip">
          <button class="btn feature__btn" @click="exportExcel">
            <div class="icon-excel"></div>
          </button>
          <span class="tooltip__text">Xuất Excel</span>
        </div>

        <div class="tooltip">
          <button class="btn feature__btn" @click="removefixedAssets()">
            <div class="icon-bin--red"></div>
          </button>
          <span class="tooltip__text">Xoá (CTRL + SHIFT + D)</span>
        </div>
      </div>
    </div>
    <base-table-vue
      v-model="model"
      v-model:page="page"
      v-model:pageSize="pageSize"
      :totalPage="totalPage"
      :totalRecord="totalRecord"
      :arrPage="MISAResoure.Table.FixedAsset.Pages.ArrPage"
      :moreInfo="moreInfo"
      @openForm="openForm"
      ref="table"
      name="table"
      :columns="MISAResoure.Table.FixedAsset.Columns"
      :cells="MISAResoure.Table.FixedAsset.Cells"
      send="fixed_asset_id"
      :get="[
        'fixed_asset_id',
        'fixed_asset_code',
        'fixed_asset_name',
        'active',
        'fixed_asset_increment_code',
      ]"
      :totalCellPaging="7"
      :buttonFeatureTable="MISAResoure.Table.FixedAsset.ButtonFeatureTable"
      :itemFeatureContextMenu="
        MISAResoure.Table.FixedAsset.ItemFeatureContextMenu
      "
      @onFocusTableListener="onFocusInputListener"
    />
  </div>

  <the-dialog-vue
    ref="dialog"
    v-show="isShowDialog"
    @onChoose="btnOnClickChooseDialog"
  />

  <fixed-asset-detail-vue
    v-if="isShowForm"
    :title="titleForm"
    :fixedAsset="fixedAsset"
    @closeForm="closeForm"
    :state="state"
    @load="loadPage"
  />

  <loading-process-vue v-if="isLoadingProcess" />
  <base-toast-vue v-if="isShowToast" :isSuccess="isSuccessToast" />
</template>

<script>
import { saveAs } from "file-saver";
import FixedAssetDetailVue from "@/views/fixed-asset/FixedAssetDetail.vue";
export default {
  name: "FixedAssetList",
  components: {
    FixedAssetDetailVue,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      isShowForm: false,
      statusShowForm: true, //trạng thái form khi call api
      isLoadingProcess: false,
      model: [],
      fixedAsset: {}, //gán các giá trị của tài sản đề gửi sang form chi tiết
      fixedAssetId: null, //gán id tài sản lúc đầu, lần sau dùng nếu khác id -> call api
      fixedAssetCode: null, // mã tài sản lần đầu gọi api lấy tài sản
      newFixedAssetCode: null, //mã tài sản mới cho tài sản
      state: null, //trạng thái khi mở form
      isShowDialog: false,
      isShowToast: false,
      isSuccessToast: true,
      filterDept: "",
      filterCat: "",
      filterAsset: "",
      page: 1,
      pageSize: this.MISAResoure.Table.FixedAsset.Pages.PageSize,
      totalPage: 1,
      totalRecord: 0,
      moreInfo: [0, 0, 0],
      focusName: null,
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
     * @description: Lấy giá trị tìm kiếm
     * @param: {any}
     * Author: NNduc (14/05/2023)
     */
    filterAsset: function (nVal) {
      this.page = 1;
      const api = this.MISAResoure.API.FixedAsset.Get(
        this.filterDept,
        this.filterCat,
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
      this.page = 1;
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
      this.page = 1;
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
     * @description:Sự kiện focus từng các component
     * @param: {any}
     * Author: NNduc (21/04/2023)
     */
    onFocusInputListener: function (name) {
      this.focusName = name;
    },
    /**
     * Làm mới lại trang
     * Author NNduc(13/03/2023)
     */
    loadPage: function (isSuccess = true) {
      //Đóng dialog
      this.isShowDialog = false;
      //Đóng form
      this.isShowForm = false;
      //Set trạng thái toast
      this.isSuccessToast = isSuccess;
      //Show toast
      this.isShowToast = true;
      //nếu thành công reset lại table
      if (isSuccess) {
        //đặt lại các trường về mặc định
        this.fixedAssetId = null;
        this.newFixedAssetCode = null;
        this.page = 1;
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
        //làm mới style
        this.$refs.table.refresh();

        this.$refs[this.focusName].autoFocusComplete();
      }
      setTimeout(() => {
        this.isShowToast = false;
      }, 1500);
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
          this.moreInfo = Object.keys(response.data.MoreInfo).map(function (
            key
          ) {
            return response.data.MoreInfo[key];
          });
          this.isLoadingProcess = false;
        })
        .catch((e) => {
          this.isLoadingProcess = false;
          this.showDialogError(e);
        });
    },

    /**
     * @description: Hiện dialog lỗi
     * @param: {any}
     * Author: NNduc (10/04/2023)
     */
    showDialogError: function (e, fixedAssets = []) {
      console.log(e);
      //nếu không có kết nối mạng
      if (e.code == "ERR_NETWORK") {
        this.showDialog(
          this.MISAResoure.Dialog.Title.ErrorNetwork,
          this.MISAResoure.Dialog.Button.Close
        );
      } else {
        let errorCode = e.response.data.ErrorCode;
        if (errorCode == this.MISAEnum.ErrorCode.Exception) {
          this.showDialog(
            this.MISAResoure.Dialog.Title.Warning,
            this.MISAResoure.Dialog.Button.Close
          );
        } else if (errorCode == this.MISAEnum.ErrorCode.DeleteArised)
          this.validateDelete(fixedAssets);
        else this.loadPage(false);
      }
    },

    /**
     * Hàm xoá nhân viên
     * Author NNduc (7/3/2023)
     */
    removefixedAssets: function () {
      const fixedAssets = this.$refs.table.getAllData();
      this.isShowDialog = true;
      if (fixedAssets.length == 0) {
        //gán các thông tin vào cảnh báo
        let title = this.MISAResoure.Dialog.Title.DeleteWarningChoose(
          this.MISAResoure.Form.FixedAsset.Name
        );
        let titleBtnPr = this.MISAResoure.Dialog.Button.Close;
        this.showDialog(title, titleBtnPr);
      } else if (fixedAssets.length == 1) {
        //gán các thông tin vào cảnh báo
        let s =
          fixedAssets[0].fixed_asset_code +
          " - " +
          fixedAssets[0].fixed_asset_name;
        let title = this.MISAResoure.Dialog.Title.DeleteDetail(
          this.MISAResoure.Form.FixedAsset.Name,
          s
        );
        let titleBtnPr = this.MISAResoure.Dialog.Button.Delete;
        let titleBtnOut = this.MISAResoure.Dialog.Button.No;
        this.showDialog(title, titleBtnPr, titleBtnOut);
      } else {
        //gán các thông tin vào cảnh báo
        let title = this.MISAResoure.Dialog.Title.DeleteALot(
          this.MISAResoure.Form.FixedAsset.Name,
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
        this.$refs[this.focusName].autoFocusComplete();
      } else {
        //Xử lý dialog form xoá
        const fixedAssets = this.$refs.table.getAllData();
        if (this.validateDelete(fixedAssets)) {
          this.isLoadingProcess = true;
          const fixedAssetIds = fixedAssets.map(
            (object) => object.fixed_asset_id
          );
          if (fixedAssetIds.length == 1) {
            const api = this.MISAResoure.API.FixedAsset.DeleteId(
              fixedAssetIds[0]
            );
            this.axios
              .delete(api)
              .then((response) => {
                this.isLoadingProcess = false;
                if (response) {
                  this.loadPage();
                }
              })
              .catch((e) => {
                this.isLoadingProcess = false;
                this.showDialogError(e, fixedAssets);
              });
          } else {
            const api = this.MISAResoure.API.FixedAsset.Delete;
            this.axios
              .delete(api, {
                data: fixedAssetIds,
              })
              .then((response) => {
                this.isLoadingProcess = false;
                if (response) {
                  this.loadPage();
                }
              })
              .catch((e) => {
                this.isLoadingProcess = false;
                this.showDialogError(e, fixedAssets);
              });
          }
        }
      }
    },

    /**
     * @description: Hàm kiểm tra tài sản ghi tăng khi xoá
     * @param: {any}
     * Author: NNduc (04/05/2023)
     */
    validateDelete(fixedAssets) {
      var title = "";
      if (fixedAssets.length == 1) {
        const fixedAsset = fixedAssets[0];
        if (fixedAsset.fixed_asset_increment_code)
          title =
            this.MISAResoure.Form.FixedAsset.Validate.ValidateDeleteIncrement(
              fixedAsset.fixed_asset_code,
              fixedAsset.fixed_asset_increment_code
            );
      } else {
        const fixedAsset = fixedAssets.filter(function (item) {
          return item.fixed_asset_increment_code;
        });
        if (fixedAsset.length > 0)
          title =
            this.MISAResoure.Form.FixedAsset.Validate.ValidateDeleteALotIncrement(
              fixedAssets.length
            );
      }
      if (title) {
        this.showDialog(title, this.MISAResoure.Dialog.Button.Close);
        return false;
      } else return true;
    },
    /**
     * @description: Sự kiện khi ấn nút Ctrl 1 -> Mở form thêm
     * @param: {any}
     * Author: NNduc (14/05/2023)
     */
    openFormAdd: function () {
      //nếu trong trạng thái mở form chi tiết
      if (this.isShowForm) return;
      this.openForm(this.MISAEnum.FormState.Add);
    },
    /**
     * @description: Sự kiện khi ấn nút Ctrl Shift D -> Mở form xoá
     * @param: {any}
     * Author: NNduc (14/05/2023)
     */
    openFormDelete: function () {
      if (this.isShowForm) return;
      this.removefixedAssets();
    },
    /**
     * Hàm mở form
     * Author NNduc (3/3/2023)
     */
    openForm: async function (state, id = null) {
      //Nếu trong trạng thái thêm, sửa, nhân bản
      if (
        state == this.MISAEnum.FormState.Add ||
        state == this.MISAEnum.FormState.Edit ||
        state == this.MISAEnum.FormState.Clone
      ) {
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
          //nếu mã code mới chưa được lấy -> gọi api
          if (!this.newFixedAssetCode) {
            this.newFixedAssetCode = await this.getNewFixedAssetCode();
          }
          this.fixedAsset.fixed_asset_code = this.newFixedAssetCode;
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
          if (!this.newFixedAssetCode) {
            this.newFixedAssetCode = await this.getNewFixedAssetCode();
          }
          this.fixedAsset.fixed_asset_code = this.newFixedAssetCode;
          this.titleForm = this.MISAResoure.Form.FixedAsset.Title.Clone;
        }
        this.fixedAsset.purchase_date = this.MISACommon.formatDate(
          this.fixedAsset.purchase_date
        );
        this.fixedAsset.production_year = this.MISACommon.formatDate(
          this.fixedAsset.production_year
        );
        this.state = state;
        this.isShowForm = this.statusShowForm;
      } else {
        this.removefixedAssets();
      }
    },

    /**
     * @description: Hàm xử lý đóng form
     * @param: {any}
     * Author: NNduc (04/05/2023)
     */
    closeForm: function () {
      this.isShowForm = !this.isShowForm;
      this.$refs[this.focusName].autoFocusComplete();
    },

    /**
     * Lấy mã code tài sản từ api
     * Author NNduc(13/3/2023)
     */
    getNewFixedAssetCode: async function () {
      var s = "";
      //nếu trong trường hợp hiện dialog lỗi-> không gọi api
      if (this.isShowDialog) return s;
      this.isLoadingProcess = true;
      const api = this.MISAResoure.API.FixedAsset.NewFixedAssetCode;
      // const axios = await ;
      await this.axios
        .get(api)
        .then((response) => {
          this.statusShowForm = true;
          this.isLoadingProcess = false;
          s = response.data;
        })
        .catch((e) => {
          this.isLoadingProcess = false;
          this.statusShowForm = false;
          this.showDialogError(e);
        });
      return s;
    },

    getFixedAssetId: async function (fixedAssetId) {
      var fixedAsset = {};
      //nếu trong trường hợp hiện dialog lỗi-> không gọi api
      if (this.isShowDialog) return fixedAsset;
      this.isLoadingProcess = true;
      const api = this.MISAResoure.API.FixedAsset.GetId(fixedAssetId);
      await this.axios
        .get(api)
        .then((response) => {
          this.statusShowForm = true;
          this.isLoadingProcess = false;
          fixedAsset = response.data;
        })
        .catch((e) => {
          this.isLoadingProcess = false;
          this.statusShowForm = false;
          this.showDialogError(e);
        });
      return fixedAsset;
    },

    /**
     * @description: Xuất khẩu Excel
     * @param: {any}
     * Author: NNduc (01/04/2023)
     */
    exportExcel: async function () {
      this.isLoadingProcess = true;
      const api = this.MISAResoure.API.FixedAsset.ExportExcel(
        this.filterDept,
        this.filterCat,
        this.filterAsset
      );
      await this.axios
        .post(api, null, {
          responseType: "blob",
        })
        .then((response) => {
          this.isLoadingProcess = false;
          const blob = new Blob([response.data], {
            type: response.data.type,
          });
          const fileName = "Danh_Sach_Tai_San.xlsx";
          saveAs(blob, fileName);
        })
        .catch((e) => {
          console.log(e);
          this.isLoadingProcess = false;
          let title = this.MISAResoure.Dialog.Title.Warning;
          let titleBtnPr = this.MISAResoure.Dialog.Button.Close;
          this.showDialog(title, titleBtnPr);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.content :where(.content__toolbar, .toolbar__filter, .toolbar__feature) {
  display: flex;
  align-items: center;
}
.content__toolbar {
  height: 36px;
  justify-content: space-between;
}
.toolbar__filter {
  column-gap: 11px;
}
.toolbar__feature {
  column-gap: 11px;
}

.toolbar__filter .txt-box--filter {
  height: 35px;
  width: 179px;
}
.toolbar__filter .dropdown--filter {
  height: 35px;
  width: 219px;
}
.toolbar__feature .feature__btn {
  height: 36px;
  width: 36px;
}
</style>
