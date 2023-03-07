export function showLoadingState() {
    console.log('loading aan')
    let section = document.querySelector('section:nth-of-type(3)');
    section.querySelectorAll('*').forEach(function (element) {
        if ((element.tagName !== 'SPAN' || !element.closest('div')) && element.tagName !== 'H3') {
            element.classList.add('skeleton');
        }
    });
}

export function hideLoadingState() {
    console.log('loading uit')
    let section = document.querySelector('section:nth-of-type(3)');
    section.querySelectorAll('*').forEach(function (element) {
        element.classList.remove('skeleton');
    });
}