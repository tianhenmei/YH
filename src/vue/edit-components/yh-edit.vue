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
                <font-size v-if="!without || !without['font-size']" 
                    :options="style"></font-size>
                <width v-if="!without || !without['width']" 
                    :options="style"></width>
                <height v-if="!without || !without['height']" 
                    :options="style"></height>
                <line-height v-if="!without || !without['line-height']" 
                    :options="style"></line-height>
                <color  v-if="!without || !without['color']"
                    @setValue="setValue" 
                    @setChangeStatus="setChangeStatus" 
                    :options="{'style':style,mold:'color',stylename:'color',name:'文本'}"></color>
                <color  v-if="!without || !without['background-color']"
                    @setValue="setValue" 
                    @setChangeStatus="setChangeStatus" 
                    :options="{'style':style,mold:'color',stylename:'background-color',name:'背景'}"></color>
                <yh-edit-image v-if="!without || !without['image']" 
                    :options="{'style':style,mold:mold}"></yh-edit-image>
                <border v-if="!without || !without['border']"
                    @setValue="setValue" 
                    @setChangeStatus="setChangeStatus"
                    :options="style"
                    ></border>
                <box-shadow v-if="!without || !without['box-shadow']" 
                    :options="style" @setChangeStatus="setChangeStatus"></box-shadow>
            </div>
            <div class="yh-edit-tab-content yh-edit-event clearfix" slot="content1">
                 <yh-edit-event :event="event" @setEventValue="setEventValue"></yh-edit-event>
            </div>
            <div class="yh-edit-tab-content yh-edit-status clearfix" slot="content2">
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
    // import MW from '../components/bus.js'
    // import {Execute} from '../components/text-dom.js'
    // import Editor from '../components/editor.js'

    // edit-components
    import YHEditInput from './yh-edit-input'
    import YHEditOptions from './yh-edit-options'
    import YHEditEvent from './yh-edit-event'
    import fontSize from './font-size'
    import width from './width'
    import height from './height'
    import lineHeight from './line-height'
    import borderWidth from './border-width'
    import borderStyle from './border-style'
    import color from './yh-edit-color'
    import border from './border'
    import boxShadow from './box-shadow'
    import YHEditImage from './yh-edit-image'
    import YHEditTab from './yh-edit-tab'
    // debugger
    export default {
        components:{
            'yh-edit-input':YHEditInput,
            'yh-edit-options':YHEditOptions,
            'yh-edit-event':YHEditEvent,
            'font-size':fontSize,
            'width':width,
            'height':height,
            'line-height':lineHeight,
            'border-width':borderWidth,
            'border-style':borderStyle,
            'color':color,
            'border':border,
            'box-shadow':boxShadow,
            'yh-edit-image':YHEditImage,
            'yh-edit-tab':YHEditTab
        },
        props:['props','mold','without'],
        data(){
            let self = this
            this.getBoxShadow()
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
            setValue(name,value,designValue,status = true){
                if(status){
                    let elem = $('.setting'),
                        content = elem.find('.kitty-button-content'),
                        button = elem.find('.yh-button')
                    
                    button.css(name,value)
                    this.style[name] = designValue
                    // 更新pages
                    // MW.bus.$emit(
                    //     'updateContent',
                    //     button.html(),
                    //     Execute.getStyleJSON(button[0].style.cssText),
                    //     this.$el.id
                    // )
                }else{
                    this.style[name] = designValue
                }
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
            getBoxShadow(){
                if(this.props['box-shadow-x'] == undefined){
                    switch(this.props['box-shadow']){
                        case 'none':
                            this.props['box-shadow-x'] = 0
                            this.props['box-shadow-y'] = 0
                            this.props['box-shadow-blur'] = 0
                            this.props['box-shadow-color'] = 'transparent'
                            break
                        default:
                            let color = this.props['box-shadow'].match(/(rgb[a]{0,1}\([\d, .]*\))/g),
                                all = [],
                                i = 0,j = 0
                            if(color){
                                this.props['box-shadow-color'] = color[0]
                                all = this.props['box-shadow'].split(/(rgb[a]{0,1}\([\d, .]*\))/g)[2].trim().split(/ /g),
                                j = 1
                            }else{
                                all = this.props['box-shadow'].split(/ /g)
                            }
                            for(i = 0; i < all.length; i++){
                                if(all[i] != ''){
                                    switch(j){
                                        case 0:
                                            this.props['box-shadow-color'] = all[i]
                                            break
                                        case 1:
                                            this.props['box-shadow-x'] = parseFloat(all[i])
                                            break
                                        case 2:
                                            this.props['box-shadow-y'] = parseFloat(all[i])
                                            break
                                        case 3:
                                            this.props['box-shadow-blur'] = parseFloat(all[i])
                                            break
                                        default:
                                            j--
                                            break
                                    }
                                    j++
                                }
                            }
                            break
                    }
                }
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