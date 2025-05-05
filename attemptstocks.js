document.addEventListener('DOMContentLoaded', async () => {
    const redditApiUrl = 'https://tradestie.com/api/v1/apps/reddit';
    const lookupBtn = document.getElementById('lookupBtn');
    const topTableBody = document.getElementById('topStocksBody');
    let cachedRedditStocks = [];

    try {
        cachedRedditStocks = await fetchRedditStocks();
        renderTopStocks(cachedRedditStocks);
    } catch (error) {
        console.error('Could not load Reddit stocks:', error);
    }

    lookupBtn?.addEventListener('click', async () => {
        const tickerInput = document.getElementById('ticker').value.toUpperCase();
        const rangeDays = parseInt(document.getElementById('range').value);
        const to = Math.floor(Date.now() / 1000);
        const from = to - rangeDays * 86400;

        const stockData = await fetchStockData(tickerInput, from, to);
        if (stockData.length) {
            renderChart(stockData);
        } else {
            alert('No stock data found. Please check your ticker symbol.');
        }
        renderTopStocks(cachedRedditStocks);
    });

    async function fetchStockData(ticker, from, to) {
        const apiKey = 'hnWtQGlueg5Tjy_fX0gNh9ZLE17efR9D';
        const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.results?.map(entry => ({
                date: new Date(entry.t),
                close: entry.c
            })) || [];
        } catch (err) {
            console.error('Error fetching stock data:', err);
            return [];
        }
    }

    async function fetchRedditStocks() {
        const response = await fetch(redditApiUrl);
        const data = await response.json();
        return data
            .sort((a, b) => b.no_of_comments - a.no_of_comments)
            .slice(0, 5);
    }

    function renderChart(stockData) {
        const ctx = document.getElementById('stockChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: stockData.map(d => d.date.toLocaleDateString()),
                datasets: [{
                    label: 'Closing Price',
                    data: stockData.map(d => d.close),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: 'Date' } },
                    y: { title: { display: true, text: 'Price (USD)' } }
                }
            }
        });
    }

    function renderTopStocks(redditStocks) {
        if (!topTableBody) return;
        topTableBody.innerHTML = '';

        redditStocks.forEach(stock => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
                <td>${stock.no_of_comments}</td>
                <td>${stock.sentiment}</td>
            `;
            topTableBody.appendChild(row);
        });
    }

    if (annyang) {
        const commands = {
            'lookup stock *ticker': function (ticker) {
                const tickerInput = document.getElementById('ticker');
                tickerInput.value = ticker.toUpperCase();
                lookupBtn.click();
            },

            'show top reddit stocks': function () {
                renderTopStocks(cachedRedditStocks);
            }
        };

        annyang.addCommands(commands);
        annyang.start();
    }
});
