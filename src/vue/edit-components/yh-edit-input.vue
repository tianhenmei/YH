<!-- options
    isChild  是否某一个子集 ，true 则没有类名 yh-edit-options
    mold 判断当前的input是不是某个类型的元素，比如color
    withoutText 判断是否需要介绍文案，true：不需要，默认false
    name  此设置项的中文名
    type  input的类型，如：text、number等
    style  input 的值，从组件继承下来，是一个对象
    stylename  当前input对应的样式值，如width、height、color等
    unit  展示给编辑人员的数字单位，通常px
    realunit   实际的数据单位，通常为rem
-->
<template>
    <div class="yh-edit-input clearfix"
        :class="(options.isChild ? '' : 'yh-edit-options') + 
                ' yh-edit-' + options.stylename +
                (options.mold ? ' yh-edit-'+options.mold : '')">
        
        <div class="yh-edit-text" v-if="!options.withoutText">{{options.name}}{{options.name ? ': ' : ''}}</div>
        <div class="yh-edit-value clearfix">
            <input
                :type="options.type"
                :value="options.style[options.stylename] ? getDesignValue : (options.type == 'number' ? 0 : '')"
                @input="setValue"
            />
            <span>{{options.unit}}</span>
        </div>
        <slot name="chooser"></slot>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    export default {
        data(){
            return {}
        },
        props:['options','type'],
        computed:mapState({
            getDesignValue(state){
                let actualValue = this.options.style[this.options.stylename]
                if(this.options.type === 'number'){
                    let value = parseFloat(actualValue)
                    if(this.options.unit === this.options.realunit){
                        return value
                    }
                    return this.getDesign(value)
                }
                return actualValue
            }
        }),
        methods:{
            getDesign(value){
                return value * (750 / 16)
            },
            getRemValue(value){
                return value / (750 / 16)
            },
            setValue(e){
                let target = e.target,
                    value = target.value,   // // 展示出来的字体大小（针对750的宽）
                    unit = this.options.unit ? this.options.unit : '',
                    realunit = this.options.realunit ? this.options.realunit : '',
                    stylename = this.options.stylename,
                    actualValue = unit == realunit ? (value + realunit) : (this.getRemValue(parseFloat(value)) + realunit)
                
                // actualValue : 实际上使用的值
                // value : 展示用的值 （designValue）
                // this.$emit('setValue',stylename,actualValue,value)
                if(this.type){
                    this.$emit('setValue',
                        stylename,
                        actualValue,
                        value,
                        this.type.index
                    )
                }else{
                    this.$store.commit('setValue',{
                        stylename:stylename,
                        actualValue:actualValue,
                        designValue:value
                    })
                    if(this.options.backstatus){
                        this.$emit('setValue',stylename,actualValue,value)
                    }
                }
            }
        }
    }
</script>

<style>
    .yh-edit-input {
        width:100px;
        position:relative;
    }
    .yh-edit-input .yh-edit-text{
        width: 30px;
        height: 20px;
        line-height: 20px;
        float:left;
        text-align:left;
        font-size:12px;
        color:#666;
        /*background: #fff;*/
    }
    .yh-edit-input .yh-edit-value{
        width:65px;
        /*background: #fff;*/
        float:left;
    }
    .yh-edit-input .yh-edit-value input {
        width: 45px;
        height: 20px;
        line-height: 20px;
        border:none;
        float:left;
        font-size: 12px;
        color: #666;
        background: transparent;
    }
    .yh-edit-input .yh-edit-value span {
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        font-size: 12px;
        color: #666;
        float:left;
    }




    .yh-edit-options > .yh-edit-input{
        float:left;
    }


    .yh-edit-box-shadow-blur {
        width:82px;
    }
    .yh-edit-box-shadow-y {
        width:65px;
    }
    .yh-edit-box-shadow-x {
        width:105px;
    }
    .yh-edit-box-shadow-x .yh-edit-text {
        width:55px;
    }
    .yh-edit-box-shadow-blur .yh-edit-text{
        width:32px;
    }
    .yh-edit-box-shadow-y .yh-edit-text{
        width:15px;
    }
    .yh-edit-box-shadow-blur .yh-edit-value,
    .yh-edit-box-shadow-y .yh-edit-value,
    .yh-edit-box-shadow-x .yh-edit-value {
        width:50px;
    }
    .yh-edit-box-shadow-blur .yh-edit-value input,
    .yh-edit-box-shadow-y .yh-edit-value input,
    .yh-edit-box-shadow-x .yh-edit-value input{
        width:30px;
    }
    .yh-edit-box-shadow-blur .yh-edit-value span,
    .yh-edit-box-shadow-y .yh-edit-value span,
    .yh-edit-box-shadow-x .yh-edit-value span{
        width:15px;
    }

    .yh-edit-href {
        width: 100%;
        height: 30px;
        line-height: 30px;
    }
    .yh-edit-href .yh-edit-text {
        height: 28px;
        line-height: 28px;
    }
    .yh-edit-href .yh-edit-value input {
        width: 330px;
        height: 30px;
        line-height: 30px;
        border: 1px solid #ccc;
    }
</style>