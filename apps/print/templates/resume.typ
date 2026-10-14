// A genuine one-page resume candidate; no reconstructed or synthetic metrics.
#let resume = json("resume.json")
#set document(title: resume.basics.name + " | " + resume.basics.label, author: resume.basics.name)
#set page(paper: "a4", margin: (x: 16mm, y: 13mm))
#set text(font: ("Malgun Gothic", "Noto Sans KR", "Arial"), size: 8.3pt, lang: "ko", fill: rgb("152033"))
#set par(leading: .48em, spacing: 2.3mm)
#show heading.where(level: 1): it => block(above: 0mm, below: 1.5mm, text(size: 23pt, weight: "bold", it.body))
#show heading.where(level: 2): it => block(above: 3.5mm, below: 1.5mm, text(size: 10pt, weight: "bold", fill: rgb("1d4ed8"), it.body))
#show heading.where(level: 3): it => block(above: 2.5mm, below: 1mm, text(size: 9pt, weight: "bold", it.body))
= #resume.basics.name
#text(size: 11pt, resume.basics.label)
#par(link("mailto:" + resume.basics.email, resume.basics.email) + "  |  " + link(resume.basics.url, resume.basics.url))
#line(length: 100%, stroke: .8pt + rgb("1d4ed8"))
#par(resume.basics.summary)
== 프로젝트 경험
#for project in resume.projects {
  heading(level: 3, project.name)
  let period = project.at("startDate", default: "") + " - " + project.at("endDate", default: "진행 중")
  text(size: 7.3pt, fill: rgb("64748b"), period + " | " + project.roles.join(" / "))
  par(project.description)
  for highlight in project.highlights.slice(0, calc.min(2, project.highlights.len())) { list(highlight) }
  text(size: 7pt, project.keywords.join(" · "))
}
== 기술
#for skill in resume.skills { par(strong(skill.name + ": ") + skill.keywords.join(" · ")) }
== 교육
#for education in resume.education { par(strong(education.institution) + " / " + education.area + " / " + education.at("startDate", default: "") + " - " + education.at("endDate", default: "")) }
== 자격
#par(resume.certificates.map(item => item.name + " (" + item.at("date", default: "") + ")").join(" · "))
