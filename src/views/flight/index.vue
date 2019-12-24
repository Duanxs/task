<template>
  <div class="app-container">
    <div class="search-container">
      <div class="search-item">
        要客级别：
        <el-select class="search-select" v-model="searchQuery.level" placeholder="请选择" size="small">
          <el-option v-for="item in vipList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </div>
      <div class="search-item">
        进/出港：
        <el-select
          class="search-select"
          v-model="searchQuery.status"
          placeholder="请选择"
          size="small"
        >
          <el-option v-for="item in flightStatus" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </div>
      <div class="search-item">
        <el-button @click="handleSearch" type="primary" size="small" icon="el-icon-search">搜索</el-button>
        <el-button @click="handleClear" size="small" icon="el-icon-refresh-left">清空</el-button>
      </div>
    </div>

    <div class="ctrl-container">
      <el-button @click="handleAdd" type="primary" size="small" icon="el-icon-plus">增加</el-button>
      <el-button @click="handleBatchDelete" size="small" icon="el-icon-delete">批量删除</el-button>
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
      <el-table-column label="要客级别" align="center">
        <template slot-scope="scope">{{ scope.row.level }}</template>
      </el-table-column>
      <el-table-column label="进出港" align="center">
        <template slot-scope="scope">{{ scope.row.status }}</template>
      </el-table-column>
      <el-table-column label="提前提醒时间" align="center">
        <template slot-scope="scope">{{ scope.row.remind }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="220">
        <template slot-scope="scope">
          <el-button
            @click="handleEdit(scope.row)"
            type="primary"
            size="small"
            icon="el-icon-edit-outline"
          >编辑</el-button>
          <el-button @click="handleDelete(scope.row)" size="small" icon="el-icon-delete">删除</el-button>
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

    <el-dialog title="添加" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="要客级别" prop="level">
          <el-select v-model="temp.level" class="filter-item" placeholder="请选择">
            <el-option v-for="item in vipList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="进出港" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择">
            <el-option v-for="item in flightStatus" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="提醒时间" prop="remind">
          <el-input v-model="temp.remind" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, addInfo, updateInfo } from "@/api/flight";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  components: { Pagination },
  data() {
    return {
      total: 0,
      pageSizes: [10, 20, 30],
      list: null,
      listLoading: true,
      vipList: ["VVIP-G", "VIP-T", "VVIP", "VIP"],
      flightStatus: ["进港", "出港"],
      multipleSelection: [],

      searchQuery: {
        page: 1,
        count: 10,
        level: null,
        status: null
      },

      dialogFormVisible: false,
      dialogStatus: "",
      dialogPvVisible: false,
      temp: {
        level: null,
        status: null,
        remind: null
      },
      rules: {
        level: [{ required: true, message: "请选择", trigger: "change" }],
        status: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        remind: [{ required: true, message: "请输入", trigger: "blur" }]
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
        // console.log(this.list);
        this.listLoading = false;
      });
    },

    handleSearch() {
      this.fetchData();
    },
    handleClear() {
      this.searchQuery = {
        page: 1,
        count: 10,
        level: null,
        status: null
      };
      this.fetchData();
    },

    handleAdd() {
      this.temp = {
        level: null,
        status: null,
        remind: null
      };
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleBatchDelete() {
      if (this.multipleSelection) {
        this.multipleSelection.forEach((item1, index1) => {
          this.list.forEach((item2, index2) => {
            if (item1._id === item2._id) {
              this.list.splice(index2, 1);
              this.total -= 1;
            }
          });
        });
        this.$notify({
          title: "Success",
          message: "删除成功",
          type: "success",
          duration: 2000
        });
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    handleEdit(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleDelete(row) {
      this.$notify({
        title: "Success",
        message: "删除成功",
        type: "success",
        duration: 2000
      });
      const index = this.list.indexOf(row);
      this.list.splice(index, 1);
    },

    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          addInfo(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "添加成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          updateInfo(tempData).then(() => {
            for (const v of this.list) {
              if (v._id === this.temp._id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    }
  }
};
</script>

<style >
.search-container {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
  padding: 0.3rem;
  border-bottom: 1px solid #f5f5f5;
}
.search-item {
  width: 12rem;
  margin-right: 5rem;
}

.search-select {
  width: 6rem;
}

.ctrl-container {
  display: flex;
  justify-content: flex-end;
  margin: 1rem;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
