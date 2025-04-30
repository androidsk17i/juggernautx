// DOM Elements
const userDescription = document.getElementById('user-description');
const artStyle = document.getElementById('art-style');
const qualityLevel = document.getElementById('quality-level');
const generateBtn = document.getElementById('generate-btn');
const randomBtn = document.getElementById('random-btn');
const generatedPrompt = document.getElementById('generated-prompt');
const negativePrompt = document.getElementById('negative-prompt');
const copyBtn = document.getElementById('copy-btn');
const copyNegativeBtn = document.getElementById('copy-negative-btn');
const autoCopyCheckbox = document.getElementById('auto-copy');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const apiKeyModal = document.getElementById('api-key-modal');
const apiKeyInput = document.getElementById('api-key-input');
const saveApiKeyBtn = document.getElementById('save-api-key');
const resetApiKeyBtn = document.getElementById('reset-api-key');
const apiSettingsBtn = document.getElementById('api-settings-btn');
const showGuideBtn = document.getElementById('show-guide-btn');
const closeGuideBtn = document.getElementById('close-guide-btn');
const parameterGuide = document.getElementById('parameter-guide');

// Constants
const API_KEY_STORAGE_KEY = 'openrouter_api_key';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_ID = 'google/gemini-2.0-flash-exp:free';

// Random prompt ideas
const randomDescriptions = [
    "A magical forest with glowing mushrooms and fairy lights",
    "A futuristic cityscape with flying cars and neon signs",
    "A cozy cabin in the mountains during a snowstorm",
    "A steampunk airship flying through clouds at sunset",
    "An underwater palace with mermaids and exotic sea creatures",
    "A cyberpunk street scene with rain and reflective puddles",
    "A peaceful Japanese zen garden with cherry blossoms",
    "A desert oasis with palm trees and a clear blue lake",
    "A medieval castle on a cliff overlooking the ocean",
    "A space station orbiting a vibrant alien planet",
    "An ancient temple hidden in a lush jungle",
    "A post-apocalyptic wasteland with abandoned skyscrapers",
    "A floating island in the sky with waterfalls cascading down",
    "A bustling fantasy marketplace with magical creatures and vendors",
    "A dragon's treasure hoard in a vast mountain cave"
];

// Random art styles
const randomStyles = [
    "photorealistic", 
    "cinematic", 
    "anime", 
    "digital art", 
    "oil painting",
    "watercolor",
    "sketch"
];

// Check if API key exists in local storage
let apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);

// Event Listeners
document.addEventListener('DOMContentLoaded', initApp);
generateBtn.addEventListener('click', generatePrompt);
randomBtn.addEventListener('click', generateRandomPrompt);
copyBtn.addEventListener('click', () => copyToClipboard(generatedPrompt, copyBtn));
copyNegativeBtn.addEventListener('click', () => copyToClipboard(negativePrompt, copyNegativeBtn));
saveApiKeyBtn.addEventListener('click', saveApiKey);
resetApiKeyBtn.addEventListener('click', resetApiKey);
apiSettingsBtn.addEventListener('click', showApiKeyModal);
showGuideBtn.addEventListener('click', toggleParameterGuide);
closeGuideBtn.addEventListener('click', toggleParameterGuide);

// Initialize the application
function initApp() {
    // Set default quality level
    qualityLevel.value = 'high quality';
    
    // Check if we need to show the API key modal
    if (!apiKey) {
        apiKeyModal.classList.add('active');
    }

    // If API key exists, display it masked in the input field
    if (apiKey) {
        // Show first 4 and last 4 characters, mask the rest
        const maskedKey = apiKey.substring(0, 4) + 
                          '*'.repeat(Math.max(0, apiKey.length - 8)) + 
                          apiKey.substring(apiKey.length - 4);
        apiKeyInput.value = maskedKey;
        apiKeyInput.setAttribute('data-masked', 'true');
    }

    // Clear placeholder when focusing on masked API key
    apiKeyInput.addEventListener('focus', function() {
        if (this.getAttribute('data-masked') === 'true') {
            this.value = '';
            this.removeAttribute('data-masked');
        }
    });
}

// Toggle parameter guide visibility
function toggleParameterGuide() {
    parameterGuide.classList.toggle('hidden');
    
    // Update button text based on visibility
    if (parameterGuide.classList.contains('hidden')) {
        showGuideBtn.innerHTML = '<i class="fas fa-sliders"></i> Show Parameter Guide';
    } else {
        showGuideBtn.innerHTML = '<i class="fas fa-sliders"></i> Hide Parameter Guide';
    }
}

// Save API key to local storage
function saveApiKey() {
    const keyValue = apiKeyInput.value.trim();
    if (keyValue) {
        localStorage.setItem(API_KEY_STORAGE_KEY, keyValue);
        apiKey = keyValue;
        apiKeyModal.classList.remove('active');
        
        // Show success message
        showNotification('API key saved successfully', 'success');
    } else {
        showNotification('Please enter a valid API key', 'error');
    }
}

// Reset API key
function resetApiKey() {
    if (confirm('Are you sure you want to delete your API key?')) {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
        apiKey = null;
        apiKeyInput.value = '';
        apiKeyInput.removeAttribute('data-masked');
        
        // Show notification
        showNotification('API key has been removed', 'success');
    }
}

// Show API key modal
function showApiKeyModal() {
    apiKeyModal.classList.add('active');
}

// Generate random prompt
function generateRandomPrompt() {
    // Select a random description
    const randomIndex = Math.floor(Math.random() * randomDescriptions.length);
    userDescription.value = randomDescriptions[randomIndex];
    
    // Select a random art style (sometimes)
    if (Math.random() > 0.3) { // 70% chance to select a style
        const randomStyleIndex = Math.floor(Math.random() * randomStyles.length);
        artStyle.value = randomStyles[randomStyleIndex];
    } else {
        artStyle.value = ''; // 30% chance to use no specific style
    }
    
    // Generate the prompt with the random values
    generatePrompt();
}

// Generate prompt using the Gemini model via OpenRouter API
async function generatePrompt() {
    // Check if API key is available
    if (!apiKey) {
        apiKeyModal.classList.add('active');
        return;
    }

    // Get input values
    const description = userDescription.value.trim();
    const style = artStyle.value;
    const quality = qualityLevel.value;

    // Validate input
    if (!description) {
        showError('Please enter a description');
        return;
    }

    // Show loading indicator
    loading.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    generatedPrompt.textContent = 'Generating...';
    negativePrompt.textContent = 'Generating...';

    try {
        // Prepare the system message for the AI
        const systemMessage = `You are an expert prompt engineer for the Juggernaut-X-Hyper Stable Diffusion model. 
Your task is to take a user's basic description and transform it into two optimized prompts:
1. A positive prompt that enhances their description with rich details
2. A corresponding negative prompt that helps avoid common issues

For the positive prompt:
- Create a comma-separated list of descriptive terms, not sentences
- Include detailed visual elements, lighting, mood, and atmosphere
- Add technical aspects that improve image quality (e.g., "highly detailed, 8k uhd, professional")
- Use descriptive adjectives and nouns with no conjunctions or periods
- Format should be direct terms separated by commas, not complete sentences
- Maintain the user's original intent while enriching it with specific details

For the negative prompt:
- Use a comma-separated list of terms to avoid (NOT full sentences)
- Include common problematic elements for Stable Diffusion like "bad anatomy, deformed, blurry, bad proportions, extra limbs"
- Focus on issues specific to the image type being generated
- Keep it concise and direct without phrases like "avoid" or "don't include"
- Format it as just the list of terms to exclude

Return your response in this EXACT format (including the headers):
Positive Prompt: [your comma-separated list of descriptive terms]
Negative Prompt: [your comma-separated list of terms to avoid]`;

        // Prepare the user message
        let userMessage = `Transform this basic description into optimized prompts for the Juggernaut-X-Hyper Stable Diffusion model: "${description}"`;
        
        // Add style if selected
        if (style) {
            userMessage += ` I'd like it in ${style} style.`;
        }
        
        // Add quality requirements
        userMessage += ` The image should be ${quality}.`;

        // Make API request to OpenRouter
        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Juggernaut-X-Hyper Prompt Generator'
            },
            body: JSON.stringify({
                model: MODEL_ID,
                messages: [
                    { role: 'system', content: systemMessage },
                    { role: 'user', content: userMessage }
                ]
            })
        });

        const data = await response.json();

        // Handle API response
        if (response.ok) {
            const generatedText = data.choices[0].message.content.trim();
            
            // Parse the response to extract positive and negative prompts
            const promptParts = parsePrompts(generatedText);
            
            // Update the UI
            generatedPrompt.textContent = promptParts.positive;
            negativePrompt.textContent = promptParts.negative;
            
            // Auto-copy if enabled
            if (autoCopyCheckbox.checked) {
                copyToClipboard(generatedPrompt, copyBtn, false);
            }
        } else {
            showError(`API Error: ${data.error?.message || 'Unknown error'}`);
        }
    } catch (error) {
        showError(`Request failed: ${error.message}`);
    } finally {
        // Hide loading indicator
        loading.classList.add('hidden');
    }
}

// Parse the AI-generated text into positive and negative prompts
function parsePrompts(text) {
    // Default values in case parsing fails
    const result = {
        positive: 'Failed to generate positive prompt. Please try again.',
        negative: 'Failed to generate negative prompt. Please try again.'
    };
    
    try {
        // Look for the positive prompt
        const positiveMatch = text.match(/Positive Prompt:\s*(.*?)(?=Negative Prompt:|$)/s);
        if (positiveMatch && positiveMatch[1]) {
            result.positive = positiveMatch[1].trim();
        }
        
        // Look for the negative prompt
        const negativeMatch = text.match(/Negative Prompt:\s*(.*?)$/s);
        if (negativeMatch && negativeMatch[1]) {
            result.negative = negativeMatch[1].trim();
        }
        
        // If we couldn't find either format, try to use the whole text as positive prompt
        if (result.positive.includes('Failed to generate') && 
            result.negative.includes('Failed to generate')) {
            result.positive = text;
        }
    } catch (err) {
        console.error('Error parsing prompts:', err);
    }
    
    return result;
}

// Copy prompt to clipboard
function copyToClipboard(element, button, showFeedback = true) {
    const text = element.textContent;
    const defaultText = ['Your optimized prompt will appear here...', 'Your negative prompt will appear here...', 'Generating...'];
    
    if (text && !defaultText.includes(text)) {
        navigator.clipboard.writeText(text)
            .then(() => {
                if (showFeedback) {
                    // Visual feedback for copy
                    button.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        button.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                }
            })
            .catch(err => {
                showError(`Clipboard error: ${err.message}`);
            });
    }
}

// Display error message
function showError(message) {
    errorMessage.querySelector('p').textContent = message;
    errorMessage.classList.remove('hidden');
}

// Show a temporary notification
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
        
        // Add styles inline since we didn't update the CSS
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        notification.style.zIndex = '1000';
        notification.style.transition = 'all 0.3s ease';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
    }
    
    // Set type-specific styles
    if (type === 'error') {
        notification.style.backgroundColor = '#FEE2E2';
        notification.style.color = '#B91C1C';
        notification.style.border = '1px solid #F87171';
    } else if (type === 'success') {
        notification.style.backgroundColor = '#D1FAE5';
        notification.style.color = '#065F46';
        notification.style.border = '1px solid #6EE7B7';
    } else {
        notification.style.backgroundColor = '#EFF6FF';
        notification.style.color = '#1E40AF';
        notification.style.border = '1px solid #93C5FD';
    }
    
    // Set message and show notification
    notification.textContent = message;
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
    }, 3000);
} 