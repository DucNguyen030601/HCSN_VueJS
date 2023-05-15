<template>
  <div class="table-footer">
    <div class="table-footer__info">
      <span
        >Tổng số: <span style="font-weight: bold">{{ totalRecord }}</span> bản
        ghi
      </span>
    </div>

    <base-combobox-vue
      :typeUp="true"
      v-model="dPageSize"
      :arrData="arrPage"
      :isReadOnly="true"
      v-if="arrPage"
    />

    <ul class="table-footer__pagging" v-if="totalPage">
      <li @click="previousPage" :class="{ disable: dPage == 1 }">
        <div class="icon-previous-page"></div>
      </li>
      <template v-for="(item, index) in pages" :key="index">
        <li
          :class="{ 'pagging__item--active': item == dPage }"
          @click="getValue(item)"
        >
          {{ item }}
        </li>
      </template>

      <li @click="nextPage" :class="{ disable: dPage == totalPage }">
        <div class="icon-next-page"></div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "BasePaging",
  props: {
    msg: String,
    page: Number,
    pageSize: Number,
    totalPage: Number,
    totalRecord: Number,
    arrPage: Array,
  },
  created() {
    this.dPage = this.page;
    this.dPageSize = this.pageSize;
  },
  data() {
    return {
      dPage: null,
      dPageSize: null,
    };
  },
  computed: {
    /**
     * @description: Trả về 1 mảng phần tử trang hiện lên màn hình
     * @param: {any}
     * Author: NNduc (31/03/2023)
     */
    pages() {
      let page = [];
      for (let index = 1; index <= this.totalPage; index++) {
        if (
          index == 1 ||
          index == this.totalPage ||
          (index <= this.dPage + 2 && index >= this.dPage - 2)
        ) {
          page.push(index);
        } else if (index == this.dPage + 3 || index == this.dPage - 3) {
          page.push("...");
        }
      }
      return page;
    },
  },
  watch: {
    dPageSize: function (nVal) {
      this.$emit("update:pageSize", nVal);
      this.$emit("update:page", 1);
      this.dPage = 1;
    },
    page: function (nVal) {
      this.dPage = nVal;
    },
  },
  methods: {
    getValue: function (val) {
      if (val == "...") return;
      this.dPage = val;
      this.$emit("update:page", val);
    },
    /**
     * Hàm xử lý lấy trang trước nó
     * Author NNduc(23/3/2023)
     */
    previousPage: function () {
      //active ở đây được coi như là trang hiện tại
      //nếu trang > 1 thì cho trang hiện tại trừ đi 1
      //còn không thì giữ nguyên trang hiện tại
      if (this.dPage > 1) this.dPage -= 1;

      this.getValue(this.dPage);
    },
    /**
     * Hàm xử lý lấy trang sau nó
     * Author NNduc(23/3/2023)
     */
    nextPage: function () {
      //active ở đây được coi như là trang hiện tại
      //nếu trang nhỏ hơn tổng số trang (trang cuối) thì cho trang hiện tại cộng thêm 1
      //còn không thì giữ nguyên trang hiện tại
      if (this.dPage < this.totalPage) this.dPage += 1;

      this.getValue(this.dPage);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.disable {
  opacity: 0.5;
  cursor: not-allowed;
}
.icon-previous-page {
  background: url("../assets/icon/qlts-icon.png") no-repeat -206px -248px;
  width: 5px;
  height: 8px;
}
.icon-next-page {
  background: url("../assets/icon/qlts-icon.png") no-repeat -250px -248px;
  width: 5px;
  height: 8px;
}
</style>
