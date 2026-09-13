let expr = "";
const exprEl = document.getElementById('expr');
const resultEl = document.getElementById('result');

function press(v) {
  expr += v;
  exprEl.textContent = display(expr);
}

function backspace() {
  expr = expr.slice(0, -1);
  exprEl.textContent = display(expr);
}

function clearAll() {
  expr = "";
  exprEl.textContent = "";
  resultEl.textContent = "0";
}

function display(s) {
  return s
    .replace(/\*/g, '×')
    .replace(/\//g, '÷')
    .replace(/%/g, ' mod ');
}

function formatNumber(n) {
  if (!isFinite(n)) return "Math ERROR";
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return n.toString();
  const abs = Math.abs(n);
  if (abs !== 0 && (abs >= 1e10 || abs < 1e-9)) {
    return n.toExponential(6).replace(/e\+?(-?)(\d+)/, 'e$1$2');
  }
  let s = n.toPrecision(10);
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s;
}

function calculate() {
  if (!expr) return;
  try {
    let js = expr
      .replace(/\^/g, '**')
      .replace(/pi/g, 'Math.PI')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/(\d+(\.\d+)?)\s*%\s*(\d+(\.\d+)?)/g, '($1 % $3)');

    const val = Function('"use strict"; return (' + js + ')')();
    resultEl.textContent = formatNumber(val);
  } catch (e) {
    resultEl.textContent = "Syntax ERROR";
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { calculate(); return; }
  if (e.key === 'Backspace') { backspace(); return; }
  if (e.key === 'Escape') { clearAll(); return; }
  if ('0123456789.+-*/()%'.includes(e.key)) press(e.key);
});