<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon class-name='international-icon' icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="language==='zh'">中文</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="language==='en'">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script type="text/ecmascript-6">
export default {
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('setLanguage', lang)
      let message = 'switch language success'
      if (lang === 'zh') {
        message = '切换语言成功'
      }
      this.$message({
        message: message,
        type: 'success'
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.international
  height 20px
.international-icon
  display inline-block
  vertical-align top !important
  font-size 20px
  cursor pointer
</style>
