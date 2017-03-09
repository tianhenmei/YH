class YHEvent{
    constructor(){
        this.showElemements = $('[yh-show]')
        this.pageElemements = $('[yh-page]')
        this.initShowEvent()
        this.initPageEvent()
    }
    initShowEvent(){
        if(this.showElemements.length > 0){
            this.showElemements.on('touchstart',function(e){
                e.stopPropagation()
                e.preventDefault()
                let elemID = $(this)[0].attributes['yh-show'].value,
                    elem = document.getElementById(elemID),
                    display = window.getComputedStyle(elem,null).getPropertyValue('display')
                
                switch(display){
                    case 'none':
                        elem.style.display = 'block'
                        break
                    default:
                        elem.style.display = 'none'
                        break
                }
            })
        }
    }
    initPageEvent(){
        if(this.pageElemements.length > 0){
            this.pageElemements.on('touchstart',function(e){
                e.stopPropagation()
                e.preventDefault()
                let now = parseInt($(this)[0].attributes['yh-page'].value),
                    od = 'down'
                if(now != PM.data.now){
                    PM.data.direction.y = "up"
                    if(now < PM.data.now){
                        PM.data.direction.y = "down"
                        od = 'up'
                    }
                    PM.data.last = PM.data.now
                    PM.data.now = now
                    PM.data.clickStatus = true
                    PM.pageMove(od,PM)
                }
            })
        }
    }
}

initYHEvent()
function initYHEvent(){
    let hrefElement = $('[href^="show-"],[href^="page-"]'),
        href = [],
        i = 0
    for(i = 0; i < hrefElement.length; i++){
        href = hrefElement[i].attributes['href'].value.split('-')
        hrefElement[i].setAttribute('href','javascript:void(0);')
        hrefElement[i].setAttribute('yh-'+href[0],href[1])
    }
    if(hrefElement.length > 0){
        new YHEvent()
    }
}