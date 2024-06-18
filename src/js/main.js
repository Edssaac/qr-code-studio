const generator = document.getElementById('generator');
const generateButton = document.getElementById('generate-button');
const qrCodeInput = document.getElementById('qr-code-text');
const qrCodeImage = document.getElementById('generated-qr-code');

const generateQRCode = () => {
    const qrCodeValue = qrCodeInput.value.trim();
    if (!qrCodeValue) return;

    generateButton.textContent = 'Gerando QR Code...';

    qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${qrCodeValue}`;
    qrCodeImage.addEventListener('load', () => {
        generator.classList.add('active');
        generateButton.textContent = 'Gerar QR Code';
    });
}

generateButton.addEventListener('click', generateQRCode);

qrCodeInput.addEventListener('keyup', () => {
    if (!qrCodeInput.value) {
        generator.classList.remove('active');
    }
});

const scanner = document.getElementById('scanner');
const form = document.getElementById('qr-code-form');
const textQRCode = document.getElementById('qr-code-content');
const fileInput = document.getElementById('file-input');
const intoText = form.querySelector('p');
const imgQRCode = form.querySelector('img');
const copyButton = document.getElementById('copy-button');
const closeButton = document.getElementById('close-button');

const fetchRequest = (formData, file) => {
    intoText.textContent = 'Lendo QR Code...';

    fetch("http://api.qrserver.com/v1/read-qr-code/", {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            const result = data[0]?.symbol[0]?.data;
            intoText.textContent = result ? 'Selecione um QR Code para leitura' : 'Não foi possível realizar a leitura do QR Code';

            if (result) {
                textQRCode.textContent = result;
                imgQRCode.src = URL.createObjectURL(file);
                scanner.classList.add('active');
            }
        })
        .catch(() => {
            intoText.textContent = 'Não foi possível realizar a leitura do QR Code';
        });
}

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    fetchRequest(formData, file);
});

form.addEventListener('click', () => fileInput.click());

copyButton.addEventListener('click', () => {
    const text = textQRCode.textContent;
    navigator.clipboard.writeText(text);
});

closeButton.addEventListener('click', () => {
    fileInput.value = null;
    scanner.classList.remove('active');
});