<template>
  <label for="" v-if="lable && hasLable"
    >{{ lable }} <span style="color: red" v-if="require">*</span></label
  >
  <input
    type="text"
    class="txt-box txt-box-al--r txt-box--number-nb"
    v-model="value"
    :class="{
      'input-err': isValid,
      'txt-box--disable': disable,
      'placeholder-normal': styleplaceholder == 'normal',
    }"
    @blur="onBlurInputValidate"
    :disabled="disable"
    @keypress="onlyNumberKey($event)"
    @input="sendValue($event.target.value)"
    ref="input"
    @focus="onFocusInputListener"
    :maxlength="maxLength"
  />
  <div class="txt--error" style="color: red" v-if="isValid && txtValid != ''">
    {{ txtValid }}
  </div>
</template>

<script>
export default {
  name: "InputMoney",
  props: {
    modelValue: Number,
    typeInput: String,
    lable: String,
    hasLable: {
      type: Boolean,
      default: true,
    },
    placeholder: String,
    styleplaceholder: String,
    require: Boolean,
    disable: Boolean,
    name: String,
    maxLength: {
      type: Number,
      default: 524288,
    },
  },
  data() {
    return {
      value: null,
      isValid: false,
      txtValid: null,
    };
  },
  created() {
    // this.value = this.modelValue;
    this.value = this.MISACommon.formatMoney(this.modelValue);
  },
  watch: {
    // value: function (nVal) {
    //   const money =
    //     nVal == "" || isNaN(nVal)
    //       ? NaN
    //       : this.MISACommon.convertMoneyToNum(nVal);
    //   this.$emit("update:modelValue", money);
    // },
    modelValue: function (nVal) {
      this.value = this.MISACommon.formatMoney(nVal);
    },
  },
  methods: {
    /**
     * @description: Sự kiện focus để lấy name chuyển sang component cha
     * @param: {any}
     * Author: NNduc (21/04/2023)
     */
    onFocusInputListener: function () {
      this.$emit("onFocusInputListener", this.name);
    },

    sendValue: function (nVal) {
      const money =
        nVal == "" || isNaN(this.MISACommon.convertMoneyToNum(nVal))
          ? NaN
          : this.MISACommon.convertMoneyToNum(nVal);
      if(money==0) this.value = 0;
      this.$emit("update:modelValue", money);

    },
    onBlurInputValidate: function () {
      if ((this.value === "" || this.value == null) && this.require) {
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
