param(
  [Parameter(Mandatory = $true)]
  [string]$HeroSourcePath,
  [string]$BrandDirectory = ""
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$repoRoot = Split-Path -Parent $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($BrandDirectory)) {
  $BrandDirectory = Join-Path $repoRoot "public\brand"
}

New-Item -ItemType Directory -Force -Path $BrandDirectory | Out-Null

$canvasColor = [System.Drawing.ColorTranslator]::FromHtml("#F7F7F4")
$cardColor = [System.Drawing.ColorTranslator]::FromHtml("#FFFFFF")
$hairlineColor = [System.Drawing.ColorTranslator]::FromHtml("#E6E5E0")
$inkColor = [System.Drawing.ColorTranslator]::FromHtml("#26251E")
$primaryColor = [System.Drawing.ColorTranslator]::FromHtml("#F54E00")

$source = [System.Drawing.Bitmap]::new($HeroSourcePath)
try {
  $corrected = [System.Drawing.Bitmap]::new(
    $source.Width,
    $source.Height,
    [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
  )
  $corrected.SetResolution(144, 144)
  try {
    $graphics = [System.Drawing.Graphics]::FromImage($corrected)
    try {
      $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
      $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $graphics.DrawImageUnscaled($source, 0, 0)

      $originalPortal = [System.Drawing.PointF[]]@(
        [System.Drawing.PointF]::new(945, 474),
        [System.Drawing.PointF]::new(1055, 525),
        [System.Drawing.PointF]::new(1055, 704),
        [System.Drawing.PointF]::new(945, 653)
      )
      $centeredPortal = [System.Drawing.PointF[]]@(
        [System.Drawing.PointF]::new(945.5, 492.5),
        [System.Drawing.PointF]::new(1055.5, 543.5),
        [System.Drawing.PointF]::new(1055.5, 722.5),
        [System.Drawing.PointF]::new(945.5, 671.5)
      )
      $centeredInner = [System.Drawing.PointF[]]@(
        [System.Drawing.PointF]::new(966, 528.5),
        [System.Drawing.PointF]::new(1035, 560.5),
        [System.Drawing.PointF]::new(1035, 686.5),
        [System.Drawing.PointF]::new(966, 654.5)
      )
      $centeredCore = [System.Drawing.PointF[]]@(
        [System.Drawing.PointF]::new(981.5, 579),
        [System.Drawing.PointF]::new(1019.5, 597),
        [System.Drawing.PointF]::new(1019.5, 636),
        [System.Drawing.PointF]::new(981.5, 618)
      )

      $inkBrush = [System.Drawing.SolidBrush]::new($inkColor)
      $erasePen = [System.Drawing.Pen]::new($inkColor, 4)
      $graphics.FillPolygon($inkBrush, $originalPortal)
      $graphics.DrawPolygon($erasePen, $originalPortal)
      $erasePen.Dispose()
      $inkBrush.Dispose()

      $portalBrush = [System.Drawing.SolidBrush]::new($canvasColor)
      $portalPen = [System.Drawing.Pen]::new($hairlineColor, 1)
      $graphics.FillPolygon($portalBrush, $centeredPortal)
      $graphics.DrawPolygon($portalPen, $centeredPortal)
      $portalPen.Dispose()
      $portalBrush.Dispose()

      $innerBrush = [System.Drawing.SolidBrush]::new($cardColor)
      $graphics.FillPolygon($innerBrush, $centeredInner)
      $innerBrush.Dispose()

      $coreBrush = [System.Drawing.SolidBrush]::new($primaryColor)
      $graphics.FillPolygon($coreBrush, $centeredCore)
      $coreBrush.Dispose()
    }
    finally {
      $graphics.Dispose()
    }

    $masterPath = Join-Path $BrandDirectory "rakibhq-hero-artwork.png"
    $corrected.Save($masterPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $optimized = [System.Drawing.Bitmap]::new(
      1040,
      1040,
      [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
    )
    $optimized.SetResolution(144, 144)
    try {
      $optimizedGraphics = [System.Drawing.Graphics]::FromImage($optimized)
      try {
        $optimizedGraphics.Clear($canvasColor)
        $optimizedGraphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $optimizedGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $optimizedGraphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $optimizedGraphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $destination = [System.Drawing.RectangleF]::new(0, 0, 1040, 1040)
        $cropWithoutRightBorder = [System.Drawing.RectangleF]::new(560, 80, 1036, 1040)
        $optimizedGraphics.DrawImage(
          $corrected,
          $destination,
          $cropWithoutRightBorder,
          [System.Drawing.GraphicsUnit]::Pixel
        )
      }
      finally {
        $optimizedGraphics.Dispose()
      }

      $optimized.MakeTransparent($canvasColor)
      $optimizedPath = Join-Path $BrandDirectory "rakibhq-hero-artwork-v2.png"
      $optimized.Save($optimizedPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    finally {
      $optimized.Dispose()
    }
  }
  finally {
    $corrected.Dispose()
  }
}
finally {
  $source.Dispose()
}

Write-Output "Generated corrected RakibHQ hero artwork assets in $BrandDirectory"
