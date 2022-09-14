<template>
  <div class="article">
    <!-- 属性： -->
    <!-- @load：触底的时候触发load事件 -->
    <!-- offset：滚动条和底部距离多少的时候触发load事件，默认值300px -->
    <!-- immediate-check：初渲染的时候是否执行load事件，默认值是true -->
    <van-pull-refresh v-model="refreshLoading" @refresh="getNextPageArticle">
      <van-list
        v-model="loading"
        @load="getNextPageArticle"
        offset="100"
        :immediate-check="false"
        :error.sync="error"
        error-text="请求失败,请重新加载"
        :finished="finished"
        finished-text="没有更多文章了~~"
      >
        <ArticleItem
          v-for="item in articles"
          :key="item.art_id"
          :article="item"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getNewsAPI } from '@/api'
import ArticleItem from './ArticleItem.vue'
export default {
  components: {
    ArticleItem
  },
  props: {
    id: [String, Number]
  },
  data() {
    return {
      articles: [],
      preTimestanp: '',
      loading: false,
      finished: false,
      error: false,
      refreshLoading: false
    }
  },
  created() {
    this.getFirstNews()
  },
  methods: {
    async getFirstNews() {
      try {
        const { data } = await getNewsAPI(this.id, +new Date())
        // console.log(data.data.results)
        this.articles = data.data.results
        // 保存下一页的时间戳，用于分页
        this.preTimestanp = data.data.pre_timestamp
      } catch (error) {
        const status = error.response?.status
        if (error.response || status === 507) {
          throw error
        } else {
          if (status === 400) {
            throw new Error(error.response.data.message)
          }
        }
      }
    },
    async getNextPageArticle() {
      try {
        //  发送请求
        const { data } = await getNewsAPI(this.id, this.preTimestanp)
        if (!data.data.pre_timestamp) {
          this.finished = true
        }
        // 如果 下拉加载，将数据放在最后
        // 如果 下拉刷新，将数据放在最前
        // 添加到articles
        if (this.loading) {
          this.articles.push(...data.data.results)
        } else {
          this.articles.unshift(...data.data.results)
        }

        // 更新时间戳
        this.preTimestanp = data.data.pre_timestamp
      } catch (error) {
        // 对错误进行处理
        this.error = true
      } finally {
        // 更改loading
        this.loading = false
        this.refreshLoading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.article {
  height: calc(100vh - 92px - 83px - 100px);
  overflow: auto;

  // &: 代表当前元素他爹
  // ::-webkit-scrollbar : 滚动槽
  // ::-webkit-scrollbar-thumb: 滚动的滑块
  &::-webkit-scrollbar {
    width: 10px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #3296fa;
    border-radius: 10px;
  }
}
</style>
