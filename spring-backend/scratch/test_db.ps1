$connectionString = "Server=localhost\SQLEXPRESS;Database=MtpAppDB2018_full;User ID=sa;Password=123;TrustServerCertificate=True"
$connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
try {
    $connection.Open()
    Write-Host "Connection successful!"
    $connection.Close()
} catch {
    Write-Host "Connection failed: $($_.Exception.Message)"
}
