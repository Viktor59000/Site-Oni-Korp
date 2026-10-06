// Script PowerShell d'Oni Sync (Windows PowerShell 5.1, présent sur tout Windows 10/11), emballé dans Oni-Sync.cmd par rl-sync.ts.
// Oni Sync vit dans la zone de notification (à côté de l'horloge), sans fenêtre : clic droit sur l'icône pour le journal ou Quitter.
// 1. trouve Rocket League (Epic ou Steam) et active l'API Stats du jeu si elle est coupée (PacketSendRate), fichier réécrit SANS BOM :
//    un BOM devant « [TAGame.MatchStatsExporter_TA] » rend la section illisible pour le jeu et l'API reste coupée (bug de la v1) ;
// 2. se connecte au jeu en local (127.0.0.1 puis ::1, port de DefaultStatsAPI.ini, 49123 par défaut) ;
// 3. à chaque fin de partie, envoie le dernier état et l'événement de fin, bruts, au site du club ;
// 4. signale au site son état (lancé, connecté au jeu, partie quittée avant la fin) : Inside > Tracker l'affiche, ce qui permet d'aider à distance.
// Aucun accès à la mémoire du jeu, aucune injection : seulement ce que Rocket League publie lui-même.
// Pas de backtick ni de « ${ » dans ce texte (gabarit TypeScript).
export const ONI_SYNC_VERSION = '2';
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

# Une seule instance à la fois
$created = $false
$mutex = New-Object System.Threading.Mutex($true, 'OniKorpOniSync', [ref]$created)
if (-not $created) { [System.Windows.Forms.MessageBox]::Show('Oni Sync tourne déjà : son icône est dans la zone de notification, à côté de l''horloge (flèche ^).', 'Oni Sync') | Out-Null; exit }

# ---------- Journal (gardé dans %LOCALAPPDATA%\OniSync) ----------
$dir = Join-Path $env:LOCALAPPDATA 'OniSync'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$journal = Join-Path $dir 'journal.txt'
if ((Test-Path $journal) -and (Get-Item $journal).Length -gt 300000) { Remove-Item $journal -Force }
function Log($t) { try { Add-Content -Path $journal -Value ((Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + '  ' + $t) -Encoding UTF8 } catch {} }

# ---------- Icône ----------
$bmp = New-Object System.Drawing.Bitmap 32, 32
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'; $g.TextRenderingHint = 'AntiAliasGridFit'
$g.Clear([System.Drawing.Color]::FromArgb(200, 30, 25))
$font = New-Object System.Drawing.Font('Segoe UI', 17, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fmt = New-Object System.Drawing.StringFormat; $fmt.Alignment = 'Center'; $fmt.LineAlignment = 'Center'
$g.DrawString('O', $font, [System.Drawing.Brushes]::White, (New-Object System.Drawing.RectangleF(0, 0, 32, 32)), $fmt)
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
    Invoke-RestMethod -Method Post -Uri $Api -Headers @{ Authorization = ('Bearer ' + $Token) } -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($body)) -TimeoutSec 10 | Out-Null
  } catch { Log ('Signal au site impossible : ' + $_.Exception.Message) }
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
$iniNote = 'fichier de config introuvable'
if ($env:ONI_SYNC_PORT) { $port = [int]$env:ONI_SYNC_PORT }
if ($ini) {
  $txt = [IO.File]::ReadAllText($ini)
  if (-not $env:ONI_SYNC_PORT -and $txt -match '(?m)^\s*Port\s*=\s*(\d+)') { $port = [int]$Matches[1] }
  $fixed = $txt.TrimStart([char]0xFEFF)
  $off = $fixed -match '(?m)^\s*PacketSendRate\s*=\s*0(\D|$)'
  if ($off) { $fixed = $fixed -replace '(?m)(?<=^\s*PacketSendRate\s*=\s*)0(?=\D|$)', '30' }
  if ($env:ONI_SYNC_TEST) { $iniNote = 'test : config non modifiée' }
  elseif ($fixed -ne $txt) {
    try {
      if (-not (Test-Path ($ini + '.avant-oni-sync'))) { Copy-Item $ini ($ini + '.avant-oni-sync') -ErrorAction Stop }
      [IO.File]::WriteAllText($ini, $fixed, (New-Object Text.UTF8Encoding $false))
      $iniNote = 'API Stats activée (relancer le jeu s''il était ouvert)'
      Tip 'Oni Sync' 'API Stats de Rocket League activée. Si le jeu était ouvert, relance-le.' 'Info'
    } catch {
      $iniNote = 'API Stats coupée, modification refusée par Windows'
      Tip 'Oni Sync : une étape à faire' 'Windows refuse d''activer l''API Stats du jeu. Fais une fois : clic droit sur Oni-Sync.cmd > Exécuter en tant qu''administrateur.' 'Warning'
    }
  } else { $iniNote = 'API Stats active' }
}
Log ('Démarrage v' + $Version + ' · pseudo ' + $Pseudo + ' · ' + $iniNote + ' · port ' + $port + ' · ' + $ini)
if (-not $Pseudo) { Tip 'Oni Sync' 'Relie ton pseudo Rocket League dans Inside > Joueurs, sinon tes parties seront refusées.' 'Warning' }
Hello 'lance' $iniNote

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

function Send-Match($endMsg, $lastMsg) {
  if (-not $lastMsg) { Log 'Fin de partie sans état reçu : ignorée.'; return }
  $body = '{"end":' + $endMsg + ',"last":' + $lastMsg + '}'
  try { [IO.File]::WriteAllText((Join-Path $dir 'derniere-partie.json'), $body, (New-Object Text.UTF8Encoding $false)) } catch {}
  try {
    $res = Invoke-RestMethod -Method Post -Uri $Api -Headers @{ Authorization = ('Bearer ' + $Token) } -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($body)) -TimeoutSec 20
    Log ('Partie envoyée : ' + $res.message); Status ('dernière partie envoyée ' + (Get-Date -Format 'HH:mm'))
  } catch {
    $msg = $_.ErrorDetails.Message
    try { $msg = ($msg | ConvertFrom-Json).error } catch {}
    if (-not $msg) { $msg = $_.Exception.Message }
    Log ('Partie pas envoyée : ' + $msg); Tip 'Partie pas envoyée' $msg 'Warning'
  }
}

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

$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 200
$timer.Add_Tick({
  if (-not $global:client) {
    if ([DateTime]::Now -lt $global:nextTry) { return }
    $global:nextTry = [DateTime]::Now.AddSeconds(5)
    $c = Try-Connect
    if ($c) {
      $global:client = $c; $global:reader = New-Object System.IO.StreamReader($c.GetStream(), [Text.Encoding]::UTF8)
      $global:split = New-Object OniSplit; $global:last = $null; $global:events = 0; $global:announced = $false
      Log ('Connecté à Rocket League (' + $c.Client.RemoteEndPoint + ')'); Status 'connecté au jeu'
      Hello 'connecte' ('port ' + $port)
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
            'UpdateState' { $global:last = $m }
            'MatchEnded' { Send-Match $m $global:last; $global:last = $null }
            'MatchDestroyed' { if ($global:last) { Log 'Partie quittée avant la fin : non comptée.'; Hello 'abandon' 'partie quittée avant la fin' }; $global:last = $null }
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
$menu.Items.Add('État').Add_Click({ [System.Windows.Forms.MessageBox]::Show(('État : ' + $global:statusText + [Environment]::NewLine + 'Pseudo suivi : ' + $Pseudo + [Environment]::NewLine + 'Config du jeu : ' + $iniNote + [Environment]::NewLine + 'Messages reçus du jeu : ' + $global:events), 'Oni Sync') | Out-Null }) | Out-Null
$menu.Items.Add('Voir mes parties sur Inside').Add_Click({ Start-Process ($Site + '/equipe/rl/') }) | Out-Null
$menu.Items.Add('Ouvrir le journal').Add_Click({ if (Test-Path $journal) { Start-Process notepad.exe $journal } }) | Out-Null
$startup = Join-Path ([Environment]::GetFolderPath('Startup')) 'Oni-Sync.cmd'
$auto = $menu.Items.Add('Lancer avec Windows')
$auto.Checked = Test-Path $startup
$auto.Add_Click({
  if (Test-Path $startup) { Remove-Item $startup -Force; $auto.Checked = $false }
  elseif ($env:ONI_SYNC_FILE -and (Test-Path $env:ONI_SYNC_FILE)) { Copy-Item $env:ONI_SYNC_FILE $startup -Force; $auto.Checked = $true }
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
