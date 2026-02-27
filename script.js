let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetScreen = false;

const currentDisplay = document.getElementById('current');
const historyDisplay = document.getElementById('history');

function toggleMode() {
    document.getElementById('calc').classList.toggle('wide');
    document.getElementById('sci-keys').classList.toggle('hidden');
}

function updateDisplay() {
    currentDisplay.innerText = currentInput;
}

function appendNumber(num) {
    // Se a tela deve resetar ou está no zero inicial, substituímos o valor
    if (currentInput === '0' || shouldResetScreen) {
        currentInput = num;
        shouldResetScreen = false;
    } else {
        if (num === '.' && currentInput.includes('.')) return;
        currentInput += num;
    }
    updateDisplay();
}

function appendOperator(op) {
    // TRUQUE PARA O NEGATIVO: Se clicar em '-' com visor '0', vira número negativo
    if (currentInput === '0' && op === '-') {
        currentInput = '-';
        updateDisplay();
        return;
    }

    // Bloqueia outros operadores se não houver número
    if (currentInput === '-' || currentInput === '0') {
        if (op !== '-') return;
    }

    // Lógica de Porcentagem inteligente (estilo celular)
    if (op === '%') {
        let val = parseFloat(currentInput);
        if (operator === '+' || operator === '-') {
            currentInput = (parseFloat(previousInput) * (val / 100)).toString();
        } else {
            currentInput = (val / 100).toString();
        }
        updateDisplay();
        return;
    }

    if (operator !== null) compute();
    
    previousInput = currentInput;
    operator = op;
    historyDisplay.innerText = `${previousInput} ${op}`;
    shouldResetScreen = true;
}

function compute() {
    if (operator === null || shouldResetScreen) return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/': result = current === 0 ? "Erro" : prev / current; break;
        case '**': result = Math.pow(prev, current); break;
    }

    currentInput = parseFloat(result.toFixed(10)).toString();
    operator = null;
    historyDisplay.innerText = '';
    shouldResetScreen = true;
    updateDisplay();
}

function execSci(func) {
    let val = parseFloat(currentInput);
    if (isNaN(val)) return;
    let res;
    const toRad = (d) => d * (Math.PI / 180);

    switch(func) {
        case 'sin': res = Math.sin(toRad(val)); break;
        case 'cos': res = Math.cos(toRad(val)); break;
        case 'tan': res = Math.tan(toRad(val)); break;
        case 'sqrt': res = val < 0 ? "Erro" : Math.sqrt(val); break;
        case 'fact': res = factorial(val); break;
    }
    
    currentInput = parseFloat(res.toFixed(10)).toString();
    shouldResetScreen = true;
    updateDisplay();
}

function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return "Erro";
    if (n === 0) return 1;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    historyDisplay.innerText = '';
    updateDisplay();
}

function deleteDigit() {
    if (currentInput.length === 1) currentInput = '0';
    else currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

updateDisplay();