<template>
     <div class="toast">
        <div class="icon-toast-sucess"></div>
        <div class="toast__content">Lưu dữ liệu thành công!</div>
    </div>
</template>

<script>
export default {
  name: 'BaseToast',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
