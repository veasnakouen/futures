import fetch from 'node-fetch';

async function testBackend() {
    try {
        const response = await fetch('http://localhost:8081/api/auth/test');
        const text = await response.text();
        console.log('Response from backend:', text);
    } catch (error) {
        console.error('Failed to reach backend:', error.message);
    }
}

testBackend();
