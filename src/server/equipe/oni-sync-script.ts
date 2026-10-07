// Script PowerShell d'Oni Sync (Windows PowerShell 5.1, présent sur tout Windows 10/11), emballé dans Oni-Sync.cmd par rl-sync.ts.
// Oni Sync vit dans la zone de notification (à côté de l'horloge), sans fenêtre : clic droit sur l'icône pour le journal ou Quitter.
// 1. trouve Rocket League (Epic ou Steam) et active l'API Stats du jeu si elle est coupée (PacketSendRate), fichier réécrit SANS BOM :
//    un BOM devant « [TAGame.MatchStatsExporter_TA] » rend la section illisible pour le jeu et l'API reste coupée (bug de la v1) ;
// 2. se connecte au jeu en local (127.0.0.1 puis ::1, port de DefaultStatsAPI.ini, 49123 par défaut) ;
// 3. à chaque fin de partie, envoie le dernier état et l'événement de fin, bruts, au site du club ;
// 4. (v6) envoie au site les replays que le joueur sauvegarde (dossier Demos du jeu) : stats avancées et rang via ballchasing ;
// 5. signale au site son état (lancé, connecté au jeu, partie quittée avant la fin) : Inside > Tracker l'affiche, ce qui permet d'aider à distance.
// Aucun accès à la mémoire du jeu, aucune injection : seulement ce que Rocket League publie lui-même.
// Pas de backtick ni de « ${ » dans ce texte (gabarit TypeScript).
export const ONI_SYNC_VERSION = '6';
// Logo Oni Korp (64 px, PNG) pour l'icône de la zone de notification
export const ONI_ICON = 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEzElEQVR4nO2aT1IbRxjFX0sbFyyMl9iuUm8g2Vk3iHwCkxOgnMC6AfIJIp/A5AQhJ7C4gdglZtNUYbI0LOwdar9v0IgR6p5pofmEMfyqBnXzjd73+s0fTZVk8MB5DIDbg+YxAG4zfGnbjWcjd87hT0dobTMBnG7ZtjHYefHJ9fET8nnb9r3HwctjN+I0YyaAqx38W/77dXGnOpBwm0085bCUzX/dIV9qR/oD/qMx5n3xABtuUyQAeL/ngXOWKkP4/1drAbS8R5vbBjws32uR4dsG/N+CvDg+4duuvXAIf+VnxCFYdPzjGg0cMqwhEpguXvwY8y4awNm23fHe/83hBLPfaOIdBxh7vKITCnHzsBSUce2EAghSWMjnrZbnP0ZcjQMgr6OGwRHHGF9iD/BdTOAZ8PvzT+6Aw4ysWRE2dmzc4vBOuH0ACRhzwvdYFDDcZjibOwtWi2YAN4++kDW7Ca/tzniMfRpocbpSVALgkec9o7sZuGdkzWJUCucYc+Q9znndOb7BgXDueNd3mPDkCUbyGVylqRFArhkiWhCqhNfWzTNZFIfJVGnmZu9FAGXCObycfuPLCU8/B5Kqea8C4CI7/LjZ5c4WxMB3UOQWZu9VABpmNTRDRAtCqrCGWQ3NENGCkCqsYVZDM0S0IKQKa5jV0AwRLQipwhpmNTRDRAtCqrCGWQ3NENGCkCqsYVZDM0S0IKQKa5jV0AwRLQipwhpmNTRDRAtCqrCGWQ3NENGCkCqsYVZDM0S0IKQKa5jV0AwRLQipwhpmNTRDRAtCqrCGWQ3NENGCkCqsYVZDM0S0IKQKa5jV0AwRLQipwhpmNTRDRAtCqrCGWQ3NENGCkCqsYVZDM0S0IKQKa5jV0AwRLQipwhpmNTRDRAtCqrCGWQ3NENGCkCqsYVZDM0S0IKQKa5jV0AwRLQipwhpmNTRDRAtCqrCGWQ3NENGCkCqsYTam6WEu+FV3//l/bsBpRpmm7P/y2G1wGCRrFoMmDmjiDYdBqsxOqSkALub9+jr6xW+kr76X9B85DGPMP+y9w1GQrFmMKvEyszMsGQAXfthsZj9wcJhAb/byEh/mvoi9QaNpXvN9Q0TImpVxumW7bPKBwzlCZoPcNgCAvdEr/qxFfuz47Rvesl8fFTC4P3j676ME6leT/W4IGLBpi9MpM2ZrDoDBt2l+xOGU0227yz4D7rDBaRxjRGQmuBjcLx1ZqPfo8Yx4yunUrPwfNQdQhKc7L0X8iYqf5vGIXxiDQd4rhblmVdCM9WP0vfe7uVmtAKTXeMyFe7/DaSnGmL8MPx02C/eJFKbNFoXmOmw2BKk7gPw6Z8g828pPdx51uUH2cy+LQv3lqTMAb0yXpvrUsyiBC7/gS4/3iX0sAXstz+SI9Wh6j9N5FgggCeqtrWFQfB64LbUEkMPLQq7ZAYN4w+k1NFxLAHyo4VNgj6e7Q03UGkAOg+hMgnjFKbssGYAxR5OFD1EzKgHknP1iewyibwofTYsEINc5Fz7z3F83qgEIcn/4+hWWN6sRp8kBcPFzz/0aqAdwk6oAuHD5WOvydHdYASsPIPZYDT6+8nSXhQ+xQlYeQI48O3g+VnPItV/fI1bNnQUgyP2BL9C+zsu40wB+BB4D4PagefABfAeu9hyMASqlYQAAAABJRU5ErkJggg==';
export const ONI_SYNC_PS = String.raw`
$ErrorActionPreference = 'Continue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
$Token = '__TOKEN__'
$Api = '__API__'
$Pseudo = '__PSEUDO__'
$Site = '__SITE__'
$Version = '__VERSION__'

# ---------- Installation (depuis la v4) : jamais de fenêtre de console ----------
# Oni-Sync.cmd ne sert qu'une fois : il copie le script dans %LOCALAPPDATA%\OniSync, crée le raccourci « Oni Sync »
# (Bureau et menu Démarrer) puis relance Oni Sync sans console. Le raccourci passe par « conhost --headless » :
# Windows ne montre aucune fenêtre, même brièvement. ONI_SYNC_HOME : dossier d'essai (tests), au lieu du vrai dossier.
$dir = if ($env:ONI_SYNC_HOME) { $env:ONI_SYNC_HOME } else { Join-Path $env:LOCALAPPDATA 'OniSync' }
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$ps1 = Join-Path $dir 'oni-sync.ps1'
$conhost = Join-Path $env:WINDIR 'System32\conhost.exe'
function Silent-Args { return '--headless powershell.exe -NoProfile -STA -ExecutionPolicy Bypass -File "' + $ps1 + '"' }
function Make-Shortcut($folder) {
  $w = New-Object -ComObject WScript.Shell
  $l = $w.CreateShortcut((Join-Path $folder 'Oni Sync.lnk'))
  if (Test-Path $conhost) { $l.TargetPath = $conhost; $l.Arguments = (Silent-Args) }
  else { $l.TargetPath = 'powershell.exe'; $l.Arguments = '-NoProfile -STA -WindowStyle Hidden -ExecutionPolicy Bypass -File "' + $ps1 + '"' }
  $l.WorkingDirectory = $dir; $l.Description = 'Oni Sync : tracker Rocket League du club Oni Korp'
  if (Test-Path (Join-Path $dir 'oni.ico')) { $l.IconLocation = (Join-Path $dir 'oni.ico') }
  $l.Save()
}
if ($env:ONI_SYNC_FILE) {
  $src = [IO.File]::ReadAllText($env:ONI_SYNC_FILE, [Text.Encoding]::UTF8)
  [IO.File]::WriteAllText($ps1, $src.Substring($src.IndexOf('#ONI' + 'PS') + 6), (New-Object Text.UTF8Encoding $true))
  # Icône du raccourci : le logo Oni
  try {
    Add-Type -AssemblyName System.Drawing
    $bm = New-Object System.Drawing.Bitmap 64, 64; $gg = [System.Drawing.Graphics]::FromImage($bm)
    $lg = [System.Drawing.Image]::FromStream((New-Object IO.MemoryStream(,[Convert]::FromBase64String('__ICON__'))))
    $gg.DrawImage($lg, 0, [int]((64 - 64 * $lg.Height / $lg.Width) / 2), 64, [int](64 * $lg.Height / $lg.Width)); $gg.Dispose()
    $fs = [IO.File]::Create((Join-Path $dir 'oni.ico')); [System.Drawing.Icon]::FromHandle($bm.GetHicon()).Save($fs); $fs.Close()
  } catch {}
  # Une ancienne version qui tourne encore est arrêtée (nouvelle clé ou nouvelle version)
  Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" -ErrorAction SilentlyContinue | Where-Object { $_.ProcessId -ne $PID -and $_.CommandLine -like '*oni-sync.ps1*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
  $places = if ($env:ONI_SYNC_HOME) { @($dir) } else { @([Environment]::GetFolderPath('Desktop'), [Environment]::GetFolderPath('Programs')) }
  foreach ($f in $places) { try { Make-Shortcut $f } catch {} }
  $startupLnk = Join-Path ([Environment]::GetFolderPath('Startup')) 'Oni Sync.lnk'
  if (-not $env:ONI_SYNC_HOME -and (Test-Path $startupLnk)) { try { Make-Shortcut ([Environment]::GetFolderPath('Startup')) } catch {} }
  $old = Join-Path ([Environment]::GetFolderPath('Startup')) 'Oni-Sync.cmd'; if (-not $env:ONI_SYNC_HOME -and (Test-Path $old)) { Remove-Item $old -Force }
  $env:ONI_SYNC_FILE = $null  # sinon le processus relancé hériterait de la variable et se réinstallerait
  if (Test-Path $conhost) { Start-Process $conhost -ArgumentList (Silent-Args) -WindowStyle Hidden } else { Start-Process powershell.exe -ArgumentList ('-NoProfile -STA -WindowStyle Hidden -ExecutionPolicy Bypass -File "' + $ps1 + '"') -WindowStyle Hidden }
  exit
}

# Une seule instance à la fois
$created = $false
$mutex = New-Object System.Threading.Mutex($true, $(if ($env:ONI_SYNC_HOME) { 'OniKorpOniSyncEssai' } else { 'OniKorpOniSync' }), [ref]$created)
if (-not $created) { [System.Windows.Forms.MessageBox]::Show('Oni Sync tourne déjà : son icône est dans la zone de notification, à côté de l''horloge (flèche ^).', 'Oni Sync') | Out-Null; exit }

# ---------- Journal (gardé dans %LOCALAPPDATA%\OniSync) ----------
$journal = Join-Path $dir 'journal.txt'
if ((Test-Path $journal) -and (Get-Item $journal).Length -gt 300000) { Remove-Item $journal -Force }
function Log($t) { try { [IO.File]::AppendAllText($journal, ((Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + '  ' + $t + [Environment]::NewLine), (New-Object Text.UTF8Encoding $false)) } catch {} }

# ---------- Icône ----------
# Logo Oni Korp centré sur un carré transparent
$bmp = New-Object System.Drawing.Bitmap 64, 64
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = 'HighQualityBicubic'
try {
  $logo = [System.Drawing.Image]::FromStream((New-Object IO.MemoryStream(,[Convert]::FromBase64String('__ICON__'))))
  $h = [int](64 * $logo.Height / $logo.Width)
  $g.DrawImage($logo, 0, [int]((64 - $h) / 2), 64, $h)
} catch { $g.Clear([System.Drawing.Color]::FromArgb(200, 30, 25)) }
$g.Dispose()
$tray = New-Object System.Windows.Forms.NotifyIcon
$tray.Icon = [System.Drawing.Icon]::FromHandle($bmp.GetHicon())
$tray.Text = 'Oni Sync : démarrage'
$tray.Visible = $true
# Notifications Windows : seulement ce qui demande d'agir, et une seule fois par message (pas à chaque partie)
$global:tipped = @{}
function Tip($title, $text, $kind) { if ($global:tipped[$text]) { return }; $global:tipped[$text] = $true; try { $tray.ShowBalloonTip(5000, $title, $text, $kind) } catch {} }
function Status($t) { $s = 'Oni Sync : ' + $t; if ($s.Length -gt 63) { $s = $s.Substring(0, 63) }; $tray.Text = $s; $global:statusText = $t }

# ---------- Signal au site (état, pour aider à distance) ----------
function Hello($state, $note) {
  try {
    $body = (@{ hello = @{ state = $state; note = $note; version = $Version } } | ConvertTo-Json -Compress)
    return Invoke-RestMethod -Method Post -Uri $Api -Headers @{ Authorization = ('Bearer ' + $Token) } -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($body)) -TimeoutSec 10
  } catch { Log ('Signal au site impossible : ' + $_.Exception.Message) }
}

# ---------- Nouvelle version ----------
# Le site répond au signal de démarrage avec la dernière version. Pas de mise à jour automatique (un script qui se
# télécharge et se relance seul ressemble à un virus pour Windows Defender) : une seule notification, le joueur retélécharge.
function Check-Version($latest) {
  if ($latest -and [string]$latest -ne $Version) { Log ('Nouvelle version disponible : v' + $latest); Tip 'Oni Sync : nouvelle version' ('La version ' + $latest + ' est sortie : retélécharge Oni Sync dans Inside > Tracker RL et double-clique dessus.') 'Info' }
}

# ---------- 1. Où est Rocket League ? Son API Stats est-elle active ? ----------
$roots = New-Object System.Collections.ArrayList
$manifests = Join-Path $env:ProgramData 'Epic\EpicGamesLauncher\Data\Manifests'
if (Test-Path $manifests) {
  Get-ChildItem $manifests -Filter *.item -ErrorAction SilentlyContinue | ForEach-Object {
    try { $m = Get-Content $_.FullName -Raw | ConvertFrom-Json; if ($m.AppName -eq 'Sugar' -or $m.DisplayName -like '*Rocket League*') { [void]$roots.Add($m.InstallLocation) } } catch {}
  }
}
$pf86 = [Environment]::GetEnvironmentVariable('ProgramFiles(x86)')
foreach ($p in @((Join-Path $env:ProgramFiles 'Epic Games\rocketleague'), (Join-Path $pf86 'Steam\steamapps\common\rocketleague'), (Join-Path $env:ProgramFiles 'Steam\steamapps\common\rocketleague'))) { [void]$roots.Add($p) }
$ini = $null
foreach ($r in $roots) { if ($r) { $f = Join-Path $r 'TAGame\Config\DefaultStatsAPI.ini'; if (Test-Path $f) { $ini = $f; break } } }

$port = 49123
$global:iniNote = 'fichier de config introuvable'
if ($env:ONI_SYNC_PORT) { $port = [int]$env:ONI_SYNC_PORT }
# Vérifiée au démarrage puis toutes les 30 s sans jeu : une mise à jour de Rocket League réécrit ce fichier (PacketSendRate=0)
function Check-Ini($boot) {
  if (-not $ini) { return }
  $txt = [IO.File]::ReadAllText($ini)
  if ($boot -and -not $env:ONI_SYNC_PORT -and $txt -match '(?m)^\s*Port\s*=\s*(\d+)') { $script:port = [int]$Matches[1] }
  $fixed = $txt.TrimStart([char]0xFEFF)
  $off = $fixed -match '(?m)^\s*PacketSendRate\s*=\s*0(\D|$)'
  if ($off) { $fixed = $fixed -replace '(?m)(?<=^\s*PacketSendRate\s*=\s*)0(?=\D|$)', '30' }
  if ($env:ONI_SYNC_TEST) { $global:iniNote = 'test : config non modifiée' }
  elseif ($fixed -ne $txt) {
    try {
      if (-not (Test-Path ($ini + '.avant-oni-sync'))) { Copy-Item $ini ($ini + '.avant-oni-sync') -ErrorAction Stop }
      [IO.File]::WriteAllText($ini, $fixed, (New-Object Text.UTF8Encoding $false))
      $global:iniNote = 'API Stats activée (relancer le jeu s''il était ouvert)'
      if (-not $boot) { Log 'Config du jeu remise à zéro (mise à jour de Rocket League ?) : API Stats réactivée' }
      if (@(Get-Process RocketLeague -ErrorAction SilentlyContinue).Count) { Tip 'Oni Sync : relance Rocket League' 'Une mise à jour du jeu avait coupé l''API Stats. Elle est réactivée : ferme et relance Rocket League pour que la partie soit suivie.' 'Warning' }
    } catch {
      $global:iniNote = 'API Stats coupée, modification refusée par Windows'
      Tip 'Oni Sync : une étape à faire' 'Windows refuse d''activer l''API Stats du jeu. Fais une fois : clic droit sur Oni-Sync.cmd > Exécuter en tant qu''administrateur.' 'Warning'
    }
  } elseif ($boot) { $global:iniNote = 'API Stats active' }
}
Check-Ini $true
Log ('Démarrage v' + $Version + ' · pseudo ' + $Pseudo + ' · ' + $global:iniNote + ' · port ' + $port + ' · ' + $ini)
if (-not $Pseudo) { Tip 'Oni Sync' 'Relie ton pseudo Rocket League dans Inside > Joueurs, sinon tes parties seront refusées.' 'Warning' }
$hi = Hello 'lance' $global:iniNote
if ($hi) { Check-Version $hi.latest }

# ---------- 2. Découpage du flux JSON (en C#, rapide) ----------
Add-Type -TypeDefinition @'
using System.Text; using System.Collections.Generic;
public class OniSplit {
  StringBuilder b = new StringBuilder(); int depth = 0; bool str = false, esc = false;
  public List<string> Feed(char[] c, int n) {
    var outp = new List<string>();
    for (int i = 0; i < n; i++) {
      char x = c[i];
      if (depth == 0 && x != '{') continue;
      b.Append(x);
      if (str) { if (esc) esc = false; else if (x == '\\') esc = true; else if (x == '"') str = false; continue; }
      if (x == '"') str = true; else if (x == '{') depth++; else if (x == '}') { depth--; if (depth == 0) { outp.Add(b.ToString()); b.Clear(); } }
    }
    return outp;
  }
}
'@

# ---------- Stats de la partie ----------
# feed : événements du jeu (StatfeedEvent : arrêts, démolitions, frappes aériennes…) comptés par joueur
# samples : mon joueur relevé une fois par seconde (boost, vitesse, supersonique, au sol, au mur…), hors replays de but
function Reset-Stats { $global:feed = @{}; $global:sn = 0; $global:sum = @{}; $global:yes = @{}; $global:lastSample = [DateTime]::MinValue }
Reset-Stats
$global:norm = ($Pseudo.ToLowerInvariant() -replace '\s', '')
function Note-Feed($m) {
  try {
    $o = $m | ConvertFrom-Json; $d = $o.Data; if ($d -is [string]) { $d = $d | ConvertFrom-Json }
    $ev = $d.EventName; if (-not $ev) { $ev = $d.Type }; $who = $d.MainTarget.Name
    if (-not $ev -or -not $who) { return }
    if (-not $global:feed.ContainsKey($who)) { $global:feed[$who] = @{} }
    $global:feed[$who][$ev] = 1 + [int]$global:feed[$who][$ev]
  } catch {}
}
function Note-State($m) {
  if (([DateTime]::Now - $global:lastSample).TotalMilliseconds -lt 950) { return }
  $global:lastSample = [DateTime]::Now
  try {
    $o = $m | ConvertFrom-Json; $d = $o.Data; if ($d -is [string]) { $d = $d | ConvertFrom-Json }
    if ($d.Game.bReplay -or $d.Game.bHasWinner) { return }
    $me = $d.Players | Where-Object { ($_.Name.ToLowerInvariant() -replace '\s', '') -eq $global:norm } | Select-Object -First 1
    if (-not $me) { return }
    $global:sn++
    foreach ($p in $me.PSObject.Properties) {
      if ($p.Value -is [bool]) { if ($p.Value) { $global:yes[$p.Name] = 1 + [int]$global:yes[$p.Name] } }
      elseif ($p.Value -is [int] -or $p.Value -is [double] -or $p.Value -is [long] -or $p.Value -is [decimal]) { $global:sum[$p.Name] = [double]$global:sum[$p.Name] + [double]$p.Value }
    }
  } catch {}
}

function Send-Match($endMsg, $lastMsg) {
  if (-not $lastMsg) { Log 'Fin de partie sans état reçu : ignorée.'; Reset-Stats; return }
  $extra = @{ feed = $global:feed; samples = @{ n = $global:sn; sum = $global:sum; yes = $global:yes } } | ConvertTo-Json -Compress -Depth 5
  Reset-Stats
  $body = '{"end":' + $endMsg + ',"last":' + $lastMsg + ',"extra":' + $extra + '}'
  try { [IO.File]::WriteAllText((Join-Path $dir 'derniere-partie.json'), $body, (New-Object Text.UTF8Encoding $false)) } catch {}
  try {
    $res = Invoke-RestMethod -Method Post -Uri $Api -Headers @{ Authorization = ('Bearer ' + $Token) } -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($body)) -TimeoutSec 20
    Log ('Partie envoyée : ' + $res.message); Status ('dernière partie envoyée ' + (Get-Date -Format 'HH:mm'))
    if (-not (Test-Path $tipFile)) { try { [IO.File]::WriteAllText($tipFile, '1') } catch {}; Tip 'Oni Sync : astuce' 'Clique « Sauvegarder le replay » en fin de partie : Oni Sync l''envoie, et Inside affiche ton rang et des stats avancées (positionnement, boost).' 'Info' }
  } catch {
    $msg = $_.ErrorDetails.Message
    try { $msg = ($msg | ConvertFrom-Json).error } catch {}
    if (-not $msg) { $msg = $_.Exception.Message }
    Log ('Partie pas envoyée : ' + $msg); Tip 'Partie pas envoyée' $msg 'Warning'
  }
}

# ---------- Replays sauvegardés (v6) ----------
# En fin de partie, « Sauvegarder le replay » écrit un fichier .replay dans Documents\My Games\Rocket League\TAGame\Demos
# (DemosEpic selon les versions). Oni Sync l'envoie au site, qui le passe à ballchasing : stats avancées et rang.
# Liste des fichiers déjà envoyés dans replays-envoyes.txt. Premier lancement : les 10 replays des 7 derniers jours sont envoyés.
$ReplayApi = $Api -replace '/sync$', '/replay'
$docs = [Environment]::GetFolderPath('MyDocuments')
$demoDirs = @((Join-Path $docs 'My Games\Rocket League\TAGame\Demos'), (Join-Path $docs 'My Games\Rocket League\TAGame\DemosEpic'))
$sentFile = Join-Path $dir 'replays-envoyes.txt'
$global:sent = New-Object 'System.Collections.Generic.HashSet[string]'
function All-Replays { foreach ($d in $demoDirs) { if (Test-Path $d) { Get-ChildItem $d -Filter *.replay -ErrorAction SilentlyContinue } } }
if (Test-Path $sentFile) { foreach ($l in [IO.File]::ReadAllLines($sentFile)) { if ($l) { [void]$global:sent.Add($l) } } }
elseif (-not $env:ONI_SYNC_TEST) {
  $recent = @(All-Replays | Sort-Object LastWriteTime -Descending | Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-7) } | Select-Object -First 10 | ForEach-Object { $_.Name })
  $old = @(All-Replays | Where-Object { $recent -notcontains $_.Name } | ForEach-Object { $_.Name })
  if ($old.Count) { [IO.File]::WriteAllLines($sentFile, [string[]]$old); foreach ($n in $old) { [void]$global:sent.Add($n) } } else { [IO.File]::WriteAllText($sentFile, '') }
}
function Mark-Sent($name) { [void]$global:sent.Add($name); try { [IO.File]::AppendAllText($sentFile, $name + [Environment]::NewLine) } catch {} }
function Check-Replays {
  # Rien pendant une partie (repris de rockpload) : la connexion reste au jeu
  if ($global:last) { return }
  $todo = @(All-Replays | Where-Object { -not $global:sent.Contains($_.Name) -and $_.LastWriteTime -lt (Get-Date).AddSeconds(-5) } | Sort-Object LastWriteTime | Select-Object -First 2)
  foreach ($f in $todo) {
    if ($f.Length -gt 4300000) { Mark-Sent $f.Name; Log ('Replay trop gros, pas envoyé : ' + $f.Name); continue }
    try {
      $res = Invoke-RestMethod -Method Post -Uri $ReplayApi -Headers @{ Authorization = ('Bearer ' + $Token); 'X-Replay-Name' = $f.Name } -ContentType 'application/octet-stream' -Body ([IO.File]::ReadAllBytes($f.FullName)) -TimeoutSec 60
      Mark-Sent $f.Name; Log ('Replay envoyé : ' + $f.Name + ' · ' + $res.message)
    } catch {
      $code = 0; try { $code = [int]$_.Exception.Response.StatusCode } catch {}
      Log ('Replay pas envoyé (' + $code + ') : ' + $f.Name)
      # Refus définitif (fichier invalide, trop gros) : on ne réessaie pas ; panne réseau ou site : nouvel essai plus tard
      if ($code -ge 400 -and $code -lt 500 -and $code -ne 429 -and $code -ne 401) { Mark-Sent $f.Name }
      break
    }
  }
}
# Astuce montrée une seule fois, après la première partie envoyée
$tipFile = Join-Path $dir 'astuce-replay.txt'

# ---------- 3. Connexion au jeu (minuterie : l'icône reste réactive) ----------
$global:client = $null; $global:stream = $null; $global:split = $null; $global:last = $null
$global:nextTry = [DateTime]::MinValue; $global:events = 0; $global:announced = $false
$buf = New-Object char[] 65536
$global:reader = $null
Status 'en attente de Rocket League'

function Try-Connect {
  foreach ($h in @('127.0.0.1', '::1')) {
    try {
      $c = New-Object System.Net.Sockets.TcpClient([System.Net.IPAddress]::Parse($h).AddressFamily)
      $ar = $c.BeginConnect($h, $port, $null, $null)
      if ($ar.AsyncWaitHandle.WaitOne(400) -and $c.Connected) { $c.EndConnect($ar); return $c }
      $c.Close()
    } catch {}
  }
  return $null
}
function Drop($why) {
  try { $global:client.Close() } catch {}
  $global:client = $null; $global:reader = $null
  Log ('Déconnecté du jeu (' + $why + ')'); Status 'en attente de Rocket League'
}

$global:paused = $false
$global:waitLog = [DateTime]::Now
$global:iniCheck = [DateTime]::Now
$global:replayCheck = [DateTime]::MinValue
$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 200
$timer.Add_Tick({
  if ($global:paused) { return }
  if (([DateTime]::Now - $global:replayCheck).TotalSeconds -ge 10) { $global:replayCheck = [DateTime]::Now; Check-Replays }
  if (-not $global:client) {
    # Une ligne de journal toutes les 10 minutes tant que le jeu ne répond pas (aide au dépannage)
    if (([DateTime]::Now - $global:waitLog).TotalMinutes -ge 10) { $global:waitLog = [DateTime]::Now; $rl = @(Get-Process RocketLeague -ErrorAction SilentlyContinue).Count; Log ('Toujours en attente du jeu (Rocket League ' + $(if ($rl) { 'ouvert, port ' + $port + ' fermé : API Stats coupée ?' } else { 'fermé' }) + ')') }
    if (([DateTime]::Now - $global:iniCheck).TotalSeconds -ge 30) { $global:iniCheck = [DateTime]::Now; Check-Ini $false }
    if ([DateTime]::Now -lt $global:nextTry) { return }
    $global:nextTry = [DateTime]::Now.AddSeconds(5)
    $c = Try-Connect
    if ($c) {
      $global:client = $c; $global:reader = New-Object System.IO.StreamReader($c.GetStream(), [Text.Encoding]::UTF8)
      $global:split = New-Object OniSplit; $global:last = $null; $global:events = 0; $global:announced = $false; Reset-Stats
      Log ('Connecté à Rocket League (' + $c.Client.RemoteEndPoint + ')'); Status 'connecté au jeu'
      [void](Hello 'connecte' ('port ' + $port))
    }
    return
  }
  try {
    $s = $global:client.Client
    if ($s.Poll(0, [System.Net.Sockets.SelectMode]::SelectRead) -and $s.Available -eq 0) { Drop 'jeu fermé'; return }
    $guard = 0
    while ($global:client.GetStream().DataAvailable -and $guard -lt 50) {
      $guard++
      $n = $global:reader.Read($buf, 0, $buf.Length)
      if ($n -le 0) { break }
      foreach ($m in $global:split.Feed($buf, $n)) {
        $global:events++
        if (-not $global:announced) { $global:announced = $true; Log 'Premiers messages du jeu reçus.'; Status 'connecté, partie suivie' }
        if ($m -match '"Event"\s*:\s*"(\w+)"') {
          switch ($Matches[1]) {
            'UpdateState' { $global:last = $m; Note-State $m }
            'StatfeedEvent' { Note-Feed $m }
            'MatchCreated' { Reset-Stats }
            'MatchEnded' { Send-Match $m $global:last; $global:last = $null }
            'MatchDestroyed' { if ($global:last) { Log 'Partie quittée avant la fin : non comptée.'; [void](Hello 'abandon' 'partie quittée avant la fin') }; $global:last = $null; Reset-Stats }
          }
        }
      }
    }
  } catch { Drop $_.Exception.Message }
})

# ---------- 4. Menu de l'icône ----------
$menu = New-Object System.Windows.Forms.ContextMenuStrip
$head = $menu.Items.Add('Oni Sync · Oni Korp'); $head.Enabled = $false
[void]$menu.Items.Add('-')
$menu.Items.Add('État').Add_Click({ [System.Windows.Forms.MessageBox]::Show(('État : ' + $global:statusText + [Environment]::NewLine + 'Pseudo suivi : ' + $Pseudo + [Environment]::NewLine + 'Config du jeu : ' + $global:iniNote + [Environment]::NewLine + 'Messages reçus du jeu : ' + $global:events), 'Oni Sync') | Out-Null }) | Out-Null
# Pause : Oni Sync se déconnecte du jeu et n'envoie plus rien jusqu'à « Reprendre »
$pause = $menu.Items.Add('Mettre en pause')
$pause.Add_Click({
  $global:paused = -not $global:paused
  if ($global:paused) { if ($global:client) { Drop 'mis en pause' }; Status 'en pause'; $pause.Text = 'Reprendre'; Log 'En pause.' }
  else { $global:nextTry = [DateTime]::MinValue; Status 'en attente de Rocket League'; $pause.Text = 'Mettre en pause'; Log 'Reprise.' }
}) | Out-Null
$menu.Items.Add('Voir mes parties sur Inside').Add_Click({ Start-Process ($Site + '/equipe/rl/') }) | Out-Null
$menu.Items.Add('Ouvrir le journal').Add_Click({ if (Test-Path $journal) { Start-Process notepad.exe $journal } }) | Out-Null
$startup = Join-Path ([Environment]::GetFolderPath('Startup')) 'Oni Sync.lnk'
$auto = $menu.Items.Add('Lancer avec Windows')
$auto.Checked = Test-Path $startup
$auto.Add_Click({
  if (Test-Path $startup) { Remove-Item $startup -Force; $auto.Checked = $false }
  else { try { Make-Shortcut ([Environment]::GetFolderPath('Startup')); $auto.Checked = $true } catch {} }
}) | Out-Null
[void]$menu.Items.Add('-')
$menu.Items.Add('Quitter').Add_Click({ $timer.Stop(); $tray.Visible = $false; Log 'Arrêt.'; [System.Windows.Forms.Application]::Exit() }) | Out-Null
$tray.ContextMenuStrip = $menu
$tray.Add_DoubleClick({ Start-Process ($Site + '/equipe/rl/') })

# Explication montrée au tout premier lancement seulement
$first = Join-Path $dir 'deja-lance'
if (-not (Test-Path $first)) { Tip 'Oni Sync est lancé' 'Il tourne ici, à côté de l''horloge, sans fenêtre. Clic droit sur l''icône pour le menu.' 'Info'; New-Item -ItemType File -Path $first -Force | Out-Null }
$timer.Start()
[System.Windows.Forms.Application]::Run()
$tray.Dispose()
try { $mutex.ReleaseMutex() } catch {}
`;
