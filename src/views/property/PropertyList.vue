<template>
  <div class="content">
    <div class="content__toolbar">
      <div class="toolbar__filter">
        <div class="txt-box--filter">
          <div class="icon-search"></div>
          <input class="txt-box" placeholder="Tìm kiếm tài sản" />
        </div>
        <base-combobox-vue
          placehoder="Chọn mã loại tài sản"
          :filter="true"
          :checkActive="true"
          :api="MISAResoure.API.Pos.Get"
          get="PositionName"
          v-model="filterCat"
        />
        <base-combobox-vue
          placehoder="Chọn mã bộ phận sử dụng"
          :filter="true"
          :checkActive="true"
          :api="MISAResoure.API.Dept.Get"
          get="DepartmentName"
          v-model="filterDept"
        />
      </div>
      <div class="toolbar__feature">
        <button
          class="btn btn--primary"
          style="width: 110px; height: 36px"
          @click="openForm(MISAEnum.FormState.Add)"
        >
          + Thêm tài sản
        </button>

        <div class="tooltip">
          <button class="btn feature__btn">
            <div class="icon-excel"></div>
          </button>
          <span class="tooltip__text">Xuất Excel</span>
        </div>

        <div class="tooltip">
          <button class="btn feature__btn" @click="removeEmployees()">
            <div class="icon-bin"></div>
          </button>
          <span class="tooltip__text">Xoá</span>
        </div>
      </div>
    </div>
    <div class="table-section">
      <table>
        <thead>
          <tr>
            <th name="checkbox">
              <input
                type="checkbox"
                @change="stateCheckBoxes($event.target.checked)"
                ref="checkBoxTitle"
              />
            </th>
            <th name="Sort">
              <div class="tooltip">
                STT
                <span class="tooltip__text">Số thứ tự</span>
              </div>
            </th>
            <th name="EmployeeCode">Mã tài sản</th>
            <th name="FullName">Tên tài sản</th>
            <th>Loại tài sản</th>
            <th>Bộ phận sử dụng</th>
            <th class="table__cell-center">Số lượng</th>
            <th class="table__cell-right">Nguyên giá</th>
            <th class="table__cell-right">
              <div class="tooltip">
                HM/KH luỹ kế
                <span class="tooltip__text">Hao mòn luỹ kế</span>
              </div>
            </th>
            <th class="table__cell-right">Giá trị còn lại</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          <tr
            @dblclick="dblclickRowTable(item)"
            v-for="(item, index) in model"
            :key="index"
            ref="trBody"
          >
            <td>
              <input
                type="checkbox"
                ref="checkBoxItem"
                @change="stateCheckBox($event.target)"
              />
            </td>
            <td>{{ index + 1 }}</td>
            <td>{{ item.EmployeeCode }}</td>
            <td>{{ item.FullName }}</td>
            <td>{{ item.PositionName }}</td>
            <td>{{ item.DepartmentName }}</td>
            <td class="table__cell-center">{{ item.EducationalBackground }}</td>
            <td class="table__cell-right">20.000.000</td>
            <td class="table__cell-right">894.000</td>
            <td class="table__cell-right">19.106.000</td>
            <td>
              <button @click="openForm(MISAEnum.FormState.Edit, item)">
                <div class="icon-edit"></div>
              </button>
              <button @click="openForm(MISAEnum.FormState.Clone, item)">
                <div class="icon-copy"></div>
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
                    >Tổng số: <span style="font-weight: bold">200</span> bản ghi
                  </span>
                </div>
                <base-combobox-vue
                  :typeUp="true"
                  v-model="pageSize"
                  :arrData="arrPage"
                />
                <ul class="table-footer__pagging">
                  <li>
                    <a>{{ "<" }}</a>
                  </li>
                  <li class="pagging__item--active"><a>1</a></li>
                  <li><a>2</a></li>
                  <li><a>...</a></li>
                  <li><a>3</a></li>
                  <li>{{ ">" }}</li>
                </ul>
              </div>
            </td>
            <td class="table__cell-right--bold">13</td>
            <td class="table__cell-right--bold">249.000.000</td>
            <td class="table__cell-right--bold">19.716.000</td>
            <td class="table__cell-right--bold">229.284.000</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>

  <the-dialog-vue
    ref="dialog"
    v-show="isShowDialog"
    @onChoose="btnOnClickChooseDialog"
  />

  <the-form-vue
    v-if="isShowForm"
    :title="titleForm"
    :employee="employee"
    @closeForm="isShowForm = !isShowForm"
    :state="state"
  />
</template>

<script>
export default {
  name: "PropertyList",
  props: {
    msg: String,
  },
  created() {
    const api = this.MISAResoure.API.Emp.Get;
    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        this.model = data;
      });
  },
  methods: {
    /**
     * Hàm xoá nhân viên
     * Author NNduc (7/3/2023)
     */
    removeEmployees: function () {
      const employees = this.getAllCheckBoxEmployees();
      this.isShowDialog = true;
      if (employees.length == 0) {
        //gán các thông tin vào cảnh báo
        let title = this.MISAResoure.Dialog.Title.DeleteWarningChoose;
        let titleBtnPr = this.MISAResoure.Dialog.Button.Close;
        this.showDialog(title, titleBtnPr);
      } else if (employees.length == 1) {
        //gán các thông tin vào cảnh báo
        let s = employees[0].id + " - " + employees[0].name;
        let title = this.MISAResoure.Dialog.Title.Delete(s);
        let titleBtnPr = this.MISAResoure.Dialog.Button.Delete;
        let titleBtnOut = this.MISAResoure.Dialog.Button.No;
        this.showDialog(title, titleBtnPr, titleBtnOut);
      } else {
        //gán các thông tin vào cảnh báo
        let title = this.MISAResoure.Dialog.Title.DeleteALot(employees.length);
        let titleBtnPr = this.MISAResoure.Dialog.Button.Delete;
        let titleBtnOut = this.MISAResoure.Dialog.Button.No;
        this.showDialog(title, titleBtnPr, titleBtnOut);
      }
    },

    /**
     * Hàm lấy tất cả các nhân viên được check
     * Author NNduc (7/3/2023)
     */
    getAllCheckBoxEmployees: function () {
      var employees = [];
      var trBody = this.$refs.trBody;
      for (const key in trBody) {
        let checkbox = this.$refs.checkBoxItem[key].checked;
        if (checkbox) {
          let employee = {
            id: trBody[key].cells[2].innerText,
            name: trBody[key].cells[3].innerText,
          };
          employees.push(employee);
        }
      }
      return employees;
    },

    /**
     * Hàm để chỉnh các thông số của dialog: title, button, title_button
     * Author NNduc (5/3/2023)
     * @param {*} titleDialog  tiêu đề của dialog
     * @param {*} titleBtnPr  tiêu đề của nút xanh
     * @param {*} titleBtnOut  tiêu đề của nút viền đen
     * @param {*} titleDialog  tiêu đề của nút viền trắng
     */
    showDialog: function (
      titleDialog,
      titleBtnPr = null,
      titleBtnOut = null,
      titleBtnSub = null
    ) {
      //set properties it's dialog
      const dialog = this.$refs.dialog;
      dialog.title = titleDialog;
      dialog.titleBtnPr = titleBtnPr;
      dialog.titleBtnOut = titleBtnOut; //button đường viền đen
      dialog.titleBtnSub = titleBtnSub; //button đường viền xanh
      //show dialog
      this.isShowDialog = true;
    },
    /**
     * Hàm lấy trạng thái từ dialog
     * Author NNduc(5/5/2023)
     * @param {*} choose  gía trị được gửi từ dialog sang
     */
    btnOnClickChooseDialog: function (choose) {
      if (
        choose == this.MISAResoure.Dialog.Button.Close ||
        choose == this.MISAResoure.Dialog.Button.No ||
        choose == this.MISAResoure.Dialog.Button.Yes
      ) {
        this.isShowDialog = false;
      } else if (
        choose == this.MISAResoure.Dialog.Button.Cancel ||
        choose == this.MISAResoure.Dialog.Button.DoNotSave
      ) {
        this.$emit("closeForm");
      }
    },
    /**
     * Hàm check tất cả các dòng theo đúng trạng thái của check box tiêu đề
     * Author NNduc(7/3/2023)
     * @param {*} check sẽ lấy giá trị của check box tiêu đề
     */
    stateCheckBoxes: function (check) {
      //lấy hết tất cả các check box của các dòng
      const checkBoxes = this.$refs.checkBoxItem;
      checkBoxes.forEach((element) => {
        element.checked = check;
        //lấy thẻ tr trương ứng của check box
        let tr = element.parentElement.parentElement;
        //nếu check thì thêm style còn không ngược lại
        check
          ? tr.classList.add("table-row-check")
          : tr.classList.remove("table-row-check");
      });
    },

    /**
     * Hàm kiểm tra trạng thái của check box nếu check thì cho style, ngược lại
     * Author NNduc (7/3/2023)
     * @param {*} td là thẻ tương ứng với checkbox
     */
    stateCheckBox: function (tdCheckBox) {
      //lấy thẻ tr
      const tr = tdCheckBox.parentElement.parentElement;
      //thêm style
      tr.classList.toggle("table-row-check");
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
      //lấy hết tất cả các check box của các dòng
      const checkBoxes = this.$refs.checkBoxItem;
      //duyệt vòng for nếu có phần tử nào akhoong check thì gán bằng false
      checkBoxes.forEach((element) => {
        if (!element.checked) check = false;
      });
      return check;
    },

    /**
     * Hàm định dạng ngày
     * Author NNduc (3/3/2023)
     */
    formatDate: function (date) {
      //lấy sẵn hàm đã xây dựng sẵn ở common
      return this.MISACommon.formatDate(date);
    },
    /**
     * Hàm xử lý sự kiện double click dòng trong bảng để hiện form
     * Author NNduc (3/3/2023)
     * @param {*} employee  nhân viên
     */
    dblclickRowTable: function (employee) {
      this.employee = employee;
      this.isShowForm = true;
      this.titleForm = this.MISAResoure.Form.Emp.TitleEdit;
    },
    /**
     * Hàm mở form
     * Author NNduc (3/3/2023)
     */
    openForm: function (type, employee = {}) {
      if (type == this.MISAEnum.FormState.Add) {
        this.titleForm = this.MISAResoure.Form.Emp.TitleAdd;
        employee = {
          EmployeeCode: "TS00001",
          EducationalBackground: 1,
          OriginalPrice: 0,
          NumberOfYear: 0,
          WearRate: 0,
          DepreciationYear: 0,
          YearOfTracking: 2021,
          DatePurchase: new Date().toISOString().slice(0, 10),
          DayStartedUsing: new Date().toISOString().slice(0, 10),
        };
        this.employee = employee;
        this.state = type;
      } else if (type == this.MISAEnum.FormState.Edit) {
        this.titleForm = this.MISAResoure.Form.Emp.TitleEdit;
        this.employee = employee;
        this.state = type;
      } else {
        this.titleForm = this.MISAResoure.Form.Emp.TitleClone;
        this.employee = employee;
        this.state = type;
      }
      this.isShowForm = true;
    },
  },
  data() {
    return {
      isShowForm: false,
      model: [{}],
      state: null,
      isShowDialog: false,
      filterDept: "Bộ phận sử dụng",
      filterCat: "Loại tài sản",
      filterAsset: "",
      pageSize:10,
      arrPage:['10','20','30','50','100']
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
