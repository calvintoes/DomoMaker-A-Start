
const handleDomo = (e) => {
  e.preventDefault();

  $('#domoMessage').animate({ width: 'hide' }, 350);

  if ($('#domoName').val() === '' || $('#domoAge').val() === '' || $('#domoHeight').val() === '') {
    handleError('RAWR! All fields are required');
    return false;
  }

  sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), function() {
    loadDomosFromServer();
  });

  return false;
}

const removeDomo = (domo, e) => {
  e.persist();
  console.log(domo); 
  let id = domo._id;
  console.log(document.querySelector('.removeCSRF'))
  let _csrf = document.querySelector('.removeCSRF').value;

  const domoData = {
    id,
    _csrf
  };

  console.log('data obj',domoData)

  sendAjax('DELETE', '/removeDomo', domoData, function(){
    loadDomosFromServer()
  });
}

const DomoForm = (props) => {
  return(
    <form
      id="domoForm"
      onSubmit={handleDomo}
      name="domoForm"
      action="/maker"
      method="POST"
      className="domoForm"
    >
      <label htmlFor='name'>Name: </label>
      <input id='domoName' type='text' name='name' placeholder='name' />
      <label htmlFor='age'>Age: </label>
      <input id='domoAge' type='text' name='age' placeholder='age' />
      <label htmlFor='height'>Height: </label>
      <input id='domoHeight' type='text' name='height' placeholder='height (in inches)' />
      <input type='hidden' name='_csrf' value={props.csrf} />
      <input className='makeDomoSubmit' type='submit' value='Make Domo' />
    </form>  
  );
};

const DomoList = (props) => {
  let csrf = props.csrf;
  
  if (props.domos.length === 0) {
    return (
      <div className="domoList">
        <h3 className="emptyDomo">No Domos Yet</h3>
      </div>
    );
  }
  
  const domoNodes = props.domos.map((domo) => {
    console.log(csrf)
    return (
      <div key={domo._id} className="domo">
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
        <h3 className="domoName"> Name: {domo.name} </h3>
        <h3 className="domoAge"> Age: {domo.age} </h3>
        <h3 className="domoHeight"> Height: {domo.height} in</h3>
        <input className="removeCSRF" type='hidden' name='_csrf' value={csrf} />
        <button className="removeDomoBtn" onClick={removeDomo.bind(this, domo)}> X </button>
      </div>
    );
  });

  return (
    <div className="domoList">
      {domoNodes}
    </div>
  )
};


const loadDomosFromServer = () => {
  sendAjax('GET','/getDomos', null, (data) => {
    console.log(data.domos)
    ReactDOM.render(
      <DomoList domos={data.domos} />, document.querySelector("#domos")
    );
  });
}

const setup = function(csrf) {
  ReactDOM.render(
    <DomoForm csrf={csrf} />, document.querySelector('#makeDomo')
  );

  ReactDOM.render(
    <DomoList domos={[]} csrf={csrf} />, document.querySelector('#domos')
  );

  loadDomosFromServer();
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function(){
  getToken();
});