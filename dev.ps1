# Switch to Development Mode
Write-Host "Switching to Development Mode..." -ForegroundColor Green

# Restore Development index.html
$devHtml = @"
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

Set-Content -Path "index.html" -Value $devHtml
Write-Host "index.html restored to development version." -ForegroundColor Cyan

# Remove production assets to avoid confusion
Remove-Item -Path "assets" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "sw.js" -ErrorAction SilentlyContinue
Remove-Item -Path "workbox-*.js" -ErrorAction SilentlyContinue

# Start Dev Server
Write-Host "Starting Vite Dev Server..." -ForegroundColor Yellow
npm run dev
