let usageCount = 0;

document.addEventListener("DOMContentLoaded", () => {
    // Carregar o contador de utilização do armazenamento local
    if (localStorage.getItem('usageCount')) {
        usageCount = parseInt(localStorage.getItem('usageCount'), 10);
    } else {
        usageCount = 0;
    }
    document.getElementById('usageCount').textContent = usageCount;
});

function processKey() {
    const inputKey = document.getElementById('inputKey').value;
    const processedKey = inputKey.replace(/[\s\.,\-\_]/g, ''); // Atualizado para remover vírgulas também
    document.getElementById('outputKey').value = processedKey;
    updateUsageCount();
}

function clearAll() {
    document.getElementById('inputKey').value = '';
    document.getElementById('outputKey').value = '';
}

function copyToClipboard() {
    const outputKey = document.getElementById('outputKey');
    navigator.clipboard.writeText(outputKey.value)
        .then(() => {
            const popup = document.getElementById('copyPopup');
            popup.classList.remove('show');  // Reseta o estado do popup
            void popup.offsetWidth;  // Força o reflow (recalcular a posição) do popup para reiniciar a animação
            popup.classList.add('show');  // Reaplica a classe show para mostrar o popup

            setTimeout(() => {
                popup.classList.remove('show');
            }, 3000);
        })
        .catch(err => {
            console.error('Erro ao copiar texto: ', err);
        });
}

function updateUsageCount() {
    usageCount++;
    document.getElementById('usageCount').textContent = usageCount;
    localStorage.setItem('usageCount', usageCount);  // Armazena o contador localmente
}





