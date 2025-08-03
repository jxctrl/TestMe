window.addEventListener('DOMContentLoaded', function () {
    const loader = document.querySelector('.loader');
    const web = document.querySelector('.web');
    const ifra = document.querySelector('.containerrrddd');
    const qazx = document.querySelector('.qazx');

    this.window.addEventListener('load', function () {
        setTimeout(() => {
            loader.style.display = 'none'
            ifra.style.display = 'flex'
        }, 300);
    })

    qazx.addEventListener('click', function () {
        ifra.style.display = "none"
        web.style.display = "block"

    })

    // window.addEventListener('scroll', function () {
    //     const topBox = document.querySelector('.topBox');
    //     if (window.scrollY > 0) {
    //         topBox.style = `
    //         right: 30px;
    //         bottom: 30px;
    //         `
    //     } else {
    //         topBox.style = `
    //         right: -100px;
    //         botom: 100px;
    //         `
    //     }
    // })


    var prevScrollpos = window.pageYOffset;
    window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        document.querySelector("nav").style.top = "0";
      } else {
        document.querySelector("nav").style.top = "-100px";
      }
      prevScrollpos = currentScrollPos;
    }


    const menuBtn = document.querySelector('.menuBtn'),
        nava = document.querySelector('.nav_list')

    menuBtn.addEventListener('click', function () {
        menuBtn.classList.toggle('active')
        nava.classList.toggle('active')
    })


    const submi = document.querySelector('.submit_button')

    submi.addEventListener('click', function () {
        location.href = '#teskt'
    })

    const BtnN1 = document.querySelector('.N2'),
        BtnN2 = document.querySelector('.N1'),
        MSec1 = document.querySelector('.mini_section-1'),
        MSec2 = document.querySelector('.mini_section-2'),
        teskt = document.querySelector('.section-1');

    BtnN1.addEventListener('click', function () {
        MSec2.style.display = 'none'
        MSec1.style.display = 'block'
        BtnN1.style = `
            background: #000;
            color: #fff;
        `
        BtnN2.style = `
            background: #fff;
            color: #000;
        `
        teskt.style = `
            background: #00ff00;
        `

    })
    BtnN2.addEventListener('click', function () {
        MSec1.style.display = 'none'
        MSec2.style.display = 'block'
        BtnN2.style = `
            background: #000;
            color: #fff;
        `
        BtnN1.style = `
            background: #fff;
            color: #000;
        `
        teskt.style = `
            background: #fff;
        `
    })

})