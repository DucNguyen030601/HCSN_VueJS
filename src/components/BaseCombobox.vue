<template>
  <label for="" v-if="lable && hasLable"
    >{{ lable }} <span style="color: red" v-if="require">*</span></label
  >
  <div
    class="dropdown"
    :class="{ 'dropdown--filter': filter, 'dropdown--up': typeUp }"
    v-click-outside="closeMenu"
  >
    <div class="dropdown__select">
      <input
        class="txt-box"
        :placeholder="placehoder"
        :disabled="disable"
        v-model="value"
        :class="{
          'input-err': isValid,
          'placehoder-normal': stylePlacehoder == 'normal',
        }"
        @focus="openMenu"
        @keydown="stateKeyDown($event)"
        @input="stateSearchInput"
        @blur="onBlurInputValidate"
        ref="input"
      />
      <div class="icon-dr-down" @click="stateMenu" v-if="!typeUp"></div>
      <div class="icon-dr-up" @click="stateMenu" v-if="typeUp"></div>
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
            'active-check': index == activeCheck && checkActive,
          }"
          @mousedown.left="getValue(item)"
          ref="menuItem"
        >
          {{ get ? item[get] : item }}
        </div>
      </template>
    </div>
  </div>
  <div class="txt--error" style="color: red" v-if="isValid && txtValid != ''">
    {{ txtValid }}
  </div>
</template>
<script>
export default {
  name: "BaseCombobox",
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
    placehoder: String,
    require: Boolean,
    disable: Boolean,
    api: String,
    arrData: Array,
    get: [Array, String],
    send: [Array, String],
    isReadOnly: Boolean,
    stylePlacehoder: String,
    name: Object,
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
  },
  methods: {
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
      this.$emit("onFocusInputListener", this.name);
    },

    stateMenu: function () {
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
      this.activeCheck = -1;
      this.model = this.EX_MODEL;
      for (const key in this.model) {
        let val = this.get ? this.model[key][this.get] : this.model[key];
        if (val == this.value) {
          this.active = key;
          this.activeCheck = key;
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
      this.isShowMenu = false;
      this.$refs.input.blur();
    },

    /**
     * Hàm xử lý các sự kiện ấn nút lên, nút xuống, enter để chọn các item tương ứng
     * Author NNduc(7/3/2023)
     */
    stateKeyDown: function (evt) {
      if (!this.checkActive) return;
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      switch (charCode) {
        case this.MISAEnum.KeySate.ArrowDown:
          if (this.active > this.model.length - 2) {
            this.active = 0;
            this.$refs.menu.scrollTop = 0;
          } else {
            this.active++;
            this.$refs.menuItem[this.active].scrollIntoView({
              behavior: "smooth",
            });
          }
          break;
        case this.MISAEnum.KeySate.ArrowUp:
          if (this.active == 0) {
            this.active = this.model.length - 1;
            this.$refs.menu.scrollTop = this.$refs.menu.scrollHeight;
          } else {
            this.active--;
            if (this.active == 0) this.$refs.menu.scrollTop = 0;
            else
              this.$refs.menuItem[this.active].scrollIntoView({
                behavior: "smooth",
              });
          }
          break;
        case this.MISAEnum.KeySate.Enter:
          this.getValue(this.model[this.active]);
          break;
        default:
          break;
      }
    },

    /**
     * Hàm xử lý sự kiện tìm kiếm các item tương ứng của menu
     * Author NNduc (7/3/2023)
     */
    stateSearchInput: function () {
      const get = this.get;
      const val = this.value;
      if (!val) {
        this.active = -1;
        this.activeCheck = -1;
      }
      this.model = this.EX_MODEL.filter(function (item) {
        return item[get].toLowerCase().includes(val.toLowerCase());
      });
    },

    /**
     * @description:Hàm xử lý khi inpur blur
     * @param: {any}
     * Author: NNduc (11/04/2023)
     */
    onBlurInputValidate: function () {
      if (!this.value && this.require) {
        this.isValid = true;
        this.txtValid = this.MISAResoure.Validate.Required(this.lable);
      } else this.isValid = false;
      setTimeout(() => {
        this.isShowMenu = false;
      }, 100);
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
      activeCheck: -1,
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
.placehoder-normal::placeholder {
  font-style: normal;
  color: black;
}
</style>
