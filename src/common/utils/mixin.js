import ApprovePanel from '@/components/approve-panel'
import { getMineInfo } from '@/api/system'
import { getConfDataTree } from '@/api/global'
import { selectDraft, insertDraft, deleteDraft } from '@/api/work'

export const flowFormMixin = {
  data() {
    return {
      draft: false,
      mine: {},
      formKey: '',
      readOnly: false,
      defineId: '',
      task: {},
      levelList: [], // 紧急程度配置
      workModel: {}
    }
  },
  created() {
    this._initConfig()
  },
  activated() {
    this.$refs.workForm.clearValidate() // 重置表单
    this._getParams()
  },
  methods: {
    /** 关闭申请 */
    closeClick() {
      let view = {name: this.$route.name, path: this.$route.path}
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView.path)
          } else {
            this.$router.push('/')
          }
        }
      })
    },
    /** 清除草稿 */
    clearClick() {
      this.workModel = {}
      deleteDraft(this.defineId).then(() => {
        this.draft = false
        this._createWorkModel()
      })
    },
    /** 保存草稿 */
    saveClick(model) {
      insertDraft(this.defineId, model).then(() => {
        this.draft = true
      })
    },
    /** 取消申请 */
    cancelClick() {
      this.startProcess({taskId: this.task.id, taskCode: -2, taskName: '取消申请'})
    },
    /** 提交申请 */
    startClick() {
      this.$refs.workForm.validate(valid => {
        if (valid) {
          if (this.task.id) {
            /** 重新发起申请 */
            this.startProcess({taskId: this.task.id, taskCode: 2, taskName: '提交申请'})
          } else {
            /** 首次发起申请 */
            this.startProcess({defineId: this.defineId, taskCode: 2, taskName: '提交申请'})
          }
        }
      })
    },
    isActive(route) {
      return route.path === this.$route.path || route.name === this.$route.name
    },
    _initConfig() {
      if (!this.$route.params.formKey) {
        setTimeout(() => {
          this.closeClick()
        }, 10)
      }
      getConfDataTree('UrgentLevel').then(res => {
        this.levelList = res.data
      })
      getMineInfo().then(res => {
        this.mine = res.data
      })
    },
    /** 取到路由带过来的参数 */
    _getParams () {
      if (this.$route.params.formKey) {
        this.formKey = this.$route.params.formKey
        if (this.$route.params.formKey === '#') {
          this.formKey = null
        }
      }
      this.readOnly = this.$route.params.readOnly
      /** 当发起一个流程时 */
      if (this.$route.params.defineId) {
        this.defineId = this.$route.params.defineId
        this.task = {}
        selectDraft(this.defineId).then(res => {
          if (res.data) {
            let model = JSON.parse(res.data)
            // 当发起一个流程且有保存草稿时
            this.workModel = model
            this.draft = true
          } else {
            // 当发起一个流程且没有保存草稿时
            if (this.mine.id) {
              this._createWorkModel()
            } else {
              setTimeout(() => {
                this._getParams()
              }, 100)
            }
          }
        })
      }
      /** 当审批一个申请时 */
      if (this.$route.params.task) {
        this.task = this.$route.params.task
        // 当审批或者查看一个任务时
        this._selectWorkModel()
      }
    }
  },
  components: {
    ApprovePanel
  }
}
