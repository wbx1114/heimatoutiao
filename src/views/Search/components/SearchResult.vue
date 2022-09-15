<template>
  <div class="result">
    <van-list
      v-model="loading"
      @load="getResults"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
    >
      <van-cell
        v-for="item in results"
        :key="item.art_id"
        :title="item.title"
        @click="
          $router.push({
            path: '/detail',
            query: { articleId: item.art_id }
          })
        "
      ></van-cell>
    </van-list>
  </div>
</template>

<script>
import { getResultsAPI } from '@/api'
export default {
  props: {
    keywords: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      page: 1,
      perpage: 10,
      results: [],
      finished: false,
      error: false
    }
  },
  methods: {
    async getResults() {
      try {
        const { data } = await getResultsAPI(
          this.page++,
          this.perpage,
          this.keywords
        )
        const results = data.data.results
        if (results.length === 0) {
          this.finished = true
        }
        console.log(data)
        // 保存数据
        this.results = [...this.results, ...results]
      } catch (error) {
        this.error = true
      } finally {
        // 关闭loading
        this.loading = false
      }
    }
  }
}
</script>

<style scopeed lang="less">
.result {
  height: calc(100vh - 108px);
  overflow: auto;
}
</style>
