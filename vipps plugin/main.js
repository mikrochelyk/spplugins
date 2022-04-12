const requestURL = 'https://apitest.vipps.no'

async function sendRequest(method, url, data = {}) {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  }
  
function getAccessToken(){
    sendRequest('POST', requestURL+'/accesstoken/get', { 'client_id': 'fb492b5e-7907-4d83-ba20-c7fb60ca35de', 
    'client_secret': 'Y8Kteew6GE2ZmeycEt6egg==', 
    'Ocp-Apim-Subscription-Key': '0f14ebcab0ec4b29ae0cb90d91b4a84a' })
    .then((data) => {
        console.log(data);
    });
}

function initiatePayment(){
    sendRequest('POST', requestURL+'/ecomm/v2/payments', { 'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1Ni...', // Authorization - access token из прошлого метода
    'Content-Type': 'application/json', 
    'Ocp-Apim-Subscription-Key': '0f14ebcab0ec4b29ae0cb90d91b4a84a',
    'Merchant-Serial-Number': '123456' })
    .then((data) => {
        console.log(data);
    });
}

function capturePayment(){
    sendRequest('POST', requestURL+'/ecomm/v2/payments/order-id123/capture', { 'orderId': 'order-id123', // в url, orderID получается из прошлого метода
    'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1Ni...', 
    'Content-Type': 'application/json', 
    'Ocp-Apim-Subscription-Key': '0f14ebcab0ec4b29ae0cb90d91b4a84a',
    'X-Request-Id': 'fagwqgasgasdgarkaa', // X-Request-Id - любое произвольное значение до 40 символов
    'Merchant-Serial-Number': '123456'  }) 
    .then((data) => {
        console.log(data);
    });
}

function cancelPayment(){
    sendRequest('PUT', requestURL+'/ecomm/v2/payments/order-id123/cancel', { 'orderId': 'order-id123',
    'Content-Type': 'application/json', 
    'Ocp-Apim-Subscription-Key': '0f14ebcab0ec4b29ae0cb90d91b4a84a',
    'Merchant-Serial-Number': '123456' })
    .then((data) => {
        console.log(data);
    });
}

function doARefund(){
    sendRequest('PUT', requestURL+'/ecomm/v2/payments/order-id123/refund', { 'orderId': 'order-id123',
    'Content-Type': 'application/json', 
    'Ocp-Apim-Subscription-Key': '0f14ebcab0ec4b29ae0cb90d91b4a84a',
    'X-Request-Id': 'fagwqgasgasdgarkaa',
    'Merchant-Serial-Number': '123456' })
    .then((data) => {
        console.log(data);
    });
}

function getDetails(){
    sendRequest('GET', requestURL+'/ecomm/v2/payments/order-id123/details', { 'orderId': 'order-id123',
    'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1Ni...', 
    'Content-Type': 'application/json', 
    'Ocp-Apim-Subscription-Key': '0f14ebcab0ec4b29ae0cb90d91b4a84a',
    'Merchant-Serial-Number': '123456' })
    .then((data) => {
        console.log(data);
    });
}

