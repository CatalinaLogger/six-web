<template>
  <div class="app-container none">
    <sticky className="tool-bar info">
      <template>
        <div class="query-wrapper">
          <div class="first"><el-button class="deploy-button" type="success" @click="deployProcess()">部署流程</el-button></div>
          <div><el-input v-model="name" placeholder="流程名称"></el-input></div>
          <div>
            <el-select v-model="category" placeholder="流程分类">
              <el-option
                v-for="item in categoryList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="button">
            <el-button-group>
              <el-button type="danger" @click="resetFilter">重置</el-button>
              <el-button type="primary" @click="selectFilter">查询</el-button>
            </el-button-group>
          </div>
        </div>
      </template>
    </sticky>
    <template>
      <el-table
        :data="defineList"
        border
        stripe
        style="width: 100%">
        <el-table-column
          align="center"
          prop="name"
          label="流程名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          align="center"
          prop="category"
          label="流程分类"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag type="success">{{mateCategory(scope.row.category)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="description"
          label="流程描述"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          align="center"
          prop="version"
          label="版本">
        </el-table-column>
        <el-table-column
          align="center"
          label="部署时间"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.deployTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="260">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="imageProcess(scope.row)">流程图</el-button>
            <el-button type="success" size="mini" v-if="scope.row.suspensionState === 1" @click="suspendProcess(scope.row)">停用流程</el-button>
            <el-button type="info" size="mini" v-else @click="activateProcess(scope.row)">启用流程</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-dialog
      top="0"
      width="500px"
      title="部署流程"
      :visible.sync="deployVisible"
      @close="closeDeployForm">
      <el-form :model="deployModel" :rules="deployRules" label-width="80px" ref="deployForm" style="margin: 0 60px">
        <el-form-item label="流程名称" prop="name">
          <el-input v-model="deployModel.name"></el-input>
        </el-form-item>
        <el-form-item label="流程分类" prop="category">
          <el-select v-model="deployModel.category" placeholder="请选择">
            <el-option
              v-for="item in categoryList"
              :key="item.value"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流程文件">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="actionUrl"
            :headers="headers"
            :data="deployModel"
            :limit="1"
            :on-progress="handleProgress"
            :on-success="callBackSuccess"
            :file-list="deployModel.fileList"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取流程文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" :loading="loading" @click="submitUpload">部署到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传bpmn20/zip流程定义文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      fullscreen
      :visible.sync="imageVisible">
      <div>
        <img :src="imageUrl" alt="">
      </div>
    </el-dialog>
    <el-dialog
      top="0"
      width="500px"
      title="操作提示"
      :visible.sync="switchVisible">
      <div>确定要{{switchType ? '启用' : '停用'}} <span class="strong-font danger">{{define.name}}</span> 这个流程吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="switchVisible = false">取 消</el-button>
        <el-button type="primary" @click="switchSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Sticky from '@/components/sticky'
import { getToken } from '@/common/utils/auth'
import { getConfDataTree } from '@/api/global'
import { getFlowList, suspendFlow, activateFlow } from '@/api/flow'

export default {
  name: 'keep_deploy',
  data() {
    return {
      baseURL: process.env.BASE_API,
      headers: { 'X-Token': getToken() },
      categoryList: [],
      defineList: [],
      define: {},
      name: null,
      category: null,
      imageUrl: '',
      deployVisible: false,
      loading: false,
      deployModel: {},
      deployRules: {
        name: [{required: true, trigger: 'blur', message: '流程名称为必填项'}],
        category: [{required: true, trigger: 'blur', message: '流程分类为必填项'}]
      },
      imageVisible: false,
      switchVisible: false,
      switchType: false // false: 停用流程、true: 启用流程
    }
  },
  computed: {
    actionUrl() {
      return `${this.baseURL}/flow/deploy`
    }
  },
  mounted() {
    this._getFlowCategory()
  },
  methods: {
    resetFilter() {
      this.name = null
      this.category = null
      this._getFlowList()
    },
    selectFilter() {
      this._getFlowList()
    },
    imageProcess(define) {
      this.imageUrl = `${this.baseURL}/process/define?defineId=${define.id}`
      this.imageVisible = true
    },
    suspendProcess(define) {
      this.define = define
      this.switchType = false
      this.switchVisible = true
    },
    activateProcess(define) {
      this.define = define
      this.switchType = true
      this.switchVisible = true
    },
    switchSubmit() {
      if (this.switchType) {
        activateFlow(this.define.id).then(() => {
          this._getFlowList()
          this.switchVisible = false
        })
      } else {
        suspendFlow(this.define.id).then(() => {
          this._getFlowList()
          this.switchVisible = false
        })
      }
    },
    deployProcess() {
      this.deployVisible = true
    },
    submitUpload() {
      this.$refs.deployForm.validate(valid => {
        if (valid) {
          this.$refs.upload.submit()
        }
      })
    },
    handleProgress() {
      this.loading = true
    },
    callBackSuccess(res) {
      if (res.code === 1) {
        this._getFlowList()
        this.deployVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } else {
        this.$message.error(res.msg)
      }
      this.loading = false
    },
    closeDeployForm() {
      this.loading = false
      this.deployModel = {}
      this.$refs.upload.clearFiles()
      this.$refs.deployForm.clearValidate()
    },
    mateCategory(category) {
      return this.categoryList.filter(item => {
        return item.code === category
      })[0].name
    },
    _getFlowCategory() {
      getConfDataTree('ProcessType').then(res => {
        this.categoryList = res.data
        this._getFlowList()
      })
    },
    _getFlowList() {
      getFlowList(this.name, this.category, true).then(res => {
        this.defineList = res.data
      })
    }
  },
  components: {
    Sticky
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.first
  text-align left
.el-form
  padding-bottom 20px
  .el-select
    display block
</style>
