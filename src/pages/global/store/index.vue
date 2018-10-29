<template>
  <div class="app-container back">
    <div class="operate-wrapper">
      <el-button type="success" size="mini" icon="el-icon-plus" @click="addStore()">新增仓库</el-button>
    </div>
    <el-table
      :data="withList"
      border
      stripe>
      <el-table-column align="center" prop="username" label="仓库名称" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="name" label="仓库编号" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="phone" label="仓库地址" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="mail" label="负责人" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="mail" label="手机" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="mail" label="备注" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="操作" width="170">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="entryOthers(scope.row)" :disabled="entryDisabled">TA的下属</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      top="0"
      width="600px"
      :title="storeFormTitle"
      :visible.sync="storeVisible"
      @close="closeStoreForm">
      <el-form :model="storeModel" :rules="storeRules" label-position="left" label-width="70px" ref="storeForm" style="margin: 0 20px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="仓库编号" prop="code">
              <el-input :value="storeModel.code"></el-input>
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
            <el-form-item label="责任人" prop="userName">
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机">
              <el-input v-model="storeModel.phone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="link">
              <el-input v-model="storeModel.link"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序号" prop="seq">
              <el-input v-model="storeModel.seq"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="仓库地址" prop="address">
          <el-input v-model="storeModel.address"></el-input>
        </el-form-item>
        <el-form-item label="协作人" prop="team">
        </el-form-item>
        <el-form-item label="可见范围" prop="auth">
        </el-form-item>
        <el-form-item label="备注">
          <el-input maxlength="150" v-model="storeModel.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="storeVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveStoreModel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      storeModel: {
        parent: {
          id: 0,
          name: ''
        }
      },
      storeRules: {
        seq: [{required: true, message: '排序号为必填项', trigger: 'blur'}]
      },
      storeFormTitle: '',
      storeVisible: false,
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }]
    }
  },
  methods: {
    addStore() {
      this.storeFormTitle = '新增仓库'
      this.storeVisible = true
    },
    closeStoreForm() {
      this.$refs.storeForm.clearValidate()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
