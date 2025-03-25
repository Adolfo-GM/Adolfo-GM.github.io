document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submitBtn');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');

    function addMessage(text, isUser = false) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container');

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user' : 'ai');
        
        if (isUser) {
            messageDiv.textContent = text;
        } else {
            messageDiv.innerHTML = text; 
        }

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
                    }, 1000);
                });
            });
            messageContainer.appendChild(copyBtn);
        }

        chatMessages.appendChild(messageContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    submitBtn.addEventListener('click', async () => {
        let inputText = userInput.value.trim();
        if (!inputText) return;

        addMessage(inputText, true);
        userInput.value = ''; 
        try {
            const systemprompt = "You are AggmGPT, an intelligent AI assistant, you respond concisely and informatively. DO NOT USE MARKDOWN. USE HTML ONLY.";
            inputText = systemprompt + inputText;
            const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(inputText)}`);
            if (!response.ok) throw new Error('API request failed');
            const aiText = await response.text();
            addMessage(aiText);
        } catch (error) {
            addMessage(`<span style="color: red;">Error: ${error.message}</span>`);
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitBtn.click();
        }
    });
});
