param([string]$Data, [string]$Template, [string]$OutDir)
$utf8 = New-Object System.Text.UTF8Encoding($false)
$subjects = [IO.File]::ReadAllText($Data, $utf8) | ConvertFrom-Json
$tpl = [IO.File]::ReadAllText($Template, $utf8)
$schools = [IO.File]::ReadAllText((Join-Path (Split-Path $Data) 'schools.json'), $utf8) | ConvertFrom-Json
function Esc([string]$s) { return $s.Replace('&','&amp;').Replace('<','&lt;').Replace('>','&gt;').Replace('"','&quot;') }
New-Item -ItemType Directory -Force $OutDir | Out-Null

foreach ($s in $subjects) {
  $for = ($s.for | ForEach-Object { '      <div class="for-item"><span class="ck">&#10003;</span><div>' + (Esc $_) + '</div></div>' }) -join "`n"
  $topics = ($s.topics | ForEach-Object {
    $li = ($_.items | ForEach-Object { '<li>' + (Esc $_) + '</li>' }) -join ''
    '      <div class="topic"><h3>' + (Esc $_.h) + '</h3><ul>' + $li + '</ul></div>'
  }) -join "`n"
  $i = 0
  $faq = ($s.faq | ForEach-Object {
    $open = ''; if ($i -eq 0) { $open = ' open' }; $i++
    '      <details' + $open + '><summary>' + (Esc $_.q) + '</summary><p>' + (Esc $_.a) + '</p></details>'
  }) -join "`n"
  $same = @($subjects | Where-Object { $_.cat -eq $s.cat -and $_.slug -ne $s.slug })
  $rel = ($same | Select-Object -First 3 | ForEach-Object {
    '      <a class="rel" href="/subjects/' + $_.slug + '.html"><div class="ic">' + $_.icon + '</div><h4>' + (Esc $_.title) + '</h4><p>' + (Esc $_.card) + '</p></a>'
  }) -join "`n"
  $pg = $schools.pages.($s.slug)
  $hl = ($pg.h | ForEach-Object { '<strong>' + (Esc $_) + '</strong>' }) -join ', '
  $lead = (Esc $pg.lead).Replace('{S}', $hl)
  $ga = ($schools.groupA | ForEach-Object { '      <li>' + (Esc $_) + '</li>' }) -join "`n"
  $gb = ($schools.groupB | ForEach-Object { '      <li>' + (Esc $_) + '</li>' }) -join "`n"
  $desc =(Esc $s.tagline) + ' ' + [char]0xBB34 + [char]0xB8CC + ' ' + [char]0xC0C1 + [char]0xB2F4 + ' 010-2928-3614'
  $html = $tpl.Replace('{{TITLE}}', (Esc $s.title)).Replace('{{EN}}', (Esc $s.en)).Replace('{{ICON}}', $s.icon).Replace('{{CAT}}', (Esc $s.cat)).Replace('{{TAGLINE}}', (Esc $s.tagline)).Replace('{{INTRO}}', (Esc $s.intro)).Replace('{{FOR}}', $for).Replace('{{TOPICS}}', $topics).Replace('{{FAQ}}', $faq).Replace('{{RELATED}}', $rel).Replace('{{SLUG}}', $s.slug).Replace('{{DESC}}', $desc).Replace('{{SCHOOL_LEAD}}', $lead).Replace('{{GROUP_A}}', $ga).Replace('{{GROUP_B}}', $gb)
  [IO.File]::WriteAllText((Join-Path $OutDir ($s.slug + '.html')), $html, $utf8)
  "built " + $s.slug
}
