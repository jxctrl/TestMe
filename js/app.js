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


    //     const blackBg = document.querySelector('.blackBg'),
    //         addb = document.querySelector('.addb'),
    //         uploadImg = document.querySelector('.file-input'),
    //         addc = document.querySelector('.addc'),
    //         addButton = document.querySelector('.addButton');

    //     addb.addEventListener('submit', function () {



    //         const div = document.createElement('div'),
    //             img = document.createElement('img'),
    //             div2 = document.createElement('div'),
    //             h3 = document.createElement('h3'),
    //             p = document.createElement('p'),
    //             div3 = document.createElement('div'),
    //             a = document.createElement('a');
    //         div.classList.add('main_card');
    //         img.src = uploadImg;
    //         div2.classList.add('content');
    //         h3.classList.add('card_title');
    //         p.classList.add('card_text');
    //         div.classList.add('view');
    //         a.classList.add('card_view');

    //         div.appendChild(img);
    //         div.appendChild(div2);
    //         div2.appendChild(h3);
    //         div.appendChild(p);
    //         div.appendChild(div3);
    //         div3.appendChild(a);
    //     })

    //     addButton.addEventListener('click', function () {
    //         blackBg.style = `
    //             display: flex;
    //             opacity: 1;
    //         `
    //     })
    //     addc.addEventListener('click', function () {
    //         blackBg.style = `
    //             display: none;
    //             opacity: 0;
    //         `
    //     })

    //     const drop = document.querySelector('.drop');
    //     const input = document.querySelector('.drop input');
    //     const text = document.querySelector('.text');
    //     const progress = document.querySelector('.progress');

    //     let files = []

    //     input.addEventListener('change', () => {
    //         drop.style.display = 'none'
    //         upload();
    //     });
    //     drop.addEventListener('dragover', (e) => {
    //         e.preventDefault();
    //         text.innerHTML = "Sichqonchani qo'yib yuboring."
    //         drop.classList.add("active")
    //     })
    //     drop.addEventListener('dragleave', (e) => {
    //         e.preventDefault();
    //         text.innerHTML = "Fan rasmini olib kelib tashlang."
    //         drop.classList.remove("active")
    //     })
    //     drop.addEventListener('drop', (e) => {
    //         e.preventDefault();
    //         files = e.dataTransfer.files;
    //         drop.style.display = "none"
    //         upload();
    //     })

    //     //upload logic
    //     function upload() {
    //         let intervalCount = 0.25;
    //         progress.style.display = "block";
    //         progress.style.width = `${18 * intervalCount}%`;
    //         const interval = setInterval(() => {
    //             intervalCount += 0.25;
    //             progress.style.width = `${18 * intervalCount}%`;
    //             if (intervalCount == 5) {
    //                 clearInterval(interval)
    //             }
    //         }, 100);
    //     }

})