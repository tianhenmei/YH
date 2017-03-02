<template>
    <yh-edit-options :options="optionsData" @setValue="setValue"></yh-edit-options>
</template>
<script>
    import YHEditOptions from './yh-edit-options.vue'
    export default {
        components:{
            'yh-edit-options':YHEditOptions,
        },
        props:['options'],
        data(){
            return {
                optionsData:{
                    name:'字体大小',
                    stylename:'font-size',
                    unit:'px',
                    realunit:'rem',
                    list:[24, 26, 28, 30, 36, 38, 40, 42, 44, 46, 48, 60, 72, 96, 108, 120],
                    realList:[0.512, 0.5546666666666666, 0.5973333333333334, 0.64, 0.768, 
                            0.8106666666666666, 0.8533333333333334, 0.896, 0.9386666666666666,
                            0.9813333333333333, 1.024, 1.28, 1.536, 2.048, 2.304, 2.56],
                    style:this.options
                }
            }
        },
        methods:{
            setValue(name,value){
                this.$emit('setValue',name,value)
            }
        }
    }
</script>

<style>
    
</style>