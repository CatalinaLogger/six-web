<template>
  <div class="app-container none back">
    <el-row>
      <el-col class="category-option app-box" :span="8" v-for="item in categoryFlow" :key="item.category">
        <title-line :title="mateCategory(item.category)" type="success"></title-line>
        <el-row class="process-option">
          <el-col :span="8" v-for="process in item.process" :key="process.id">
            <router-link class="button" tag="div" :to="{ name: 'keep_' + process.key, params: {defineId: process.id, formKey: 'a'}}">
              <svg-icon :icon-class="'flow-' + process.key" />
              <p>{{process.name}}</p>
            </router-link>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
import TitleLine from '@/components/title-line'
import { getConfDataTree } from '@/api/global'
import { getFlowList } from '@/api/flow'
export default {
  name: 'keep_start',
  data() {
    return {
      buttonList: [],
      categoryList: [],
      categoryFlow: []
    }
  },
  mounted() {
    this.buttonList = this.$route.meta.buttons
    this._getFlowCategory()
  },
  methods: {
    mateCategory(category) {
      return this.categoryList.filter(item => {
        return item.code === category
      })[0].name
    },
    _getFlowCategory() {
      getConfDataTree('ProcessType').then(res => {
        this.categoryList = res.data
        this._getCategoryList()
      })
    },
    _getCategoryList() {
      getFlowList(null, null, true).then(res => {
        let map = {}
        res.data.forEach((item) => {
          const key = item.category
          if (!map[key]) {
            map[key] = {
              category: key,
              process: []
            }
          }
          map[key].process.push(item)
        })
        for (let key in map) {
          this.categoryFlow.push(map[key])
        }
      })
    }
  },
  components: {
    TitleLine
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.app-container
  padding 10px
  .category-option
    position relative
    margin 10px
    background white
    .title-line
      margin 0 10px
    .process-option
      padding 60px 10px 10px 10px
      .button
        position relative
        margin 0 auto
        padding-top 10px
        width 100px
        text-align center
        cursor pointer
        background #F2F6FC
        border 1px solid #ccc
        border-radius 10px
        &:active
          top 4px
        .svg-icon
          font-size 50px
</style>
