<template>
        <div>
          <el-menu
              :default-active="1"
              mode="horizontal"
              style="margin:0px;pardding:0px"
          >
            <el-menu-item index="1"><span style="font-size: 20px;font-weight:bold;">关注的世界</span></el-menu-item>
<!--            <el-menu-item index="2">关注的故事</el-menu-item>-->
          </el-menu>
        </div>
        <!--        统计-->
        <div style="background-color:#b0c4de;margin: auto;padding: 10px">
          <el-row>
            <el-col  :span="4">
              合计({{total}})
            </el-col >
            <el-col :span="20"  style="text-align: right;">
            </el-col>
          </el-row>
        </div>
        <!--        表格-->
        <div>
          <el-scrollbar>
            <el-table :data="fllowList">
              <el-table-column label="序号" width="80"  >
                <template #default="scope">
                  {{scope.$index+1}}
                </template>
              </el-table-column>
              <el-table-column prop="wname" label="名称" :show-overflow-tooltip="true" >
                <template #default="scope">
                  <router-link  :to="{path:'/world/details', query: {wid:scope.row.wid,wname:scope.row.wname}}"><el-tag v-if="scope.row.source=='原创'">原创</el-tag>{{scope.row.wname}}</router-link>
                </template>
              </el-table-column>
              <el-table-column label="类别" align="center"   >
                <template #default="scope">
                  <span>{{worldTypesMap.get(scope.row.types)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="ranks" label="等级" />
              <el-table-column prop="intro" label="简介" :show-overflow-tooltip="true" />
              <el-table-column prop="updateNewElementTime" label="更新时间" :show-overflow-tooltip="true" />
              <el-table-column prop="updateNewElement" label="更新元素" :show-overflow-tooltip="true" />
              <el-table-column prop="createTime" label="关注时间" :show-overflow-tooltip="true" />
              <el-table-column fixed="right" label="操作" width="100">
                <template #default="scope">
                  <el-button link type="primary" size="small" @click="handleClick(scope.row)">取消关注</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </div>
        <!--        分页-->
        <div style="float:right; position:relative; ">
          <el-pagination

              :total="total"
              layout="total, prev, pager, next"
              v-model:page="queryParams.pageNum"
              :page-size=20
              @current-change="getList"
          />
        </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs} from 'vue'
import { listFllow,fllowClose } from "@/api/admin/fllow";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
const router = useRouter();
const total = ref(0);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,

    name: undefined,
    types: undefined,
  },
  rules: {
    // userName: [{ required: true, message: "用户名称不能为空", trigger: "blur" }, { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" }],
  }
});

const worldTypes=reactive([{id:6,name:"科学"},{id:1,name:"武侠"},{id:2,name:"仙侠"},{id:3,name:"魔幻"},{id:4,name:"奇幻"},{id:5,name:"其他"}])
const worldTypesMap=new Map([
    [6,"科学"],
    [1,"武侠"],
    [2,"仙侠"],
    [3,"魔幻"],
    [4,"奇幻"],
    [5,"其他"],
])


const { queryParams, form, rules } = toRefs(data);
const dateRange = ref([]);
const fllowList = ref([]);
function handleClick(row){
  fllowClose(row.wid).then(response => {
    ElMessage.success("取消成功");
    getList(queryParams.value.pageNum);

  });
}
/** 查询世界列表 */
function getList(page: number) {
  window.scrollTo(0, 0); // 滚动到顶部
  queryParams.value.pageNum=page;

  listFllow(queryParams.value).then(response => {
    fllowList.value = response.data;
    total.value = response.total;
  });
}
getList(queryParams.value.pageNum);

</script>

<style scoped>

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}


</style>
