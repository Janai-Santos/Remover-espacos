window.onload = function() {
    // Limpar os campos de texto ao carregar a página
    document.getElementById('inputText1').value = '';
    document.getElementById('outputText1').value = '';
    document.getElementById('outputText2').value = '';
    document.getElementById('inputImage').value = ''; // Limpar o input de imagem
};

document.getElementById('inputText1').addEventListener('input', function() {
    const inputText = document.getElementById('inputText1').value;
    const cleanedText = inputText.replace(/[ ._\/-]/g, '');
    document.getElementById('outputText1').value = cleanedText;
});

function copyText(elementId) {
    const textArea = document.getElementById(elementId);
    textArea.select();
    document.execCommand('copy');
    window.getSelection().removeAllRanges();

    const popup = document.getElementById('copy-popup');
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 2000);
}

async function pasteImage() {
    try {
        const items = await navigator.clipboard.read();
        for (const item of items) {
            if (item.types.includes('image/png') || item.types.includes('image/jpeg') || item.types.includes('image/gif')) {
                const blob = await item.getType(item.types[0]);
                const reader = new FileReader();
                reader.onload = function(e) {
                    startCountdown(3, () => processImageText(e.target.result));
                };
                reader.readAsDataURL(blob);
                return;
            }
        }
    } catch (err) {
        console.error('Falha ao ler o conteúdo da área de transferência: ', err);
    }
}

document.getElementById('inputImage').addEventListener('change', function() {
    const file = document.getElementById('inputImage').files[0];
    if (file) {
        startCountdown(3, () => readImage(file));
    }
});

async function readImage(file) {
    try {
        const {
            data: {
                text
            }
        } = await Tesseract.recognize(file, 'eng', {
            logger: (m) => console.log(m)
        });
        document.getElementById('outputText2').value = text;
    } catch (error) {
        console.error("Erro ao reconhecer texto:", error);
        document.getElementById('outputText2').value = "Erro ao reconhecer texto.";
    }
}

function processImageText(dataUrl) {
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        Tesseract.recognize(canvas, 'eng', {
                logger: m => console.log(m)
            })
            .then(({
                data: {
                    text
                }
            }) => {
                document.getElementById('outputText2').value = text;
            }).catch(error => {
                console.error("Erro ao reconhecer texto:", error);
                document.getElementById('outputText2').value = "Erro ao reconhecer texto.";
            });
    };
    img.src = dataUrl;
}

function startCountdown(seconds, callback) {
    const outputText2 = document.getElementById('outputText2');
    outputText2.value = seconds;
    let currentCount = seconds;
    const interval = setInterval(() => {
        currentCount--;
        outputText2.value = currentCount;
        if (currentCount <= 0) {
            clearInterval(interval);
            if (callback) {
                callback();
            }
        }
    }, 1000);
}

function clearText(inputFieldId, outputFieldId) {
    document.getElementById(inputFieldId).value = '';
    if (outputFieldId === 'outputText2') {
        document.getElementById(outputFieldId).value = '';
        document.getElementById('inputImage').value = ''; // Limpa o input de imagem
    } else {
        document.getElementById(outputFieldId).value = '';
    }
}
