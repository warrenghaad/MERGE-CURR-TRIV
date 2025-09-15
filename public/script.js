// Check server status
async function checkStatus() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');
        const timestamp = document.getElementById('timestamp');
        
        if (response.ok) {
            statusIndicator.className = 'status-online';
            statusText.textContent = data.message;
            timestamp.textContent = `Last updated: ${new Date(data.timestamp).toLocaleString()}`;
        } else {
            throw new Error('Server responded with error');
        }
    } catch (error) {
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');
        
        statusIndicator.className = 'status-offline';
        statusText.textContent = 'Connection failed';
        console.error('Status check failed:', error);
    }
}

// Check status on load and periodically
document.addEventListener('DOMContentLoaded', () => {
    checkStatus();
    setInterval(checkStatus, 30000); // Check every 30 seconds
});