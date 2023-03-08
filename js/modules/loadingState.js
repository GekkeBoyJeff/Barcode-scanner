export function showLoadingState(section) {
    console.log('loading aan')
    section.querySelectorAll('*').forEach(function (element) {
        if ((element.tagName !== 'SPAN' || !element.closest('div')) && element.tagName !== 'H3') {
            element.classList.add('skeleton');
        }
    });
}

export function hideLoadingState(section) {
    console.log('loading uit')
    section.querySelectorAll('*').forEach(function (element) {
        element.classList.remove('skeleton');
    });
}