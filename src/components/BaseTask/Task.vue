<template>
  <div class="task" v-keydown-ctrl-s="btnOnClickSave" v-keydown-esc="closeForm">
    <div class="task-form">
      <div class="task-form__header">
        <h2>Sửa tài sản {{ model.fixed_asset_name }}</h2>
        <div class="header__close" @click="closeForm">
          <div class="tooltip">
            <div class="icon-close-popup"></div>
            <span class="tooltip__text">Đóng</span>
          </div>
        </div>
      </div>
      <div class="task-form__body">
        <div class="body__content-top">
          <div class="task-form__grid">
            <div class="grid__item">
              <input-text-vue
                lable="Bộ phận sử dụng"
                ref="description"
                :disable="true"
                v-model="model.department_name"
              />
            </div>
          </div>
        </div>
        <b>Nguyên giá</b>
        <div class="body__content-body">
          <div class="content-body__header">
            <label>Nguồn hình thành</label>
            <label>Giá trị</label>
          </div>
          <div class="content-body">
            <template v-for="(task, index) in tasks" :key="index">
              <task-item-vue
                :arrData="arrData"
                :task="task"
                @addTask="addTask"
                @removeTask="removeTask"
                :index="index"
                :hasEventRemoveTask="tasks.length != 1"
                @focusIndex="focusIndex"
                ref="taskItem"
              />
            </template>
          </div>
        </div>
        <div class="body__content-bottom">
          <div class="task-form__grid">
            <div class="grid__item">
              <input-text-vue :disable="true" modelValue="Tổng" />
            </div>
            <div class="grid__item">
              <input-money-vue :disable="true" v-model="totalCost" />
            </div>
          </div>
        </div>
      </div>
      <div class="task-form__footer">
        <div class="tooltip">
          <button
            class="btn btn--primary"
            style="width: 120px"
            @click="btnOnClickSave"
          >
            Lưu
          </button>
          <span class="tooltip__text">Lưu (CTRL + S)</span>
        </div>
        <div class="tooltip">
          <button class="btn" style="width: 120px" @click="closeForm()">
            Huỷ
          </button>
          <span class="tooltip__text">Huỷ (ESC)</span>
        </div>
      </div>
    </div>
  </div>
  <the-dialog-vue
    ref="dialog"
    v-show="isShowDialog"
    @onChoose="btnOnClickChooseDialog"
  />
  <loading-process-vue v-if="isLoadingProcess" />
</template>

<script>
import MISACommon from "@/js/common";
import TaskItemVue from "./TaskItem.vue";
export default {
  name: "BaseTask",
  props: {
    msg: String,
    modelValue: Object,
    arrData: Object,
    api: String,
  },
  components: {
    TaskItemVue,
  },
  data() {
    return {
      EX_Tasks: null,
      tasks: null,
      model: null,
      index: null, //lưu chỉ số của component task item để thực hiện gọi phương thức focus
      isShowDialog: false,
      isLoadingProcess: false,
      indexStateFocus: 0, //chỉ số để focus component
    };
  },
  watch: {
    tasks: {
      handler: function () {
        this.$nextTick(function () {
          try {
            this.$refs.taskItem[this.indexStateFocus].focusName = "budgetName";
            this.$refs.taskItem[this.indexStateFocus].focusInput();
          } catch {
            this.$refs.taskItem[this.indexStateFocus - 1].focusName =
              "budgetName";
            this.$refs.taskItem[this.indexStateFocus - 1].focusInput();
          }
        });
      },
      deep: true,
    },
  },
  created() {
    this.EX_Tasks = this.modelValue.budget;
    this.tasks = JSON.parse(this.EX_Tasks);
    this.model = this.modelValue;
  },
  computed: {
    /**
     * @description: Tính tổng số tiền
     * @param: {any}
     * Author: NNduc (25/04/2023)
     */
    totalCost: function () {
      return this.tasks.reduce((accumulator, object) => {
        return accumulator + (isNaN(object.cost) ? 0 : object.cost);
      }, 0);
    },

    /**
     * @description: Tính tổng số hao mòn khấu hao
     * @param: {any}
     * Author: NNduc (11/05/2023)
     */
    totalAccumulatedDepreciation: function () {
      var diffMonths = MISACommon.diffMonths(this.model.production_year);
      return Math.round(
        ((this.model.depreciation_rate * this.totalCost) / 12) * diffMonths
      );
    },

    /**
     * @description:
     * @param: {any}
     * Author: NNduc (11/05/2023)
     */
    totalResidualValue: function () {
      return this.totalCost - this.totalAccumulatedDepreciation < 0
        ? 0
        : this.totalCost - this.totalAccumulatedDepreciation;
    },
  },
  methods: {
    focusIndex: function (index) {
      this.index = index;
    },
    addTask: function (index) {
      const item = {};
      item.budget_id = "";
      item.budget_name = "";
      item.cost = 0;
      this.tasks.splice(index + 1, 0, item);
      this.indexStateFocus = index + 1;
    },
    removeTask: function (index) {
      this.tasks.splice(index, 1);
      this.indexStateFocus = index;
    },
    validateForm: function () {
      var title = "";
      for (const key in this.tasks) {
        if (!this.tasks[key].budget_name) {
          this.$refs.taskItem[key].focusName = "budgetName";
          this.index = key;
          title = this.MISAResoure.Dialog.Title.ValidateRequired(
            this.MISAResoure.Form.Budget.Lable.BudgetName
          );
          break;
        }
        if (isNaN(this.tasks[key].cost)) {
          this.$refs.taskItem[key].focusName = "cost";
          this.index = key;
          title = this.MISAResoure.Dialog.Title.ValidateRequired(
            this.MISAResoure.Form.Budget.Lable.Cost
          );
          break;
        }
        if (this.tasks[key].cost < 1) {
          this.$refs.taskItem[key].focusName = "cost";
          this.index = key;
          title = this.MISAResoure.Dialog.Title.ValidateGreaterThanZero(
            this.MISAResoure.Form.Budget.Lable.Cost
          );
          this.focusName = "cost";
          break;
        }
      }
      var indexDuplicate = this.checkDuplicate(this.arrData, this.tasks);
      if (indexDuplicate != -1 && title == "") {
        this.index = indexDuplicate;
        this.$refs.taskItem[indexDuplicate].focusName = "budgetName";
        title = this.MISAResoure.Dialog.Title.DulicateCode(
          this.MISAResoure.Form.Budget.Lable.BudgetName,
          this.tasks[indexDuplicate].budget_name
        );
      }
      if (title) {
        this.$refs.taskItem[this.index].showTextValidate();
        this.showDialog(title, this.MISAResoure.Dialog.Button.Close);
        return false;
      } else return true;
    },
    btnOnClickSave: function () {
      if (this.validateForm()) {
        this.model.cost = this.totalCost;
        this.model.budget = JSON.stringify(this.tasks);
        this.axios
          .put(this.api, this.model)
          .then((response) => {
            this.isLoadingProcess = false;
            if (response) {
              this.$emit("load", true, [
                this.totalCost,
                this.totalAccumulatedDepreciation,
                this.totalResidualValue,
              ]);
            }
          })
          .catch((e) => {
            this.isLoadingProcess = false;
            console.log(e);
            //nếu không có kết nối mạng
            if (e.code == "ERR_NETWORK") {
              this.showDialog(
                this.MISAResoure.Dialog.Title.ErrorNetwork,
                this.MISAResoure.Dialog.Button.Close
              );
            } else {
              let errorCode = e.response.data.ErrorCode;
              if (errorCode == this.MISAEnum.ErrorCode.InvalidData) {
                this.validateForm();
              } else if (errorCode == this.MISAEnum.ErrorCode.Exception) {
                this.showDialog(
                  this.MISAResoure.Dialog.Title.Warning,
                  this.MISAResoure.Dialog.Button.Close
                );
              } else {
                this.$emit("load", false);
              }
            }
          });
      }
    },
    closeForm: function () {
      //nếu trong trạng thái sửa
      //kiểm tra hỏi có muốn thay đổi dữ liệu không? nếu có sẽ show cảnh báo
      console.log(this.EX_Tasks);

      const NW_Budget = JSON.stringify(this.tasks);
      console.log(NW_Budget);
      if (NW_Budget != this.EX_Tasks) {
        //gán các thông tin vào cảnh báo
        let title = this.MISAResoure.Dialog.Title.EditWarning;
        let titleBtnPr = this.MISAResoure.Dialog.Button.Save;
        let titleBtnSub = this.MISAResoure.Dialog.Button.DoNotSave;
        let titleBtnOut = this.MISAResoure.Dialog.Button.Cancel;
        this.showDialog(title, titleBtnPr, titleBtnOut, titleBtnSub);
      } else this.$emit("closeForm");
    },
    checkDuplicate: function (arr1, arr2) {
      var index = -1;
      for (const key1 in arr1) {
        for (const key2 in arr2) {
          if (arr1[key1].budget_name == arr2[key2].budget_name) {
            index++;
          }
          if (index == 1) {
            return key2;
          }
        }
        index = -1;
      }
      return index;
    },
    /**
     * Hàm lấy trạng thái từ dialog
     * Author NNduc(5/5/2023)
     * @param {*} choose  gía trị được gửi từ dialog sang
     */
    btnOnClickChooseDialog: function (choose) {
      //const NW_FixedAsset = JSON.stringify(this.model);
      const NW_Budget = JSON.stringify(this.tasks);
      if (
        choose == this.MISAResoure.Dialog.Button.Close ||
        choose == this.MISAResoure.Dialog.Button.No ||
        choose == this.MISAResoure.Dialog.Button.Yes ||
        (choose == this.MISAResoure.Dialog.Button.Cancel &&
          NW_Budget != this.EX_Tasks)
      ) {
        this.$refs.taskItem[this.index].focusInput();
        this.isShowDialog = false;
      } else if (
        choose == this.MISAResoure.Dialog.Button.Cancel ||
        choose == this.MISAResoure.Dialog.Button.DoNotSave
      ) {
        this.$emit("closeForm");
      } else {
        this.btnOnClickSave();
      }
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.body__content-bottom .content__toolbar {
  padding: 20px;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.toolbar__filter .txt-box--filter {
  height: 35px;
  width: 300px;
}

.task-form__body .body__content-bottom {
  height: 64px;
}
.task-form__body .body__content-body {
  background-color: #ffff;
  height: calc(100% - 64px - 35px - 64px - 8px);
}
.task-form__body .body__content-top {
  height: 64px;
}

.task-form__body {
  display: flex;
  flex-direction: column;
  background-color: #ffff;
  padding: 8px 16px;
  row-gap: 8px;
  height: calc(100% - 52px - 65px);
}

.task {
  background-color: rgba(0, 0, 0, 0.16);
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  position: fixed;
  z-index: 3;
}
.task-form {
  background-color: #ffff;
  position: absolute;
  width: 850px;
  height: 550px;
  top: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  left: 50%;
  transform: translate(-50%, -50%);
}

.task-form__header {
  display: flex;
  justify-content: space-between;
  padding: 16px 16px 20px 16px;
  height: 65px;
  align-items: center;
}
.task-form__header .header__close {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.body__content-top .task-form__grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 16px;
  /* row-gap: 20px; */
  background-color: #ffff;
  height: 64px;
}
.body__content-top .task-form__grid .grid__item:first-child {
  grid-column: 1/4;
}

.body__content-bottom .task-form__grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 16px;
  /* row-gap: 20px; */
  background-color: #ffff;
  height: 64px;
}
.body__content-bottom .task-form__grid .grid__item:first-child {
  grid-column: 1/3;
}

.content-body__header {
  height: 17px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 16px;
  /* row-gap: 20px; */
  background-color: #ffff;
}
.content-body__header label:first-child {
  grid-column: 1/3;
}

.body__content-body .content-body {
  height: calc(100% - 17px);
  overflow: auto;
}
.task-form__footer {
  padding: 0 16px;
  align-items: center;
  flex-direction: row-reverse;
  display: flex;
  column-gap: 16px;
  height: 52px;
  width: 100%;
  background-color: rgba(128, 128, 128, 0.151);
}
.task-form__footer button {
  height: 36px;
  width: 110px;
}
.content-body::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}
</style>
