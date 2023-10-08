function selectAvatar(){
    $("#avatarFile").click()
}
function changeAvatar(){
    let reader = new FileReader();
    reader.readAsDataURL($("#avatarFile")[0].files[0]);
    reader.onloadend = () => {
        $("#avatar").prop("src", reader.result)
    }
}

function save(){
    let resumeName = prompt("为简历命名，注意不要和之前的简历名重复，否则会直接覆盖")
    $.ajax({
        url: `/saveResume/${resumeName}`,
        data: JSON.stringify(collectResumeMsg()),
        method: "post",
        dataType: "json",
        contentType: 'application/json',
        success: data => {
            console.log("保存成功", data)
            alert("保存成功")
            window.open(`/previewResume/${data}`)
        },
    })
}

function preview(){
    $.ajax({
        url: `/saveTempResume`,
        data: JSON.stringify(collectResumeMsg()),
        method: "post",
        dataType: "json",
        contentType: 'application/json',
        success: data => {
            window.open(`/previewResume/${data}`)
        },
    })
}
const collect = {
    collectEducations: () => {
        let educations = []
        let $educationsChildren = $("#educations").children();
        for (let i = 0; i < $educationsChildren.length; i++) {
            educations[i] = {
                "time": $educationsChildren[i].children[0].children[0].value,
                "schoolName": $educationsChildren[i].children[1].children[0].value,
                "profession": $educationsChildren[i].children[2].children[0].value
            }
        }
        return educations
    },
    collectSkills: () => {
        let skills = []
        let $skillsChildren = $("#skills").children();
        for (let i = 0; i < $skillsChildren.length; i++) {
            let skillContents = []
            for (let j = 0; j < $skillsChildren[i].children[2].children.length; j++) {
                skillContents[j] = $skillsChildren[i].children[2].children[j].children[0].value
            }
            skills[i] = {
                "skillTitle":$skillsChildren[i].children[0].value,
                "skillContents":skillContents
            }
        }
        return skills
    },
    collectProjects: () => {
        let projects = []
        let $projectsChildren = $("#projects").children();
        for (let i = 0; i < $projectsChildren.length; i++) {
            // 项目描述
            let projectDescription = []
            let child4 = $projectsChildren[i].children[2];
            for (let j = 0; j < child4.children.length; j++) {
                projectDescription[j] = child4.children[j].children[0].value
            }
            // 技术框架
            let projectTechnology = []
            let child = $projectsChildren[i].children[4].children[0];
            for (let j = 0; j < child.children.length; j++) {
                projectTechnology[j] = child.children[j].children[0].value
            }
            //实现流程
            let projectProcess = []
            let child1 = $projectsChildren[i].children[6].children[0];
            for (let j = 0; j < child1.children.length; j++) {
                let projectProcessContent = []
                let child2 = child1.children[j].children[1];
                for (let k = 0; k < child2.children.length; k++) {
                    projectProcessContent[k] = child2.children[k].children[0].value
                }
                projectProcess[j] = {
                    "projectProcessTitle":child1.children[j].children[0].children[0].value,
                    "projectProcessContent":projectProcessContent
                }
            }
            // 项目收获
            let harvest = []
            let child3 = $projectsChildren[i].children[9];
            for (let j = 0; j < child3.children.length; j++) {
                harvest[j] = child3.children[j].children[0].value
            }
            projects[i] = {
                "projectName": $projectsChildren[i].children[0].children[0].value,
                "projectDescription": projectDescription,
                "projectTechnology": projectTechnology,
                "projectProcess": projectProcess,
                "harvest": harvest
            }
        }
        return projects
    },
    collectEvaluationContent: () => {
        let evaluationContent = []
        let $evaluationChildren = $("#evaluation").children();
        for (let i = 0; i < $evaluationChildren.length; i++) {
            evaluationContent[i] = $evaluationChildren[i].children[0].value
        }
        return evaluationContent
    }
}
function collectResumeMsg(){
    return {
        "personName": $("#nameText").val(),
        "birthday": $("#birthdayText").val(),
        "nativePlace": $("#nativePlaceText").val(),
        "sex": $("#sexText").val(),
        "email": $("#emailText").val(),
        "phone": $("#phoneText").val(),
        "avatarName": $("#avatar").prop("src"),
        "educations": collect.collectEducations(),
        "jobIntentionContent": $("#jobIntentionText").val(),
        "skills": collect.collectSkills(),
        "projects":collect.collectProjects(),
        "evaluationContent":collect.collectEvaluationContent()
    }
}

let count = 1000;
function add(index){
    add(index, null)
}
function add(index, className){
    switch (index){
        case 1:
            $("#education").append(getEducationElement())
            count++
            break
        case 2:
            $("#skills").append(getSkillElement())
            count++
            break
        case 3:
            $(`.${className}`).append(getSkillContentElement())
            count++
            break
        case 4:
            $("#projects").append(getProjectElement())
            count++
            break
        case 5:
            $(`.${className}`).append(getProjectTechnologyElement())
            count++
            break
        case 6:
            $(`.${className}`).append(getProjectProcessContentElement())
            count++
            break
        case 7:
            $(`.${className}`).append(getProjectProcessElement())
            count++
            break
        case 8:
            $(`.${className}`).append(getHarvestElement())
            count++
            break
        case 9:
            $("#evaluation").append(getEvaluationElement())
            count++
            break
    }
}

function del(className){
    $(`.${className}`).remove()
}

function getEducationElement(){
    return `<li  class="education education${count}">
                <div>
                    起止时间：<input class="shortText timeText" type="text">
                </div>
                <div>
                    学校：<input class="shortText schoolText" type="text">
                </div>
                <div>
                    专业：<input class="shortText professionText" type="text">
                </div>
                <button class="del" onclick="del('education${count}')" style="max-width: 130px">
                    删除该条教育背景
                </button>
            </li>`
}
function getSkillElement(){
    return `<div class="listTitle${count}">
                <input type="text" class="listTitle shortText">
                <button class="del" onclick="del('listTitle${count}')">
                    删除该条专业技能
                </button>
                <ul class="skillContentsOuter${count}">
                    ${getSkillContentElement()}
                </ul>
                <button class="add" onclick="add(3, 'skillContentsOuter${count}')" title="新添加一列" style="margin-left: 30px">添加一行</button>
            </div>`
}
function getSkillContentElement(){
    return `<li class="skillContents${count}" style="margin-top: 20px">
                <input type="text" class="longText">
                <button class="del" onclick="del('skillContents${count}')">
                    删除本行
                </button>
            </li>`
}
function getProjectElement(){
    return `<div class="project${count}">
                <div class="listBigTitle">
                    项目名称：<input class="shortText" type="text">
                    <button class="del" onclick="del('project${count}')">删除该条项目经历</button>
                </div>
                <div class="listTitle">一、项目介绍</div>
                <div class="projectDescription${count}">
                    ${getProjectDescriptionElement()}
                </div>
                <center>
                    <button class="add" onclick="add(5, 'projectDescription${count}')" title="新添加一列">添加项目介绍</button>
                </center>
                <div class="listTitle">二、技术框架</div>
                <div>
                    <ul class="projectTechnologyOuter${count}">
                        ${getProjectTechnologyElement()}
                    </ul>
                    <center>
                        <button class="add" onclick="add(5, 'projectTechnologyOuter${count}')" title="新添加一列">添加技术框架</button>
                    </center>
                </div>
                <div class="listTitle">三、实现流程</div>
                <div>
                    <ul class="projectProcessOuter${count}">
                        ${getProjectProcessElement()}
                    </ul>
                </div>
                <center>
                    <button class="add" onclick="add(7, 'projectProcessOuter${count}')" title="新添加一列">添加实现流程</button>
                </center>
                <div class="listTitle">四、项目收获</div>
                <div class="harvestOuter${count}">
                    ${getHarvestElement()}
                </div>
                <center>
                    <button class="add" onclick="add(8, 'harvestOuter${count}')" title="新添加一列">添加项目收获</button>
                </center>
            </div>`
}
function getProjectDescriptionElement(){
    return `<div class="projectDescription${count}">
                <input class="longText" type="text">
                <button class="del" onclick="del('projectDescription${count}')">
                    删除该条项目介绍
                </button>
            </div>`
}
function getProjectTechnologyElement(){
    return `<li class="projectTechnology${count}">
                <input class="longText" type="text">
                <button class="del" onclick="del('projectTechnology${count}')">
                    删除该条技术框架
                </button>
            </li>`
}
function getProjectProcessElement(){
    return `<div class="projectProcess${count}">
                <li style="margin-top: 20px">
                    <input type="text" class="shortText">
                    <button class="del" onclick="del('projectProcess${count}')">
                        删除该条实现流程
                    </button>
                </li>
                <div class="projectProcessContentOuter${count}">
                    ${getProjectProcessContentElement()}
                </div>
                <button class="add" onclick="add(6, 'projectProcessContentOuter${count}')" title="新添加一列" style="margin-left: 30px">添加一行</button>
            </div>`
}
function getProjectProcessContentElement(){
    return `<div class="text projectProcessContent${count}">
                <input type="text" class="longText">
                <button class="del" onclick="del('projectProcessContent${count}')">
                    删除该行
                </button>
            </div>`
}
function getHarvestElement(){
    return `<div class="harvest${count}">
                <input class="longText" type="text">
                <button class="del" onclick="del('harvest${count}')">
                    删除该条项目收获
                </button>
            </div>`
}
function getEvaluationElement(){
    return `<div class="evaluation${count}">
                <input class="longText" type="text">
                <button class="del" onclick="del('evaluation${count}')">
                    删除该条自我评价
                </button>
            </div>`
}