<template>
    <StoryHead :head-type="6" second-type="2" :sid="sid" :sname="sname"></StoryHead>

  <!--        统计-->
        <div style="background-color:#b0c4de;margin: auto;padding: 10px">
          <el-row>
            <el-col  :span="20">
              <el-select v-model="value" placeholder="类型" clearable>
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                />
              </el-select>
              <el-select placeholder="处理状态" clearable>
                <el-option label="已处理" value="已处理"/>
                <el-option label="讨论中" value="讨论中"/>
              </el-select>
              <el-input v-model="input3" placeholder="Please input" class="input-with-select" style="width: 250px"/>
              <el-button :icon="Search" circle />
            </el-col >
            <el-col :span="4"  style="text-align: right;">
              <div style="text-align: right; font-size: 12px" class="toolbar">
                <el-dropdown>
                  <el-icon style="margin-right: 8px; margin-top: 1px"><setting/></el-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>View</el-dropdown-item>
                      <el-dropdown-item>Add</el-dropdown-item>
                      <el-dropdown-item>Delete</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <span>Tom</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <!--        表格-->
        <div>
          <el-scrollbar>
            <el-table :data="discussList">
              <el-table-column label="序号"  width="50" >
                <template #default="scope">
                  {{scope.$index+1}}
                </template>
              </el-table-column>
              <el-table-column prop="wname" label="世界" width="140" :show-overflow-tooltip="true" />
              <el-table-column prop="etitle" label="元素" width="120"  :show-overflow-tooltip="true"/>
              <el-table-column prop="title" label="主题"   :show-overflow-tooltip="true"/>
              <el-table-column  label="讨论类型"  :show-overflow-tooltip="true" >
                <template #default="scope">
                  <span>{{discussTypesMap.get(scope.row.types)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="content" label="讨论内容"  :show-overflow-tooltip="true" />
              <el-table-column prop="createTime" label="创建时间"  :show-overflow-tooltip="true" />
              <el-table-column  label="状态" >
                <template #default="scope">
                  <span>{{discussStatusMap.get(scope.row.status)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="audit" label="审核结果" :show-overflow-tooltip="true"/>
              <el-table-column fixed="right" label="操作" width="100">
                <template #default="scope">
                  <el-button link type="primary" size="small" @click="handleSee(scope.row)">查看</el-button>
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
              @current-change="getList"/>
        </div>

      <!--      审核弹出框-->
      <el-dialog v-model="dialogFormVisible" title="审核">
        <el-form :model="form">
          <el-form-item label="Zones" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="Please select a zone">
              <el-option label="Zone No.1" value="shanghai" />
              <el-option label="Zone No.2" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="说明" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确认</el-button>
      </span>
        </template>
      </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs} from 'vue'
import {useRoute, useRouter} from "vue-router";
import {  Setting } from '@element-plus/icons-vue'
import { Search } from '@element-plus/icons-vue'
import { listDiscuss } from "@/api/admin/discuss";
import { discussTypesMap,discussStatusMap,discussTypes,discussStatus } from "@/utils/constant";

import StoryHead from "./storyHead.vue";

// 接收url里的参数
const route = useRoute();
const sname = ref(route.query.sname);
const sid = ref(route.query.sid);
const wid = ref(route.query.wid);



const router = useRouter()

//分页
const dateRange = ref([]);
//分类选项
const dataStree = ref([])
const loading = ref(true);
const discussList = ref([]);
const total = ref(0);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,

    auditStatus:0,
    name: undefined,
    types: undefined,
    source:2,
    sid:sid.value,
    wid:wid.value,
  },
  rules: {
    // userName: [{ required: true, message: "用户名称不能为空", trigger: "blur" }, { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" }],
  }
});
const { queryParams, form, rules } = toRefs(data);

/** 查询世界列表 */
function getList(page: number) {
  window.scrollTo(0, 0); // 滚动到顶部
  queryParams.value.pageNum=page;

  listDiscuss(queryParams.value).then(response => {
    loading.value = false;
    discussList.value = response.data;
    total.value = response.total;
  });
}
//弹出框
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
function handleSee(row){
  router.push("/discuss/index?wid="+row.wid+"&sid="+row.sid+"&did="+row.id+"&source=2");
}
getList(1)
</script>

<style scoped>

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}


</style>
