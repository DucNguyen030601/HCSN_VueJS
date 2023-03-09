<template>
  <label for="" v-if="lable"
    >{{ lable }} <span style="color: red" v-if="require">*</span></label
  >

  <template v-if="typeInput == 'number'">
    <div class="txt-box--number">
      <input
        class="txt-box txt-box-al--r"
        type="number"
        v-model.trim="value"
        :class="{ 'input-err': isValid, 'txt-box--disable': disable }"
        @blur="onBlurInputValidate"
        :disabled="disable"
        @input="setFormatValue(typeInput, $event.target.value)"
        @keypress="onlyNumberKey($event)"
        min="1"
        max="100"
      />
      <div class="icon-ip-number"></div>
    </div>
  </template>

  <template v-if="typeInput == 'text-number'">
    <input
      type="number"
      class="txt-box txt-box-al--r txt-box--number-nb"
      v-model.trim="value"
      :class="{ 'input-err': isValid, 'txt-box--disable': disable }"
      @blur="onBlurInputValidate"
      :disabled="disable"
      @input="setFormatValue(typeInput, $event.target.value)"
      @keypress="onlyNumberKey($event)"
    />
  </template>

  <template v-if="typeInput == 'rate'">
    <div class="txt-box--number">
      <input
        class="txt-box txt-box-al--r"
        type="number"
        v-model.trim="value"
        :class="{ 'input-err': isValid, 'txt-box--disable': disable }"
        @blur="onBlurInputValidate"
        :disabled="disable"
        @input="setFormatValue(typeInput, $event.target.value)"
        min="1"
        max="100"
      />
      <div class="icon-ip-number"></div>
    </div>
  </template>

  <template v-if="typeInput == 'text-money'">
    <input
      type="text"
      class="txt-box txt-box-al--r txt-box--number-nb"
      v-model.trim="value"
      :class="{ 'input-err': isValid, 'txt-box--disable': disable }"
      @blur="onBlurInputValidate"
      :disabled="disable"
      @keypress="onlyNumberKey($event)"
    />
  </template>

  <template v-if="typeInput == 'text'">
    <input
      type="text"
      class="txt-box"
      :placeholder="placehoder"
      v-model.trim="value"
      :class="{ 'input-err': isValid, 'txt-box--disable': disable }"
      @blur="onBlurInputValidate"
      :disabled="disable"
    />
  </template>

  <template v-if="typeInput == 'date'">
    <div class="txt-box--date">
      <input
        type="date"
        class="txt-box"
        placeholder="Nhập nội dung"
        v-model.trim="value"
        :class="{ 'input-err': isValid, 'txt-box--disable': disable }"
        @blur="onBlurInputValidate"
        :disabled="disable"
      />
      <div class="icon-date"></div>
    </div>
  </template>

  <div class="txt--error" style="color: red" v-if="isValid">{{ txtValid }}</div>
</template>

<script>
export default {
  name: "BaseInput",
  props: {
    modelValue: [String, Number, Boolean],
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
    //this.setFormatValue(this.typeInput, this.modelValue);
    this.value = this.modelValue;
    if (this.require) this.txtValid = this.lable + " không được để trống";
  },
  watch: {
    // value: function (nVal) {
    //   this.$emit(
    //     "update:modelValue",
    //     this.getFormatValue(this.typeInput, nVal)
    //   );
    // },
    modelValue: function(nVal){
      this.value = nVal;
    }
  },
  methods: {
    onBlurInputValidate: function () {
      if ((this.value === "" || this.value == null) && this.require)
        this.isValid = true;
      else this.isValid = false;
    },

    setFormatValue: function (typeInput, value) {
      let s = value;
      if (typeInput == "number") {
        if (value > 0 && value < 10) {
          s = "0" + value;
        }
      }
      if(typeInput == "text-money"){
          s = this.MISACommon.formatMoney(s);
      }
      this.value = s;
    },
    getFormatValue: function (typeInput, value) {
      let s = value;
      if (typeInput == "number" || typeInput == "text-money") {
        s = parseInt(value);
      }
      return s;
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
.input-err {
  border: solid 1px red;
}
</style>
