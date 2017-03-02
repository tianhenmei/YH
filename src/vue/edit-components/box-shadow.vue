<template>
    <div class="yh-edit-options yh-edit-shadow clearfix">
        <yh-edit-input @setValue="setX" :options="list.x"></yh-edit-input>
        <yh-edit-input @setValue="setY" :options="list.y"></yh-edit-input>
        <yh-edit-input @setValue="setBlur" :options="list.blur"></yh-edit-input>
        <yh-edit-color 
            @setValue="setValue" 
            @setChangeStatus="setChangeStatus" 
            :options="shadowColor"></yh-edit-color>
    </div>
</template>
<script>
    import YHEditInput from './yh-edit-input.vue'
    import YHEditColor from './yh-edit-color.vue'
    export default {
        components:{
            'yh-edit-input':YHEditInput,
            'yh-edit-color':YHEditColor
        },
        props:['options'],
        data(){
            return {
                list:{
                    x:{
                        name:'阴影：x',
                        stylename:'box-shadow-x',
                        unit:'px',
                        realunit:'px',
                        type:'number',
                        isChild:true,
                        style:this.options
                    },
                    y:{
                        name:'y',
                        stylename:'box-shadow-y',
                        unit:'px',
                        realunit:'px',
                        type:'number',
                        isChild:true,
                        style:this.options
                    },
                    blur:{
                        name:'blur',
                        stylename:'box-shadow-blur',
                        unit:'px',
                        realunit:'px',
                        type:'number',
                        isChild:true,
                        style:this.options
                    }
                },
                shadowColor:{
                    name:'',
                    mold:'color',
                    stylename:'box-shadow-color',
                    chinese:'',
                    isChild:true,
                    style:this.options,
                },
                changeStatus:false
            }
        },
        watch:{
            // boxShadow:{
            //     handler(nvalue,ovalue){   // ovalue ：旧值   nvalue ： 新值
            //         console.log(ovalue+' , '+nvalue)
            //     },
            //     deep: true
            // }
        },
        methods:{
            setChangeStatus(status){
                this.changeStatus = true
                this.$emit('setChangeStatus',true)
            },
            setValue(name,value,designValue){
                this.shadowColor.value = value
                this.$emit('setValue',name,value,value,false)
                this.setShadow(value)
                // this.$emit('setValue',name,value,designValue)
            },
            setX(name,value,designValue){  // value = designValue
                this.list.x.value = value
                this.$emit('setValue',name,value,value,false)
                this.setShadow(value)
            },
            setY(name,value,designValue){
                this.list.y.value = value
                this.$emit('setValue',name,value,value,false)
                this.setShadow(value)
            },
            setBlur(name,value,designValue){
                this.list.blur.value = value
                this.$emit('setValue',name,value,value,false)
                this.setShadow(value)
            },
            setShadow(value){
                let last = 
                    (/(px)/g.test(this.options['box-shadow-x'] + '') ? this.options['box-shadow-x'] : this.options['box-shadow-x'] + 'px') + ' ' + 
                    (/(px)/g.test(this.options['box-shadow-y'] + '') ? this.options['box-shadow-y'] : this.options['box-shadow-y'] + 'px') + ' ' + 
                    (/(px)/g.test(this.options['box-shadow-blur'] + '') ? this.options['box-shadow-blur'] : this.options['box-shadow-blur'] + 'px') + ' ' + 
                    this.options['box-shadow-color']
                
                this.$emit('setValue','box-shadow',last,last)
            },
        }
    }
</script>
