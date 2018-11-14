<template>
  <div class="app-container back">
    <div class="operate-wrapper">
      <el-button type="success" size="mini" @click="addDept()">添加</el-button>
    </div>
    <tree-table :data="deptTree" :columns="columns" expandAll border stripe>
      <el-table-column align="center" label="主管" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag type="primary" v-for="(item, index) in scope.row.lead" :key="index" >{{item.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="seq" label="排序号"></el-table-column>
      <el-table-column align="center" prop="remark" label="备注"></el-table-column>
      <el-table-column align="center" label="更新时间" show-overflow-tooltip>
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
        <el-form-item label="设置主管" v-if="deptFormUpdate">
          <el-button plain style="width: 100%; overflow: hidden" @click="showUserList">
            <div v-if="deptModel.leadKeys.length > 0">
              <span class="lead-block" v-for="(item, index) in deptModel.leadNames" :key="index" >{{item}}</span>
            </div>
            <span class="lead-empty" v-else>请选择主管</span>
          </el-button>
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
      title="选择人员"
      top="0"
      width="536px"
      :visible.sync="leadVisible"
      append-to-body>
      <el-transfer
        filterable
        filter-placeholder="请输入姓名"
        :titles="titles"
        :data="userList"
        v-model="leadList"
        :filter-method="filterUser">
      </el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="leadVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveLeadList">确 定</el-button>
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
import { getDeptTree, insertDept, updateDept, deleteDept, getUserPage } from '@/api/system'

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
      deptRoot: {},
      deptTree: [],
      deptFormTitle: '',
      deptFormUpdate: false,
      deptVisible: false,
      deptModel: {
        parent: {
          id: 0,
          name: ''
        },
        leadKeys: [],
        leadNames: []
      },
      deptRules: {
        name: [{required: true, trigger: 'blur', validator: validateName}],
        seq: [{required: true, message: '排序号为必填项', trigger: 'blur'}]
      },
      leadVisible: false,
      titles: ['选择', '已选'],
      userList: [],
      leadList: [],
      filterUser(query, item) {
        return item.label.indexOf(query) > -1
      },
      deleteVisible: false
    }
  },
  mounted() {
    this._getDeptTree()
  },
  methods: {
    editDept(dept) {
      this.deptFormUpdate = true
      this.userList = []
      this.leadList = []
      this.deptModel = {
        parent: {
          id: this.deptRoot.id,
          name: this.deptRoot.name
        },
        leadKeys: [],
        leadNames: []
      }
      getUserPage(dept.id, null, 1, 1000).then(res => {
        if (res.data.data) {
          res.data.data.forEach(user => {
            this.userList.push({
              label: user.name,
              key: user.id
            })
          })
        }
      })
      if (dept.lead) {
        this.deptModel.leadKeys = dept.lead.map(item => {
          return item.id
        })
        this.deptModel.leadNames = dept.lead.map(item => {
          return item.name
        })
        this.leadList = this.deptModel.leadKeys
      }
      Object.assign(this.deptModel, dept)
      this.deptFormTitle = '编辑部门信息'
      this.deptVisible = true
    },
    addDept(dept) {
      this.deptFormUpdate = false
      this.deptModel = {
        parent: {
          id: this.deptRoot.id,
          name: this.deptRoot.name
        },
        leadKeys: [],
        leadNames: []
      }
      if (dept) {
        Object.assign(this.deptModel.parent, dept)
      }
      this.deptModel.seq = 1
      this.deptFormTitle = '添加部门信息'
      this.deptVisible = true
    },
    showUserList() {
      this.leadVisible = true
    },
    saveLeadList() {
      let leadList = this.userList.filter(user => {
        let bool = false
        this.leadList.forEach(key => {
          if (key === user.key) {
            bool = true
          }
        })
        return bool
      })
      this.deptModel.leadKeys = leadList.map(item => {
        return item.key
      })
      this.deptModel.leadNames = leadList.map(item => {
        return item.label
      })
      this.leadVisible = false
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
        this.deptRoot = {id: res.data[0].id, name: res.data[0].name}
        this.deptTree = res.data[0].children
      })
    }
  },
  components: {
    treeTable
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.el-tag
  margin 0 2px
.lead-block
  padding 5px
  margin-right 5px
  background #eee
.lead-empty
  color #ccc
</style>
