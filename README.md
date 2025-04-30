# Juggernaut-X-Hyper Prompt Generator

A responsive web application that helps users generate optimized text prompts for the Juggernaut-X-Hyper Stable Diffusion model.

## Features

- Clean, intuitive user interface
- Transforms basic descriptions into detailed prompts
- Generates both positive and negative prompts
- Randomized prompt generation feature
- Auto-copy functionality for generated prompts
- Customizable art style and quality preferences
- Parameter guide with recommended Stable Diffusion settings
- Mobile-responsive design
- Secure API key management with reset option
- Copy-to-clipboard functionality

## Requirements

- OpenRouter API key (sign up at [openrouter.ai](https://openrouter.ai))
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection

## Setup Instructions

### Quick Start

1. Clone or download this repository to your local machine
2. Open the `index.html` file in a web browser
3. When prompted, enter your OpenRouter API key
4. Start generating prompts!

### Running Locally with a Web Server

For better performance and to avoid potential CORS issues, you can use a local web server:

#### Using Python:

```bash
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

Then navigate to `http://localhost:8000` in your browser.

#### Using Node.js:

Install a simple HTTP server like `http-server`:

```bash
npm install -g http-server
http-server
```

Then navigate to `http://localhost:8080` in your browser.

## API Key Security

The application stores your OpenRouter API key in your browser's local storage. The key is:

- Never sent to any server other than OpenRouter's API
- Only transmitted over HTTPS
- Stored only on your device
- Can be reset at any time via the API Settings button
- Masked when displayed in the settings dialog

## How to Use

1. Enter a basic description of the image you want to generate
2. (Optional) Select an art style from the dropdown menu
3. Choose your desired quality level
4. Click "Generate Prompt" to create optimized prompts
5. Or click "Random" to generate a prompt from random themes
6. Copy the generated prompts to use with the Juggernaut-X-Hyper model
7. Enable auto-copy to automatically copy prompts when generated
8. Click "Show Parameter Guide" for optimal Stable Diffusion settings

## Stable Diffusion Parameters

The application includes a parameter guide with recommended settings for the Juggernaut-X-Hyper model:

- **Sampling Steps**: 20-30 steps (higher for more detailed images)
- **CFG Scale**: 7-9 (controls prompt adherence)
- **Sampling Method**: DPM++ 2M Karras (best overall quality)
- **Resolution**: 1024×1024 (optimal for most images)
- **Seed**: -1 for random exploration
- **Denoising Strength**: 0.6-0.8 (for img2img generation)

These recommendations are accessible via the "Show Parameter Guide" button in the application.

## Advanced Tips

- Be as specific as possible in your initial description
- Adding details about lighting, atmosphere, and mood can improve results
- For complex scenes, try breaking down your description into clear elements
- Experiment with different art styles to find what works best for your vision
- Use the negative prompts to improve image quality by avoiding common issues
- Try the random button for inspiration when you're not sure what to create
- Adjust the sampling steps based on image complexity (more steps for more details)
- Save seeds of images you like to recreate similar styles with different prompts

## Troubleshooting

- If you receive API errors, verify that your OpenRouter API key is correct
- Check your internet connection if requests fail
- Clear your browser cache and reload if the interface appears broken
- For persistent issues, try using a different web browser
- If you need to reset your API key, click the "API Settings" button and use the reset option

## License

MIT License 