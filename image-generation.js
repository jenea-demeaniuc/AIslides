document.getElementById('generateImage').addEventListener('click', async () => {
    const prompt = document.getElementById('imagePrompt').value.trim();
    if (!prompt) {
        alert('Please enter a prompt!');
        return;
    }

    const imageResult = document.getElementById('imageResult');
    imageResult.innerHTML = '<p>Generating image...</p>';

    try {
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
        imageResult.innerHTML = `<img src="${imageUrl}" alt="Generated Image" class="generated-image">`;
    } catch (error) {
        imageResult.innerHTML = '<p>Error generating image. Please try again.</p>';
        console.error(error);
    }
});
