console.log(elementStates)
initElementStatesEvent()
function initElementStatesEvent(){
    for(let id in elementStates){
        for(let i = 0; i < elementStates[id].length; i++){
            setELementState(elementStates[id][i],id)
        }
    }
}
function setELementState(elementState,id){
    switch(elementState.type){
        case 'active':
            (function(classname,yhnumber,src){
                let current = $('#'+id+' [yh-states]')
                if(src){
                    current.attr('yh-old-src',current.attr('src'))
                }
                current.on('click',function(e){
                    if($(this).hasClass('yh-invalid')){
                        return
                    }
                    switch(yhnumber){
                        case '1':
                            if(!$(this).hasClass(classname)){
                                $(this).addClass(classname)
                                if(src){
                                    $(this).attr('src',src)
                                }
                            }
                            break
                        case 'N':
                            if($(this).hasClass(classname)){
                                $(this).removeClass(classname)
                                if(src){
                                    $(this).attr('src',$(this).attr('yh-old-src'))
                                }
                            }else{
                                $(this).addClass(classname)
                                if(src){
                                    $(this).attr('src',src)
                                }
                            }
                            break
                    }
                })
            })(elementState.classname,elementState['yh-number'],elementState['yh-src'])
            break
        case 'invalid':
            let now = new Date().getTime(),
                start = new Date(elementState['yh-valid-start']).getTime(),
                end = new Date(elementState['yh-valid-end']).getTime(),
                current = $('#'+id+' [yh-states]')
            if(now < start || now > end) {
                switch(elementState['yh-valid-type']){
                    case "stylechange":
                        current.addClass(elementState.classname+' yh-invalid')
                        if(elementState['yh-src']){
                            current.attr('src',elementState['yh-src'])
                        }
                        break
                    case "hide":
                        $('#'+id).hide()
                        current.addClass('yh-invalid')
                        break
                }
            }
            break
    }
}