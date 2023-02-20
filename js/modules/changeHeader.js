const h1 = document.querySelector('h1')
const searchDiv = document.querySelector('header > div')

export async function headerChange(headerText) {
    h1.textContent = headerText
    if (h1.textContent === 'Scan your product') {
        searchDiv.classList.remove('hidden')
    } else {
        searchDiv.classList.add('hidden')
    }
}