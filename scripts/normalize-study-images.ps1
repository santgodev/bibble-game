param(
    [string]$TargetPath = "assets/study",
    [int]$Width = 900,
    [int]$Height = 600,
    [int]$Padding = 24,
    [long]$Quality = 80
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$csharp = @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class StudyImageNormalizer {
    public static Rectangle GetContentBounds(Bitmap bmp, int whiteThreshold) {
        int w = bmp.Width;
        int h = bmp.Height;
        BitmapData data = bmp.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadOnly, PixelFormat.Format24bppRgb);
        int stride = data.Stride;
        byte[] buffer = new byte[stride * h];
        Marshal.Copy(data.Scan0, buffer, 0, buffer.Length);
        bmp.UnlockBits(data);

        int minX = w, minY = h, maxX = -1, maxY = -1;
        for (int y = 0; y < h; y++) {
            int row = y * stride;
            for (int x = 0; x < w; x++) {
                int idx = row + x * 3;
                byte b = buffer[idx];
                byte g = buffer[idx + 1];
                byte r = buffer[idx + 2];
                if (r < whiteThreshold || g < whiteThreshold || b < whiteThreshold) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }
        if (maxX < minX || maxY < minY) {
            return new Rectangle(0, 0, w, h);
        }
        return new Rectangle(minX, minY, (maxX - minX) + 1, (maxY - minY) + 1);
    }

    public static void NormalizeToJpeg(string srcPath, string destTempPath, int outW, int outH, int pad, long quality, out int origW, out int origH) {
        byte[] raw = System.IO.File.ReadAllBytes(srcPath);
        using (var ms = new System.IO.MemoryStream(raw))
        using (var srcImg = Image.FromStream(ms)) {
            origW = srcImg.Width;
            origH = srcImg.Height;

            using (var src24 = new Bitmap(origW, origH, PixelFormat.Format24bppRgb)) {
                using (var gSrc = Graphics.FromImage(src24)) {
                    gSrc.Clear(Color.White);
                    gSrc.DrawImage(srcImg, 0, 0, origW, origH);
                }

                Rectangle bounds = GetContentBounds(src24, 245);
                double availW = Math.Max(1.0, outW - 2.0 * pad);
                double availH = Math.Max(1.0, outH - 2.0 * pad);
                double scale = Math.Min(availW / bounds.Width, availH / bounds.Height);
                if (scale > 1.6) scale = 1.6;

                int drawW = Math.Max(1, (int)Math.Round(bounds.Width * scale));
                int drawH = Math.Max(1, (int)Math.Round(bounds.Height * scale));
                int drawX = (outW - drawW) / 2;
                int drawY = (outH - drawH) / 2;

                using (var canvas = new Bitmap(outW, outH, PixelFormat.Format24bppRgb)) {
                    canvas.SetResolution(96f, 96f);
                    using (var g = Graphics.FromImage(canvas))
                    using (var attrs = new ImageAttributes()) {
                        attrs.SetWrapMode(WrapMode.TileFlipXY);
                        g.Clear(Color.White);
                        g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                        g.SmoothingMode = SmoothingMode.HighQuality;
                        g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                        g.CompositingQuality = CompositingQuality.HighQuality;
                        g.DrawImage(
                            src24,
                            new Rectangle(drawX, drawY, drawW, drawH),
                            bounds.X,
                            bounds.Y,
                            bounds.Width,
                            bounds.Height,
                            GraphicsUnit.Pixel,
                            attrs
                        );
                    }

                    ImageCodecInfo jpegCodec = null;
                    foreach (var c in ImageCodecInfo.GetImageEncoders()) {
                        if (c.MimeType == "image/jpeg") { jpegCodec = c; break; }
                    }
                    using (var encParams = new EncoderParameters(1)) {
                        encParams.Param[0] = new EncoderParameter(Encoder.Quality, quality);
                        canvas.Save(destTempPath, jpegCodec, encParams);
                    }
                }
            }
        }
    }
}
"@

if (-not ("StudyImageNormalizer" -as [type])) {
    Add-Type -TypeDefinition $csharp -ReferencedAssemblies @("System.Drawing")
}

$resolvedTarget = (Resolve-Path $TargetPath).Path
$repoRoot = (Get-Location).Path

$webpFiles = Get-ChildItem -Path $resolvedTarget -Recurse -File -Include *.webp
foreach ($wf in $webpFiles) {
    Write-Warning "WEBP no soportado nativamente: $($wf.FullName). Conviértelo a PNG o JPG."
}

$files = Get-ChildItem -Path $resolvedTarget -Recurse -File -Include *.jpg,*.jpeg,*.png | Sort-Object FullName
if ($files.Count -eq 0) {
    Write-Output "No se encontraron imágenes (.jpg/.jpeg/.png) en $TargetPath"
    exit 0
}

$totalBefore = 0L
$totalAfter = 0L
$processed = 0

foreach ($f in $files) {
    $origBytes = $f.Length
    $totalBefore += $origBytes
    $origW = 0
    $origH = 0

    $destDir = $f.DirectoryName
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)
    $destJpg = [System.IO.Path]::Combine($destDir, "$baseName.jpg")
    $tmp = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "norm_" + [System.Guid]::NewGuid().ToString("N") + ".jpg")

    try {
        [StudyImageNormalizer]::NormalizeToJpeg($f.FullName, $tmp, $Width, $Height, $Padding, $Quality, [ref]$origW, [ref]$origH)

        $tmpInfo = Get-Item $tmp
        if ($tmpInfo.Length -le 5120) {
            throw "Archivo temporal demasiado pequeño ($($tmpInfo.Length) bytes) para $($f.FullName)"
        }

        $chk = [System.Drawing.Image]::FromFile($tmp)
        $chkW = $chk.Width
        $chkH = $chk.Height
        $chk.Dispose()
        if ($chkW -ne $Width -or $chkH -ne $Height) {
            throw "Dimensiones inesperadas (${chkW}x${chkH}) para $($f.FullName)"
        }

        [System.IO.File]::Copy($tmp, $destJpg, $true)
        if ($f.FullName -ne $destJpg -and (Test-Path $f.FullName)) {
            Remove-Item $f.FullName -Force
        }

        $afterBytes = (Get-Item $destJpg).Length
        $totalAfter += $afterBytes
        $processed++

        $rel = $destJpg
        if ($rel.StartsWith($repoRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
            $rel = $rel.Substring($repoRoot.Length).TrimStart('\', '/')
        }
        Write-Output ("{0,-46} {1,6}KB -> {2,6}KB  {3}x{4} -> {5}x{6}" -f $rel, [int][Math]::Round($origBytes / 1024), [int][Math]::Round($afterBytes / 1024), $origW, $origH, $Width, $Height)
    } finally {
        if (Test-Path $tmp) { Remove-Item $tmp -Force }
    }
}

Write-Output ("TOTAL ({0} imágenes): {1} KB -> {2} KB (diferencia {3} KB)" -f $processed, [int][Math]::Round($totalBefore / 1024), [int][Math]::Round($totalAfter / 1024), [int][Math]::Round(($totalAfter - $totalBefore) / 1024))
