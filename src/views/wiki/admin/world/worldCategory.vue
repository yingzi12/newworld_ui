 <template>
        <!--        标题-->
     <AdminHead :head-type="4" :wid="wid" :wname="wname"></AdminHead>
     <div style="background-color:#b0c4de;margin: auto;padding: 10px">
         <el-row>
             <el-col :span="20">
<!--                 <el-tree-select v-model="queryParams.types" :data="dataStree" check-strictly :render-after-expand="false" clearable />-->
<!--                 <el-input v-model="queryParams.title" placeholder="请输入元素名" class="input-with-select" style="width: 250px"/>-->
<!--                 <el-button :icon="Search" circle @click="getList(1)"/>-->
             </el-col>
             <el-col :span="4" style="text-align: right;">
                 <div style="text-align: right; font-size: 12px" class="toolbar">
                     <el-button text @click="disForm(true)">添加一级分类</el-button>
                 </div>
             </el-col>
         </el-row>
     </div>

   <!--   内容区-->
        <div style="  border-style: solid; border-width: 1px;border-color:#CFD3DC">
<!--          <div>-->
<!--            <el-button  text @click="disForm(true)">添加一级分类</el-button>-->
<!--          </div>-->
          <div class="custom-tree-container">
            <el-tree
                :data="dataSource"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                :render-content="renderContent"
            />
          </div>

          <!-- Form -->
          <el-dialog v-model="dialogFormVisible" :title="title">
            <el-form :model="form"
                     ref="ruleFormRef"  @submit.native.prevent>
              <el-form-item label="名称" >
                <el-input v-model="form.label" autocomplete="off" />
              </el-form-item>
              <el-input type="hidden" v-model="form.tier"></el-input>
              <el-input type="hidden" v-model="form.id"></el-input>
              <el-input type="hidden" v-model="form.pid"></el-input>
              <el-input type="hidden" v-model="form.code"></el-input>
              <el-input type="hidden" v-model="form.pcode"></el-input>
              <el-input type="hidden" v-model="form.wid"></el-input>
              <el-input type="hidden" v-model="form.isUpdate"></el-input>
            </el-form>
            <template #footer>
                 <span class="dialog-footer">
               <el-button @click="dialogFormVisible = false">取消</el-button>
               <el-button type="primary" @click="insertAfter(form.name,ruleFormRef)">确认</el-button>
                 </span>
            </template>
          </el-dialog>
        </div>

</template>

<script lang="ts" setup>
import AdminHead from './worldHead'
import {  reactive, ref, toRefs} from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { addCategory,updateCategory} from "@/api/admin/category";
import { getTree} from "@/api/wiki/category";
import {useRoute,useRouter} from "vue-router";
import {FormInstance} from "element-plus";
const fits = ['世界', '粉丝', '关注']
const activeIndex = ref('1')
const circleUrl=ref('')
const router = useRouter()


class World {
  id: number
  name: string
  types: string
  intro: string
  createTime:string
}
const data = reactive({
  form: {},
  rules: {
    label: [{ required: true, message: "分类名称不能为空", trigger: "blur" }]
  },
});

const { form, rules } = toRefs(data);
const ruleFormRef = ref<FormInstance>()
const title = ref("");

// 接收url里的参数
const route = useRoute();
//console.log(route.query.wid,"参数");


const wname = ref(route.query.wname);
const wid = ref(route.query.wid);
//console.log("世界id="+wid.value);
//世界信息
const world=ref({})
interface Tree {
  id: number
  code: number,
  label: string,
  pid: number,
  pcode: number,
  tier:number,
  wid:number,
  isUpdate:boolean,
  children?: Tree[]
}

const renderContent = (
    h,
    {
      node,
      data,
      store,
    }: {
      node: Node
      data: Tree
      store: Node['store']
    }
) => {
  return h(
      'div',
      {
        class: 'custom-tree-node',
        style:"width:100%;"
      },
      h('span', null, node.label),
      h(
          'div',
          {
            style:"float: right; "
          },
          h(
              'a',
              {
                style: 'margin-left: 8px;',
                onClick: () => append(data),
              },
              '添加子类'
          ),
          // h(
          //     'a',
          //     {
          //       style: 'margin-left: 8px;  ',
          //       onClick: () => remove(node, data),
          //     },
          //     '删除分类'
          // ),
          h(
              'b',
              {
                style: 'margin-left: 8px;  ',
                onClick: () => updateName(data),
              },
              '修改名称'
          )
      )
  )
}
//分类数据
const dataSource = ref<Tree[]>([])
//打开弹出框
const dialogFormVisible = ref(false)
//添加子集
const append = ( data: Tree) => {
  reset();
  title.value="添加子类"
  dialogFormVisible.value=true;
  let childlen=0
  if(data.children !=null && data.children != undefined){
    childlen=data.children.length
  }
  let cateCode=data.code*100+10+childlen
  const newChild = { id: 0,code:cateCode, label:'',  pcode:data.code,pid:data.id,tier:data.tier+1,wid:wid.value,children: [],isUpdate:false }
  if (!data.children) {
    data.children = []
  }
  form.value=newChild
  //console.log("from 子集"+JSON.stringify(form.value))

}
//修改名称
const updateName = ( data: Tree) => {
  reset();
  title.value="修改分类名称"
  dialogFormVisible.value=true
  data.isUpdate=true
  form.value=data
  //console.log("from 修改分类"+JSON.stringify(form.value))
}
//添加分类
const disForm=(dis:boolean)=>{
  reset();
  title.value="添加分类"
  dialogFormVisible.value=dis
  let cateCode=dataSource.value.length+10;
  const newTree = { id: 0, code:cateCode,label: '', pid:0,pcode:0,tier:0,wid:wid.value,children: [],isUpdate:false }
  form.value=newTree
  //console.log("from 添加分类 "+JSON.stringify(form.value))
}
//添加1级分类,并关闭弹出框
const insertAfter = (label:string,formEl: FormInstance | undefined) => {
  //console.log(formEl)
  //console.log("修改后"+JSON.stringify(form.value))
  submitForm(formEl)
  dialogFormVisible.value=false
}

const remove = (node: Node, data: Tree) => {
  const parent = node.parent
  const children: Tree[] = parent.data.children || parent.data
  const index = children.findIndex((d) => d.id === data.id)
  children.splice(index, 1)
  dataSource.value = [...dataSource.value]
}
/** 提交按钮 */
function submitForm(formEl: FormInstance | undefined) {   //
  form.value.wid=wid.value
  if (form.value.isUpdate){
    updateCategory(form.value).then(response => {
      alert("添加成功")
      getList();

    })
  }else{
    addCategory(form.value).then(response => {
      alert("添加成功")
      getList();

    })
  }

}
/** 重置新增的表单以及其他数据  */
function reset() {

  form.value = {
    label: undefined,
    tier: undefined,
    id: undefined,
    code: undefined,
    pid: undefined,
    pcode: undefined

  };
  // proxy.resetForm("roleRef");
}
/** 查询世界列表 */
function getList( ) {
  getTree(wid.value).then(response => {
    dataSource.value = response.data
  });
}
getList();

</script>

<style scoped>

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}


.custom-tree-node {
  flex: 1;
  display: flex;

  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
