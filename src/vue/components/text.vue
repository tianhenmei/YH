<template>
    <div kitty-text>
        <div class="kitty-text-content">
            {{props.content}}
        </div>
    </div>
</template>
<script>
    export default {
        props:['props'],
        initCtor(options,that){
            options = options || {}
            return {
                content: options.content || "It's a test."
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