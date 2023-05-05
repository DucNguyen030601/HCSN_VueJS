<template>
  <div class="header">
        <h3>Danh sách tài sản</h3>

        <div class="header__filter-feature">
            <div class="header__filter">
                <span>Sở tài chính</span>
                <div class="txt-box--number">
                    <input class="txt-box txt-box-al--r " value="2023" type="number">
                    <div class="icon-ip-number"></div>
                </div>
            </div>
            <ul class="header__feature">
                <li class="icon-notification"></li>
                <li class="icon-app"></li>
                <li class="icon-question"></li>
                <ul class="feature__user">
                    <li class="icon-user"></li>
                    <li class="icon-down"></li>
                </ul>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
  name: 'TheHeader',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
