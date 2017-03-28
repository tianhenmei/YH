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
            setValue(name,actualValue,designValue){
                this.$store.commit('setValue',{
                    stylename:name,
                    actualValue:actualValue,
                    designValue:designValue
                })
                this.optionsData.style[name] = this.options[name]
                // this.$emit('setValue',name,value,designValue)
            }
        }
    }
</script>
