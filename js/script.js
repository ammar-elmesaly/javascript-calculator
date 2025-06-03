document.addEventListener('DOMContentLoaded', () => {

    let resultScreenCharLimit = 15;
    const resultScreen = document.querySelector('.result');
    const calculatorButtonElements = document.querySelectorAll('.calculator-button');
    const evalButtonElement = document.querySelector('.eval-button');
    const clearButtonElement = document.querySelector('.clear-button');
    const backspaceButtonElement = document.querySelector('.backspace-button');

    let error = false;

    // Set event listeners for buttons

    calculatorButtonElements.forEach(button => {
        button.addEventListener('click', () => insertValue(button.dataset.value));
    });

    evalButtonElement.addEventListener('click', evaluateResult);
    clearButtonElement.addEventListener('click', clearResult);
    backspaceButtonElement.addEventListener('click', backspace);

    function insertValue(value) {  // Value could be a number or an operator
        if (!error && resultScreen.textContent.length < resultScreenCharLimit) {
            resultScreen.textContent += value;
        }
    }

    function evaluateResult() {
        if (!error) {
            try {
                let calculation;
                if (isBinary) {
                    calculation = binaryEval(resultScreen.textContent);
                    if (calculation.length > 14) {
                        calculation = calculation.slice(0, 15);
                    }
                } else if (isHex) {
                    calculation = hexEval(resultScreen.textContent);
                } else {
                    calculation = cleanFloat(math.evaluate(resultScreen.textContent));
                }
                resultScreen.textContent = calculation;
                if (Number.isNaN(calculation) || calculation === 'NaN') {
                    resultScreen.textContent = '(Math Error)';
                    error = true;
                }
            } catch(err) {
                resultScreen.textContent = '(Syntax Error)';
                error = true;
            }
        }
    }

    function binaryEval(expr) {
        let decimalExpr = expr.replace(/\b[01]+\b/g, match => parseInt(match, 2));
        let decimalResult = math.evaluate(decimalExpr);        
        return decimalResult.toString(2);
    }

    function hexEval(expr) {
        let canonicalExpr = expr.replace(/\b[0-9a-fA-F]+\b/g, match => `BigInt("0x${match}")`);  // Meaning all hex numbers will be prefixed with 0x and BigInt because we are basically dealing with BIG ints here
        // Evaluate using Function constructor (safe because we control the input structure)
        const result = Function(`return (${canonicalExpr})`)();
        // Convert back to hex string
        return result.toString(16).toUpperCase();
    }

    function backspace() {
        if (!error) {
            resultScreen.textContent = resultScreen.textContent.slice(0, -1);  // Removes last character
        }
    }

    function clearResult() {
        resultScreen.textContent = '';
        error = false;
    }

    function cleanFloat(num, floatPrecision=13, expPrecision=10) {
        if (num > Math.pow(10, expPrecision)) {
            let result = Number(num).toExponential(expPrecision-1);
            return result.replace(/(\.\d*?[1-9])0+|\.0+(?=e)|\.0+$/, '$1');  // Clean trailing zeros
        }
        return parseFloat(num.toPrecision(floatPrecision));
    }

    window.insertValue = insertValue;
    window.evaluateResult = evaluateResult;
    window.backspace = backspace;
    window.clearResult = clearResult;

    // Enable keyboard input
    
    document.addEventListener('keydown', keyboardInput);
    
    function keyboardInput(event) {
        if (isBinary) {
            if ("01+*-.()".includes(event.key)) {
                insertValue(event.key);
            }
        } else if (isHex) {
            if ("0123456789abcdef+*-.()".includes(event.key)) {
                insertValue(event.key.toUpperCase());
            } 
        } else {
            if ("0123456789+*-.()".includes(event.key)) {
                insertValue(event.key);
            }
        }
        if (event.key === "Enter") {
            evaluateResult();
        } else if (event.key === "Backspace") {
            backspace();
        }
    }

    // Mode switching

    const binaryInputElement = document.querySelector('.binary-checkbox');
    const hexInputElement = document.querySelector('.hex-checkbox');
    let isBinary = binaryInputElement.checked;    ;
    let isHex = hexInputElement.checked;
    let transitionActivated = false;

    binaryInputElement.addEventListener('click', () => {
        isBinary = binaryInputElement.checked;
        if (isBinary) {
            isHex = false;
            hexInputElement.checked = false;
        }
        updateBinary();
        updateHex();
        clearResult();
    });
    hexInputElement.addEventListener('click', () => {
        isHex = hexInputElement.checked;
        if (isHex) {
            isBinary = false;
            binaryInputElement.checked = false;
            if (!transitionActivated) {
                activateTransition();
            }
        }
        updateBinary();
        updateHex();
        clearResult();
    });

    function updateBinary() {
        binaryButtonsDisabled = document.querySelectorAll('.binary-disabled');  // Buttons that would be disabled in binary mode
        if (isBinary) {
            binaryButtonsDisabled.forEach(button => {
                button.classList.add('disabled-binary');
                button.disabled = true;
            });
        } else {
            binaryButtonsDisabled.forEach(button => {
                button.classList.remove('disabled-binary');
                button.disabled = false;
            });
        }
    }

    function updateHex() {
        const operationButtonElements = document.querySelectorAll('.operation-button');
        const hexContainerElement = document.querySelector('.hex-container');
        if (isHex) {
            operationButtonElements.forEach(button => {
                button.classList.add('shift-right');
            });
            hexContainerElement.classList.add('active-hex');
            resultScreen.classList.add('result-widen');
            resultScreenCharLimit = 19;

        } else {
            operationButtonElements.forEach(button => {
                button.classList.remove('shift-right');
            });
            hexContainerElement.classList.remove('active-hex');
            resultScreen.classList.remove('result-widen');
            resultScreenCharLimit = 15;

        }
    }

    // Activates transition delay late because when you load the website the hex digit column is visible
    function activateTransition() {
        document.querySelector('.hex-container').style['-webkit-transition'] = '1s';
        document.querySelector('.hex-container').style['transition'] = '1s';
        transitionActivated = true;
    }

    updateBinary();
    updateHex();

});