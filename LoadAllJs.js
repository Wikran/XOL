const timestamps = Date.now();
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = `NITL901232.css?t=${timestamps}`;
document.head.appendChild(link);

const timestamp = Date.now();
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const param1 = urlParams.get('param1');
const scripts = ['./src/bundle.min.js', "./dist/" + param1 + `.js?t=${timestamp}`];
scripts.forEach(function (file) {
    const scriptElement = document.createElement('script'); //
    scriptElement.src = file;
    document.head.appendChild(scriptElement);
});