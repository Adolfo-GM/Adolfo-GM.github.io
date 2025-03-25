document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submitBtn');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');

    // Add message to chat with optional copy button for AI messages
    function addMessage(text, isUser = false) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container');

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user' : 'ai');
        messageDiv.textContent = text;
        messageContainer.appendChild(messageDiv);

        if (!isUser) {
            const copyBtn = document.createElement('button');
            copyBtn.classList.add('copy-btn');
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(text).then(() => {
                    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                    copyBtn.classList.add('copied');
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                        copyBtn.classList.remove('copied');
                    }, 1000); // Revert after 1 second
                });
            });
            messageContainer.appendChild(copyBtn);
        }

        chatMessages.appendChild(messageContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to bottom
    }

    // Handle form submission
    submitBtn.addEventListener('click', async () => {
        const inputText = userInput.value.trim();
        if (!inputText) return;

        // Add user message
        addMessage(inputText, true);
        userInput.value = ''; // Clear input

        // Fetch AI response
        try {
            const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(inputText)}`);
            if (!response.ok) throw new Error('API request failed');
            const aiText = await response.text();
            addMessage(aiText);
        } catch (error) {
            addMessage(`Error: ${error.message}`);
        }
    });

    // Allow Enter key to submit
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitBtn.click();
        }
    });

    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.error('Service Worker registration failed', err));
    }
});