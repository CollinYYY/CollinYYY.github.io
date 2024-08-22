<template>
    <div>
        <myheadComponent textColor="white"></myheadComponent>
        <div class="design1">

        </div>
        <myFootComponent></myFootComponent>

    </div>
</template>

<script>
import myheadComponent from "../components/myheadComponent.vue";
import myFootComponent from "../components/myFootComponent.vue";

export default {
  name: 'Design1View',
  
  data(){
    return {


    }
  },
  components:{myheadComponent,myFootComponent},
  methods:{

  },
  

}
</script>

<style scoped>
.design1{
    padding: 20px 198px;
}
</style>