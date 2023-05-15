<template>
  <the-sidebar-vue  />
  <the-header-vue  />
  <the-content-vue />
</template>

<script>
import TheContentVue from "./layout/TheContent.vue";
import TheHeaderVue from "./layout/TheHeader.vue";
import TheSidebarVue from "./layout/TheSidebar.vue";
export default {
  name: "App",
  components: {
    TheContentVue,
    TheHeaderVue,
    TheSidebarVue,
  }
};
</script>
<style>
@import url(./css/layout/main.css);
#app {
  display: grid;
  grid-template-columns: auto 1fr;
}
</style>