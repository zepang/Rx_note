## 写 React 或者 Vue 项目时为什么要在列表组件中写 key，其作用是什么？

在回答这个问题之前你首先需要去仔细阅读一下Vue diff 的代码 [patch.js](https://github.com/vuejs/vue/blob/dev/src/core/vdom/patch.js#L424)，这里仅贴出主要的代码：

```js
// ...
function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

// ...

function patchVnode (
  oldVnode,
  vnode,
  insertedVnodeQueue,
  ownerArray,
  index,
  removeOnly
) {
  if (oldVnode === vnode) {
    return
  }

  if (isDef(vnode.elm) && isDef(ownerArray)) {
    // clone reused vnode
    vnode = ownerArray[index] = cloneVNode(vnode)
  }

  const elm = vnode.elm = oldVnode.elm

  if (isTrue(oldVnode.isAsyncPlaceholder)) {
    if (isDef(vnode.asyncFactory.resolved)) {
      hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
    } else {
      vnode.isAsyncPlaceholder = true
    }
    return
  }

  // reuse element for static trees.
  // note we only do this if the vnode is cloned -
  // if the new node is not cloned it means the render functions have been
  // reset by the hot-reload-api and we need to do a proper re-render.
  if (isTrue(vnode.isStatic) &&
    isTrue(oldVnode.isStatic) &&
    vnode.key === oldVnode.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
  ) {
    vnode.componentInstance = oldVnode.componentInstance
    return
  }

  let i
  const data = vnode.data
  if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
    i(oldVnode, vnode)
  }

  const oldCh = oldVnode.children
  const ch = vnode.children
  if (isDef(data) && isPatchable(vnode)) {
    for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
    if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
  }
  if (isUndef(vnode.text)) {
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
    } else if (isDef(ch)) {
      if (process.env.NODE_ENV !== 'production') {
        checkDuplicateKeys(ch)
      }
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    } else if (isDef(oldCh)) {
      removeVnodes(oldCh, 0, oldCh.length - 1)
    } else if (isDef(oldVnode.text)) {
      nodeOps.setTextContent(elm, '')
    }
  } else if (oldVnode.text !== vnode.text) {
    nodeOps.setTextContent(elm, vnode.text)
  }
  if (isDef(data)) {
    if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
  }
}

// ...

function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    const canMove = !removeOnly

    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(newCh)
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        } else {
          vnodeToMove = oldCh[idxInOld]
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
            oldCh[idxInOld] = undefined
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
          }
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(oldCh, oldStartIdx, oldEndIdx)
    }
  }

```

### diff算法

![](./diff.png)

Vue 的diff算法是通过**同层的树节点进行比较而非对树进行逐层搜索遍历的方式**，所以时间复杂度只有O(n)，是一种相当高效的算法。React的算法应该也是类似的原理，因为我目前还没有度过react这方面的内容，所以不太确定。

接下来我们来解释一下上边的贴出的重要代码：

这里先抛开是通过怎么样的顺序从新旧节点集合来取需要比较新旧节点，当两个节点进行比较时，首先是通过`sameVnode`函数进行判断节点是否相同，`key`作为判断的优先条件，如果`key`不一样则直接认为节点不一样，然后接着之后的diff逻辑往下走。

根据上边的`updateChildren`的比较逻辑我们可以看出新旧节点的一个diff顺序，将新旧节点集合的首尾分别对应diff并且交叉diff，然后从旧节点集合中寻找与新节点首节点相同的节点，有则继续进行diff，没有则认为是新加节点，进而创建新节点。

下边是结合代码对上面的描述：

通过`createKeyToOldIdx`创建一个就节点 `key` 和 就节点索引的 `map` 数据结构，如果新节点的`key`存在且不为`undefined`，在`map`中进行查找与新节点相同的就节点索引，否则通过`findIdxInOld`以遍历方式返回索引。如果存在索引则进行新旧节点比较，否则直接创建新的节点。

接下来所说`patchVnode`，在sameVnode节点相同的时候则会进入`patchVnode`，实际上主要还是用来比较新旧节点子节点，进而判断如何更新节点的子节点。如果是文本节点且内容不一样则进行替换，否则进行子节点的比较。

### key的作用

通过上面的描述我们可以发现key是用来判断两个节点是否相同的条件之一。

如果不设置key的情况下，也就是key为undefined，对于渲染列表来讲，则直接进入patchVnode，不需要进行后续的diff，复用当前的节点，只对节点内的子节点进行diff。如果设置key，key相同的情况，比如将key设置为列表索引（index），结果上和前面一样；如果key不相同，除了要进行后续的diff判断，还需要对旧节点集合进行插入或者删减节点，会直接影响到整个当前节点包括其子节点。

关于两者的优劣，不设置key，优点是可以提高页面渲染的速度，因为刚才的也说了，当前节点会进行复用，仅有可能影响节点的子节点；缺点就是会保留当前节点的状态。比如标签页下有两个tab分别有一个列表，不带key属性下，在第一个tab页面中选择列表的第一项，切换到第二个tab页面，你会发现第一项也是选中的。

通过设置**唯一的key**（不能是列表索引index），可以让tab在切换的时候进行整个节点的更新，避免节点的复用导致状态保留的问题。至于刚才说到的速度问题，虽然不设置key的情况下页面渲染节点速度有提升，这个前提是列表的数量比较大，一般的列表渲染，这点速度差距可以忽略不记。


