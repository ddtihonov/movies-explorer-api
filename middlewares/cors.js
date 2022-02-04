const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://ddtihonov.students.nomoredomains.work',
  'http://ddtihonov.students.nomoredomains.work',
  'https://localhost:3000',
  'http://localhost:3000',
];
// eslint-disable-next-line consistent-return
function cors(req, res, next) {
  const { origin } = req.headers; // источник запроса - в переменную origin
  const { method } = req; // тип запроса (HTTP-метод) в соотв. переменную
  const requestHeaders = req.headers['access-control-request-headers']; // сохр. список заголовков исходного запроса

  if (allowedCors.includes(origin)) {
    // уст. заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  // предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // разрешаем кросс-доменные запросы с этими  заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }

  return next();
}

module.exports = { cors };
