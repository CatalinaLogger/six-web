<template>
  <div class="app-container fixed back">
      <div class="card-item guide app-box">
        <div class="card-title">
          <span class="title-text">字典类别</span>
          <el-button class="add-button" type="success" size="mini" @click="addConf()">添加类别</el-button>
        </div>
        <scroll-bar class="conf-option-wrapper" :delta="15">
          <div class="conf-option" v-for="(item, index) in confData" :class="highlightRole(item)" :key="index" @click="selectConf(item)">
            <span class="conf-name">
              {{item.name}}
              <span class="code">{{item.code}}</span>
            </span>
            <el-button-group>
              <el-button type="warning" icon="el-icon-edit" size="mini" @click.stop="editConf(item)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click.stop="deleteConf(item)"></el-button>
            </el-button-group>
          </div>
        </scroll-bar>
      </div>
      <div class="card-item center app-box">
        <div class="card-title">
          <span class="title-text">字典数据</span>
          <el-button class="add-button" type="success" size="mini" @click="addConfData()" :disabled="!confCurrent.id">添加</el-button>
        </div>
        <scroll-bar class="inside-table-wrapper">
          <tree-table :data="confDataTree" :columns="confDataColumns" stripe>
            <el-table-column align="center" prop="value" label="数值"></el-table-column>
            <el-table-column align="center" prop="seq" label="序号"></el-table-column>
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
            <el-table-column align="center" label="操作" width="240">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editConfData(scope.row)">编辑</el-button>
                <el-button type="success" size="mini" :disabled="scope.row.type === 2" @click="addConfData(scope.row)">添加</el-button>
                <el-button type="danger" size="mini" @click="deleteConfData(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </tree-table>
        </scroll-bar>
      </div>
    <el-dialog
      top="0"
      width="500px"
      :title="confFormTitle"
      :visible.sync="confVisible"
      @close="closeConfForm"
      append-to-body>
      <el-form :model="confModel" :rules="confRules" label-width="80px" ref="confForm" style="margin: 0 60px">
        <el-form-item label="编码" prop="code">
          <el-input v-model="confModel.code" max="20"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="confModel.name" max="20"></el-input>
        </el-form-item>
        <el-form-item label="序号" prop="seq">
          <el-input v-model="confModel.seq"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="confVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveConfModel">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      top="0"
      width="500px"
      title="操作提示"
      :visible.sync="deleteVisible">
      <div>确定要删除 <span class="strong-font danger">{{confModel.name}}</span> 这个字典类别吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteModel">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      top="0"
      width="500px"
      :title="confDataFormTitle"
      :visible.sync="confDataVisible"
      @close="closeConfDataForm"
      append-to-body>
      <el-form :model="confDataModel" :rules="confDataRules" label-width="80px" ref="confDataForm" style="margin: 0 60px">
        <el-form-item label="上级">
          <el-input :value="confDataModel.parent.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="confDataModel.code" max="20"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="confDataModel.name" max="20"></el-input>
        </el-form-item>
        <el-form-item label="数值">
          <el-input v-model="confDataModel.value"></el-input>
        </el-form-item>
        <el-form-item label="序号" prop="seq">
          <el-input v-model="confDataModel.seq"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="confDataVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveConfDataModel">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      top="0"
      width="500px"
      title="操作提示"
      :visible.sync="deleteDataVisible">
      <div>确定要删除 <span class="strong-font danger">{{confDataModel.name}}</span> 这条字典数据吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDataVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteDataModel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import ScrollBar from '@/components/scroll-bar'
import TreeTable from '@/components/tree-table'
import { getConfList, insertConf, updateConf, deleteConf, getConfDataTree, insertConfData, updateConfData, deleteConfData } from '@/api/global'

export default {
  name: 'keep_conf',
  data() {
    return {
      confData: [],
      confCurrent: {},
      confVisible: false,
      confFormTitle: '',
      confModel: {},
      confRules: {
        code: [{required: true, trigger: 'blur', message: '编码为必填项'}],
        name: [{required: true, trigger: 'blur', message: '名称为必填项'}],
        seq: [{required: true, trigger: 'blur', message: '序号为必填项'}]
      },
      deleteVisible: false,
      confDataTree: [],
      confDataColumns: [
        {
          text: '名称',
          value: 'name'
        },
        {
          text: '编码',
          value: 'code'
        }
      ],
      confDataVisible: false,
      confDataFormTitle: '',
      confDataModel: {
        parent: {
          id: 0,
          name: '顶层数据'
        }
      },
      confDataRules: {
        code: [{required: true, trigger: 'blur', message: '编码为必填项'}],
        name: [{required: true, trigger: 'blur', message: '名称为必填项'}],
        seq: [{required: true, trigger: 'blur', message: '序号为必填项'}]
      },
      deleteDataVisible: false
    }
  },
  mounted() {
    this._getConfList()
  },
  methods: {
    addConf() {
      this.confFormTitle = '添加字典类别'
      this.confModel = {
        seq: 1
      }
      this.confVisible = true
    },
    editConf(conf) {
      this.confFormTitle = '编辑字典类别'
      Object.assign(this.confModel, conf)
      this.confVisible = true
    },
    deleteConf(conf) {
      Object.assign(this.confModel, conf)
      this.deleteVisible = true
    },
    saveConfModel() {
      this.$refs.confForm.validate(valid => {
        if (valid) {
          if (this.confModel.id) {
            updateConf(this.confModel).then(() => {
              this.confVisible = false
              this._getConfList()
            })
          } else {
            insertConf(this.confModel).then(() => {
              this.confVisible = false
              this._getConfList()
            })
          }
        }
      })
    },
    deleteModel() {
      deleteConf(this.confModel.id).then(res => {
        this.deleteVisible = false
        this._getConfList()
        this._getConfDataTree()
      })
    },
    selectConf(item) {
      this.confCurrent = item
      this._getConfDataTree()
    },
    highlightRole(row) {
      if (this.confCurrent.id === row.id) {
        return 'current-row'
      }
      return ''
    },
    closeConfForm() {
      this.$refs.confForm.clearValidate()
    },
    addConfData(data) {
      this.confDataModel = {
        confId: this.confCurrent.id,
        parent: {
          id: 0,
          name: '顶层数据'
        }
      }
      if (data) {
        Object.assign(this.confDataModel.parent, data)
      }
      this.confDataModel.seq = 1
      this.confDataFormTitle = '添加字典数据'
      this.confDataVisible = true
    },
    editConfData(data) {
      this.confDataModel = {
        parent: {
          id: 0,
          name: '顶层数据'
        }
      }
      Object.assign(this.confDataModel, data)
      this.confDataFormTitle = '编辑字典数据'
      this.confDataVisible = true
    },
    deleteConfData(data) {
      Object.assign(this.confDataModel, data)
      this.deleteDataVisible = true
    },
    saveConfDataModel() {
      this.$refs.confDataForm.validate(valid => {
        if (valid) {
          if (this.confDataModel.id) {
            updateConfData(this.confDataModel).then(() => {
              this.confDataVisible = false
              this._getConfDataTree()
            })
          } else {
            insertConfData(this.confDataModel).then(() => {
              this.confDataVisible = false
              this._getConfDataTree()
            })
          }
        }
      })
    },
    deleteDataModel() {
      deleteConfData(this.confDataModel.id).then(res => {
        this.deleteDataVisible = false
        this._getConfDataTree()
      })
    },
    closeConfDataForm() {
      this.$refs.confDataForm.clearValidate()
    },
    _getConfList() {
      getConfList().then(res => {
        this.confData = res.data
      })
    },
    _getConfDataTree() {
      getConfDataTree(this.confCurrent.code).then(res => {
        this.confDataTree = res.data
      })
    }
  },
  components: {
    ScrollBar,
    TreeTable
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.el-table__row.current-row
  background: #409eff
.el-table--border, .el-table--group
  border none
.app-container
  display flex
  .card-item
    background white
    transition .2s
    overflow hidden
    &.guide
      width 280px
    &.center
      flex-grow: 1
      margin-left 20px
    .card-title
      padding 10px
      border-bottom 1px solid #ebebeb
      .title-text
        line-height 28px
      .add-button
        float right
    .conf-option-wrapper
      height calc(100vh - 165px)
      background white
      overflow hidden
      .conf-option
        padding 8px 11px
        border-bottom 1px solid #ebebeb
        &.current-row
          font-weight bold
          color white
          background #409eff
          .conf-name
            .code
              color white
          &:hover
            background #409eff
        &:hover
          background #e2e2e2
        .conf-name
          font-size 14px
          line-height 28px
          .code
            color #909399
        .el-button-group
          float right
          .el-button--mini
            padding 7px 13px
</style>
