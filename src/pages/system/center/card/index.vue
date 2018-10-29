<template>
  <div class="card">
    <el-form :model="mineModel" ref="mineForm">
      <el-row>
        <el-col :span="8">
          <el-form-item label="昵称" label-width="80px">
            <el-input v-model="mineModel.nickName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="姓名" label-width="80px">
            <el-input v-model="mineModel.name" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所在部门" label-width="80px">
            <el-input v-model="mineModel.deptName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="short-sign" label="签名" label-width="80px">
        <el-input v-model="mineModel.say"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="性别" label-width="80px">
            <el-radio-group v-model="mineModel.sex">
              <el-radio-button label="1">男</el-radio-button>
              <el-radio-button label="0">女</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生日" label-width="80px">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="mineModel.birthday"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机" label-width="80px">
            <el-input v-model="mineModel.phone" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="座机" label-width="80px">
            <el-input v-model="mineModel.number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="紧急联系人" label-width="90px">
            <el-input v-model="mineModel.urgent"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属关系" label-width="80px">
            <el-input v-model="mineModel.relation"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系号码" label-width="80px">
            <el-input v-model="mineModel.urgentNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="微信" label-width="80px">
            <el-input v-model="mineModel.weChat"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="QQ" label-width="80px">
            <el-input v-model="mineModel.qq"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="企业邮箱" label-width="80px">
            <el-input v-model="mineModel.mail" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="私人邮箱" label-width="80px">
            <el-input v-model="mineModel.ownMail"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="address" label="所在地" label-width="80px">
        <el-row>
          <el-col :span="8"><el-cascader v-model="mineModel.address" :options="options"></el-cascader></el-col>
          <el-col :span="16"><el-input v-model="mineModel.addressDetail" placeholder="详细地址"></el-input></el-col>
        </el-row>
      </el-form-item>
      <el-form-item class="address" label="家乡" label-width="80px">
        <el-row>
          <el-col :span="8"><el-cascader v-model="mineModel.hometown" :options="options"></el-cascader></el-col>
          <el-col :span="16"><el-input v-model="mineModel.hometownDetail" placeholder="详细地址"></el-input></el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="学校" label-width="80px">
        <el-input v-model="mineModel.school"></el-input>
      </el-form-item>
      <el-form-item label="个人说明" label-width="80px">
        <el-input type="textarea" v-model="mineModel.explain"></el-input>
      </el-form-item>
      <el-form-item align="center">
        <el-button type="warning" @click="change">保存资料</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import { regionData } from 'element-china-area-data'
import { mineSelect, mineChange } from '@/api/system'

export default {
  props: {
    mine: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      options: regionData,
      mineModel: {
        name: this.mine.name,
        deptName: this.mine.deptName,
        sex: this.mine.sex,
        phone: this.mine.phone,
        mail: this.mine.mail
      },
      edit: false
    }
  },
  mounted() {
    this._getMineModel()
  },
  methods: {
    change() {
      mineChange(this.mineModel).then(() => {

      })
    },
    _getMineModel() {
      mineSelect().then(res => {
        Object.assign(this.mineModel, JSON.parse(res.data))
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.card
  padding 50px
  .nick-name
    width 40%
  .short-sign
    width 70%
  .mine-link
    width 60%
</style>
