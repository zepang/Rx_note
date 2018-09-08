# css3 选择器

| demo | 说明 |
|----------- |----------------------------- |
| a[src^=http] | 选择src属性值以http开头的元素 |
| a[src$=http] | 选择src属性值以http结尾的元素 |
| a[src*=http] | 选择src属性值包含http的元素 |
| p:first-of-type | 选择p元素是其父级的第一个p元素 |
| p:last-of-type | 选择p元素是其父级的最后一个p元素 |
| p:only-of-type | 选择p元素是其父级的唯一一个p元素 |
| p:only-child | 选择p元素是其父级的唯一一个元素 |
| p:nth-child(2) | 选择p元素是其父级的第二个子元素 |

## nth-child(n) 和 nth-of-type(n) 的区别

* .parant el:nth-child(2): 选择父元素下的第二个子元素
* .parant el:nth-of-type(2): 选择父元素下的第二个el元素

若果不指明el:
* .parent :nth-child(2): 还是选择父元素下的第二个子元素
* .parent :nth-of-type(2): 父元素下的所有类别元素的第二个元素