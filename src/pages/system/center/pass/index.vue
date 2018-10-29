<template>
  <div class="pass">
    <el-form :model="passModel" :rules="passRules" ref="passForm">
      <el-form-item label="原始密码" label-width="80px" prop="oldPassword">
        <el-input v-model="passModel.oldPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新的密码" label-width="80px" prop="newPassword">
        <el-input v-model="passModel.newPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" label-width="80px" prop="andPassword">
        <el-input v-model="passModel.andPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item align="center">
        <el-button type="warning" @click="change">确认修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import { passChange } from '@/api/system'
import { setPassword, getRemember } from '@/common/utils/auth'

export default {
  data() {
    const validateNew = (rule, value, callback) => {
      if (!value) {
        callback(new Error('新的密码必填项'))
      } else if (value.length < 4 || value.length > 16) {
        callback(new Error('密码长度在4~16之间'))
      } else {
        callback()
      }
    }
    const validateAnd = (rule, value, callback) => {
      if (!value) {
        callback(new Error('确认密码必填项'))
      } else if (value !== this.passModel.newPassword) {
        callback(new Error('输入密码与新的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      passModel: {},
      passRules: {
        oldPassword: [{required: true, trigger: 'blur', message: '原始密码必填项'}],
        newPassword: [{required: true, trigger: 'blur', validator: validateNew}],
        andPassword: [{required: true, trigger: 'blur', validator: validateAnd}]
      }
    }
  },
  methods: {
    change() {
      this.$refs.passForm.validate(valid => {
        if (valid) {
          passChange(this.passModel).then(() => {
            if (getRemember()) {
              setPassword(this.passModel.newPassword)
            }
            this.passModel = {}
            this.$refs.passForm.clearValidate()
          })
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.pass
  padding 50px
  .el-form
    max-width 400px
</style>
