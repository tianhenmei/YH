<template>
    <div components-content>
        <div class="yh-components-content">
            <div class="yh-content-center">
                <div v-for="(page,index) in pages" :class="'page page'+index+getClassname(index)" :style="page.background">
                    <div v-for="element in page.elements" :is="element.yh_module"
                        :props="element.props"
                        >
                    </div>
                </div>
                
            </div>
            <div class="yh-page-edit">
                <ul>
                    <li edit="background-color">
                        <input type="color" name="backgroundColor" />
                    </li>
                    <li edit="background-image">
                        <input type="file" content="src" accept="image/*" name="backgroundImage" />
                    </li>
                </ul>
            </div>


            <div class="yh-selectTop yh-selection">
                <p class="center"></p>
                <p></p>
            </div>
            <div class="yh-selectRight yh-selection">
                <p class="center"></p>
                <p></p>
            </div>
            <div class="yh-selectBottom yh-selection">
                <p class="center"></p>
                <p></p>
            </div>
            <div class="yh-selectLeft yh-selection">
                <p class="center"></p>
                <p></p>
            </div>
            <div class="yh-selectOpera yh-selection">
                <span id="delete">x</span>
                <span id="complate">√</span>
            </div>

            <div id="yh-move-box"></div>
        </div>
    </div>
</template>
<script>
    import $ from '../../common/js/lib/jquery.1.10.1.min.js'
    import MW from './bus.js'
    import Drag from './drag.js'
    import YHImage from './image.vue'
    import YHText from './text.vue'

    const Elements = {
        'components-text':YHText,
        'components-image':YHImage,
        // 'components-button':YHButton,
        // 'components-form':YHForm,
        // 'components-audio':YHAudio,
        // 'components-video':YHVideo
    }
    export default {
        components:{
            'yh-image':YHImage
        },
        data(){
            return {
                pages:[{
                        elements:[/*{
                            yh_id:'element0',
                            yh_module:YHImage,
                            module:'image',
                            props:{
                                id:'element0',
                                style:{
                                    width:this.getRem(181),
                                    height:this.getRem(181)
                                },
                                position:{
                                    left:0,
                                    top:0
                                },
                                src:'http://localhost:9000/static/images/Helen.png',
                                href:''
                            }
                        }*/],
                        background:{
                            backgroundColor:'transparent',
                            backgroundImage:'',
                            backgroundRepeat:'no-repeat',
                            backgroundPosition:'0 0',
                            backgroundSize:'100% 100%'
                        }
                    }
                ],
                currentPage:MW.currentPage,
                fontSize:16,
                distance:15,
                title:"It's title",
                count:1,
                pageAnimation:'move'
            }
        },
        created(){
            var that = this
            MW.bus.$on('addChild',name => {
                that.addChild(name)
            })
            MW.bus.$on('savePage',() => {
                that.savePage()
            })
            MW.bus.$on('previewPage',() => {
                that.previewPage()
            })
            MW.bus.$on('addPage',(index,callback) => {
                that.addPage(index,callback)
            })
            MW.bus.$on('removePage',(index) => {
                that.removePage(index)
            })
            MW.bus.$on('pageAnimation',(value) => {
                that.pageAnimation = value
            })
            MW.bus.$on('changePage',(index) => {
                that.currentPage = index
                $('.setting').removeClass('setting')
                $('.yh-selection').hide()
            })
        },
        mounted(){
            this.getPageData('10002',this);
            this.init()
        },
        methods:{
            init(){
                // 设置字体大小
                this.initFontSize()
                // 设置拖动事件
                this.initEvent()
            },
            initFontSize(){   // 设置字体大小
                var RC = {
                        w:750,
                        h:1206
                    },
                    portrait =  false,
                    resize = "orientationchange"in window ? window.orientationchange : window.resize,
                    bodyElement = document.documentElement || document.body,
                    GC = {
                        w:300,   //bodyElement.clientWidth,
                        h:482   //bodyElement.clientHeight
                    },
                    rightSize = RC.w / RC.h,
                    currentSize = GC.w / GC.h,
                    lastHTMLSize = 16,
                    html = document.getElementsByTagName("html")[0],
                    center = document.getElementsByClassName('yh-content-center')[0];//;
                if(rightSize > currentSize){  // 长屏
                    lastHTMLSize = 16;
                }else if(rightSize < currentSize){  //宽屏
                    lastHTMLSize = (RC.h / GC.h * GC.w) / RC.w * 16;
                }
                this.fontSize = GC.w / lastHTMLSize;
                html.style.fontSize = this.fontSize +'px';
            },
            initEvent(){ 
                var components_content = $('.yh-content-center')
                var self = this;
                // 初始化文件上传事件
                $('.yh-components-content').on('change','input[type="file"]',function(e){
                    var file = this.files[0];
                    self.fileChange(file,this,self);
                })
                // 设置拖动事件
                new Drag({
                    outer:'.yh-components-content',
                    contain:'.yh-content-center',
                    move_box:'#yh-move-box',
                    elemPath:'.yh-content-center .page > div',
                    distance:15,
                    mousedownCallback:self.mousedownCallback,
                    firstMoveCallback:self.hideEditLayer,
                    mouseupCallback:self.mouseupCallback
                })
                
                components_content.on('mouseenter','.page > div',function(e){
                    $(this).children('.yh-edit-layer').show();
                })
                components_content.on('mouseleave','.page > div',function(e){
                    $(this).children('.yh-edit-layer').hide();
                })

                this.initRemoveEvent()
                this.initColorEvent()
                this.initSizeChangeEvent()
            },
            initRemoveEvent(){
                var self = this;
                $(document).on('click','#delete',function(e){
                    var elem = $('.setting'),
                        elemID = elem.attr('id');
                    
                    var index = self.getIndex(elemID,self)
                    self.pages[self.currentPage].elements.splice(index,1)
                    elem.remove();
                });
            },
            initColorEvent(){
                let input = $('input[type="color"]')
                let self = this
                for( let i = 0; i < input.length; i++ ){
                    input[i].addEventListener('input',function(event){
                        self.colorChange(self,$(this));
                    },false);
                    input[i].addEventListener('propertychange',function(event){
                        if (event.propertyName.toLowerCase () == "value") {
                            self.colorChange(self,$(this));
                        }
                    },false);
                }
            },
            initSizeChangeEvent(){
                let selectP = $('.yh-selection')
                let body = $('body')
                let move_box = $('#yh-move-box')
                let down = false,
                    isMoving = false,
                    elem = null,
                    elemID = '',
                    data = {
                        width:0,
                        height:0,
                        left:0,
                        top:0
                    },
                    last = {
                        width:0,
                        height:0,
                        left:0,
                        top:0
                    },
                    start = { x:0, y:0 },
                    end = { x:0, y:0 },
                    distance = 15,
                    self = this,
                    type = ''

                selectP.on('mousedown','p',function(e){
                    down = true
                    start.x = e.clientX
                    start.y = e.clientY
                    elem = $('.setting')
                    elemID = elem.attr('id')
                    data.width = self.getPointOuterWidth(elem)
                    data.height = self.getPointOuterHeight(elem)
                    data.left = self.getPointValue(elem,'left') + distance
                    data.top = self.getPointValue(elem,'top') + distance

                    let parent = $(this).parent(),
                        isCenter = $(this).hasClass('center')
                    if(parent.hasClass('yh-selectTop')){
                        if(isCenter){
                            type = 'top'
                        }else{
                            type = 'lt'  // 左上角
                        }
                    }else if(parent.hasClass('yh-selectBottom')){
                        if(isCenter){
                            type = 'bottom'
                        }else{
                            type = 'rb'  // 右下角
                        }
                    }else if(parent.hasClass('yh-selectLeft')){
                        if(isCenter){
                            type = 'left'
                        }else{
                            type = 'lb'  // 左下角
                        }
                    }else if(parent.hasClass('yh-selectRight')){
                        if(isCenter){
                            type = 'right'
                        }else{
                            type = 'rt'  // 右上角
                        }
                    }
                })
                body.on('mousemove',function(e){
                    if(down){
                        if(!isMoving){
                            isMoving = true
                            move_box.css({
                                'width':data.width+'px',
                                'height':data.height+'px',
                                'left':data.left + 'px',
                                'top':data.top +'px',
                                'display':'block'
                            });
                        }
                        end.x = e.clientX
                        end.y = e.clientY
                        switch(type){
                            case 'top':
                                move_box.css({
                                    'height':(data.height + start.y - end.y)+'px',
                                    'top':(data.top + end.y - start.y) +'px'
                                })
                                break
                            case 'bottom':
                                move_box.css({
                                    'height':(data.height + end.y - start.y)+'px'
                                })
                                break
                            case 'left':
                                move_box.css({
                                    'width':(data.width + start.x - end.x)+'px',
                                    'left':(data.left + end.x - start.x) +'px'
                                })
                                break
                            case 'right':
                                move_box.css({
                                    'width':(data.width + end.x - start.x)+'px',
                                })
                                break
                            case 'lt': // 左上
                                move_box.css({
                                    'width':(data.width + start.x - end.x)+'px',
                                    'height':(data.height + start.y - end.y)+'px',
                                    'left':(data.left + end.x - start.x) +'px',
                                    'top':(data.top + end.y - start.y) +'px'
                                })
                                break
                            case 'rb': // 右下
                                move_box.css({
                                    'width':(data.width + end.x - start.x)+'px',
                                    'height':(data.height + end.y - start.y)+'px'
                                })
                                break;
                            case 'lb': // 左下
                                move_box.css({
                                    'width':(data.width + start.x - end.x)+'px',
                                    'height':(data.height + end.y - start.y)+'px',
                                    'left':(data.left + end.x - start.x) +'px'
                                })
                                break;
                            case 'rt': // 右上
                                move_box.css({
                                    'width':(data.width + end.x - start.x)+'px',
                                    'height':(data.height + start.y - end.y)+'px',
                                    'top':(data.top + end.y - start.y) +'px'
                                })
                                break;
                        }
                    }
                })
                body.on('mouseup',function(e){
                    if(down){
                        last.width = self.getPointOuterWidth(move_box)
                        last.height = self.getPointOuterHeight(move_box)
                        last.left = self.getPointValue(move_box,'left') - distance
                        last.top = self.getPointValue(move_box,'top') - distance

                        let index = self.getIndex(elemID,self)

                        self.pages[self.currentPage].elements[index].props.style.width = self.toRem(last.width);
                        self.pages[self.currentPage].elements[index].props.style.height = self.toRem(last.height);
                        self.pages[self.currentPage].elements[index].props.position.left = self.toRem(last.left);
                        self.pages[self.currentPage].elements[index].props.position.top = self.toRem(last.top);
                        MW.isMoving = true
                        self.distance = 0
                        self.settingBox(move_box)
                        self.distance = distance
                        // self.mousedownCallback($('.yh-content-center'),elem)
                    }
                    move_box.hide()
                    down = false
                    isMoving = false
                })
            },
            colorChange(self,that){
                let name = that.attr('name')
                let color = that.val()
                
                self.pages[self.currentPage]['background'][name] = color
            },
            fileChange(file,that,self){
                var fileData = new FormData();
                fileData.append('files',file,file.name);
                $.ajax({
                    type:'post',
                    url:'http://10.1.193.233:9000/editor/upload',
                    data:fileData,
                    dataType: 'JSON',  
                    cache: false,  
                    processData: false,  
                    contentType: false,
                    success(data){
                        var name = that.attributes['name'].value
                        switch(name){
                            case 'image':
                                self.imageChange(self,data.content)
                                break;
                            case 'backgroundImage':
                                self.pages[self.currentPage].background.backgroundImage = "url(http://10.1.193.233:9000/"+data.content.path+")";
                                // console.log(self.pages[self.currentPage].background.backgroundImage)
                                break;
                        }
                    },
                    error(error){
                        console.log(error.message);
                    }
                });
            },
            imageChange(self,data){
                var elem = $('.setting'),
                    elemID = elem.attr('id'),
                    img = elem.find('.yh-image')[0],
                    index = self.getIndex(elemID,self);
                img.src = 'http://10.1.193.233:9000/'+data.path
                img.onload = function(){
                    self.settingBox(elem);
                };

                self.pages[self.currentPage].elements[index].props.src = img.src;
                self.pages[self.currentPage].elements[index].props.style.width = self.getRem(data.width);
                self.pages[self.currentPage].elements[index].props.style.height = self.getRem(data.height);
            },
            getIndex(elemID,self){
                var index = 0
                for(let i = 0; i < self.pages[self.currentPage].elements.length; i++){
                    if(self.pages[self.currentPage].elements[i].yh_id == elemID){
                        index = i;
                        break;
                    }
                }
                return index;
            },
            getClassname(index){
                return index == this.currentPage ? '' : ' hide'
            },



            mousedownCallback(parent,elem){
                this.settingBox(elem);
                parent.find('.setting').removeClass('setting');
                elem.addClass('setting');
            },
            hideEditLayer(){
                $('.setting > .yh-edit-layer').hide();
            },
            mouseupCallback(elem,move_box,x,y,distance){
                var elemID = elem.attr('id'),
                    index = this.getIndex(elemID,this);
                
                var self = this,
                    xx = self.toRem(x - distance),
                    yy = self.toRem(y - distance);
                elem.css({
                    'left':xx,
                    'top':yy
                });
                
                self.pages[self.currentPage].elements[index].props.position.left = xx;
                self.pages[self.currentPage].elements[index].props.position.top = yy;
                
                move_box.css({
                    'display':'none'
                });

                self.settingBox(elem);
                // self.addSetEvent();
            },
            addText(){

            },
            addImage(){
                
            },
            addButton(){
                
            },
            addForm(){
                
            },
            addAudio(){
                
            },
            addVideo(){
                
            },
            addChild(name){
                switch(name){
                    case 'components-text':
                        this.addText();
                        break;
                    case 'components-image':
                        this.addImage();
                        break;
                    case 'components-button':
                        this.addButton();
                        break;
                    case 'components-form':
                        this.addForm();
                        break;
                    case 'components-audio':
                        this.addAudio();
                        break;
                    case 'components-video':
                        this.addVideo();
                        break;
                }
                var elemID = 'element'+this.count;
                this.count = this.count + 1;

                this.pages[this.currentPage].elements.push({
                    yh_id:elemID,
                    yh_module:Elements[name],
                    module:name.split('-')[1],
                    props:Elements[name].initCtor({id:elemID},this)
                });

                // this.drawSmallPage()
            },
            // drawSmallPage(){
            //     MW.bus.$emit('drawSmallPage')
            // },









            addPage(index,callback){
                this.pages.splice(index,0,Object.assign({},MW.pageData))
                callback(this.pages[index])
            },
            removePage(index){
                this.pages.splice(index,1)
            },
            getPageData(templateID,self){
                $.ajax({
                    type:'post',
                    url:'http://localhost:9000/editor/getPageData',
                    data:{
                        id:templateID
                    },
                    success:function(result){
                        var data = JSON.parse(result.content.json);
                        self.pages = [];
                        self.count = data.count;
                        for(let i = 0; i < data.pages.length; i++){
                            self.pages.push(JSON.parse(JSON.stringify(data.pages[i])));
                            for(let j = 0; j < self.pages[i].elements.length; j++){
                                switch(self.pages[i].elements[j].module){
                                    case 'image':
                                        self.pages[i].elements[j].yh_module = YHImage;
                                        break;
                                    case 'text':
                                        self.pages[i].elements[j].yh_module = YHText;
                                        break;
                                    case 'button':
                                        self.pages[i].elements[j].yh_module = YHButton;
                                        break;
                                    case 'form':
                                        self.pages[i].elements[j].yh_module = YHForm;
                                        break;
                                    case 'audio':
                                        self.pages[i].elements[j].yh_module = YHAudio;
                                        break;
                                    case 'video':
                                        self.pages[i].elements[j].yh_module = YHVideo;
                                        break;
                                }
                            }
                        }
                        MW.bus.$emit('setPages',self.pages)
                    },
                    error:function(error){
                        console.log(error.message);
                    }
                })
            },
            savePage(){
                var totalElement = $('.yh-content-center').clone()
                totalElement.find('.yh-edit-layer').remove()
                var elem = totalElement.find('[style]'),
                    count = 0,
                    style = '',
                    name = '';
                for(let i = 0; i < elem.length; i++){
                    name = 'elemStyle'+count;
                    count++;
                    style += '.'+name+'{'+elem.eq(i).attr('style')+'}';
                    elem.eq(i).addClass(name)
                        .removeAttr('style');
                }
                totalElement.children('.page').addClass('hide')
                totalElement.children('.page0').removeClass('hide')
                var data = {};
                for(let attr in this.$data){
                    switch(attr){
                        case 'pages':
                            data.pages = [];
                            for(let i = 0; i < this.$data[attr].length; i++){
                                data.pages.push(JSON.parse(JSON.stringify(this.$data[attr][i])));
                                for(let j = 0; j < data.pages[i].elements.length; j++){
                                    data.pages[i].elements[j].yh_module = null;
                                    data.pages[i].elements[j].props.classname = document.getElementById(data.pages[i].elements[j].yh_id).className.replace('setting','');
                                }
                            }
                            break;
                        default:
                            data[attr] = this.$data[attr];
                            break;
                    }
                }
                $.ajax({
                    type:'post',
                    url:'http://localhost:9000/editor/save',
                    data:{
                        id:10002,
                        name:'test',
                        style:style,
                        html:totalElement.html(),
                        json:JSON.stringify(data).replace('\'','’'),
                        js:JSON.stringify({
                            pageAnimation:this.pageAnimation
                        }),
                        author:'yh'
                    },
                    success(data){
                        console.log(data.content);
                    },
                    error(error){
                        console.log(error.message);
                    }
                });
            },
            previewPage(){

            },
            getRem(value){
                return value / (750 / 16) + 'rem';
            },
            toRem(value){
                return value / this.fontSize + 'rem';
            },
            getComputedValue(elem,attribute){
                var value = window.getComputedStyle(elem[0],null).getPropertyValue(attribute);
                return value;
            },
            getPointValue(elem,attribute){
                var value = window.getComputedStyle(elem[0],null).getPropertyValue(attribute);
                return parseFloat(parseFloat(value).toFixed(2));
            },
            getPointWidth(elem){
                var value = this.getPointValue(elem,"width"); //window.getComputedStyle(elem[0],null).getPropertyValue("width");
                return value;
            },
            getPointHeight(elem){
                var value = this.getPointValue(elem,"height"); // window.getComputedStyle(elem[0],null).getPropertyValue("height");
                return value;
            },
            getPointOuterWidth(elem){
                var width =  this.getPointValue(elem,"width"), //window.getComputedStyle(elem[0],null).getPropertyValue("width");
                    left = this.getPointValue(elem,"padding-left"),
                    right = this.getPointValue(elem,"padding-right"),
                    value = width + left + right;
                return value;
            },
            getPointOuterHeight(elem){
                var width =  this.getPointValue(elem,"height"),
                    top = this.getPointValue(elem,"padding-top"),
                    bottom = this.getPointValue(elem,"padding-bottom"),
                    value = width + top + bottom;
                return value;
            },
            settingBox(element){   // 选中框
                var checkedboxStyle = {};
                checkedboxStyle.left = this.getPointValue(element,'left')-2 + this.distance;
                checkedboxStyle.top = this.getPointValue(element,'top')-2 + this.distance;
                checkedboxStyle.width = this.getPointWidth(element)+4+parseFloat(element.css('border-top-width'))+parseFloat(element.css('border-bottom-width'));
                checkedboxStyle.height = this.getPointHeight(element)+4+parseFloat(element.css('border-top-width'))+parseFloat(element.css('border-bottom-width'));
                checkedboxStyle.display = "block";

                var scale = 1;
                checkedboxStyle.left -= 2;
                checkedboxStyle.top -= 2 * scale;
                checkedboxStyle.width += 4;
                checkedboxStyle.height += 4 * scale;

                var selectParent = '';
                $(selectParent+' .yh-selectTop').css({
                    'width':checkedboxStyle.width+'px',
                    'left':checkedboxStyle.left+'px',
                    'top':checkedboxStyle.top+'px'
                });
                $(selectParent+' .yh-selectBottom').css({
                    'width':checkedboxStyle.width+'px',
                    'left':checkedboxStyle.left+'px',
                    'top':checkedboxStyle.top+checkedboxStyle.height+'px'
                });
                $(selectParent+' .yh-selectLeft').css({
                    'height':checkedboxStyle.height+'px',
                    'left':checkedboxStyle.left+'px',
                    'top':checkedboxStyle.top+'px'
                });
                $(selectParent+' .yh-selectRight').css({
                    'height':checkedboxStyle.height+'px',
                    'left':checkedboxStyle.left+checkedboxStyle.width+'px',
                    'top':checkedboxStyle.top+'px'
                });
                $(selectParent+' .yh-selectOpera').css({
                    'left':checkedboxStyle.left+5+'px',
                    'top':checkedboxStyle.top+5+'px'
                });
                $(selectParent+' .yh-selection').css('display','block');
            }
        }
    }
</script>
<style>
    @import "./style/components-content.css";
</style>