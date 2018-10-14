<template>
  <div id="app">
  <button @click="changeStatus()"></button>
  <el-row>
    <el-col :span="12">
    <el-progress type="circle" :percentage="80" color="#8e71c7"></el-progress>
    </el-col>
    <el-col :span="12">
      <div class="status-box" v-bind:class="{active: isActive}">
          {{status}}
      </div>
    </el-col>
  </el-row>
  <el-table
  :data="tableData"
  stripe
  style="width: 100%">
    <el-table-column
      prop="at"
      label="시간"
      width="180">
    </el-table-column>
    <el-table-column
      prop="status"
      label="상태"
      width="180">
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      isActive: false,
      tableData: []
    }
  },
  computed: {
    status () {
      return ((this.isActive) ? '켜짐' : '꺼짐')
    }
  },
  methods: {
    changeStatus () {
      let msg = {
        status: (this.isActive) ? '0' : '1',
        timestamp: new Date()
      }
      this.isActive = !this.isActive

      if (this.isActive) {
        this.$notify({
          title: '켜짐',
          message: '전원이 켜졌습니다',
          type: 'success'
        })
      } else {
        this.$notify({
          title: '꺼짐',
          message: '전원이 꺼졌습니다',
          type: 'warning'
        })
      }
      console.log({at: new Date(msg.timestamp).toString(), status: (this.isActive) ? '켜짐' : '꺼짐'})
      this.tableData.push({at: new Date(msg.timestamp).toString(), status: (this.isActive) ? '켜짐' : '꺼짐'})
    }
  },
  socket: {
  // Prefix for event names
  // prefix: "/counter/",
  // If you set `namespace`, it will create a new socket connection to the namespace instead of `/`
  // namespace: "/counter",
    events: {
      // Similar as this.$socket.on("changed", (msg) => { ... });
      // If you set `prefix` to `/counter/`, the event name will be `/counter/changed`
      //
      changed (msg) {
        // 상태 바꿔주기,
        // 테이블에 데이터 추가하기
        this.isActive = !!parseInt(msg.status)
        if (this.isActive) {
          this.$notify({
            title: '켜짐',
            message: '전원이 켜졌습니다',
            type: 'success'
          })
        } else {
          this.$notify({
            title: '꺼짐',
            message: '전원이 꺼졌습니다',
            type: 'warning'
          })
        }
        this.tableData.push({at: new Date(msg.timestamp).toString(), status: (this.isActive) ? '켜짐' : '꺼짐'})
      }
      /* common socket.io events
      connect() {
        console.log("Websocket connected to " + this.$socket.nsp);
      },
      disconnect() {
        console.log("Websocket disconnected from " + this.$socket.nsp);
      },
      error(err) {
        console.error("Websocket error!", err);
      }
      */
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.status-box{
  border-radius: 4px;
  padding: 20px;
  margin: 5px 0;
  height: 74px;
  box-sizing: border-box;
  color: #fff;
  background-color: #F56C6C;
  font-size: 24px;
}
.status-box.active{
  background-color: #409eff;
}
</style>
