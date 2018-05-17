//Variables
const form = document.getElementById('request-quote');
const html = new HTMLUI();




//Add Listeners
eventListeners();

function eventListeners(){
    document.addEventListener("DOMContentLoaded",function(){
       //Display years
       html.displayYears();
    });

    form.addEventListener("submit",function(e){
      e.preventDefault();
      //Read value from FORM
      const make = document.getElementById('make').value;
      const year = document.getElementById('year').value;
      //READ value for radio
      const level = document.querySelector('input[name="level"]:checked').value;

      if (make === '' || year === '' || level === ''){
        html.displayError('All Fields are mandatory');
      }else{
        html.removeElementChildren();
        const insurance = new Insurance(make,year,level);
        const price     = insurance.calculateQuotation(insurance);
        html.showResults(price,insurance);
      }

    })

}


//Objects

//Insurance

function Insurance(make,year,level){
 this.make = make;
 this.year = year;
 this.level=level;
}

Insurance.prototype.calculateQuotation = function (insurance) {
  let price;
  const base = 2000;
  //get Type
  const make = insurance.make;
  /*
   1- American 15 %
  2-  Asian   5 %
   3- European 35 %
  */
  switch (make) {
    case '1':
      price = base * 1.15;
      break;
    case '2':
      price = base * 1.05;
      break;
    case '3':
      price = base * 1.35;
      break;
  }
  //get year
  const year        = insurance.year;
  //Get Year difference
  const difference  = this.getYearDifference(year);
  //Each year the cost of the insurance is going to be 3% cheaper
  price = price - ((difference *3)*price) / 100;
  //get level of protection
  const level = insurance.level;
  price       = this.calculateLevel(price,level);

  return price;
};

//Return difference between the year
Insurance.prototype.getYearDifference = function (year) {
  return new Date().getFullYear() - year;
};

Insurance.prototype.calculateLevel = function (price,level) {

  /*
    Basic insurance is going to inscrease the value of 30 %
    Complete insurance is going to inscrease the value of 50 %
  */

  if (level === 'basic'){
    price = price * 1.30;
  }else{
    price = price * 1.50;
  }
  return price;
};

Insurance.prototype.getMakeValue = function (make) {
   switch (make) {
     case '1':
       make = "American";
       break;
     case '2':
       make = "Asian";
       break;
     case '3':
       make = "European";
       break;
   }
   return make;
};





function HTMLUI(){}

HTMLUI.prototype.displayYears = function () {
   const max = new Date().getFullYear(),
        min  = max - 20;
  const years = document.getElementById('year');
  for (i = max; i > min; i--){
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    years.appendChild(option)
  }
};

HTMLUI.prototype.displayError = function (message) {
  const div = document.createElement('div');
  div.classList = "error";
  div.innerText = message;
  form.insertBefore(div,document.querySelector(".form-group"));

  setTimeout(function(){div.remove()},3000)
};

HTMLUI.prototype.showResults = function (price,insurance) {
  const result = document.getElementById("result");
  const div    = document.createElement('div');

  let make     = insurance.getMakeValue(insurance.make);

  div.innerHTML = `
  <p class='header'>Summary <p/>
  <p>Make : ${make} <p/>
  <p>Year : ${insurance.year} <p/>
  <p>Level: ${insurance.level} <p/>
  <p class='total'>Total :  ${price} <p/>
  `
  const spinner = document.querySelector("#loading img");
  spinner.style.display = 'block';
  setTimeout(function(){
    spinner.style.display = 'none';
    result.appendChild(div);
  },3000);


};

HTMLUI.prototype.removeElementChildren = function () {

  const prev = document.querySelector("#result div");

  if (prev != null){
    prev.remove();
  }

};
