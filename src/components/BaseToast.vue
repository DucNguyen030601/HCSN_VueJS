<template>
  <div class="toast" :class="{ 'toast--error': !isSuccess }">
    <div :class="isSuccess ? 'icon-toast-success' : 'icon-toast-error'"></div>
    <div class="toast__content">
      {{ isSuccess ? MISAResoure.Toast.Success : MISAResoure.Toast.Error }}
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseToast",
  props: {
    msg: String,
    isSuccess: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
