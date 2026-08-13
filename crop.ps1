Add-Type -AssemblyName System.Drawing
$imgPath = "C:\Users\ANSARUL\.gemini\antigravity\brain\dda107e8-d72b-4027-80ff-1a5e06a1ae48\.user_uploaded\media_1786520228724.jpg"
$img = [System.Drawing.Image]::FromFile($imgPath)

$outDir = "c:\Users\ANSARUL\OneDrive\Desktop\kitchenproduct\public\uploads"

# 1. Exact Flipkart EMI Logo (Yellow box with f and EMI)
# Position in 460x1024 image:
$logoRect = New-Object System.Drawing.Rectangle 140, 412, 42, 46
$logoBmp = New-Object System.Drawing.Bitmap $logoRect.Width, $logoRect.Height
$logoG = [System.Drawing.Graphics]::FromImage($logoBmp)
$logoG.DrawImage($img, 0, 0, $logoRect, [System.Drawing.GraphicsUnit]::Pixel)
$logoBmp.Save("$outDir\flipkart_emi_logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$logoG.Dispose()
$logoBmp.Dispose()

# 2. Exact Card Inside Red Box (White card with rounded border)
$cardRect = New-Object System.Drawing.Rectangle 118, 395, 308, 92
$cardBmp = New-Object System.Drawing.Bitmap $cardRect.Width, $cardRect.Height
$cardG = [System.Drawing.Graphics]::FromImage($cardBmp)
$cardG.DrawImage($img, 0, 0, $cardRect, [System.Drawing.GraphicsUnit]::Pixel)
$cardBmp.Save("$outDir\instant_emi_card_cropped.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cardG.Dispose()
$cardBmp.Dispose()

$img.Dispose()
Write-Host "Exact cropped logo and card generated successfully!"
