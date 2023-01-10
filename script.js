'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-26T17:01:17.194Z',
    '2022-01-08T23:36:17.929Z',
    '2022-01-09T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2022-01-09T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = (date, locale) => {
  const calcdaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcdaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yesterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, `0`);
  // const month = `${date.getMonth() + 1}`.padStart(2, `0`);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};
const formatCur = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: `currency`,
    currency: currency,
  }).format(value);
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${formatCur(
    acc.balance,
    acc.locale,
    acc.currency
  )}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
const startLogOutTimer = () => {
  const tick = () => {
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    // When 0 secound, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    // Decrese 1s
    time--;
  };
  // set time to 5 minutes
  let time = 120;
  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// day/month/year

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, `0`);
    // const month = `${now.getMonth() + 1}`.padStart(2, `0`);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, `0`);
    // const min = `${now.getMinutes()}`.padStart(2, `0`);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    const now = new Date();
    const options = {
      hour: `numeric`,
      minute: `numeric`,
      day: `numeric`,
      month: `numeric`, // numeric, long, 2-digit
      year: `numeric`, // 2-digit, numeric
      // weekday: `long`, // long, short
    };
    // const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      // Update UI
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// console.log(23 === 23.0);

// // Base 10-0 to 9. 1/10 = 0.1. 3/10 = 3.33333
// // Binary base 2 - 0 1
// console.log(0.1 + 0.2);
// console.log(0.1 + 0.2 === 0.3);

// console.log(Number(`23`));
// console.log(+`23`);

// // Parsing
// console.log(Number.parseInt(`30px`, 10));

// // pierw musi byc liczba zeby zadzialalo
// console.log(Number.parseInt(`e30`, 10));

// console.log(Number.parseFloat(`   2.5rem`));
// console.log(Number.parseInt(`  2.5rem`));

// // Check if value is NaN
// console.log(Number.isNaN(20));
// console.log(Number.isNaN(+`20X`));
// console.log(Number.isNaN(23 + 23));

// // Checking if value is number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite(`20`));
// console.log(Number.isFinite(+`20X`));
// console.log(Number.isFinite(20.2));

// console.log(Number.isInteger(23));
// console.log(Number.isInteger(23.5));

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));

// console.log(Math.max(5, 18, 11, 2, 23));

// console.log(Math.min(5, 18, 11, 2, 23));

// console.log(Math.PI * Number.parseFloat(`10px`) ** 2);

// console.log(Math.trunc(Math.random() * 6) + 1);

// // console.log(randomInt(10, 20));

// // console.log(Math.trunc(Math.random() * (6 - 3 + 1) + 3));
// console.log(`======`);
// console.log(Math.trunc(Math.random() * (6 - 3) + 1) + 3);

// const randomInt = (min, max) => {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// };
// console.log(randomInt(20, 30));

// // ROUNDING INTEGERS

// // Zaokraglenie do najlizeszej liczby 0-5 w dol 6-9 w gore
// console.log(Math.round(23.3));
// console.log(Math.round(23.9));

// // Zaokraglenie w gore
// console.log(`ceil`);
// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.9));

// // Zaokraglenie w dol
// console.log(Math.floor(23.3));
// console.log(Math.floor(`23.9`));

// console.log(Math.trunc(-23.9));
// // przy minusowych liczbach zaokraglanie dziala w 2 strone
// console.log(Math.floor(-23.3));

// // ROUNDING decimals
// // to fixed zwraca tez stringa nie liczbe
// // w nawiasnie okreslamy ile licz po przecinsku
// console.log((2.7).toFixed(0)); // 3
// console.log((2.7).toFixed(3)); // 2.700
// console.log(+(2.345).toFixed(2)); // 3.35
// const elo = (2.7).toFixed(0);

// console.log(5 % 2);
// console.log(5 / 2); // 5 = 2 * 2 + 1 <= reminder

// console.log(8 % 3); // 2
// console.log(8 / 3); // 8 = 2 * 3 + 2 <= reminder

// console.log(6 % 2);
// console.log(6 / 2);

// console.log(7 % 2);
// console.log(7 / 2);

// const isEven = n => n % 2 === 0;
// console.log(isEven(8));
// console.log(isEven(23));
// console.log(isEven(514));

// labelBalance.addEventListener(`click`, () => {
//   [...document.querySelectorAll(`.movements__row`)].forEach((row, index) => {
//     if (index % 2 === 0) row.style.backgroundColor = `orangered`;
//     if (index % 3 === 0) row.style.backgroundColor = `blue`;
//   });
// });

//287,460,000,000
// Separatory liczbowe sa po prostu podkresleniami,
// ktore mozemy umiescic w dowolnym miejscu w liczbie
// co sprawi ze bedzie to naprawde latwe do zrozumienia
// i do przeanalizowania tak duzych liczb
// javascript ignoruje je np przy consol logu
// co oznacza ze mozemy je umieszczac gdziekolwiek chcemy
// mozemy go uzywac tylko miedzy liczbami nie przed i na koncu
// const diameter = 287_460_000_000;
// console.log(diameter);

// const price = 345_99;
// console.log(price);

// const transferFee1 = 15_00;
// const transferFee2 = 1_500;

// const PI = 3.1415;
// console.log(PI);

// console.log(parseInt(`230_000`));

// Bit integer mozeb yc uzywany do przechowywania tak duzych liczb jak tylko
// chcemy nie mozemy ich mieszac ze zwyklymi liczbami
// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(2 ** 53 + 1);
// console.log(2 ** 53 + 2);
// console.log(2 ** 53 + 3);
// console.log(2 ** 53 + 4);
// console.log(433333333333333333235412352352135213512351253215123532n);
// console.log(BigInt(433123532));

// // Operations

// console.log(10000n + 10000n);
// console.log(34524325445452345323n * 342534n);

// const huge = 324312341243124123n;
// const num = 23;
// console.log(huge * BigInt(num));

// // Exceptions
// console.log(20n > 15);
// console.log(20n === 20);
// console.log(typeof 20n);
// console.log(20n == 20);

// console.log(huge + ` is REALLY BIG`);

// // Divisions
// console.log(10n / 3n);

// Create a date
//1
// const now = new Date();
// console.log(now);
// //2
// console.log(new Date(`Jan 09 2023 18:42:41`));
// //3
// console.log(new Date(`December 24, 2015`));

// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2037, 10, 31));

// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));

// Working with dates

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear()); // zwraca rok
// console.log(future.getMonth()); // zwraca miesiac
// console.log(future.getDate()); // zwraca dzien
// console.log(future.getHours()); // zwraca godzine
// console.log(future.getMinutes()); // zwraca minuty
// console.log(future.getSeconds()); // zwraca sekundy
// console.log(future.toISOString()); // zwraca ladnie sformatyowany string z data
// console.log(future.getTime()); // milisekundy ktore minaly od 1970
// console.log(new Date(2142253380000));

// console.log(Date.now()); // zwraca milisekundy ktore minely od 1970

// future.setFullYear(2040); // ustawienie roku
// console.log(future);
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future);

// const calcdaysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

// const days1 = calcdaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
// console.log(days1);

// const num = 3884764.23;
// const options = {
//   style: `currency`,
//   unit: `celsius`,
//   currency: `EUR`,
//   // useGrouping: false,
// };

// console.log(`US:     `, new Intl.NumberFormat(`en-US`, options).format(num));
// console.log(`Germany:`, new Intl.NumberFormat(`de-DE`, options).format(num));
// console.log(`Syria:  `, new Intl.NumberFormat(`ar-SY`, options).format(num));
// console.log(
//   navigator.language,
//   new Intl.NumberFormat(navigator.language, options).format(num)
// );

// setTimeout dziala tylko raz po okreslonym czasie,
// mozemy go wykorzystac na wykonanie naszego kodu
// po pewnym moement w przyszlosci przyjmuje 2 argumenty,
// 1 funckja zwrotna callback, 2 argument to czas po ktorym sie wykona w milisekundach
// Kiedy wykonanie naszego kodu osiagnie punkt poczaatkowy to zarejestruje
// funkcja timeout i dopier po 3 sekndach ja wykona
// dlatego kod pod ta funkcja zostanie wywolany od razu a setTimeout po 3 sekundach
// Wszystkie argumenty ktore przykazujemy po opoznieniu beda argumentami funkcji
// trzeci argument ktory przekazalismy stal sie przerwszym argumentem w naszej funkcji
// a 4 stal sie 2

// setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza ${ing1}, ${ing2}`),
//   3000,
//   `olives`,
//   `spinach`
// );
// console.log(`Waiting...`);

// Mozemy faktycznie anulowac limit czasu zani mina 3 sekundy
// const ingredients = [`olives`, `spinach`];

// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza ${ing1}, ${ing2}`),
//   3000,
//   ...ingredients
// );
// console.log(`Waiting...`);
// if (ingredients.includes(`spinach`)) clearTimeout(pizzaTimer);

// setInterval dziala dopoki go nie zatrzymamy np co 5 minut.
// setInterval(() => {
//   const now = new Date();
//   const hour = now.getHours();
//   const min = now.getMinutes();
//   const sec = now.getSeconds();
//   return console.log(`${hour}:${min}:${sec}`);
// }, 1000);
