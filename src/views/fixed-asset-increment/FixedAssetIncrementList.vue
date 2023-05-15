<template>
  <div
    class="content"
    v-keydown-ctrl-shift-D="openFormDelete"
    v-keydown-ctrl-1="openFormAdd"
  >
    <div class="content__toolbar">
      <h2>Ghi tăng tài sản</h2>
      <div class="toolbar__feature">
        <div class="tooltip">
          <button
            class="btn btn--primary"
            style="width: 110px; height: 36px"
            @click="openForm(MISAEnum.FormState.Add)"
          >
            Thêm
          </button>
          <span class="tooltip__text">Thêm (CTRL + 1)</span>
        </div>

        <div class="drop-option" v-click-outside="hideDropOption">
          <button
            class="btn feature__btn"
            @click="isShowDropOption = !isShowDropOption"
          >
            <div class="icon-option-horizontal" v-if="isShowContentTop"></div>
            <div class="icon-option-vertical" v-else></div>
            <div class="icon-option-down"></div>
          </button>
          <div class="drop-option__menu" v-show="isShowDropOption">
            <div class="menu-item" @click="stateZoomContent(0)">
              <div class="icon-option-horizontal"></div>
              Giao diện dọc
            </div>
            <div class="menu-item" @click="stateZoomContent(1)">
              <div class="icon-option-vertical"></div>
              Giao diện ngang
            </div>
          </div>
        </div>
      </div>
    </div>
    <splitpanes
      horizontal
      class="content-all default-theme"
      :class="{ 'content-all__full': isShowContentTop }"
    >
      <pane :size="sizeContentTop" class="content-top">
        <div class="content__toolbar">
          <input-text-filter-vue
            placeholder="Tìm kiếm theo số chứng từ, nội dung"
            ref="filterIncrement"
            name="filterIncrement"
            v-model="filterIncrement"
            :sizeH="35"
            :sizeW="300"
            :isFocus="true"
            @onFocusInputListener="onFocusInputListener"
          />
          <div class="toolbar__feature">
            <div class="tooltip">
              <button
                class="btn feature__btn"
                v-show="fixedAssetIncrements.length > 1"
                @click="removefixedAssetIncrements"
              >
                <div class="icon-bin--red"></div>
              </button>
              <span class="tooltip__text">Xoá (CTRL + SHIFT + D)</span>
            </div>

            <div class="tooltip">
              <button class="btn feature__btn">
                <div class="icon-print"></div>
              </button>
              <span class="tooltip__text">In</span>
            </div>

            <div class="tooltip">
              <button class="btn feature__btn">
                <div class="icon-3-dot"></div>
              </button>
              <span class="tooltip__text">Tuỳ chọn</span>
            </div>
          </div>
        </div>

        <base-table-vue
          sizeH="calc(100% - 76px)"
          v-model="modelFixedAssetIncrement"
          v-model:page="page"
          v-model:pageSize="pageSize"
          :totalPage="totalPage"
          :totalRecord="totalRecord"
          :arrPage="MISAResoure.Table.FixedAssetIncrement.Pages.ArrPage"
          :moreInfo="moreInfo"
          @openForm="openForm"
          @selectedCheckBox="selectedCheckBox"
          @selectedRow="selectedRow"
          :columns="MISAResoure.Table.FixedAssetIncrement.Columns"
          :cells="MISAResoure.Table.FixedAssetIncrement.Cells"
          send="fixed_asset_increment_id"
          :get="['fixed_asset_increment_id']"
          :isBorder="false"
          :totalCellPaging="5"
          :buttonFeatureTable="
            MISAResoure.Table.FixedAssetIncrement.ButtonFeatureTable
          "
          ref="tableFixedAssetIncrement"
          name="tableFixedAssetIncrement"
          :itemFeatureContextMenu="
            MISAResoure.Table.FixedAssetIncrement.ItemFeatureContextMenu
          "
          @onFocusTableListener="onFocusInputListener"
        />
      </pane>
      <pane :size="sizeContentBottom" class="content-bottom">
        <div class="content__toolbar">
          <div class="toolbar__filter">
            <h3>Thông tin chi tiết</h3>
          </div>
          <div class="tooltip">
            <div
              :class="!isShowContentTop ? 'icon-zoom-in' : 'icon-zoom-out'"
              @click="stateZoomContent"
            ></div>
            <span class="tooltip__text" v-show="!isShowContentTop"
              >Phóng to</span
            >
            <span class="tooltip__text" v-show="isShowContentTop">Thu nhỏ</span>
          </div>
        </div>
        <base-table-vue
          sizeH="calc(100% - 50px)"
          v-model="modelFixedAssetIncrementDetail"
          :columns="MISAResoure.Table.FixedAssetIncrementDetail.Columns"
          :cells="MISAResoure.Table.FixedAssetIncrementDetail.Cells"
          send="fixed_asset_id"
          :isBorder="false"
          :isShowFooter="false"
          ref="tableFixedAssetIncrementDetail"
          name="tableFixedAssetIncrementDetail"
          @onFocusTableListener="onFocusInputListener"
        />
        <loading-process-vue
          v-show="isLoadingProcessComponent"
          :isLoadingProcessComponent="true"
        />
      </pane>
    </splitpanes>
  </div>
  <the-dialog-vue
    ref="dialog"
    v-show="isShowDialog"
    @onChoose="btnOnClickChooseDialog"
  />
  <loading-process-vue v-show="isLoadingProcess" />
  <fixed-asset-increment-detail-vue
    v-if="isShowFormFixedAssetIncrementDetail"
    @closeForm="closeForm"
    :fixedAssetIncrement="fixedAssetIncrement"
    :fixedAssetIncrementDetail="modelFixedAssetIncrementDetail"
    :title="titleForm"
    :state="state"
    @load="loadPage"
  />

  <base-toast-vue v-if="isShowToast" :isSuccess="isSuccessToast" />
</template>

<script>
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import FixedAssetIncrementDetailVue from "@/views/fixed-asset-increment/FixedAssetIncrementDetail.vue";
export default {
  components: { FixedAssetIncrementDetailVue, Splitpanes, Pane },
  name: "FixedAssetIncrementList",
  props: {
    msg: String,
  },
  data() {
    return {
      modelFixedAssetIncrementDetail: [], //lấy danh sách tài sản ghi tăng
      modelFixedAssetIncrement: [], //lấy danh sách ghi tăng
      fixedAssetIncrement: {}, //gán các giá trị của tài sản đề gửi sang form chi tiết
      fixedAssetIncrementId: null, //gán id tài sản lúc đầu, lần sau dùng nếu khác id -> call api
      fixedAssetIncrementCode: null, // mã tài sản ghi tăng lần đầu gọi api lấy tài sản
      newFixedAssetIncrementCode: null, //mã tài sản mới cho tài sản lần đầu gọi api lấy mã mới
      state: null,
      isShowFormFixedAssetIncrementDetail: false,
      statusShowForm: true, //trạng thái form khi call api
      isLoadingProcess: false,
      isLoadingProcessComponent: false,
      isShowDropOption: false,
      isShowContentTop: false,
      isShowToast: false,
      isSuccessToast: true,
      sizeContentTop: 60,
      sizeContentBottom: 40,
      page: 1,
      pageSize: this.MISAResoure.Table.FixedAssetIncrement.Pages.PageSize,
      totalPage: 1,
      totalRecord: 0,
      moreInfo: [0],
      filterIncrement: "",
      fixedAssetIncrements: [], //lưu dữ liệu các checkbox từ table
      fixedAssetIncrementIdRow: null, //lưu id của dòng khi chọn xoá
      isShowDialog: false, //hiện dialog
      index: null, //Lưu chỉ số dòng khi mở form
      focusName: null, //lưu tên các component để focus
    };
  },
  async created() {
    const api = this.MISAResoure.API.FixedAssetIncrement.Get(
      this.filterIncrement,
      this.page,
      this.pageSize
    );

    await this.getFixedAssetIncrements(api);
    this.selectedRow(this.modelFixedAssetIncrement[0].fixed_asset_increment_id);
    this.$refs.tableFixedAssetIncrement.active = 0;
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
    loadPage: async function (isSuccess = true) {
      //Đóng dialog
      this.isShowDialog = false;
      //Đóng form
      this.isShowFormFixedAssetIncrementDetail = false;
      //Set trạng thái toast
      this.isSuccessToast = isSuccess;
      //Show toast
      this.isShowToast = true;
      //nếu thành công reset lại table
      if (isSuccess) {
        //đặt lại các trường về mặc định
        this.fixedAssetIncrementId = null;
        this.newFixedAssetIncrementCode = null;
        this.page = 1;
        this.filterIncrement = "";
        const api = this.MISAResoure.API.FixedAssetIncrement.Get(
          this.filterIncrement,
          this.page,
          this.pageSize
        );

        //lấy dữ liệu
        await this.getFixedAssetIncrements(api);
        this.selectedRow(
          this.modelFixedAssetIncrement[0].fixed_asset_increment_id
        );
        //làm mới style
        this.$refs.tableFixedAssetIncrement.refresh();
        this.$refs.tableFixedAssetIncrement.active = 0;
        this.$refs[this.focusName].autoFocusComplete();
      }
      setTimeout(() => {
        this.isShowToast = false;
      }, 1500);
    },

    /**
     * @description: Sự kiện khi ấn nút Ctrl 1 -> Mở form thêm
     * @param: {any}
     * Author: NNduc (14/05/2023)
     */
    openFormAdd: function () {
      //nếu trong trạng thái mở form chi tiết
      if (this.isShowFormFixedAssetIncrementDetail) return;
      this.openForm(this.MISAEnum.FormState.Add);
    },
    /**
     * @description: Sự kiện khi ấn nút Ctrl Shift D -> Mở form xoá
     * @param: {any}
     * Author: NNduc (14/05/2023)
     */
    openFormDelete: function () {
      if (
        this.fixedAssetIncrements.length < 2 ||
        this.isShowFormFixedAssetIncrementDetail
      )
        return;
      this.removefixedAssetIncrements();
    },
    /**
     * Hàm mở form
     * Author NNduc (3/3/2023)
     */
    openForm: async function (state, id = null, index = null) {
      //Nếu trong trạng thái thêm, sửa, nhân bản
      if (
        state == this.MISAEnum.FormState.Add ||
        state == this.MISAEnum.FormState.Edit ||
        state == this.MISAEnum.FormState.Clone
      ) {
        //trạng thái thêm
        if (state == this.MISAEnum.FormState.Add) {
          //Set tài sản làm mặc định
          this.fixedAssetIncrement = {};
          //Set trường fixedAssetIncrementId làm mặc định
          this.fixedAssetIncrementId = null;
          //Đặt tiêu đề form
          this.titleForm = this.MISAResoure.Form.FixedAssetIncrement.Title.Add;

          //Set các trường mặc định form thêm
          this.fixedAssetIncrement.description = "";
          this.fixedAssetIncrement.increment_date = new Date();
          this.fixedAssetIncrement.production_year = new Date();
          //lấy mã code mới
          //nếu mã code mới chưa được lấy -> gọi api
          if (!this.newFixedAssetIncrementCode) {
            this.newFixedAssetIncrementCode =
              await this.getNewFixedAssetIncrementCode();
          }
          this.fixedAssetIncrement.fixed_asset_increment_code =
            this.newFixedAssetIncrementCode;
        } else if (state == this.MISAEnum.FormState.Edit) {
          //trạng thái sửa
          //nếu id khác id ban đầu thì lấy tài sản theo id mới, và gán mã code cũ (trong trường hợp trạng thái là nhân bản sẽ gán mã code mới)
          //còn không sẽ lấy tài sản được gán từ lúc ban đầu và gán lại mã code cũ
          if (this.fixedAssetIncrementId != id) {
            this.fixedAssetIncrementId = id;
            this.fixedAssetIncrement = await this.getFixedAssetIncrementId(id);
            await this.selectedRow(id);
            this.fixedAssetIncrementCode =
              this.fixedAssetIncrement.fixed_asset_increment_code;
          }
          this.fixedAssetIncrement.fixed_asset_increment_code =
            this.fixedAssetIncrementCode;
          this.titleForm = this.MISAResoure.Form.FixedAssetIncrement.Title.Edit;
        }
        this.fixedAssetIncrement.increment_date = this.MISACommon.formatDate(
          this.fixedAssetIncrement.increment_date
        );
        this.fixedAssetIncrement.production_year = this.MISACommon.formatDate(
          this.fixedAssetIncrement.production_year
        );
        this.state = state;
        this.index = index;
        this.isShowFormFixedAssetIncrementDetail = this.statusShowForm;
      } else {
        //lưu id để xoá
        this.fixedAssetIncrementIdRow =
          this.modelFixedAssetIncrement[index].fixed_asset_increment_id;

        //trạng thái xoá
        this.isShowDialog = true;
        //gán các thông tin vào cảnh báo
        let title = this.MISAResoure.Dialog.Title.Delete(
          this.MISAResoure.Form.FixedAssetIncrement.Name,
          this.modelFixedAssetIncrement[index].fixed_asset_increment_code
        );
        let titleBtnPr = this.MISAResoure.Dialog.Button.Delete;
        let titleBtnOut = this.MISAResoure.Dialog.Button.No;
        this.showDialog(title, titleBtnPr, titleBtnOut);
      }
    },

    /**
     * @description: Hàm xử lý đóng form
     * @param: {any}
     * Author: NNduc (04/05/2023)
     */
    closeForm: async function (isLoadForm) {
      if (isLoadForm) {
        if (this.state == this.MISAEnum.FormState.Edit) {
          await this.selectedRow(
            this.modelFixedAssetIncrement[this.index].fixed_asset_increment_id
          );
          let cost = this.modelFixedAssetIncrementDetail.reduce(
            (accumulator, object) => {
              return accumulator + object.cost;
            },
            0
          );
          this.moreInfo = [
            this.moreInfo[0] -
              this.modelFixedAssetIncrement[this.index].cost +
              cost,
          ];
          this.modelFixedAssetIncrement[this.index].cost = cost;
        }
      }
      this.isShowFormFixedAssetIncrementDetail =
        !this.isShowFormFixedAssetIncrementDetail;
      this.$refs[this.focusName].autoFocusComplete();
    },

    /**
     * @description: Xử lý sự kiện xoá
     * @param: {any}
     * Author: NNduc (04/05/2023)
     */
    removefixedAssetIncrements: function () {
      //trạng thái xoá
      this.isShowDialog = true;

      //gán id của dòng được chọn về mặc định ban đầu
      this.fixedAssetIncrementIdRow = null;

      //gán các thông tin vào cảnh báo
      let title = this.MISAResoure.Dialog.Title.DeleteALot(
        this.MISAResoure.Form.FixedAssetIncrement.Name,
        this.fixedAssetIncrements.length
      );
      let titleBtnPr = this.MISAResoure.Dialog.Button.Delete;
      let titleBtnOut = this.MISAResoure.Dialog.Button.No;
      this.showDialog(title, titleBtnPr, titleBtnOut);
    },

    /**
     * @description: Sử lý sự kiện khi change checkbox ở table
     * @param: {any}
     * Author: NNduc (29/04/2023)
     */
    selectedCheckBox: function () {
      this.fixedAssetIncrements =
        this.$refs.tableFixedAssetIncrement.getAllData();
    },
    /**
     * @description:
     * @param: {any}
     * Author: NNduc (18/04/2023)
     */
    selectedRow: async function (fixed_asset_increment_id) {
      if (this.isShowDialog) return;
      this.isLoadingProcessComponent = true;
      const api = this.MISAResoure.API.FixedAssetIncrementDetail.Get(
        fixed_asset_increment_id
      );
      await this.axios
        .post(api)
        .then((response) => {
          this.isLoadingProcessComponent = false;
          this.modelFixedAssetIncrementDetail = response.data.Data;
        })
        .catch((e) => {
          this.isLoadingProcessComponent = false;
          this.showDialogError(e);
        });
    },
    /**
     * Hàm lấy tất cả tài sản ghi tăng theo bộ lọc
     * NNduc (17/4/2023)
     * @param {*} api đường dẫn api để lấy dữ liệu
     */
    getFixedAssetIncrements: async function (api) {
      this.isLoadingProcess = true;
      await this.axios
        .get(api)
        .then((response) => {
          this.modelFixedAssetIncrement = response.data.Data;
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
     * @description:
     * @param: {any}
     * Author: NNduc (15/04/2023)
     */
    hideDropOption: function () {
      this.isShowDropOption = false;
    },

    /**
     * @description:
     * @param: {any}
     * Author: NNduc (15/04/2023)
     */
    stateZoomContent: function (state = -1) {
      if (state == 0) {
        this.isShowContentTop = true;
        this.isShowDropOption = false;
        this.setZoomContent(100, 0);
        return;
      }
      if (state == 1) {
        this.isShowDropOption = false;
        this.isShowContentTop = false;
        this.setZoomContent(60, 40);
        return;
      }
      this.isShowContentTop = !this.isShowContentTop;
      if (this.isShowContentTop) {
        this.setZoomContent(0, 100);
      } else {
        this.setZoomContent(60, 40);
      }
    },
    /**
     * @description:
     * @param: {any}
     * Author: NNduc (16/04/2023)
     */
    setZoomContent: function (hContentTop, hContentBottom) {
      this.sizeContentTop = hContentTop;
      this.sizeContentBottom = hContentBottom;
    },

    /**
     * Lấy mã code tài sản từ api
     * Author NNduc(13/3/2023)
     */
    getNewFixedAssetIncrementCode: async function () {
      var s = "";
      const api =
        this.MISAResoure.API.FixedAssetIncrement.NewFixedAssetIncrementCode;
      this.isLoadingProcess = true;
      await this.axios
        .get(api)
        .then((response) => {
          this.isLoadingProcess = false;
          this.statusShowForm = true;
          s = response.data;
        })
        .catch((e) => {
          this.isLoadingProcess = false;
          this.statusShowForm = false;
          this.showDialogError(e);
        });
      return s;
    },

    getFixedAssetIncrementId: async function (fixedAssetIncrementId) {
      var fixedAssetIncrement = {};
      this.isLoadingProcess = true;
      const api = this.MISAResoure.API.FixedAssetIncrement.GetId(
        fixedAssetIncrementId
      );
      await this.axios
        .get(api)
        .then((response) => {
          this.isLoadingProcess = false;
          this.statusShowForm = true;
          fixedAssetIncrement = response.data;
        })
        .catch((e) => {
          this.isLoadingProcess = false;
          this.statusShowForm = false;
          this.showDialogError(e);
        });
      return fixedAssetIncrement;
    },

    /**
     * @description: Hiện dialog lỗi
     * @param: {any}
     * Author: NNduc (10/04/2023)
     */
    showDialogError: function (e) {
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
        } else this.loadPage(false);
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
        this.isLoadingProcess = true;
        if (this.fixedAssetIncrementIdRow) {
          const api = this.MISAResoure.API.FixedAssetIncrement.DeleteId(
            this.fixedAssetIncrementIdRow
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
              this.showDialogError(e);
            });
        } else {
          const fixedAssetIncrementIds = this.fixedAssetIncrements.map(
            (object) => object.fixed_asset_increment_id
          );
          const api = this.MISAResoure.API.FixedAssetIncrement.Delete;
          this.axios
            .delete(api, {
              data: fixedAssetIncrementIds,
            })
            .then((response) => {
              this.isLoadingProcess = false;
              if (response) {
                this.loadPage();
              }
            })
            .catch((e) => {
              this.isLoadingProcess = false;
              this.showDialogError(e);
            });
        }
      }
    },
  },
  watch: {
    /**
     * Hàm xử lý nhấn enter để tìm kiếm tài sản
     * Author NNduc(13/3/2023)
     */
    filterIncrement: async function (nVal) {
      this.page = 1;
      const api = this.MISAResoure.API.FixedAssetIncrement.Get(
        nVal,
        this.page,
        this.pageSize
      );
      //lấy dữ liệu
      await this.getFixedAssetIncrements(api);
      if (!this.modelFixedAssetIncrement.length)
        this.modelFixedAssetIncrementDetail = new Array();
      else {
        this.selectedRow(
          this.modelFixedAssetIncrement[0].fixed_asset_increment_id
        );
        this.$refs.tableFixedAssetIncrement.active = 0;
      }
    },
    /**
     * Lấy dữ liệu tương ứng khi thay đổi giá trị trang
     * Author NNduc (13/3/2023)
     * @param {*} nVal giá trị mới lúc thay đổi
     */
    page: async function (nVal) {
      const api = this.MISAResoure.API.FixedAssetIncrement.Get(
        this.filterIncrement,
        nVal,
        this.pageSize
      );
      await this.getFixedAssetIncrements(api);
      this.selectedRow(
        this.modelFixedAssetIncrement[0].fixed_asset_increment_id
      );
      this.$refs.tableFixedAssetIncrement.active = 0;
    },
    /**
     * Lấy dữ liệu tương ứng khi thay đổi giá trị page size
     * Author NNduc (13/3/2023)
     * @param {*} nVal giá trị mới lúc thay đổi
     */
    pageSize: async function (nVal) {
      //truyền tham số vào đường dẫn api;
      const api = this.MISAResoure.API.FixedAssetIncrement.Get(
        this.filterIncrement,
        this.page,
        nVal
      );
      //lấy dữ liệu từ api
      await this.getFixedAssetIncrements(api);
      this.selectedRow(
        this.modelFixedAssetIncrement[0].fixed_asset_increment_id
      );
      this.$refs.tableFixedAssetIncrement.active = 0;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.splitpanes.default-theme .splitpanes__pane {
  background-color: #ffff !important;
}
.content-all.content-all__full > .splitpanes__splitter {
  display: none;
}
</style>
<style scoped>
.content-top {
  background-color: white;
}

.content-bottom {
  position: relative;
  background-color: white;
}

.content-top .content__toolbar {
  height: 76px;
  padding: 20px;
}
.content-bottom .content__toolbar {
  padding: 20px;
  height: 50px;
}
.content-top .toolbar__feature {
  column-gap: 30px;
}
.content-top .toolbar__feature .feature__btn {
  height: 25px;
  width: 25px;
  box-shadow: unset;
}

.content-all {
  height: calc(100% - 50px);
}
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
  width: 300px;
}
.toolbar__filter .dropdown {
  height: 35px;
  width: 219px;
}
.toolbar__feature .feature__btn {
  height: 36px;
  width: 80px;
  column-gap: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.16);
}
.toolbar__feature .feature__btn:hover {
  background-color: white;
}
.drop-option {
  position: relative;
}
.drop-option__menu {
  position: absolute;
  top: 110%;
  right: 0;
  width: 180px;
  background-color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.16);
  border-radius: 3px;
  z-index: 2;
}
.drop-option__menu .menu-item {
  padding: 8px;
  display: flex;
  column-gap: 20px;
  align-items: center;
}
.drop-option__menu .menu-item:hover {
  background-color: rgba(26, 164, 200, 0.2);
  cursor: pointer;
}
</style>
