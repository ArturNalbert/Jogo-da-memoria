const cardGrid = document.getElementById('card-grid');
const message = document.getElementById('message');
const attemptsDisplay = document.getElementById('attempts');
const restartButton = document.getElementById('restart-button');
const history = document.getElementById('history');

const images = ['images/ssa1.png', 'images/ssa2.png', 'images/ssa3.png']; // Substitua pelos caminhos das suas imagens
let cards = [];
let flippedCards = [];
let attempts = 0;
let matchedPairs = 0;

// Inicializa o jogo
function initGame() {
    cards = [...images, ...images].sort(() => 0.5 - Math.random()); // Embaralha as imagens
    cardGrid.innerHTML = '';
    message.textContent = '';
    matchedPairs = 0;
    attempts = 0;
    attemptsDisplay.textContent = `Tentativas: ${attempts}`;

    cards.forEach((img, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.dataset.image = img;

        const imgElement = document.createElement('img');
        imgElement.src = img;
        card.appendChild(imgElement);

        card.addEventListener('click', flipCard);
        cardGrid.appendChild(card);
    });
}

// Função para virar uma carta
function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            attempts++;
            attemptsDisplay.textContent = `Tentativas: ${attempts}`;
            setTimeout(checkMatch, Math.random() * (1000 - 600) + 600); // Tempo aleatório entre 600 e 1000 ms
        }
    }
}


// Verifica se as duas cartas viradas são iguais
function checkMatch() {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.dataset.image === secondCard.dataset.image) {
        matchedPairs++;
        flippedCards = [];
        if (matchedPairs === images.length) {
            message.textContent = 'PARABÉNS! Você encontrou todos os pares!';
            saveToHistory();
        }
    } else {
        flippedCards.forEach(card => card.classList.remove('flipped'));
        flippedCards = [];
    }
}

// Salva as tentativas no histórico do localStorage
function saveToHistory() {
    const gameHistory = JSON.parse(localStorage.getItem('memoryGameHistory')) || [];
    gameHistory.push(attempts);
    localStorage.setItem('memoryGameHistory', JSON.stringify(gameHistory));
    updateHistory();
}

// Atualiza o histórico de tentativas na interface
function updateHistory() {
    const gameHistory = JSON.parse(localStorage.getItem('memoryGameHistory')) || [];
    history.innerHTML = '';
    gameHistory.forEach((attempt, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Rodada ${index + 1}: ${attempt} tentativas`;
        history.appendChild(listItem);
    });
}

// Reinicia o jogo e embaralha as cartas
restartButton.addEventListener('click', () => {
    initGame();
    flippedCards = [];
    updateHistory();
});

window.onload = () => {
    initGame();
    updateHistory();
};
