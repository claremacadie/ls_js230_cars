const cars = [
  { make: 'Honda', image: 'https://d1nrfq3cstnmkv.cloudfront.net/exercises/gui_apps/car_shop_filtering/images/honda-accord-2005.jpg', model: 'Accord', year: 2005, price: 7000 },
  { make: 'Honda', image: 'https://d1nrfq3cstnmkv.cloudfront.net/exercises/gui_apps/car_shop_filtering/images/honda-accord-2008.jpg', model: 'Accord', year: 2008, price: 11000 },
  { make: 'Toyota', image: 'https://d1nrfq3cstnmkv.cloudfront.net/exercises/gui_apps/car_shop_filtering/images/toyota-camry-2009.jpg', model: 'Camry', year: 2009, price: 12500 },
  { make: 'Toyota', image: 'https://d1nrfq3cstnmkv.cloudfront.net/exercises/gui_apps/car_shop_filtering/images/toyota-corrolla-2016.jpg', model: 'Corolla', year: 2016, price: 15000 },
  { make: 'Suzuki', image: 'https://d1nrfq3cstnmkv.cloudfront.net/exercises/gui_apps/car_shop_filtering/images/suzuki-swift-2014.jpg', model: 'Swift', year: 2014, price: 9000 },
  { make: 'Audi', image: 'https://d1nrfq3cstnmkv.cloudfront.net/exercises/gui_apps/car_shop_filtering/images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 25000 },
  { make: 'Audi', image: 'https://d1nrfq3cstnmkv.cloudfront.net/exercises/gui_apps/car_shop_filtering/images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 26000 },
];

class Car {
  constructor({ make, image, model, year, price}) {
    this.make = make;
    this.image = image;
    this.model = model;
    this.year = year;
    this.price = price;

    this.init();
  }

  populateHTML() {
    this.$img.src = this.image;
    this.$makeAndModel.textContent = `${this.make} ${this.model}`;
    this.$year.textContent = `Year: ${this.year}`;
    this.$price.textContent = `Price: $${this.price}`;
    this.$button.textContent = 'Buy';
    this.$button.type = 'submit';

    this.$carDiv.classList.add('car-div');
    this.$carDiv.append(this.$img, this.$makeAndModel, this.$year, this.$price, this.$button);
  }

  isSelected(userSelection) {
    return Object.keys(userSelection).every(filterName => {
      let filterValue = userSelection[filterName];
      let carValue = this[filterName];
      return String(filterValue) == String(carValue);
    });
  }

  init() {
    this.$carDiv = document.createElement('div');
    this.$img = document.createElement('img');
    this.$makeAndModel = document.createElement('h2');
    this.$price = document.createElement('p');
    this.$year = document.createElement('p');
    this.$button = document.createElement('button');
    this.populateHTML();
  }
}

class FilterForm {
  constructor(appObj) {
    this.appObj = appObj;
    this.filterData = this.createFilterData();

    this.init();
  }

  createFilterData() {
    let data = {};
    let filters = ['make', 'model', 'price', 'year'];

    filters.forEach(filterName => {
      let possibleOptions = new Set();

      this.appObj.carsData.forEach(obj => {
        possibleOptions.add(obj[filterName]);
      });

      data[filterName] = [...possibleOptions].sort();
    });

    return data;
  }

  createOptionBox(optionName, selectBox) {
    let optionBox = document.createElement('option');
    optionBox.value = optionName;
    optionBox.textContent = optionName;
    selectBox.append(optionBox);
  }

  addOptions(selectBox, filterName) {
    selectBox.innerHTML = '';
    let options = this.filterData[filterName];

    this.createOptionBox('Any', selectBox);
    options.forEach(optionName => {
      this.createOptionBox(optionName, selectBox);
    });
  }

  createSelectionBox(filterName) {
    let label = document.createElement('label');
    label.htmlFor = filterName;
    label.textContent = filterName[0].toUpperCase() + filterName.slice(1);

    let selectBox = document.createElement('select');
    selectBox.id = filterName;
    selectBox.name = filterName;

    this.addOptions(selectBox, filterName);

    this.$form.append(label, selectBox);
  }

  createFilters() {
    Object.keys(this.filterData).forEach(this.createSelectionBox.bind(this));

    this.$filterButton.type = 'submit';
    this.$filterButton.textContent = 'Filter';
    this.$form.append(this.$filterButton);
  }

  getUserSelection() {
    let userSelection = {};

    Object.keys(this.filterData).forEach(filterName => {
      if (this.$form[filterName].value !== 'Any') {
        userSelection[filterName] = this.$form[filterName].value;
      }
    });

    return userSelection;
  }

  init() {
    this.$form = document.createElement('form');
    this.$filterButton = document.createElement('button');

    this.createFilters();
  }
}

class App {
  constructor(cars) {
    this.carsData = cars;
    this.allCarsObjs = cars.map(car => new Car(car));
    this.filteredCarsObjs = this.allCarsObjs;
    this.filterFormObj = new FilterForm(this);

    this.init();
    this.bind();
  }

  populateCarsDiv() {
    this.$carsDiv.innerHTML = '';
    this.filteredCarsObjs.forEach(carObj => this.$carsDiv.append(carObj.$carDiv));
  }

  applyFilters() {
    this.filteredCarsObjs = this.allCarsObjs.filter(carObj => {
      return carObj.isSelected(this.userSelection);
    });
  }

  handleFilterButtonClick(event) {
    event.preventDefault();
    
    this.userSelection = this.filterFormObj.getUserSelection();
    this.applyFilters();
    this.populateCarsDiv();
  }
  
  init() {
    this.$carsDiv = document.createElement('div');
    this.populateCarsDiv();
  }

  bind() {
    this.filterFormObj.$filterButton.addEventListener('click', this.handleFilterButtonClick.bind(this));
  }
}

function main(cars) {
  const app = new App(cars);
  document.querySelector('header').append(app.filterFormObj.$form);
  document.querySelector('main').append(app.$carsDiv);
}

document.addEventListener('DOMContentLoaded', () => main(cars));
