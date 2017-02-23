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
                <p class="rotate"></p>
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
                <span id="delete" @click.stop="removeElement">x</span>
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
                drag:null,
                fontSize:16,
                distance:15,
                title:"It's title",
                count:1,
                pageAnimation:'move',
                moveStatus:false
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
            MW.bus.$on('focusSelection',() => {
                that.drag.status = false
            })
            MW.bus.$on('blurSelection',() => {
                that.drag.status = true
            })
            MW.bus.$on('updateContent',(content,styleJSON,elemID) => {
                let index = that.getIndex(elemID,that)

                if(!MW.moveStatus){
                    that.pages[that.currentPage].elements[index].props.content = content
                    if(Object.prototype.toString.call(styleJSON) == '[object Object]'){
                        that.pages[that.currentPage].elements[index].props.style = styleJSON
                    }
                }
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
                this.drag = new Drag({
                    outer:'.yh-components-content',
                    contain:'.yh-content-center',
                    move_box:'#yh-move-box',
                    elemPath:'.yh-content-center .page > div',
                    distance:15,
                    mousedownCallback:self.mousedownCallback,
                    firstMoveCallback:self.hideEditLayer,
                    mouseupCallback:self.mouseupCallback
                })
                
                // components_content.on('mouseenter','.page > div',function(e){
                //     $(this).children('.yh-edit-layer').show();
                // })
                // components_content.on('mouseleave','.page > div',function(e){
                //     $(this).children('.yh-edit-layer').hide();
                // })

                this.initRemoveEvent()
                this.initColorEvent()
                this.initSizeChangeEvent()
            },
            removeElement(e){
                var elem = $('.setting'),
                    elemID = elem.attr('id');
                
                var index = this.getIndex(elemID,this)
                this.pages[this.currentPage].elements.splice(index,1)
                // elem.remove();
                $('.yh-selection').hide()
            },
            initRemoveEvent(){
                // var self = this;
                // $(document).on('click','#delete',function(e){
                //     e.stopPropagation()
                //     var elem = $('.setting'),
                //         elemID = elem.attr('id');
                    
                //     var index = self.getIndex(elemID,self)
                //     self.pages[self.currentPage].elements.splice(index,1)
                //     elem.remove();
                // });
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
                let move_box = $('#yh-move-box'),
                    contentCenter = $('.yh-content-center')
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
                        top:0,
                        transform
                    },
                    start = { x:0, y:0 },
                    center = { x:0, y:0 },
                    end = { x:0, y:0 },
                    distance = 15,
                    transform = 0,
                    oangle = 0,
                    angle = 0,
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
                    center.x = data.width / 2 + data.left + contentCenter.offset().left
                    center.y = data.height / 2 + data.top + contentCenter.offset().top

                    transform = elem.find('[rotate]').css('transform')
                    oangle = transform == 'none' ? 0 : eval('self.get'+transform)

                    let parent = $(this).parent(),
                        isCenter = $(this).hasClass('center')

                    if($(this).hasClass('rotate')){
                        type = 'rotate'
                    }else{
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
                                '-webkit-transform':'rotateZ(0deg)',
                                'transform':'rotateZ(0deg)',
                                'display':'block'
                            });
                        }
                        MW.moveStatus = true
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
                            case 'rotate':  // 旋转
                                angle = (self.getAngle(center.x,center.y,end.x,end.y) + oangle) % 360
                                
                                move_box.css({
                                    '-webkit-transform':'rotateZ('+angle+'deg)',
                                    'transform':'rotateZ('+angle+'deg)'
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
                        last.transform = move_box.css('transform')

                        let index = self.getIndex(elemID,self)

                        self.pages[self.currentPage].elements[index].props.style.width = self.toRem(last.width);
                        self.pages[self.currentPage].elements[index].props.style.height = self.toRem(last.height);
                        self.pages[self.currentPage].elements[index].props.position.left = self.toRem(last.left);
                        self.pages[self.currentPage].elements[index].props.position.top = self.toRem(last.top);
                        self.pages[self.currentPage].elements[index].props.style.webkitTransform = last.transform
                        self.pages[self.currentPage].elements[index].props.style.transform = last.transform
                        MW.isMoving = true
                        self.distance = 0
                        self.settingBox(move_box)
                        self.distance = distance
                        // self.mousedownCallback($('.yh-content-center'),elem)
                    }
                    move_box.hide()
                    down = false
                    isMoving = false
                    MW.moveStatus = false
                })
            },
            /* 
            * 解析matrix矩阵，0°-360°，返回旋转角度 
            * 当a=b||-a=b,0<=deg<=180 
            * 当-a+b=180,180<=deg<=270 
            * 当a+b=180,270<=deg<=360 
            * 
            * 当0<=deg<=180,deg=d; 
            * 当180<deg<=270,deg=180+c; 
            * 当270<deg<=360,deg=360-(c||d); 
            * */  
            getmatrix(a,b,c,d,e,f){  
                var aa = Math.round(180*Math.asin(a)/ Math.PI);  
                var bb = Math.round(180*Math.acos(b)/ Math.PI);  
                var cc = Math.round(180*Math.asin(c)/ Math.PI);  
                var dd = Math.round(180*Math.acos(d)/ Math.PI);  
                var deg=0;  
                if(aa == bb || -aa == bb){  
                    deg = dd;  
                }else if(-aa + bb == 180){  
                    deg = 180 + cc;  
                }else if(aa + bb == 180){  
                    deg = 360 - cc || 360 - dd;  
                }  
                return deg >= 360 ? 0 : deg;  
                //return (aa+','+bb+','+cc+','+dd);  
            },
            getAngle(centerX,centerY,clientX,clientY){
                var x = Math.abs(centerX - clientX );
                var y = Math.abs(centerY - clientY);
                var z = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
                var cos = y / z;
                var radina = Math.acos(cos);//用反三角函数求弧度
                var angle = Math.floor(180/(Math.PI/radina));//将弧度转换成角度

                if( clientX > centerX && clientY > centerY ){//鼠标在第四象限
                    angle = 180 - angle;
                }
                if( clientX == centerX && clientY > centerY ){//鼠标在y轴负方向上
                    angle = 180;
                }
                if( clientX > centerX && clientY == centerY ){//鼠标在x轴正方向上
                    angle = 90;
                }
                if( clientX < centerX && clientY > centerY ){//鼠标在第三象限
                    angle = 180+angle;
                }
                if( clientX < centerX && clientY == centerY ){//鼠标在x轴负方向
                    angle = 270;
                }
                if( clientX < centerX && clientY < centerY ){//鼠标在第二象限
                    angle = 360 - angle;
                }
                return angle;
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
                                        self.pages[i].elements[j].props.content = self.pages[i].elements[j].props.content.replace(/(\~\|)/g,'"').replace(/[’‘]/g,'\'')
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
                                    switch(data.pages[i].elements[j].module){
                                        case 'text':
                                            data.pages[i].elements[j].props.content = data.pages[i].elements[j].props.content.replace(/"/g,'~|')
                                            break
                                    }
                                }
                            }
                            break;
                        case 'drag':
                            break
                        default:
                            data[attr] = this.$data[attr]
                            break
                    }
                }
                $.ajax({
                    type:'post',
                    url:'http://localhost:9000/editor/save',
                    data:{
                        id:10002,
                        name:'test',
                        style:style,
                        html:totalElement.html().replace(/\'/g,'‘'),
                        json:JSON.stringify(data).replace(/\'/g,'‘'),
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