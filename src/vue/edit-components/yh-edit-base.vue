<template>
    <div class="yh-edit-base clearfix">
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
</template>
<script>
    import YHEditInput from './yh-edit-input'
    import YHEditOptions from './yh-edit-options'
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

    export default {
        components:{
            'yh-edit-input':YHEditInput,
            'yh-edit-options':YHEditOptions,
            'font-size':fontSize,
            'width':width,
            'height':height,
            'line-height':lineHeight,
            'border-width':borderWidth,
            'border-style':borderStyle,
            'color':color,
            'border':border,
            'box-shadow':boxShadow,
            'yh-edit-image':YHEditImage
        },
        props:['props','mold','without'],
        data(){
            this.getBoxShadow()
            return {
                style:this.props
            }
        },
        methods:{
            setValue(name,value,designValue,status = true){
                if(status){
                    let elem = $('.setting'),
                        content = elem.find('.kitty-button-content'),
                        button = elem.find('.yh-button')
                    
                    button.css(name,value)
                    this.style[name] = designValue
                }else{
                    this.style[name] = designValue
                }
            },
            setChangeStatus(status){
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
        }
    }
</script>