<template>
  <div class="app-container none">
    <div class="center-header">
      <div class="back-box">
        <img class="bg-image" :src="avatar">
      </div>
      <div class="avatar-box">
        <div class="button" @click="setAvatar">设置头像</div>
        <img class="avatar" :src="avatar">
      </div>
      <div class="content-box">
        <div class="left">
          <p class="nick-name">{{mineInfo.name}}</p>
          <p class="sex-dept">
            <span class="sex">{{mateSex(mineInfo.sex)}}</span>
            <span class="dept">{{mineInfo.deptName}}</span>
          </p>
          <p class="signature" v-if="mineInfo.say">{{mineInfo.say}}</p>
          <p class="signature" v-else>这个人很懒，什么也没写</p>
        </div>
        <div class="right"></div>
      </div>
      <upload-shape v-model="show" :url="url" :headers="headers" @upload-success="uploadSuccess"></upload-shape>
    </div>
    <div class="center-body">
      <div class="left">
        <slider-menu :menus="menus" :checked="active" @select="selectItem"></slider-menu>
      </div>
      <div class="right">
        <card :mine="mineInfo" v-if="mineInfo.name && active === 'card'"></card>
        <pass v-if="active === 'pass'"></pass>
        <div v-if="active === 'bind'"></div>
        <sign v-if="active === 'sign'"></sign>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import store from '@/store'
import Card from './card/index'
import Pass from './pass/index'
import Sign from './sign/index'
import TitleLine from '@/components/title-line'
import SliderMenu from '@/components/slider-menu'
import UploadShape from '@/components/upload-shape'
import { mapGetters } from 'vuex'
import { getToken } from '@/common/utils/auth'
import { getMineInfo } from '@/api/system'
import { getConfDataTree } from '@/api/global'

export default {
  data() {
    return {
      baseURL: process.env.BASE_API,
      show: false,
      headers: {'X-Token': getToken()},
      menus: [
        {code: 'card', name: '个人信息', icon: 'user-card'},
        {code: 'pass', name: '修改密码', icon: 'user-pass'},
        {code: 'bind', name: '账号绑定', icon: 'user-bind'},
        {code: 'sign', name: '登录日志', icon: 'user-sign'}
      ],
      active: 'card',
      mineInfo: {},
      sexList: []
    }
  },
  computed: {
    url() {
      return `${this.baseURL}/system/user/avatar`
    },
    ...mapGetters([
      'avatar'
    ])
  },
  mounted() {
    this._initData()
  },
  methods: {
    selectItem(val) {
      this.active = val.code
    },
    setAvatar() {
      this.show = true
    },
    uploadSuccess() {
      store.dispatch('GetInfo')
    },
    mateSex(sex) {
      if ((sex || sex === 0) && this.sexList.length > 0) {
        return this.sexList.filter(item => {
          return item.value === sex
        })[0].name
      } else {
        return '未知'
      }
    },
    _initData() {
      getConfDataTree('UserSex').then(res => {
        this.sexList = res.data
      })
      getMineInfo().then(res => {
        this.mineInfo = res.data
      })
    }
  },
  components: {
    TitleLine,
    SliderMenu,
    UploadShape,
    Card,
    Pass,
    Sign
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.center-header
  position relative
  width 100%
  height 150px
  .back-box
    width 100%
    height 100%
    overflow hidden
    .bg-image
      width 100%
      margin-top -50%
      filter blur(50px) grayscale(100%)
  .avatar-box
    position absolute
    top 20px
    left 80px
    width 150px
    height 150px
    z-index 10
    border 1px solid white
    border-radius 50%
    background white
    &:hover
      cursor:pointer
      .avatar
        transform translateX(130px) rotate(180deg)
    .button
      position absolute
      margin-top 50px
      width 100%
      color white
      text-align center
      line-height 50px
      background #ccc
      border-radius 20px
    .avatar
      position absolute
      width 100%
      border-radius 50%
      transition transform 0.3s ease-in-out 0.2s, opacity 0.3s ease-in-out 0.2s, background 0.2s linear 0s
  .content-box
    position absolute
    top 40px
    left 270px
    width 70%
    height 100px
    .left
      float left
      .nick-name
        margin 0
        color white
        font-size 24px
        font-weight bold
      .sex-dept
        margin 5px 0
        color white
        .sex
          padding-right 20px
          border-right 2px solid white
        .dept
          padding-left 15px
      .signature
        color #e7e7e7
        font-size 14px
    .right
      float right
.center-body
  display flex
  .left
    padding 40px 20px 0 60px
    min-width 270px
  .right
    position relative
    flex-grow 1
    min-width 800px
</style>
