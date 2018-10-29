<template>
  <div class="title-line" :class="type">
    <div class="title">
      {{title}}
    </div>
    <div class="empty"></div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'primary'
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.title-line
  position relative
  .title
    position absolute
    display inline-block
    padding 0 10px
    height 40px
    font-weight bold
    font-size 15px
    line-height 40px
    z-index 1
  .empty
    position absolute
    width 100%
    height 40px
  &.primary
    .title
      border-bottom 4px solid #409eff
    .empty
      border-bottom 4px solid #b3d8ff
  &.success
    .title
      border-bottom 4px solid #67c23a
    .empty
      border-bottom 4px solid #c2e7b0
  &.info
    .title
      border-bottom 4px solid #606266
    .empty
      border-bottom 4px solid #d3d4d6
</style>
