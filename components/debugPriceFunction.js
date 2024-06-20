function findCombinationWithMultipleNumbers(array, targetSum) {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      for (let k = j + 1; k < array.length; k++) {
        if (array[i] + array[j] + array[k] === targetSum) {
          return [array[i], array[j], array[k]];
        }
      }
    }
  }
  return null;
}

const numbers = [
  220, 315, 132, 170, 294, 45, 135, 183, 267, 331, 325, 650, 162, 210, 358,
];
const targetSum = 582;

const result = findCombinationWithMultipleNumbers(numbers, targetSum);

if (result) {
  //   console.log(
  //     `A combination that adds up to ${targetSum} is found: [${result.join(
  //       ", "
  //     )}]`
  //   );
} else {
  //console.log(`No combination found that adds up to ${targetSum}.`);
}
