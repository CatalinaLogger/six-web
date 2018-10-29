<template>
  <ul class="slider-menu">
    <li class="menu-item" :class="{'active':active === item.code}" v-for="(item, index) in menus" :key="index" @click="selectItem(item)">
      <svg-icon :icon-class="item.icon"></svg-icon>
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    menus: {
      type: Array,
      default: null
    },
    checked: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      active: ''
    }
  },
  mounted() {
    if (this.checked) {
      this.active = this.checked
    }
  },
  methods: {
    selectItem(val) {
      this.active = val.code
      this.$emit('select', val)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slider-menu
  list-style none
  margin 0
  padding 0
  .menu-item
    position relative
    margin-bottom 20px
    padding-left 30px
    height 50px
    cursor:pointer
    color #909399
    font-size 16px
    line-height 50px
    border-radius 8px 0 0 8px
    &:last-child
      margin-bottom 0
    &:hover
      color #606266
    &.active
      color white
      background #f55353
      span::after
        position absolute
        height 0
        border-top 25px solid #fff
        border-bottom 25px solid #fff
    span
      margin-left 20px
      &::after
        display: block;
        content: "";
        bottom: 0;
        right: 0;
        width: 0;
        border-left: 15px solid transparent;
</style>
