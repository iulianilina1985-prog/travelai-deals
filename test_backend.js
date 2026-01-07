const https = require('https');

const data = JSON.stringify({
    prompt: "zbor din Bucuresti spre Londra pe 20 martie 2026"
});

const options = {
    hostname: 'zgswdnwqvpeherfmjika.supabase.co',
    path: '/functions/v1/ai-chat',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpnc3dkbndxdnBlaGVyZm1qaWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDA2NzIsImV4cCI6MjA3OTIxNjY3Mn0.BF3g52jIAepcC3DGnufPYs136XnYlYvT9UEcpzWcXRE',
        'Content-Length': data.length
    }
};

const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
    let body = '';

    res.on('data', d => {
        body += d;
    });

    res.on('end', () => {
        console.log('Response Body:');
        console.log(body);
    });
});

req.on('error', error => {
    console.error(error);
});

req.write(data);
req.end();
