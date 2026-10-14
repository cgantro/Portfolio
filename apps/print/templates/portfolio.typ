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
  heading(level: 2, "MY ROLE")
  bullets(project.role)
  if "printImage" in project {
    block(above: 3mm, below: 3mm, image(project.printImage, width: 100%, height: 58mm, fit: "contain"))
  }
  heading(level: 2, "구현과 결과")
  for claim in project.contributions {
    list(claim.text + " [" + claim.evidenceIds.join(", ") + "]")
  }
  for metric in project.metrics {
    block(stroke: .5pt + rgb("bfdbfe"), inset: 3mm)[
      #strong(metric.label + ": " + str(metric.value) + " " + metric.unit)
      #par(text(size: 8pt, metric.conditions.join(" · ")))
      #text(size: 7pt, "[" + metric.evidenceIds.join(", ") + "]")
    ]
  }
  if project.limitations.len() > 0 {
    heading(level: 2, "검증 범위")
    text(size: 8pt, bullets(project.limitations))
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
#pagebreak()
= 프로젝트 근거
#set text(size: 7pt)
#for project in data.projects {
  heading(level: 2, project.title)
  for evidence in project.evidence {
    if evidence.status != "unverified" {
      par(evidence.id + " / " + evidence.label)
      if evidence.source.starts-with("https://") or evidence.source.starts-with("http://") {
        par(link(evidence.source, evidence.source))
      } else { par(evidence.source) }
      if "locator" in evidence { par(evidence.locator) }
    }
  }
}
