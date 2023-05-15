<template>
  <div
    class="context-menu"
    :style="{ left: offsetX + 'px', top: offsetY + 'px' }"
    v-click-outside="closeContextMenu"
  >
    <div
      v-for="(item, i) in itemFeatureContextMenu"
      :key="i"
      class="menu-item"
      @click="openForm(item.state)"
    >
      <div :class="[item.icon,'icon-item']"></div>
      {{ item.name }}
    </div>
  </div>
</template>
<script>
export default {
  name: "BaseContextMenu",
  props: {
    msg: String,
    itemFeatureContextMenu: Array,
  },
  data() {
    return {
      offsetY: 0,
      offsetX: 0,
      id: null,
    };
  },
  methods: {
    closeContextMenu() {
      this.$emit("closeContextMenu");
    },
    openForm: function (state) {
      this.$emit("closeContextMenu");
      this.$emit("openForm", state, this.id);
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
.context-menu .menu-item .icon-item{
  width: 25px;
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
