<template>
	<view>
	
	    <view class="sub-nav">
	        <navigator url="/pages/index/index" class="sn1">首页</navigator>
	        <navigator url="/pages/map/map" class="sn2">地图</navigator>    
	        <navigator url="/pages/ana_images/ana_images" class="sn3">上传</navigator>
	        <navigator url="/pages/wode/wode" class="sn4">我的</navigator>
	    </view>
	</view>
</template>

<script>
	import "E:/WEB_Develop/bird/bird/src/static/css/normalize.css";
	import "E:/WEB_Develop/bird/bird/src/static/css/index.css";
	

	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
@font-face {
    font-family: 'icomoon';
    src:  url('../../static/fonts/icomoon.eot?e068fy');
    src:  url('../../static/fonts/icomoon.eot?e068fy#iefix') format('embedded-opentype'),
      url('../../static/fonts/icomoon.ttf?e068fy') format('truetype'),
      url('../../static/fonts/icomoon.woff?e068fy') format('woff'),
      url('../../static/fonts/icomoon.svg?e068fy#icomoon') format('svg');
    font-weight: normal;
    font-style: normal;
    font-display: block;
}

</style>