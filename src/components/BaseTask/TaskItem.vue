<template>
  <div class="task-form__grid">
    <div class="grid__item">
      <base-combobox-vue
        lable="Nguồn hình thành"
        :hasLable="false"
        placeholder="Chọn nguồn hình thành"
        :require="true"
        :checkActive="true"
        :arrData="arrData"
        get="budget_name"
        :send="['budget_id']"
        v-model="model.budget_name"
        v-model:budget_id="model.budget_id"
        ref="budgetName"
        name="budgetName"
        @onFocusInputListener="onFocusInputListener"
      />
    </div>
    <div class="grid__item">
      <input-money-vue
        lable="Giá trị"
        :hasLable="false"
        v-model="model.cost"
        :require="true"
        ref="cost"
        name="cost"
        @onFocusInputListener="onFocusInputListener"
      />
    </div>
    <div class="grid__item-feature">
      <div class="tooltip">
        <div class="icon-add-task" @click="$emit('addTask', index)"></div>
        <span class="tooltip__text">Thêm nguồn hình thành</span>
      </div>
      <div class="tooltip">
        <div
          class="icon-delete-task"
          v-if="hasEventRemoveTask"
          @click="$emit('removeTask', index)"
        ></div>
        <span class="tooltip__text">Xoá nguồn hình thành</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TaskItem",
  props: {
    msg: String,
    task: Object,
    arrData: Object,
    index: Number,
    hasEventRemoveTask: {
      type: Boolean,
      default: true,
    },
    isFocus: Boolean,
    indexStateFocus: Number,
  },
  data() {
    return {
      model: {},
      focusName: null,
    };
  },
  created() {
    this.model = this.task;
  },
  methods: {
    onFocusInputListener: function (name) {
      this.focusName = name;
      this.$emit("focusIndex", this.index);
    },
    focusInput: function () {
      this.$refs[this.focusName].autoFocusComplete();
    },
    showTextValidate: function () {
      this.$refs[this.focusName].showTextValidate();
    },
    test:function(){
      this.$refs.budgetName.autoFocusComplete();
    }
  },
  watch: {
    task: {
      handler: function (nVal) {
        this.model = nVal;
      },
      deep: true,
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.task-form__grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 16px;
  /* row-gap: 20px; */
  background-color: #ffff;
  height: 60px;
}
.task-form__grid .grid__item:first-child {
  grid-column: 1/3;
}
.task-form__grid .grid__item-feature {
  display: flex;
  padding-top: 17px;
  column-gap: 16px;
  padding-bottom: 34px;
}
.grid__item-feature div {
  cursor: pointer;
}
</style>
