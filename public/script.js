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
            
            // Update stats if available
            if (data.stats) {
                updateStats(data.stats);
            }
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

// Update stats display
function updateStats(stats) {
    const statsRow = document.getElementById('stats-row');
    if (statsRow) {
        statsRow.innerHTML = `
            <div class="stat-item">
                <div class="stat-value">${stats.notes || 0}</div>
                <div class="stat-label">Notes</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.tasks || 0}</div>
                <div class="stat-label">Tasks</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.files || 0}</div>
                <div class="stat-label">Files</div>
            </div>
        `;
    }
}

// Check status on load and periodically
document.addEventListener('DOMContentLoaded', () => {
    checkStatus();
    setInterval(checkStatus, 30000); // Check every 30 seconds
});