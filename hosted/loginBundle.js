'use strict';

var handleLogin = function handleLogin(e) {
  e.preventDefault();

  $('#domoMessage').animate({ width: 'hide' }, 350);

  if ($('#user').val() === '' || $('#pass').val() === '') {
    handleError('RAWR! Username or password is empty!');
    return false;
  }

  console.log($('input[name=_csrf]').val());

  sendAjax('POST', $('#loginForm').attr('action'), $('#loginForm').serialize(), redirect);

  return false;
};

var handleSignUp = function handleSignUp(e) {
  e.preventDefault();

  $('#domoMessage').animate({ width: 'hide' }, 350);

  if ($('#user').val() === '' || $('#pass').val() === '' || $('#pass2').val() === '') {
    handleError('RAWR! All fields are required');
    return false;
  }

  if ($('#pass').val() !== $('#pass2').val()) {
    handleError('RAWR! Passwords do not match');
    return false;
  }

  sendAjax('POST', $('#signupForm').attr('action'), $('#signupForm').serialize(), redirect);
};

var LoginWindow = function LoginWindow(props) {
  return React.createElement(
    'form',
    { id: 'loginForm', name: 'loginForm',
      onSubmit: handleLogin,
      action: '/login',
      method: 'POST',
      className: 'mainForm'
    },
    React.createElement(
      'label',
      { htmlFor: 'username' },
      'Username: '
    ),
    React.createElement('input', { id: 'user', type: 'text', name: 'username', placeholder: 'username' }),
    React.createElement(
      'label',
      { htmlFor: 'pass' },
      'Password: '
    ),
    React.createElement('input', { id: 'pass', type: 'password', name: 'pass', placeholder: 'password' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Sign in' })
  );
};

var SignUpWindow = function SignUpWindow(props) {
  return React.createElement(
    'form',
    {
      id: 'signupForm',
      name: 'signupForm',
      onSubmit: handleSignUp,
      action: '/signup',
      method: 'POST',
      className: 'mainForm'
    },
    React.createElement(
      'label',
      { htmlFor: 'username' },
      'Username: '
    ),
    React.createElement('input', { id: 'user', type: 'text', name: 'username', placeholder: 'username' }),
    React.createElement(
      'label',
      { htmlFor: 'pass' },
      'Password: '
    ),
    React.createElement('input', { id: 'pass', type: 'password', name: 'pass', placeholder: 'password' }),
    React.createElement(
      'label',
      { htmlFor: 'pass2' },
      'Password: '
    ),
    React.createElement('input', { id: 'pass2', type: 'password', name: 'pass2', placeholder: 'retype password' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Sign Up' })
  );
};

var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

var createSignUpWindow = function createSignUpWindow(csrf) {
  ReactDOM.render(React.createElement(SignUpWindow, { csrf: csrf }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");

  signupButton.addEventListener('click', function (e) {
    e.preventDefault();
    createSignUpWindow(csrf);
    return false;
  });

  loginButton.addEventListener('click', function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });

  createLoginWindow(csrf);
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

var sendAjax = function sendAjax(type, action, data, success, token) {
  $.ajax({
    beforeSend: function beforeSend(xhr) {
      xhr.setRequestHeader('Csrf-Token', token);
    },

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
