<template>
    <div>
        <div class="box">
            <div class="oneDiv iconBox">
                <a href="#" target="_blank" rel="noopener" previewlistener="true"><img src="https://www.vincdesign.com/wp-content/uploads/2021/04/fb-1.png" width="24px"></a>
                <a href="#" target="_blank" rel="noopener" previewlistener="true"><img src="https://www.vincdesign.com/wp-content/uploads/2021/04/ig-1.png" width="24px"></a>
            </div>
            <div class="oneDiv textBox">
                <h3 class="widget-title"> <router-link to="/about" previewlistener="true">CONTACT US</router-link></h3>
                <div class="cLocate">
                    <a href="https://www.vincdesign.com/" previewlistener="true">Branding Agency Hong Kong</a> / <a href="https://www.vincdesign.com/" previewlistener="true">Creative Agency Hong Kong</a>
                </div>
             
                <div class="myEmail">
                    <a href="#">info@vincdesign.com</a>
                </div>
                <div class="copyright">Copyright VINCDESIGN. All rights reserved.</div>
            </div>
            <div class="oneDiv">
                <h3 class="widget-title"><router-link to="/about" previewlistener="true">联系我们</router-link></h3>
                <div class="myEmail">
                    <a href="#">info@vincdesign.com</a>
                </div>
                <div class="copyright">© VINCDESIGN  版权所有 不得转载</div>
            </div>
        </div>

        <div class="bottomBox">
                <a href="https://www.vincdesign.com/zh-hant/portfolio-cat/branding-logo-zht/" previewlistener="true">品牌設計案例 | 商標設計推薦</a>
        </div>
    </div>
</template>

<script>
export default{
    name: 'myFootComponent',
    
}

</script>
<style scoped>
div{
    color: white;
}

.box{
    display: flex;
    height: 300px;
    background-color: black;

}
.oneDiv{
    flex: 1;
    text-align: left;
    align-content: center;

}

.iconBox{
    margin-left: 18px;
    display: flex;
    gap: 40px;
    justify-content: center;
    align-items: center;
}
.textBox{
    text-align: center;
    flex: 2;
    
}
.cLocate,
.myEmail,
.copyright {
    margin: 5px 0;
}
.bottomBox{
    text-align: right;
    margin-right: 20px;
    margin-bottom: 20px;
}
</style>