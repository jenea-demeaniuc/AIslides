document.getElementById('createPresentation').addEventListener('click', async () => {
    const title = document.getElementById('presentationTitle').value.trim();
    const content = document.getElementById('presentationContent').value.trim();
    const numSlides = parseInt(document.getElementById('numSlides').value, 10);

    if (!title || !content || isNaN(numSlides) || numSlides < 1) {
        alert('Please fill in the title, content, and a valid number of slides (at least 1)!');
        return;
    }

    const presentationResult = document.getElementById('presentationResult');
    presentationResult.innerHTML = '<p>Generating presentation...</p>';

    try {
        const generatedSlides = [];
        const imageUrls = [];
        const slidePrompts = [];

        for (let i = 0; i < numSlides; i++) {
            let slidePrompt = "";
            if (numSlides === 1){
                slidePrompt = `${title}: ${content}`;
            }
            else{
                slidePrompt = `${title}: ${content}. Focus on a specific aspect for slide ${i + 1} of ${numSlides}.`;
            }
            slidePrompts.push(slidePrompt);

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer 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`,
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: slidePrompt }],
                }),
            });

            const data = await response.json();
            if (data.choices && data.choices.length > 0) {
              generatedSlides.push(data.choices[0].message.content);

              // Improved Image Prompting: Include slide number and content keywords
              const imagePrompt = `${title} slide ${i + 1}: ${slidePrompt}`;
              imageUrls.push(`https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}`);
            } else {
              console.error("OpenAI API returned unexpected data:", data);
              generatedSlides.push("Error generating this slide.");
              imageUrls.push(""); 
            }
        }

        console.log("Prompts used:", slidePrompts);

        let presentationHTML = `<h2>${title}</h2>`;
        for (let i = 0; i < generatedSlides.length; i++) {
            presentationHTML += `
                <div class="slide">
                    <h3>Slide ${i + 1}</h3>
                    <p>${generatedSlides[i]}</p>
                    ${imageUrls[i] ? `<img src="${imageUrls[i]}" alt="Slide Image">` : ""}
                </div>
            `;
        }
        presentationResult.innerHTML = presentationHTML;

    } catch (error) {
        presentationResult.innerHTML = '<p>Error generating presentation. Please try again.</p>';
        console.error(error);
    }
});