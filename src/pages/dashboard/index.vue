<template>
  <div class="dashboard-container">
    <component :is="currentRole"></component>
  </div>
</template>

<script>
import adminDashboard from './admin'
import editorDashboard from './editor'
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  },
  mounted() {
    setTimeout(() => {
      this.$router.push('/task/wait')
    }, 10)
  },
  components: { adminDashboard, editorDashboard }
}
</script>
