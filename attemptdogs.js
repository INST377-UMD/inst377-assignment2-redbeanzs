document.addEventListener('DOMContentLoaded', async () => {
    await displayDogImages();
    await createDogBreedButtons();

    if (annyang) {
        const commands = {
            'load dog breed *breed': function (breedName) {
                loadBreedByVoice(breedName);
            },
            'navigate to *page': function (page) {
                navigateToPage(page);
            },
            'hello': function () {
                alert('Hello! Welcome to Doggos 🐶!');
            }
        };

        annyang.addCommands(commands);

        document.getElementById('audio-on-btn').addEventListener('click', () => {
            annyang.start();
        });

        document.getElementById('audio-off-btn').addEventListener('click', () => {
            annyang.abort();
        });
    }
});

async function fetchRandomDogImages() {
    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random/10');
        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error('Error fetching random dog images:', error);
        return [];
    }
}

async function displayDogImages() {
    try {
        const dogImages = await fetchRandomDogImages();
        const carousel = document.querySelector('.dog-carousel');
        carousel.innerHTML = '';

        dogImages.forEach(imageUrl => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.classList.add('slider-image'); // Add class for styling
            carousel.appendChild(img);
        });

        simpleslider.getSlider({
            container: document.querySelector('.dog-carousel'),
            delay: 3
        });
    } catch (error) {
        console.error('Error displaying dog images:', error);
    }
}

async function fetchDogBreeds() {
    try {
        const response = await fetch('https://api.thedogapi.com/v1/breeds');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching dog breeds:', error);
        return [];
    }
}

async function createDogBreedButtons() {
    try {
        const breeds = await fetchDogBreeds();
        const buttonsContainer = document.querySelector('.buttons');
        buttonsContainer.innerHTML = '';

        breeds.forEach(breed => {
            const button = document.createElement('button');
            button.textContent = breed.name;
            button.classList.add('button-1'); // Custom styled class
            button.setAttribute('data-id', breed.id); // Store breed ID
            buttonsContainer.appendChild(button);

            button.addEventListener('click', () => {
                displayBreedInfo(breed);
            });
        });
    } catch (error) {
        console.error('Error creating breed buttons:', error);
    }
}

function displayBreedInfo(breed) {
    const dogInfoContainer = document.querySelector('.dog-info');
    dogInfoContainer.innerHTML = `
        <h2>${breed.name}</h2>
        <p><strong>Description:</strong> ${breed.temperament || 'No description available.'}</p>
        <p><strong>Min Life:</strong> ${breed.life_span ? breed.life_span.split(" - ")[0] + ' years' : 'N/A'}</p>
        <p><strong>Max Life:</strong> ${breed.life_span ? breed.life_span.split(" - ")[1] + ' years' : 'N/A'}</p>
        <img src="${breed.image?.url || ''}" alt="${breed.name}" width="200">
    `;
}

function loadBreedByVoice(breedName) {
    const buttons = document.querySelectorAll('.buttons button');
    buttons.forEach(button => {
        if (button.textContent.toLowerCase() === breedName.toLowerCase()) {
            button.click();
        }
    });
}

function navigateToPage(page) {
    const normalizedPage = page.toLowerCase();
    if (normalizedPage.includes('stock')) {
        window.location.href = 'attemptstocks.html';
    } else if (normalizedPage.includes('dog')) {
        window.location.href = 'attemptdogs.html';
    } else if (normalizedPage.includes('home')) {
        window.location.href = 'attempthome.html';
    }
}
