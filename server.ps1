$folder = $PSScriptRoot
if (-not $folder) {
    $folder = (Get-Location).Path
}

# Find local IPv4 address for Wi-Fi sharing
$ip = "localhost"
try {
    $foundIp = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254*" } | Select-Object -First 1).IPAddress
    if ($foundIp) { $ip = $foundIp }
} catch {}

$activePort = 8088

# Add multi-threaded high-performance C# server
$source = @"
using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Collections.Generic;

public class AnubisServer {
    private TcpListener listener;
    private string rootDir;
    private volatile bool isRunning;
    public int BoundPort { get; private set; }

    private static readonly Dictionary<string, string> MimeTypes = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) {
        { ".html", "text/html; charset=utf-8" },
        { ".htm", "text/html; charset=utf-8" },
        { ".png", "image/png" },
        { ".jpg", "image/jpeg" },
        { ".jpeg", "image/jpeg" },
        { ".webp", "image/webp" },
        { ".gif", "image/gif" },
        { ".svg", "image/svg+xml" },
        { ".css", "text/css; charset=utf-8" },
        { ".js", "application/javascript; charset=utf-8" },
        { ".json", "application/json; charset=utf-8" },
        { ".ico", "image/x-icon" },
        { ".woff", "font/woff" },
        { ".woff2", "font/woff2" },
        { ".ttf", "font/ttf" }
    };

    public bool Start(int[] ports, string dir) {
        rootDir = dir;
        foreach (int p in ports) {
            try {
                listener = new TcpListener(IPAddress.Any, p);
                listener.Start();
                BoundPort = p;
                isRunning = true;
                break;
            } catch {}
        }

        if (!isRunning) return false;

        ThreadPool.QueueUserWorkItem(ListenLoop);
        return true;
    }

    private void ListenLoop(object state) {
        while (isRunning) {
            try {
                var client = listener.AcceptTcpClient();
                ThreadPool.QueueUserWorkItem(HandleClient, client);
            } catch {
                if (!isRunning) break;
            }
        }
    }

    private void HandleClient(object state) {
        var client = (TcpClient)state;
        try {
            client.ReceiveTimeout = 8000;
            client.SendTimeout = 8000;
            using (var stream = client.GetStream()) {
                byte[] buffer = new byte[8192];
                int bytesRead = stream.Read(buffer, 0, buffer.Length);
                if (bytesRead > 0) {
                    string req = Encoding.UTF8.GetString(buffer, 0, bytesRead);
                    string firstLine = req.Split(new[] { "\r\n", "\n" }, StringSplitOptions.None)[0];
                    string[] parts = firstLine.Split(' ');
                    if (parts.Length >= 2) {
                        string rawPath = parts[1].Split('?')[0].Split('#')[0];
                        rawPath = Uri.UnescapeDataString(rawPath).TrimStart('/', '\\');
                        if (string.IsNullOrEmpty(rawPath)) rawPath = "index.html";
                        if (rawPath.Equals("admin", StringComparison.OrdinalIgnoreCase) || rawPath.Equals("admin/", StringComparison.OrdinalIgnoreCase)) {
                            rawPath = "admin.html";
                        }

                        string filePath = Path.Combine(rootDir, rawPath);
                        if (File.Exists(filePath)) {
                            byte[] fileBytes = File.ReadAllBytes(filePath);
                            string ext = Path.GetExtension(filePath);
                            string mime = "application/octet-stream";
                            if (!string.IsNullOrEmpty(ext) && MimeTypes.ContainsKey(ext)) {
                                mime = MimeTypes[ext];
                            }

                            string headers = "HTTP/1.1 200 OK\r\n" +
                                             "Content-Type: " + mime + "\r\n" +
                                             "Content-Length: " + fileBytes.Length + "\r\n" +
                                             "Access-Control-Allow-Origin: *\r\n" +
                                             "Connection: close\r\n\r\n";
                            byte[] headerBytes = Encoding.UTF8.GetBytes(headers);
                            stream.Write(headerBytes, 0, headerBytes.Length);
                            stream.Write(fileBytes, 0, fileBytes.Length);
                            stream.Flush();
                        } else {
                            byte[] notFound = Encoding.UTF8.GetBytes("404 - Page Not Found");
                            string headers = "HTTP/1.1 404 Not Found\r\n" +
                                             "Content-Type: text/plain; charset=utf-8\r\n" +
                                             "Content-Length: " + notFound.Length + "\r\n" +
                                             "Access-Control-Allow-Origin: *\r\n" +
                                             "Connection: close\r\n\r\n";
                            byte[] headerBytes = Encoding.UTF8.GetBytes(headers);
                            stream.Write(headerBytes, 0, headerBytes.Length);
                            stream.Write(notFound, 0, notFound.Length);
                            stream.Flush();
                        }
                    }
                }
                try { client.Client.Shutdown(SocketShutdown.Both); } catch {}
            }
        } catch {}
        finally {
            try { client.Close(); } catch {}
        }
    }

    public void Stop() {
        isRunning = false;
        try { listener.Stop(); } catch {}
    }
}
"@

Add-Type -TypeDefinition $source -Language CSharp

$srv = New-Object AnubisServer
$ports = [int[]]@(8088, 8081, 8082, 5500, 3000, 5000)
$started = $srv.Start($ports, $folder)

if (-not $started) {
    Write-Host "Error: Could not bind to any port." -ForegroundColor Red
    exit 1
}

$activePort = $srv.BoundPort

# Save active port for other scripts
try {
    $activePort | Out-File -FilePath (Join-Path $folder ".active_port") -Encoding ascii -Force
} catch {}

$localUrl = "http://localhost:$activePort"
$mobileUrl = "http://${ip}:$activePort"

Clear-Host
Write-Host ""
Write-Host "================================================================" -ForegroundColor Yellow
Write-Host "         ANUBIS TRAVEL - Web Server is RUNNING!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "  [PC / Computer]:    $localUrl" -ForegroundColor Cyan
Write-Host "  [Mobile / Phone]:   $mobileUrl" -ForegroundColor Green
Write-Host ""
Write-Host "  * Phone must be connected to the SAME Wi-Fi network." -ForegroundColor Gray
Write-Host "================================================================" -ForegroundColor Yellow
Write-Host "  To stop: Close this window or run stop-server.bat" -ForegroundColor DarkGray
Write-Host ""

try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    $srv.Stop()
}
