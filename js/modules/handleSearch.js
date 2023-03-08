export async function handleSearch() {
    const search = document.querySelector('#searchValue');
    // vervang alle spaties in de zoekwaarde door plustekens met behulp van de `replace()` methode en een reguliere expressie
    const searchValue = search.value.replace(/ /g, '+');;
    console.log(searchValue)
    window.location.hash = `#products/${searchValue}`;
}