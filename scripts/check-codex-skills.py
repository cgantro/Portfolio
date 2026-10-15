from pathlib import Path
import re, sys
root=Path(__file__).resolve().parents[1]
base=root/".agents"/"skills"
names=["korean-technical-resume","korean-technical-portfolio","career-evidence-retrieval","portfolio-design-review","write-korean-cover-letter","job-application-tailor","portfolio-build","hiring-prep-doc-feedback","hiring-sim-resume-review","hiring-sim-resume-redteam","hiring-sim-portfolio-review","hiring-sim-portfolio-redteam","humanize-korean","design-first-ui-prompting","editorial-tech","split-layout-technical","workflow-progress-screenshots","workflow-score-to-target"]
errors=[]
for name in names:
 p=base/name/"SKILL.md"
 if not p.is_file():errors.append("MISSING "+name);continue
 t=p.read_text(encoding="utf-8")
 if not t.startswith("---") or not re.search(r"(?m)^name:\s*",t) or not re.search(r"(?m)^description:\s*",t):errors.append("BAD FRONTMATTER "+name)
print(f"Installed {len(names)-len(errors)}/{len(names)} expected skill manifests")
if errors:
 print("\n".join(errors))
 sys.exit(1)
print("PASS: manifests exist; runtime tests are separate.")
