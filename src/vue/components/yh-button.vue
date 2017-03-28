<template>
    <div :id="props.id" :style="props.position" :class="props.classname" kitty-button  
        @mouseenter.stop.prevent="showEditLayer" 
        @mouseleave.stop.prevent="hideEditLayer"
        @click="addSetting" >
        <div class="kitty-button-content" rotate contenteditable="true" 
            :style="props.rotate"
            @input="contentChange">
            <div class="yh-button" 
                :src="props.src" 
                :style="props.style" v-html="props.content"></div>
            <a :class="{'yh-button-href':props.href}" :href="props.href" target="_blank"></a>
        </div>
        <yh-edit 
            :props="props.style" 
            :mold="'bg'"
            @setChangeStatus="setChangeStatus"
        ></yh-edit>
    </div>
</template>
<script>
    import Editor from './editor.js'

    // edit-components
    import YHEdit from '../edit-components/yh-edit.vue'
    let baseData = {
        style:Editor.style,
        position:{
            left:0,
            top:0
        },
        rotate:{
            '-webkit-transform':'none',
            transform:'none'
        },
        content:'我是按钮',
    }
    export default {
        components:{
            'yh-edit':YHEdit
        },
        props:['props'],
        data(){
            let self = this
            return Object.assign({
                self:self,
                href:'',
                animation:'',
                changeStatus:false,
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
            hideEditLayer(e){
                if(!this.changeStatus){
                    let target = $(e.target).closest('[kitty-button]'),
                        button = target.find('.yh-button'),
                        page = target.closest('li[page]')

                    if(page.length > 0){

                    }else{
                        target.children('.yh-edit-layer').hide();
                    }
                }
            },
            contentChange(e){
                let content = $(e.target).children('.yh-button').html()
                this.$store.commit('setMultipleValue',[{
                    stylename:'content',
                    actualValue:content
                }])
            },
            addSetting(e){
                let target = $(e.target).closest('[kitty-button]')
                
                target.children('.yh-edit-layer').show();
                this.changeStatus = false
            },
            setEvent(name,value,designValue){
                let elem = $('.setting'),
                    content = elem.find('.kitty-button-content'),
                    button = elem.find('.yh-button')
                
                this.props.href = designValue
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
                rotate:{
                    '-webkit-transform':'none',
                    transform:'none'
                },
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
        background: #ff0084 no-repeat 0 0;
        background-size: 100%;
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
</style>