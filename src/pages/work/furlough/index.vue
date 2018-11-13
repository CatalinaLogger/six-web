<template>
  <div class="app-container back none">
    <div class="form-wrapper">
      <el-form :model="workModel" :rules="workRules" label-position="left" ref="workForm">
        <el-form-item>
          <div class="header">
            <div class="title">
              <p class="title zh">调休申请</p>
              <p class="title en">Furlough application</p>
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
        <div class="short-form">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="标题" label-width="80px">
                <el-input v-model="workModel.title" max="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="紧急程度" label-width="80px">
                <el-radio-group v-model="workModel.level">
                  <el-radio v-for="level in levelList" :key="level.code" :label="level.value">{{level.name}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="流程说明" label-width="80px">
            <div class="explain">
              员工因临时或突发情况无法到岗，未能提前请病假或事假的，则应用电话通知直接上级批准后，短信通知人事行政部，说明请假事由，并在上班后第一时间补办请假手续，如在2个工作日内未提交请假流程，超过2个工作日补流程无效，均视为旷工，扣除当日双倍工资。
              <br/>1、年假：工作满一年以上每年可享受带薪年假，当年的年假使用期至次年3月1日止；未经用人单位批准，员工不得自行休假。
              <br/>2、事假：按照平均工作日扣发薪资（包含工资及各类补贴福利）；单次事假原则上不应超过3天，当年累计事假超过15天的视为主动放弃继续履行岗位职责的权利，特殊情况除外。
              <br/>3、病假：两天及以上病假必须持工作地二级甲等以上医院相关病假证明单或就医记录证明，否则无法享受病假工资；单次病假超过5天，应当持有工作所在地三级甲等医院提供的病假证明单。原则上当年累计病假超过15天应视为不具备继续履行岗位职责身体条件，特殊情况除外。
              <br/>4、婚假：婚假为十天，包含休息日，请婚假必须持结婚证明，结婚证必须在泛微工作期间领取，且婚假必须在一年内使用完毕，不得分次休假，国家或地方政府有其他规定的按照当地要求执行；
              <br/>5、产假及哺乳假：按国家及地方法律法规执行，包含休息日与法定节假日；
              <br/>6、陪产假：泛微正式男性员工在工作期间配偶生育的，可凭子女出生证明，享受十个自然日陪产假。
              <br/>7、丧假：直系亲属：配偶、子女、父母可享受三天，岳父母、祖父母、外祖父母可享受一天
            </div>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="申请人" label-width="80px">
                <el-input v-model="workModel.userName" max="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请部门" label-width="80px">
                <el-input v-model="workModel.deptName" max="20"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="工作内容" label-width="80px">
            <el-input type="textarea" v-model="workModel.userName" max="20"></el-input>
          </el-form-item>
          <el-row :gutter="20" v-for="(item, index) in workModel.work" :key="index">
            <el-col :span="14">
              <el-form-item label="工作时间" label-width="80px">
                <el-date-picker
                  v-model="item.date"
                  :change="changeDate(item)"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="时长（含休息时间）" label-width="140px">
                <el-input v-model="item.hours" max="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" icon="el-icon-plus" @click="appendWork" v-if="index + 1 === workModel.work.length"></el-button>
              <el-button type="primary" icon="el-icon-minus" @click="deleteWork(index)" v-else></el-button>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-for="(item, index) in workModel.leave" :key="index">
            <el-col :span="14">
              <el-form-item label="调休时间" label-width="80px">
                <el-date-picker
                  v-model="item.date"
                  :change="changeDate(item)"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="调休时长" label-width="140px">
                <el-input v-model="item.hours" max="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" icon="el-icon-plus" @click="appendLeave" v-if="index + 1 === workModel.leave.length"></el-button>
              <el-button type="primary" icon="el-icon-minus" @click="deleteLeave(index)" v-else></el-button>
            </el-col>
          </el-row>
        </div>
        <approve-panel :formKey="formKey" :processId="task.procInstId" @handel="solveProcess"></approve-panel>
      </el-form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { flowFormMixin } from '@/common/utils/mixin'

export default {
  name: 'keep_furlough',
  mixins: [flowFormMixin],
  data() {
    return {
      workRules: {
      },
      loading: false
    }
  },
  methods: {
    changeDate(work) {
      if (work.date[0] && work.date[1]) {
        let time = work.date[1].getTime() - work.date[0].getTime()
        let hours = time / 1000 / 60 / 60
        work.hours = hours
      }
      return ''
    },
    appendWork() {
      this.workModel.work.push({date: '', hours: ''})
    },
    deleteWork(index) {
      this.workModel.work.splice(index, 1)
    },
    appendLeave() {
      this.workModel.leave.push({date: '', hours: ''})
    },
    deleteLeave(index) {
      this.workModel.leave.splice(index, 1)
    },
    /** 发起人处理结果 */
    startProcess(param) {
      this.loading = true
    },
    /** 审核人处理结果 */
    solveProcess(param) {
      this.loading = true
      param.taskId = this.task.id
    },
    /** 创建申请表单数据 */
    _createWorkModel() {
      this.workModel = {
        title: `调休申请 -- ${this.mine.name}`,
        level: 0,
        userName: this.mine.name,
        deptName: this.mine.deptName,
        work: [{date: '', hours: ''}],
        leave: [{date: '', hours: ''}]}
    },
    /** 查询申请表单数据 */
    _selectWorkModel() {
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
