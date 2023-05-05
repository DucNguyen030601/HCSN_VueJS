<template>
  <label for="" v-if="lable"
    >{{ lable }} <span style="color: red" v-if="require">*</span></label
  >
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
  <div class="txt--error" style="color: red" v-if="isValid">{{ txtValid }}</div>
</template>

<script>
export default {
  name: "InputDate",
  props: {
    modelValue: String,
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
        this.value = this.modelValue;
  },
  watch: {
    value: function (nVal) {
      this.$emit("update:modelValue", nVal);
    },
    modelValue: function (nVal) {
      this.value = nVal;
    },
  },
  methods: {
    onBlurInputValidate: function () {
      if ((this.value === "" || this.value == null) && this.require) {
        this.isValid = true;
        this.txtValid = this.MISAResoure.Validate.Required(this.lable);
      } else this.isValid = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
