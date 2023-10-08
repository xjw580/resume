package bean

type Resume struct {
	PersonMsg    `form:"personMsg"`
	Educations   []Education `form:"educations"`
	JobIntention `form:"jobIntention"`
	Skills       []Skill    `form:"skills"`
	Practices    []Practice `form:"practices"`
	Projects     []Project  `form:"projects"`
	Evaluation   `form:"evaluation"`
}
type PersonMsg struct {
	PersonName  string `form:"personName"`
	Birthday    string `form:"birthday"`
	NativePlace string `form:"nativePlace"`
	Sex         string `form:"sex"`
	Email       string `form:"email"`
	Phone       string `form:"phone"`
	AvatarName  string `form:"avatarName"`
}
type Education struct {
	Time       string `form:"time"`
	SchoolName string `form:"schoolName"`
	Profession string `form:"profession"`
}
type JobIntention struct {
	JobIntentionContent string `form:"jobIntentionContent"`
}
type Skill struct {
	SkillTitle    string   `form:"skillTitle"`
	SkillContents []string `form:"skillContents"`
}
type Practice struct {
	PracticeContent string `form:"practiceContent"`
}
type Project struct {
	ProjectName        string           `form:"projectName"`
	ProjectDescription []string         `form:"projectDescription"`
	ProjectTechnology  []string         `form:"projectTechnology"`
	ProjectProcess     []ProjectProcess `form:"projectProcess"`
	Harvest            []string         `form:"harvest"`
}
type ProjectProcess struct {
	ProjectProcessTitle   string   `form:"projectProcessTitle"`
	ProjectProcessContent []string `form:"projectProcessContent"`
}
type Evaluation struct {
	EvaluationContent []string `form:"evaluationContent"`
}
