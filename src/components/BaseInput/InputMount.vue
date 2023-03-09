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
      @input="setFormatValue($event.target.value)"
      min="1"
      max="100"
    />
    <div class="icon-ip-number"></div>
  </div>
  <div class="txt--error" style="color: red" v-if="isValid">{{ txtValid }}</div>
</template>

<script>
export default {
  name: "InputMount",
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
    this.value = this.setFormatValue(this.modelValue);
  },
  watch: {
    value: function (nVal) {
      this.$emit("update:modelValue", parseInt(nVal));
    },
    modelValue: function (nVal) {
      this.value = this.setFormatValue(nVal);
    },
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
    setFormatValue: function (value) {
      let s = parseInt(value);
      if (value > 0 && value < 10) {
        s = "0" + value;
      }
      return s;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
