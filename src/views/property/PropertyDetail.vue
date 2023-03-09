<template>
  <div class="popup">
    <div class="popup-form">
      <div class="popup-form__header">
        <h2>{{ title }}</h2>
        <div class="header__close" style="cursor: pointer" @click="closeForm">
           <div class="tooltip" >
              <div class="icon-close-popup"></div>
              <span class="tooltip__text">Đóng</span>
            </div>

        </div>
      </div>

      <div class="popup-form__grid">
        <div class="grid__item">
          <input-text-vue
            v-model="model.EmployeeCode"
            lable="Mã tài sản"
            :require="true"
            placehoder="Nhập mã tài sản"
          />
        </div>

        <div class="grid__item">
          <input-text-vue
            v-model="model.FullName"
            lable="Tên tài sản"
            :require="true"
            placehoder="Nhập tên tài sản"
          />
        </div>
        <div class="grid__item">
          <base-combobox-vue
            lable="Mã loại tài sản"
            placehoder="Chọn mã bộ phận sử dụng"
            :require="true"
            :checkActive="true"
            :api="MISAResoure.API.Pos.Get"
            get="PositionCode"
            send="PositionName"
            v-model="model.PositionCode"
            v-model:PositionName="model.PositionName"
          />
        </div>
        <div class="grid__item">
           <input-text-vue
            v-model="model.PositionName"
            lable="Tên bộ phận sử dụng"
            :disable="true"
          />
        </div>
        <div class="grid__item">
          <base-combobox-vue
            lable="Mã loại tài sản"
            placehoder="Chọn mã loại tài sản"
            :require="true"
            :checkActive="true"
            :api="MISAResoure.API.Dept.Get"
            get="DepartmentCode"
            send="DepartmentName"
            v-model="model.DepartmentCode"
            v-model:DepartmentName="model.DepartmentName"
          />
        </div>
        <div class="grid__item">
             <input-text-vue
            v-model="model.DepartmentName"
            lable="Tên tài loại tài sản"
            :disable="true"
          />
        </div>
        <div class="grid__item">
          <input-mount-vue
            lable="Số lượng"
            v-model="model.EducationalBackground"
            :require="true"
          />
        </div>

        <div class="grid__item">
          <input-money-vue
            lable="Nguyên giá"
            v-model="model.OriginalPrice"
            :require="true"
          />
        </div>
        <div class="grid__item">
          <input-number-vue
            lable="Số năm sử dụng"
            v-model="model.NumberOfYear"
            :require="true"
          />
        </div>
        <div class="grid__item">
          <input-mount-vue
            lable="Tỷ lệ hao mòn (%)"
            v-model="model.WearRate"
            :require="true"
          />
        </div>
        <div class="grid__item">
          <input-money-vue
            lable="Giá trị hao mòn năm"
            v-model="model.DepreciationYear"
            :require="true"
          />
        </div>
        <div class="grid__item">
          <input-text-vue
            lable="Năm theo dõi"
            v-model="model.YearOfTracking"
            :disable="true"
          />
        </div>
        <div class="grid__item">
          <input-date-vue
            lable="Ngày mua"
            v-model="model.DatePurchase"
            :require="true"
          />
        </div>
        <div class="grid__item">
          <input-date-vue
            lable="Ngày bắt đầu sử dụng"
            v-model="model.DayStartedUsing"
            :require="true"
          />
        </div>
      </div>
      <div class="popup-form__footer">
        <button
          class="btn btn--primary"
          id="btnSave"
          style="width: 120px"
          @click="btnOnClickSave"
        >
          Lưu
        </button>
        <button class="btn" style="width: 120px" @click="btnOnClickCancel">
          Huỷ
        </button>
      </div>
    </div>
  </div>
  <the-dialog-vue
    ref="dialog"
    v-show="isShowDialog"
    @onChoose="btnOnClickChooseDialog"
  />
</template>
<script>
export default {
  name: "PropertyDetail",
  props: {
    title: {
      type: String,
      required: true,
    },
    employee: {
      type: Object,
    },
    state: {
      type: Number,
      required: true,
    },
  },
  created() {
    //gán dữ liệu mới sang dữ liệu cũ
    this.EX_EMPLOYEE = JSON.stringify(this.employee);
    //gán dữ liệu sang data
    this.model = JSON.parse(this.EX_EMPLOYEE);
  },
  data() {
    return {
      model: null, //lưu dữ liệu mới
      EX_EMPLOYEE: null, //lưu trữ dữ liệu cũ,
      isShowDialog: false,
    };
  },
  methods: {
    /**
     * Kiểm tra thông tin các trường
     * Author NNduc (5/3/2023)
     */
    validateForm: function () {
      if (!this.model.EmployeeCode) {
        this.showDialog(
          this.MISAResoure.Dialog.Title.Validate("Mã tài sản"),
          this.MISAResoure.Dialog.Button.Close
        );
        return false;
      }
      if (!this.model.FullName) {
        this.showDialog(
          this.MISAResoure.Dialog.Title.Validate("Tên tài sản"),
          this.MISAResoure.Dialog.Button.Close
        );
        return false;
      }
      return true;
    },

    /**
     * Đóng form
     * Author: NNDuc (2/3/2023)
     */
    closeForm: function () {
      console.log(this.model);
      //kiểm tra hỏi có muốn thay đổi dữ liệu không? nếu có sẽ show cảnh báo
      const NW_EMPLOYEE = JSON.stringify(this.model);
      if (NW_EMPLOYEE != this.EX_EMPLOYEE) {
        //gán các thông tin vào cảnh báo
        let title = this.MISAResoure.Dialog.Title.EditWarning;
        let titleBtnPr = this.MISAResoure.Dialog.Button.Save;
        let titleBtnSub = this.MISAResoure.Dialog.Button.DoNotSave;
        let titleBtnOut = this.MISAResoure.Dialog.Button.Cancel;
        this.showDialog(title, titleBtnPr, titleBtnOut, titleBtnSub);
      } else {
        //gán các thông tin vào cảnh báo
        let title = this.MISAResoure.Dialog.Title.Warning;
        let titleBtnPr = this.MISAResoure.Dialog.Button.Save;
        let titleBtnOut = this.MISAResoure.Dialog.Button.Cancel;
        this.showDialog(title, titleBtnPr, titleBtnOut);
      }
    },
    /**
     * Xử lý sự kiện click Huỷ form
     * Author: NNduc(5/3/2023)
     */
    btnOnClickCancel: function () {
      this.closeForm();
    },
    /**
     * Xử lý sự kiện click Lưu form
     * Author: NNduc(5/3/2023)
     */
    btnOnClickSave: function () {
      if (this.validateForm()) {
        if (this.state == this.MISAEnum.FormState.Add) {
          //Xử lý dialog form thêm
        } else if (this.state == this.MISAEnum.FormState.Edit) {
          //Xử lý dialog form sửa
        } else {
          //Xử lý dialog form nhân bản
        }
      }
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
      } else if (
        choose == this.MISAResoure.Dialog.Button.Cancel ||
        choose == this.MISAResoure.Dialog.Button.DoNotSave
      ) {
        this.$emit("closeForm");
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
<style >
.popup {
  background-color: rgba(0, 0, 0, 0.16);
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  position: fixed;
}
.popup-form {
  background-color: white;
  position: absolute;
  width: 800px;
  top: 50%;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  left: 50%;
  transform: translate(-50%, -50%);
}

.popup-form__header {
  display: flex;
  justify-content: space-between;
  padding: 16px 16px 20px 16px;
}

.popup-form__grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 16px;
  row-gap: 20px;
  padding: 0px 16px 20px 16px;
}
.grid__item .dropdown,
.grid__item .txt-box--number,
.grid__item .txt-box--date {
  margin-top: 8px;
}
.grid__item > input {
  margin-top: 8px;
}

.grid__item input,
.grid__item .txt-box--number {
  height: 37px;
  width: 100%;
}
.grid__item .dropdown {
  width: 100%;
  height: 37px;
}

.grid__item input::placeholder {
  font-style: italic;
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
.txt--error {
  font-size: 13px;
}
</style>
