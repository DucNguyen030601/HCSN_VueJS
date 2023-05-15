<template>
  <div class="popup" v-keydown-ctrl-s="stateKeyDown" v-keydown-esc="closeForm">
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

      <div class="popup-form__grid">
        <div class="grid__item">
          <input-text-vue
            v-model.trim="model.fixed_asset_code"
            lable="Mã tài sản"
            :require="true"
            placeholder="Nhập mã tài sản"
            :isFocus="true"
            ref="fixedAssetCode"
            maxLength="100"
            name="fixedAssetCode"
            @onFocusInputListener="onFocusInputListener"
          />
        </div>

        <div class="grid__item">
          <input-text-vue
            v-model.trim="model.fixed_asset_name"
            lable="Tên tài sản"
            :require="true"
            placeholder="Nhập tên tài sản"
            ref="fixedAssetName"
            maxLength="255"
            name="fixedAssetName"
            @onFocusInputListener="onFocusInputListener"
          />
        </div>
        <div class="grid__item">
          <base-combobox-vue
            lable="Mã bộ phận sử dụng"
            placeholder="Chọn mã bộ phận sử dụng"
            :require="true"
            :checkActive="true"
            :api="MISAResoure.API.Dept.Get"
            get="department_code"
            :send="['department_id', 'department_name']"
            v-model="model.department_code"
            v-model:department_name="model.department_name"
            v-model:department_id="model.department_id"
            ref="departmentCode"
            name="departmentCode"
            @onFocusInputListener="onFocusInputListener"
          />
        </div>
        <div class="grid__item">
          <input-text-vue
            v-model="model.department_name"
            lable="Tên bộ phận sử dụng"
            :disable="true"
          />
        </div>
        <div class="grid__item">
          <base-combobox-vue
            lable="Mã loại tài sản"
            placeholder="Chọn mã loại tài sản"
            :require="true"
            :checkActive="true"
            :api="MISAResoure.API.Cat.Get"
            get="fixed_asset_category_code"
            :send="[
              'fixed_asset_category_id',
              'fixed_asset_category_name',
              'life_time',
              'depreciation_rate',
            ]"
            v-model="model.fixed_asset_category_code"
            v-model:fixed_asset_category_id="model.fixed_asset_category_id"
            v-model:fixed_asset_category_name="model.fixed_asset_category_name"
            v-model:life_time="model.life_time"
            v-model:depreciation_rate="model.depreciation_rate"
            ref="fixedAssetCategoryCode"
            name="fixedAssetCategoryCode"
            @onFocusInputListener="onFocusInputListener"
          />
        </div>
        <div class="grid__item">
          <input-text-vue
            v-model="model.fixed_asset_category_name"
            lable="Tên tài loại tài sản"
            :disable="true"
          />
        </div>
        <div class="grid__item">
          <input-mount-vue
            lable="Số lượng"
            v-model="model.quantity"
            :require="true"
            ref="quantity"
            name="quantity"
            @onFocusInputListener="onFocusInputListener"
          />
        </div>

        <div class="grid__item">
          <input-money-vue
            lable="Nguyên giá"
            v-model="model.cost"
            :require="true"
            ref="cost"
            name="cost"
            maxLength="25"
            @onFocusInputListener="onFocusInputListener"
          />
        </div>
        <div class="grid__item">
          <input-number-vue
            lable="Số năm sử dụng"
            v-model="model.life_time"
            :require="true"
            ref="lifeTime"
            name="lifeTime"
            @onFocusInputListener="onFocusInputListener"
          />
        </div>
        <div class="grid__item">
          <input-rate-vue
            lable="Tỷ lệ hao mòn (%)"
            v-model="model.depreciation_rate"
            :disable="true"
          />
        </div>
        <div class="grid__item">
          <input-money-vue
            lable="Giá trị hao mòn năm"
            :disable="true"
            v-model="depreciation_cost"
          />
        </div>
        <div class="grid__item">
          <input-text-vue
            lable="Năm theo dõi"
            v-model="model.tracked_year"
            :disable="true"
          />
        </div>
        <div class="grid__item">
          <input-date-custom-vue
            lable="Ngày mua"
            type="dd/mm/yyyy"
            v-model="model.purchase_date"
            :require="true"
            ref="purchaseDate"
            name="purchaseDate"
            @onFocusInputListener="onFocusInputListener"
          />
        </div>
        <div class="grid__item">
          <input-date-custom-vue
            lable="Ngày bắt đầu sử dụng"
            type="dd/mm/yyyy"
            v-model="model.production_year"
            :require="true"
            ref="productionYear"
            name="productionYear"
            @onFocusInputListener="onFocusInputListener"
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
</template>
<script>
export default {
  name: "FixedAssetDetail",
  props: {
    title: {
      type: String,
      required: true,
    },
    fixedAsset: {
      type: Object,
    },
    state: {
      type: Number,
      required: true,
    },
  },
  created() {
    //gán dữ liệu mới sang dữ liệu cũ
    this.EX_FixedAsset = JSON.stringify(this.fixedAsset);
    //gán dữ liệu sang data
    this.model = JSON.parse(this.EX_FixedAsset);
    this.depreciation_cost = this.model.cost * this.model.depreciation_rate;
  },
  data() {
    return {
      model: null, //lưu dữ liệu mới
      EX_FixedAsset: null, //lưu trữ dữ liệu cũ,
      isShowDialog: false,
      isLoadingProcess: false,
      depreciation_cost: 0,
      focusName: null,
    };
  },
  watch: {
    "model.cost": function (nVal) {
      if (!nVal) this.depreciation_cost = 0 * this.model.depreciation_rate;
      else this.depreciation_cost = nVal * this.model.depreciation_rate;
    },
    "model.life_time": function (nVal) {
      if (!nVal) this.model.depreciation_rate = 0;
      else this.model.depreciation_rate = parseFloat((1 / nVal).toFixed(4));
      this.depreciation_cost = this.model.depreciation_rate * this.model.cost;
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
     * Hàm xử lý nhấn CTRL S
     * Author NNduc(13/3/2023)
     */
    stateKeyDown: function () {
      this.$refs.purchaseDate.onBlurInputValidate();
      this.$refs.productionYear.onBlurInputValidate();
      this.btnOnClickSave();
    },

    /**
     * Kiểm tra thông tin các trường và show dialog
     * Author NNduc (5/3/2023)
     */
    validateForm: function () {
      var title = "";
      if (!this.model.fixed_asset_code) {
        title = this.MISAResoure.Dialog.Title.ValidateRequired(
          this.MISAResoure.Form.FixedAsset.Lable.FixedAssetId
        );
        this.focusName = "fixedAssetCode";
      } else if (!this.model.fixed_asset_name) {
        title = this.MISAResoure.Dialog.Title.ValidateRequired(
          this.MISAResoure.Form.FixedAsset.Lable.FixedAssetName
        );
        this.focusName = "fixedAssetName";
      } else if (!this.model.department_code) {
        title = this.MISAResoure.Dialog.Title.ValidateRequired(
          this.MISAResoure.Form.FixedAsset.Lable.DepartmentCode
        );
        this.focusName = "departmentCode";
      } else if (!this.model.fixed_asset_category_code) {
        title = this.MISAResoure.Dialog.Title.ValidateRequired(
          this.MISAResoure.Form.FixedAsset.Lable.FixedAssetCategoryCode
        );
        this.focusName = "fixedAssetCategoryCode";
      } else if (!this.model.quantity) {
        title = this.MISAResoure.Dialog.Title.ValidateRequired(
          this.MISAResoure.Form.FixedAsset.Lable.Quantity
        );
        this.focusName = "quantity";
      } else if (this.model.quantity < 1) {
        title = this.MISAResoure.Dialog.Title.ValidateGreaterThanZero(
          this.MISAResoure.Form.FixedAsset.Lable.Quantity
        );
        this.focusName = "quantity";
      } else if (!this.model.cost) {
        title = this.MISAResoure.Dialog.Title.ValidateRequired(
          this.MISAResoure.Form.FixedAsset.Lable.Cost
        );
        this.focusName = "cost";
      } else if (this.model.cost < 1) {
        title = this.MISAResoure.Dialog.Title.ValidateGreaterThanZero(
          this.MISAResoure.Form.FixedAsset.Lable.Cost
        );
        this.focusName = "cost";
      } else if (!this.model.life_time) {
        title = this.MISAResoure.Dialog.Title.ValidateRequired(
          this.MISAResoure.Form.FixedAsset.Lable.LifeTime
        );
        this.focusName = "lifeTime";
      } else if (!this.model.purchase_date) {
        title = this.MISAResoure.Dialog.Title.ValidateRequired(
          this.MISAResoure.Form.FixedAsset.Lable.PurchaseDate
        );
        this.focusName = "purchaseDate";
      } else if (!this.model.production_year) {
        title = this.MISAResoure.Dialog.Title.ValidateRequired(
          this.MISAResoure.Form.FixedAsset.Lable.ProductionYear
        );
        this.focusName = "productionYear";
      } else if (
        new Date(this.model.production_year).getTime() -
          new Date(this.model.purchase_date).getTime() <
        0
      ) {
        title =
          this.MISAResoure.Form.FixedAsset.Validate
            .ValidatePurchaseProductionDate;
        this.focusName = "productionYear";
      }
      if (title) {
        this.$refs[this.focusName].showTextValidate();
        this.showDialog(title, this.MISAResoure.Dialog.Button.Close);
        return false;
      } else return true;
    },

    /**
     * @description: Kiểm tra thông tin các trường và sẽ show text dưới các input
     * @param: {any}
     * Author: NNduc (10/04/2023)
     */
    showBlurInputs: function () {
      // this.$refs.fixedAssetCode.onBlurInputValidate();
      // this.$refs.fixedAssetName.onBlurInputValidate();
      // this.$refs.departmentCode.onBlurInputValidate();
      // this.$refs.fixedAssetCategoryCode.onBlurInputValidate();
      // this.$refs.quantity.onBlurInputValidate();
      // this.$refs.cost.onBlurInputValidate();
      // this.$refs.lifeTime.onBlurInputValidate();
      // this.$refs.PurchaseDate.onBlurInputValidate();
      // this.$refs.ProductionYear.onBlurInputValidate();
    },

    /**
     * Đóng form
     * Author: NNDuc (2/3/2023)
     */
    closeForm: function () {
      //nếu trong trạng thái sửa
      //kiểm tra hỏi có muốn thay đổi dữ liệu không? nếu có sẽ show cảnh báo
      const NW_FixedAsset = JSON.stringify(this.model);
      if (
        NW_FixedAsset != this.EX_FixedAsset &&
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
          this.MISAResoure.Form.FixedAsset.Name
        );
        let titleBtnPr = this.MISAResoure.Dialog.Button.Cancel;
        let titleBtnOut = this.MISAResoure.Dialog.Button.No;
        this.showDialog(title, titleBtnPr, titleBtnOut);
      } else this.$emit("closeForm");
    },

    /**
     * Xử lý sự kiện click Lưu form
     * Author: NNduc(5/3/2023)
     */
    btnOnClickSave: function () {
      if (this.validateForm()) {
        if (this.state == this.MISAEnum.FormState.Add) {
          //Xử lý dialog form thêm
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
        } else if (this.state == this.MISAEnum.FormState.Edit) {
          //Xử lý dialog form sửa
          this.isLoadingProcess = true;

          const api = this.MISAResoure.API.FixedAsset.UpdateId(
            this.model.fixed_asset_id
          );
          this.axios
            .put(api, this.model)
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
            this.MISAResoure.Form.FixedAsset.Lable.FixedAssetCode,
            this.model.fixed_asset_code
          );
          this.focusName = "fixedAssetCode";
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
      const NW_FixedAsset = JSON.stringify(this.model);
      if (
        choose == this.MISAResoure.Dialog.Button.Close ||
        choose == this.MISAResoure.Dialog.Button.No ||
        choose == this.MISAResoure.Dialog.Button.Yes ||
        (choose == this.MISAResoure.Dialog.Button.Cancel &&
          this.state == this.MISAEnum.FormState.Edit &&
          NW_FixedAsset != this.EX_FixedAsset)
      ) {
        this.$refs[this.focusName].autoFocusComplete();
        this.isShowDialog = false;
      } else if (
        choose == this.MISAResoure.Dialog.Button.Cancel ||
        choose == this.MISAResoure.Dialog.Button.DoNotSave
      ) {
        this.$emit("closeForm");
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  width: 870px;
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
  grid-template-rows: 84px 84px 84px 84px 84px 84px;
  column-gap: 16px;
  /* row-gap: 20px; */
  padding: 0px 16px 0px 16px;
}
.popup-form__grid .grid__item:first-child {
  grid-column: 1/1;
}
.popup-form__grid
  :where(
    .grid__item:nth-child(2),
    .grid__item:nth-child(4),
    .grid__item:nth-child(6)
  ) {
  grid-column: 2/4;
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
