<template>
  <label for="" v-if="lable"
    >{{ lable }} <span style="color: red" v-if="require">*</span></label
  >
  <input
    type="text"
    class="txt-box txt-box-al--r txt-box--number-nb"
    v-model="value"
    :class="{ 'input-err': isValid, 'txt-box--disable': disable }"
    @blur="onBlurInputValidate"
    :disabled="disable"
    @keypress="onlyNumberKey($event)"
  />
  <div class="txt--error" style="color: red" v-if="isValid">{{ txtValid }}</div>
</template>

<script>
export default {
  name: "InputMoney",
  props: {
    modelValue: Number,
    typeInput: String,
    lable: String,
    placehoder: String,
    require: Boolean,
    disable: Boolean,
  },
  data() {
    return {
      value: null,
      isValid: false,
      txtValid: null,
    };
  },
  created() {
    this.value = this.modelValue;this.MISACommon.formatMoney(this.modelValue)
  },
    watch: {
      value: function (nVal) {
        const money =  this.MISACommon.convertMoneyToNum(nVal);
        this.$emit("update:modelValue", money);
      },
      modelValue:function(nVal){
       this.value = this.MISACommon.formatMoney(nVal);
      }
    },
  methods: {
    onBlurInputValidate: function () {
      if ((this.value === "" || this.value == null) && this.require) {
        this.isValid = true;
        this.txtValid = this.lable + " không được để trống";
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
