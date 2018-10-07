/**
 * 选择排序
 * 假设当前最小，内层循环寻找比当前小的然后换位置，
 */
function selectionSort (arr) {
  var len = arr.length
  var i, j, minIndex, tmp
  for (i = 0; i < len; i++) {
    minIndex = i
    for (j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    tmp = arr[i]
    arr[i] = arr[minIndex]
    arr[minIndex] = tmp
  }

  return arr
}