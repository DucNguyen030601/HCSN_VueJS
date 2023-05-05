<template>
  <label for="" v-if="lable"
    >{{ lable }} <span style="color: red" v-if="require">*</span></label
  >
  <input
    type="text"
    class="txt-box txt-box-al--r txt-box--number-nb"
    v-model.trim="value"
    :class="{ 'input-err': isValid, 'txt-box--disable': disable }"
    @blur="onBlurInputValidate"
    :disabled="disable"
    @keypress="onlyNumberKey($event)"
    @input="sendValue($event.target.value)"
    ref="input"
    @focus="onFocusInputListener"
  />
  <div class="txt--error" style="color: red" v-if="isValid && txtValid!=''">{{ txtValid }}</div>
</template>

<script>
export default {
  name: "InputNumber",
  props: {
    modelValue: String,
    typeInput: String,
    lable: String,
    placehoder: String,
    require: Boolean,
    disable: Boolean,
    name: Object,
  },
  data() {
    return {
      value: null,
      isValid: false,
      txtValid: null,
    };
  },
  created() {
    this.value = this.modelValue;
  },
  watch: {
    modelValue: function (nVal) {
      this.value = isNaN(nVal) ? "" : nVal;
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

    /**
     * @description: Sự kiện gửi giá trị sang component cha
     * @param: {NVal} giá trị của input
     * Author: NNduc (11/04/2023)
     */
    sendValue: function (nVal) {
      this.$emit("update:modelValue", parseInt(nVal));
    },
    /**
     * @description: Sự kiện blur input
     * @param: {any}
     * Author: NNduc (11/04/2023)
     */
    onBlurInputValidate: function () {
      if (
        (this.value === "" || this.value == null || isNaN(this.value)) &&
        this.require
      ) {
        this.isValid = true;
        this.txtValid = this.MISAResoure.Validate.Required(this.lable);
      } else this.isValid = false;
    },
    onlyNumberKey: function (evt) {
      // Only ASCII character in that range allowed
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      }else {
        this.isValid = false
        this.txtValid='';
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
    showTextValidate(){
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
