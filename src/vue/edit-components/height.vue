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
                    name:'高',
                    stylename:'height',
                    unit:'px',
                    realunit:'rem',
                    type:'number',
                    style:this.options
                }
            }
        },
        methods:{
            setValue(name,value,designValue){
                this.$emit('setValue',name,value,designValue)
            }
        }
    }
</script>
