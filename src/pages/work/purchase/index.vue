<template>
  <div class="app-container none">
    <div class="form-wrapper">
      <el-form :model="workModel" :rules="workRules" label-position="left" ref="workForm">
        <el-form-item>
          <div class="header">
            <div class="title">
              <p class="title zh">采购申请</p>
              <p class="title en">Purchase application</p>
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
        <el-form-item>
          <el-radio-group v-model="workModel.exist">
            <el-radio-button :label="1">已有合同且非第一次采购</el-radio-button>
            <el-radio-button :label="0">其它</el-radio-button>
          </el-radio-group>
        </el-form-item>
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
import { startEasy, solveEasy, selectEasy } from '@/api/work'

export default {
  name: 'keep_purchase',
  mixins: [flowFormMixin],
  data() {
    return {
      workRules: {},
      loading: false
    }
  },
  methods: {
    changeTable(list) {
      this.workModel.materielList = list
    },
    /** 发起人处理结果 */
    startProcess(param) {
      this.loading = true
      param.exist = this.workModel.exist
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
        `<p style="text-align: center; font-size: 26px;"><strong>采购申请单</strong></p>
        <p style="text-align: right; margin: 0;">编号：ZH ( 2018 ) -0</p>
        <table style="width: 100%; border-collapse: collapse;" border="1" cellpadding="10">
        <tbody>
        <tr>
        <td style="width: 12.5%;" colspan="2">申请部门</td>
        <td style="width: 12.5%;" colspan="2">${this.mine.deptName}</td>
        <td style="width: 12.5%;" colspan="2">申请人</td>
        <td style="width: 12.5%;" colspan="2">${this.mine.name}</td>
        </tr>
        <tr>
        <td style="width: 12.5%;" colspan="2">申请日期</td>
        <td style="width: 12.5%;" colspan="2">${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日</td>
        <td style="width: 12.5%;" colspan="2">预计到货时间</td>
        <td style="width: 12.5%;" colspan="2">${date.getFullYear()}年${date.getMonth() + 1}月日</td>
        </tr>
        <tr>
        <td style="width: 12.5%;" colspan="2">项目代码</td>
        <td style="width: 12.5%;" colspan="2"></td>
        <td style="width: 12.5%;" colspan="2">项目名称</td>
        <td style="width: 12.5%;" colspan="2"></td>
        </tr>
        <tr>
        <td style="width: 12.5%;" colspan="2">申请事由</td>
        <td style="width: 12.5%;" colspan="6"></td>
        </tr>
        <tr>
        <td style="width: 12.5%;">序号</td>
        <td style="width: 12.5%;">物料编码</td>
        <td style="width: 12.5%;">物品名称</td>
        <td style="width: 12.5%;">品牌/规格及型号</td>
        <td style="width: 12.5%;">采购数量</td>
        <td style="width: 12.5%;">单位</td>
        <td style="width: 12.5%;">预计单价</td>
        <td style="width: 12.5%;">备注</td>
        </tr>
        <tr>
        <td style="width: 12.5%;">1</td>
        <td style="width: 12.5%;">/</td>
        <td style="width: 12.5%;"></td>
        <td style="width: 12.5%;"></td>
        <td style="width: 12.5%;"></td>
        <td style="width: 12.5%;"></td>
        <td style="width: 12.5%;"></td>
        <td style="width: 12.5%;">&nbsp;</td>
        </tr>
        <tr>
        <td style="width: 12.5%;">2</td>
        <td style="width: 12.5%;">/</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        </tr>
        <tr>
        <td style="width: 12.5%;">3</td>
        <td style="width: 12.5%;">/</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        </tr>
        <tr>
        <td style="width: 12.5%;">4</td>
        <td style="width: 12.5%;">/</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        </tr>
        <tr>
        <td style="width: 12.5%;">5</td>
        <td style="width: 12.5%;">/</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        </tr>
        <tr>
        <td style="width: 12.5%;">6</td>
        <td style="width: 12.5%;">/</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        </tr>
        <tr>
        <td style="width: 12.5%;">7</td>
        <td style="width: 12.5%;">/</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        </tr>
        <tr>
        <td style="width: 12.5%;">8</td>
        <td style="width: 12.5%;">/</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        <td style="width: 12.5%;">&nbsp;</td>
        </tr>
        </tbody>
        </table>`
      this.workModel = {exist: 1, content: content}
    },
    /** 查询申请表单数据 */
    _selectWorkModel() {
      selectEasy(this.task.procInstId).then(res => {
        this.workModel = JSON.parse(res.data.content)
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
