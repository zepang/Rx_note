class PopUpInfo extends HTMLElement {
  constructor () {
    super()
    const shadow = this.attachShadow({ mode: open })

    const wrapper = document.createElement('span')
    wrapper.setAttribute('class', 'wapper')

    const icon = document.createElement('span')
    icon.setAttribute('class', 'icon')
    icon.setAttribute('tabIndex', 0)

    const info = document.createElement('span')
    info.setAttribute('class', 'info')

    const text = this.getAttribute('data-text')
    info.textContent = text

    let img = document.createElement('img')
    if (this.hasAttribute('img')) {
      imgUrl = this.getAttribute('img')
    } else {
      umgUrl = 'img/default.png'
    }

    const img = document.createElement('img')
    img.src = imgUrl
    icon.appendChild(img)

    style.textContent = `
      .wrapper {
        position: relative;
      }

      .info {
        font-size: 0.8rem;
        width: 200px;
        display: inline-block;
        border: 1px solid black;
        padding: 10px;
        background: white;
        opacity: 0;
        transition: 0.6s all;
        position: absolute;
        bottom: 20px;
        left: 10px;
        z-index: 3;
      }

      img {
        width: 1.2rem;
      }

      .icon:hover + .info, .icon:focus + .info {
        opacity: 1;
      }
    `
    shadow.appendChild(style)
    shadow.appendChild(wrapper)
    wrapper.appendChild(icon)
    wrapper.appendChild(info)
  }
}

customElements.define('popup-info', PopUpInfo)