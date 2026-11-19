# Builds news.html from _build/news.json and refreshes the latest-news cards in index.html.
# Usage (from repo root):  powershell -File _build/build-news.ps1
# (also works with pwsh on Linux)
param([string]$Root = (Split-Path -Parent $PSScriptRoot))
if (-not $Root) { $Root = (Get-Location).Path }
$utf8 = New-Object System.Text.UTF8Encoding($false)
$build = Join-Path $Root '_build'
$news = [IO.File]::ReadAllText((Join-Path $build 'news.json'), $utf8) | ConvertFrom-Json
$news = @($news | Sort-Object { $_.date } -Descending)
$tpl = [IO.File]::ReadAllText((Join-Path $build 'news-template.html'), $utf8)

function Esc([string]$s) { return $s.Replace('&','&amp;').Replace('<','&lt;').Replace('>','&gt;').Replace('"','&quot;') }
function Fill([string]$t, $n) {
  return $t.Replace('{TAG}', (Esc $n.tag)).Replace('{DATE}', $n.date).Replace('{DATEDOT}', $n.date.Replace('-', '.')).Replace('{SOURCE}', (Esc $n.source)).Replace('{URL}', (Esc $n.url)).Replace('{TITLE}', (Esc $n.title)).Replace('{SUMMARY}', (Esc $n.summary)).Replace('{COMMENT}', (Esc $n.comment))
}

$itemTpl = [regex]::Match($tpl, '(?s)<!--ITEM\r?\n(.*?)ITEM-->').Groups[1].Value.TrimEnd()
$cardTpl = [regex]::Match($tpl, '(?s)<!--CARD\r?\n(.*?)CARD-->').Groups[1].Value.TrimEnd()
$tpl = [regex]::Replace($tpl, '(?s)<!--ITEM.*?ITEM-->\r?\n', '')
$tpl = [regex]::Replace($tpl, '(?s)<!--CARD.*?CARD-->\r?\n', '')

$items = ($news | ForEach-Object { Fill $itemTpl $_ }) -join "`n"
$updated = $news[0].date.Replace('-', '.')
$html = $tpl.Replace('{{ITEMS}}', $items).Replace('{{UPDATED}}', $updated)
[IO.File]::WriteAllText((Join-Path $Root 'news.html'), $html, $utf8)

# homepage: latest 3 cards between markers
$idxPath = Join-Path $Root 'index.html'
$idx = [IO.File]::ReadAllText($idxPath, $utf8)
$cards = ($news | Select-Object -First 3 | ForEach-Object { Fill $cardTpl $_ }) -join "`n"
$idx = [regex]::Replace($idx, '(?s)(<!--NEWS:START-->).*?(<!--NEWS:END-->)', { param($m) $m.Groups[1].Value + "`n" + $cards + "`n      " + $m.Groups[2].Value })
[IO.File]::WriteAllText($idxPath, $idx, $utf8)

# sitemap lastmod for news.html
$smPath = Join-Path $Root 'sitemap.xml'
$sm = [IO.File]::ReadAllText($smPath, $utf8)
if ($sm -notmatch 'news\.html') {
  $sm = $sm.Replace('</urlset>', "  <url><loc>https://tutorlove.co.kr/news.html</loc><lastmod>" + $news[0].date + "</lastmod><changefreq>daily</changefreq></url>`n</urlset>")
} else {
  $sm = [regex]::Replace($sm, '(news\.html</loc><lastmod>)[0-9-]+', ('${1}' + $news[0].date))
}
[IO.File]::WriteAllText($smPath, $sm, $utf8)
"news items: " + $news.Count + " / latest: " + $updated
