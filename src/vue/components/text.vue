<template>
    <div :id="props.id" :style="props.position" :class="props.classname" kitty-text>
        <div class="kitty-text-content">
            {{props.content}}
        </div>
        <div class="yh-edit-layer">
            
        </div>
    </div>
</template>
<script>
    export default {
        props:['props'],
        methods:{
            getRem(value){
                return value / (750 / 16) + 'rem';
            }
        },
        initCtor(options,that){
            options = options || {}
            return {
                id:options.id ? options.id : '',
                content: options.content || "It's a test.",
                position:{
                    left:0,
                    top:0
                },
                classname:options.classname ? options.classname : ''
            }
        }
    }
</script>
<style>
    [kitty-text] .kitty-text-content{
        width:150px;
        height:30px;
        line-height:30px;
        color:#666;
        text-align:center;
        font-size:14px;
    }
</style>