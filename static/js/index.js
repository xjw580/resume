function edit(resumeName){
    window.open(`/editResume/${resumeName}`)
}
function show(resumeName){
    window.open(`/previewResume/${resumeName}`)
}
function del(resumeName, className){
    $.get(`/delResume/${resumeName}`, {}, res => {
        console.log(res)
        $(`.${className}`).remove()
    })
}
function rename(oldResumeName, newNameclassName, oldNameClassName){
    let newValue = $(`.${newNameclassName}`)[0].value;
    if (newValue == null || newValue === ""){
        alert("新名字不能为空")
        return
    }
    $(`.${oldNameClassName}`)[0].value;
    $.get(`/renameResume/${oldResumeName}/${newValue}`, {}, res => {
        console.log(res)
        $(`.${oldNameClassName}`)[0].innerHTML = newValue
        $(`.${newNameclassName}`)[0].value = ""
    })
}
function generate(){
    window.open(`/msg`)
}