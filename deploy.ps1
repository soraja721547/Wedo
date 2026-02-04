# Build and Deploy to Production
Write-Host "Building for Production..." -ForegroundColor Green

# 1. Restore minimal index.html for clean build (Vite injects everything)
$cleanHtml = @"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WEDO</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
"@
Set-Content -Path "index.html" -Value $cleanHtml

# 2. Run Build
npm run build

# 3. Deploy (Copy dist to root)
Write-Host "Deploying to XAMPP root..." -ForegroundColor Cyan
Copy-Item -Path "dist\*" -Destination ".\" -Recurse -Force

Write-Host "Deployment Complete! Production ready." -ForegroundColor Green
