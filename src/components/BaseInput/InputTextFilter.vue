
<template>
  <label for="" v-if="lable">{{ lable }} </label>
  <div
    class="txt-box--filter"
    :style="{ height: sizeH + 'px', width: sizeW + 'px' }"
  >
    <div class="icon-search"></div>
    <input
      class="txt-box"
      :placeholder="placeholder"
      @keydown.enter="$emit('update:modelValue', $event.target.value)"
      v-model.trim="value"
      ref="input"
      :maxlength="maxLength"
      @focus="onFocusInputListener"
    />
  </div>
</template>

<script>
export default {
  name: "InputTextFilter",
  props: {
    modelValue: String,
    lable: String,
    placeholder: String,
    stylePlaceholder: String,
    isFocus: Boolean,
    disable: Boolean,
    sizeH: Number,
    sizeW: Number,
    maxLength: {
      type: Number,
      default: 524288,
    },
    name: String,
  },
  data() {
    return {
      value: null,
    };
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
    onFocusInputListener: function () {
      this.$emit("onFocusInputListener", this.name);
    },
  },
};
</script>

<style scope>
.txt-box--filter {
  position: relative;
}

.txt-box--filter .icon-search {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 10px;
}

.txt-box--filter input {
  width: 100%;
  height: 100%;
  padding: 11px 38px 10px 38px;
}
</style>