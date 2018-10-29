<template>
  <div class="login">
    <div class="login-form">
      <div class="title-container">
        <h3 class="title">{{$t('login.title')}}</h3>
        <lang-select class="set-language"></lang-select>
      </div>
      <el-form v-if="formType==='login'" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" autoComplete="off" :key="1">
        <el-form-item prop="username">
          <span class="svg-container svg-container_login">
            <svg-icon icon-class="username" />
          </span>
          <el-input name="username" type="text" v-model="loginForm.username" :placeholder="$t('login.username')"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"></svg-icon>
          </span>
          <el-input name="password" :type="pwdType"  v-model="loginForm.password" :placeholder="$t('login.password')"
                    @keyup.enter.native="handleLogin"></el-input>
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="eyeType"/>
          </span>
        </el-form-item>
        <el-button type="primary" style="width:100%" :loading="loading" @click.native.prevent="handleLogin">{{$t('login.logIn')}}</el-button>
        <div class="bottom-bar">
          <el-checkbox v-model="loginForm.remember">{{$t('login.remember')}}</el-checkbox>
          <div class="forget" @click="forgetPassword">{{$t('login.forget')}}</div>
        </div>
      </el-form>

      <el-form v-else class="reset-form" :model="resetForm" :rules="resetRules" ref="resetForm" label-position="left" label-width="0px" :key="2">
        <el-form-item prop="mail">
          <el-input v-model="resetForm.mail" :placeholder="$t('login.mail')"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="14">
            <el-form-item prop="code">
              <el-input v-model="resetForm.code" :placeholder="$t('login.code')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <img class="check-code" :src="`${baseURL}/auth/kaptcha/${timeStamp}`" @click="refreshImage"/>
          </el-col>
        </el-row>
        <el-button type="primary" style="width:100%" :loading="loading" @click.native.prevent="handleReset">{{$t('login.reset')}}</el-button>
        <div class="bottom-bar">
          <div class="forget" @click="toLogin">{{$t('login.toLogin')}}</div>
        </div>
      </el-form>
    </div>
    <el-carousel :interval="10000" height="100vh">
      <el-carousel-item v-for="(item, index) in dailyArr" :key="index">
        <div class="daily-item" :style="{backgroundImage:`url(${item.pictureUrl})`,backgroundRepeat:'no-repeat',backgroundSize:'cover'}" :key="index">
          <div class="daily-item-content">
            <div class="date-wrapper">
              <div class="left">{{item.month}}</div>
              <div class="right">
                <span class="date">{{item.date}}</span>
                <span class="week">{{item.week}}</span>
              </div>
            </div>
            <p class="text-en"  @click.stop="togglePlaying(item.tts)">{{item.content}}<svg-icon icon-class="suona"/></p>
            <p class="text-zh">{{item.note}}</p>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <audio :src="map3Url" ref="audio"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import LangSelect from '@/components/lang-select'
import { getUsername, getPassword, getRemember } from '@/common/utils/auth'

export default {
  data() {
    const validateCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('验证码不能为空'))
      } else if (value.length !== 4) {
        callback(new Error('验证码由4位数字和字母组成'))
      } else {
        callback()
      }
    }
    return {
      baseURL: process.env.BASE_API,
      timeStamp: '',
      loginForm: {
        username: getUsername(),
        password: getPassword(),
        remember: getRemember()
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '账号不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
      },
      resetForm: {
        mail: '',
        code: ''
      },
      resetRules: {
        mail: [{ required: true, trigger: 'blur', message: '邮箱不能为空' }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
      },
      loading: false,
      pwdType: 'password',
      eyeType: 'eye-off',
      formType: 'login',
      handDate: new Date(),
      dailyArr: [],
      map3Url: ''
    }
  },
  created() {
    this.getDaily()
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
        this.eyeType = 'eye-on'
      } else {
        this.pwdType = 'password'
        this.eyeType = 'eye-off'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleReset() {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Reset', this.resetForm).then(() => {
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    forgetPassword() {
      this.formType = 'reset'
    },
    refreshImage() {
      this.timeStamp = new Date().getTime()
    },
    toLogin() {
      this.formType = 'login'
    },
    getDaily() {
      const date = this.handDate.getFullYear() + '-' + this.prefixInteger((this.handDate.getMonth() + 1), 2) + '-' + this.prefixInteger(this.handDate.getDate(), 2)
      this.$store.dispatch('GetDaily', date).then(res => {
        const format = this.formatDateToEn(this.handDate)
        res.pictureUrl = res.picture2.replace('http', 'https')
        Object.assign(res, format)
        res.formatDate = this.handDate
        this.dailyArr = this.dailyArr.concat(res)
        this.handDate.setDate(this.handDate.getDate() - 1)
        if (this.dailyArr.length < 7) {
          this.getDaily()
        }
      }).catch(() => {
        this.loading = false
      })
    },
    prefixInteger(num, n) {
      return (Array(n).join(0) + num).slice(-n)
    },
    formatDateToEn(date) {
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const monName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      return {
        week: dayName[date.getDay()],
        date: `${date.getDate()}th`,
        month: monName[date.getMonth()]
      }
    },
    togglePlaying(url) {
      this.map3Url = url
      setTimeout(() => {
        this.$refs.audio.play()
      }, 100)
    }
  },
  components: {
    LangSelect
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  $form_bg = #ebebeb
  $dark_gray = #889aa4
  $light_gray = #eee

  .login
    position fixed
    width 100%
    height 100%
    input:-webkit-autofill
      -webkit-box-shadow 0 0 0px 1000px #ffffff inset !important
      -webkit-text-fill-color #000000 !important
    input
      background transparent
      border 0px
      -webkit-appearance none
      border-radius 0px
      padding 12px 5px 12px 15px
      color #000000
      height 47px
    .login-form
      position absolute
      z-index 100
      top 20%
      right 10%
      width 400px
      padding 35px 35px 25px 38px
      border 1px solid $form_bg
      border-radius 10px
      background $form_bg
      &:hover
        box-shadow 2px 4px 8px 4px #ccc
      .bottom-bar
        margin-top 5px
        .el-checkbox
          color #409eff
        .forget
          display inline-block
          float right
          cursor pointer
          color #409eff
          font-size 14px
          line-height: 19px
    .title-container
      position relative
      .title
        font-size 26px
        font-weight 400
        color #409eff
        margin 0px auto 30px auto
        text-align center
        font-weight bold
      .set-language
        position absolute
        color $dark_gray
        top 0px
        right 0px
    .el-form-item
      border 1px solid $form_bg
      border-radius 5px
      background white
    .svg-container
      padding 6px 5px 6px 15px
      color $dark_gray
      vertical-align middle
      width 30px
      display inline-block
      &_login
        font-size 20px
    .show-pwd
      position absolute
      right 10px
      top 7px
      font-size 16px
      color $dark_gray
      cursor pointer
      user-select none
    .el-input
      display inline-block
      height 47px
      width 85%
    .reset-form
      .el-input
        display inline-block
        padding-top 8px
        height 52px
        width 100%
      .check-code
        display inline-block
        margin-top 1px
        width 122px
        height 52px

  .daily-item
    position relative
    width 100vw
    height 100vh
    color white
    background-repeat no-repeat
    background-size cover
    .daily-item-content
      position absolute
      width 100%
      height 100%
      padding 40px
      .date-wrapper
        display inline-block
        padding 10px 30px
        background-color rgba(0,0,0,.3)
        .left
          display inline-block
          font-size 50px
        .right
          display inline-block
          margin-left 10px
          .date
            display block
      .text-en
        position absolute
        bottom 120px
        font-size 26px
      .text-zh
        position absolute
        bottom 40px
        font-size 26px
</style>
