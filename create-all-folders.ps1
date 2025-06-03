# ────────────────────────────────────────────
# create-all-folders.ps1
# À lancer depuis C:\PROJETS-DEVELOPPEMENT\BlockR\BlockRApp
# ────────────────────────────────────────────

# 1) Racine du projet (script à la racine)
$BasePath = Split-Path -Parent $MyInvocation.MyCommand.Definition

# 2) Ta liste de dossiers à créer
$folders = @(
    "src\components\common",
    "src\components\contacts",
    "src\components\security",
    "src\screens\Home",
    "src\screens\Contacts",
    "src\screens\Blacklist",
    "src\screens\Schedule",
    "src\screens\Settings",
    "src\screens\Game",
    "src\screens\Auth",
    "src\navigation",
    "src\services",
    "src\store\slices",
    "src\i18n\translations",
    "src\theme",
    "src\utils",
    "src\types",
    "assets\images",
    "assets\fonts",
    "assets\sounds"
)

# 3) Création en boucle
foreach ($relativePath in $folders) {
    $fullPath = Join-Path $BasePath $relativePath
    # -Force crée tous les parents manquants et n’erreur pas si ça existe déjà
    New-Item -ItemType Directory -Force -Path $fullPath | Out-Null
}

Write-Host "✅ Tous les dossiers ont été créés sous '$BasePath' !" -ForegroundColor Green
