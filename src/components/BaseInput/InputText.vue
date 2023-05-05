<template>
  <label for="" v-if="lable"
    >{{ lable }} <span style="color: red" v-if="require">*</span></label
  >
  <input
    type="text"
    class="txt-box"
    :placeholder="placehoder"
    v-model.trim="value"
    :class="{ 'input-err': isValid, 'txt-box--disable': disable,'placehoder-normal':stylePlacehoder=='normal' }"
    @blur="onBlurInputValidate"
    :disabled="disable"
    ref="input"
    :maxlength="maxLength"
    @focus="onFocusInputListener"
  />
  <div class="txt--error" style="color: red" v-if="isValid && txtValid!=''">{{ txtValid }}</div>
</template>

<script>
export default {
  name: "InputText",
  props: {
    modelValue: String,
    typeInput: String,
    lable: String,
    placehoder: String,
    stylePlacehoder:String,
    require: Boolean,
    disable: Boolean,
    isFocus: Boolean,
    maxLength:{
      type:Number,
      default:524288
    },
    name:Object
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
  mounted() {
    if (this.isFocus) {
       this.$nextTick(function () {
        this.autoFocusComplete();
      });
    }
  },
  methods: {
    /**
     * @description: Xử lý sự kiện khi blur
     * @param: {any}
     * Author: NNduc (20/03/2023)
     */
    onBlurInputValidate: function () {
      if ((this.value === "" || this.value == null) && this.require) {
        this.isValid = true;
        this.txtValid = this.MISAResoure.Validate.Required(this.lable);
      } else {
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
     * @description: Sự kiện focus để lấy name chuyển sang component cha 
     * @param: {any}
     * Author: NNduc (21/04/2023)
     */
    onFocusInputListener:function(){
      this.$emit("onFocusInputListener",this.name);
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
