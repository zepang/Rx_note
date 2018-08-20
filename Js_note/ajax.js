function createAjax () {
  if (window.XMLHttpRequest) {
    return new XMLHttpRequest
  } else {
    return new ActiveXObject('Microsoft.XMLHTTP')
  }
}

let xhr = createAjax()

xhr.onreadystatechange = function () {
  if (xhr.readyState == 4 && xhr.status == 200) {
    console.log(xhr.responseText)
  } else {
    alert('request was failed:' + xhr.status)
  }
}

xhr.open('get', 'www.baidu.com', true)
xhr.send()