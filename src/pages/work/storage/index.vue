<template>
  <div class="app-container none back">
    <div class="form-wrapper">
      <el-form :model="workModel" :rules="workRules" label-position="left" ref="workForm">
        <el-form-item class="footer" v-if="formKey === 'a'">
          <el-button type="info" @click="closeClick">关闭申请</el-button>
          <el-button type="warning" @click="clearClick" v-if="draft">清除草稿</el-button>
          <el-button type="success" @click="saveClick(workModel)">保存草稿</el-button>
          <el-button type="danger" @click="cancelClick()">取消申请</el-button>
          <el-button type="primary" @click="startClick()">提交申请</el-button>
        </el-form-item>
        <el-form-item>
          <div class="header">
            <p class="title zh">采购申请</p>
            <p class="title en">Purchase application</p>
          </div>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标题" label-width="100px">
              <el-input v-model="workModel.title" max="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="紧急程度" label-width="100px">
              <el-radio-group v-model="workModel.level">
                <el-radio v-for="level in levelList" :key="level.code" :label="level.value">{{level.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="流程说明" label-width="100px">
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
          <el-col :span="8">
            <el-form-item label="申请人" label-width="100px">
              <el-input v-model="workModel.userName" max="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请部门" label-width="100px">
              <el-input v-model="workModel.deptName" max="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期" label-width="100px">
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="workModel.applyDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="项目代码" label-width="100px">
              <el-input v-model="workModel.projectCode" max="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称" label-width="100px">
              <el-input v-model="workModel.projectName" max="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预计到货日期" label-width="100px">
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="workModel.arriveDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="申请事由" label-width="100px">
          <el-input v-model="workModel.applyDesc" type="textarea" max="20"></el-input>
        </el-form-item>
        <el-form-item>
          <edit-table v-if="workModel.materielList"
                      :data="workModel.materielList"
                      show-summary
                      :summary-method="getSummaries"
                      @change="changeTable">
            <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
            <el-table-column align="center" label="物料编码">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.code"></el-input>
                </template>
                <span v-else>{{ scope.row.code }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="物品名称" min-width="100">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" type="textarea" size="small" v-model="scope.row.name"></el-input>
                </template>
                <span v-else>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="品牌/规格及型号" min-width="200">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" type="textarea" size="small" v-model="scope.row.require"></el-input>
                </template>
                <span v-else>{{ scope.row.require }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="采购数量">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.total"></el-input>
                </template>
                <span v-else>{{ scope.row.total }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="单位">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.unit"></el-input>
                </template>
                <span v-else>{{ scope.row.unit }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="参考单价">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" size="small" v-model="scope.row.price"></el-input>
                </template>
                <span v-else>{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="备注">
              <template slot-scope="scope">
                <template v-if="scope.row.edit">
                  <el-input class="edit-input" type="textarea" size="small" v-model="scope.row.remark"></el-input>
                </template>
                <span v-else>{{ scope.row.remark }}</span>
              </template>
            </el-table-column>
          </edit-table>
        </el-form-item>
      </el-form>
    </div>
    <approve-panel :formKey="formKey" :processId="task.procInstId" @handel="solveProcess"></approve-panel>
  </div>
</template>

<script type="text/ecmascript-6">
import EditTable from '@/components/edit-table'
import { flowFormMixin } from '@/common/utils/mixin'

export default {
  name: 'keep_purchase',
  mixins: [flowFormMixin],
  data() {
    return {
      workRules: {},
      getSummaries: function (param) {
        const { data } = param
        const sums = []
        let amount = 0
        data.forEach(item => {
          if (!isNaN(item.total * item.price)) {
            amount += item.total * item.price
          }
        })
        sums[6] = '预计金额'
        sums[7] = amount.toFixed(2)
        return sums
      }
    }
  },
  methods: {
    changeTable(list) {
      this.workModel.materielList = list
    },
    /** 发起人处理结果 */
    startProcess({defineId, taskId, taskCode}) {
    },
    /** 审核人处理结果 */
    solveProcess(param) {
    },
    /** 创建申请表单数据 */
    _createWorkModel() {
      this.workModel = {title: `采购申请--${this.mine.name}`, level: 0, userName: this.mine.name, deptName: this.mine.deptName, materielList: []}
    },
    /** 查询申请表单数据 */
    _selectWorkModel() {
    }
  },
  components: {
    EditTable
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
