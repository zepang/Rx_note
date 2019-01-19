class WordCount extends HTMLParagraphElement {
  constructor () {
    super()
    console.dir(this)
    const wcParent = this.parentNode

    function countWords (node) {
      const text = node.innerText || node.textContent
      return text.split(/\s+/g).length
    }

    const count = `Words: ${countWords(wcParent)}`

    const shadow = this.attachShadow({mode: 'open'})

    const text = document.createElement('span')
    text.textContent = count
    shadow.appendChild(text)

    setInterval(() => {
      const count = `Words: ${countWords(wcParent)}`
      text.textContent = count
    }, 200)
  }
}

customElements.define('word-count', WordCount, { extends: 'p' })