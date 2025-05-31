document.addEventListener('DOMContentLoaded', () => {

    const resultScreen = document.querySelector('.result');
    let error = false;

    function insertValue(value) {  // value could be a number or an operator
        if (!error && resultScreen.textContent.length < 15) {
            resultScreen.textContent += value;
        }
    }

    function evaluateResult() {
        if (!error) {
            try {
                let calculation = cleanFloat(math.evaluate(resultScreen.textContent));
                resultScreen.textContent = calculation;
                if (Number.isNaN(calculation)) {
                    resultScreen.textContent = '(Math Error)';
                    error = true;
                }
            } catch(err) {
                resultScreen.textContent = '(Syntax Error)';
                error = true;
            }
        }
    }

    function backspace() {
        if (!error) {
            resultScreen.textContent = resultScreen.textContent.slice(0, -1);  // removes last character
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
});