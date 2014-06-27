window.addEventListener('DOMContentLoaded', function () {
    var inputs = document.getElementsByTagName('input');
    for (var i = inputs.length - 1; i >= 0; i--) {
        inputs[i].addEventListener('input', updateLabel);
    }
});

function updateLabel () {
    this.previousElementSibling.classList[(this.value === "" ? 'remove' : 'add')]('shown');
}