<template>
  <div class="root-wrap">
    <Modal title="IO-BOX" :draggable="true" :scrollable="true" footer-hide v-model="majorValue">
      <MajorBox @refreshURL="refreshIframe" :majorRoot="majorBro"/>
    </Modal>
    <span class="modal-btn" @click="majorValue=true">Call</span>
    <iframe :src="frameUrl" ref="iocIframe"
            name="iframe0" class="theMainIframe"
            frameborder="0" data-id="theIframe" seamless=""></iframe>
  </div>
</template>

<script>
    import MajorBox from './MajorBox'
    export default {
        name: "Home",
        components:{MajorBox },
        data(){
          return {
            frameUrl:'',
            theframe:null,
            majorValue:false,
            majorBro:null
          }
        },
        mounted () {
          this.majorBro = this;
        },
        methods:{
          refreshIframe(url){
            this.frameUrl = url;
          }
        }
    }
</script>

<style scoped>
  .root-wrap{
    position: relative;
    height: 100%;
    width: 100%;
  }
  .theMainIframe{
    width:100%;
    height:100%;
  }
  .modal-btn{
    position: fixed;
    top: 1rem;
    left: 1rem;
    background: grey;
    color:#fff;
    text-align: center;
    line-height: 3rem;
    cursor: pointer;
    border-radius: 50%;
    height: 4rem;
    width: 4rem;
    padding: 0.3rem;
  }
  .modal-btn:hover{
    background:#999;
    color:#000;
  }
</style>
