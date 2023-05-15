<template>
  <label for="" v-if="lable"
    >{{ lable }} <span style="color: red" v-if="require">*</span></label
  >
  <div class="txt-box--date-custom">
    <input
      class="txt-box"
      :class="{ 'input-err': isValid, 'txt-box--disable': disable }"
      :placeholder="type"
      v-model="value"
      @blur="onBlurInputValidate()"
      @keypress="onKeyPressInput($event)"
      ref="input"
      @focus="onFocusInputListener"
    />
    <div class="icon-date" ref="a"></div>
    <input
      type="date"
      ref="inputDate"
      @change="onChangeInputDate($event)"
      tabindex="-1"
    />
  </div>
  <div class="txt--error" style="color: red" v-if="isValid && txtValid != ''">
    {{ txtValid }}
  </div>
</template>

<script>
export default {
  name: "InputDateCustom",
  props: {
    type: String,
    modelValue: String,
    lable: String,
    placeholder: String,
    require: Boolean,
    disable: Boolean,
    name: String,
  },
  created() {
    this.value = this.MISACommon.formatDateByType(this.modelValue, this.type);
  },
  data() {
    return {
      value: null,
      isValid: false,
      txtValid: null,
    };
  },
  methods: {
    /**
     * @description: Hàm set giá trị khi thay đổi input date
     * @param: {e} sự kiện từ input date
     * Author: NNduc (05/04/2023)
     */
    onChangeInputDate(e) {
      //nếu không có giá trị thì set input text bằng rỗng
      if (!e.target.value) this.value = "";
      else {
        //ngược lại, sẽ format date lại date theo props type
        this.value = this.MISACommon.formatDateByType(
          e.target.value,
          this.type
        );
        this.isValid = false;
      }
      this.$emit("update:modelValue", this.parseDate(this.value));
    },

    onBlurInputValidate() {
      let date = this.parseDate(this.value);
      if (!Date.parse(date)) {
        this.value = "";
        this.$refs.inputDate.value = "";
        if (this.require) {
          this.isValid = true;
          this.txtValid = this.MISAResoure.Validate.Required(this.lable);
        }
      } else {
        this.value = this.MISACommon.formatDateByType(date, this.type);
        this.isValid = false;
        this.txtValid = "";
      }
      this.$emit("update:modelValue", this.parseDate(this.value));
    },
    onKeyPressInput(evt) {
      var charCode = evt.keyCode;
      if (charCode > 31 && (charCode < 47 || charCode > 57) && charCode) {
        evt.preventDefault();
      }
      if (charCode == this.MISAEnum.KeyCode.Enter) {
        this.$refs.inputDate.showPicker();
      }
    },

    /**
     * @description: Đổi định dạng ngày tháng sang mặc định
     * VD: 12/02/2023 -> 2023-02-12
     * @param: {date} ngày tháng muốn đổi
     * Author: NNduc (05/04/2023)
     */
    parseDate(date) {
      if (date) {
        let splits = date.split("/");
        if (this.type == "dd/mm/yyyy")
          return `${splits[2]}-${splits[1]}-${splits[0]}`;
        else if (this.type == "mm/dd/yyyy")
          return `${splits[2]}-${splits[0]}-${splits[1]}`;
        else return `${splits[0]}-${splits[1]}-${splits[2]}`;
      } else return null;
    },
    /**
     * @description: Focus cho input
     * @param: {any}
     * Author: NNduc (11/04/2023)
     */
    autoFocusComplete: function () {
      this.$refs.input.focus();
    },
    /**
     * @description: Sự kiện focus để lấy name chuyển sang component cha
     * @param: {any}
     * Author: NNduc (21/04/2023)
     */
    onFocusInputListener: function () {
      this.$emit("onFocusInputListener", this.name);
    },

    /**
     * @description: Hiện cảnh báo và hiện text khi người dùng sai thông tin
     * @param: {any}
     * Author: NNduc (29/04/2023)
     */
    showTextValidate() {
      this.$refs.input.blur();
      this.isValid = true;
      //this.txtValid = s;
    },
  },
};
</script>
<style scoped>
.input-err {
  border: 1px solid red;
}
.txt-box--date-custom input::placeholder {
  font-style: normal;
  color: black;
}
</style>
