export function hideSections() {
    for (let i = 0; i < document.querySelectorAll('section').length; i++) {
        document.querySelectorAll('section')[i].classList.add('hidden');
    }
}