const fetch = require('node-fetch');

async function test() {
    try {
        const buyRes = await fetch('http://localhost:3000/api/portfolio/buy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cryptoId: 'bitcoin',
                symbol: 'btc',
                amount: 1,
                currentPrice: 60000
            })
        });
        console.log('BUY RESPONSE:', buyRes.status, await buyRes.text());

        const getRes = await fetch('http://localhost:3000/api/portfolio');
        console.log('GET RESPONSE:', getRes.status, await getRes.text());
    } catch (e) {
        console.error(e);
    }
}
test();
