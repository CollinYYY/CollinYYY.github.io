<template>
<div>
    <headComponentWithQuote textColor="#000"></headComponentWithQuote>
    <div class="team"></div>
    <myFootComponent></myFootComponent>
</div>
</template>

<script>
import myFootComponent from "../components/myFootComponent.vue";
import headComponentWithQuote from "../components/headComponentWithQuote.vue"
export default{
    name: 'TeamView',

    data(){
        return{

        }
    },
    components:{headComponentWithQuote,myFootComponent},
    methods:{

    },
}
</script>

<style scoped>
.team{
    padding: 20px 198px;
    height:700px;
}
</style>