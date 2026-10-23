from pathlib import Path
import re, sys
root=Path(__file__).resolve().parents[1]
base=root/".agents"/"skills"
names=['career-evidence-retrieval', 'design-first-ui-prompting', 'hiring-panel', 'hiring-sim-portfolio-redteam', 'hiring-sim-portfolio-review', 'hiring-sim-resume-redteam', 'job-application-tailor', 'job-hunter', 'korean-technical-portfolio', 'korean-technical-resume', 'linkedin-review', 'mock-interview', 'optimize-web-animations', 'portfolio-build', 'portfolio-content-audit', 'portfolio-design-review', 'write-korean-cover-letter']
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
