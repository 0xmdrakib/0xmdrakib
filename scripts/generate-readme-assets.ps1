param(
  [string]$OutputDirectory = ""
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$repoRoot = Split-Path -Parent $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($OutputDirectory)) {
  $OutputDirectory = Join-Path $repoRoot "assets\readme"
}

New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null

$colors = @{
  Canvas = [System.Drawing.ColorTranslator]::FromHtml("#F7F7F4")
  CanvasSoft = [System.Drawing.ColorTranslator]::FromHtml("#FAFAF7")
  Card = [System.Drawing.ColorTranslator]::FromHtml("#FFFFFF")
  Ink = [System.Drawing.ColorTranslator]::FromHtml("#26251E")
  Body = [System.Drawing.ColorTranslator]::FromHtml("#5A5852")
  Muted = [System.Drawing.ColorTranslator]::FromHtml("#807D72")
  MutedSoft = [System.Drawing.ColorTranslator]::FromHtml("#A09C92")
  Hairline = [System.Drawing.ColorTranslator]::FromHtml("#E6E5E0")
  HairlineStrong = [System.Drawing.ColorTranslator]::FromHtml("#CFCDC4")
  Primary = [System.Drawing.ColorTranslator]::FromHtml("#F54E00")
  Success = [System.Drawing.ColorTranslator]::FromHtml("#1F8A65")
  OnPrimary = [System.Drawing.ColorTranslator]::FromHtml("#FFFFFF")
}

$logoPath = Join-Path $repoRoot "public\brand\rakibhq-logo-512.png"
$artworkPath = Join-Path $repoRoot "public\brand\rakibhq-hero-artwork.png"
$agentDomainPath = Join-Path $repoRoot "public\projects\agentdomain-social-card.png"
$nexoraPath = Join-Path $repoRoot "public\projects\nexoraswap-icon.png"
$atlasPath = Join-Path $repoRoot "public\projects\atlasassistant-icon.png"

function New-ReadmeCanvas {
  param(
    [int]$Width,
    [int]$Height,
    [System.Drawing.Color]$Background
  )

  $bitmap = [System.Drawing.Bitmap]::new($Width, $Height)
  $bitmap.SetResolution(144, 144)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $graphics.Clear($Background)

  return @{
    Bitmap = $bitmap
    Graphics = $graphics
  }
}

function New-DisplayFont {
  param(
    [float]$Size,
    [System.Drawing.FontStyle]$Style = [System.Drawing.FontStyle]::Regular,
    [string]$Family = "Segoe UI"
  )

  try {
    return [System.Drawing.Font]::new(
      $Family,
      $Size,
      $Style,
      [System.Drawing.GraphicsUnit]::Pixel
    )
  }
  catch {
    return [System.Drawing.Font]::new(
      "Arial",
      $Size,
      $Style,
      [System.Drawing.GraphicsUnit]::Pixel
    )
  }
}

function New-MonoFont {
  param(
    [float]$Size,
    [System.Drawing.FontStyle]$Style = [System.Drawing.FontStyle]::Regular
  )

  return New-DisplayFont -Size $Size -Style $Style -Family "Consolas"
}

function New-RoundedPath {
  param(
    [System.Drawing.RectangleF]$Rectangle,
    [float]$Radius
  )

  $diameter = $Radius * 2
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $path.AddArc($Rectangle.X, $Rectangle.Y, $diameter, $diameter, 180, 90)
  $path.AddArc($Rectangle.Right - $diameter, $Rectangle.Y, $diameter, $diameter, 270, 90)
  $path.AddArc(
    $Rectangle.Right - $diameter,
    $Rectangle.Bottom - $diameter,
    $diameter,
    $diameter,
    0,
    90
  )
  $path.AddArc($Rectangle.X, $Rectangle.Bottom - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function Fill-RoundedRectangle {
  param(
    [System.Drawing.Graphics]$Graphics,
    [System.Drawing.Brush]$Brush,
    [System.Drawing.RectangleF]$Rectangle,
    [float]$Radius
  )

  $path = New-RoundedPath -Rectangle $Rectangle -Radius $Radius
  $Graphics.FillPath($Brush, $path)
  $path.Dispose()
}

function Draw-RoundedRectangle {
  param(
    [System.Drawing.Graphics]$Graphics,
    [System.Drawing.Pen]$Pen,
    [System.Drawing.RectangleF]$Rectangle,
    [float]$Radius
  )

  $path = New-RoundedPath -Rectangle $Rectangle -Radius $Radius
  $Graphics.DrawPath($Pen, $path)
  $path.Dispose()
}

function Draw-Text {
  param(
    [System.Drawing.Graphics]$Graphics,
    [string]$Text,
    [System.Drawing.Font]$Font,
    [System.Drawing.Color]$Color,
    [System.Drawing.RectangleF]$Rectangle,
    [System.Drawing.StringAlignment]$Alignment = [System.Drawing.StringAlignment]::Near,
    [System.Drawing.StringAlignment]$LineAlignment = [System.Drawing.StringAlignment]::Near
  )

  $brush = [System.Drawing.SolidBrush]::new($Color)
  $format = [System.Drawing.StringFormat]::new()
  $format.Alignment = $Alignment
  $format.LineAlignment = $LineAlignment
  $format.Trimming = [System.Drawing.StringTrimming]::EllipsisWord
  $Graphics.DrawString($Text, $Font, $brush, $Rectangle, $format)
  $format.Dispose()
  $brush.Dispose()
}

function Draw-ImageContain {
  param(
    [System.Drawing.Graphics]$Graphics,
    [string]$Path,
    [System.Drawing.RectangleF]$Rectangle
  )

  $image = [System.Drawing.Image]::FromFile($Path)
  try {
    $scale = [Math]::Min($Rectangle.Width / $image.Width, $Rectangle.Height / $image.Height)
    $width = [float]($image.Width * $scale)
    $height = [float]($image.Height * $scale)
    $x = $Rectangle.X + (($Rectangle.Width - $width) / 2)
    $y = $Rectangle.Y + (($Rectangle.Height - $height) / 2)
    $Graphics.DrawImage($image, $x, $y, $width, $height)
  }
  finally {
    $image.Dispose()
  }
}

function Draw-ImageCover {
  param(
    [System.Drawing.Graphics]$Graphics,
    [string]$Path,
    [System.Drawing.RectangleF]$Rectangle
  )

  $image = [System.Drawing.Image]::FromFile($Path)
  try {
    $scale = [Math]::Max($Rectangle.Width / $image.Width, $Rectangle.Height / $image.Height)
    $sourceWidth = $Rectangle.Width / $scale
    $sourceHeight = $Rectangle.Height / $scale
    $sourceX = ($image.Width - $sourceWidth) / 2
    $sourceY = ($image.Height - $sourceHeight) / 2
    $source = [System.Drawing.RectangleF]::new(
      [float]$sourceX,
      [float]$sourceY,
      [float]$sourceWidth,
      [float]$sourceHeight
    )
    $Graphics.DrawImage(
      $image,
      $Rectangle,
      $source,
      [System.Drawing.GraphicsUnit]::Pixel
    )
  }
  finally {
    $image.Dispose()
  }
}

function Draw-Brand {
  param(
    [System.Drawing.Graphics]$Graphics,
    [float]$X,
    [float]$Y,
    [float]$LogoSize = 46,
    [System.Drawing.Color]$TextColor = $colors.Primary
  )

  $logoRect = [System.Drawing.RectangleF]::new($X, $Y, $LogoSize, $LogoSize)
  Draw-ImageCover -Graphics $Graphics -Path $logoPath -Rectangle $logoRect

  $brandFont = New-DisplayFont -Size 24 -Style ([System.Drawing.FontStyle]::Bold)
  Draw-Text `
    -Graphics $Graphics `
    -Text "RakibHQ" `
    -Font $brandFont `
    -Color $TextColor `
    -Rectangle ([System.Drawing.RectangleF]::new(
      $X + $LogoSize + 14,
      $Y,
      220,
      $LogoSize
    )) `
    -LineAlignment ([System.Drawing.StringAlignment]::Center)
  $brandFont.Dispose()
}

function Draw-Tag {
  param(
    [System.Drawing.Graphics]$Graphics,
    [string]$Text,
    [float]$X,
    [float]$Y,
    [float]$Width,
    [System.Drawing.Color]$Background,
    [System.Drawing.Color]$Foreground
  )

  $rectangle = [System.Drawing.RectangleF]::new($X, $Y, $Width, 34)
  $brush = [System.Drawing.SolidBrush]::new($Background)
  Fill-RoundedRectangle -Graphics $Graphics -Brush $brush -Rectangle $rectangle -Radius 6
  $brush.Dispose()

  $font = New-MonoFont -Size 13 -Style ([System.Drawing.FontStyle]::Bold)
  Draw-Text `
    -Graphics $Graphics `
    -Text $Text `
    -Font $font `
    -Color $Foreground `
    -Rectangle $rectangle `
    -Alignment ([System.Drawing.StringAlignment]::Center) `
    -LineAlignment ([System.Drawing.StringAlignment]::Center)
  $font.Dispose()
}

function Save-ReadmeCanvas {
  param(
    [hashtable]$Canvas,
    [string]$FileName
  )

  $path = Join-Path $OutputDirectory $FileName
  $Canvas.Bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $Canvas.Graphics.Dispose()
  $Canvas.Bitmap.Dispose()
  Write-Output $path
}

# Hero
$hero = New-ReadmeCanvas -Width 1400 -Height 650 -Background $colors.Canvas
$g = $hero.Graphics

Draw-Brand -Graphics $g -X 64 -Y 48

$mono = New-MonoFont -Size 15
Draw-Text `
  -Graphics $g `
  -Text "MD. RAKIB / INDEPENDENT PRODUCT BUILDER" `
  -Font $mono `
  -Color $colors.Muted `
  -Rectangle ([System.Drawing.RectangleF]::new(64, 138, 500, 28))

$successBrush = [System.Drawing.SolidBrush]::new($colors.Success)
$g.FillEllipse($successBrush, 498, 144, 9, 9)
$successBrush.Dispose()
Draw-Text `
  -Graphics $g `
  -Text "KHULNA / BUILDING GLOBALLY" `
  -Font $mono `
  -Color $colors.Muted `
  -Rectangle ([System.Drawing.RectangleF]::new(520, 138, 350, 28))

$hairlinePen = [System.Drawing.Pen]::new($colors.HairlineStrong, 1)
$g.DrawLine($hairlinePen, 64, 180, 760, 180)
$hairlinePen.Dispose()
$mono.Dispose()

$titleFont = New-DisplayFont -Size 126 -Family "Segoe UI Light"
Draw-Text `
  -Graphics $g `
  -Text "RakibHQ" `
  -Font $titleFont `
  -Color $colors.Primary `
  -Rectangle ([System.Drawing.RectangleF]::new(54, 214, 700, 160))
$titleFont.Dispose()

$ledeFont = New-DisplayFont -Size 27
Draw-Text `
  -Graphics $g `
  -Text "The product headquarters for autonomous agent infrastructure,`nonchain execution, and AI-native tools." `
  -Font $ledeFont `
  -Color $colors.Body `
  -Rectangle ([System.Drawing.RectangleF]::new(64, 397, 650, 100))
$ledeFont.Dispose()

$linkFont = New-MonoFont -Size 15 -Style ([System.Drawing.FontStyle]::Bold)
Draw-Text `
  -Graphics $g `
  -Text "RAKIBHQ.XYZ  /  GITHUB.COM/0XMDRAKIB" `
  -Font $linkFont `
  -Color $colors.Ink `
  -Rectangle ([System.Drawing.RectangleF]::new(64, 542, 650, 36))
$linkFont.Dispose()

Draw-ImageContain `
  -Graphics $g `
  -Path $artworkPath `
  -Rectangle ([System.Drawing.RectangleF]::new(755, 25, 650, 620))

Save-ReadmeCanvas -Canvas $hero -FileName "rakibhq-profile-hero.png"

# Flagship project
$flagship = New-ReadmeCanvas -Width 1400 -Height 720 -Background $colors.Ink
$g = $flagship.Graphics

$orangeBrush = [System.Drawing.SolidBrush]::new($colors.Primary)
$g.FillEllipse($orangeBrush, 64, 62, 11, 11)
$orangeBrush.Dispose()

$mono = New-MonoFont -Size 15 -Style ([System.Drawing.FontStyle]::Bold)
Draw-Text `
  -Graphics $g `
  -Text "01 / FLAGSHIP SYSTEM / AGENT IDENTITY INFRASTRUCTURE" `
  -Font $mono `
  -Color $colors.MutedSoft `
  -Rectangle ([System.Drawing.RectangleF]::new(92, 54, 650, 36))
$mono.Dispose()

$flagshipTitle = New-DisplayFont -Size 88 -Family "Segoe UI Light"
Draw-Text `
  -Graphics $g `
  -Text "AgentDomain" `
  -Font $flagshipTitle `
  -Color $colors.Canvas `
  -Rectangle ([System.Drawing.RectangleF]::new(58, 118, 640, 118))
$flagshipTitle.Dispose()

$flagshipTagline = New-DisplayFont -Size 31
Draw-Text `
  -Graphics $g `
  -Text "Identity infrastructure for`nthe agentic internet." `
  -Font $flagshipTagline `
  -Color $colors.Canvas `
  -Rectangle ([System.Drawing.RectangleF]::new(64, 258, 540, 100))
$flagshipTagline.Dispose()

$flagshipBody = New-DisplayFont -Size 22
Draw-Text `
  -Graphics $g `
  -Text "One programmable registration flow for domains,`nmanaged DNS, email, SSL, onchain names, AgentID,`nand autonomous renewals." `
  -Font $flagshipBody `
  -Color ([System.Drawing.ColorTranslator]::FromHtml("#D3D1C9")) `
  -Rectangle ([System.Drawing.RectangleF]::new(64, 382, 600, 130))
$flagshipBody.Dispose()

Draw-Tag -Graphics $g -Text "DOMAIN + DNS" -X 64 -Y 550 -Width 132 -Background $colors.Primary -Foreground $colors.OnPrimary
Draw-Tag -Graphics $g -Text "EMAIL + SSL" -X 210 -Y 550 -Width 124 -Background ([System.Drawing.ColorTranslator]::FromHtml("#3A3933")) -Foreground $colors.Canvas
Draw-Tag -Graphics $g -Text "ENS + BASE" -X 348 -Y 550 -Width 116 -Background ([System.Drawing.ColorTranslator]::FromHtml("#3A3933")) -Foreground $colors.Canvas
Draw-Tag -Graphics $g -Text "AGENTID + MCP" -X 478 -Y 550 -Width 146 -Background ([System.Drawing.ColorTranslator]::FromHtml("#3A3933")) -Foreground $colors.Canvas

$linkFont = New-MonoFont -Size 15 -Style ([System.Drawing.FontStyle]::Bold)
Draw-Text `
  -Graphics $g `
  -Text "AGENTDOMAIN.APP  /  VISIT FLAGSHIP" `
  -Font $linkFont `
  -Color $colors.Primary `
  -Rectangle ([System.Drawing.RectangleF]::new(64, 630, 320, 34))
$linkFont.Dispose()

$previewCard = [System.Drawing.RectangleF]::new(726, 132, 610, 414)
$previewBrush = [System.Drawing.SolidBrush]::new($colors.Card)
Fill-RoundedRectangle -Graphics $g -Brush $previewBrush -Rectangle $previewCard -Radius 12
$previewBrush.Dispose()

Draw-ImageContain `
  -Graphics $g `
  -Path $agentDomainPath `
  -Rectangle ([System.Drawing.RectangleF]::new(744, 151, 574, 377))

$whyPen = [System.Drawing.Pen]::new($colors.Primary, 3)
$g.DrawLine($whyPen, 726, 596, 726, 660)
$whyPen.Dispose()

$whyLabel = New-MonoFont -Size 13 -Style ([System.Drawing.FontStyle]::Bold)
Draw-Text `
  -Graphics $g `
  -Text "WHY IT MATTERS" `
  -Font $whyLabel `
  -Color $colors.MutedSoft `
  -Rectangle ([System.Drawing.RectangleF]::new(750, 588, 240, 28))
$whyLabel.Dispose()

$whyBody = New-DisplayFont -Size 19
Draw-Text `
  -Graphics $g `
  -Text "Replaces a fragmented manual setup with one identity layer`nthat autonomous agents can own and operate." `
  -Font $whyBody `
  -Color $colors.Canvas `
  -Rectangle ([System.Drawing.RectangleF]::new(750, 620, 570, 62))
$whyBody.Dispose()

Save-ReadmeCanvas -Canvas $flagship -FileName "agentdomain-flagship.png"

function New-ProjectCard {
  param(
    [string]$FileName,
    [string]$Index,
    [string]$Category,
    [string]$Name,
    [string]$Tagline,
    [string]$Description,
    [string[]]$Tags,
    [string]$Link,
    [string]$IconPath
  )

  $card = New-ReadmeCanvas -Width 1400 -Height 430 -Background $colors.Card
  $g = $card.Graphics

  $borderPen = [System.Drawing.Pen]::new($colors.Hairline, 2)
  Draw-RoundedRectangle `
    -Graphics $g `
    -Pen $borderPen `
    -Rectangle ([System.Drawing.RectangleF]::new(1, 1, 1397, 427)) `
    -Radius 12
  $borderPen.Dispose()

  $mono = New-MonoFont -Size 14 -Style ([System.Drawing.FontStyle]::Bold)
  Draw-Text `
    -Graphics $g `
    -Text "$Index / $Category" `
    -Font $mono `
    -Color $colors.Muted `
    -Rectangle ([System.Drawing.RectangleF]::new(48, 36, 530, 30))
  $mono.Dispose()

  $statusBrush = [System.Drawing.SolidBrush]::new($colors.Success)
  $g.FillEllipse($statusBrush, 1338, 43, 9, 9)
  $statusBrush.Dispose()

  $iconBackground = [System.Drawing.SolidBrush]::new($colors.CanvasSoft)
  $iconRect = [System.Drawing.RectangleF]::new(48, 100, 112, 112)
  Fill-RoundedRectangle -Graphics $g -Brush $iconBackground -Rectangle $iconRect -Radius 10
  $iconBackground.Dispose()
  Draw-ImageContain `
    -Graphics $g `
    -Path $IconPath `
    -Rectangle ([System.Drawing.RectangleF]::new(60, 112, 88, 88))

  $title = New-DisplayFont -Size 60 -Family "Segoe UI Light"
  Draw-Text `
    -Graphics $g `
    -Text $Name `
    -Font $title `
    -Color $colors.Ink `
    -Rectangle ([System.Drawing.RectangleF]::new(196, 90, 500, 76))
  $title.Dispose()

  $taglineFont = New-DisplayFont -Size 23
  Draw-Text `
    -Graphics $g `
    -Text $Tagline `
    -Font $taglineFont `
    -Color $colors.Body `
    -Rectangle ([System.Drawing.RectangleF]::new(200, 170, 510, 66))
  $taglineFont.Dispose()

  $hairlinePen = [System.Drawing.Pen]::new($colors.Hairline, 1)
  $g.DrawLine($hairlinePen, 752, 48, 752, 380)
  $hairlinePen.Dispose()

  $descriptionFont = New-DisplayFont -Size 22
  Draw-Text `
    -Graphics $g `
    -Text $Description `
    -Font $descriptionFont `
    -Color $colors.Body `
    -Rectangle ([System.Drawing.RectangleF]::new(808, 78, 530, 150))
  $descriptionFont.Dispose()

  $tagX = 808
  foreach ($tag in $Tags) {
    $tagWidth = [Math]::Max(84, 20 + ($tag.Length * 9))
    Draw-Tag `
      -Graphics $g `
      -Text $tag.ToUpperInvariant() `
      -X $tagX `
      -Y 268 `
      -Width $tagWidth `
      -Background $colors.Canvas `
      -Foreground $colors.Body
    $tagX += $tagWidth + 10
  }

  $linkFont = New-MonoFont -Size 15 -Style ([System.Drawing.FontStyle]::Bold)
  Draw-Text `
    -Graphics $g `
    -Text $Link `
    -Font $linkFont `
    -Color $colors.Primary `
    -Rectangle ([System.Drawing.RectangleF]::new(808, 344, 550, 32))
  $linkFont.Dispose()

  Save-ReadmeCanvas -Canvas $card -FileName $FileName
}

New-ProjectCard `
  -FileName "nexoraswap-project.png" `
  -Index "02" `
  -Category "ONCHAIN EXECUTION" `
  -Name "NexoraSwap" `
  -Tagline "Multi-router execution without the route hunting." `
  -Description "A cross-chain DEX console that compares routes across EVM networks and Solana while keeping quotes, fees, balances, and minimum received visible before execution." `
  -Tags @("Next.js", "Wagmi", "LI.FI") `
  -Link "NEXORASWAP.ONLINE  /  VISIT PRODUCT" `
  -IconPath $nexoraPath

New-ProjectCard `
  -FileName "atlasassistant-project.png" `
  -Index "03" `
  -Category "APPLIED AI" `
  -Name "AtlasAssistant" `
  -Tagline "A calmer interface for understanding the world." `
  -Description "A high-signal global news workspace with focused feeds, AI digests, article summaries, listening mode, and broad language support." `
  -Tags @("Next.js", "Prisma", "AI") `
  -Link "ATLASASSISTANT.ONLINE  /  VISIT PRODUCT" `
  -IconPath $atlasPath

# Closing panel
$closing = New-ReadmeCanvas -Width 1400 -Height 300 -Background $colors.Canvas
$g = $closing.Graphics

Draw-Brand -Graphics $g -X 64 -Y 52

$closingTitle = New-DisplayFont -Size 43 -Family "Segoe UI Light"
Draw-Text `
  -Graphics $g `
  -Text "Building useful systems for the open internet." `
  -Font $closingTitle `
  -Color $colors.Ink `
  -Rectangle ([System.Drawing.RectangleF]::new(64, 132, 950, 76))
$closingTitle.Dispose()

$closingMono = New-MonoFont -Size 15
Draw-Text `
  -Graphics $g `
  -Text "KHULNA, BANGLADESH  /  RAKIBHQ.XYZ  /  @0XMDRAKIB" `
  -Font $closingMono `
  -Color $colors.Muted `
  -Rectangle ([System.Drawing.RectangleF]::new(64, 230, 800, 34))
$closingMono.Dispose()

Draw-ImageContain `
  -Graphics $g `
  -Path $artworkPath `
  -Rectangle ([System.Drawing.RectangleF]::new(1030, 12, 350, 280))

Save-ReadmeCanvas -Canvas $closing -FileName "rakibhq-profile-footer.png"
