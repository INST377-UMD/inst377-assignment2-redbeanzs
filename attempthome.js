async function fetchQuote() {
    try {
        const response = await fetch('https://zenquotes.io/api/random');
        const data = await response.json();
        return data[0].q; 
    } catch (error) {
        console.error('Error fetching quote:', error);
        return 'An error occurred while fetching the quote.'; 
    }
}

async function handlePageLoad() {
    const quoteText = document.getElementById('quote-text');
    quoteText.textContent = await fetchQuote();
}

window.addEventListener('load', handlePageLoad);

document.getElementById('stocks-btn').addEventListener('click', function() {
    window.location.href = 'attemptstocks.html';
});

document.getElementById('dogs-btn').addEventListener('click', function() {
    window.location.href = 'attemptdogs.html';
});

if (annyang) {
    const commands = {
        'hello': () => {
            alert('Hello World');
        },
        'change the color to *color': (color) => {
            document.body.style.backgroundColor = color;
        },
        'navigate to *page': (page) => {
            const normalized = page.toLowerCase();
            if (normalized.includes('stock')) {
                window.location.href = 'attemptstocks.html';
            } else if (normalized.includes('dog')) {
                window.location.href = 'attemptdogs.html';
            } else if (normalized.includes('home')) {
                window.location.href = 'attempthome.html';
            }
        }
    };

    annyang.addCommands(commands);
    annyang.start();

    document.getElementById('audio-on-btn').addEventListener('click', () => {
        annyang.start();
    });

    document.getElementById('audio-off-btn').addEventListener('click', () => {
        annyang.abort();
    });
}
