<template>
  <div class="dialog">
    <div class="dialog-form">
      <div class="dialog-form__body">
        <div class="icon-dialog-warning"></div>
        <div class="body__content" v-html="title"></div>
      </div>
      <div class="dialog-form__footer">
        <button class="btn btn--primary" @click="$emit('onChoose',titleBtnPr)" v-if="titleBtnPr">
          {{ titleBtnPr }}
        </button>
        <button class="btn btn--sub"   @click="$emit('onChoose',titleBtnSub)" v-if="titleBtnSub">
          {{ titleBtnSub }}
        </button>
        <button class="btn btn--outline"  @click="$emit('onChoose',titleBtnOut)" v-if="titleBtnOut">
          {{ titleBtnOut }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseDialog",
  data() {
    return {
      choose: null,
      title:null,
      titleBtnPr: null,
      titleBtnSub: null,
      titleBtnOut: null,
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
