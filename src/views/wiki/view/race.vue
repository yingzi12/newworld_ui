<template>
  <!-- 元素内容 -->
  <div>
    <div v-for="(domain, index) in element.contentList"
         :key="domain.key"
         :label="'Domain' + index"
         :prop="'domains.' + index + '.value'"
         :rules="{  required: true,  message: 'domain can not be null', trigger: 'blur',}"
         style="margin-bottom: 20px"
    >
      <div     class="smallTitle">
        <el-row >
          <el-col :span="19">
            <div class="biaoti">
              <h3><el-icon><Tickets /></el-icon><span>{{domain.title  }}</span></h3>
            </div>
          </el-col>
          <el-col :span="5">
          </el-col>
        </el-row>
      </div>
      <div   style="margin-left: 25px">
        <div v-html="domain.contentZip"> </div>
      </div>
    </div>
  </div>
</template>

<script  lang="ts" setup>
import { reactive, ref } from 'vue'
//接受参数
import { useRoute ,useRouter}  from "vue-router";  // 引用vue-router

const draftElementStatus = new Map([
  [0, "草稿"],
  [1, "待审核"],
  [3, "审核不通过"],
  [2, "通过审核"],
  [4, "删除"]
]);

//基本信息
interface WorldElement {
  id:String,
  wid:String,
  title:string,
  intro:String,
  softtype: number,
  updateTime:String,
  categoryList:Category[],
  contentList:Content[]
}
interface Content {
  id: number
  title: string
  status: number,
  content: string,
}
interface Category{
  label: string
  value: string
}
const element = defineProps<WorldElement>()
</script>

<style scoped>

.smallTitle{
  background: inherit;
  background-color: rgba(249, 249, 249, 1);
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(233, 233, 233, 1);
  border-radius: 0px;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.smallTitle h3{
  font-family: 'PingFangSC-Semibold', 'PingFang SC Semibold', 'PingFang SC', sans-serif;
  font-weight: 650;
  font-size: 18px;
}

</style>
