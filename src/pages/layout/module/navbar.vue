<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">

      <el-tooltip effect="dark" :content="$t('navbar.screenFull')" placement="bottom">
        <screen-full class="screenfull right-menu-item"></screen-full>
      </el-tooltip>

      <el-tooltip effect="dark" :content="$t('navbar.langSelect')" placement="bottom">
        <lang-select class="international right-menu-item"></lang-select>
      </el-tooltip>

      <el-tooltip effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="avatar">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/dashboard">
            <el-dropdown-item>
              {{$t('navbar.dashboard')}}
            </el-dropdown-item>
          </router-link>
          <router-link to="/system/center">
            <el-dropdown-item>
              {{$t('navbar.myPage')}}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import Breadcrumb from '@/components/breadcrumb'
import Hamburger from '@/components/hamburger'
import ErrorLog from '@/components/error-log'
import ScreenFull from '@/components/screen-full'
import LangSelect from '@/components/lang-select'
import ThemePicker from '@/components/theme-picker'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    ScreenFull,
    LangSelect,
    ThemePicker
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.navbar
  height 50px
  line-height 50px
  border-radius 0px !important
  .hamburger-container
    line-height 58px
    height 50px
    float left
    padding 0 10px
  .breadcrumb-container
    float left
  .errLog-container
    display inline-block
    vertical-align top
  .right-menu
    float right
    height 100%
    &:focus
      outline none
    .right-menu-item
      display inline-block
      margin 0 8px
    .screenfull
      height 20px
    .international
      height 20px
      box-sizing border-box
    .theme-switch
      vertical-align 15px
    .avatar-container
      height 50px
      margin-right 30px
      .avatar-wrapper
        cursor pointer
        margin-top 5px
        position relative
        .user-avatar
          width 40px
          height 40px
          border-radius 10px
        .el-icon-caret-bottom
          position absolute
          right -20px
          top 25px
          font-size 12px
</style>
