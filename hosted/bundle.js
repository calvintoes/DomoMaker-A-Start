'use strict';

var handleDomo = function handleDomo(e) {
  e.preventDefault();

  $('#domoMessage').animate({ width: 'hide' }, 350);

  if ($('#domoName').val() === '' || $('#domoAge').val() === '' || $('#domoHeight').val() === '') {
    handleError('RAWR! All fields are required');
    return false;
  }

  sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), function () {
    loadDomosFromServer();
  });

  return false;
};

var removeDomo = function removeDomo(domo, e) {
  e.persist();
  console.log(domo);
  var id = domo._id;
  console.log(document.querySelector('.removeCSRF'));
  var _csrf = document.querySelector('.removeCSRF').value;

  var domoData = {
    id: id,
    _csrf: _csrf
  };

  console.log('data obj', domoData);

  sendAjax('DELETE', '/removeDomo', domoData, function () {
    loadDomosFromServer();
  });
};

var DomoForm = function DomoForm(props) {
  return React.createElement(
    'form',
    {
      id: 'domoForm',
      onSubmit: handleDomo,
      name: 'domoForm',
      action: '/maker',
      method: 'POST',
      className: 'domoForm'
    },
    React.createElement(
      'label',
      { htmlFor: 'name' },
      'Name: '
    ),
    React.createElement('input', { id: 'domoName', type: 'text', name: 'name', placeholder: 'name' }),
    React.createElement(
      'label',
      { htmlFor: 'age' },
      'Age: '
    ),
    React.createElement('input', { id: 'domoAge', type: 'text', name: 'age', placeholder: 'age' }),
    React.createElement(
      'label',
      { htmlFor: 'height' },
      'Height: '
    ),
    React.createElement('input', { id: 'domoHeight', type: 'text', name: 'height', placeholder: 'height (in inches)' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Make Domo' })
  );
};

var DomoList = function DomoList(props) {
  var csrf = props.csrf;

  if (props.domos.length === 0) {
    return React.createElement(
      'div',
      { className: 'domoList' },
      React.createElement(
        'h3',
        { className: 'emptyDomo' },
        'No Domos Yet'
      )
    );
  }

  var domoNodes = props.domos.map(function (domo) {
    console.log(csrf);
    return React.createElement(
      'div',
      { key: domo._id, className: 'domo' },
      React.createElement('img', { src: '/assets/img/domoface.jpeg', alt: 'domo face', className: 'domoFace' }),
      React.createElement(
        'h3',
        { className: 'domoName' },
        ' Name: ',
        domo.name,
        ' '
      ),
      React.createElement(
        'h3',
        { className: 'domoAge' },
        ' Age: ',
        domo.age,
        ' '
      ),
      React.createElement(
        'h3',
        { className: 'domoHeight' },
        ' Height: ',
        domo.height,
        ' in'
      ),
      React.createElement('input', { className: 'removeCSRF', type: 'hidden', name: '_csrf', value: csrf }),
      React.createElement(
        'button',
        { className: 'removeDomoBtn', onClick: removeDomo.bind(undefined, domo) },
        ' X '
      )
    );
  });

  return React.createElement(
    'div',
    { className: 'domoList' },
    domoNodes
  );
};

var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {
    console.log(data.domos);
    ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector('#makeDomo'));

  ReactDOM.render(React.createElement(DomoList, { domos: [], csrf: csrf }), document.querySelector('#domos'));

  loadDomosFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
'use strict';

var handleError = function handleError(msg) {
  $('#errorMessage').text(msg);
  $('#domoMessage').animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $('#domoMessage').animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
