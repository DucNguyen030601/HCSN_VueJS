<template>
  <div
    class="table-section"
    ref="tableSection"
    :class="{ 'table-border': isBorder}"
  >
    <table
      ref="table"
      tabindex="0"
      @keydown="stateKeyDown($event)"
      @click="$emit('onFocusRowTableListener', name)"
      @blur="isValid = false"
      :class="{'table-error': isValid }"
    >
      <thead>
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
              />
            </th>
            <th
              v-else
              :style="{ width: column.width + 'px' }"
              :class="{
                'table__cell-right': column.align == 'right',
                'table__cell-center': column.align == 'center',
              }"
              @mousedown="startResize(index, $event)"
              @mousemove="resize(index, $event)"
              @mouseup="stopResize()"
            >
              <div class="tooltip tooltip--left" v-if="column.tooltip">
                {{ column.name }}
                <span class="tooltip__text">{{ column.tooltip }}</span>
              </div>
              <span v-else>{{ column.name }}</span>
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr
          @contextmenu="showContextMenu($event, index)"
          @mousedown.left="selectRow(index, $event.ctrlKey)"
          v-for="(item, index) in modelValue"
          :key="index"
          :class="{
            'table-row-check': selectedItems[index],
            'table-row-active': index == active,
          }"
        >
          <template v-for="(cell, i) in cells" :key="i">
            <td v-if="cell.type == 'checkbox'">
              <input
                type="checkbox"
                ref="checkBoxItem"
                @change="stateCheckBox($event.target.checked, index)"
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
              :class="{
                'table__cell-right': cell.align == 'right',
                'table__cell-center': cell.align == 'center',
              }"
              @dblclick="dblclickRowTable(item[send], index)"
            >
              {{ MISACommon.formatMoney(item[cell.name]) }}
            </td>
            <td
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
              v-else
              :class="{
                'table__cell-right': cell.align == 'right',
                'table__cell-center': cell.align == 'center',
              }"
              @dblclick.stop="dblclickRowTable(item[send], index)"
            >
              {{ item[cell.name] }}
            </td>
          </template>
          <td v-if="isShowButtonFeature" class="feature-button">
            <button
              @click="openForm(MISAEnum.FormState.Edit, item[send], index)"
              v-if="isShowButtonFeature.includes('Edit')"
            >
              <div class="tooltip">
                <div class="icon-edit"></div>
                <span class="tooltip__text">Sửa</span>
              </div>
            </button>
            <button
              @click="openForm(MISAEnum.FormState.Clone, item[send], index)"
              v-if="isShowButtonFeature.includes('Clone')"
            >
              <div class="tooltip">
                <div class="icon-copy"></div>
                <span class="tooltip__text">Nhân bản</span>
              </div>
            </button>
            <button
              @click="openForm(MISAEnum.FormState.Delete, item[send], index)"
              v-if="isShowButtonFeature.includes('Delete')"
            >
              <div class="tooltip">
                <div class="icon-bin--red"></div>
                <span class="tooltip__text">Xoá</span>
              </div>
            </button>
          </td>
        </tr>

        <tr v-if="modelValue.length == 0">
          <td :colspan="columns.length" class="table__cell-center">
            Không có bản ghi nào.
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
    v-if="hasContextMenu"
    @closeContextMenu="this.isShowContextMenu = false"
    ref="contextMenu"
    @openForm="openForm"
  />
</template>
<script>
export default {
  name: "BaseTable",
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
    size: Object,
    hasContextMenu: {
      //hiện contextmenu
      type: Boolean,
      default: true,
    },
    isShowButtonFeature: Array, //hiện các button
    name: Object,
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
      index: -1, //lấy chỉ số của model khi mở contextmenu
      state: null, //trạng thái thêm, sửa, xoá, nhân bản
      lastSelectedRow: null, //lưu vị trí khi chọn nhiều Shift + Click
      active: -1, // lấy chỉ số index khi xuống dòng
      focusName: null, //tên các phần tử muốn focus
      isValid: false, //kiểm tra validate
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
  },
  methods: {
    /**
     * @description: Focus cho table
     * @param: {any}
     * Author: NNduc (11/04/2023)
     */
    autoFocusComplete: function () {
      if (this.focusName) this.focusName.focus();
      else this.$refs.table.focus();
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
     * @description: Xử lý sự kiện khi bấm xuống lên dòng table
     * @param: {evt} là sự kiện nhấn xuống
     * Author: NNduc (02/04/2023)
     */
    stateKeyDown: function (evt) {
      if (this.active == -1) return;
      var charCode = evt.keyCode;
      switch (charCode) {
        case this.MISAEnum.KeySate.ArrowDown:
          if (this.active > this.modelValue.length - 2) {
            this.active = 0;
            this.$refs.tableSection.scrollTop = 0;
            evt.preventDefault();
          } else {
            this.active++;
          }
          break;
        case this.MISAEnum.KeySate.ArrowUp:
          if (this.active == 0) {
            this.active = this.modelValue.length - 1;
            this.$refs.tableSection.scrollTop = this.$refs.tableSection.scrollHeight;
            evt.preventDefault();
          } else {
            this.active--;
          }
          break;
        case this.MISAEnum.KeySate.Enter:
          if (this.$refs.checkBoxTitle) {
            this.$refs.checkBoxItem[this.active].checked =
              !this.$refs.checkBoxItem[this.active].checked;
            this.stateCheckBox(
              this.$refs.checkBoxItem[this.active].checked,
              this.active
            );
          }
          break;
        case this.MISAEnum.KeySate.Shift:
          this.openForm(
            this.MISAEnum.FormState.Delete,
            this.modelValue[this.active][this.send],
            this.active
          );
          break;
        default:
          break;
      }
      if (this.$refs.checkBoxTitle)
        this.focusName = this.$refs.checkBoxItem[this.active];
    },
    /**
     * @description: Hàm xử lý sự kiện bấm Shift và click chuột để lấy nhiều dòng
     * @param: {index: chỉ số của modelvalue, là lấy sự kiện nhấn shift}
     * Author: NNduc (31/03/2023)
     */
    selectRow(index, ctrlKey) {
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
      if (this.$refs.checkBoxTitle)
        this.focusName = this.$refs.checkBoxItem[this.active];
      if (this.active != index)
        this.$emit("selectedRow", this.modelValue[index][this.send]);
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
      if (this.state == this.MISAEnum.FormState.Delete && this.index != -1) {
        let item = {};
        for (const getItem of this.get) {
          item[getItem] = this.modelValue[this.index][getItem];
        }
        data.push(item);
        this.state = null;
        this.index = -1;
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
      //this.$emit("onFocusRowTableListener", this.name);
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
    dblclickRowTable: function (id, index) {
      // const NW_FixedAsset = JSON.parse(JSON.stringify(fixedAsset));
      // NW_FixedAsset.purchase_date = this.MISACommon.formatDate(
      //   fixedAsset.purchase_date
      // );
      // NW_FixedAsset.production_year = this.MISACommon.formatDate(
      //   fixedAsset.production_year
      // );
      this.$emit("openForm", this.MISAEnum.FormState.Edit, id, index);
    },

    /**
     * Hàm mở form
     * Author NNduc (3/3/2023)
     */
    openForm: function (state, id, index) {
      this.state = state;
      this.$emit("openForm", state, id, index);
    },

    showContextMenu: function (e, index) {
      if (this.hasContextMenu) {
        e.preventDefault();
        this.$refs.contextMenu.offsetY = e.clientY;
        this.$refs.contextMenu.offsetX = e.clientX;
        this.$refs.contextMenu.id = this.modelValue[index][this.send];
        this.index = index;
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
      //kiểm tra trạng thái column đấy có cho phép thay đổi kích thước không
      //nếu có sẽ thuộc tính thay đổi size bằng true
      if (this.dColumns[index].isResizing) {
        this.currentResizing = true;
        this.dColumns[index].startX = event.clientX;
      }
    },
    stopResize: function () {
      //nếu người dùng nhả chuột thì cho không thay đổi nữa
      //và set mặc định các trường về ban đầu
      if (this.currentResizing) {
        this.currentResizing = false;
      }
    },
    resize: function (index, event) {
      //sự kiện khi người dùng kéo rê chuột
      //kiểm tra xem có cho phép thay đổi không
      if (!this.currentResizing) return;

      //ở đây sẽ lấy toạ độ X khi rê chuột -  toạ độ X  vị trí khi khi người dùng bấm chuột lần đầu
      const delta = event.clientX - this.dColumns[index].startX;
      this.dColumns[index].width += delta;

      //cập nhật toạ độ X  vị trí khi khi người dùng bấm chuột lần đầu
      this.dColumns[index].startX = event.clientX;
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
