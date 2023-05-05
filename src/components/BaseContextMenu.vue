<template>
  <div
    class="context-menu"
    :style="{ left: offsetX + 'px', top: offsetY + 'px' }"
    v-click-outside="closeContextMenu"
  >
    <div class="menu-item" @click="openForm(MISAEnum.FormState.Add)">
      <div class="icon-add"></div>
      Thêm tài sản
    </div>
    <div class="menu-item" @click="openForm(MISAEnum.FormState.Edit)">
      <div class="icon-edit"></div>
      Sửa tài sản
    </div>
    <div class="menu-item" @click="openForm(MISAEnum.FormState.Clone)">
      <div class="icon-copy"></div>
      Nhân bản tài sản
    </div>
    <div class="menu-item" @click="openForm(MISAEnum.FormState.Delete)">
      <div class="icon-bin"></div>
      Xoá tài sản
    </div>
  </div>
</template>
<script>
export default {
  name: "BaseContextMenu",
  props: {
    msg: String
  },
  data() {
    return {
      offsetY: 0,
      offsetX: 0,
      id:null
    };
  },
  methods: {
    closeContextMenu(){
      this.$emit('closeContextMenu')
    }
    ,
    openForm: function (state) {
      this.$emit("closeContextMenu");
      this.$emit("openForm", state,this.id);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.context-menu {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.16);
  background-color: white;
  width: 200px;
  position: fixed;
  z-index: 10000;
  overflow: hidden;
  border-radius: 4px;
}
.context-menu .menu-item {
  font-size: 14px;
  display: flex;
  height: 48px;
  align-items: center;
  padding: 0 25px;
  column-gap: 14px;
  cursor: pointer;
}
.context-menu .menu-item:hover {
  background-color: rgba(26, 164, 200, 0.2);
}
.context-menu .menu-item:first-child {
  margin-top: 16px;
}
.context-menu .menu-item:last-child {
  margin-bottom: 16px;
}
</style>
