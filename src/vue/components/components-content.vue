<template>
    <div components-content>
        <div class="yh-components-content">
            <div class="yh-content-center">
                <div v-for="(page,index) in pages" :class="'page page'+index">
                    <div v-for="element in page.elements" :is="element.yh_module"
                        :props="element.props"
                        >
                    </div>
                </div>
                
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

    const Elements = {
        // 'components-text':YHText,
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
                            backgroundPosition:'0 0'
                        }
                    }
                ],
                currentPage:MW.currentPage,
                fontSize:16,
                distance:15,
                title:"It's title",
                count:1
            }
        },
        created(){
            var that = this;
            MW.bus.$on('addChild',name => {
                that.addChild(name);
            });
            MW.bus.$on('savePage',() => {
                that.savePage();
            });
            MW.bus.$on('previewPage',() => {
                that.previewPage();
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
                components_content.on('change','input[type="file"]',function(e){
                    var file = this.files[0];
                    self.fileChange(file,this,self);
                });
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
                });
                
                components_content.on('mouseenter','.page > div',function(e){
                    $(this).children('.yh-edit-layer').show();
                });
                components_content.on('mouseleave','.page > div',function(e){
                    $(this).children('.yh-edit-layer').hide();
                })
            },
            fileChange(file,that,self){
                var fileData = new FormData();
                fileData.append('files',file,file.name);
                $.ajax({
                    type:'post',
                    url:'http://localhost:9000/editor/upload',
                    data:fileData,
                    dataType: 'JSON',  
                    cache: false,  
                    processData: false,  
                    contentType: false,
                    success(data){
                        var elem = $('.setting'),
                            elemID = elem.attr('id'),
                            img = elem.find('.yh-image')[0],
                            index = self.getIndex(elemID,self);
                        img.src = 'http://localhost:9000/'+data.content.path
                        img.onload = function(){
                            self.settingBox(elem);
                        };

                        self.pages[self.currentPage].elements[index].props.src = img.src;
                        self.pages[self.currentPage].elements[index].props.style.width = self.getRem(data.content.width);
                        self.pages[self.currentPage].elements[index].props.style.height = self.getRem(data.content.height);
                    },
                    error(error){
                        console.log(error.message);
                    }
                });
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
                $.ajax({
                    type:'post',
                    url:'http://localhost:9000/editor/save',
                    data:{
                        id:10002,
                        name:'test',
                        style:style,
                        html:totalElement.html(),
                        json:JSON.stringify(this.$data).replace('\'','’'),
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