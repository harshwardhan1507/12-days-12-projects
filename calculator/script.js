let displayValue = '0';
let isScientific = false;
let storedValue = null;
let pendingOperator = null;
let expressionHistory = '';
let calculationHistory = [];

const CASIO_DELAY = 100;

document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    loadHistory();
});

function updateDisplay() {
    document.getElementById('display').value = displayValue;
    document.getElementById('secondaryDisplay').textContent = expressionHistory;
}

function appendNumber(number) {
    if (displayValue === '0' || displayValue === 'Error') {
        displayValue = number;
    } else if (number === '.' && displayValue.includes('.')) {
        return;
    } else {
        displayValue += number;
    }
    updateDisplay();
}

function appendOperator(operator) {
    if (displayValue === 'Error') {
        displayValue = '0';
    }
    
    const currentValue = parseFloat(displayValue);
    
    if (storedValue !== null && pendingOperator !== null) {
        const result = performCalculation(storedValue, currentValue, pendingOperator);
        expressionHistory = `${storedValue} ${getOperatorSymbol(pendingOperator)} ${currentValue} =`;
        displayValue = String(Math.round(result * 1000000000000) / 1000000000000);
        storedValue = parseFloat(displayValue);
    } else {
        storedValue = currentValue;
    }
    
    pendingOperator = operator;
    expressionHistory = `${displayValue} ${getOperatorSymbol(operator)}`;
    displayValue = '0';
    updateDisplay();
}

function getOperatorSymbol(op) {
    const symbols = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷',
        '%': '%',
        'pow': '^'
    };
    return symbols[op] || op;
}

function scientificFunc(func) {
    let currentValue = parseFloat(displayValue);
    if (isNaN(currentValue)) currentValue = 0;
    
    let result;
    let funcName = '';
    
    switch(func) {
        case 'sin':
            result = Math.sin(currentValue * Math.PI / 180);
            funcName = 'sin';
            break;
        case 'cos':
            result = Math.cos(currentValue * Math.PI / 180);
            funcName = 'cos';
            break;
        case 'tan':
            result = Math.tan(currentValue * Math.PI / 180);
            funcName = 'tan';
            break;
        case 'asin':
            result = Math.asin(currentValue) * 180 / Math.PI;
            funcName = 'sin⁻¹';
            break;
        case 'acos':
            result = Math.acos(currentValue) * 180 / Math.PI;
            funcName = 'cos⁻¹';
            break;
        case 'atan':
            result = Math.atan(currentValue) * 180 / Math.PI;
            funcName = 'tan⁻¹';
            break;
        case 'log':
            result = Math.log10(currentValue);
            funcName = 'log';
            break;
        case 'ln':
            result = Math.log(currentValue);
            funcName = 'ln';
            break;
        case 'sqrt':
            result = Math.sqrt(currentValue);
            funcName = '√';
            break;
        case 'square':
            result = currentValue * currentValue;
            funcName = 'x²';
            break;
        case 'cube':
            result = currentValue * currentValue * currentValue;
            funcName = 'x³';
            break;
        case 'pow':
            storedValue = currentValue;
            pendingOperator = 'pow';
            expressionHistory = `${currentValue}^`;
            displayValue = '0';
            updateDisplay();
            return;
        case 'pi':
            displayValue = String(Math.PI);
            updateDisplay();
            return;
        case 'e':
            displayValue = String(Math.E);
            updateDisplay();
            return;
        case 'factorial':
            result = factorial(Math.abs(Math.floor(currentValue)));
            funcName = 'n!';
            break;
        case 'abs':
            result = Math.abs(currentValue);
            funcName = '|x|';
            break;
        case 'inv':
            if (currentValue === 0) {
                showError('Cannot divide by zero');
                return;
            }
            result = 1 / currentValue;
            funcName = '1/x';
            break;
        default:
            return;
    }
    
    if (isNaN(result) || !isFinite(result)) {
        showError('Error');
        return;
    }
    
    result = Math.round(result * 1000000000000) / 1000000000000;
    expressionHistory = `${funcName}(${currentValue})`;
    displayValue = String(result);
    updateDisplay();
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function performCalculation(a, b, operator) {
    switch(operator) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : NaN;
        case '%': return a % b;
        case 'pow': return Math.pow(a, b);
        default: return b;
    }
}

function calculate() {
    if (storedValue === null || pendingOperator === null) {
        return;
    }

    const currentValue = parseFloat(displayValue);
    const expression = `${storedValue} ${getOperatorSymbol(pendingOperator)} ${currentValue}`;
    const result = performCalculation(storedValue, currentValue, pendingOperator);
    
    if (isNaN(result) || !isFinite(result)) {
        showError('Error');
        storedValue = null;
        pendingOperator = null;
        expressionHistory = '';
        return;
    }
    
    const finalResult = Math.round(result * 1000000000000) / 1000000000000;
    
    // Add to history
    addToHistory(expression, finalResult);
    
    displayValue = String(finalResult);
    storedValue = null;
    pendingOperator = null;
    expressionHistory = '';
    updateDisplay();
}

function addToHistory(expression, result) {
    const historyItem = {
        expression: expression,
        result: result,
        timestamp: Date.now()
    };
    
    calculationHistory.unshift(historyItem);
    
    if (calculationHistory.length > 50) {
        calculationHistory = calculationHistory.slice(0, 50);
    }
    
    saveHistory();
    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById('historyList');
    
    if (calculationHistory.length === 0) {
        historyList.innerHTML = '<div class="history-empty">No calculations yet</div>';
        return;
    }
    
    historyList.innerHTML = calculationHistory.map((item) => `
        <div class="history-item" onclick="useHistoryValue('${item.result}')">
            <div class="history-expression">${item.expression}</div>
            <div class="history-result">= ${item.result}</div>
        </div>
    `).join('');
}

function useHistoryValue(value) {
    displayValue = value;
    expressionHistory = '';
    storedValue = null;
    pendingOperator = null;
    updateDisplay();
}

function clearHistory() {
    calculationHistory = [];
    saveHistory();
    renderHistory();
}

function saveHistory() {
    try {
        localStorage.setItem('calculatorHistory', JSON.stringify(calculationHistory));
    } catch (e) {}
}

function loadHistory() {
    try {
        const saved = localStorage.getItem('calculatorHistory');
        if (saved) {
            calculationHistory = JSON.parse(saved);
            renderHistory();
        }
    } catch (e) {}
}

function clearDisplay() {
    displayValue = '0';
    storedValue = null;
    pendingOperator = null;
    expressionHistory = '';
    updateDisplay();
}

function deleteLast() {
    if (displayValue === 'Error') {
        displayValue = '0';
    } else if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);
    } else {
        displayValue = '0';
    }
    updateDisplay();
}

function showError(message) {
    displayValue = message;
    updateDisplay();
    setTimeout(() => {
        displayValue = '0';
        expressionHistory = '';
        updateDisplay();
    }, 1500);
}

function toggleScientific() {
    isScientific = !isScientific;
    
    const calculator = document.querySelector('.calculator');
    const scientificButtons = document.getElementById('scientificButtons');
    const toggleBtn = document.querySelector('.sci-toggle');
    const historyPanel = document.getElementById('historyPanel');
    
    if (isScientific) {
        calculator.classList.add('scientific');
        scientificButtons.classList.add('show');
        toggleBtn.classList.add('active');
        toggleBtn.innerHTML = '<i class="fas fa-calculator"></i> Basic';
        historyPanel.style.display = 'none';
    } else {
        calculator.classList.remove('scientific');
        scientificButtons.classList.remove('show');
        toggleBtn.classList.remove('active');
        toggleBtn.innerHTML = '<i class="fas fa-function"></i> Scientific';
        historyPanel.style.display = 'flex';
    }
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendNumber('.');
    } else if (key === '+') {
        appendOperator('+');
    } else if (key === '-') {
        appendOperator('-');
    } else if (key === '*') {
        appendOperator('*');
    } else if (key === '/') {
        appendOperator('/');
    } else if (key === '%') {
        appendOperator('%');
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === '(') {
        appendOperator('(');
    } else if (key === ')') {
        appendOperator(')');
    }
});
