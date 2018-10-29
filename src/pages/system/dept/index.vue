<template>
  <div class="app-container back">
    <div class="operate-wrapper">
      <el-button type="success" size="mini" @click="addDept()">添加</el-button>
    </div>
    <tree-table :data="deptTree" :columns="columns" expandAll border stripe>
      <el-table-column align="center" prop="leaderName" label="负责人"></el-table-column>
      <el-table-column align="center" prop="helperName" label="协助人"></el-table-column>
      <el-table-column align="center" prop="seq" label="排序号"></el-table-column>
      <el-table-column align="center" prop="remark" label="备注"></el-table-column>
      <el-table-column
        align="center"
        label="更新时间"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.operateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新人员" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag type="warning">{{scope.row.operateName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="260">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editDept(scope.row)">编辑</el-button>
          <el-button type="success" size="mini" @click="addDept(scope.row)">添加</el-button>
          <el-button type="danger" size="mini" @click="deleteDept(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </tree-table>
    <el-dialog
      top="0"
      width="500px"
      :title="deptFormTitle"
      :visible.sync="deptVisible"
      @close="closeDeptForm">
      <el-form :model="deptModel" :rules="deptRules" label-width="80px" ref="deptForm" style="margin: 0 60px">
        <el-form-item label="上级部门">
          <el-input :value="deptModel.parent.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="deptModel.name"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="leaderId">
          <el-select v-model="deptModel.leaderId" placeholder="请选择">
            <el-option
              v-for="item in userList"
              :disabled="item.id === deptModel.helperId"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="协助人">
          <el-select v-model="deptModel.helperId" placeholder="请选择">
            <el-option>
            </el-option>
            <el-option
              v-for="item in userList"
              :disabled="item.id === deptModel.leaderId"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序号" prop="seq">
          <el-input v-model="deptModel.seq"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input maxlength="150" v-model="deptModel.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deptVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveDeptModel">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      top="0"
      width="500px"
      title="操作提示"
      :visible.sync="deleteVisible">
      <div>确定要删除 <span class="strong-font danger">{{deptModel.name}}</span> 这个部门吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteDeptModel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import treeTable from '@/components/tree-table'
import { getDeptTree, getDeptMine, insertDept, updateDept, deleteDept, getUserListRole } from '@/api/system'

export default {
  name: 'keep_dept',
  data() {
    const validateName = (rule, value, callback) => {
      if (!value || value.length < 2 || value.length > 15) {
        callback(new Error('部门名称长度在2~15位之间'))
      } else {
        callback()
      }
    }
    return {
      columns: [
        {
          text: '部门名称',
          value: 'name',
          width: 240
        }
      ],
      deptTree: [],
      deptMine: {},
      userList: [],
      deptFormTitle: '',
      deptVisible: false,
      deptModel: {
        parent: {
          id: 0,
          name: ''
        }
      },
      deptRules: {
        name: [{required: true, trigger: 'blur', validator: validateName}],
        seq: [{required: true, message: '排序号为必填项', trigger: 'blur'}]
      },
      deleteVisible: false
    }
  },
  mounted() {
    this._getDeptTree()
    this._getDeptMine()
    this._getUserRole()
  },
  methods: {
    editDept(dept) {
      this.deptModel = {
        leaderId: '',
        helperId: '',
        parent: {
          id: this.deptMine.id,
          name: this.deptMine.name
        }
      }
      Object.assign(this.deptModel, dept)
      this.deptFormTitle = '编辑部门信息'
      this.deptVisible = true
    },
    addDept(dept) {
      this.deptModel = {
        leaderId: '',
        helperId: '',
        parent: {
          id: this.deptMine.id,
          name: this.deptMine.name
        }
      }
      if (dept) {
        Object.assign(this.deptModel.parent, dept)
      }
      this.deptModel.seq = 1
      this.deptFormTitle = '添加部门信息'
      this.deptVisible = true
    },
    deleteDept(dept) {
      Object.assign(this.deptModel, dept)
      this.deleteVisible = true
    },
    saveDeptModel() {
      this.$refs.deptForm.validate(valid => {
        if (valid) {
          if (this.deptModel.id) {
            updateDept(this.deptModel).then(() => {
              this.deptVisible = false
              this._getDeptTree()
            })
          } else {
            insertDept(this.deptModel).then(() => {
              this.deptVisible = false
              this._getDeptTree()
            })
          }
        }
      })
    },
    deleteDeptModel() {
      deleteDept(this.deptModel.id).then(() => {
        this.deleteVisible = false
        this._getDeptTree()
      })
    },
    closeDeptForm() {
      this.$refs.deptForm.clearValidate()
    },
    _getDeptTree() {
      getDeptTree().then(res => {
        this.deptTree = res.data
      })
    },
    _getDeptMine() {
      getDeptMine().then(res => {
        this.deptMine = res.data
      })
    },
    _getUserRole() {
      getUserListRole('leader').then(res => {
        this.userList = res.data
      })
    }
  },
  components: {
    treeTable
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.el-select
  display block
</style>
