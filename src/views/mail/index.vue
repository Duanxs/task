<template>
  <div class="app-container">
    <div class="ctrl-container">
      <div class="intro">
        <div class="intro-title">图例：</div>
        <div class="intro-send"></div>
        <div class="intro-text">发件</div>
        <div class="intro-receive"></div>
        <div class="intro-text">收件</div>
      </div>
      <div class="one-click">
        <el-button @click="handleOneClick" size="small" icon="el-icon-success">一键完结</el-button>
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column label="发送时间" width="160" align="center">
        <template slot-scope="scope">{{ scope.row.sendTime }}</template>
      </el-table-column>
      <el-table-column label="内容" align="center">
        <template slot-scope="scope">
          <div
            class="table-content"
            :style="scope.row.content.type | contentFilter"
          >{{ scope.row.content.body }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110" align="center">
        <template slot-scope="scope">
          <div class="table-status" :style="scope.row.status | statusFilter">{{ scope.row.status }}</div>
        </template>
      </el-table-column>
      <el-table-column label="发起席位/来源" width="110" align="center">
        <template slot-scope="scope">
          <span :style="scope.row.origin | originFilter">{{ scope.row.origin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事件类型" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.eventType }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <pagination
        v-show="total>0"
        :total="total"
        :pageSizes="pageSizes"
        :page.sync="searchQuery.page"
        :limit.sync="searchQuery.count"
        @pagination="fetchData"
      />
    </div>
  </div>
</template>

<script>
import { getList } from "@/api/table";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  components: { Pagination },
  filters: {
    contentFilter(type) {
      const contentMap = {
        receive: "background-color:#fef7d9",
        send: "background-color:#d9e8fd"
      };
      return contentMap[type];
    },
    statusFilter(status) {
      const statusMap = {
        已阅读: "background-color:#a1a1a1",
        "1/1": "background-color:#d34f48",
        未阅读: "background-color:#e8ca43"
      };
      return statusMap[status];
    },
    originFilter(origin) {
      const originMap = {
        CPE引擎: "color:#c650f7",
        管理员: "color:#222"
      };
      return originMap[origin];
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,

      multipleSelection: [],

      total: 0,
      pageSizes: [10, 20, 30],

      searchQuery: {
        page: 1,
        count: 10
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getList(this.searchQuery).then(response => {
        this.total = response.data.total;
        this.list = response.data.items;
        this.listLoading = false;
      });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    handleOneClick() {
      if (this.multipleSelection) {
        this.multipleSelection.forEach((item1, index1) => {
          this.list.forEach((item2, index2) => {
            if (item1._id === item2._id) {
              item2.status = "已阅读";
            }
          });
        });
        this.$notify({
          title: "Success",
          message: "处理完成",
          type: "success",
          duration: 2000
        });
        this.$refs.multipleTable.clearSelection();
      }
    }
  }
};
</script>

<style >
.ctrl-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.intro {
  display: flex;
  margin-bottom: 0.3rem;
}
.intro-send {
  width: 3rem;
  height: 1rem;
  margin-right: 0.3rem;
  background-color: #d9e8fd;
}
.intro-receive {
  width: 3rem;
  height: 1rem;
  background-color: #fef7d9;
  margin-left: 0.3rem;
}

.table-content {
  padding: 0 0.5rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.table-status {
  color: #fff;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
