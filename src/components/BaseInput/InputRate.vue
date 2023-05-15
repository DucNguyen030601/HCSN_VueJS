<template>
  <label for="" v-if="lable"
    >{{ lable }} <span style="color: red" v-if="require">*</span></label
  >
  <div class="txt-box--number">
    <input
      class="txt-box txt-box-al--r"
      type="number"
      v-model.trim="value"
      :class="{ 'input-err': isValid, 'txt-box--disable': disable }"
      @blur="onBlurInputValidate"
      :disabled="disable"
      min="0"
      max="1"
      step="0.1"
      @focus="onFocusInputListener"
    />
    <div class="icon-ip-number" ></div>
  </div>
  <div class="txt--error" style="color: red"  v-if="isValid && txtValid!=''">{{ txtValid }}</div>
</template>

<script>
export default {
  name: "InputRate",
  props: {
    modelValue: Number,
    typeInput: String,
    lable: String,
    placeholder: String,
    require: Boolean,
    disable: Boolean,
    name:String
  },
  data() {
    return {
      value: null,
      isValid: false,
      txtValid: null,
    };
  },
  created() {
    this.value = (this.modelValue * 100).toFixed(2);
  },
  watch: {
    value: function (nVal) {
      this.$emit("update:modelValue", this.setFormatValue(nVal));
    },
    modelValue: function (nVal) {
      //this.value = this.setFormatValue(nVal);
      this.value =  (nVal * 100).toFixed(2);
    },
  },
  methods: {
           /**
     * @description: Sự kiện focus để lấy name chuyển sang component cha 
     * @param: {any}
     * Author: NNduc (21/04/2023)
     */
    onFocusInputListener:function(){
      this.$emit("onFocusInputListener",this.name);
    },
    onBlurInputValidate: function () {
      if ((this.value === "" || this.value == null) && this.require) {
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
      } else {
        return true;
      }
    },
    setFormatValue: function (value) {
      return parseFloat((value / 100).toFixed(4));
    },
    
    /**
     * @description: Hiện cảnh báo và hiện text khi người dùng sai thông tin
     * @param: {any}
     * Author: NNduc (29/04/2023)
     */
    showTextValidate(){

      this.isValid = true;
      //this.txtValid = s;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.input-err{
   border: 1px solid red;
}
</style>
