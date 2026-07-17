Add-Type -AssemblyName System.Drawing

$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$sourcePath = "C:\Users\Md. Rakib\AppData\Local\Temp\Profile 1 (1).jpg"
$heroSourcePath = "C:\Users\Md. Rakib\Downloads\all of my projects\RakibHQ Hero Concept\rakibhq-hero-concept-v1.png"
$brandDir = Join-Path $repoRoot "public\brand"
$assetsBrandDir = Join-Path $repoRoot "assets\brand"

New-Item -ItemType Directory -Force -Path $brandDir, $assetsBrandDir | Out-Null
Copy-Item -LiteralPath $sourcePath -Destination (Join-Path $brandDir "rakibhq-logo-master.jpg") -Force
Copy-Item -LiteralPath $sourcePath -Destination (Join-Path $assetsBrandDir "rakibhq-logo-master.jpg") -Force
Copy-Item -LiteralPath $heroSourcePath -Destination (Join-Path $brandDir "rakibhq-hero-artwork.png") -Force

function Export-SquarePng {
    param(
        [System.Drawing.Image]$Source,
        [int]$Size,
        [string]$OutputPath
    )

    $bitmap = New-Object System.Drawing.Bitmap $Size, $Size
    $bitmap.SetResolution(144, 144)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.DrawImage($Source, 0, 0, $Size, $Size)
    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

$source = [System.Drawing.Image]::FromFile($sourcePath)
Export-SquarePng $source 1200 (Join-Path $brandDir "rakibhq-social-logo.png")
Export-SquarePng $source 512 (Join-Path $brandDir "rakibhq-logo-512.png")
Export-SquarePng $source 192 (Join-Path $brandDir "rakibhq-logo-192.png")
Export-SquarePng $source 180 (Join-Path $brandDir "apple-touch-icon.png")
Export-SquarePng $source 64 (Join-Path $brandDir "rakibhq-logo-64.png")
Export-SquarePng $source 32 (Join-Path $brandDir "favicon-32.png")
Export-SquarePng $source 16 (Join-Path $brandDir "favicon-16.png")
Export-SquarePng $source 512 (Join-Path $assetsBrandDir "rakibhq-logo-512.png")
$source.Dispose()

Write-Output "Generated RakibHQ brand assets in $brandDir"
