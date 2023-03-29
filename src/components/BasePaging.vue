<template>
  <ul class="table-footer__pagging">
    <li @click="previousPage">
      {{ "<" }}
    </li>

    <template v-if="totalPage < 4">
      <li
        v-for="(item, index) in totalPage"
        :key="index"
        :class="{ 'pagging__item--active': item == active }"
        @click="getValue(item)"
      >
        {{ item }}
      </li>
    </template>

    <template v-if="totalPage > 3">
      <template v-for="(item, index) in totalPage" :key="index">
        
        <li
          :class="{ 'pagging__item--active': item == active }"
          @click="getValue(item)"
        >
          {{ item }}
        </li>
      </template>
    </template>

    <li @click="nextPage">{{ ">" }}</li>
  </ul>
</template>

<script>
export default {
  name: "BasePaging",
  props: {
    msg: String,
    totalPage: Number,
  },
  data() {
    return {
      active: 1,
    };
  },
  methods: {
    getValue: function (val) {
      this.active = val;
      this.$emit("update:modelValue", val);
    },
    /**
     * Hàm xử lý lấy trang trước nó
     * Author NNduc(23/3/2023)
     */
    previousPage: function () {
      //active ở đây được coi như là trang hiện tại
      //nếu trang > 1 thì cho trang hiện tại trừ đi 1
      //còn không thì giữ nguyên trang hiện tại
      if (this.active > 1) this.active -= 1;

      this.getValue(this.active);
    },
    /**
     * Hàm xử lý lấy trang sau nó
     * Author NNduc(23/3/2023)
     */
    nextPage: function () {
      //active ở đây được coi như là trang hiện tại
      //nếu trang nhỏ hơn tổng số trang (trang cuối) thì cho trang hiện tại cộng thêm 1
      //còn không thì giữ nguyên trang hiện tại
      if (this.active < this.totalPage) this.active += 1;

      this.getValue(this.active);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
