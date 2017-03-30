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
            (function(classname,yhnumber){
                $('#'+id+' [yh-states]').on('click',function(e){
                    if($(this).hasClass('yh-invalid')){
                        return
                    }
                    switch(yhnumber){
                        case '1':
                            if(!$(this).hasClass(classname)){
                                $(this).addClass(classname)
                            }
                            break
                        case 'N':
                            if($(this).hasClass(classname)){
                                $(this).removeClass(classname)
                            }else{
                                $(this).addClass(classname)
                            }
                            break
                    }
                })
            })(elementState.classname,elementState['yh-number'])
            break
        case 'invalid':
            let now = new Date().getTime(),
                start = new Date(elementState['yh-valid-start']).getTime(),
                end = new Date(elementState['yh-valid-end']).getTime()
            if(now < start || now > end) {
                switch(elementState['yh-valid-type']){
                    case "stylechange":
                        $('#'+id+' [yh-states]').addClass(elementState.classname+' yh-invalid')
                        break
                    case "hide":
                        $('#'+id).hide()
                        $('#'+id+' [yh-states]').addClass('yh-invalid')
                        break
                }
            }
            break
    }
}