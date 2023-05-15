<template>
  <label for="" v-if="lable"
    >{{ lable }} <span style="color: red" v-if="require">*</span></label
  >
  <div class="txt-box--mount">
    <input
      class="txt-box txt-box-al--r"
      type="text"
      v-model.trim="value"
      :class="{ 'input-err': isValid, 'txt-box--disable': disable }"
      @blur="onBlurInputValidate"
      :disabled="disable"
      min="0"
      ref="input"
      @focus="onFocusInputListener"
      @input="sendValue($event.target.value)"
      @keydown.up.prevent="upValue"
      @keydown.down.prevent="downValue"
      @keypress="onlyNumberKey($event)"
    />
    <div class="icon-dr-up" @click="upValue"></div>
    <div class="icon-dr-down" @click="downValue"></div>
  </div>
  <div class="txt--error" style="color: red" v-if="isValid && txtValid != ''">
    {{ txtValid }}
  </div>
</template>

<script>
export default {
  name: "InputMount",
  props: {
    modelValue: Number,
    typeInput: String,
    lable: String,
    placeholder: String,
    require: Boolean,
    disable: Boolean,
    name: String,
  },
  data() {
    return {
      value: null,
      isValid: false,
      txtValid: null,
    };
  },
  created() {
    this.value = this.setFormatValue(this.modelValue);
    //this.value = this.modelValue;
  },
  watch: {
    modelValue: function (nVal) {
      this.value =
        nVal.toString().length > 3 || isNaN(nVal)
          ? this.MISACommon.formatMoney(nVal)
          : this.setFormatValue(nVal);
      // this.value = nVal;
    },
  },
  methods: {
    /**
     * @description: Gửi giá trị sang component con
     * @param: {any}
     * Author: NNduc (09/05/2023)
     */
    sendValue: function (nVal) {
      if (nVal == "000") this.value = "00";
      const amount =
        nVal == "" || isNaN(this.MISACommon.convertMoneyToNum(nVal))
          ? NaN
          : this.MISACommon.convertMoneyToNum(nVal);
      this.$emit("update:modelValue", amount);
    },

    /**
     * @description:Xử lý sự kiện ấn núp lên để tăng giá trị
     * @param: {any}
     * Author: NNduc (09/05/2023)
     */
    upValue: function () {
      if (this.value === "" || this.value == null || isNaN(this.value))
        this.value = 0;
      this.$refs.input.focus();
      this.value = this.setFormatValue(++this.value);
      this.$emit("update:modelValue", parseInt(this.value));
    },
    /**
     * @description:Xử lý sự kiện để giảm giá trị xuống
     * @param: {any}
     * Author: NNduc (09/05/2023)
     */
    downValue: function () {
      this.$refs.input.focus();
      if (this.value == 0) return;
      this.value = this.setFormatValue(--this.value);
      this.$emit("update:modelValue", parseInt(this.value));
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
     * @description: Sự kiện khi onblur
     * @param: {any}
     * Author: NNduc (06/04/2023)
     */
    onBlurInputValidate: function () {
      if (
        (this.value === "" || this.value == null || isNaN(this.value)) &&
        this.require
      ) {
        this.isValid = true;
        this.txtValid = this.MISAResoure.Validate.Required(this.lable);
      } else {
        this.isValid = false;
        this.txtValid = "";
      }
    },
    onlyNumberKey: function (evt) {
      // Only ASCII character in that range allowed
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    setFormatValue: function (value) {
      try {
        var s = "";
        if (value >= 0 && value < 10) {
          s = "0" + value;
        } else s = value;
        return s;
      } catch {
        return "0";
      }
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.input-err {
  border: 1px solid red;
}
</style>
