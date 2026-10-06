// Script PowerShell d'Oni Sync (Windows PowerShell 5.1, présent sur tout Windows 10/11), emballé dans Oni-Sync.cmd par rl-sync.ts.
// 1. trouve Rocket League (Epic ou Steam) et active l'API Stats du jeu si elle est coupée (PacketSendRate) ;
// 2. se connecte au jeu en local (127.0.0.1, port de DefaultStatsAPI.ini, 49123 par défaut) ;
// 3. à chaque fin de partie, envoie le dernier état et l'événement de fin, bruts, au site du club.
// Aucun accès à la mémoire du jeu, aucune injection : seulement ce que Rocket League publie lui-même.
// Pas de backtick ni de « ${ » dans ce texte (gabarit TypeScript).
export const ONI_SYNC_PS = String.raw`
$ErrorActionPreference = 'Continue'
[Console]::OutputEncoding = [Text.Encoding]::UTF8
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$Token = '__TOKEN__'
$Api = '__API__'
$Pseudo = '__PSEUDO__'

Write-Host ''
Write-Host '  ONI SYNC  ·  tracker Rocket League du club Oni Korp' -ForegroundColor Red
Write-Host '  Laisse cette fenêtre ouverte pendant que tu joues. Chaque partie terminée part sur Inside.' -ForegroundColor Gray
if ($Pseudo) { Write-Host ('  Pseudo suivi : ' + $Pseudo) -ForegroundColor Gray } else { Write-Host '  Attention : relie ton pseudo Rocket League dans Inside > Joueurs.' -ForegroundColor Yellow }
Write-Host ''

# ---------- 1. Où est Rocket League ? ----------
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
if ($env:ONI_SYNC_PORT) { $port = [int]$env:ONI_SYNC_PORT }
if ($ini) {
  $txt = Get-Content $ini -Raw
  if (-not $env:ONI_SYNC_PORT -and $txt -match 'Port\s*=\s*(\d+)') { $port = [int]$Matches[1] }
  if ($env:ONI_SYNC_TEST) { Write-Host '  (test : DefaultStatsAPI.ini non modifié)' -ForegroundColor DarkGray }
  elseif ($txt -match 'PacketSendRate\s*=\s*0(\D|$)') {
    try {
      Copy-Item $ini ($ini + '.avant-oni-sync') -ErrorAction Stop
      ($txt -replace 'PacketSendRate\s*=\s*0(?=\D|$)', 'PacketSendRate=30') | Set-Content $ini -Encoding UTF8 -ErrorAction Stop
      Write-Host '  API Stats du jeu activée. Si Rocket League était ouvert, relance-le.' -ForegroundColor Green
    } catch {
      Write-Host '  L''API Stats du jeu est coupée et Windows refuse de la modifier.' -ForegroundColor Yellow
      Write-Host '  Fais une seule fois : clic droit sur Oni-Sync.cmd > Exécuter en tant qu''administrateur.' -ForegroundColor Yellow
      Write-Host ('  Ou ouvre ' + $ini + ' et mets PacketSendRate=30.') -ForegroundColor Yellow
    }
  } else { Write-Host '  API Stats du jeu : active.' -ForegroundColor Green }
} else {
  Write-Host '  Fichier DefaultStatsAPI.ini introuvable : vérifie que Rocket League est à jour.' -ForegroundColor Yellow
  Write-Host '  (Dossier du jeu > TAGame > Config > DefaultStatsAPI.ini, ligne PacketSendRate=30)' -ForegroundColor Yellow
}

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
  if (-not $lastMsg) { Write-Host '  Fin de partie sans état reçu : ignorée.' -ForegroundColor DarkGray; return }
  $body = '{"end":' + $endMsg + ',"last":' + $lastMsg + '}'
  try { Set-Content -Path (Join-Path $env:TEMP 'oni-sync-derniere-partie.json') -Value $body -Encoding UTF8 } catch {}
  try {
    $res = Invoke-RestMethod -Method Post -Uri $Api -Headers @{ Authorization = ('Bearer ' + $Token) } -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($body)) -TimeoutSec 20
    Write-Host ('  ' + (Get-Date -Format 'HH:mm') + '  Envoyée : ' + $res.message) -ForegroundColor Green
  } catch {
    $msg = $_.ErrorDetails.Message
    try { $msg = ($msg | ConvertFrom-Json).error } catch {}
    Write-Host ('  ' + (Get-Date -Format 'HH:mm') + '  Pas envoyée : ' + $msg) -ForegroundColor Yellow
  }
}

# ---------- 3. Connexion au jeu ----------
$waiting = $false
while ($true) {
  try {
    $client = New-Object System.Net.Sockets.TcpClient
    $client.Connect('127.0.0.1', $port)
    Write-Host '  Connecté à Rocket League. Bonne partie !' -ForegroundColor Green
    $waiting = $false
    $reader = New-Object System.IO.StreamReader($client.GetStream(), [Text.Encoding]::UTF8)
    $split = New-Object OniSplit
    $buf = New-Object char[] 65536
    $last = $null
    while (($n = $reader.Read($buf, 0, $buf.Length)) -gt 0) {
      foreach ($m in $split.Feed($buf, $n)) {
        if ($m -match '"Event"\s*:\s*"(\w+)"') {
          switch ($Matches[1]) {
            'UpdateState' { $last = $m }
            'MatchEnded' { Send-Match $m $last; $last = $null }
            'MatchDestroyed' { $last = $null }
          }
        }
      }
    }
    $client.Close()
  } catch {
    if (-not $waiting) { Write-Host '  En attente de Rocket League (lance une partie)...' -ForegroundColor DarkGray; $waiting = $true }
  }
  Start-Sleep -Seconds 5
}
`;
