[CmdletBinding()]
param([switch]$Force,[switch]$SkipDesign)
$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Skills = Join-Path $Root ".agents\skills"
$Agents = Join-Path $Root ".codex\agents"
$Licenses = Join-Path $Root ".codex\third-party-licenses"
$Cache = Join-Path $env:LOCALAPPDATA "CodexCareerSkillSources"
New-Item -ItemType Directory -Force $Skills,$Agents,$Licenses,$Cache | Out-Null
if (!(Get-Command git -ErrorAction SilentlyContinue)) {throw "Install Git first."}

function Get-Repo([string]$Name,[string]$Url) {
  $Dest=Join-Path $Cache $Name
  if (!(Test-Path $Dest)) {
    & git clone --depth 1 $Url $Dest
    if ($LASTEXITCODE -ne 0) {throw "clone failed: $Name"}
  } elseif (Test-Path (Join-Path $Dest ".git")) {
    & git -C $Dest pull --ff-only
    if ($LASTEXITCODE -ne 0) {throw "update failed: $Name"}
  } else {throw "Unexpected non-git cache: $Dest"}
  Write-Host "$Name -> $(& git -C $Dest rev-parse HEAD)"
  return $Dest
}
function Install-Directory([string]$From,[string]$Name) {
  if (!(Test-Path $From)) {throw "Missing source: $From"}
  $Dest=Join-Path $Skills $Name
  if (Test-Path $Dest) {
    if (!$Force) {Write-Host "SKIP $Name (already exists)";return}
    Remove-Item $Dest -Recurse -Force
  }
  Copy-Item -LiteralPath $From -Destination $Dest -Recurse -Force
  if ($Name -ne "hiring-common" -and !(Test-Path (Join-Path $Dest "SKILL.md"))) {throw "Missing SKILL.md: $Name"}
  Write-Host "INSTALLED $Name"
}
function Copy-License([string]$Path,[string]$Name) {
  $Source=Join-Path $Path "LICENSE"
  if (Test-Path $Source) {Copy-Item $Source (Join-Path $Licenses "$Name.LICENSE") -Force}
}
$Cover=Get-Repo "write-korean-cover-letter" "https://github.com/seolbbb/write-korean-cover-letter.git"
Install-Directory (Join-Path $Cover "write-korean-cover-letter") "write-korean-cover-letter"
Copy-License $Cover "write-korean-cover-letter"

$Tailor=Get-Repo "job-application-tailor" "https://github.com/kgyujin/job-application-tailor-skill.git"
$TailorDest=Join-Path $Skills "job-application-tailor"
if (!(Test-Path $TailorDest) -or $Force) {
  if (Test-Path $TailorDest) {Remove-Item $TailorDest -Recurse -Force}
  New-Item -ItemType Directory -Force $TailorDest | Out-Null
  Copy-Item (Join-Path $Tailor "SKILL.md") (Join-Path $TailorDest "SKILL.md")
  Copy-Item (Join-Path $Tailor "reference") (Join-Path $TailorDest "reference") -Recurse
  Write-Host "INSTALLED job-application-tailor"
} else {Write-Host "SKIP job-application-tailor"}
Copy-License $Tailor "job-application-tailor"

$Career=Get-Repo "Career-Skills" "https://github.com/techeer-sv/Career-Skills.git"
foreach($Name in @("portfolio-build","hiring-prep-doc-feedback","hiring-sim-resume-review","hiring-sim-resume-redteam","hiring-sim-portfolio-review","hiring-sim-portfolio-redteam","hiring-common")) {
  Install-Directory (Join-Path $Career "skills\$Name") $Name
}
Copy-License $Career "Career-Skills"

$Human=Get-Repo "im-not-ai" "https://github.com/epoko77-ai/im-not-ai.git"
$HumanDest=Join-Path $Skills "humanize-korean"
if (!(Test-Path $HumanDest) -or $Force) {
  if (Test-Path $HumanDest) {Remove-Item $HumanDest -Recurse -Force}
  New-Item -ItemType Directory -Force $HumanDest | Out-Null
  Copy-Item (Join-Path $Human "codex\skills\humanize-korean\SKILL.md") (Join-Path $HumanDest "SKILL.md")
  Copy-Item (Join-Path $Human "skills\humanize-korean\references") (Join-Path $HumanDest "references") -Recurse -Force
  New-Item -ItemType Directory -Force (Join-Path $HumanDest "scripts") | Out-Null
  foreach($Name in @("prepare_monolith_input.py","reassemble_chunks.py","verify_change_rate.py","verify_gates.py","restore_modality.py","strip_injected_commas.py","sanitize_text.py","checks.py","console.py")) {
    $Source=Join-Path $Human "scripts\$Name"
    if (!(Test-Path $Source)) {throw "Missing humanize runtime: $Source"}
    Copy-Item $Source (Join-Path $HumanDest "scripts\$Name")
  }
  Write-Host "INSTALLED humanize-korean (full references + runtime; no symlinks)"
} else {Write-Host "SKIP humanize-korean"}
Copy-License $Human "im-not-ai"

if (!$SkipDesign) {
  $Meng=Get-Repo "MengTo-Skills" "https://github.com/MengTo/Skills.git"
  foreach($Rel in @("ui\design-first-ui-prompting","web-design\editorial-tech","web-design\split-layout-technical","workflow\workflow-progress-screenshots","workflow\workflow-score-to-target")) {
    Install-Directory (Join-Path $Meng "agent-skills\$Rel") (Split-Path $Rel -Leaf)
  }
  Copy-License $Meng "MengTo-Skills"
  $Volt=Get-Repo "VoltAgent-Subagents" "https://github.com/VoltAgent/awesome-codex-subagents.git"
  foreach($Rel in @("categories/01-core-development/ui-designer.toml","categories/04-quality-security/anti-ui-slop-reviewer.toml","categories/04-quality-security/ui-ux-tester.toml","categories/04-quality-security/accessibility-tester.toml","categories/04-quality-security/code-reviewer.toml","categories/06-developer-experience/documentation-engineer.toml")) {
    $Dest=Join-Path $Agents (Split-Path $Rel -Leaf)
    if ((Test-Path $Dest) -and !$Force) {Write-Host "SKIP $(Split-Path $Dest -Leaf)";continue}
    $Text=Get-Content (Join-Path $Volt $Rel) -Raw -Encoding UTF8
    $Text=[regex]::Replace($Text,'(?m)^(model|model_reasoning_effort|sandbox_mode)\s*=.*\r?\n','')
    [System.IO.File]::WriteAllText($Dest,$Text,[System.Text.UTF8Encoding]::new($false))
    Write-Host "INSTALLED agent $(Split-Path $Dest -Leaf)"
  }
  Copy-License $Volt "VoltAgent-Subagents"
}
Write-Host "Installation complete. Run: python scripts/check-codex-skills.py"
Write-Host "Then reload VS Code and start a new Codex session."
