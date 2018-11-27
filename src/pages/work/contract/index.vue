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
        <el-row :gutter="20" v-if="!readOnly && formKey === 'a'">
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
        <el-form-item v-if="!readOnly && formKey === 'a'">
          <tinymce v-model="workModel.content" :height=800 ref="showDialog"/>
        </el-form-item>
        <div class="content" v-html="workModel.content" v-else></div>
        <approve-panel :readOnly="readOnly" :formKey="formKey" :processId="task.procInstId" @handel="showDialog">
          <el-row class="handel-button" type="flex" justify="center" v-if="!readOnly && formKey === 'b'">
            <el-col :span="24">
              <el-button type="info" icon="el-icon-info" @click="closeClick">暂不处理</el-button>
              <el-button type="success" icon="el-icon-success" @click="showDialog({taskCode: 100, taskName: '确认签署', message: '请确认物品是否已经采购完毕，点击确定后将不可修改！'})">确认签署</el-button>
            </el-col>
          </el-row>
        </approve-panel>
      </el-form>
    </div>
    <el-dialog
      top="0"
      width="500px"
      title="操作提示"
      :visible.sync="visible">
      <div>
        <p class="strong-font danger">{{message}}</p>
        <p class="strong-font info">确定要这么做吗？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="solveProcess(param)">确 定</el-button>
      </div>
    </el-dialog>
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
      loading: false,
      visible: false,
      message: ''
    }
  },
  created() {
    this._getUserRole()
  },
  methods: {
    showDialog(param) {
      this.param = param
      this.message = param.message
      this.visible = true
    },
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
      this.visible = false
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
          `<table style="width: 100%; border-collapse: collapse; border-style: hidden;">
          <tbody>
          <tr>
          <td style="width: 33.3333%; border-style: hidden;"><img class="wscnph" src="http://10.10.10.164/group1/M00/00/00/CgoKpFvzcFaAH2GrAAAVNGfIFTk950.png" /></td>
          <td style="width: 33.3333%; border-style: hidden; text-align: center; font-size: 30px;"><span style="color: #303133;"><strong>合同签署审批表</strong></span></td>
          <td style="width: 33.3333%; border-style: hidden;">&nbsp;</td>
          </tr>
          </tbody>
          </table>
          <table style="width: 100%; border-collapse: collapse;" border="1" cellpadding="10">
          <tbody>
          <tr>
          <td style="width: 3%; background: #efefef;"><span style="color: #409eff; font-weight: bold;">申请人</span></td>
          <td style="width: 10%;">${this.mine.name}</td>
          <td style="width: 3%; background: #efefef;"><span style="color: #409eff; font-weight: bold;">申请时间</span></td>
          <td style="width: 10%;">${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日</td>
          </tr>
          <tr>
          <td style="width: 25%; background: #efefef; text-align: center;" colspan="4"><span style="color: #409eff; font-weight: bold;">合同基本情况</span></td>
          </tr>
          <tr>
          <td style="background: #efefef;"><span style="color: #409eff; font-weight: bold;">合同类型</span></td>
          <td colspan="3"><label><input name="Fruit" type="checkbox" value="" />技术咨询</label> <label><input name="Fruit" type="checkbox" value="" />技术开发</label> <label><input name="Fruit" type="checkbox" value="" />电子元件或设备 </label> <label><input name="Fruit" type="checkbox" value="" />科研 </label> <label><input name="Fruit" type="checkbox" value="" />其它 </label></td>
          </tr>
          <tr>
          <td style="background: #efefef;"><span style="color: #409eff; font-weight: bold;">甲方</span></td>
          <td colspan="3">湖南北斗微芯产业发展有限公司</td>
          </tr>
          <tr>
          <td style="background: #efefef;"><span style="color: #409eff; font-weight: bold;">乙方</span></td>
          <td colspan="3">&nbsp;</td>
          </tr>
          <tr>
          <td style="background: #efefef;"><span style="color: #409eff; font-weight: bold;">合同名称</span></td>
          <td colspan="3">&nbsp;</td>
          </tr>
          <tr>
          <td style="background: #efefef;"><span style="color: #409eff; font-weight: bold;">合同标的</span></td>
          <td colspan="3">&nbsp;</td>
          </tr>
          <tr>
          <td style="background: #efefef;"><span style="color: #409eff; font-weight: bold;">合同金额</span></td>
          <td colspan="3">￥ <span style="text-decoration: underline;">15048.00</span>&nbsp;（ 大写： <span style="text-decoration: underline;">一万伍仟零肆拾捌元整</span> ）</td>
          </tr>
          <tr>
          <td style="background: #efefef;"><span style="color: #409eff; font-weight: bold;">支付方式</span></td>
          <td colspan="3">银行转账，款到发货。</td>
          </tr>
          <tr>
          <td style="background: #efefef;"><span style="color: #409eff; font-weight: bold;">合同生效时间</span></td>
          <td colspan="3">${date.getFullYear()}年${date.getMonth() + 1}月日（双方签字盖章后即刻生效）</td>
          </tr>
          <tr>
          <td style="background: #efefef;"><span style="color: #409eff; font-weight: bold;">合同终止时间</span></td>
          <td colspan="3">${date.getFullYear()}年月日</td>
          </tr>
          </tbody>
          </table>`
      this.workModel = {content: content}
      try {
        this.$refs.content.setContent(content)
      } catch (e) {
      }
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
.content
  padding 20px
  background white
</style>
