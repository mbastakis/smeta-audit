// Display current timestamp
document.getElementById('timestamp').textContent = new Date().toLocaleString();

// Simple chart simulation using canvas
const canvas = document.getElementById('myChart');
const ctx = canvas.getContext('2d');

function drawChart() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size
    canvas.width = 600;
    canvas.height = 300;
    
    // Draw bars
    const data = [75, 82, 68, 92, 87];
    const labels = ['Q1', 'Q2', 'Q3', 'Q4', 'Target'];
    const barWidth = 80;
    const gap = 40;
    const maxHeight = 250;
    
    data.forEach((value, index) => {
        const x = gap + (index * (barWidth + gap));
        const barHeight = (value / 100) * maxHeight;
        const y = canvas.height - barHeight - 20;
        
        // Draw bar
        ctx.fillStyle = index === data.length - 1 ? '#764ba2' : '#667eea';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw value on top
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value + '%', x + barWidth/2, y - 5);
        
        // Draw label
        ctx.fillText(labels[index], x + barWidth/2, canvas.height - 5);
    });
}

function updateChart() {
    alert('Chart data refreshed! (This demonstrates JavaScript functionality)');
    drawChart();
}

// Initial chart draw
drawChart();

console.log('KPI Dashboard Report loaded successfully!');
