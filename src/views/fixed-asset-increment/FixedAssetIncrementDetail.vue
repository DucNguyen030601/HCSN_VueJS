<template>
  <div
    class="popup"
    v-keydown-ctrl-s="stateKeyDownSave"
    v-keydown-esc="closeForm"
    v-keydown-ctrl-1="openFormFixedAssetList"
  >
    <div class="popup-form">
      <div class="popup-form__header">
        <h2>{{ title }}</h2>
        <div class="header__close" @click="closeForm">
          <div class="tooltip">
            <div class="icon-close-popup"></div>
            <span class="tooltip__text">Đóng (ESC)</span>
          </div>
        </div>
      </div>
      <div class="popup-form__body">
        <h3>Thông tin chứng từ</h3>
        <div class="body__content-top">
          <div class="popup-form__grid">
            <div class="grid__item">
              <input-text-vue
                lable="Mã chứng từ"
                v-model.trim="model.fixed_asset_increment_code"
                :require="true"
                placeholder="Nhập mã chứng từ"
                :isFocus="true"
                ref="fixedAssetIncrementCode"
                name="fixedAssetIncrementCode"
                maxLength="100"
                @onFocusInputListener="onFocusInputListener"
              />
            </div>

            <div class="grid__item">
              <input-date-custom-vue
                lable="Ngày bắt đầu sử dụng"
                type="dd/mm/yyyy"
                :require="true"
                ref="incrementDate"
                name="incrementDate"
                v-model="model.production_year"
                @onFocusInputListener="onFocusInputListener"
              />
            </div>
            <div class="grid__item">
              <input-date-custom-vue
                lable="Ngày ghi tăng"
                type="dd/mm/yyyy"
                :require="true"
                ref="productionYear"
                name="productionYear"
                v-model="model.increment_date"
                @onFocusInputListener="onFocusInputListener"
              />
            </div>
            <div class="grid__item">
              <input-text-vue
                lable="Ghi chú"
                ref="description"
                name="description"
                v-model.trim="model.description"
                @onFocusInputListener="onFocusInputListener"
              />
            </div>
          </div>
        </div>
        <h3>Thông tin chi tiết</h3>
        <div class="body__content-bottom">
          <div class="content__toolbar">
            <div class="toolbar__filter">
              <input-text-filter-vue
                placeholder="Tìm kiếm theo mã, tên tài sản"
                v-model="filterAsset"
                :sizeH="35"
                :sizeW="300"
                ref="filterAsset"
                name="filterAsset"
                @onFocusInputListener="onFocusInputListener"
              />
            </div>
            <div class="toolbar__feature">
              <div class="tooltip">
                <button
                  class="btn"
                  style="width: 110px; height: 36px"
                  @click="isShowFixedAssetList = true"
                >
                  Chọn tài sản
                </button>
                <span class="tooltip__text">Chọn tài sản (CTRL + 1)</span>
              </div>
            </div>
          </div>
          <base-table-vue
            sizeH="calc(100% - 76px)"
            v-model="modelFixedAssetIncrementDetail"
            :totalRecord="totalRecord"
            :moreInfo="moreInfo"
            @openForm="openFormFixedAsset"
            :columns="
              MISAResoure.Table.FixedAssetIncrement.FixedAssetIncrementDetail
                .Columns
            "
            :cells="
              MISAResoure.Table.FixedAssetIncrement.FixedAssetIncrementDetail
                .Cells
            "
            :buttonFeatureTable="
              MISAResoure.Table.FixedAssetIncrement.FixedAssetIncrementDetail
                .ButtonFeatureTable
            "
            send="fixed_asset_id"
            :isBorder="false"
            ref="tableFixedAsset"
            name="tableFixedAsset"
            :totalCellPaging="4"
            @onFocusTableListener="onFocusInputListener"
          />
        </div>
      </div>
      <div class="popup-form__footer">
        <div class="tooltip">
          <button
            class="btn btn--primary"
            style="width: 120px"
            @click="btnOnClickSave"
          >
            Lưu
          </button>
          <span class="tooltip__text">Lưu (CTRL + S)</span>
        </div>
        <div class="tooltip">
          <button class="btn" style="width: 120px" @click="closeForm()">
            Huỷ
          </button>
          <span class="tooltip__text">Huỷ (ESC)</span>
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

  <fixed-asset-list-vue
    v-if="isShowFixedAssetList"
    :fixedAssetIds="fixedAssetIds"
    :deletedFixedAssets="deletedFixedAssets"
    @closeForm="closeFormFixedAssetList"
    @getFixedAssets="getFixedAssets"
  />

  <task-vue
    v-model="modelFixedAsset"
    :arrData="arrDataBudget"
    @closeForm="closeTask"
    v-if="isShowTask"
    :api="apiUpdateFixedAsset"
    @load="loadForm"
  />
  <base-toast-vue v-if="isShowToast" :isSuccess="isSuccessToast" />
</template>
<script>
import FixedAssetListVue from "@/views/fixed-asset-increment/FixedAssetList.vue";
import TaskVue from "@/components/BaseTask/Task.vue";
export default {
  name: "FixedAssetIncrementDetail",
  components: {
    FixedAssetListVue,
    TaskVue,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    fixedAssetIncrement: {
      type: Object,
    },
    state: {
      type: Number,
      required: true,
    },
    fixedAssetIncrementDetail: Array,
  },
  data() {
    return {
      model: [], //lưu dữ liệu mới của ghi tăng
      EX_FixedAssetIncrement: [], //lưu trữ dữ liệu cũ của ghi tăng,
      modelFixedAssetIncrementDetail: [], //lưu dữ liệu của tài sản ghi tăng chi tiết trên bảng
      EX_FixedAssetIncrementDetail: [], //lưu trữ dữ liệu cũ của tài sản ghi tăng chi tiết,
      isShowDialog: false,
      isLoadingProcess: false,
      isShowFixedAssetList: false, //show form chọn tài sản ghi tăng
      focusName: null,
      filterAsset: "",
      stateModelFixedAssetIncrementDetail: [], //lưu dữ liệu trạng thái thêm mới bản ghi tài sản
      fixedAssetIds: [], //lưu các id danh sách tài sản của chứng từ (các id ngoại lệ của danh sách chọn tài sản ghi tăng)
      deletedFixedAssets: [], //lưu các id danh sách các tài sản bị xoá trong trạng thái sửa
      updatedFixedAssetIds: [], //lưu danh sách các id tài sản sản update
      apiUpdateFixedAsset: null, //lưu đường dẫn update api của tài sản muốn sửa nguồn hình thành
      isShowTask: false, //để mở form nguồn hình thành
      statusShowTask: true,
      arrDataBudget: [], //danh sách nguồn hình thành
      modelFixedAsset: null, //tài sản muốn sửa
      indexModel: -1, //lưu chỉ số của danh sách tài sản ghi tăng chi tiết trên bảng
      isShowToast: false, //show cảnh báo khi lưu dữ liệu thành công
      isSuccessToast: true, //trạng thái hiện toast
      fixedAssetId: null, //lưu id tài sản trong lần đầu call api
      isLoadForm: false, //lưu trữ khi sửa nguồn hình thành
    };
  },
  async created() {
    //gán dữ liệu mới sang dữ liệu cũ
    this.EX_FixedAssetIncrement = JSON.stringify(this.fixedAssetIncrement);

    // //gán dữ liệu sang data
    this.model = JSON.parse(this.EX_FixedAssetIncrement);

    if (this.fixedAssetIncrement.fixed_asset_increment_id) {
      //gán dữ liệu danh sách chi tiết ghi tăng sang dữ liệu cũ
      //gán dữ liệu mới sang dữ liệu cũ
      this.EX_FixedAssetIncrementDetail = JSON.stringify(
        this.fixedAssetIncrementDetail
      );
    } else this.EX_FixedAssetIncrementDetail = JSON.stringify(new Array());

    //gán dữ liệu sang bên trạng thái tìm kiếm
    this.stateModelFixedAssetIncrementDetail = JSON.parse(
      this.EX_FixedAssetIncrementDetail
    );

    //gán dữ liệu sang data để hiện thị table
    this.modelFixedAssetIncrementDetail =
      this.stateModelFixedAssetIncrementDetail;

    //gán danh sách id tài sản
    this.updatedFixedAssetIds = JSON.parse(
      this.EX_FixedAssetIncrementDetail
    ).map(function (obj) {
      return obj.fixed_asset_id;
    });
  },
  watch: {
    /**
     * @description: Sự kiện tìm kiếm danh sách tài sản
     * @param: {any}
     * Author: NNduc (21/04/2023)
     */
    filterAsset: function (nVal) {
      this.stateSearch = true;
      this.modelFixedAssetIncrementDetail =
        this.stateModelFixedAssetIncrementDetail.filter(
          (object) =>
            object.fixed_asset_code
              .toLowerCase()
              .includes(nVal.toLowerCase()) ||
            object.fixed_asset_name.toLowerCase().includes(nVal.toLowerCase())
        );
    },

    stateModelFixedAssetIncrementDetail: {
      handler: function (nVal) {
        //cập nhật danh sách id, cập nhật danh sách trạng thái tài sản
        this.fixedAssetIds = nVal.map(function (obj) {
          return obj.fixed_asset_id;
        });
        //gán dữ liệu sang data
        //this.modelFixedAssetIncrementDetail = this.stateModelFixedAssetIncrementDetail;
      },
      deep: true,
    },
  },
  computed: {
    /**
     * @description: Các thêm các thông tin
     * @param: {any}
     * Author: NNduc (21/04/2023)
     */
    moreInfo: function () {
      var totalCost = this.modelFixedAssetIncrementDetail.reduce(
        (accumulator, object) => {
          return accumulator + object.cost;
        },
        0
      );
      var totalAccumulatedDepreciation =
        this.modelFixedAssetIncrementDetail.reduce((accumulator, object) => {
          return accumulator + object.accumulated_depreciation;
        }, 0);
      var totalResidualValue = this.modelFixedAssetIncrementDetail.reduce(
        (accumulator, object) => {
          return accumulator + object.residual_value;
        },
        0
      );
      return [totalCost, totalAccumulatedDepreciation, totalResidualValue];
    },
    /**
     * @description: Lấy tổng số bản ghi
     * @param: {any}
     * Author: NNduc (24/04/2023)
     */
    totalRecord: function () {
      return this.modelFixedAssetIncrementDetail.length;
    },
  },
  methods: {
    /**
     * @description: Sự kiện khi ấn ctrl 1 mở form danh sách tài sản
     * @param: {any}
     * Author: NNduc (14/05/2023)
     */
    openFormFixedAssetList: function () {
      if (this.isShowFixedAssetList) return;
      this.isShowFixedAssetList = true;
    },
    /**
     * @description: Xử lý sự kiện khi đóng form danh sách tài sản
     * @param: {any}
     * Author: NNduc (14/05/2023)
     */
    closeFormFixedAssetList: function () {
      this.isShowFixedAssetList = !this.isShowFixedAssetList;
      this.$refs[this.focusName].autoFocusComplete();
    },
    /**
     * @description: Sự kiện khi update thành công và cập nhật lại số tiền
     * @param: {nVal} số tiền
     * Author: NNduc (28/04/2023)
     */
    loadForm: async function (isSuccess, nVal) {
      this.isSuccessToast = isSuccess;
      this.isShowToast = true;
      this.isShowTask = false;
      if (isSuccess) {
        this.modelFixedAssetIncrementDetail[this.indexModel].cost = nVal[0];
        this.modelFixedAssetIncrementDetail[
          this.indexModel
        ].accumulated_depreciation = nVal[1];
        this.modelFixedAssetIncrementDetail[this.indexModel].residual_value =
          nVal[2];
        this.isLoadForm = isSuccess;
      }
      this.$refs[this.focusName].autoFocusComplete();
      setTimeout(() => {
        this.isShowToast = false;
      }, 1500);
    },

    /**
     * @description:
     * @param: {any}
     * Author: NNduc (21/04/2023)
     */
    onFocusInputListener: function (name) {
      this.focusName = name;
    },

    /**
     * @description: Lấy các tài sản ghi tăng được chọn
     * @param: {any}
     * Author: NNduc (21/04/2023)
     */
    getFixedAssets: function (nVal) {
      this.closeFormFixedAssetList();
      this.filterAsset = "";
      this.stateSearch = false;
      this.stateModelFixedAssetIncrementDetail =
        this.stateModelFixedAssetIncrementDetail.concat(nVal);
      if (this.state == this.MISAEnum.FormState.Edit) {
        this.deletedFixedAssets = this.deletedFixedAssets.filter(
          (id) => nVal.map((e) => e.fixed_asset_id).indexOf(id) == -1
        );
      }
      //gán dữ liệu sang data
      this.modelFixedAssetIncrementDetail =
        this.stateModelFixedAssetIncrementDetail;
    },

    /**
     * @description: Hàm xử lý sự kiện mở popup danh sách tài sản
     * @param: {any}
     * Author: NNduc (20/04/2023)
     */
    openFormFixedAsset: async function (state, id, index) {
      this.indexModel = index;
      if (state == this.MISAEnum.FormState.Delete) {
        //lấy chỉ số mặc định của mảng ban đầu
        //Nếu trong trạng thái sửa sẽ lưu những bản ghi bị xoá
        if (
          this.state == this.MISAEnum.FormState.Edit &&
          this.updatedFixedAssetIds.indexOf(
            this.modelFixedAssetIncrementDetail[this.indexModel].fixed_asset_id
          ) != -1
        ) {
          this.deletedFixedAssets.push(
            this.modelFixedAssetIncrementDetail[this.indexModel].fixed_asset_id
          );
        }

        this.modelFixedAssetIncrementDetail.splice(this.indexModel, 1);
        if (this.stateSearch) {
          const indexState = this.stateModelFixedAssetIncrementDetail.findIndex(
            (object) => {
              return object.fixed_asset_id === id;
            }
          );
          this.stateModelFixedAssetIncrementDetail.splice(indexState, 1);
        }
        this.$refs.tableFixedAsset.active = -1;
      }
      if (state == this.MISAEnum.FormState.Edit) {
        if (this.fixedAssetId != id) {
          this.fixedAssetId = id;
          this.modelFixedAsset = await this.getFixedAssetId(id);
        }
        if (this.arrDataBudget.length == 0)
          this.arrDataBudget = await this.getBudgets();

        this.isShowTask = this.statusShowTask;
        this.apiUpdateFixedAsset = this.MISAResoure.API.FixedAsset.UpdateId(id);
      }
    },

    /**
     * Hàm xử lý nhấn CTRL S
     * Author NNduc(13/3/2023)
     */
    stateKeyDownSave: function () {
      if (this.isShowFixedAssetList || this.isShowTask) return;
      this.$refs.incrementDate.onBlurInputValidate();
      this.$refs.productionYear.onBlurInputValidate();
      this.btnOnClickSave();
    },

    /**
     * Kiểm tra thông tin các trường và show dialog
     * Author NNduc (5/3/2023)
     */
    validateForm: function () {
      var title = "";
      if (!this.model.fixed_asset_increment_code) {
        title = this.MISAResoure.Dialog.Title.ValidateRequired(
          this.MISAResoure.Form.FixedAssetIncrement.Lable
            .FixedAssetIncrementCode
        );
        this.focusName = "fixedAssetIncrementCode";
      } else if (!this.model.production_year) {
        title = this.MISAResoure.Dialog.Title.ValidateRequired(
          this.MISAResoure.Form.FixedAssetIncrement.Lable.ProductionYear
        );
        this.focusName = "productionYear";
      } else if (!this.model.increment_date) {
        title = this.MISAResoure.Dialog.Title.ValidateRequired(
          this.MISAResoure.Form.FixedAssetIncrement.Lable.IncrementDate
        );
        this.focusName = "incrementDate";
      } else if (this.fixedAssetIds.length == 0) {
        title =
          this.MISAResoure.Form.FixedAssetIncrement.Validate.EmptyFixedAsset;
        this.focusName = "tableFixedAsset";
      }
      if (title) {
        this.showDialog(title, this.MISAResoure.Dialog.Button.Close);
        this.$refs[this.focusName].showTextValidate();
        return false;
      } else return true;
    },

    /**
     * @description: Kiểm tra thông tin các trường và sẽ show text dưới các input
     * @param: {any}
     * Author: NNduc (10/04/2023)
     */
    showBlurInputs: function () {},

    /**
     * Đóng form
     * Author: NNDuc (2/3/2023)
     */
    closeForm: function () {
      //tránh sự kiện khi mở form danh sách tài sản
      if (this.isShowFixedAssetList || this.isShowTask) return;
      //nếu trong trạng thái sửa
      //kiểm tra hỏi có muốn thay đổi dữ liệu không? nếu có sẽ show cảnh báo
      const NW_FixedAssetIncrement = JSON.stringify(this.model);

      //Lấy danh sách id tài sản của bản cũ
      const EX_FixedAssetIncrementDetailIds = JSON.parse(
        this.EX_FixedAssetIncrementDetail
      ).map(function (obj) {
        return obj.fixed_asset_id;
      });

      //Lấy danh sách id tài sản mới
      const NW_FixedAssetIncrementDetailIds =
        this.stateModelFixedAssetIncrementDetail.map(function (obj) {
          return obj.fixed_asset_id;
        });

      if (
        (NW_FixedAssetIncrement != this.EX_FixedAssetIncrement ||
          !this.MISACommon.arraysEqual(
            EX_FixedAssetIncrementDetailIds,
            NW_FixedAssetIncrementDetailIds
          )) &&
        this.state == this.MISAEnum.FormState.Edit
      ) {
        //gán các thông tin vào cảnh báo
        let title = this.MISAResoure.Dialog.Title.EditWarning;
        let titleBtnPr = this.MISAResoure.Dialog.Button.Save;
        let titleBtnSub = this.MISAResoure.Dialog.Button.DoNotSave;
        let titleBtnOut = this.MISAResoure.Dialog.Button.Cancel;
        this.showDialog(title, titleBtnPr, titleBtnOut, titleBtnSub);
      } else if (
        this.state == this.MISAEnum.FormState.Add ||
        this.state == this.MISAEnum.FormState.Clone
      ) {
        //gán các thông tin vào cảnh báo
        let title = this.MISAResoure.Dialog.Title.CancelWarning(
          this.MISAResoure.Form.FixedAssetIncrement.Name
        );
        let titleBtnPr = this.MISAResoure.Dialog.Button.Cancel;
        let titleBtnOut = this.MISAResoure.Dialog.Button.No;
        this.showDialog(title, titleBtnPr, titleBtnOut);
      } else {
        this.$emit("closeForm", this.isLoadForm);
      }
    },

    /**
     * @description: Xử lý sự kiện đóng task
     * @param: {any}
     * Author: NNduc (04/05/2023)
     */
    closeTask: function () {
      this.isShowTask = !this.isShowTask;
      this.$refs[this.focusName].autoFocusComplete();
    },

    /**
     * Xử lý sự kiện click Lưu form
     * Author: NNduc(5/3/2023)
     */
    btnOnClickSave: function () {
      const fixedAssetIncrementRevision = this.model;
      fixedAssetIncrementRevision.fixed_asset_id = this.fixedAssetIds;
      if (this.validateForm()) {
        if (this.state == this.MISAEnum.FormState.Add) {
          //Xử lý dialog form thêm
          this.isLoadingProcess = true;
          const api = this.MISAResoure.API.FixedAssetIncrement.AddMultiple;
          this.axios
            .post(api, fixedAssetIncrementRevision)
            .then((response) => {
              this.isLoadingProcess = false;
              if (response) {
                this.$emit("load", true);
              }
            })
            .catch((e) => {
              this.isLoadingProcess = false;
              this.showDialogError(e);
            });
        } else if (this.state == this.MISAEnum.FormState.Edit) {
          //Xử lý dialog form sửa
          this.isLoadingProcess = true;
          const api = this.MISAResoure.API.FixedAssetIncrement.UpdateMultipleId(
            fixedAssetIncrementRevision.fixed_asset_increment_id
          );
          this.axios
            .put(api, fixedAssetIncrementRevision)
            .then((response) => {
              this.isLoadingProcess = false;
              if (response) {
                this.$emit("load", true);
              }
            })
            .catch((e) => {
              this.isLoadingProcess = false;
              this.showDialogError(e);
            });
        } else {
          //Xử lý dialog form nhân bản
          this.isLoadingProcess = true;
          const api = this.MISAResoure.API.FixedAsset.Add;
          this.axios
            .post(api, this.model)
            .then((response) => {
              this.isLoadingProcess = false;
              if (response) {
                this.$emit("load", true);
              }
            })
            .catch((e) => {
              this.isLoadingProcess = false;
              this.showDialogError(e);
            });
        }
      }
    },

    /**
     * @description: Hiện dialog lỗi
     * @param: {any}
     * Author: NNduc (10/04/2023)
     */
    showDialogError: function (e) {
      console.log(e);
      //nếu không có kết nối mạng
      if (e.code == "ERR_NETWORK") {
        this.showDialog(
          this.MISAResoure.Dialog.Title.ErrorNetwork,
          this.MISAResoure.Dialog.Button.Close
        );
      } else {
        let errorCode = e.response.data.ErrorCode;
        if (errorCode == this.MISAEnum.ErrorCode.DulicateCode) {
          let title = this.MISAResoure.Dialog.Title.DulicateCode(
            this.MISAResoure.Form.FixedAssetIncrement.Lable
              .FixedAssetIncrementCode,
            this.model.fixed_asset_increment_code
          );
          this.focusName = "fixedAssetIncrementCode";
          this.$refs[this.focusName].showTextValidate();
          let titleBtnPr = this.MISAResoure.Dialog.Button.Close;
          this.showDialog(title, titleBtnPr);
        } else if (errorCode == this.MISAEnum.ErrorCode.InvalidData) {
          this.validateForm();
        } else if (errorCode == this.MISAEnum.ErrorCode.Exception) {
          this.showDialog(
            this.MISAResoure.Dialog.Title.Warning,
            this.MISAResoure.Dialog.Button.Close
          );
        } else {
          this.$emit("load", false);
        }
      }
    },

    /**
     * Hàm lấy trạng thái từ dialog
     * Author NNduc(5/5/2023)
     * @param {*} choose  gía trị được gửi từ dialog sang
     */
    btnOnClickChooseDialog: function (choose) {
      const NW_FixedAssetIncrement = JSON.stringify(this.model);
      //Lấy danh sách id tài sản của bản cũ
      const EX_FixedAssetIncrementDetailIds = JSON.parse(
        this.EX_FixedAssetIncrementDetail
      ).map(function (obj) {
        return obj.fixed_asset_id;
      });
      //Lấy danh sách id tài sản mới
      const NW_FixedAssetIncrementDetailIds =
        this.stateModelFixedAssetIncrementDetail.map(function (obj) {
          return obj.fixed_asset_id;
        });
      if (
        choose == this.MISAResoure.Dialog.Button.Close ||
        choose == this.MISAResoure.Dialog.Button.No ||
        choose == this.MISAResoure.Dialog.Button.Yes ||
        (choose == this.MISAResoure.Dialog.Button.Cancel &&
          this.state == this.MISAEnum.FormState.Edit &&
          (NW_FixedAssetIncrement != this.EX_FixedAssetIncrement ||
            !this.MISACommon.arraysEqual(
              EX_FixedAssetIncrementDetailIds,
              NW_FixedAssetIncrementDetailIds
            )))
      ) {
        this.$refs[this.focusName].autoFocusComplete();
        this.isShowDialog = false;
      } else if (
        choose == this.MISAResoure.Dialog.Button.Cancel ||
        choose == this.MISAResoure.Dialog.Button.DoNotSave
      ) {
        this.$emit("closeForm", this.isLoadForm);
      } else {
        this.btnOnClickSave();
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
     * @description: Lấy danh sách nguồn
     * @param: {any}
     * Author: NNduc (28/04/2023)
     */
    getBudgets: async function () {
      var budget = [];
      if (this.isShowDialog) return budget;
      this.isLoadingProcess = true;
      const api = this.MISAResoure.API.Budget.Get;
      await this.axios
        .get(api)
        .then((response) => {
          this.isLoadingProcess = false;
          this.statusShowTask = true;
          budget = response.data;
        })
        .catch((e) => {
          this.isLoadingProcess = false;
          this.statusShowTask = false;
          this.showDialogError(e);
        });
      return budget;
    },

    /**
     * @description: Lấy tài sản theo id
     * @param: {any}
     * Author: NNduc (28/04/2023)
     */
    getFixedAssetId: async function (fixedAssetId) {
      var fixedAsset = {};
      if (this.isShowDialog) return fixedAsset;
      this.isLoadingProcess = true;
      const api = this.MISAResoure.API.FixedAsset.GetId(fixedAssetId);
      await this.axios
        .get(api)
        .then((response) => {
          this.isLoadingProcess = false;
          this.statusShowTask = true;
          fixedAsset = response.data;
        })
        .catch((e) => {
          this.isLoadingProcess = false;
          this.statusShowTask = false;
          this.showDialogError(e);
        });
      return fixedAsset;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.body__content-bottom .content__toolbar {
  padding: 20px;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.toolbar__filter .txt-box--filter {
  height: 35px;
  width: 300px;
}

.popup-form__body .body__content-bottom {
  background-color: #ffff;
  height: calc(100% - 188px - 94px);
}
.popup-form__body .body__content-top {
  height: 188px;
}

.popup-form__body {
  display: flex;
  flex-direction: column;
  background-color: #f4f7ff;
  padding: 16px;
  row-gap: 16px;
  height: calc(100% - 52px - 65px);
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
