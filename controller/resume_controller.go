package controller

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"io"
	"log"
	"net/http"
	"os"
	"resume/bean"
	"strconv"
	"time"
)

type Resume = bean.Resume
type PersonMsg = bean.PersonMsg
type Education = bean.Education
type JobIntention = bean.JobIntention
type Skill = bean.Skill
type Practice = bean.Practice
type Project = bean.Project
type ProjectProcess = bean.ProjectProcess
type Evaluation = bean.Evaluation

var resumeMap = map[string]*Resume{}
var resumeTempMap = map[string]*Resume{}

const RESUME_PATH = "C:\\ProgramData\\resume.json"

func init() {
	engine := gin.Default()
	engine.Static("/static", "./static")
	engine.LoadHTMLGlob("static/template/*")

	engine.POST("/saveResume/:resumeName", func(context *gin.Context) {
		resume := Resume{}
		err := context.ShouldBind(&resume)
		if err == nil {
			resumeKey := context.Param("resumeName")
			resumeMap[resumeKey] = &resume
			err = storeResume()
			if err == nil {
				fmt.Println("简历保存成功")
				context.JSON(http.StatusOK, resumeKey)
				return
			}
		}
		fmt.Println(err)
		context.JSON(http.StatusBadRequest, err.Error())
	})

	engine.GET("/msg", func(context *gin.Context) {
		key := context.Query("resumeName")
		if key != "" {
			context.HTML(http.StatusOK, "msg.html", gin.H{
				"resume": resumeMap[key],
			})
		} else {
			context.HTML(http.StatusOK, "msg.html", gin.H{})
		}
	})

	engine.GET("/getResumes", func(context *gin.Context) {
		context.JSON(http.StatusOK, getResumesKey())
	})
	engine.GET("/delResume/:resumeName", func(context *gin.Context) {
		delete(resumeMap, context.Param("resumeName"))
		err2 := storeResume()
		if err2 == nil {
			context.JSON(http.StatusOK, "删除成功")
		} else {
			fmt.Println(err2)
			context.JSON(http.StatusBadRequest, "删除失败")
		}

	})
	engine.GET("/renameResume/:oldResumeName/:newResumeName", func(context *gin.Context) {
		fmt.Println(context.Param("newResumeName"), resumeMap[context.Param("oldResumeName")])
		resumeMap[context.Param("newResumeName")] = resumeMap[context.Param("oldResumeName")]
		delete(resumeMap, context.Param("oldResumeName"))
		err2 := storeResume()
		if err2 == nil {
			fmt.Println("改名成功")
			context.JSON(http.StatusOK, "改名成功")
		} else {
			fmt.Println(err2)
			context.JSON(http.StatusBadRequest, "改名失败")
		}
	})

	engine.GET("/editResume/:resumeName", func(context *gin.Context) {
		resume := resumeMap[context.Param("resumeName")]
		context.HTML(http.StatusOK, "msg.html", gin.H{
			"resume": resume,
		})
	})

	engine.GET("/previewResume/:resumeName", func(context *gin.Context) {
		resume, ok := resumeMap[context.Param("resumeName")]
		if !ok {
			resume, ok = resumeTempMap[context.Param("resumeName")]
			if !ok {
				context.HTML(http.StatusOK, "resume.html", gin.H{})
				return
			}
		}
		context.HTML(http.StatusOK, "resume.html", gin.H{
			"resume": resume,
		})
	})

	engine.GET("/", func(context *gin.Context) {
		context.HTML(http.StatusOK, "index.html", gin.H{
			"resumesKey": getResumesKey(),
		})
	})

	engine.POST("/saveTempResume", func(context *gin.Context) {
		resume := Resume{}
		err := context.ShouldBind(&resume)
		if err == nil {
			tempName := time.Now().Format("2006.01.02-15:04_") + strconv.FormatInt(time.Now().UnixMilli(), 10)
			resumeTempMap[tempName] = &resume
			fmt.Println("临时简历保存成功")
			context.JSON(http.StatusOK, tempName)
			return
		}
		fmt.Println(err)
		context.JSON(http.StatusBadRequest, err)
	})

	recoverResume()
	if err := engine.Run(":8899"); err != nil {
		log.Fatal(err.Error())
	}
}

func recoverResume() {
	file, err := os.OpenFile(RESUME_PATH, os.O_CREATE|os.O_RDONLY, os.ModePerm)
	if err == nil {
		all, err := io.ReadAll(file)
		if err == nil {
			err := json.Unmarshal(all, &resumeMap)
			if err == nil {
				fmt.Println("过往简历恢复成功")
				return
			}
		}
	}
	fmt.Println(err)
}
func getResumesKey() []string {
	resumeKeys := make([]string, 0, len(resumeMap))
	for k, _ := range resumeMap {
		resumeKeys = append(resumeKeys, k)
	}
	return resumeKeys
}
func storeResume() error {
	marshal, err := json.Marshal(&resumeMap)
	if err == nil {
		create, err := os.Create(RESUME_PATH)
		if err == nil {
			defer create.Close()
			_, err := create.Write(marshal)
			if err == nil {
				return nil
			}
		}
	}
	return err
}
