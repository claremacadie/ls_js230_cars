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

    this.$carDiv = document.createElement('div');
    this.$img = document.createElement('img');
    this.$makeAndModel = document.createElement('h2');
    this.$price = document.createElement('p');
    this.$year = document.createElement('p');
    this.$button = document.createElement('button');

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

  init() {
    this.populateHTML();
  }
}

class App {
  constructor(cars) {
    this.carsData = cars;
    this.allCarsObjs = cars.map(car => new Car(car));
    this.filteredCarsObjs = this.allCarsObjs;
    this.filterData = this.createFilterData()

    this.$carsDiv = document.createElement('div');
    this.$filtersForm = document.createElement('form');
    this.$filterButton = document.createElement('button');

    this.init();
    this.bind();
  }

  createFilterData() {
    let data = {};
    let filters = ['make', 'model', 'price', 'year'];

    filters.forEach(filterName => {
      let possibleOptions = new Set();

      this.carsData.forEach(obj => {
        possibleOptions.add(obj[filterName]);
      });

      data[filterName] = [...possibleOptions].sort();
    });

    return data;
  }

  createAnyOptionBox(selectBox) {
    let optionBox = document.createElement('option');
    optionBox.value = 'any';
    optionBox.textContent = 'Any';
    selectBox.append(optionBox);
  }

  createOptionBox(optionName, selectBox) {
    let optionBox = document.createElement('option');
    optionBox.value = optionName;
    optionBox.textContent = optionName;
    selectBox.append(optionBox);
  }

  createSelectionBox(filterName) {
    let label = document.createElement('label');
    label.htmlFor = filterName;
    label.textContent = filterName[0].toUpperCase() + filterName.slice(1);
    let options = this.filterData[filterName];

    let selectBox = document.createElement('select');
    selectBox.id = filterName;
    selectBox.name = filterName;
    this.createAnyOptionBox(selectBox);

    options.forEach(optionName => {
      this.createOptionBox(optionName, selectBox);
    });

    this.$filtersForm.append(label, selectBox);
  }
  
  createFilters() {
    Object.keys(this.filterData).forEach(this.createSelectionBox.bind(this));

    this.$filterButton.type = 'submit';
    this.$filterButton.textContent = 'Filter';
    this.$filtersForm.append(this.$filterButton);
  }

  populateCarsDiv() {
    this.$carsDiv.innerHTML = '';
    this.filteredCarsObjs.forEach(carObj => this.$carsDiv.append(carObj.$carDiv));
  }
  
  init() {
    this.populateCarsDiv();
    this.createFilters();
  }

  getUserSelection() {
    let userSelection= {};

    Object.keys(this.filterData).forEach(filterName => {
      if (this.$filtersForm[filterName].value !== 'any') {
        userSelection[filterName] = this.$filtersForm[filterName].value;
      }
    });

    return userSelection;
  }

  carObjIsSelected(carObj) {
    let flag = true;
    Object.keys(this.userSelection).forEach(filterName => {
      let filterValue = this.userSelection[filterName];
      let carValue = carObj[filterName];
      if (String(filterValue) !== String(carValue)) flag = false;
    });
    return flag;
  }

  updateFilteredCarsObjWithSelection() {
    this.filteredCarsObjs = this.allCarsObjs.filter(carObj => {
      return this.carObjIsSelected(carObj);
    });
  }

  handleFilterButtonClick(event) {
    event.preventDefault();
    
    this.userSelection = this.getUserSelection();
    this.updateFilteredCarsObjWithSelection();
    this.populateCarsDiv();
  }

  bind() {
    this.$filterButton.addEventListener('click', this.handleFilterButtonClick.bind(this));
  }
}

function main(cars) {
  const app = new App(cars);
  document.querySelector('header').append(app.$filtersForm);
  document.querySelector('main').append(app.$carsDiv);
}

document.addEventListener('DOMContentLoaded', () => main(cars));
