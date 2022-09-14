<template>
  <div class="my">
    <!-- 头部 -->
    <header>
      <!-- 登录状态结构 -->
      <div class="login banner" v-if="isLogin">
        <van-row></van-row>

        <van-row>
          <van-col span="12">
            <van-row
              style="height: 100%"
              type="flex"
              justify="space-around"
              align="center"
            >
              <van-image
                round
                width="1.5rem"
                height="1.5rem"
                :src="userInfo.photo"
              />
              <span class="num">{{userInfo.name}}</span>
            </van-row>
          </van-col>

          <van-col span="7"></van-col>

          <van-col span="5">
            <van-row justify="space-around" align="center" style="height: 100%">
              <van-button size="mini" round class="edit-btn">编辑</van-button>
            </van-row>
          </van-col>
        </van-row>

        <van-row>
          <van-grid class="grid" :border="false">
            <van-grid-item text="头条">
              <template #icon> {{userInfo.art_count}} </template>
            </van-grid-item>
            <van-grid-item text="粉丝">
              <template #icon> {{userInfo.fans_count}}  </template>
            </van-grid-item>
            <van-grid-item text="关注">
              <template #icon> {{userInfo.follow_count}}  </template>
            </van-grid-item>
            <van-grid-item text="获赞">
              <template #icon> {{userInfo.like_count}}  </template>
            </van-grid-item>
          </van-grid>
        </van-row>
      </div>
      <!-- 未登录状态结构 -->
      <div class="logout banner" v-else @click="$router.push('./login')">
        <img src="../../assets/images/mobile.png" alt="" />
        <span class="text">登录 / 注册</span>
      </div>
    </header>
    <!-- 主体 -->
    <main>
      <van-grid column-num="2" clickable>
        <van-grid-item text="收藏">
          <template #icon>
            <span class="toutiao toutiao-shoucang"></span>
          </template>
        </van-grid-item>
        <van-grid-item text="历史">
          <template #icon>
            <span class="toutiao toutiao-lishi"></span>
          </template>
        </van-grid-item>
      </van-grid>
      <div class="link">
        <van-cell title="消息通知" is-link />
        <van-cell title="小智同学" is-link />
      </div>
    </main>
    <!-- 底部  -->
    <footer>
      <van-button style="color: red" block v-if="isLogin" @click="logout">
        退出
      </van-button>
    </footer>
  </div>
</template>

<script>
import { getUserInfoAPI } from '@/api'
import { mapGetters } from 'vuex'
export default {
  name: 'my',
  data() {
    return {
      userInfo: []
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    async logout() {
      await this.$dialog.confirm({
        title: '黑马头条',
        message: '是否退出该账号'
      })
      this.$store.commit('SET_TOKEN', {})
    },
    async getUserInfo() {
      try {
        if (!this.isLogin) return
        const { data } = await getUserInfoAPI()
        this.userInfo = data.data
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$toast.fail('用户认证失败,请重新登录')
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
.my {
  height: 100vh;
  background-color: #f5f7f9;
}
.banner {
  width: 100%;
  height: 5.33333rem;
  background: url('../../assets/images/banner.png') no-repeat 0 0 / cover;
}
.logout {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  img {
    width: 1.76rem;
    height: 1.76rem;
  }
  .text {
    color: #fff;
    font-size: 30px;
    margin-top: 10px;
  }
}
.login {
  display: flex;
  flex-direction: column;
  > .van-row {
    flex: 1;
  }
}
.num {
  color: #fff;
  font-size: 30px;
}
.van-row {
  width: 100%;
}
.van-row--align-center {
  margin-top: 10px;
}
.edit-btn {
  margin-top: 50px;
  width: 1.6rem;
  height: 0.4267rem;
  color: #666;
}
:deep(.grid) {
  color: #fff;
  .van-grid-item__content {
    font-size: 30px;
    background-color: inherit;
  }
  .van-grid-item__text {
    color: #fff;
  }
}
.link {
  margin: 10px 0;
}
.toutiao {
  font-size: 40px;
}
.toutiao-shoucang {
  color: red;
}
.toutiao-lishi {
  color: orange;
}
</style>
