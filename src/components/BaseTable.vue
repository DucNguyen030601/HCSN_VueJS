<template>
  <div
    class="table-section"
    ref="tableSection"
    :class="{ 'table-border': isBorder }"
    :style="{ height: sizeH, width: sizeW }"
  >
    <table
      ref="table"
      tabindex="0"
      @keydown="stateKeyDown($event)"
      @blur="isValid = false"
      :class="{ 'table-error': isValid }"
      @focus="onFocusTableListener"
    >
      <thead @mouseleave="stopResize" @mouseup="stopResize">
        <tr>
          <template v-for="(column, index) in dColumns" :key="index">
            <th
              v-if="column.type == 'checkbox'"
              :style="{ width: column.width + 'px' }"
            >
              <input
                ref="checkBoxTitle"
                @change="stateCheckBoxes($event.target.checked)"
                type="checkbox"
                tabindex="-1"
              />
            </th>
            <th
              v-else
              :style="{ width: column.width + 'px' }"
              :class="{
                'table__cell-right': column.align == 'right',
                'table__cell-center': column.align == 'center',
              }"
              @mousemove.prevent="resize($event)"
            >
              <div class="tooltip tooltip--right" v-if="column.tooltip">
                {{ column.name }}
                <span class="tooltip__text">{{ column.tooltip }}</span>
              </div>
              <span v-else>{{ column.name }}</span>
              <span
                class="column-resize"
                v-show="column.isResizing"
                @mousedown.prevent="startResize(index, $event)"
              ></span>
            </th>
          </template>
        </tr>
      </thead>
      <tbody :class="{ 'table-row--border-bottom': !isShowFooter }">
        <tr
          @mousedown.left="selectedRow(index)"
          @contextmenu="showContextMenu($event, index)"
          @click="selectedRows(index, $event.ctrlKey)"
          v-for="(item, index) in modelValue"
          :key="index"
          :class="{
            'table-row-check': selectedItems[index],
            'table-row-active': index == active,
          }"
          ref="trTable"
        >
          <template v-for="(cell, i) in cells" :key="i">
            <td v-if="cell.type == 'checkbox'">
              <input
                type="checkbox"
                ref="checkBoxItem"
                @change="stateCheckBox($event.target.checked, index)"
                tabindex="-1"
              />
            </td>
            <td
              v-else-if="cell.type == 'sort'"
              @dblclick="dblclickRowTable(item[send], index)"
            >
              {{
                MISACommon.formatMoney(dPageSize * (dPage - 1) + (index + 1))
              }}
            </td>
            <td
              v-else-if="cell.type == 'money'"
              :style="{ color: cell.color }"
              :class="{
                'table__cell-right': cell.align == 'right',
                'table__cell-center': cell.align == 'center',
              }"
              @dblclick="dblclickRowTable(item[send], index)"
            >
              {{ MISACommon.formatMoney(item[cell.name]) }}
            </td>
            <td
              :style="{ color: cell.color }"
              v-else-if="cell.type == 'date'"
              :class="{
                'table__cell-right': cell.align == 'right',
                'table__cell-center': cell.align == 'center',
              }"
              @dblclick="dblclickRowTable(item[send], index)"
            >
              {{ MISACommon.formatDateByType(item[cell.name], cell.format) }}
            </td>

            <td
              :style="{ color: cell.color }"
              v-else
              :class="{
                'table__cell-right': cell.align == 'right',
                'table__cell-center': cell.align == 'center',
              }"
              @dblclick.stop="dblclickRowTable(item[send])"
            >
              <div class="tooltip tooltip-table">
                <div class="cut" :style="{ width: dColumns[i].width + 'px' }">
                  {{ item[cell.name] }}
                </div>
                <span class="tooltip__text">{{ item[cell.name] }}</span>
              </div>
            </td>
          </template>
          <td v-if="buttonFeatureTable" class="feature-button">
            <button
              tabindex="-1"
              v-for="(button, i) in buttonFeatureTable"
              :key="i"
              @click="openForm(button.state, item[send])"
            >
              <div class="tooltip">
                <div :class="button.icon"></div>
                <span class="tooltip__text">{{ button.name }}</span>
              </div>
            </button>
          </td>
        </tr>
        <tr v-if="modelValue.length == 0">
          <td :colspan="columns.length" class="table__cell-center">
            <base-no-data-vue />
          </td>
        </tr>
      </tbody>
      <tfoot v-if="isShowFooter">
        <tr>
          <td :colspan="totalCellPaging">
            <base-paging-vue
              :arrPage="arrPage"
              v-if="isShowPagging"
              :totalRecord="totalRecord"
              :totalPage="totalPage"
              v-model:page="dPage"
              v-model:pageSize="dPageSize"
              ref="paging"
            />
          </td>
          <td
            class="table__cell-right--bold"
            v-for="(item, index) in moreInfo"
            :key="index"
          >
            {{ MISACommon.formatMoney(item) }}
          </td>

          <td
            v-for="n in columns.length - totalCellPaging - moreInfo.length"
            :key="n"
          ></td>
        </tr>
      </tfoot>
    </table>
  </div>
  <base-contextmenu-vue
    v-show="isShowContextMenu"
    v-if="itemFeatureContextMenu"
    @closeContextMenu="this.isShowContextMenu = false"
    :itemFeatureContextMenu="itemFeatureContextMenu"
    ref="contextMenu"
    @openForm="openForm"
  />
</template>
<script>
import BaseNoDataVue from "./BaseNoData.vue";
export default {
  name: "BaseTable",
  components: {
    BaseNoDataVue,
  },
  props: {
    msg: String,
    modelValue: {
      type: Array,
      default: new Array(),
    },
    page: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 20,
    },
    totalPage: Number,
    totalRecord: Number,
    arrPage: Array,
    moreInfo: {
      type: Array,
      default: new Array(),
    },
    columns: Array,
    cells: Array,
    send: String,
    get: String,
    isBorder: {
      //table border
      type: Boolean,
      default: true,
    },
    totalCellPaging: Number, //tổng số ô mà pagging muốn lấy
    isShowPagging: {
      //show pagging
      type: Boolean,
      default: true,
    },
    isShowFooter: {
      //Có show footer phân trang không
      type: Boolean,
      default: true,
    },
    sizeH: Object,
    sizeW: Object,
    itemFeatureContextMenu: Array, //hiện các item contextmenu
    buttonFeatureTable: Array, //hiện các button table (thêm, sửa, xoá)
    name: String,
  },
  created() {
    this.dPage = this.page;
    this.dColumns = this.columns;
    this.dPageSize = this.pageSize;
  },
  data() {
    return {
      currentResizing: false,
      isShowForm: false,
      dPage: null,
      dPageSize: null,
      dColumns: [{}],
      selectedItems: [], //lưu mảng số lượng item của model
      isShowContextMenu: false,
      state: null, //trạng thái thêm, sửa, xoá, nhân bản
      lastSelectedRow: null, //lưu vị trí khi chọn nhiều Shift + Click
      active: -1, // lấy chỉ số index khi xuống dòng
      isValid: false, //kiểm tra validate
      activeSelectedRow: -1, //lấy chỉ số
    };
  },
  watch: {
    dPage: function (nVal) {
      this.$emit("update:page", nVal);
    },
    dPageSize: function (nVal) {
      this.$emit("update:pageSize", nVal);
      this.selectedItems = new Array(nVal).fill(false);
    },
    page: function (nVal) {
      this.dPage = nVal;
    },
    modelValue: function () {
      this.$nextTick(function () {
        this.refresh();
      });
    },
    // dColumns: {
    //   handler: function () {
    //     if (this.$refs.trTable) {
    //       const trTables = this.$refs.trTable;
    //       const spans = trTables[0].querySelectorAll(".text-td");
    //       //const cuts = trTables[0].querySelectorAll(".tooltip.tooltip-table");
    //       for (let index = 0; index < spans.length; index++) {
    //         // if (spans[index].offsetWidth < spans[index].scrollWidth) {
    //         //   cuts[index].style.display = "block";
    //         //   spans[index].style.display = "none";
    //         // } else {
    //         //   cuts[index].style.display = "none";
    //         //   spans[index].style.display = "block";
    //         // }
    //         console.log(spans[1].offsetWidth +" - "+spans[1].scrollWidth)
    //       }
    //     }
    //   },
    //   deep: true,
    // },
  },
  methods: {
    /**
     * @description: Sự kiện focus table
     * @param: {any}
     * Author: NNduc (15/05/2023)
     */
    onFocusTableListener: function () {
      this.$emit("onFocusTableListener", this.name);
    },
    /**
     * @description: Focus cho table
     * @param: {any}
     * Author: NNduc (11/04/2023)
     */
    autoFocusComplete: function () {
      this.$refs.table.focus();
    },

    /**
     * @description:
     * @param: {any}
     * Author: NNduc (05/05/2023)
     */
    showTextValidate: function () {
      this.$refs.table.blur();
      this.isValid = true;
    },
    /**
     * @description:
     * @param: {any}
     * Author: NNduc (12/05/2023)
     */
    scrollItem(position) {
      if (position >= 0) {
        var coordinatesY = 0;
        for (let index = 0; index < position; index++) {
          coordinatesY += this.$refs.trTable[index].offsetHeight;
        }
        this.$refs.tableSection.scrollTo({
          top: coordinatesY,
          left: 0,
          behavior: "smooth",
        });
      }
    },

    /**
     * @description: Xử lý sự kiện khi bấm xuống lên dòng table
     * @param: {evt} là sự kiện nhấn xuống
     * Author: NNduc (02/04/2023)
     */
    stateKeyDown: function (evt) {
      var charCode = evt.keyCode;
      switch (charCode) {
        case this.MISAEnum.KeyCode.ArrowDown:
          evt.preventDefault();
          if (this.active > this.modelValue.length - 2) {
            this.active = 0;
          } else {
            this.active++;
          }
          this.scrollItem(this.active);
          break;
        case this.MISAEnum.KeyCode.ArrowUp:
          evt.preventDefault();
          if (this.active == 0) {
            this.active = this.modelValue.length - 1;
          } else {
            this.active--;
          }
          this.scrollItem(this.active);
          break;
        case this.MISAEnum.KeyCode.Enter:
          evt.preventDefault();
          if (this.$refs.checkBoxTitle) {
            this.$refs.checkBoxItem[this.active].checked =
              !this.$refs.checkBoxItem[this.active].checked;
            this.stateCheckBox(
              this.$refs.checkBoxItem[this.active].checked,
              this.active
            );
          }
          break;
        default:
          break;
      }
      //Xử lý sự kiện SHORT KEY ->Sửa
      if (evt.ctrlKey && charCode == this.MISAEnum.KeyCode.E) {
        evt.preventDefault();
        this.openForm(
          this.MISAEnum.FormState.Edit,
          this.modelValue[this.active][this.send]
        );
      }
      //Xử lý sự kiện SHORT KEY ->Xoá
      if (evt.ctrlKey && charCode == this.MISAEnum.KeyCode.D) {
        evt.preventDefault();
        this.openForm(
          this.MISAEnum.FormState.Delete,
          this.modelValue[this.active][this.send]
        );
      }
      //Xử lý sự kiện SHORT KEY ->Xoá
      if (evt.ctrlKey && charCode == this.MISAEnum.KeyCode.Number2) {
        evt.preventDefault();
        this.openForm(
          this.MISAEnum.FormState.Clone,
          this.modelValue[this.active][this.send]
        );
      }
    },
    /**
     * @description: Hàm xử lý sự kiện bấm Shift và click chuột để lấy nhiều dòng
     * @param: {index: chỉ số của modelvalue, là lấy sự kiện nhấn shift}
     * Author: NNduc (31/03/2023)
     */
    selectedRows(index, ctrlKey) {
      if (ctrlKey && this.lastSelectedRow !== null) {
        let start = Math.min(this.lastSelectedRow, index);
        let end = Math.max(this.lastSelectedRow, index);
        for (let i = start; i <= end; i++) {
          this.selectedItems[i] = true;
          this.$refs.checkBoxItem[i].checked = true;
        }
        this.$refs.checkBoxTitle[0].checked = this.isSateCheckBoxes();
        this.$emit("selectedCheckBox");
      }
    },
    /**
     * @description:
     * @param: {any}
     * Author: NNduc (10/05/2023)
     */
    selectedRow: function (index) {
      if (this.activeSelectedRow != index)
        this.$emit("selectedRow", this.modelValue[index][this.send]);
      this.activeSelectedRow = index;
      this.active = index;
    },

    /**
     * Hàm lấy tất cả các nhân viên được check
     * Author NNduc (7/3/2023)
     */
    getAllData: function () {
      var data = [];
      var checkBoxItems = this.$refs.checkBoxItem;
      for (const key in checkBoxItems) {
        let checkbox = this.$refs.checkBoxItem[key].checked;
        if (checkbox) {
          let item = {};
          for (const getItem of this.get) {
            item[getItem] = this.modelValue[key][getItem];
          }
          data.push(item);
        }
      }
      //Kiểm tra nếu index khác -1 tức là đang trong trạng thái mở ContextMenu thì
      //Lấy tài sản theo id
      if (this.state == this.MISAEnum.FormState.Delete) {
        let item = {};
        for (const getItem of this.get) {
          item[getItem] = this.modelValue[this.active][getItem];
        }
        data = [item];
        this.state = null;
      }
      return data;
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
      //set lại về mặc định ban đầu
      this.lastSelectedRow = null;
      this.$emit("selectedCheckBox");
    },

    /**
     * Hàm kiểm tra trạng thái của check box nếu check thì cho style, ngược lại
     * Author NNduc (7/3/2023)
     * @param {*} td là thẻ tương ứng với checkbox
     */
    stateCheckBox: function (check, index) {
      //set trạng thái của selectedItems theo checkbox
      this.selectedItems[index] = check;

      //gán active lấy chỉ số dòng đó
      //this.active = index;

      //khi xử lý xong sẽ kiểm tra trạng thái của check box tiêu đề
      //nếu tất cả các dòng check hết rồi thì check tiêu đề, ngược lại
      this.$refs.checkBoxTitle[0].checked = this.isSateCheckBoxes();

      //nếu check bằng true và lastSelectedRow chưa gán giá trị thì gán luôn chỉ số của dòng đó
      if (check) {
        this.lastSelectedRow = index;
      }

      //nếu tất cả giá trị được chọn, hay tất cả các ô checkbox không được chọn thì cho mặc định ban đầu
      if (this.selectedItems.every((value) => value === false)) {
        this.lastSelectedRow = null;
        //this.active = -1;
      }
      this.$emit("selectedCheckBox");
      // this.focusName = this.$refs.checkBoxItem[index];
      //this.$emit("onFocusTableListener", this.name);
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
      this.state = state;
      this.$emit("onFocusTableListener", this.name);
      this.$emit("openForm", state, id, this.active);
    },

    showContextMenu: function (e, index) {
      if (this.itemFeatureContextMenu) {
        e.preventDefault();
        this.selectedRow(index);
        this.$refs.contextMenu.offsetY = e.clientY;
        this.$refs.contextMenu.offsetX = e.clientX;
        this.$refs.contextMenu.id = this.modelValue[index][this.send];
        this.$refs.contextMenu.index = index;
        this.isShowContextMenu = true;
      }
    },

    /**
     * @description: Thay đổi kích thước cột
     * @param: {any}
     * Author: NNduc (01/04/2023)
     */
    startResize: function (index, event) {
      //người dùng bấm chuột
      //nếu có sẽ thuộc tính thay đổi size bằng true
      this.currentResizing = true;
      this.indexCurrentResizing = index;
      this.dColumns[this.indexCurrentResizing].startX = event.clientX;
    },
    stopResize: function () {
      //nếu người dùng nhả chuột thì cho không thay đổi nữa
      //và set mặc định các trường về ban đầu
      this.currentResizing = false;
      this.indexCurrentResizing = -1;
    },
    resize: function (event) {
      //sự kiện khi người dùng kéo rê chuột
      //kiểm tra xem có cho phép thay đổi không
      if (this.currentResizing) {
        //ở đây sẽ lấy toạ độ X khi rê chuột -  toạ độ X  vị trí khi khi người dùng bấm chuột lần đầu
        const delta =
          event.clientX - this.dColumns[this.indexCurrentResizing].startX;
        this.dColumns[this.indexCurrentResizing].width += delta;

        //cập nhật toạ độ X  vị trí khi khi người dùng bấm chuột lần đầu
        this.dColumns[this.indexCurrentResizing].startX = event.clientX;
      }
    },

    /**
     * @description: Set style lại mặc định ban đầu
     * @param: {any}
     * Author: NNduc (05/04/2023)
     */
    refresh: function () {
      if (this.$refs.checkBoxTitle) {
        this.$refs.checkBoxTitle[0].checked = false;
        this.stateCheckBoxes(false);
      }
      this.$refs.tableSection.scrollTop = 0;
      this.active = -1;
    },
  },
  mounted() {
    if (this.size) {
      this.$refs.tableSection.style.height = this.size;
    }
  },
  updated() {
    const trTables = this.$refs.trTable;
    if (trTables) {
      for (const tr of trTables) {
        const tooltips = tr.querySelectorAll(".tooltip.tooltip-table");
        const cuts = tr.querySelectorAll(".tooltip.tooltip-table .cut");
        for (let index = 0; index < cuts.length; index++) {
          if (cuts[index].offsetWidth < cuts[index].scrollWidth) {
            tooltips[index].classList.remove("tooltip--disable");
          } else {
            if (!tooltips[index].classList.contains("tooltip--disable"))
              tooltips[index].classList.add("tooltip--disable");
          }
        }
      }
    }
  },
};
</script>/
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.table-section.table-border {
  border-radius: 3.5px;
  border: 1px solid #afafaf;
  box-shadow: 0 3px 10px #00000029;
}
table.table-error {
  border: 0.5px solid red;
}
</style>
