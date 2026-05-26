const http = require('http');

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`✅ PASS: ${message}`);
        passed++;
    } else {
        console.log(`❌ FAIL: ${message}`);
        failed++;
    }
}

function httpGet(path) {
    return new Promise((resolve, reject) => {
        http.get(`http://localhost:3000${path}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
        }).on('error', reject);
    });
}

async function runTests() {
    console.log('\n=== Running Tests ===\n');

    const root = await httpGet('/');
    assert(root.status === 200, 'GET / returns 200');
    assert(root.body.status === 'ok', 'GET / returns status ok');

    const health = await httpGet('/health');
    assert(health.status === 200, 'GET /health returns 200');
    assert(health.body.status === 'healthy', 'GET /health returns healthy');

    console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
    if (failed > 0) process.exit(1);
}

runTests().catch(err => {
    console.error('Test error:', err.message);
    process.exit(1);
});
