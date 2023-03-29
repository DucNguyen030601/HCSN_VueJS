<template>
  <div class="loading-process">
    <div class="process"></div>
  </div>
</template>

<script>
export default {
  name: "LoadingProcess",
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loading-process{
	background-color: rgba(0, 0, 0, 0.16);
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    position: fixed;
}

.process {
   top: 50%;
   left: 50%;
   position: absolute;
  transform: translate(-50%, -50%);
  border: 10px solid #ffffff;
  border-radius: 50%;
  border-top: 10px solid #3498db;
  width: 70px;
  height: 70px;
  -webkit-animation: spin 1s linear infinite; /* Safari */
  animation: spin 1s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
