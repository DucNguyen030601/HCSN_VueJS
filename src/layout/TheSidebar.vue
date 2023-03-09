<template>
  <div class="sidebar" :class="{ 'sidebar--close': !isShowItemMenu }">
    <div class="sidebar__logo">
      <div class="logo__img"></div>
    
      <h2 class="menu-item__list" v-if="isShowItemMenu">MISA QLTS</h2>
    </div>
    <div class="sidebar__menu">

      <template v-for="(item, index) in menu" :key="index">
        <router-link :to="`${item.Link}`"
          class="menu-item"
        >
          <div :class="item.Icon"></div>
          <div :class="`${item.Icon}-bold`"></div>
         
          <div class="menu-item__list" v-if="isShowItemMenu">

            <div class="tooltip tooltip--left" v-if="item.Tooltip" >
              <h5>{{ item.Title }}</h5>
              <span class="tooltip__text">{{ item.Tooltip }}</span>
            </div>

            <h5 v-else>{{ item.Title }}</h5>

            <div class="icon-menu-down" v-if="item.MenuItem"></div>
          </div>
        </router-link>

      </template>

    </div>
    <div class="sidebar__footer">
      <div
        :class="{
          'icon-close-sidebar': isShowItemMenu,
          'icon-open-sidebar': !isShowItemMenu,
        }"
        @click="isShowItemMenu = !isShowItemMenu"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TheSidebar",
  props: {},
  data() {
    return {
      isShowItemMenu: true,
      isActiveMenuItem: 0,
      menu: [
        {
          Title: "Tổng quan",
          MenuItem: [],
          Tooltip: "",
          Icon: "icon-watch",
          Link:'/customer'
        },
        {
          Title: "Tài sản",
          MenuItem: [],
          Tooltip: "",
          Icon:"icon-bus",
          Link:'/property'
        },
        {
          Title: "Tài sản HT-ĐB",
          MenuItem: [],
          Tooltip: "Tài sản hắt tê đê bê",
          Icon:"icon-way",
          Link:'/asset'
        },
        {
          Title: "Công cụ dụng cụ",
          MenuItem: [],
          Tooltip: "",
          Icon:"icon-brush",
          Link:'/setting'
        },
        {
          Title: "Danh mục",
          MenuItem: null,
          Tooltip: "",
          Icon:"icon-process",
          Link:'/menu'
        },
        {
          Title: "Tra cứu",
          MenuItem: [],
          Tooltip: "",
          Icon:"icon-search-menu",
          Link:'/search'
        },
        {
          Title: "Báo cáo",
          MenuItem: [],
          Tooltip: "",
          Icon:"icon-chart",
          Link:'/report'
        },
      ],
    };
  },
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a{
  text-decoration: unset;
  color:black
}
a.router-link-active{
   background-color: #1aa4c8;
    border-radius: 6px;
    opacity: 1;

}

a.router-link-active >div:nth-child(2) {
    display: block;
}
a.router-link-active >div:nth-child(1) {
    display: none;
}
</style>
