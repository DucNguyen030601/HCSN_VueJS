<template>
  <label for="" v-if="lable"
    >{{ lable }} <span style="color: red" v-if="require">*</span></label
  >
  <input
    type="text"
    class="txt-box"
    :placeholder="placeholder"
    v-model.trim="value"
    :class="{ 'input-err': isValid, 'txt-box--disable': disable,'placeholder-normal':styleplaceholder=='normal' }"
    @blur="onBlurInputValidate"
    @input="$emit('update:modelValue', $event.target.value)"
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
    lable: String,
    placeholder: String,
    styleplaceholder:String,
    require: Boolean,
    disable: Boolean,
    isFocus: Boolean,
    sizeH:Number,
    sizeW:Number,
    maxLength:{
      type:Number,
      default:524288
    },
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
    this.value = this.modelValue;
  },
  watch: {
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
