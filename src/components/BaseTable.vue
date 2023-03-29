<template>
  <div class="table-section">
    <table>
      <thead>
        <tr>
          <th style="width: 39px">
            <input
              ref="checkBoxTitle"
              @change="stateCheckBoxes($event.target.checked)"
              type="checkbox"
            />
          </th>
          <th name="Sort" style="width: 52px">
            <div class="tooltip">
              STT <span class="tooltip__text">Số thứ tự</span>
            </div>
          </th>
          <th style="width: 101px">Mã tài sản</th>
          <th style="width: 225px">Tên tài sản</th>
          <th style="width: 235px">Loại tài sản</th>
          <th style="width: 256px">Bộ phận sử dụng</th>
          <th class="table__cell-right" style="width: 90px">Số lượng</th>
          <th class="table__cell-right" style="width: 125px">Nguyên giá</th>
          <th class="table__cell-right" style="width: 127px">
            <div class="tooltip">
              HM/KH luỹ kế
              <span class="tooltip__text">Hao mòn/Khấu hao luỹ kế</span>
            </div>
          </th>
          <th class="table__cell-right" style="width: 125px">
            Giá trị còn lại
          </th>
          <th style="width: 104px">Chức năng</th>
        </tr>
      </thead>
      <tbody>
        <tr
          @dblclick="dblclickRowTable(item.fixed_asset_id)"
          v-for="(item, index) in modelValue"
          :key="index"
          ref="trBody"
          :value="item.fixed_asset_id"
          :class="{ 'table-row-check': selectedItems[index] }"
        >
          <td>
            <input
              type="checkbox"
              ref="checkBoxItem"
              @change="stateCheckBox($event.target.checked, index)"
            />
          </td>
          <td>{{ dPageSize * (dPage - 1) + (index + 1) }}</td>
          <td>{{ item.fixed_asset_code }}</td>
          <td>{{ item.fixed_asset_name }}</td>
          <td>{{ item.fixed_asset_category_name }}</td>
          <td>{{ item.department_name }}</td>
          <td class="table__cell-right">{{ item.quantity }}</td>
          <td class="table__cell-right">
            {{ MISACommon.formatMoney(item.cost) }}
          </td>
          <td class="table__cell-right">
            {{ MISACommon.formatMoney(item.accumulated_depreciation) }}
          </td>
          <td class="table__cell-right">
            {{ MISACommon.formatMoney(item.residual_value) }}
          </td>
          <td>
            <button
              @click="openForm(MISAEnum.FormState.Edit, item.fixed_asset_id)"
            >
              <div class="tooltip">
                <div class="icon-edit"></div>
                <span class="tooltip__text">Sửa</span>
              </div>
            </button>
            <button
              @click="openForm(MISAEnum.FormState.Clone, item.fixed_asset_id)"
            >
              <div class="tooltip">
                <div class="icon-copy"></div>
                <span class="tooltip__text">Nhân bản</span>
              </div>
            </button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="6">
            <div class="table-footer">
              <div class="table-footer__info">
                <span
                  >Tổng số:
                  <span style="font-weight: bold">{{ totalRecord }}</span> bản
                  ghi
                </span>
              </div>
              <base-combobox-vue
                :typeUp="true"
                v-model="dPageSize"
                :arrData="arrPage"
              />
              <base-paging-vue v-model="dPage" v-model:totalPage="dTotalPage" />
            </div>
          </td>
          <td
            class="table__cell-right--bold"
            v-for="(item, index) in moreInfo"
            :key="index"
          >
            {{ MISACommon.formatMoney(item) }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
export default {
  name: "BaseTable",
  props: {
    msg: String,
    modelValue: Object,
    page: Number,
    pageSize: Number,
    totalPage: Number,
    totalRecord: Number,
    moreInfo: Array,
  },
  created() {
    this.dPage = this.page;
    this.dPageSize = this.pageSize;
    this.dTotalPage = this.totalPage;
    this.selectedItems = new Array(this.pageSize).fill(false);
  },
  data() {
    return {
      isShowForm: false,
      dPage: null,
      dPageSize: null,
      dPtotalPage: null,
      arrPage: ["10", "20", "30", "50", "100"],
      selectedItems: null,
    };
  },
  watch: {
    dPage: function (nVal) {
      this.$emit("update:page", nVal);
    },
    dPageSize: function (nVal) {
      this.$emit("update:pageSize", nVal);
    },
    totalPage: function (nVal) {
      this.dTotalPage = nVal;
    },
  },
  methods: {
    /**
     * Hàm lấy tất cả các nhân viên được check
     * Author NNduc (7/3/2023)
     */
    getAllCheckBoxfixedAssets: function () {
      var fixedAssets = [];
      var trBody = this.$refs.trBody;
      for (const key in trBody) {
        let checkbox = this.$refs.checkBoxItem[key].checked;
        if (checkbox) {
          let fixedAsset = {
            id: trBody[key].getAttribute("value"),
            code: trBody[key].cells[2].innerText,
            name: trBody[key].cells[3].innerText,
          };
          fixedAssets.push(fixedAsset);
        }
      }
      return fixedAssets;
    },

    /**
     * Hàm check tất cả các dòng theo đúng trạng thái của check box tiêu đề
     * Author NNduc(7/3/2023)
     * @param {*} check sẽ lấy giá trị của check box tiêu đề
     */
    stateCheckBoxes: function (check) {
      //lấy hết tất cả các check box của các dòng
      const checkBoxes = this.$refs.checkBoxItem;
      for (const key in checkBoxes) {
        checkBoxes[key].checked = check;
        this.selectedItems[key] = check;
      }
    },

    /**
     * Hàm kiểm tra trạng thái của check box nếu check thì cho style, ngược lại
     * Author NNduc (7/3/2023)
     * @param {*} td là thẻ tương ứng với checkbox
     */
    stateCheckBox: function (check, index) {
      console.log(check + "-" + index);
      //set trạng thái của selectedItems theo checkbox
      this.selectedItems[index] = check;

      //khi xử lý xong sẽ kiểm tra trạng thái của check box tiêu đề
      //nếu tất cả các dòng check hết rồi thì check tiêu đề, ngược lại
      this.$refs.checkBoxTitle.checked = this.isSateCheckBoxes();
    },

    /**
     * Hàm kiểm tra xem tất cả các dòng đã check hết chưa
     * Nếu check hết rồi sẽ cho check box tiêu đề, ngược lại
     * Author NNduc (7/3/2023)
     * @returns trả về giá trị true hoặc false
     */
    isSateCheckBoxes: function () {
      var check = true;
      //Duyệt tất cả các phần tử trong Selected items
      if (this.selectedItems.every((value) => value === true)) {
        check = true;
      } else {
        check = false;
      }
      return check;
    },

    /**
     * Hàm xử lý sự kiện double click dòng trong bảng để hiện form
     * Author NNduc (3/3/2023)
     * @param {*} fixedAsset  tài sản
     */
    dblclickRowTable: function (id) {
      // const NW_FixedAsset = JSON.parse(JSON.stringify(fixedAsset));
      // NW_FixedAsset.purchase_date = this.MISACommon.formatDate(
      //   fixedAsset.purchase_date
      // );
      // NW_FixedAsset.production_year = this.MISACommon.formatDate(
      //   fixedAsset.production_year
      // );
      this.$emit("openForm", this.MISAEnum.FormState.Edit, id);
    },

    /**
     * Hàm mở form
     * Author NNduc (3/3/2023)
     */
    openForm: function (state, id) {
      // const NW_FixedAsset = JSON.parse(JSON.stringify(fixedAsset));
      // NW_FixedAsset.purchase_date = this.MISACommon.formatDate(
      //   fixedAsset.purchase_date
      // );
      // NW_FixedAsset.production_year = this.MISACommon.formatDate(
      //   fixedAsset.production_year
      // );
      this.$emit("openForm", state, id);
    },

    /**
     * Hàm tính tổng của thuộc tính, số lượng, tiền,
     * @param {*} prorertyName  tên thuộc tính
     */
    total: function (propertyName) {
      var s = 0;
      this.modelValue.forEach((element) => {
        s += element[propertyName];
      });
      return s;
    },
  },
};
</script>/

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
