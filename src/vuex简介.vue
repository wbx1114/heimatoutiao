<template>
  <div>
    <!-- <router-view></router-view> -->
    <h1>{{ count }}</h1>
    <h1>{{ getNum }}</h1>
    <button @click="SET_COUNT(10)">count++</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  methods: {
    ...mapMutations(['SET_COUNT'])
  },

  computed: {
    ...mapState(['count']),
    ...mapGetters(['getNum'])
  }
}
</script>

<style scoped></style>
