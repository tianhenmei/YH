<template>
    <div :id="props.id" :style="props.position" :class="props.classname" kitty-button  
        @mouseenter.stop.prevent="showEditLayer" 
        @mouseleave.stop.prevent="hideEditLayer"
        @click="addSetting" >
        <div class="kitty-button-content" rotate contenteditable="true">
            <div class="yh-button" 
                :src="props.src" 
                :style="props.style" v-html="props.content"></div>
            <a :class="{'yh-button-href':props.href}" :href="props.href" target="_blank"></a>
        </div>
        <div class="yh-edit-layer clearfix">
            <yh-tab :props="editOptions">
                <div class="yh-edit-tab-content yh-edit-basic clearfix" slot="content0">
                    <font-size :options="style" @setValue="setValue"></font-size>
                    <width :options="style" @setValue="setValue"></width>
                    <height :options="style" @setValue="setValue"></height>
                    <line-height :options="style" @setValue="setValue"></line-height>
                    <color 
                        @setValue="setValue" 
                        @setChangeStatus="setChangeStatus" 
                        :options="{'style':style,mold:'color',stylename:'color',name:'文本'}"></color>
                    <color 
                        @setValue="setValue" 
                        @setChangeStatus="setChangeStatus" 
                        :options="{'style':style,mold:'color',stylename:'background-color',name:'背景'}"></color>
                    <yh-edit-image @setValue="setValue" :options="{'style':style,mold:'button'}"></yh-edit-image>
                    <border
                        @setValue="setValue" 
                        @setChangeStatus="setChangeStatus"
                        :options="style"
                        ></border>
                    <box-shadow :options="style" @setValue="setValue" @setChangeStatus="setChangeStatus"></box-shadow>
                </div>
                <div class="yh-edit-tab-content yh-edit-event clearfix" slot="content1">
                    <yh-edit-event :event="event" @setEventValue="setEventValue"></yh-edit-event>
                </div>
                <div class="yh-edit-tab-content yh-edit-animation clearfix" slot="content2">
                </div>
            </yh-tab>
        </div>
    </div>
</template>
<script>
    import MW from './bus.js'
    import {Execute} from './text-dom.js'
    import Editor from './editor.js'

    // ededit-components
    import YHEditInput from '../edit-components/yh-edit-input.vue'
    import YHEditOptions from '../edit-components/yh-edit-options.vue'
    import YHEditEvent from '../edit-components/yh-edit-event.vue'
    import fontSize from '../edit-components/font-size.vue'
    import width from '../edit-components/width.vue'
    import height from '../edit-components/height.vue'
    import lineHeight from '../edit-components/line-height.vue'
    import borderWidth from '../edit-components/border-width.vue'
    import borderStyle from '../edit-components/border-style.vue'
    import color from '../edit-components/yh-edit-color.vue'
    import border from '../edit-components/border.vue'
    import boxShadow from '../edit-components/box-shadow.vue'
    import YHEditImage from '../edit-components/yh-edit-image.vue'
    import YHtab from './tab.vue'

    let baseData = {
        style:Editor.style,
        position:{
            left:0,
            top:0
        },
        content:'我是按钮',
    }
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
            'yh-tab':YHtab
        },
        data(){
            let self = this
            return Object.assign({
                self:self,
                href:'',
                animation:'',
                changeStatus:false
            },JSON.parse(JSON.stringify(baseData)),{
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
            })
        },
        props:['props'],
        mounted(){
            
        },
        methods:{
            /*button***/
            showEditLayer(e){
                var target = $(e.target)
                if(target.hasClass('setting')){
                    target.children('.yh-edit-layer').show();
                    this.changeStatus = false
                }
            },
            addSetting(e){
                let target = $(e.target).closest('[kitty-button]')
                
                target.children('.yh-edit-layer').show();
                this.changeStatus = false
                

                if($(e.target).closest('.yh-edit-layer').length > 0){

                }else{
                    Editor.setEditData(this)
                }
            },
            hideEditLayer(e){
                if(!this.changeStatus){
                    let target = $(e.target).closest('[kitty-button]'),
                        button = target.find('.yh-button'),
                        page = target.closest('li[page]')

                    if(page.length > 0){

                    }else{
                        target.children('.yh-edit-layer').hide();
                        // 更新pages
                        MW.bus.$emit(
                            'updateContent',
                            button.html(),
                            Execute.getStyleJSON(button[0].style.cssText),
                            this.$el.id
                        )
                    }
                }
            },
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
                    MW.bus.$emit(
                        'updateContent',
                        button.html(),
                        Execute.getStyleJSON(button[0].style.cssText),
                        this.$el.id
                    )
                }else{
                    this.style[name] = designValue
                }
            },
            setEventValue(name,value,designValue){
                // let elemID = this.props.id
                switch(name){
                    case 'event-type':
                        // this.event.style[entype] = value
                        this.props[name] = value
                        this.props['entype'] = designValue
                        break
                    default:
                        this.props[name] = value
                        break
                }
                // this.$emit('setValue',name,value,designValue,elemID);
                // console.log('button: '+this.props['event-type'])
            },
            setChangeStatus(status){
                this.changeStatus = true
            }
        },
        initCtor(options,that){
            options = options || {}
            return {
                id:options.id ? options.id : '',
                style:Object.assign({},JSON.parse(JSON.stringify(Editor.style)),options.style ? options.style : {}),
                position:Object.assign({},JSON.parse(JSON.stringify(baseData.position)),options.position ? options.position : {}),
                content:'我是按钮',
                href:options.href ? options.href : '',
                'event-type':options['event-type'] ? options['event-type'] : '无',
                classname:options.classname ? options.classname : ''
            }
        }
    }
</script>
<style>
    [kitty-button]{
        position:absolute;
        left:0;
        top:0;
    }
    [kitty-button] .kitty-button-content{
        position:relative;
    }
    [kitty-button] .kitty-button-content .yh-button{
        width:300px;
        height:60px;
        line-height:60px;
        color:#fff;
        background:#ff0084;
        font-size:0.768rem;
        text-align:center;
    }
    [kitty-button] .kitty-button-content a {
        display:none;
    }
    [kitty-button] .kitty-button-content .yh-button-href{
        width:100%;
        height:100%;
        position:absolute;
        left:0;
        top:0;
    }
    [kitty-button] .kitty-button-content .yh-button-href {
        display:block;
    }
    [kitty-button] .kitty-button-content .yh-button {
        -webkit-user-select: none; 
        -moz-user-select: none;    
        -khtml-user-select: none;  
        -ms-user-select: none; 
        -o-user-select: none;
        user-select: none; 
    }
    [kitty-button] .yh-edit-layer{
        width:400px;
        display:none;
        position:absolute;
        left:50%;
        bottom:100%;
        margin:0 0 0 -200px;
        background:#fff;
    }

    [kitty-button] .yh-edit-layer .yh-edit-options{
        float:left;
    }
</style>