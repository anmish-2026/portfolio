# Simple PowerShell HTTP Server for local testing
$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Local web server running at http://localhost:$port/"
Write-Host "Press Ctrl+C to stop the server."

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/") {
            $urlPath = "/index.html"
        }
        
        # Replace forward slashes with backward slashes for Windows paths
        $localRelative = $urlPath.Replace("/", "\").TrimStart("\")
        $filePath = Join-Path (Get-Location) $localRelative
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            
            # Set mime type
            if ($filePath.EndsWith(".html")) {
                $response.ContentType = "text/html"
            } elseif ($filePath.EndsWith(".css")) {
                $response.ContentType = "text/css"
            } elseif ($filePath.EndsWith(".js")) {
                $response.ContentType = "application/javascript"
            } elseif ($filePath.EndsWith(".png")) {
                $response.ContentType = "image/png"
            } elseif ($filePath.EndsWith(".jpg") -or $filePath.EndsWith(".jpeg")) {
                $response.ContentType = "image/jpeg"
            } elseif ($filePath.EndsWith(".svg")) {
                $response.ContentType = "image/svg+xml"
            }
            
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $response.ContentType = "text/plain"
            $errorMessage = [System.Text.Encoding]::UTF8.GetBytes("File Not Found: $urlPath")
            $response.OutputStream.Write($errorMessage, 0, $errorMessage.Length)
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
}
