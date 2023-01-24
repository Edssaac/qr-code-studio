const wrapper = document.querySelector('.wrapper');
const form = wrapper.querySelector('form');
const textQRCode = wrapper.querySelector('textarea');
const fileInput = form.querySelector('input');
const intoText = form.querySelector('p');
const imgQRCode = form.querySelector('img');
const copyButton = wrapper.querySelector('.copy');
const closeButton = wrapper.querySelector('.close');

function fetchRequest(formData, file) {
    intoText.innerText = 'Lendo QR Code...';

    fetch("http://api.qrserver.com/v1/read-qr-code/", {
        method: 'POST',
        body: formData
    }).then(res => res.json())
        .then(result => {
            result = result[0].symbol[0].data;

            intoText.innerText = result ? 'Selecione um QR Code para leitura' : 'Não foi possível realizer a leitura do QR Code';

            if (!result) {
                return;
            }

            textQRCode.innerText = result;
            imgQRCode.src = URL.createObjectURL(file);
            wrapper.classList.add('active');
        }).catch(() => {
            intoText.innerText = 'Não foi possível realizer a leitura do QR Code';
        });
}

fileInput.addEventListener('change', e => {
    let file = e.target.files[0];
    let formData = new FormData();

    if (!file) {
        return;
    }

    formData.append('file', file);

    fetchRequest(formData, file);
});

form.addEventListener('click', () => {
    fileInput.click();
});

copyButton.addEventListener('click', () => {
    let text = textQRCode.textContent;
    navigator.clipboard.writeText(text);
});

closeButton.addEventListener('click', () => {
    fileInput.value = null
    wrapper.classList.remove('active');
});