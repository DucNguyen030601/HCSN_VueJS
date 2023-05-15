<template>
  <div class="no-data" :class="{ 'no-data--medium': size=='medium' }">
    <div class="no-data__image"></div>
    <h4>Không có dữ liệu.</h4>
  </div>
</template>

<script>
export default {
  name: "TableNoData",
  props: {
    msg: String,
    size:String
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.no-data__image {
  background-image: url("../assets/icon/no-data.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  height: 90px;
  width: 90px;
}

.no-data--medium .no-data__image {
  height: 45px;
  width: 45px;
}
</style>
