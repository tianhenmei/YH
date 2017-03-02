<template>
    <div class="yh-edit-options yh-edit-border clearfix">
        <border-width :options="options" @setValue="setBorderWidth"></border-width>
        <yh-edit-color 
            :options="color"
            @setValue="setBorderColor" 
            @setChangeStatus="setChangeStatus" ></yh-edit-color>
        <border-style :options="options" @setValue="setBorderStyle"></border-style>
        <yh-edit-input :options="radius" @setValue="setRadius"></yh-edit-input>
    </div>
</template>
<script>
    import YHEditColor from '../edit-components/yh-edit-color.vue'
    import borderWidth from '../edit-components/border-width.vue'
    import borderStyle from '../edit-components/border-style.vue'
    import YHEditInput from './yh-edit-input.vue'
    export default {
        components:{
            'yh-edit-color':YHEditColor,
            'border-width':borderWidth,
            'border-style':borderStyle,
            'yh-edit-input':YHEditInput,
        },
        props:['options'],
        data(){
            return {
                color:{
                    name:'边框',
                    mold:'color',
                    stylename:'border-color',
                    style:this.options,
                    isChild:true
                },
                radius:{
                    name:'圆角',
                    stylename:'border-radius',
                    unit:'px',
                    realunit:'px',
                    value:0,
                    type:'number',
                    isChild:true,
                    style:this.options
                },
                changeStatus:false
            }
        },
        methods:{
            setBorderWidth(name,value,designValue){
                this.setValue(name,value)
            },
            setBorderColor(name,value,designValue){
                this.setValue(name,value)
            },
            setBorderStyle(name,value,designValue){
                this.setValue(name,value)
            },
            setChangeStatus(status){
                this.changeStatus = true
                this.$emit('setChangeStatus',true)
            },
            setValue(name,value){
                this.$emit('setValue',name,value,value)
            },
            setRadius(name,value,designValue){
                this.$emit('setValue',name,value,value)
            }
        }
    }
</script>
<style>
    .yh-edit-options .yh-edit-border-style,
    .yh-edit-options .yh-edit-border-color,
    .yh-edit-options .yh-edit-border-width{
        float:left;
    }
    .yh-edit-border-width {
        width:90px;
    }
    .yh-edit-border-width .yh-edit-value{
        width: 40px;
    }
    .yh-edit-border-width .yh-edit-value input{
        width:25px;
    }
    .yh-edit-border-width .yh-edit-value span{
        width:15px;
    }


    .yh-edit-border-radius{
        width:115px;
    }
    .yh-edit-border-radius .yh-edit-text{
        width:45px;
    }
</style>