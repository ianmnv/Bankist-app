'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

// CREATING DOM ELEMENTS

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);

//THE REDUCE METHOD -- DISPLAYING BALANCE

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

// calcDisplayBalance(account1.movements);

// THE MAGIC OF CHANING METHODS

// €

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(move => move > 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumIn.textContent = `${income}€`;

  const out = acc.movements
    .filter(move => move < 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(move => move > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
}; // calcDisplaySummary(account1.movements);

// COMPUTING USERNAMES

function createUserNames(accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
}

createUserNames(accounts);
// console.log(accounts);

const updateUI = function (acc) {
  // Display Movements
  displayMovements(acc.movements);
  // Display Balance
  calcDisplayBalance(acc);
  // Display Summary
  calcDisplaySummary(acc);
};

// EVENT HANDLERS

// IMPLEMENTING LOGIN

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  console.log('LOGIN');

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);

    console.log(`You're loged in ${currentAccount.owner}`);
  }
});

// IMPLEMENTING TRANSFERS

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  // inputTransferTo.blur();
  inputTransferAmount.blur();

  if (
    amount > 5 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  } else {
    console.log('Not valid transfer');
  }
});

// SOME AND EVERY METHODS

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(move => move >= amount * 0.1)
  ) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );

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
  console.log(sorted);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// Simple array methods
/*
let arr = ['a', 'b', 'c', 'd', 'e'];

// Slice method
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));

console.log(arr.slice());
console.log([...arr]);

// Splice
// console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 3);
console.log(arr);

// Reverse
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

// Concat
const letters = arr.concat(arr2);
console.log(letters);
console.log(arr);
console.log(arr2);
console.log([...arr, ...arr2]);

// Join
console.log(letters.join(' - '));

/////////////////////////////////////////////////////////
// The new at method
const arr3 = [11, 45, 82];
console.log(arr3[0]);
console.log(arr3.at(0));

// Getting last array element
console.log(arr3[arr3.length - 1]);
console.log(arr3.slice(-1)[0]);
console.log(arr3.at(-1));

console.log('Michel'.at(0));
console.log('Michel'.at(-1));
*/
/////////////////////////////////////////////////////////
/*
// Looping arrays: forEach

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited $${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew $${Math.abs(movement)}`);
  }
}

console.log('--forEach--');
// movements.forEach(function (movement) {
movements.forEach(function (move, i, arr) {
  if (move > 0) {
    console.log(`Movement ${i + 1}: You deposited ${move}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew $${Math.abs(move)}`);
  }
});

/////////////////////////////////////////////////////
// FOREACH WITH MAPS AND SETS

// MAPs
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

const currenciesUnique = new Set(['USD', 'USD', 'EUR', 'GBP', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});
*/
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
// CODING CHALLENGE #1
/* Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners
about their dog's age, and stored the data into an array (one array for each). For
now, they are just interested in knowing whether a dog is an adult or a puppy.
A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years
old.
Your tasks:
Create a function 'checkDogs', which accepts 2 arrays of dog's ages
('dogsJulia' and 'dogsKate'), and does the following things:
1. Julia found out that the owners of the first and the last two dogs actually have
cats, not dogs! So create a shallow copy of Julia's array, and remove the cat
ages from that copied array (because it's a bad practice to mutate function
parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1
is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy
�
")
4. Run the function for both test datasets
Test data:
§ Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
§ Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4] */
/*
const julia1 = [3, 5, 2, 12, 7];
const kate1 = [4, 1, 15, 8, 3];

const julia2 = [9, 16, 6, 8, 3];
const kate2 = [10, 5, 6, 1, 4];

const checkDogs = function (arr1, arr2) {
  const checkArr1 = [...arr1];
  checkArr1.pop() && checkArr1.shift() && checkArr1.pop();

  const newArr = [...checkArr1, ...arr2];
  newArr.forEach(function (age, i) {
    const puppyOrNot = newArr[i] > 3 ? 'is an adult' : 'is still a puppy';
    console.log(`Dog number ${i + 1} ${puppyOrNot}, and is ${age} years old`);
  });
};

checkDogs(julia1, kate1);
*/

// CODING CHALLENGE #2
/* Let's go back to Julia and Kate's study about dogs. This time, they want to convert
dog ages to human ages and calculate the average age of the dogs in their study.

Your tasks:

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's
ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is
<= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old,
humanAge = 16 + dogAge * 4

2. Exclude all dogs that are less than 18 human years old (which is the same as
keeping dogs that are at least 18 years old)

3. Calculate the average human age of all adult dogs (you should already know
from other challenges how we calculate averages �)

4. Run the function for both test datasets

Test data:
§ Data 1: [5, 2, 4, 1, 15, 8, 3]
§ Data 2: [16, 6, 10, 5, 6, 1, 4]
*/

// const calcAverageHumanAge = function (ages) {
//   // PROBLEM 1
//   // My solution
//   // const humanAge = ages.map(function (age) {
//   //   if (age <= 2) {
//   //     return age * 2;
//   //   } else if (age > 2) {
//   //     return 16 + age * 4;
//   //   }
//   // });

//   // Jonas Solution
//   const humanAge = ages.map(age => (age <= 2 ? age * 2 : 16 + age * 4));
//   console.log(humanAge);

//   // PROBLEM 2
//   const excludedDogs = humanAge.filter(exclude => exclude >= 18);
//   console.log(excludedDogs);

//   // PROBLEM 3
//   const avgAge = excludedDogs.reduce(function (acc, dogAge) {
//     return acc + dogAge / excludedDogs.length;
//   }, 0);
//   // --OR--
//   const avgAge2 =
//     excludedDogs.reduce((acc, dogAge) => acc + dogAge, 0) / excludedDogs.length;

//   console.log(avgAge);
//   console.log(avgAge2);
// };

// // PROBLEM 4
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

/*
// THE MAP METHOD
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1; // 1 Euro is 1.1 USD

// const movementsUSD = movements.map(function (move) {
//   return move * eurToUsd;
// });

// Challenge: function to arrow function
const movementsUSD = movements.map(move => move * eurToUsd);

console.log(movements);
console.log(movementsUSD);

const moveDescription = movements.map(
  (move, i, arr) =>
    `Movement ${i + 1}: You ${move > 0 ? 'deposited' : 'withdrew'} $${Math.abs(
      move
    )}`
);
console.log(moveDescription);
*/
/*
// THE FILTER METHOD

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);

const deposits = movements.filter(move => move > 0);
console.log(deposits);

const withdrawals = movements.filter(move => move < 0);
console.log(withdrawals);

// THE REDUCE METHOD
const balance = movements.reduce(function (acc, mov, i, arr) {
  console.log(`Iteration ${i}: ${acc}`);
  return acc + mov;
}, 0);

console.log(balance);

const max = movements.reduce((acc, move) => {
  if (acc > move) return acc;
  else return move;
}, movements[0]);
console.log(max);
*/
/*
// THE MAGIC OF CHAINING METHODS

const euroToUSD = 1.1;

const totalDepositsUSD = movements
  .filter(move => move > 0)
  .map(move => move * euroToUSD)
  .reduce((acc, move) => acc + move, 0);

console.log(totalDepositsUSD);

// CODING CHALLENGE 3
// Rewrite the 'calcAverageHumanAge' function from Challenge #2, but this time
// as an arrow function, and using chaining!
// Test data:
// § Data 1: [5, 2, 4, 1, 15, 8, 3]
// § Data 2: [16, 6, 10, 5, 6, 1, 4]

const calcAverageHumanAge = ages =>
  ages
    .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
    .filter(exclude => exclude >= 18)
    .reduce((acc, dogAge, i, arr) => acc + dogAge / arr.length, 0);

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// THE FIND METHOD

const firstWithdrawl = movements.find(move => move < 0);
console.log(movements);
console.log(firstWithdrawl);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
*/

// SOME AND EVERY METHOD

// SOME
/*
console.log(movements);

console.log(movements.includes(-130));

console.log(movements.some(mov => mov >= 3000));

// EVERY

console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));
*/

// FLAT AND FLATMAP
/*
const arr = [[1, 2, 3], [4, 5, 6], 7];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7];
console.log(arrDeep.flat());
console.log(arrDeep.flat(2));

// const accountsMove = accounts.map(allMov => allMov.movements);
// console.log(accountsMove);
// const allMovements = accountsMove.flat();
// console.log(allMovements);
// const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

// flat
const overalBalance = accounts
  .map(allMov => allMov.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(overalBalance);

// flatMap
const overalBalance2 = accounts
  .flatMap(allMov => allMov.movements)
  .reduce((acc, mov) => acc + mov, 0);

console.log(overalBalance2);
*/

// SORTING ARRAYS
/*
//Strings
const owners = ['Sara', 'James', 'Connor', 'Ian', 'Sara', 'Anna', 'Karen'];
console.log(owners);

console.log(owners.sort());
console.log(owners);

// Numbers

// [200, 450, -400, 3000, -650, -130, 70, 1300]
console.log('original array', movements);

// Ascending order
// return < 0  =  A, B (keep order)
// return > 0  = B, A (switch order)
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
movements.sort((a, b) => a - b);
console.log('ascending order', movements);

// Descending order
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
movements.sort((a, b) => b - a);
console.log('descending order', movements);
*/

// MORE WAYS OF CREATING AND FILLING ARRAYS
/*
const x = new Array(7);

x.fill(1, 3, 5);

console.log(x);

const arr = [1, 2, 3, 4, 5, 6, 7];

arr.fill(23, 3, 6);

console.log(arr);

// Array.from
const y = Array.from({ length: 7 }, () => 2);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

const random = Array.from(
  { length: 10 },
  () => Math.trunc(Math.random() * 6) + 1
);
console.log(random);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );

  console.log(movementsUI);
});
*/

///////////
// Array methods practice
/*
// 1.
const bankDepositsSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);

console.log(bankDepositsSum);

// 2. How many deposits there has been that are equal or greater than 1000
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

// - OR -

// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
// console.log(numDeposits1000);

// - OR -

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(numDeposits1000);

// Thanks to the prefixed ++ operator
let a = 10;
console.log(++a);
console.log(a);

// 3.
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (obj, sum) => {
      // sum > 0 ? (obj.deposits += sum) : (obj.withdrawals += sum);
      obj[sum > 0 ? 'deposits' : 'withdrawals'] += sum;
      return obj;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

// 4. Capitalize all words except some excluded ones
const capitalizetitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = [
    'a',
    'an',
    'and',
    'the',
    'but',
    'or',
    'on',
    'in',
    'with',
    'is',
  ];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');

  return capitalize(titleCase);
};

console.log(capitalizetitleCase('the great example for a title'));
console.log(
  capitalizetitleCase('this is ANOTHER title or that is WHAT I think')
);
console.log(capitalizetitleCase('And another GREAT AND amazing title ON JS'));
*/

/////////////
// CODING CHALLENGE 4
// Julia and Kate are still studying dogs, and this time they are studying if dogs are
// eating too much or too little.
// Eating too much means the dog's current food portion is larger than the
// recommended portion, and eating too little is the opposite.

// Test data:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 3.
const ownersEatTooMuch = [];
const ownersEatTooLittle = [];

// 7.
const eatingOk = [];

// Test data:
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// Your tasks:

dogs.forEach(dog => {
  // 1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate
  // the recommended food portion and add it to the object as a new property. Do
  // not create a new array, simply loop over the array. Forumla:
  // recommendedFood = weight ** 0.75 * 28. (The result is in grams of
  // food, and the weight needs to be in kg)
  dog.recFoodPor = dog.weight ** 0.75 * 28;
  // 2. Find Sarah's dog and log to the console whether it's eating too much or too
  // little. Hint: Some dogs have multiple owners, so you first need to find Sarah in
  // the owners array, and so this one is a bit tricky (on purpose) 🤓

  if (dog.owners.find(owner => owner === 'Sarah')) {
    console.log(
      `The dog is eating too ${
        dog.curFood > dog.recFoodPor ? 'much' : 'little'
      }`,
      dog
    );
  }
  // 3. Create an array containing all owners of dogs who eat too much
  // ('ownersEatTooMuch') and an array with all owners of dogs who eat too little
  // ('ownersEatTooLittle').
  if (dog.curFood > dog.recFoodPor) {
    ownersEatTooMuch.push(dog.owners);
  } else {
    ownersEatTooLittle.push(dog.owners);
  }

  if (dog.curFood > dog.recFoodPor * 0.9 && dog.curFood < dog.recFoodPor * 1.01)
    console.log(dog);

  // 5. Log to the console whether there is any dog eating exactly the amount of food
  // that is recommended (just true or false)
  // console.log(dog.recFoodPor === dog.curFood ? true : false);

  // 7. Create an array containing the dogs that are eating an okay amount of food (try
  // to reuse the condition used in 6.)
  if (dog.curFood > dog.recFoodPor * 0.9 && dog.curFood < dog.recFoodPor * 1.01)
    eatingOk.push(dog);
});
console.log(eatingOk);

console.log(ownersEatTooMuch.flat());
console.log(ownersEatTooLittle.flat());

// 4. Log a string to the console for each array created in 3., like this: "Matilda and
// Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat
// too little!"
console.log(ownersEatTooMuch.flat().join(' & ') + `'s dogs eat too much`);
console.log(ownersEatTooLittle.flat().join(' & ') + `'s dogs eat too little`);

// 5. OR
console.log(dogs.some(food => food.recFoodPor === food.curFood));

// 6. Log to the console whether there is any dog eating an okay amount of food
// (just true or false)
// Eating an okay amount means the dog's current food portion is within a range 10%
// above and 10% below the recommended portion (see hint).
console.log(
  dogs.some(
    dog =>
      dog.curFood > dog.recFoodPor * 0.9 && dog.curFood < dog.recFoodPor * 1.01
  )
);

// 8. Create a shallow copy of the 'dogs' array and sort it by recommended food
// portion in an ascending order (keep in mind that the portions are inside the
// array's objects 😉)
const arrDog = [];
const shallowdogs = dogs.slice();
shallowdogs.forEach(copyDog => {
  arrDog.push(copyDog.recFoodPor);
});
arrDog.sort((a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
});
console.log(arrDog);

// Hints:
// § Use many different tools to solve these challenges, you can use the summary
// lecture to choose between them 😉
// § Being within a range 10% above and below the recommended portion means:
// current > (recommended * 0.90) && current < (recommended *
// 1.10). Basically, the current portion should be between 90% and 110% of the
// recommended portion.
