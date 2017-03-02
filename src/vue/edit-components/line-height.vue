<template>
    <yh-edit-input @setValue="setValue" :options="optionsData"></yh-edit-input>
</template>
<script>
    import YHEditInput from './yh-edit-input.vue'
    export default {
        components:{
            'yh-edit-input':YHEditInput,
        },
        props:['options'],
        data(){
            return {
                optionsData:{
                    name:'行高',
                    stylename:'line-height',
                    unit:'px',
                    realunit:'rem',
                    type:'number',
                    style:this.options
                }
            }
        },
        methods:{
            setValue(name,actualValue,designValue){
                this.$emit('setValue',name,actualValue,designValue)
            }
        }
    }
</script>
<style>
    .yh-edit-line-height{
        width:115px;
    }
    .yh-edit-line-height .yh-edit-text {
        width:45px;
    }
</style>