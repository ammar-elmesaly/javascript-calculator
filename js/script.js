document.addEventListener('DOMContentLoaded', () => {

    const resultScreen = document.querySelector('.result');
    let error = false;

    function updateResult(value) {  // value could be a number or an operator
        if (!error) {
            resultScreen.innerHTML += value;
        }
    }

    function evaluateResult() {
        if (!error) {
            try {
                let calculation = cleanFloat(eval(resultScreen.innerHTML));
                resultScreen.innerHTML = calculation;
                if (Number.isNaN(calculation)) {
                    resultScreen.innerHTML = '(Math Error)';
                    error = true;
                }
            } catch(err) {
                resultScreen.innerHTML = '(Syntax Error)';
                error = true;
            }
        }
    }

    function backspace() {
        if (!error) {
            resultScreen.innerHTML = resultScreen.innerHTML.slice(0, -1);  // removes last character
        }
    }

    function clearResult() {
        resultScreen.innerHTML = '';
        error = false;
    }

    function cleanFloat(num, precision=12) {
        return parseFloat(num.toPrecision(precision));
    }

    window.updateResult = updateResult;
    window.evaluateResult = evaluateResult;
    window.backspace = backspace;
    window.clearResult = clearResult;
});