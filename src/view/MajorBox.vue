<template>
  <div class="box-wrap">
    <div class="box-header">
      <h1>IO-BOX</h1>
    </div>
    <div class="box-submenu">
          <span>
            UserName:{{userName}}
          </span>
      <span>Target:<select v-model="model_type">
            <option value="mind">mind</option>
            <option value="other">another</option>
          </select></span>
      <label>each option has its own methods</label>
    </div>
    <div class="box-submenu">
      URL:<input v-model="targetUrl" placeholder="请输入地址"/>
      <button @click="changeUrl">Go</button>
      <p>
        <label>back iframe update after url changed (Same as BaiDu as well)</label>
        <button @click="changeUrl('http://www.baidu.com')">BaiDu</button>
        <button @click="changeUrl('static/mindtool/index.html')">ReSet</button>
      </p>
    </div>
    <div class="box-content">
      <div class="box-con-left">
        <span class="box-con-btn" :class="{'box-con-btn-active':tabName==='load'}" @click="tabName='load'">load</span>
        <span class="box-con-btn" :class="{'box-con-btn-active':tabName==='save'}" @click="tabName='save'">save</span>
        <span class="box-con-btn">...</span>
      </div>
      <div class="box-con-right">
        <transition name="component-fade" mode="out-in">
          <div v-if="tabName==='load'">
            <button @click="file_list">search</button>
            <label>click to get the jsonFile list  from '/server/ioc_cache/mind/userId/...'</label>
            <div class="box-cr-fileList">
              <span v-if="fileList.length<=0">暂无数据</span>
              <p v-for="(fileItem,fileIndex) in fileList" :key="'file_'+fileIndex">
                <span>{{fileItem}}</span>
                <button class="box-cr-fileList-btn" @click="file_load(fileItem)">load</button>
              </p>
            </div>
          </div>
          <div v-else>
            <p>filename:<input v-model="curFile.name" placeholder="请输入文件名"/></p>
            <label>filename is required</label>
            <button @click="file_save">save</button>
          </div>
        </transition>
      </div>
    </div>
    <div class="box-footer">公司名称&reg;</div>
  </div>
</template>

<script>
  export default {
    name: "MajorBox",
    props:['majorRoot'],
    data(){
      return {
        userId:'',
        userName:'',
        targetUrl:'',
        model_type:'mind',
        fileList:[],
        tabName:'load',
        curFile:{
          name:'',
          content:''
        }
      }
    },
    created() {
      //  检测登陆状态
      let IOC_CACHE = JSON.parse(sessionStorage.getItem('IOC_CACHE'));
      if(((!!IOC_CACHE&&(!IOC_CACHE.userInfo))||(!IOC_CACHE))){
        //  未登录
        this.$router.push({name:'Login'});
      }else {
        //  已登陆
        this.userId = IOC_CACHE.userInfo._id;
        this.userName = IOC_CACHE.userInfo.username;
      }
    },
    mounted () {
      this.targetUrl = 'static/mindtool/index.html';
      this.$emit('refreshURL',this.targetUrl);
    },
    methods:{
      //  保存
      file_save () {
        if((!this.userId)||(!this.model_type)||(!this.curFile.name)){
          alert('缺失请求参数');
          return false
        }
        if(this.pathChecker(this.curFile.name)){
          return false
        }
        let THAT = this;
        let data = null;
        try{
          let vm = THAT.majorRoot;
          let json = vm.$refs['iocIframe'].contentWindow.MM.App.map.toJSON();
          data = vm.$refs['iocIframe'].contentWindow.MM.Format.JSON.to(json);
        }catch (e) {
          console.log(e.message||'json数据获取失败');
        }
        THAT.curFile.content = data;

        let theParam = {
          type:THAT.model_type,
          userId:THAT.userId,
          fileModel:{
            name:THAT.curFile.name+'.json',
            content:THAT.curFile.content
          }
        };
        if(THAT.curFile.name!==''&&THAT.curFile.content!==''){
          THAT.$api.file.ioc_file_pre_save(theParam).then(res=>{
            if(res.data.status===10001){
              //  文件已存在-是否覆盖
              let pre_overwrite = confirm(res.data.msg);
              if(pre_overwrite){
                THAT.$api.file.ioc_file_overwrite(theParam).then(res2=>{
                  alert(res2.data.msg);
                })
              }
            }else {
              //  新文件读写
              alert(res.data.msg);
            }
          })
        }else {
          alert('保存参数不能为空');
        }
      },
      //  加载
      file_load (fileItem) {
        if((!this.userId)||(!this.model_type)||(!fileItem)){
          alert('缺失请求参数');
          return false
        }
        if(this.pathChecker(fileItem.replace('.json',''))){
          return false
        }
        let THAT = this;
        THAT.$api.file.ioc_file_load({
          readPath:`/${THAT.model_type}/${THAT.userId}/${fileItem}`
        }).then(res=>{
          alert(res.data.msg);
          if(res.data.status==0){

            try{
              let vm = THAT.majorRoot;
              let data = res.data.content.content;
              // let json = JSON.stringify(res.data.content);
              let json =  vm.$refs['iocIframe'].contentWindow.MM.Format.JSON.from(data);
              vm.$refs['iocIframe'].contentWindow.MM.UI.Backend._loadDone(json);
              alert('载入成功！');
            }catch (e) {
              console.log(e.message||'json数据载入失败');
            }
          }
        })
      },
      //  列表
      file_list () {
        if((!this.userId)||(!this.model_type)){
          alert('缺失接口参数');
          return false
        }
        let THAT = this;
        THAT.fileList = [];
        THAT.$api.file.ioc_file_list({
          userPath:`/${THAT.model_type}/${THAT.userId}`
        }).then(res=>{
          alert(res.data.msg);
          if(res.data.status==0){
            THAT.fileList = res.data.list
          }
        })
      },
      //  路径参数正则校验
      pathChecker (value) {
        let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
          regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
        if(regEn.test(value) || regCn.test(value)) {
          alert("名称不能包含特殊字符");
          return true;
        }
        return false
      },
      //  更换地址
      changeUrl (url=null) {
        let checker = true;   //  地址正则校验
        if(checker){
          this.$emit('refreshURL',url?url:this.targetUrl);
        }
      }
    }
  }
</script>

<style scoped>
  button{
    cursor: pointer;
  }

  .box-wrap{
    background: grey;
    height: 100%;
  }
  .box-header,.box-footer{
    width: 100%;
    height: max-content;
    padding: 1rem 0;
    background: #555555;
    color: #fff;
    text-align: center;
  }
  .box-submenu{
    padding: 0.6rem;
    border-bottom: 1px solid #eee;
    color: #fff;
  }
  .box-content{
    display: flex;
    flex-direction: row;
    overflow: auto;
  }
  .box-con-left{
    width: 80px;
  }
  .box-con-btn{
    cursor: pointer;
    display: block;
    padding: 0.6rem;
    text-align: center;
    background: #555;
    color: #fff;
    transition:all 0.25s ease-in-out;
  }
  .box-con-btn-active{
    background: #efefef;
    color: #555;
    box-shadow: 0 0 7px 2px #333;
  }
  .box-con-right{
    width: 100%;
    padding: 1rem;
    background: #efefef;
  }
  .box-cr-fileList{
    margin-top: 0.4rem;
    padding: 0.4rem 0;
    border: 1px solid #333;
    box-sizing: border-box;
  }
  .box-cr-fileList p{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 4px;
    transition: 0.25s ease-in-out;
  }
  .box-cr-fileList p:hover{
    background: #555555;
    color: #fff;
  }


  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .3s ease;
  }
  .component-fade-enter, .component-fade-leave-to {
    opacity: 0;
  }
</style>
