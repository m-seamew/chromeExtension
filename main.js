
//Global Val
let arr = [];
let allWorldStat = [
  {
    NewConfirmed: 0,
    NewDeaths: 0,
    NewRecovered: 0,
    Confirmed: 0,
    Deaths: 0,
    Recovered: 0,
    Updated: '',
  }
];

let database = []; //date about situation in all countries from request
let clientArr = []; //for saving last client request(3 requests)
let maxid = 0; //for creation ids in clientArr
let accordionField = [];//for arr (Node List) for correct work accordion (result block)



//start the app
request();

//request the data from api if needed. Check the updates every 15 minutes
function request() {

  document.querySelector('.preloader').innerText = "Please wait";//preloader start

  let lastRequestTime = localStorage.getItem('timeOfLastRequest');
  lastRequestTime === undefined ? lastRequestTime = 0 : null;

  let tempArr = JSON.parse(localStorage.getItem('avaliableCountries')); //load list of available countries from localstorage
  tempArr !== null ? arr = tempArr : null;

  const time = new Date();

  if (time.getTime() - lastRequestTime > 900000) {

    fetch(
      'https://api.covid19api.com/summary',
      { method: 'GET' }
    )
      .then(req => {
        return req.json();
      })
      .then(data => {
        countryList(data);
        saveData(data);
      })
      .then(renderWorldStat)
      .then(renderClientArr)
      .catch(error => errorReq());

    localStorage.setItem('timeOfLastRequest', time.getTime()); //Save the time of last request
  }
  else {
    renderWorldStat();
    database = JSON.parse(localStorage.getItem('database'));
    renderClientArr();
  }

  setTimeout(request, 900000); //autorequest
}



// generate the list of available countries, save to localstorage
function countryList(data) {

  let arrLength = arr.length;
  let tempContries = [...data.Countries];

  if (arrLength > 0 && arrLength != tempContries.length) {

    console.log(tempContries);

    tempContries.forEach(el => {
      arr.find(item => item === el.Country) === undefined ? arr.push(el.Country) : null;
    });

  }
  arrLength === 0 ? tempContries.forEach(el => { arr.push(el.Country); }) : null;

  localStorage.setItem('avaliableCountries', JSON.stringify(arr));
}


//work with data from api. Sort the nedded dates to suitable variables
function saveData(data) {

  allWorldStat.forEach(el => {
    el.NewConfirmed = data.Global.NewConfirmed;
    el.NewDeaths = data.Global.NewDeaths;
    el.NewRecovered = data.Global.NewRecovered;
    el.Confirmed = data.Global.TotalConfirmed;
    el.Deaths = data.Global.TotalDeaths;
    el.Recovered = data.Global.TotalRecovered;
    el.Updated = data.Date;
  });

  localStorage.setItem('allWorldStat', JSON.stringify(allWorldStat));

  data.Countries.forEach(el => {

    database.push({
      country: el.Country,
      newConfirmed: el.NewConfirmed,
      newDeaths: el.NewDeaths,
      newRecovered: el.NewRecovered,
      confirmed: el.TotalConfirmed,
      deaths: el.TotalDeaths,
      recovered: el.TotalRecovered,
      search: el.Country.toLowerCase()
    });
  });

  localStorage.setItem('database', JSON.stringify(database));

}

function renderWorldStat() {

  let datalist = JSON.parse(localStorage.getItem('allWorldStat'));
  const field = document.querySelector('.global__stat');

  field.innerHTML = datalist.map(el => {
    let date = new Date(el.Updated);
    let month = checkMonth(date);
    let hourse = `${(date.getHours() < 10 ? '0' : null) + date.getHours()}`;
    let minutes = `${(date.getMinutes() < 10 ? '0' : null) + date.getMinutes()}`;
    let timeOfUpdate = `Last updated: ${date.getDate()} ${month} ${hourse}:${minutes}`;

    return `<p class="global__title">Statistic of COVID-19 Pandemic</p>
            <div class="global__time-update">${timeOfUpdate}</div>
            <ul class="global__data">
              <li class="global__list-item">
                <div class="global__list-item-container global__confirmed">
                  <div class="global__list-header">Total confirmed</div>
                  <div class="global__list-data">${el.Confirmed}</div>
                </div>
              </li>
              <li class="global__list-item">
                <div class="global__list-item-container global__death">
                  <div class="global__list-header">Total deaths</div>
                  <div class="global__list-data">${el.Deaths}</div>
                </div>
              </li>
              <li class="global__list-item">
                <div class="global__list-item-container global__recovered">
                  <div class="global__list-header">Total recovered</div>
                  <div class="global__list-data">${el.Recovered}</div>
                </div>
              </li>
              <li class="global__list-item">
                <div class="global__list-item-container global__new">
                  <div class="global__list-header global__list-header--new">Confirmed / 24H </div>
                  <div class="global__list-data global__list-data--new">${el.NewConfirmed}</div>
                </div>
              </li>
              <li class="global__list-item">
               <div class="global__list-item-container global__new global__list-data--dead">
                  <div class="global__list-header global__list-header--new">Death / 24H </div>
                  <div class="global__list-data global__list-data--new">${el.NewDeaths}</div>
               </div>
              </li>
              <li class="global__list-item">
                <div class="global__list-item-container global__new global__list-data--recovery">
                  <div class="global__list-header global__list-header--new">Recovered / 24H </div>
                  <div class="global__list-data global__list-data--new">${el.NewRecovered}</div>
                </div>
              </li>
           </ul>`;
  });
  document.querySelector('.preloader').innerText = ""; //preloader end
}

function renderClientArr() {

  let datalist = JSON.parse(localStorage.getItem('clientArr'));
  datalist !== null ? clientArr = datalist : null;

  const field = document.querySelector('.result');

  field.innerHTML = clientArr.map(el => {

    return `<div class="result__item">
                <div class="result__header">Statistics of ${el.country}</div>
                <div class="country__data">
                  <div class="country__data-today">
                    <div class="country__list-header">Changing for last 24 hourse</div>
                    <ul class="country__list">
                      <li class="country__list-item">Confirmation: <span class="country__list-bold">${el.newConfirmed}</span></li>
                      <li class="country__list-item">Deaths: <span class="country__list-bold">${el.newDeaths}</span></li>
                      <li class="country__list-item">Recovered: <span class="country__list-bold">${el.newRecovered}</span></li>
                    </ul>
                  </div>

                  <div class="country__data-total">
                   <div class="country__list-header">Total stat</div>
                   <ul class="country__list">
                     <li class="country__list-item">Total confirm: <span class="country__list-bold"> ${el.confirmed}</span></li>
                     <li class="country__list-item">Total deaths: <span class="country__list-bold">${el.deaths}</span></li>
                     <li class="country__list-item">Total recovered:<span class="country__list-bold"> ${el.recovered}</span></li>
                   </ul>
                  </div>          
                </div>       
           </div>`;
  }).join('');
  accordionField = [...document.querySelectorAll('.result__item')];
  accordionField.length > 0 ? accordionField[0].classList.add('_active') : null;
  createAccordionEvents(accordionField);
}


//Check month for parameters from date
function checkMonth(date) {
  let month = new Date(date);
  month = month.getMonth();
  switch (month) {
    case 0: return "January";
    case 1: return "February";
    case 2: return "March";
    case 3: return "April";
    case 4: return "May";
    case 5: return "June";
    case 6: return "July";
    case 7: return "August";
    case 8: return "September";
    case 9: return "October";
    case 10: return "November";
    case 11: return "December";
  }
}

// autocomplete for input
document.querySelector('.needed__location').addEventListener('input', Autocomplete);

function Autocomplete() {
  const search = document.querySelector('.needed__location').value;
  const datalist = document.querySelector('.datalist');

  const reg = new RegExp(`${search}`, 'i');

  if (search.length > 0) {
    datalist.innerHTML = '';

    arr.forEach(el => {

      if (el.search(reg) === 0 && el != search && el.toLowerCase() != search.toLowerCase()) {
          let option = document.createElement("option");
          option.innerText = `${el}`;
          datalist.append(option);
      }
    });
  }
}

// Check the database, find and return the date of inputed country
document.querySelector('button').addEventListener('click', showStatForCheckedCountry);

function showStatForCheckedCountry() {
  const field = document.querySelector('.needed__location');
  let search = field.value;

  search = search.toLowerCase();//try transform input to the data standart


  let validation = formValidation(search);

  if (validation === true) {
    database.forEach(el => {

      clientArr.forEach(element => {
        element.id >= maxid ? maxid = element.id + 1 : null;
      });

      if (el.search == search) {

        clientArr.unshift({
          id: maxid,
          country: el.country,
          newConfirmed: el.newConfirmed,
          newDeaths: el.newDeaths,
          newRecovered: el.newRecovered,
          confirmed: el.confirmed,
          deaths: el.deaths,
          recovered: el.recovered
        });

        clientArr.forEach(element => {
          if (element.country.toLowerCase() == search) {
            let index = clientArr.indexOf(element, 1);
            index != -1 ? clientArr.splice(index, 1) : null;
          }
        });

        clientArr.length >= 3 ? clientArr.splice(3) : null;

        localStorage.setItem('clientArr', JSON.stringify(clientArr));
        renderClientArr();
        field.value = '';
        field.placeholder = '';
      }
    });
    document.querySelector('.input__label').style.opacity = '1';
  } else {
    field.value = '';
    field.placeholder = 'Please enter the correct country';
    document.querySelector('.input__label').style.transition = 'opacity 0s';
    document.querySelector('.input__label').style.opacity = '0';
    setTimeout(returnOpacityLabel, 1000);
  }
}

//Load 1s to return transition to label (input)
function returnOpacityLabel() {
  document.querySelector('.input__label').style.transition = 'opacity 1s';
}

//check if there is an input country in the api return
function formValidation(value) {

  let result = false;
  arr.forEach(el => {

    if (value == el.toLowerCase()) {
      result = true;
    }
  });
  return result;
}

//error message if there is not any reply from api
function errorReq() {
  let test = document.createElement("div");
  document.querySelector('body').append(test);
  test.innerText = "Please try again later";
}


//Create event for each accordion el.
function createAccordionEvents(accordionArr) {
  accordionArr.forEach(el => {
    el.addEventListener('click', accordeon);
  });
}


function accordeon() {
  accordionField.forEach(el => {
    el.classList.remove('_active');
  });
  this.classList.add("_active");
}



document.querySelector('.needed__location').onblur = function () {

  let val = document.querySelector('.needed__location').value;

  val.length > 0 ? document.querySelector('.input__label').style.opacity = '0' : null;
  val.length === 0 && document.querySelector('.needed__location').placeholder == '' ? document.querySelector('.input__label').style.opacity = '1' : null;
};

document.querySelector('.needed__location').onfocus = function () {
  document.querySelector('.input__label').style.opacity = '0';
};