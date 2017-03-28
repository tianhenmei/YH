<template>
    <div class="yh-edit-options yh-edit-image">
        <input type="file" content="background-image" accept="image/*" :mold="options.mold" @change="uploadFile" />
    </div>
</template>
<script>
    import MW from '../components/bus.js'
    export default {
        props:['options'],
        data(){
            return {

            }
        },
        methods:{
            uploadFile(e){
                let that = e.target,
                    file = that.files[0],
                    fileData = new FormData(),
                    self = this
                fileData.append('files',file,file.name);
                (function(self,that){
                    $.ajax({
                        type:'post',
                        url:MW.host+'editor/upload',
                        data:fileData,
                        dataType: 'JSON',  
                        cache: false,  
                        processData: false,  
                        contentType: false,
                        success(data){
                            var name = that.attributes['mold'].value
                            switch(name){
                                case 'src':
                                    self.imageChange(self,data.content)
                                    break
                                case 'bg':
                                    self.setBackgroundImage(self,data.content,'yh-button')
                                    break
                            }
                        },
                        error(error){
                            console.log(error.message);
                        }
                    });
                })(self,that)
            },
            imageChange(self,data){
                let elem = $('.setting'),
                    yhcontent = self.$root.$children[0].$refs['yh-content'],
                    src = MW.host+data.path
                yhcontent.addSettingBox(elem)
                self.$store.commit('setMultipleValue',[{
                    parent:'style',
                    stylename:'width',
                    actualValue:data.width / (750 / 16)+'rem',
                    designValue:data.width+'px'
                },{
                    parent:'style',
                    stylename:'height',
                    actualValue:data.height / (750 / 16)+'rem',
                    designValue:data.height+'px'
                },{
                    parent:'',
                    stylename:'src',
                    actualValue:src,
                    designValue:src
                }])
            },
            setBackgroundImage(self,data,childName){
                let elem = $('.setting'),
                    url = "url("+MW.host+data.path+")",
                    yhcontent = self.$root.$children[0].$refs['yh-content']

                yhcontent.addSettingBox(elem)
                self.$store.commit('setMultipleValue',[{
                    parent:'style',
                    stylename:'backgroundImage',
                    actualValue:url,
                    designValue:url
                },{
                    parent:'style',
                    stylename:'backgroundSize',
                    actualValue:'100% 100%',
                    designValue:'100% 100%'
                },{
                    parent:'style',
                    stylename:'width',
                    actualValue:data.width / (750 / 16)+'rem',
                    designValue:data.width+'px'
                },{
                    parent:'style',
                    stylename:'height',
                    actualValue:data.height / (750 / 16)+'rem',
                    designValue:data.height+'px'
                }])
            }
        }
    }
</script>
<style>
    .yh-edit-image {
        width: 20px;
        height: 20px;
        background: url(http://localhost:9000/static/images/icons.png) no-repeat -2px -194px;
    }
    .yh-edit-image input{
        width:20px;
        height:20px;
        display:block;
        opacity:0;
    }
</style>