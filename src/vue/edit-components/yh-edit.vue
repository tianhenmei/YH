<!-- yh-edit  用于基础设置、事件设置、动画设置
    基础设置目前包括：font-size
                   width
                   height
                   line-height
                   color
                   background-color
                   image(不区分是src还是背景图，但传参时通过mold区分，mold="src" || mold ="bg")
                   border
                   box-shadow
    事件设置
    动画设置
    参数如下：
        props：包括组件的基本样式
        mold: 针对设置项图片的设置  mold="src" || mold ="bg"
        without：当前不需要那些设置，不需要为true，没有可不传
-->
<template>
    <div class="yh-edit-layer clearfix">
        <yh-edit-tab :props="editOptions">
            <div class="yh-edit-tab-content yh-edit-basic clearfix" slot="content0">
                <yh-edit-base 
                    :props="props" :mold="mold" :without="without"
                    @setChangeStatus="setChangeStatus"></yh-edit-base>
            </div>
            <div class="yh-edit-tab-content yh-edit-event clearfix" slot="content1">
                 <yh-edit-event :event="event" @setEventValue="setEventValue"></yh-edit-event>
            </div>
            <div class="yh-edit-tab-content yh-edit-status clearfix" slot="content2">
                <yh-edit-state 
                    :props="states" :mold="mold" :without="without"
                    @setChangeStatus="setChangeStatus"></yh-edit-state>
            </div>
            <div class="yh-edit-tab-content yh-edit-animation clearfix" slot="content3">
            </div>
        </yh-edit-tab>
        <div class="yh-delete-undo">
            <div class="yh-delete" @click.stop="removeElement">x</div>
            <div class="yh-undo" @click.stop="undoElement">√</div>
        </div>
    </div>
</template>
<script>
    // edit-components
    import YHEditTab from './yh-edit-tab'
    import YHEditBase from './yh-edit-base'
    import YHEditEvent from './yh-edit-event'
    import YHEditState from './yh-edit-state'
    // debugger
    export default {
        components:{
            'yh-edit-tab':YHEditTab,
            'yh-edit-base':YHEditBase,
            'yh-edit-event':YHEditEvent,
            'yh-edit-state':YHEditState
        },
        props:['props','mold','without','states'],
        data(){
            let self = this
            return {
                href:'',
                animation:'',
                changeStatus:false,
                style:this.props,
                editOptions:{
                    position:{},
                    style:{},
                    classname:'yh-edit-tab',
                    base:{
                        tabs:[{
                            title:'基础设置'
                        },{ 
                            title:'事件设置'
                        },{ 
                            title:'状态设置'
                        },{
                            title:'动画设置'
                        }]
                    }
                },
                event:{
                    style:{
                        'event-type':'无',
                        'entype':'none'
                    },
                    real:this.props
                },
            }
        },
        methods:{
            setEvent(name,value,designValue){
                let elem = $('.setting'),
                    content = elem.find('.kitty-button-content'),
                    button = elem.find('.yh-button')
                
                this.props.href = designValue
            },
            setEventValue(name,value,designValue){
                switch(name){
                    case 'event-type':
                        this.props[name] = value
                        this.props['entype'] = designValue
                        break
                    default:
                        this.props[name] = value
                        break
                }
            },
            setChangeStatus(status){
                this.changeStatus = true
                this.$emit('setChangeStatus',true)
            },
            removeElement(e){
                var elem = $('.setting'),
                    elemID = elem.attr('id');
                this.$store.commit('removeElement',elemID)
                $('.yh-selection').hide()
            },
            undoElement(e){
                $('.setting').removeClass('setting')
                $('.yh-selection').hide()
            }
        }
     }
</script>
<style>
    [kitty-image] .yh-edit-layer,
    [kitty-button] .yh-edit-layer{
        width:400px;
        display:none;
        position:absolute;
        left:50%;
        bottom:100%;
        margin:0 0 0 -200px;
        background:#fff;
    }
    [kitty-image] .yh-edit-layer .yh-edit-options,
    [kitty-button] .yh-edit-layer .yh-edit-options{
        float:left;
    }
    .yh-delete-undo{
        width:45px;
        height:17px;
        position:absolute;
        right:0;
        top:3px;
        font-family: serif;
    }
    .yh-delete-undo .yh-delete,
    .yh-delete-undo .yh-undo {
        width: 17px;
        height: 17px;
        line-height: 17px;
        border: 1px solid #ff0084;
        border-radius: 17px;
        font-size: 12px;
        text-align: center;
        color: #ff0084;
        cursor: pointer;
        float:left;
        margin:0 3px 0 0;
    }
    .yh-delete-undo .yh-delete {
        font-family: initial;
    }
</style>