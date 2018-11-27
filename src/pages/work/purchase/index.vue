<template>
  <div class="app-container back none">
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
            <div class="operate" v-if="readOnly || formKey > 'a'">
              <el-button type="primary" @click="editCarbon" v-if="!readOnly && edit">新建副本</el-button>
              <el-button type="primary" @click="edit = true" v-if="!edit">查看副本</el-button>
              <el-button type="warning" @click="edit = false" v-else>查看原件</el-button>
              <el-button type="success" @click="saveCarbon" v-if="!readOnly && edit">保存更改</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item v-if="!readOnly && formKey === 'a'">
          <el-radio-group v-model="workModel.exist">
            <el-radio-button :label="1">已有合同且非第一次采购</el-radio-button>
            <el-radio-button :label="0">其它</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="!readOnly && formKey === 'a'">
          <tinymce v-model="workModel.content" :height=800 ref="content"/>
        </el-form-item>
        <el-form-item v-else-if="edit">
          <tinymce v-model="carbon.content" :height=800 ref="carbon"/>
        </el-form-item>
        <div class="content" v-html="workModel.content" v-else></div>
        <approve-panel :readOnly="readOnly" :processId="task.procInstId" @handel="showDialog">
          <el-row class="handel-button" type="flex" justify="center" v-if="!readOnly && formKey === 'b'">
            <el-col :span="24">
              <el-button type="info" icon="el-icon-info" @click="closeClick">暂不处理</el-button>
              <el-button type="success" icon="el-icon-success" @click="showDialog({taskCode: 100, taskName: '完成采购', message: '请确认物品是否已经采购完毕，点击确定后将不可修改！'})">完成采购</el-button>
            </el-col>
          </el-row>
          <el-row class="handel-button" type="flex" justify="center" v-if="!readOnly && formKey === 'c'">
            <el-col :span="24">
              <el-button type="info" icon="el-icon-info" @click="closeClick">暂不处理</el-button>
              <el-button type="danger" icon="el-icon-error" @click="showDialog({taskCode: -32, taskName: '存在次品', message: '请确认在副本是否保存了次品信息，点击确定后将不可修改！'})">存在次品</el-button>
              <el-button type="success" icon="el-icon-success" @click="showDialog({taskCode: 32, taskName: '全部合格', message: '请确认是否所有物品检验合格，点击确定后将不可修改！'})">全部合格</el-button>
            </el-col>
          </el-row>
          <el-row class="handel-button" type="flex" justify="center" v-if="!readOnly && formKey === 'd'">
            <el-col :span="24">
              <el-button type="info" icon="el-icon-info"  @click="closeClick">暂不处理</el-button>
              <el-button type="danger" icon="el-icon-error" @click="showDialog({taskCode: -33, taskName: '完成退货', message: '请确认是否将所有物品进行退货，点击确定后将不可修改！'})">完成退货</el-button>
              <el-button type="success" icon="el-icon-success" @click="showDialog({taskCode: 33, taskName: '完成退换', message: '请确认是否在副本中保存了退换信息，点击确定后将不可修改！'})">完成退换</el-button>
            </el-col>
          </el-row>
          <el-row class="handel-button" type="flex" justify="center" v-if="!readOnly && formKey === 'e'">
            <el-col :span="24">
              <el-button type="info" icon="el-icon-info" @click="closeClick">暂不处理</el-button>
              <el-button type="success" icon="el-icon-success" @click="showDialog({taskCode: 31, taskName: '完成入库', message: '请确认物品已完成入库，点击确定后将不可修改！'})">完成入库</el-button>
            </el-col>
          </el-row>
          <el-row class="handel-button" type="flex" justify="center" v-if="!readOnly && formKey === 'f'">
            <el-col :span="24">
              <el-button type="info" icon="el-icon-info" @click="closeClick">暂不处理</el-button>
              <el-button type="danger" icon="el-icon-error" @click="showDialog({taskCode: -30, taskName: '无需领用', message: '请确认不领用任何物品，点击确定后将不可修改！'})">无需领用</el-button>
              <el-button type="success" icon="el-icon-success" @click="showDialog({taskCode: 30, taskName: '申请领用', message: '请确认申请领用物品，点击确定后将不可修改！'})">申请领用</el-button>
            </el-col>
          </el-row>
          <el-row class="handel-button" type="flex" justify="center" v-if="!readOnly && formKey === 'g'">
            <el-col :span="24">
              <el-button type="info" icon="el-icon-info" @click="closeClick">暂不处理</el-button>
              <el-button type="success" icon="el-icon-success" @click="showDialog({taskCode: -31, taskName: '完成出库', message: '请确认物品已完成出库，点击确定后将不可修改！'})">完成出库</el-button>
            </el-col>
          </el-row>
          <el-row class="handel-button" type="flex" justify="center" v-if="!readOnly && formKey === 'h'">
            <el-col :span="24">
              <el-button type="info" icon="el-icon-info" @click="closeClick">暂不处理</el-button>
              <el-button type="success" icon="el-icon-success" @click="showDialog({taskCode: -31, taskName: '完成编码', message: '请确认物品已完成编码，点击确定后将不可修改！'})">完成编码</el-button>
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
import { startEasy, solveEasy, selectEasy, updateEasy } from '@/api/work'

export default {
  name: 'keep_purchase',
  mixins: [flowFormMixin],
  data() {
    return {
      workRules: {},
      loading: false,
      processId: '',
      carbon: {},
      edit: false,
      visible: false,
      message: '',
      param: {}
    }
  },
  activated() {
    this.edit = false
  },
  methods: {
    editCarbon() {
      this.$refs.carbon.setContent(this.workModel.content)
    },
    saveCarbon() {
      updateEasy(this.processId, this.carbon)
    },
    showDialog(param) {
      this.param = param
      this.message = param.message
      this.visible = true
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
      let dept = this.mine.dept.map(item => {
        return item.name
      })
      let content =
        `<table style="width: 100%; border-collapse: collapse; border-style: hidden;">
        <tbody>
        <tr>
        <td style="width: 33.3333%; border-style: hidden;"><img class="wscnph" src="http://10.10.10.164/group1/M00/00/00/CgoKpFvzcFaAH2GrAAAVNGfIFTk950.png" /></td>
        <td style="width: 33.3333%; border-style: hidden; text-align: center; font-size: 30px;"><span style="color: #303133;"><strong>采购申请表</strong></span></td>
        <td style="width: 33.3333%; border-style: hidden;">&nbsp;</td>
        </tr>
        </tbody>
        </table>
        <table style="width: 100%; border-collapse: collapse;" border="1" cellpadding="10">
        <tbody>
        <tr>
        <td style="background: #efefef;" colspan="2"><span style="color: #409eff;font-weight: bold">申请部门</span></td>
        <td colspan="2">${dept}</td>
        <td style="background: #efefef;" colspan="2"><span style="color: #409eff;font-weight: bold">申请人</span></td>
        <td colspan="3">${this.mine.name}</td>
        </tr>
        <tr>
        <td style="background: #efefef;" colspan="2"><span style="color: #409eff;font-weight: bold">申请日期</span></td>
        <td colspan="2">${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日</td>
        <td style="background: #efefef;" colspan="2"><span style="color: #409eff;font-weight: bold">预计到日期</span></td>
        <td colspan="3">${date.getFullYear()}年${date.getMonth() + 1}月日</td>
        </tr>
        <tr>
        <td style="background: #efefef;" colspan="2"><span style="color: #409eff;font-weight: bold">项目代码</span></td>
        <td colspan="2">&nbsp;</td>
        <td style="background: #efefef;" colspan="2"><span style="color: #409eff;font-weight: bold">项目名称</span></td>
        <td colspan="3">&nbsp;</td>
        </tr>
        <tr>
        <td style="background: #efefef;" colspan="2"><span style="color: #409eff;font-weight: bold">申请事由</span></td>
        <td colspan="7">&nbsp;</td>
        </tr>
        <tr>
        <td style="width: 3%; background: #efefef;"><span style="color: #409eff;font-weight: bold">序号</span></td>
        <td style="width: 3%; background: #efefef;"><span style="color: #409eff;font-weight: bold">编码</span></td>
        <td style="width: 13%; background: #efefef;"><span style="color: #409eff;font-weight: bold">物品名称</span></td>
        <td style="width: 13%; background: #efefef;"><span style="color: #409eff;font-weight: bold">品牌/规格及型号</span></td>
        <td style="width: 4%; background: #efefef;"><span style="color: #409eff;font-weight: bold">采购数量</span></td>
        <td style="width: 4%; background: #efefef;"><span style="color: #409eff;font-weight: bold">单位</span></td>
        <td style="width: 4%; background: #efefef;"><span style="color: #409eff;font-weight: bold">预计单价</span></td>
        <td style="width: 4%; background: #efefef;"><span style="color: #409eff;font-weight: bold">总价</span></td>
        <td style="width: 13%; background: #efefef;"><span style="color: #409eff;font-weight: bold">备注</span></td>
        </tr>
        <tr>
        <td>1</td>
        <td>/</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        </tr>
        <tr>
        <td>2</td>
        <td>/</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        </tr>
        <tr>
        <td>3</td>
        <td>/</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        </tr>
        <tr>
        <td>4</td>
        <td>/</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        </tr>
        <tr>
        <td>5</td>
        <td>/</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        </tr>
        <tr>
        <td>6</td>
        <td>/</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        </tr>
        <tr>
        <td>7</td>
        <td>/</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        </tr>
        <tr>
        <td>8</td>
        <td>/</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        </tr>
        <tr>
        <td>9</td>
        <td>/</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        </tr>
        <tr>
        <td>10</td>
        <td>/</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        </tr>
        </tbody>
        </table>`
      this.workModel = {exist: 1, content: content}
      try {
        this.$refs.content.setContent(content)
      } catch (e) {
      }
    },
    /** 查询申请表单数据 */
    _selectWorkModel() {
      selectEasy(this.task.procInstId).then(res => {
        this.processId = res.data.procInstId
        this.workModel = JSON.parse(res.data.content)
        this.carbon = JSON.parse(res.data.carbon)
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
