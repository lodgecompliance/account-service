<template>
  <div></div>
</template>
<script>
import {mapGetters} from "vuex";

export default {
  name: 'Home',
  computed: {
    ...mapGetters(['mode'])
  },
  mounted() {
    this.$router.push(
      this.mode === 'personal'
          ? { name: 'user.profile' }
          : { name: 'business.profile', params: { business: this.mode } }
      )
  }
}
</script>
