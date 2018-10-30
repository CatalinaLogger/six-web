<template>
  <div class="app-container back none">
    <div class="form-wrapper">
      <el-form :model="workModel" :rules="workRules" label-position="left" ref="workForm">
        <el-form-item>
          <div class="header">
            <div class="title">
              <p class="title zh">合同签署</p>
              <p class="title en">Contract application</p>
            </div>
            <div class="operate" v-if="formKey === 'a'">
              <el-button type="info" @click="closeClick">关闭申请</el-button>
              <el-button type="warning" @click="clearClick" v-if="draft">清除草稿</el-button>
              <el-button type="success" @click="saveClick(workModel)">保存草稿</el-button>
              <el-button type="danger" @click="cancelClick()" v-if="task.id">取消申请</el-button>
              <el-button type="primary" @click="startClick()" :loading="loading">提交申请</el-button>
            </div>
          </div>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="部门负责人" prop="leader">
              <el-select v-model="workModel.leader" placeholder="请选择">
                <el-option
                  v-for="item in userList"
                  :disabled="item.username === workModel.helper"
                  :key="item.id"
                  :label="item.name"
                  :value="item.username">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联部门负责人" prop="helper">
              <el-select v-model="workModel.helper" placeholder="请选择">
                <el-option></el-option>
                <el-option
                  v-for="item in userList"
                  :disabled="item.username === workModel.leader"
                  :key="item.id"
                  :label="item.name"
                  :value="item.username">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="formKey === 'a'">
          <tinymce v-model="workModel.content" :height=800 ref="editor"/>
        </el-form-item>
        <el-form-item v-else>
          <div v-html="workModel.content"></div>
        </el-form-item>
        <approve-panel :formKey="formKey" :processId="task.procInstId" @handel="solveProcess">
          <el-row class="handel-button" type="flex" justify="center" v-if="formKey && formKey === 'c'">
            <el-col :span="24">
              <el-button type="danger" icon="el-icon-error" @click="closeClick">暂不采购</el-button>
              <el-button type="success" icon="el-icon-success" @click="solveProcess({taskCode: 100})">确认采购</el-button>
            </el-col>
          </el-row>
        </approve-panel>
      </el-form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Tinymce from '@/components/tinymce'
import { flowFormMixin } from '@/common/utils/mixin'
import { getUserListRole } from '@/api/system'
import { startEasy, solveEasy, selectEasy } from '@/api/work'

export default {
  name: 'keep_contract',
  mixins: [flowFormMixin],
  data() {
    return {
      workRules: {
        leader: [{required: true, message: '部门负责人为必选项', trigger: 'blur'}]
      },
      userList: [],
      loading: false
    }
  },
  created() {
    this._getUserRole()
  },
  methods: {
    /** 发起人处理结果 */
    startProcess(param) {
      this.loading = true
      param.exist = 0
      param.leader = this.workModel.leader
      param.helper = this.workModel.helper
      param.content = this.workModel
      startEasy(param).then(() => {
        this.closeClick()
        this.$router.push('/flow/start')
        this.loading = false
      }, () => {
        this.loading = false
      })
    },
    /** 审核人处理结果 */
    solveProcess(param) {
      this.loading = true
      param.taskId = this.task.id
      solveEasy(param).then(() => {
        this.closeClick()
        this.$router.push('/task/wait')
        this.loading = false
      }, () => {
        this.loading = false
      })
    },
    /** 创建申请表单数据 */
    _createWorkModel() {
      let date = new Date()
      let content =
        `<p style="text-align: center; font-size: 26px;"><strong>合同签署审批表</strong></p>
        <p style="text-align: right; margin: 0;">编号：ZH01-2018</p>
        <table style="width: 100%; border-collapse: collapse;" border="1" cellspacing="0" cellpadding="10">
        <tbody>
        <tr>
        <td style="width: 100%;">
        <p style="margin: 0;">申请人：${this.mine.name}<span style="float: right;">申请时间：${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日</span></p>
        </td>
        </tr>
        <tr>
        <td style="width: 100%; text-align: center;"><strong>合同基本情况</strong></td>
        </tr>
        <tr>
        <td style="width: 100%;">合同类型：<label><input name="Fruit" type="checkbox" value="" />技术咨询</label> <label><input name="Fruit" type="checkbox" value="" />技术开发</label> <label><input name="Fruit" type="checkbox" value="" />电子元件或设备 </label> <label><input name="Fruit" type="checkbox" value="" />科研 </label> <label><input name="Fruit" type="checkbox" value="" />其它 </label></td>
        </tr>
        <tr>
        <td style="width: 100%;">甲方： 湖南北斗微芯产业发展有限公司</td>
        </tr>
        <tr>
        <td style="width: 100%;">乙方： 深圳市盛达电子科技有限公司</td>
        </tr>
        <tr>
        <td style="width: 100%;">合同名称：《销售合同》</td>
        </tr>
        <tr>
        <td style="width: 100%;">合同标的：我公司采购LT1962EMS8-3.3 器件一批，详细数量及单价见《销售合同》</td>
        </tr>
        <tr>
        <td style="width: 100%;">合同金额： ￥ <span style="text-decoration: underline;">15048.00</span>&nbsp;（ 大写： <span style="text-decoration: underline;">一万伍仟零肆拾捌元整</span> ）</td>
        </tr>
        <tr>
        <td style="width: 100%;">支付方式： 银行转账，款到发货。</td>
        </tr>
        <tr>
        <td style="width: 100%;">合同生效时间：${date.getFullYear()}年${date.getMonth() + 1}月日（双方签字盖章后即刻生效）</td>
        </tr>
        <tr>
        <td style="width: 100%;">合同终止时间：${date.getFullYear()}年${date.getMonth() + 1}月日</td>
        </tr>
        <tr>
        <td style="width: 100%;">&nbsp;</td>
        </tr>
        <tr>
        <td style="width: 100%;">&nbsp;</td>
        </tr>
        </tbody>
        </table>`
      this.workModel = {content: content}
    },
    /** 查询申请表单数据 */
    _selectWorkModel() {
      selectEasy(this.task.procInstId).then(res => {
        this.workModel = JSON.parse(res.data.content)
      })
    },
    _getUserRole() {
      getUserListRole('leader').then(res => {
        this.userList = res.data
      })
    }
  },
  components: {
    Tinymce
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
