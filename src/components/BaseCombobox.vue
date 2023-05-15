<template>
  <label for="" v-if="lable && hasLable"
    >{{ lable }} <span style="color: red" v-if="require">*</span></label
  >
  <div
    class="dropdown"
    :class="{ 'dropdown--filter': filter, 'dropdown--up': typeUp }"
    v-click-outside="closeMenu"
    @mouseleave="isStateMenu = false"
  >
    <div class="dropdown__select">
      <input
        class="txt-box"
        :placeholder="placeholder"
        :disabled="disable"
        v-model.trim="value"
        :class="{
          'input-err': isValid,
          'placeholder-normal': styleplaceholder == 'normal',
        }"
        @keydown="stateKeyDown($event)"
        @input="stateSearchInput($event.target.value)"
        @blur="onBlurInputValidate"
        ref="input"
        @click="openMenu"
        @mousedown.left="isStateMenu = true"
        @focus="onFocusInputListener"
      />
      <div
        class="icon-dr-down"
        @click="stateMenu"
        @mousedown.left="isStateMenu = true"
        v-if="!typeUp"
      ></div>
      <div
        class="icon-dr-up"
        @click="stateMenu"
        @mousedown.left="isStateMenu = true"
        v-if="typeUp"
      ></div>
      <div class="icon-filter" v-if="filter"></div>
    </div>
    <div
      class="dropdown__menu"
      v-show="isShowMenu"
      :class="{ 'dropdown__menu--nc': !checkActive }"
      ref="menu"
    >
      <template v-for="(item, index) in model" :key="index">
        <div
          class="menu__item"
          :class="{
            active: index == active,
            'active-check':
              (get ? item[get] : item) == checkValue && checkActive,
          }"
          @mousedown.left="isStateMenu = true"
          @click="getValue(item)"
          ref="menuItem"
        >
          {{ get ? item[get] : item }}
        </div>
      </template>
      <base-no-data-vue size="medium" v-if="model.length == 0" />
    </div>
  </div>
  <div class="txt--error" style="color: red" v-if="isValid && txtValid != ''">
    {{ txtValid }}
  </div>
</template>
<script>
import BaseNoDataVue from "./BaseNoData.vue";
export default {
  name: "BaseCombobox",
  components: {
    BaseNoDataVue,
  },
  props: {
    modelValue: String,
    filter: Boolean,
    typeUp: Boolean,
    checkActive: Boolean, //cho phép lên xuống dòng
    lable: String,
    hasLable: {
      type: Boolean,
      default: true,
    },
    placeholder: String,
    require: Boolean,
    disable: Boolean,
    isFocus: Boolean,
    api: String,
    arrData: Array,
    get: [Array, String],
    send: [Array, String],
    isReadOnly: Boolean,
    styleplaceholder: String,
    name: String,
  },
  watch: {
    modelValue: function (nVal) {
      this.value = nVal;
    },
  },
  created() {
    this.value = this.modelValue;
    if (this.api) {
      //lấy dữ liệu từ api rồi gán vào model
      fetch(this.api)
        .then((res) => res.json())
        .then((data) => {
          this.EX_MODEL = data; //dữ liệu gốc
          this.model = data;
        });
    } else if (this.arrData) {
      this.EX_MODEL = this.arrData; //dữ liệu gốc
      this.model = this.arrData;
    }
  },
  mounted() {
    if (this.isReadOnly) {
      this.$nextTick(function () {
        this.$refs.input.readOnly = true;
      });
    }
    if (this.isFocus) {
      this.$nextTick(function () {
        this.autoFocusComplete();
      });
    }
  },
  methods: {
    /**
     * @description: Sự kiện focus để lấy name chuyển sang component cha
     * @param: {any}
     * Author: NNduc (21/04/2023)
     */
    onFocusInputListener: function () {
      this.checkValue = this.value;
      this.$emit("onFocusInputListener", this.name);
    },
    /**
     * @description: Sự kiện click bên ngoài đóng menu
     * @param: {any}
     * Author: NNduc (21/04/2023)
     */
    closeMenu() {
      this.isShowMenu = false;
    },
    /**
     * Hàm để xử lý người dùng focus vào ô input thì hiện toàn bộ item
     * Nếu giá trị trùng với item ở ô thì hiện active
     * Author NNduc(7/3/2023)
     */
    openMenu: function () {
      this.isShowMenu = true;
      //kiểm tra giá trị với các item menu
      this.checkItemMenu();
    },

    stateMenu: function () {
      this.$refs.input.focus();
      this.isShowMenu = !this.isShowMenu;
      if (this.isShowMenu) this.checkItemMenu();
    },
    /**
     * Hàm kiểm tra trong danh sách xem có item nào trùng với value không
     * nếu có thì cho item đấy active
     * Author NNduc(6/3/2023)
     */
    checkItemMenu: function () {
      this.active = -1;
      this.checkValue = "";
      this.model = this.EX_MODEL;
      for (const key in this.model) {
        let val = this.get ? this.model[key][this.get] : this.model[key];
        if (val == this.value) {
          this.active = key;
          this.checkValue = val;
        }
      }
    },
    /**
     * Hàm lấy giá trị từ sự kiện click và sau đó update dữ liệu lấy và đi
     * Author NNduc(9/3/2023)
     * @param {*} getItem  gía trị muốn lấy
     */
    getValue: function (getItem) {
      if (!getItem) {
        if (this.send) {
          this.send.forEach((element) => {
            this.$emit(`update:${element}`, "");
          });
        }
        this.value = "";
        this.$emit("update:modelValue", "");
      } else {
        this.value = this.get ? getItem[this.get] : getItem;
        if (this.send) {
          this.send.forEach((element) => {
            this.$emit(`update:${element}`, getItem[element]);
          });
        }
        this.$emit("update:modelValue", this.value);
        this.isValid = false;
      }
      this.checkValue = this.value;
      this.$refs.input.focus();
      this.isShowMenu = false;
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
          coordinatesY += this.$refs.menuItem[index].offsetHeight;
        }
        this.$refs.menu.scrollTo({
          top: coordinatesY,
          left: 0,
          behavior: "smooth",
        });
      }
    },
    /**
     * Hàm xử lý các sự kiện ấn nút lên, nút xuống, enter để chọn các item tương ứng
     * Author NNduc(7/3/2023)
     */
    stateKeyDown: function (evt) {
      if (!this.checkActive) return;
      var charCode = evt.keyCode;
      switch (charCode) {
        case this.MISAEnum.KeyCode.ArrowDown:
          evt.preventDefault();
          if (this.active > this.model.length - 2) {
            this.active = 0;
          } else {
            this.active++;
          }
          this.scrollItem(this.active);
          break;
        case this.MISAEnum.KeyCode.ArrowUp:
          evt.preventDefault();
          if (this.active == 0) {
            this.active = this.model.length - 1;
          } else {
            this.active--;
          }
          this.scrollItem(this.active);
          break;
        case this.MISAEnum.KeyCode.Enter:
          evt.preventDefault();
          if (this.isShowMenu) this.getValue(this.model[this.active]);
          else this.openMenu();
          break;
        case 9:
          this.isStateMenu = false;
          break;
        default:
          break;
      }
    },

    /**
     * Hàm xử lý sự kiện tìm kiếm các item tương ứng của menu
     * Author NNduc (7/3/2023)
     */
    stateSearchInput: function (nVal) {
      const get = this.get;
      this.active = -1;
      this.model = this.EX_MODEL.filter(function (item) {
        return item[get].toLowerCase().includes(nVal.toLowerCase());
      });
    },

    /**
     * @description:Hàm xử lý khi inpur blur
     * @param: {any}
     * Author: NNduc (11/04/2023)
     */
    onBlurInputValidate: function () {
      if (!this.isStateMenu) {
        if (!this.value && this.require && !this.checkValue) {
          this.isValid = true;
          this.txtValid = this.MISAResoure.Validate.Required(this.lable);
        } else {
          this.value = this.checkValue;
          this.isValid = false;
        }
        this.isShowMenu = false;
      }
      this.isStateMenu = false;
    },

    /**
     * @description: Focus cho input
     * @param: {any}
     * Author: NNduc (11/04/2023)
     */
    autoFocusComplete: function () {
      this.$refs.input.focus();
    },

    /**
     * @description: Hiện cảnh báo và hiện text khi người dùng sai thông tin
     * @param: {any}
     * Author: NNduc (29/04/2023)
     */
    showTextValidate() {
      this.$refs.input.blur();
      this.isValid = true;
      //this.txtValid = s;
    },
  },
  data() {
    return {
      value: null,
      isValid: false,
      txtValid: null,
      isShowMenu: false,
      model: [{}],
      EX_MODEL: [{}],
      active: -1,
      checkValue: "",
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dropdown__menu {
  display: block;
}
.input-err {
  border: 1px solid red;
}
input:read-only {
  cursor: default;
}
.placeholder-normal::placeholder {
  font-style: normal;
  color: black;
}
</style>
