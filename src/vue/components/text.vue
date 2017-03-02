<template>
    <div :id="props.id" 
            :style="props.position" 
            :class="props.classname" kitty-text 
            @mouseenter.stop.prevent="showEditLayer" 
            @mouseleave.stop.prevent="hideEditLayer">
        <div class="kitty-text-content" contenteditable="true" spellcheck="false" 
            :style="props.style" 
            @dblclick="focusSelection" 
            @mousedown="deleteLastRange" 
            @mouseup="saveSelectionRange"
            @blur="contentChange"
            v-html="props.content">
        
        </div>
        <!--@mousemove="saveSelectionRange"-->
        <div class="yh-edit-layer">
            <ul class="clearfix" 
                    @click="setStyleEvent" 
                    >
                <li v-for="(value,key) in cmd" class="yh-edit-normal" :class="specialClass(value)" :cmd="JSON.stringify(value)" :yh-name="key">
                    <div v-if="!value.change && value.values" class="yh-tedit clearfix">
                        <div class="yh-tedit-value">{{value.styleValue}}{{value.sunit}}</div>
                        <div class="yh-tedit-arrow"></div>
                        <div class="yh-tedit-list-parent" v-if="value.svalues">
                            <ul class="yh-tedit-list">
                                <li v-for="(vlist,vindex) in value.svalues" :value="value.values[vindex]" :style="'font-size:'+value.values[vindex]+value.unit">{{vlist}}{{value.sunit}}</li>
                            </ul>
                        </div>
                        <ul class="yh-tedit-list" v-else>
                            <li v-for="vlist in value.values" :value="vlist" :style="'font-size:'+vlist+'px'">{{vlist}}{{value.unit}}</li>
                        </ul>
                    </div>
                    <div v-if="value.change == 1" class="yh-tedit clearfix">
                        <p :style="'color: '+color"></p>
                        <div class="yh-tedit-arrow"></div>
                        <ul class="yh-tedit-list clearfix">
                            <li v-for="vlist in value.values" :value="vlist" :style="'background-color:'+vlist"></li>
                            <li class="yh-tedit-cmore clearfix">
                                <input type="text" v-model="color" />
                                <input type="color" v-model="color" @blur="colorBur" />
                            </li>
                        </ul>
                    </div>
                    <div v-if="value.change == 2" class="yh-tedit clearfix">
                        <p :style="'color: '+bgColor"></p>
                        <div class="yh-tedit-arrow"></div>
                        <ul class="yh-tedit-list clearfix">
                            <li v-for="vlist in value.values" :value="vlist" :style="'background-color:'+vlist"></li>
                            <li class="yh-tedit-cmore clearfix">
                                <input type="text" v-model="bgColor" />
                                <input type="color" v-model="bgColor" @blur="colorBur" />
                            </li>
                        </ul>
                    </div>
                    <div v-if="value.modal" class="yh-tedit clearfix" contenteditable="true">
                        <div class="yh-tedit-value" @click="changeLink"></div>
                        <ul class="yh-tedit-list yh-tedit-modal clearfix">
                            <li class="yh-tedit-cmore clearfix" @click.stop.prevent="setLinkEvent">
                                <input class="yh-tedit-clink" type="text" v-model="link" placeholder="http://www" />
                                <label><input class="yh-tedit-ccheck" type="radio" name="linkMode" checked="checked" />新窗口打开</label>
                                <div class="yh-tedit-btn clearfix">
                                    <div class="yh-tedit-button yh-tedit-sure" @click.stop.prevent="setLink">确定</div>
                                    <div class="yh-tedit-button yh-tedit-undo" @click.stop.prevent="undoLinkSet">取消</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import MW from './bus.js'
    import {DOM,Execute} from './text-dom.js'
    export default {
        data(){
            return {
                cmd:{
                    fontSize:{
                        name: '字体大小', 
                        styleName: 'font-size', 
                        styleValue: 24, 
                        initValue: 24,
                        unit:'rem',
                        values:[0.512, 0.5546666666666666, 0.5973333333333334, 0.64, 0.768, 
                                0.8106666666666666, 0.8533333333333334, 0.896, 0.9386666666666666,
                                0.9813333333333333, 1.024, 1.28, 1.536, 2.048, 2.304, 2.56],
                        sunit:'px',
                        svalues:[24, 26, 28, 30, 36, 38, 40, 42, 44, 46, 48, 60, 72, 96, 108, 120]
                    },
                    color:{
                        name:'字体颜色',
                        styleName: 'color', 
                        styleValue: '#666666', 
                        initValue: '#666666',
                        unit:'',
                        change:1,
                        values:[
                            '#000000', '#424242', '#636363', '#9C9C94', '#CEC6CE', '#EFEFEF', '#F7F7F7', '#FFFFFF',
                            '#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF',
                            '#F7C6CE', '#FFE7CE', '#FFEFC6', '#D6EFD6', '#CEDEE7', '#CEE7F7', '#D6D6E7', '#E7D6DE',
                            '#E79C9C', '#FFC69C', '#FFE79C', '#B5D6A5', '#A5C6CE', '#9CC6EF', '#B5A5D6', '#D6A5BD',
                            '#E76363', '#F7AD6B', '#FFD663', '#94BD7B', '#73A5AD', '#6BADDE', '#8C7BC6', '#C67BA5',
                            '#CE0000', '#E79439', '#EFC631', '#6BA54A', '#4A7B8C', '#3984C6', '#634AA5', '#A54A7B',
                            '#9C0000', '#B56308', '#BD9400', '#397B21', '#104A5A', '#085294', '#311873', '#731842',
                            '#630000', '#7B3900', '#846300', '#295218', '#083139', '#003163', '#21104A', '#4A1031'
                        ]
                    },
                    backgroundColor:{
                        name:'背景颜色',
                        styleName: 'background-color', 
                        styleValue: 'rgba(0,0,0,0)', 
                        initValue: 'rgba(0,0,0,0)', 
                        unit:'',
                        change:2,
                        values:[
                            '#000000', '#424242', '#636363', '#9C9C94', '#CEC6CE', '#EFEFEF', '#F7F7F7', '#FFFFFF',
                            '#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF',
                            '#F7C6CE', '#FFE7CE', '#FFEFC6', '#D6EFD6', '#CEDEE7', '#CEE7F7', '#D6D6E7', '#E7D6DE',
                            '#E79C9C', '#FFC69C', '#FFE79C', '#B5D6A5', '#A5C6CE', '#9CC6EF', '#B5A5D6', '#D6A5BD',
                            '#E76363', '#F7AD6B', '#FFD663', '#94BD7B', '#73A5AD', '#6BADDE', '#8C7BC6', '#C67BA5',
                            '#CE0000', '#E79439', '#EFC631', '#6BA54A', '#4A7B8C', '#3984C6', '#634AA5', '#A54A7B',
                            '#9C0000', '#B56308', '#BD9400', '#397B21', '#104A5A', '#085294', '#311873', '#731842',
                            '#630000', '#7B3900', '#846300', '#295218', '#083139', '#003163', '#21104A', '#4A1031',
                            'rgba(0,0,0,0)'
                        ]
                    },
                    lineHeight:{
                        name: '行高', 
                        styleName: 'line-height', 
                        styleValue: 1, 
                        initValue: 1,
                        unit:'',
                        values:[1, 1.2, 1.5, 2, 2.5, 3]
                    },
                    bold:{
                        name: '粗体', 
                        active: false, 
                        styleName: 'font-weight', 
                        styleValue: 'bold', 
                        initValue:'normal'
                    },
                    italic: {
                        name: '斜体', 
                        active: false, 
                        styleName: 'font-style', 
                        styleValue: 'italic', 
                        initValue:'normal'
                    },
                    linethrough: {
                        name: '中划线', 
                        active: false, 
                        styleName: 'text-decoration', 
                        styleValue: 'line-through', 
                        initValue:'none',
                        relative:['underline']
                    },
                    underline: {
                        name: '下划线', 
                        active: false, 
                        styleName: 'text-decoration', 
                        styleValue: 'underline', 
                        initValue:'none',
                        relative:['linethrough']
                    },
                    // superscript: {
                    //     name: '上划线', 
                    //     active: false, 
                    //     styleName: 'vertical-align', 
                    //     styleValue: 'super', 
                    //     initValue:'baseline',
                    //     relative:['subscript']
                    // },
                    // subscript: {
                    //     name: '下划线', 
                    //     active: false, 
                    //     styleName: 'vertical-align', 
                    //     styleValue: 'sub', 
                    //     initValue:'baseline',
                    //     relative:['superscript']
                    // },
                    left: {
                        name: '左对齐', 
                        active: false, 
                        styleName: 'text-align', 
                        styleValue: 'left', 
                        initValue:'center',
                        relative:['center','right','justify']
                    },
                    center: {
                        name: '居中', 
                        active: true, 
                        styleName: 'text-align', 
                        styleValue: 'center', 
                        initValue:'center',
                        relative:['left','right','justify']
                    },
                    right: {
                        name: '右对齐', 
                        active: false, 
                        styleName: 'text-align', 
                        styleValue: 'right', 
                        initValue:'center',
                        relative:['left','center','justify']
                    },
                    justify: {
                        name: '左右对齐', 
                        active: false, 
                        styleName: 'text-align', 
                        styleValue: 'justify', 
                        initValue:'center',
                        relative:['left','right','center']
                    },
                    indent: {
                        name: '缩进', 
                        active: false, 
                        styleName: 'margin-left',
                        value:25,
                        styleValue: '0px',
                        initValue:0,
                        relative:['outdent']
                    },
                    outdent: {
                        name: '伸出', 
                        active: false, 
                        styleName: 'margin-left',
                        value:-25,
                        styleValue: '0px', 
                        initValue:0,
                        relative:['indent']
                    },
                    ol: {
                        name: '有序列表', 
                        active: false, 
                        styleName: 'margin-left',
                        styleValue: '25px',
                        initValue:0,
                        relative:['ul']
                    },
                    ul: {
                        name: '无序列表', 
                        active: false, 
                        styleName: 'margin-left',
                        styleValue: '25px',
                        initValue:0,
                        relative:['ol']
                    },
                    // img: {
                    //     name: '图片', 
                    //     cmd: 'insertImage', 
                    //     valign: 'bottom', 
                    //     value: '',
                    //     modal: 'hidden',
                    //     error: ''
                    // },
                    link: {
                        name: '链接', 
                        active: false, 
                        value: '', 
                        cmd: 'createLink', 
                        modal: 'hidden',
                        blank: false,
                        error: ''
                    },
                    unlink:{
                        name: '去掉链接', 
                        active: false, 
                        cmd: 'unlink'
                    },
                },
                isChanging:false,
                linkChangeStatus:false,
                color:'#666666',
                bgColor:'rgba(0,0,0,0)',
                link:''
            }
        },
        props:['props'],
        methods:{
            getRemValue(value){
                return value / (750 / 16);
            },
            getRem(value){
                return value / (750 / 16) + 'rem';
            },
            specialClass(data){
                if(data.change){
                    return 'yh-edit-color'
                }else if(data.values || data.modal){
                    return 'yh-edit-list' + (data.active ? ' active' : '')
                }else{
                    return  '' + (data.active ? ' active' : '')
                }
            },
            showEditLayer(e){
                let elem = $(e.target)
                // if(!elem.hasClass('setting')){
                //     return
                // }
                elem.addClass('white-bg')
                elem.children('.yh-edit-layer').show();
                
                // console.log('showEditLayer: '+this.linkChangeStatus)
                if(this.linkChangeStatus == 2){
                    this.linkChangeStatus = false
                }
                // 展示编辑层，恢复当前选中元素的编辑数据
                this.recoveryEditData(elem)
            },
            hideEditLayer(e){
                // console.log('hideEditLayer: '+this.isChanging)
                // console.log('hideEditLayer: '+this.linkChangeStatus)
                let elem = $(e.target)
                if(this.linkChangeStatus == false){
                    elem.find('.yh-tedit-list,.yh-tedit-list-parent').hide()
                }
                if(!this.isChanging && this.linkChangeStatus == false){
                    elem.removeClass('white-bg')
                    elem.children('.yh-edit-layer').hide();
                }
                MW.bus.$emit('blurSelection')
            },
            recoveryEditData(hoverElem){
                let styleJSON = DOM.recoveryEditData(hoverElem)
                this.initCmd()
                this.setCmd(styleJSON)
            },
            changeColor(now,old){
                DOM.restoreRange()
                var elem = $('.setting > .yh-edit-layer [yh-name="color"] input[type="color"]')
                this.setStyle(elem[0])
                this.isChanging = false
            },
            changeBColor(now,old){
                DOM.restoreRange()
                var elem = $('.setting > .yh-edit-layer [yh-name="backgroundColor"] input[type="color"]')
                this.setStyle(elem[0])
                this.isChanging = false
            },
            changeLink(e){
                var elem = $('.setting > .yh-edit-layer [yh-name="link"] .yh-tedit-cmore > input')
                this.setStyle(elem[0])
                this.isChanging = true
                this.linkChangeStatus = true
            },
            colorBur(e){
                this.isChanging = true
                // console.log('colorBur: '+this.isChanging)
            },
            setLinkEvent(e){

            },
            setLink(e){
                let elem = $('.setting > .yh-edit-layer [yh-name="link"] .yh-tedit-cmore > input')
                
                this.isChanging = false
                this.linkChangeStatus = 2
                this.cmd.link.active = true
                this.cmd['unlink'].active = false

                this.setStyle(elem[0])
            },
            undoLinkSet(e){
                this.isChanging = false
                this.linkChangeStatus = 2
                $(e.target).closest('.yh-tedit-list,.yh-tedit-list-parent').hide()
            },
            setStyleEvent(e){
                this.setStyle(e.target)
            },
            setStyle(target){
                MW.textEditing = true
                let that = $(target),
                    normal = that.hasClass('yh-edit-normal'),  // true 直接设置的元素
                    li = normal ? that : that.closest('.yh-edit-normal'),  // li [yh-name]
                    hasLi = normal || that.closest('.yh-edit-normal').length > 0

                DOM.restoreRange()
                let elem = null,
                    firstCommonParent = null,
                    nextNode = null,
                    parent = null,
                    hasRange = DOM.isSelectedRange(),
                    startOffset = 0,
                    endOffset = 0,
                    // 普通    颜色     链接
                    nowEditStatus = target.tagName.toLowerCase() == 'li' || target.type == 'color' || (that.hasClass('yh-tedit-clink') && this.linkChangeStatus == 2)

                // 普通    颜色     链接
                if(nowEditStatus){
                    let rangeStatus = true
                    if(hasRange){ // 当前有选择文本
                        if(nowEditStatus){
                            firstCommonParent = DOM.getFirstCommonParent()
                            elem = DOM.getRangeElem()
                        }else{
                            elem = $('.setting').children('.kitty-text-content')
                            hasRange = false;
                        }
                    }else{ // 当前没有选择文本
                        elem = $('.setting').children('.kitty-text-content')
                        rangeStatus = false
                    }
                    let data = JSON.parse(li[0].attributes['cmd'].value),
                        name = li.attr('yh-name'),
                        elemValue = data.initValue

                    switch(name){
                        case 'indent':  // 缩进
                        case 'outdent':  // 伸出
                            elemValue = data.value
                            if(rangeStatus){
                                let elemParent = DOM.getParentLi(elem,false)
                                Execute.setIndent(elemValue,elemParent,this)
                            }else{
                                let cParent = DOM.getCursorPosition()
                                if(!cParent || cParent.attributes['yh-name']){
                                    alert('* 请先选择需要缩进或伸出的元素！')
                                }else{
                                    Execute.setIndent(elemValue,[cParent],this)
                                }
                            }
                            // data.styleValue = lastValue+'rem'
                            break
                        case 'ol':
                        case 'ul':
                            let cParent = DOM.getCursorPosition(),
                                relativeName = name == 'ol' ? 'ul' : 'ol',
                                elemLi = []/*,
                                elstatus = DOM.getAllElementStatus(elem)
                            
                            if(elstatus){
                                elemLi = DOM.getParentLi(elem,false)
                            }else{
                                elemLi = DOM.getParentLi(elem,false)
                                // elemLi = DOM.getParentLi(elem)
                            }*/
                            if(rangeStatus){
                                elemLi = DOM.getParentLi(elem,false)
                            }else{
                                elemLi = [cParent]
                            }
                            if(cParent){
                                if(this.cmd[name].active){
                                    Execute.unwrapLi(cParent)
                                    this.cmd[name].active = false
                                }else{
                                    if(elemLi.length > 0){
                                        for(let el = 0; el < elemLi.length; el++){
                                            if(elemLi[el]){
                                                Execute.wrapLi(elemLi[el],name)
                                            }else{
                                                Execute.wrapLi(cParent,name)
                                                break
                                            }
                                        }
                                    }else{
                                        Execute.wrapLi(cParent,name)
                                    }
                                    this.cmd[name].active = true
                                    this.cmd[relativeName].active = false
                                    DOM.removeRange()
                                }
                            }
                            break
                        default:
                            if(normal){  // 能直接设置的
                                if(!data.active){
                                    elemValue = data.styleValue
                                }
                                data.active = !data.active
                                this.cmd[name].active = data.active
                            }else{  // 有下拉列表的
                                let attrKey = data.styleValue == undefined ? 'value' : 'styleValue'
                                data[attrKey] = target.tagName.toLowerCase() == 'input' ? that.val() :that.attr('value')
                                elemValue = data[attrKey] + (this.cmd[name].unit ? this.cmd[name].unit : '')
                                
                                if(name == 'fontSize'){
                                    this.cmd[name][attrKey] = data['svalues'][that.index()]
                                }else{
                                    this.cmd[name][attrKey] = data[attrKey]
                                }
                                if(!this.linkChangeStatus || this.linkChangeStatus == 2){
                                    li.find('.yh-tedit-list,.yh-tedit-list-parent').hide()
                                }
                            }
                            if(hasRange){
                                switch(name){
                                    case 'unlink':
                                        document.execCommand(this.cmd[name].cmd,false)
                                        this.cmd[name].active = false
                                        this.cmd['link'].active = false
                                        this.cmd['link'].value = ''
                                        this.link = ''
                                        break
                                    case 'link':
                                        let linkEdit = that.closest('.yh-tedit-cmore'),
                                            status = linkEdit.find('.yh-tedit-ccheck')[0].checked,
                                            linkAttr = status ? 'target="_blank"' : ''

                                        this.cmd.link.value = elemValue
                                        this.cmd.link.blank = status

                                        if(DOM.getChildNodesLength(firstCommonParent[0]) == elem.length && (firstCommonParent.attr('style')+'').indexOf(data.styleName) != -1){
                                            firstCommonParent.html('<a href="'+elemValue+'" '+linkAttr+'>'+firstCommonParent.html()+'</a>')
                                        }else{
                                            for (let i = 0; i < elem.length; i++){
                                                elem[i].html('<a href="'+elemValue+'" '+linkAttr+'>'+elem[i].html()+'</a>')
                                            }
                                        }
                                        break
                                    default:
                                        for (let i = 0; i < elem.length; i++){
                                            elem[i].css(data.styleName,elemValue)
                                        }
                                        if(DOM.equalHtml(firstCommonParent,elem) && (firstCommonParent.attr('style')+'').indexOf(data.styleName) != -1){
                                            firstCommonParent.css(data.styleName,elemValue)
                                        }
                                        break
                                }
                                switch(name){
                                    case 'link':
                                        DOM.saveChangeRange(elem[0].children()[0].firstChild,0,elem[elem.length-1].children()[0].firstChild,elem[elem.length-1].children().html().length)
                                        break
                                    default:
                                        DOM.saveChangeRange(elem[0][0].firstChild,0,elem[elem.length-1][0].firstChild,elem[elem.length-1].html().length)
                                        break
                                }
                                DOM.restoreRange()
                            }else{
                                switch(name){
                                    case 'link':
                                    case 'unlink':
                                        break
                                    default:
                                        elem.css(data.styleName,elemValue)
                                        break
                                }
                            }
                    }  // switch
                    let textContent = this.$el.getElementsByClassName('kitty-text-content')[0]
                    this.content = textContent.innerHTML
                    MW.bus.$emit(
                        'updateContent',
                        this.content,
                        Execute.getStyleJSON(textContent.style.cssText),
                        this.$el.id
                    )
                }else if(hasLi){
                    li.find('.yh-tedit-list,.yh-tedit-list-parent').show()
                }
                MW.textEditing = false
            },
            focusSelection(e){
                MW.bus.$emit('focusSelection')
            },
            saveSelectionRange(e){
                // if(!MW.moveStatus){
                //     e.stopPropagation()
                // }
                // if(!MW.moveStatus){
                    if(!MW.textEditing && DOM.getSelectionRange()){
                        DOM.saveRange()
                    }else{
                        // DOM.removeRange()
                    }
                    // 展示编辑层，恢复当前选中元素的编辑数据
                    this.recoveryEditData($(e.target))
                // }
            },
            deleteLastRange(e) {
                // if(!MW.moveStatus){
                //     e.stopPropagation()
                // }
                DOM.saveRange()
                // 展示编辑层，恢复当前选中元素的编辑数据
                // var range = this.getSelectionRange()
                DOM.restoreRange()
                this.recoveryEditData()
                // DOM.removeRange()
            },
            contentChange(e){
                let target = e.target,
                    html = target.innerHTML
                MW.bus.$emit(
                    'updateContent',
                    html,
                    Execute.getStyleJSON(target.style.cssText),
                    target.parentNode.id
                )
            },
            setCmd(styleJSON){
                for( let s in styleJSON){
                    switch(s){
                        case 'font-size':
                            this.cmd['fontSize'].styleValue = parseInt(parseFloat(styleJSON[s]) * (750 / 16))
                            break
                        case 'font-weight':
                            switch(styleJSON[s]){
                                case 'bold':
                                    this.cmd['bold'].active = true
                                    break
                            }
                            break
                        case 'font-style':
                            switch(styleJSON[s]){
                                case 'italic':
                                    this.cmd['italic'].active = true
                                    break
                            }
                            break
                        case 'text-decoration':
                            switch(styleJSON[s]){
                                case 'line-through':
                                    this.cmd['linethrough'].active = true
                                    break
                                case 'underline':
                                    this.cmd['underline'].active = true
                                    break
                            }
                            break
                        case 'vertical-align':
                            switch(styleJSON[s]){
                                case 'super':
                                    this.cmd['superscript'].active = true
                                    break
                                case 'sub':
                                    this.cmd['subscript'].active = true
                                    break
                            }
                            break
                        case 'text-align':
                            switch(styleJSON[s]){
                                case 'left':
                                    this.cmd['left'].active = true
                                    break
                                case 'center':
                                    this.cmd['center'].active = true
                                    break
                                case 'right':
                                    this.cmd['right'].active = true
                                    break
                                case 'justify':
                                    this.cmd['justify'].active = true
                                    break
                            }
                            break
                        case 'margin-left':
                            break
                    }
                }
                let range = DOM.getSelectionRange()
                if(range){
                    let start = range.startContainer,
                        end = range.endContainer

                    if(start == end){
                        if(start.parentNode.tagName.toLowerCase() == 'li' && start.parentNode.parentNode.tagName.toLowerCase() == 'ul'){
                            this.cmd['ul'].active = true
                            this.cmd['ol'].active = false
                        }else if(start.parentNode.tagName.toLowerCase() == 'li' && start.parentNode.parentNode.tagName.toLowerCase() == 'ol'){
                            this.cmd['ul'].active = false
                            this.cmd['ol'].active = true
                        }else{
                            this.cmd['ul'].active = false
                            this.cmd['ol'].active = false
                        }
                    }else{
                        this.cmd['ul'].active = false
                        this.cmd['ol'].active = false
                    }
                }else{
                    this.cmd['ul'].active = false
                    this.cmd['ol'].active = false
                }
            },
            initCmd(){
                for(let s in this.cmd){
                    switch(s){
                        case 'fontSize':
                            this.cmd[s].styleValue = this.cmd[s].initValue
                            break
                        case 'bold':
                        case 'italic':
                        case 'linethrough':
                        case 'underline':
                        case 'superscript':
                        case 'subscript':
                        case 'left':
                        case 'center':
                        case 'right':
                        case 'justify':
                            this.cmd[s].active = false
                            break
                    }
                }
            }
        },  // methods
        watch:{
            color:{   // 深度watch
                handler: 'changeColor',
                deep: true
            },
            bgColor:{   // 深度watch
                handler: 'changeBColor',
                deep: true
            },
            // link:{
            //     handler:'changeLink',
            //     deep:true
            // },
        },
        initCtor(options,that){
            options = options || {}
            return {
                id:options.id ? options.id : '',
                content: options.content || "<p>It's a test</p>",//"<ol style=\"text-align:left;\"><li>It's a test.<ol style=\"margin-left: 1.06666rem;\"><li>hello</li><li>dagou</li></ol></li><li>waoefnaeojg</li><li>xxnxixn</li></ol>",
                position:{
                    left:0,
                    top:0
                },
                style:{
                    width:that.getRem((options.width ||  options.width == 0) ? options.width : 375),
                    height:that.getRem((options.height ||  options.height == 0) ? options.height : 75),
                    webkitTransform:'none',
                    transform:'none'
                },
                classname:options.classname ? options.classname : ''
            }
        }
    }
</script>
<style>
    [kitty-text] .kitty-text-content{
        width:150px;
        height:30px;
        line-height:30px;
        color:#666;
        text-align:center;
        font-size:0.512rem;
    }
    [kitty-text] .kitty-text-content ul > li,
    [kitty-text] .kitty-text-content ul{
        list-style:	disc inside none;
    }
    [kitty-text] .kitty-text-content ol > li,
    [kitty-text] .kitty-text-content ol{
        list-style:	decimal inside none;
    }
    [kitty-text] .kitty-text-content ul > li > ul > li,
    [kitty-text] .kitty-text-content ul > li > ul{
        list-style:	circle inside none;
    }
    [kitty-text] .kitty-text-content ul > li > ul > li > ul > li,
    [kitty-text] .kitty-text-content ul > li > ul > li > ul{
        list-style:	square inside none;
    }
    [kitty-text] .kitty-text-content ul > li.style-none,
    [kitty-text] .kitty-text-content ol > li.style-none{
        list-style:none;
    }



    /*设置样式********************/
    [kitty-text] .yh-edit-layer{
        width: 264px;
        padding: 5px;
        position: absolute;
        left: 50%;
        /*top: -76px;*/
        /*top:-54px;*/
        top:-51px;
        background: #eff2f7;
        z-index: 9999;
        margin: 0 0 0 -137px;
        display:none;
    }
    [kitty-text] .yh-edit-layer li{
        height:20px;
        line-height: 20px;
        margin:0 2px 2px 0;
        float:left;
        cursor:pointer;
        background:#fff;
        text-align:center;
    }
    [kitty-text] .yh-edit-layer li:hover {
        background:#dde5ef;
    }
    [kitty-text] .yh-edit-layer li.active{
        background:#ff0084;
        color:#fff;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-normal{
        width:20px;
        position: relative;
    }
    [kitty-text] .yh-edit-layer li:after{
        font-family: FontAwesome;
        font-size:12px;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-normal[yh-name="bold"]:after{
        content:"\F032";
    }
    [kitty-text] .yh-edit-layer li.yh-edit-normal[yh-name="italic"]:after{
        content:"\F033";
    }
    [kitty-text] .yh-edit-layer li.yh-edit-normal[yh-name="linethrough"]:after{
        content:"\F0CC";
    }
    [kitty-text] .yh-edit-layer li.yh-edit-normal[yh-name="underline"]:after{
        content:"\F0CD";
    }
    [kitty-text] .yh-edit-layer li.yh-edit-normal[yh-name="superscript"]:after{
        content:"\F12B";
    }
    [kitty-text] .yh-edit-layer li.yh-edit-normal[yh-name="subscript"]:after{
        content:"\F12C";
    }
    [kitty-text] .yh-edit-layer li.yh-edit-normal[yh-name="left"]:after{
        content:"\F036";
    }
    [kitty-text] .yh-edit-layer li.yh-edit-normal[yh-name="center"]:after{
        content:"\F037";
    }
    [kitty-text] .yh-edit-layer li.yh-edit-normal[yh-name="right"]:after{
        content:"\F038";
    }
    [kitty-text] .yh-edit-layer li.yh-edit-normal[yh-name="justify"]:after{
        content:"\F039";
    }
    [kitty-text] .yh-edit-layer li.yh-edit-normal[yh-name="indent"]:after{
        content:"\F03C";
    }
    [kitty-text] .yh-edit-layer li.yh-edit-normal[yh-name="outdent"]:after{
        content:"\F03B";
    }
    [kitty-text] .yh-edit-layer li.yh-edit-normal[yh-name="ol"]:after{
        content:"\F0CB";
    }
    [kitty-text] .yh-edit-layer li.yh-edit-normal[yh-name="ul"]:after{
        content:"\F0CA";
    }
    [kitty-text] .yh-edit-layer li.yh-edit-normal[yh-name="link"] {
        width:20px;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-normal[yh-name="link"] .yh-tedit-value{
        width:20px;
        height:20px;
        position:relative;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-normal[yh-name="link"] .yh-tedit-value:after{
        width:20px;
        height:20px;
        font-family: FontAwesome;
        font-size:12px;
        position:absolute;
        left:0;
        top:0;
        content:"\F0C1";
    }
    [kitty-text] .yh-edit-layer li.yh-edit-normal[yh-name="unlink"]:after {
        content:"\F127";
    }
    [kitty-text] .yh-edit-layer li.yh-edit-normal[yh-name="img"]:after{
        content:"\F03E";
    }
    [kitty-text] .yh-edit-layer li.yh-edit-list{
        width:60px;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-list .yh-tedit{
        position:relative;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-list .yh-tedit-value{
        width:50px;
        float:left;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-color .yh-tedit-arrow,
    [kitty-text] .yh-edit-layer li.yh-edit-list .yh-tedit-arrow{
        width:10px;
        height:20px;
        float:left;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-color .yh-tedit-arrow:after ,
    [kitty-text] .yh-edit-layer li.yh-edit-list .yh-tedit-arrow:after {
        line-height:20px;
        content:"\F0D7";
        font-family: FontAwesome;
        font-size:12px;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-list .yh-tedit-list-parent{
        width:155px;
        height: 200px;
        overflow-y: scroll;
        overflow-x: hidden;
        position:absolute;
        left:0;
        top:100%;
        display:none;
        z-index:10;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-color .yh-tedit-list,
    [kitty-text] .yh-edit-layer li.yh-edit-list .yh-tedit-list{
        width:140px;
        position:absolute;
        left:0;
        top:0;
        background: #fff;
        display:none;
        border: 1px solid #ccc;
        padding: 2px;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-color .yh-tedit-list > li,
    [kitty-text] .yh-edit-layer li.yh-edit-list .yh-tedit-list > li{
        width:140px;
        height:auto;
        line-height:1.5;
        margin:0;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-color{
        /*width: 99px;*/
        width:30px;
        z-index: 10;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-color[yh-name="backgroundColor"]{
        z-index:9;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-color[yh-name="backgroundColor"] .yh-tedit-list,
    [kitty-text] .yh-edit-layer li.yh-edit-color[yh-name="color"] .yh-tedit-list{
        top: 100%;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-color .yh-tedit p{
        width:20px;
        height:20px;
        float:left;
        position:relative;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-color .yh-tedit p:after{
        width:20px;
        height:20px;
        line-height:20px;
        color:#666;
        text-align:center;
        font-family: FontAwesome;
        font-size:12px;
        content:"\F031";
        position:absolute;
        left:0;
        top:0;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-color[yh-name="backgroundColor"] .yh-tedit p:after{
        background: url(http://localhost:9000/static/images/icons.png) no-repeat -1px -192px;
        background-size:68px 1980px;
        content:"";
    }
    [kitty-text] .yh-edit-layer li.yh-edit-color .yh-tedit-list{
        width:200px;
        padding:5px 0 5px 5px;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-color .yh-tedit-list > li{
        width: 18px;
        height: 18px;
        margin: 0 5px 0 0;
        float: left;
        border: 1px solid #eee;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-color .yh-tedit-list > li.yh-tedit-cmore{
        width:118px;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-color .yh-tedit-list > li.yh-tedit-cmore input {
        width: 100px;
        height: 18px;
        line-height: 18px;
        border: none;
        float: left;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-color .yh-tedit-list > li.yh-tedit-cmore input[type="color"] {
        width: 18px;
        border:none;
    }
    /*modal*****/
    [kitty-text] .yh-edit-layer li.yh-edit-list .yh-tedit-modal{
        width:400px;
        height:110px;
        position: fixed;
        left: 50%;
        top: 50%;
        margin: -55px 0 0 -200px;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-list .yh-tedit-modal > li {
        width:400px;
        height:90px;
        padding:10px 0;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-list .yh-tedit-modal > li input {
        width: 360px;
        height:30px;
        line-height:30px;
        padding: 0 10px;
        border:1px solid #eee;
        /*margin:0 auto;*/
        /*display:block;*/
    }
    [kitty-text] .yh-edit-layer li.yh-edit-list .yh-tedit-modal > li label {
        width:380px;
        margin:0 auto;
        display:block;
        text-align:left;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-list .yh-tedit-modal > li label input {
        width:auto;
        vertical-align: middle;
        margin: 0 5px 0 0;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-list .yh-tedit-modal > li .yh-tedit-btn{
        float:right;
    }
    [kitty-text] .yh-edit-layer li.yh-edit-list .yh-tedit-modal > li .yh-tedit-button{
        width:80px;
        height:30px;
        line-height:30px;
        border-radius:8px;
        margin: 0 10px 0 0;
        color:#fff;
        background:#ff0084;
        text-align:center;
        float:left;
    }

    .white-bg{
        background:#fff;
        color:#666;
    }

    .setting {
        z-index: 9999;
    }
</style>