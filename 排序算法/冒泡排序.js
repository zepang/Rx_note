/**
 * 普通版冒泡排序
 * 两层循环，里层从下标 0 开始比较当前和后一个的大小，
 * 当前大于后一个互换位置之后再和后一个比较，直到最后，
 * 基本就是将大的数位移到后面。然后重复 length 次就能完全排完整个数组。
 */ 

function bubbleSort (arr) {
  var len = arr.length
  var i, j

  for (i = 0; i < len; i++) {
    for (j = 0; j < len - i; j++) {
      if (arr[j+1] < arr[j]) {
        var tmp = arr[j]
        arr[j] = arr[j+1]
        arr[j+1] = tmp
      }
    }
  }

  return arr
}

/**
 * 升级版冒泡排序
 * 冒泡排序会将大的往后移，第一次是最大的移到最后，第二次将第二大的移到倒数第二个位置，那么下一次比较的话，就不需要比较后最后两个了。
 * 升级版冒泡排序主要就是记录了上次交换元素的下标，每次只要比较到上次交换位置的元素就好了，减少了循环次数
 */

function bubbelSort (arr) {
  var i = arr.length - 1
  var j
  while (i < 0) {
    var pos = 0
    for (j = 0; j < i; j++) {
      if (arr[j] > arr[j+1]) {
        var tmp = arr[j]
        arr[j]=arr[j+1]
        arr[j+1]=tmp
        // 记录交换的位置
        pos = j
      }
    }
    i = pos
  }
  return arr
}
