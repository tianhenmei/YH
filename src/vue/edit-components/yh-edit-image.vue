<template>
    <div class="yh-edit-options yh-edit-image">
        <input type="file" content="background-image" accept="image/*" :mold="options.mold" />
    </div>
</template>
<script>
    export default {
        props:['options'],
        data(){
            return {

            }
        }
    }
</script>
<style>
    .yh-edit-image {
        width: 20px;
        height: 20px;
        background: url(http://localhost:9000/static/images/icons.png) no-repeat -2px -194px;
    }
    .yh-edit-image input{
        width:20px;
        height:20px;
        display:block;
        opacity:0;
    }
</style>