const handleError = (msg) => {
  $('#errorMessage').text(msg);
  $('#domoMessage').animate({ width: 'toggle' }, 350);
};

const redirect = (response) => {
  $('#domoMessage').animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success, token) => {
  $.ajax({
    beforeSend(xhr) {
      xhr.setRequestHeader('Csrf-Token', token);
    },
    cache: false,
    type,
    url: action,
    data,
    dataType: 'json',
    success,
    error(xhr, status, error) {
      const messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    },
  });
};
