<template>
  <div class="app-container back">
    <div class="operate-wrapper">
      <el-button type="success" size="mini" icon="el-icon-plus" @click="insertStore()">新增仓库</el-button>
    </div>
    <el-table :data="storeList" border stripe>
      <el-table-column align="center" prop="code" label="仓库编号" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="name" label="仓库名称" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="dutyName" label="负责人" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="dutyPhone" label="手机" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="dutyLink" label="联系电话" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="seq" label="排序号" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="statusStore({storeId: scope.row.id, status: 0})" v-if="scope.row.status">停用</el-button>
          <el-button type="info" size="mini" @click="statusStore({storeId: scope.row.id, status: 1})" v-else>启用</el-button>
          <el-button type="primary" size="mini" @click="updateStore(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteStore(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      top="0"
      width="600px"
      :title="storeFormTitle"
      :visible.sync="storeVisible"
      @close="closeStoreForm">
      <el-form :model="storeModel" :rules="storeRules" label-position="left" label-width="80px" ref="storeForm" style="margin: 0 20px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="仓库编号" prop="code">
              <el-input v-model="storeModel.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库名称" prop="name">
              <el-input v-model="storeModel.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="责任人" prop="dutyId">
              <el-select v-model="storeModel.dutyId" placeholder="请选择" @change="changeDuty">
                <el-option v-for="item in candidate" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机">
              <el-input v-model="storeModel.dutyPhone" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话">
              <el-input v-model="storeModel.dutyLink"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序号" prop="seq">
              <el-input v-model="storeModel.seq"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="仓库地址">
          <el-input v-model="storeModel.address"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input maxlength="150" v-model="storeModel.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="storeVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitStoreModel">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      top="0"
      width="500px"
      title="操作提示"
      :visible.sync="deleteVisible">
      <div>确定要删除 <span class="strong-font danger">{{storeModel.name}}</span> 这个仓库吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteStoreModel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { getUserListRole } from '@/api/system'
import { selectStore, insertStore, updateStore, updateStoreStatus, deleteStore } from '@/api/datum'

export default {
  data() {
    return {
      storeList: [],
      candidate: [], // 候选人
      storeModel: {},
      storeRules: {
        code: [{required: true, message: '仓库编号不能为空', trigger: 'blur'}],
        name: [{required: true, message: '仓库名称不能为空', trigger: 'blur'}],
        dutyId: [{required: true, message: '责任人不能为空', trigger: 'blur'}],
        seq: [{required: true, message: '排序号不能为空', trigger: 'blur'}]
      },
      storeFormTitle: '',
      storeVisible: false,
      deleteVisible: false
    }
  },
  mounted() {
    this._initData()
    this._getStoreList()
  },
  methods: {
    statusStore(param) {
      updateStoreStatus(param).then(() => {
        this._getStoreList()
      })
    },
    insertStore() {
      this.storeModel.seq = 1
      this.storeFormTitle = '新增仓库'
      this.storeVisible = true
    },
    updateStore(store) {
      this.storeModel = store
      this.storeFormTitle = '编辑仓库'
      this.storeVisible = true
    },
    deleteStore(store) {
      this.storeModel = store
      this.deleteVisible = true
    },
    changeDuty(dutyId) {
      let user = this.candidate.filter(item => {
        return item.id === dutyId
      })[0]
      this.storeModel.dutyPhone = user.phone
    },
    submitStoreModel() {
      this.$refs.storeForm.validate(valid => {
        if (valid) {
          if (!this.storeModel.id) {
            insertStore(this.storeModel).then(() => {
              this._getStoreList()
              this.storeVisible = false
            })
          } else {
            updateStore(this.storeModel).then(() => {
              this._getStoreList()
              this.storeVisible = false
            })
          }
        }
      })
    },
    deleteStoreModel() {
      deleteStore(this.storeModel.id).then(() => {
        this._getStoreList()
        this.deleteVisible = false
      })
    },
    closeStoreForm() {
      this.storeModel = {seq: 1}
      this.$refs.storeForm.clearValidate()
    },
    _initData() {
      getUserListRole('keeper').then(res => {
        this.candidate = res.data
      })
    },
    _getStoreList() {
      selectStore().then(res => {
        this.storeList = res.data
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.el-select
  display block
</style>
