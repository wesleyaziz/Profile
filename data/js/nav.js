document.addEventListener('DOMContentLoaded', () => {
  const aside= document.querySelector('aside')
  const navItems = document.querySelectorAll('aside ul.nav li')
  const nav = document.querySelector('aside ul.nav')
  const navText = document.querySelectorAll('aside ul.nav li .text')
  const logo = document.querySelector('aside ul.nav li#logo a')
  const navWidth = getComputedStyle(document.documentElement).getPropertyValue('--nav-width')
  
  aside.addEventListener('mouseover',()=>{
    aside.style.width=`${parseInt(navWidth) * 2}px`
    navText.forEach(text=>{
      text.style.display='block'
    })
    logo.innerText = 'Wesley'
  })
  aside.addEventListener('mouseout',()=>{
    aside.style.width=`${parseInt(navWidth)}px`
    navText.forEach(text=>{
      text.style.display='none'
    })
    logo.innerText = 'W'
  })

  const activeIndicator = document.createElement('div')
  activeIndicator.classList.add('active-indicator')
  nav.appendChild(activeIndicator)

  const initialActiveItem = document.querySelector('aside ul.nav li.active')
  if (initialActiveItem) {
    activeIndicator.style.top = `${initialActiveItem.offsetTop}px`
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault()
      navItems.forEach(navItem => navItem.classList.remove('active'))
      item.classList.add('active')
      activeIndicator.style.top = `${item.offsetTop}px`
    })
  })
})
