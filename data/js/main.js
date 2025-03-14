document.addEventListener('DOMContentLoaded',()=>{
  // ====抓取link====
  const nav = document.querySelector('.nav')
  nav.addEventListener('click',(e)=>{
    e.preventDefault()

    const listItem = e.target.closest('li')
    if(!listItem) return

    const link = listItem.querySelector('a')
    if(!link) return

    const page = link.getAttribute('href').substring(1)
    loadPage(page)
  })

  // ====抓檔案====
  async function loadPage(page){
    try{
      const response = await fetch(`./pages/${page}.html`)
      if(!response.ok){
        throw new Error('Error')
      }
      const content = await response.text()
      document.querySelector('#content').innerHTML = content

      if(page === 'about') {
        setPlanetImages()
        await loadTimelineData()
      }
      if(page === 'contact') {
        initializeContactPage()
      }
      if(page === 'portfolio') { 
        initializePortfolioPage()
      }
    }catch(error){
      console.error('Error Loading Page:', error)
      document.querySelector('#content').innerHTML = '<p>Error loading content.</p>'
    }
  }

  // ====初始化內容介面保持在home.html====
  const initialPage = window.location.hash ? window.location.hash.substring(1) : 'home'
  loadPage(initialPage)
  if(initialPage !== 'home') {
    loadPage(initialPage)
  }

  // ====設定about page timeline 行星圖片====
  function setPlanetImages() {
    let planetArr = ['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune']
    let planets = document.querySelectorAll('.planet')
    
    planets.forEach((item, index) => {
      const imagePath = `./data/images/about/${planetArr[index]}.png`
      item.style.backgroundImage = `url('${imagePath}')`
    })
  }

  // ==== timeline data.json 資料處理 ====
  async function loadTimelineData(){
    try{
      const response = await fetch('./data/data.json')
      if(!response.ok){
        throw new Error('Error loading JSON')
      }
      const data = await response.json()
      const descriptionEle = document.querySelector('.description')
      const timelineItems = document.querySelectorAll('.timeline .item')
      
      timelineItems.forEach((item,index)=>{
        item.addEventListener('mouseenter',function(){
          descriptionEle.style.display = 'flex'
          const descriptions = data.aboutPage.items[index].description
          descriptionEle.innerHTML = descriptions.map((ele) =>{
            return `<li>${ele}</li>`
          }).join('')
          descriptionEle.style.animation = 'spaceshipUp 1s ease-out forwards'
        })

        item.addEventListener('mouseleave',function(){
          descriptionEle.style.animation = 'spaceshipDown 1s ease-in forwards'
        })
      })
    } catch(error){
      console.error('error loading timeline data:',error)
    }
  }
  
  // portfolio 卡片資訊
  async function loadPortfolioData() {
    try {
      const response = await fetch('/data/data.json')
      const data = await response.json()
      const projects = data.portfolio.projects
      const projectCards = document.querySelectorAll('.projectCard')

      projectCards.forEach((card, index) => {
        if (projects[index]) {
          const project = projects[index]

          card.querySelector('img').src = project.img
          card.querySelector('.title').textContent = project.title
          card.querySelector('.desc').textContent = project.description

          card.style.cursor = 'pointer'
          card.addEventListener('click', () => {
            window.open(project.link, '_blank')
          })
        }
      })
      
    } catch (error) {
      console.error('Error loading portfolio data:', error)
    }
  }
  
  // ====contact page ====
  function initializeContactPage(){
    const contact = document.querySelector('#contact')
    const contactItems = document.querySelectorAll('#contact .container li') 
    const info = document.querySelector('#info')
    
    // ====更新info內容====
    function updateInfo(e) {
      info.innerHTML =''
      const targetLi = e.target.closest('li')
      if(targetLi) {
        const span = targetLi.querySelector('span')
        if(span && span.dataset.text) {
          info.innerHTML = span.dataset.text
        }
      }
    }
    // ====robot複製資訊功能====
    contactItems.forEach(items=>{
      items.addEventListener('mousemove', (e) => {
        items.style.setProperty('--x', `${e.pageX}px`)
        items.style.setProperty('--y', `${e.pageY}px`)
      })

      items.addEventListener('mouseenter',function(){
        items.style.setProperty('--opacity',1)
      })

      items.addEventListener('mouseleave',function(){
        items.style.setProperty('--opacity',0)
      })

      items.addEventListener('click', function(){
        const span = items.querySelector('span')
        if (span && span.dataset.text) {
          navigator.clipboard.writeText(span.dataset.text)
        }
      })

      // ====contact li背景更換====
      const contactBg = document.querySelectorAll('#contact .container li')
      contactBg.forEach((items,index)=>{
        items.style.backgroundImage = `url('/data/images/contact/contact_0${index+1}.png')`
      })
    })

    // ====舞台聚光燈====
    contact.addEventListener('mousemove',function(e){
      const rect = contact.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      contact.style.setProperty('--x',`${x}px`)
      contact.style.setProperty('--y',`${y}px`)
      updateInfo(e)
    })

    contact.addEventListener('mouseleave',function(){
      const rect = contact.getBoundingClientRect()
      contact.style.setProperty('--x',`${rect.width/2}px`)
      contact.style.setProperty('--y',`${rect.height/2}px`)
      info.innerHTML = ''
    })
  }

  // portfolio 頁面初始化
  async function initializePortfolioPage() {
    try {
      const response = await fetch('/data/data.json')
      const data = await response.json()
      const projects = data.portfolio.projects
      
      const showcase = document.querySelector('#portfolio .showcase')
      showcase.innerHTML = '' // Clear existing wrappers
      
      // Changed to 2 projects per wrapper
      const projectsPerWrapper = 2
      const numberOfWrappers = Math.ceil(projects.length / projectsPerWrapper)
      
      // Create wrappers and cards
      for (let i = 0; i < numberOfWrappers; i++) {
        const wrapper = document.createElement('div')
        wrapper.className = 'wrapper'
        wrapper.style.display = i === 0 ? 'grid' : 'none'
        wrapper.style.opacity = i === 0 ? '1' : '0'
        
        // Create 2 cards for this wrapper
        for (let j = 0; j < projectsPerWrapper; j++) {
          const projectIndex = i * projectsPerWrapper + j
          if (projectIndex < projects.length) {
            const project = projects[projectIndex]
            const card = document.createElement('li')
            card.className = 'projectCard'
            card.innerHTML = `
              <img src="${project.img}" alt="${project.title}">
              <h3 class="title">${project.title}</h3>
              <p class="desc">${project.description}</p>
            `
            
            card.style.cursor = 'pointer'
            card.addEventListener('click', () => {
              window.open(project.link, '_blank')
            })
            
            wrapper.appendChild(card)
          }
        }
        
        showcase.appendChild(wrapper)
      }
      
      // Initialize next button functionality
      const nextBtn = document.querySelector('#portfolio .nextBtn')
      const wrappers = document.querySelectorAll('#portfolio .showcase .wrapper')
      let currentIndex = 0
      
      nextBtn.addEventListener('click', () => {
        wrappers[currentIndex].style.display = 'none'
        wrappers[currentIndex].style.opacity = '0'

        currentIndex = (currentIndex + 1) % wrappers.length
        wrappers[currentIndex].style.animation = 'none'
        wrappers[currentIndex].offsetHeight 

        wrappers[currentIndex].style.display = 'grid'
        wrappers[currentIndex].style.opacity = '0'
        wrappers[currentIndex].style.animation = 'movein 0.3s ease forwards'
        setTimeout(() => {
          wrappers[currentIndex].style.opacity = '1'
        }, 100)
      })
      
    } catch (error) {
      console.error('Error initializing portfolio page:', error)
    }
  }
})