// test_offers.js

async function test() {
    const res = await fetch('https://zgswdnwqvpeherfmjika.supabase.co/functions/v1/offers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpnc3dkbndxdnBlaGVyZm1qaWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDA2NzIsImV4cCI6MjA3OTIxNjY3Mn0.BF3g52jIAepcC3DGnufPYs136XnYlYvT9UEcpzWcXRE'
        },
        body: JSON.stringify({
            intent: {
                type: 'flight',
                from_city: 'Bucuresti',
                to_city: 'Londra'
            }
        })
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}

test();
