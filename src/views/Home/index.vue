<template>
  <div>
    <van-nav-bar class="navbar">
      <template #title>
        <van-button
          icon="search"
          block
          round
          size="small"
          @click="$router.push('/search')"
          >搜索</van-button
        >
      </template>
    </van-nav-bar>
    <van-tabs v-model="active" swipeable>
      <van-tab :title="item.name" v-for="item in channel" :key="item.id">
        <!-- 文章详情 -->
        <ArticleList :id="item.id"></ArticleList>
      </van-tab>
      <span class="toutiao toutiao-gengduo" @click="isShow = true"></span>
    </van-tabs>

    <!-- 弹出层 -->
    <van-popup
      closeable
      close-icon-position="top-left"
      v-model="isShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <ChannelEdit
        @change-active=";[(isShow = false), (active = $event)]"
        :MyChannel="channel"
        @del-channel="delChannel"
        @add-channel="addChannel"
      ></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
import ChannelEdit from './components/ChannelEdit.vue'
import { getChannelAPI, DelChannelAPI, addChannelAPI } from '@/api'
import ArticleList from './components/ArticleList.vue'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    ArticleList,
    ChannelEdit
  },
  data() {
    return {
      active: 2,
      channel: [],
      isShow: false
    }
  },
  created() {
    this.initChannels()
  },
  methods: {
    ...mapMutations(['SET_MY_CHANNELS']),
    initChannels() {
      if (this.isLogin) {
        this.getChannel()
      } else {
        const Channels = this.$store.state.myChannels
        if (Channels.length === 0) {
          this.getChannel()
        } else {
          this.channel = Channels
        }
      }
    },
    async getChannel() {
      try {
        const { data } = await getChannelAPI()
        // console.log(data)
        this.channel = data.data.channels
      } catch (error) {
        if (!error.response) {
          throw error
        } else {
          const status = error.response.status
          status === 507 && this.$toast.fail('刷新再试')
        }
      }
    },
    async delChannel(id) {
      try {
        const newChannel = this.channel.filter((item) => item.id !== id)
        if (this.isLogin) {
          // 发送请求删除频道
          await DelChannelAPI(id)
        } else {
          // 把我的频道 存在本地存储
          this.SET_MY_CHANNELS(newChannel)
        }

        // 视图层删除频道
        this.channel = newChannel
        this.$toast.success('删除频道成功')
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$toast.fail('请登录后再删除')
        } else {
          throw error
        }
      }
    },

    async addChannel(channel) {
      try {
        if (this.isLogin) {
          // 发送请求添加频道
          await addChannelAPI(channel.id, this.channel.length)
        } else {
          this.SET_MY_CHANNELS([...this.channel, channel])
        }
        // 视图层添加频道
        this.channel.push(channel)

        this.$toast.success('添加成功')
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$toast.fail('请登录后再添加')
        } else {
          throw error
        }
      }
    }
  },
  computed: {
    ...mapGetters(['isLogin'])
  }
}
</script>

<style scoped lang="less">
.navbar {
  background-color: #3296fa;

  // inherit 继承
  // unset 不设置
  :deep(.van-nav-bar__title) {
    max-width: unset;
  }
  .van-button--default {
    background-color: #5babfb;
    border: 0;
    color: #fff;
    font-size: 30px;
  }

  .van-icon {
    color: #fff;
  }
  .van-button--block {
    width: 7.4rem;
  }
}
/* tabs导航条样式 */
:deep(.van-tabs__wrap) {
  padding-right: 66px;

  .van-tabs__nav {
    padding-left: 0;
    padding-right: 0;

    /* tab标签 */
    .van-tab {
      border: 1px solid #eee;
      width: 200px;
      height: 82px;
    }

    /* tab标签下划线 */
    .van-tabs__line {
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 40px;
    }
  }
}

/* 字体图标 */
.toutiao-gengduo {
  position: absolute;
  top: 0;
  right: 0;
  width: 66px;
  height: 82px;
  font-size: 40px;
  line-height: 82px;
  text-align: center;
  opacity: 0.6;
  border-bottom: 1px solid #eee;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 1px;
    background-image: url('~@/assets/images/gradient-gray-line.png');
  }
}
</style>
