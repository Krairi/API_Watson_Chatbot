const API_KEY = 'votre_api_key_watson';
const ASSISTANT_ID = 'votre_id_assistant';
const ASSISTANT_URL = 'votre_url_watson';

function sendMessage() {
    const userMessage = document.getElementById('user-input').value;
    appendMessage('Vous', userMessage);

    fetchWatsonResponse(userMessage)
        .then((response) => {
            appendMessage('Chatbot', response);
        })
        .catch((error) => {
            console.error('Erreur lors de l\'appel à Watson Assistant:', error);
        });

    document.getElementById('user-input').value = '';
}

function fetchWatsonResponse(userMessage) {
    const data = {
        input: {
            text: userMessage
        }
    };

    return fetch(`${ASSISTANT_URL}/v2/assistants/${ASSISTANT_ID}/sessions?version=2021-06-14`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({})
    })
    .then((response) => response.json())
    .then((data) => {
        const sessionId = data.session_id;
        return fetch(`${ASSISTANT_URL}/v2/assistants/${ASSISTANT_ID}/sessions/${sessionId}/message?version=2021-06-14`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((data) => data.output.generic[0].text);
    });
}

function appendMessage(sender, message) {
    const chatOutput = document.getElementById('chat-output');
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `<strong>${sender}: </strong>${message}`;
    chatOutput.appendChild(messageDiv);
    chatOutput.scrollTop = chatOutput.scrollHeight;
}
