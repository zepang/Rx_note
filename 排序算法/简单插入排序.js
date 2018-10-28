// 简单插入排序，起始的下标必须大于 1 ，通过与当前元素与前一个元素进行比较，当前一个月元素大于当前的元素，将前一个元素替换当前元素，
function insertionSort(array) {
  console.time('插入排序耗时')
  for (var i = 1; i < array.length; i++) {
    var key = array[i]
    var j = i - 1
    while (array[j] > key) {
      array[j + 1] = array[j]
      j--
    }
    array[j + 1] = key
    console.log(arr)
  }
  console.timeEnd('插入排序耗时')
  return array
}

// 二分插入排序法
function binaryInsertionSort(array) {
  console.time('二分插入排序耗时：');
  for (var i = 1; i < array.length; i++) {
    var key = array[i], left = 0, right = i - 1;
    while (left <= right) {
      var middle = parseInt((left + right) / 2);
      if (key < array[middle]) {
        right = middle - 1;
      } else {
        left = middle + 1;
      }
    }
    for (var j = i - 1; j >= left; j--) {
      array[j + 1] = array[j];
    }
    array[left] = key;
  }
  console.timeEnd('二分插入排序耗时：');
  return array;
}

// function insertionSort1(array) {
//   console.time('插入排序耗时：');
//   for (var i = 1; i < array.length; i++) {
//     var key = array[i];
//     var j = i - 1;
//     while (array[j] > key) {
//       array[j + 1] = array[j];
//       j--;
//     }
//     array[j + 1] = key;
//   }
//   console.timeEnd('插入排序耗时：');
//   return array;
// }

var arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48]
insertionSort(arr)