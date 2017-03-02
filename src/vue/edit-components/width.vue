<template>
    <yh-edit-input :options="optionsData" @setValue="setValue"></yh-edit-input>
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
                    name:'宽',
                    stylename:'width',
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
