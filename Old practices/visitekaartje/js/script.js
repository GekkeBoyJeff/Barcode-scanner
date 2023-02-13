var myName = document.querySelector('h1')
var url = 'https://cors-anywhere.herokuapp.com/https://whois.fdnd.nl/api/v1/member?id=cldex5stl48z60avw1vz6ig3l'
// https://cors-anywhere.herokuapp.com/corsdemo

fetch(url)
    .then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return res.json()
    })
    .then((data) => {
        myName.textContent = data.member.name
        console.log(data)
    })

    .catch((error) => test.textContent = `Could not fetch verse: ${error}`);

var btns = document.querySelectorAll('button');

var firstSection = document.querySelector('section:first-of-type')
var wallMonitor = document.querySelector('section:first-of-type>button:nth-of-type(2)')
var biggerMonitor = document.querySelector('section:first-of-type>button:nth-of-type(1)')
var person = document.querySelector('section:nth-of-type(2)>svg')

var secondSection = document.querySelector('section:nth-of-type(2)')
var table = document.querySelector('section:nth-of-type(2) div')
var paper = document.querySelector('section:nth-of-type(2) div button:first-of-type')

var thirdSection = document.querySelector('section:nth-of-type(3)')
var html = document.querySelector('html')

var counter = 0;

for (b of btns) {
    b.addEventListener('click', function () {
        wallMonitor.classList.toggle('hide')
        person.classList.toggle('transparant')
        firstSection.classList.toggle('biggerIndex')
        biggerMonitor.classList.toggle('biggerMonitor')
        secondSection.classList.toggle('biggerTable')
        table.classList.toggle('biggerTable')
        thirdSection.classList.toggle('hide')
        html.classList.toggle('overflow')
    });
}

// function zoomIn() {
//     wallMonitor.classList.toggle('hide')
//     person.classList.toggle('transparant')
//     firstSection.classList.toggle('biggerIndex')
//     biggerMonitor.classList.toggle('biggerMonitor')
//     secondSection.classList.toggle('biggerTable')
//     table.classList.toggle('biggerTable')
//     thirdSection.classList.toggle('hide')
//     html.classList.toggle('overflow')
// }


var monitorInhoud = document.querySelector('section:first-of-type>button figure')
var images = document.querySelectorAll('section:first-of-type>button figure img')

biggerMonitor.addEventListener('click', () => { // game monitor
    images.forEach(function (image) {
        image.classList.toggle('hide');
    })
    counter = 1;
})