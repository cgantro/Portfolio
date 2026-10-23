// Comparative output using the identical validated canonical content.
#let data = json("portfolio.data.json")
#set document(title: data.profile.name + " | " + data.edition.headline, author: data.profile.name)
#set page(paper: "a4", margin: (x: 18mm, y: 18mm), footer: context align(right, text(size: 8pt, fill: rgb("64748b"))[홍윤표 / #counter(page).display("1")]))
#set text(font: ("Malgun Gothic", "Noto Sans KR", "Arial"), size: 9pt, lang: "ko", fill: rgb("152033"))
#set par(leading: .65em)
#set heading(numbering: none)
#show heading.where(level: 1): it => block(above: 4mm, below: 4mm, text(size: 26pt, weight: "bold", it.body))
#show heading.where(level: 2): it => block(above: 4mm, below: 2mm, text(size: 12pt, weight: "bold", it.body))
#let lines(items) = { for item in items { par(item) } }
#let bullets(items) = { for item in items { list(item) } }
#text(fill: rgb("1d4ed8"), size: 8pt)[PROJECT PORTFOLIO]
#v(14mm)
= #data.profile.name
#text(size: 12pt, data.profile.nameEn)
#v(20mm)
#line(length: 100%, stroke: 1.5pt + rgb("1d4ed8"))
== #data.edition.headline
#text(size: 13pt, data.profile.tagline)
#v(8mm)
#lines(data.profile.summary)
#v(10mm)
#if data.profile.email != "" { link("mailto:" + data.profile.email, data.profile.email) }
#par(link(data.profile.github, data.profile.github))
#v(14mm)
#data.edition.label
#pagebreak()
= 프로젝트와 기술
#for project in data.projects {
  heading(level: 2, project.title)
  par(project.subtitle)
  text(size: 8pt, fill: rgb("64748b"), project.period)
  par(project.stack.join(" · "))
}
#for project in data.projects {
  pagebreak()
  heading(level: 1, project.title)
  text(size: 12pt, project.subtitle)
  par(project.period + " / " + project.category)
  text(size: 8pt, fill: rgb("1d4ed8"), project.stack.join(" · "))
  lines(project.summary)
  heading(level: 2, "담당한 일")
  bullets(project.role)
  if "printImage" in project {
    block(above: 3mm, below: 3mm, image(project.printImage, width: 100%, height: 58mm, fit: "contain"))
  }
  heading(level: 2, "핵심 구현")
  if project.sharedMetricConditions.len() > 0 {
    par(strong("공통 조건: ") + project.sharedMetricConditions.join(" · "))
  }
  for metric in project.metrics {
    block(stroke: .5pt + rgb("bfdbfe"), inset: 3mm)[
      #strong(metric.label + ": " + str(metric.value) + (if "rangeMax" in metric { "–" + str(metric.rangeMax) } else { "" }) + " " + metric.unit)
      #if metric.conditions.len() > 0 { par(text(size: 8pt, metric.conditions.join(" · "))) }
    ]
  }
  if project.links.github != none { par(link(project.links.github, project.links.github)) }
}
#pagebreak()
= 학습과 경험
#for item in data.timeline {
  if item.type == "edu" or item.type == "cert" or item.type == "work" {
    heading(level: 2, item.title)
    text(size: 8pt, item.period)
    par(item.detail)
    if "note" in item { par(item.note) }
  }
}
