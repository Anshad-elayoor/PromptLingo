// PromptLingo - Game Logic and AI Simulation
// Main game variables
let currentLevel = 1;
let playerXP = 0;
let playerStreak = 0;
let currentAttempts = 0;
let maxAttempts = 5;

// Level configuration object
const levels = {
    1: {
        title: "Level 1: Basic Prompting",
        objective: 'Get the AI to say the word "banana" in its response',
        targetWord: "banana",
        hints: "Try asking about fruits, or what I like to eat!",
        successResponses: [
            "I love bananas! They're my favorite fruit.",
            "Hmm, I'd say banana is definitely a great choice!",
            "Oh, banana! That's such a delicious and healthy fruit.",
            "A banana sounds perfect right now!",
            "Banana is such a versatile fruit - great for smoothies!"
        ],
        failureResponses: [
            "I enjoy many different things! Could you be more specific?",
            "That's an interesting question! I like lots of different foods.",
            "Hmm, there are so many options to choose from!",
            "I appreciate your question, but could you guide me toward something more specific?",
            "I enjoy discussing various topics. What specifically are you curious about?",
            "That's a broad question! Could you help me narrow it down?",
            "I like many things! Perhaps you could ask about a particular category?"
        ]
    },
    2: {
        title: "Level 2: Specific Instructions",
        objective: 'Get the AI to say "I love coding" in its response',
        targetWord: "I love coding",
        hints: "Try asking about my hobbies, passions, or what I enjoy doing!",
        successResponses: [
            "I love coding! It's my greatest passion.",
            "Absolutely! I love coding more than anything else.",
            "You know what? I love coding with all my heart!",
            "My answer is simple: I love coding!",
            "Without a doubt, I love coding - it's what drives me!"
        ],
        failureResponses: [
            "I enjoy working with technology and helping people solve problems.",
            "Programming is quite fascinating! There's so much to explore.",
            "I find computer science to be a wonderful field.",
            "Working with algorithms and data structures is really engaging.",
            "I appreciate the logic and creativity involved in software development.",
            "Technology and problem-solving are definitely interesting to me.",
            "I enjoy helping people with their technical challenges."
        ]
    }
};

// Game State Management Functions
function loadGameState() {
    const saved = localStorage.getItem('promptlingo-save');
    if (saved) {
        const data = JSON.parse(saved);
        currentLevel = data.level || 1;
        playerXP = data.xp || 0;
        playerStreak = data.streak || 0;
    }
    updateStats();
}

function saveGameState() {
    const data = {
        level: currentLevel,
        xp: playerXP,
        streak: playerStreak
    };
    localStorage.setItem('promptlingo-save', JSON.stringify(data));
}

function updateStats() {
    document.getElementById('xp-display').textContent = `${playerXP} XP`;
    document.getElementById('streak-display').textContent = `${playerStreak} Day Streak`;
    document.getElementById('level-display').textContent = `Level ${currentLevel}`;
}

// Game Flow Functions
function startGame() {
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    loadLevel();
}

function loadLevel() {
    if (!levels[currentLevel]) {
        showGameComplete();
        return;
    }

    const level = levels[currentLevel];
    document.getElementById('level-title').textContent = level.title;
    document.getElementById('level-objective').textContent = level.objective;
    document.getElementById('hints-content').textContent = level.hints;
    
    currentAttempts = 0;
    updateProgress();
    
    // Reset chat area with welcome message
    const chatArea = document.getElementById('chat-area');
    chatArea.innerHTML = `
        <div class="message">
            <div class="message-avatar ai-avatar">🤖</div>
            <div class="message-content">Hi! I'm ready for Level ${currentLevel}. Try to get me to say something specific through your prompts!</div>
        </div>
    `;
}

function updateProgress() {
    const progress = Math.min((currentAttempts / maxAttempts) * 100, 100);
    document.getElementById('progress-fill').style.width = `${progress}%`;
}

// Chat and Message Functions
function sendPrompt() {
    const input = document.getElementById('prompt-input');
    const prompt = input.value.trim();
    
    if (!prompt) return;
    
    // Add user message to chat
    addMessage(prompt, 'user');
    
    // Clear input and disable temporarily
    input.value = '';
    input.disabled = true;
    document.getElementById('send-button').disabled = true;
    
    // Simulate AI thinking time
    setTimeout(() => {
        generateResponse(prompt);
        input.disabled = false;
        document.getElementById('send-button').disabled = false;
        input.focus();
    }, 1000);
}

function addMessage(content, sender) {
    const chatArea = document.getElementById('chat-area');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const avatar = sender === 'user' ? 
        '<div class="message-avatar user-avatar">👤</div>' :
        '<div class="message-avatar ai-avatar">🤖</div>';
    
    messageDiv.innerHTML = `
        ${avatar}
        <div class="message-content">${content}</div>
    `;
    
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}

// AI Response Generation Logic
function generateResponse(prompt) {
    const level = levels[currentLevel];
    const promptLower = prompt.toLowerCase();
    currentAttempts++;
    updateProgress();
    
    let response = "";
    let isSuccess = false;
    
    // Level-specific success conditions
    if (currentLevel === 1) {
        if (promptLower.includes('fruit') || promptLower.includes('yellow') || 
            promptLower.includes('favorite') || promptLower.includes('eat') ||
            promptLower.includes('like') || promptLower.includes('food')) {
            response = level.successResponses[Math.floor(Math.random() * level.successResponses.length)];
            isSuccess = true;
        }
    } else if (currentLevel === 2) {
        if (promptLower.includes('passion') || promptLower.includes('love') || 
            promptLower.includes('hobby') || promptLower.includes('enjoy') ||
            promptLower.includes('favorite') || promptLower.includes('what do you')) {
            response = level.successResponses[Math.floor(Math.random() * level.successResponses.length)];
            isSuccess = true;
        }
    }
    
    // If not successful, choose a failure response
    if (!isSuccess) {
        response = level.failureResponses[Math.floor(Math.random() * level.failureResponses.length)];
    }
    
    addMessage(response, 'ai');
    
    // Handle success or failure
    if (isSuccess) {
        setTimeout(() => levelComplete(), 1500);
    } else if (currentAttempts >= maxAttempts) {
        setTimeout(() => showEncouragement(), 1500);
    }
}

// Level Completion and Progression
function levelComplete() {
    playerXP += 100;
    playerStreak += 1;
    saveGameState();
    updateStats();
    
    document.getElementById('success-message').textContent = 
        `Level ${currentLevel} Complete! +100 XP`;
    document.getElementById('success-animation').style.display = 'flex';
}

function nextLevel() {
    document.getElementById('success-animation').style.display = 'none';
    currentLevel++;
    
    if (levels[currentLevel]) {
        loadLevel();
    } else {
        showGameComplete();
    }
}

function showGameComplete() {
    const chatArea = document.getElementById('chat-area');
    chatArea.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div style="font-size: 3rem; margin-bottom: 20px;">🏆</div>
            <h2 style="color: #58CC02; margin-bottom: 15px;">Congratulations!</h2>
            <p style="color: #666; font-size: 1.1rem; line-height: 1.6;">
                You've mastered the basics of prompt engineering! 
                You now understand how specific, well-crafted prompts 
                lead to better AI responses.
            </p>
            <button class="start-button" onclick="resetGame()" style="margin-top: 20px;">
                Play Again
            </button>
        </div>
    `;
}

function resetGame() {
    currentLevel = 1;
    loadLevel();
}

// Helper Functions
function showEncouragement() {
    const encouragements = [
        "Don't give up! Try being more specific in your prompt.",
        "You're getting closer! Think about what keywords might help.",
        "Keep trying! Sometimes the answer is simpler than you think.",
        "Good effort! Try approaching it from a different angle."
    ];
    
    const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    addMessage(encouragement, 'ai');
    currentAttempts = 0;
    updateProgress();
}

function toggleHints() {
    const hintsContent = document.getElementById('hints-content');
    hintsContent.classList.toggle('show');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load game state when page loads
    loadGameState();
    
    // Add enter key support for prompt input
    const promptInput = document.getElementById('prompt-input');
    if (promptInput) {
        promptInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendPrompt();
            }
        });
    }
});

// Load game state when window loads (backup)
window.addEventListener('load', function() {
    loadGameState();
});