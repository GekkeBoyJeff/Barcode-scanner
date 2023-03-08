import { showLoadingState, hideLoadingState } from "./loadingState.js";

/* Get the image container element */
const imageContainer = document.querySelector("section:nth-of-type(3) figure div");

const section = document.querySelector('section:nth-of-type(3)');
showLoadingState(section);

export async function renderProduct(data) {
    checkData(data);

    document.querySelector('header h1').textContent = data.product.product_name
    document.querySelector('section:nth-of-type(3) figcaption h2').textContent = data.product.brands
    document.querySelector('section:nth-of-type(3) figure figcaption p:first-of-type').textContent = data.product.quantity
    document.querySelector('section:nth-of-type(3) p:last-of-type').textContent = data.product.code
    try {
        document.querySelector('section:nth-of-type(3) > details > ul').innerHTML = data.product.ingredients_original_tags.map(ingredient => `<li>${ingredient.replace(/^en:/, '')}</li>`).join('')
    }
    catch (error) {
        console.log(error)
    }

    hideLoadingState(section);
}

function checkData(data) {
    try {
        data.product.product_name = data.product.product_name ?? 'Unknown';
        data.product.brands = data.product.brands ?? 'Unknown';
        data.product.name_en = data.product.name_en ?? 'Unknown';
        data.product.ingredients_original_tags = data.product.ingredients_original_tags ?? 'Unknown';
        renderImages(data)

        const nutriSpan = document.querySelector('span.active');
        if (nutriSpan) {
            nutriSpan.classList.remove('active');
        }
        nutritionScore(data);
    } catch (error) {
        console.log(error);
    }
}

async function renderImages(data) {
    checkForLoadedData();
    // Define an array of the image URL keys
    const imageUrls = [
        "image_front_url",
        "image_ingredients_url",
        "image_nutrition_url",
        "image_url",
    ];

    imageUrls.forEach((url) => {
        if (url) { // controleer of de URL niet leeg is
            console.log(data.product[url])
            console.log(url)
            const image = document.createElement("img");
            image.src = data.product[url];
            imageContainer.appendChild(image);
        }
    });

}

async function checkForLoadedData() {
    while (imageContainer.firstChild) {
        imageContainer.innerHTML = '';
    }
}



function nutritionScore(data) {
    let nutritionScore = data.product.nutriscore_grade;

    // convert nutrutionScore to uppercase
    nutritionScore = nutritionScore.toUpperCase();

    let nutriSpan = document.querySelector(`span[data-value="${nutritionScore}"]`);
    nutriSpan.classList.add('active');
}

export async function renderSearchList(data) {
    const searchList = document.querySelector('section:nth-of-type(4) ul');
    searchList.innerHTML = '';

    data.products.forEach(product => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        const image = document.createElement('img');
        const title = document.createElement('h3');
        const score = document.createElement('span');

        score.setAttribute('data-value', (product.nutriscore_grade || 'Unknown').toUpperCase());

        image.src = product.image_small_url;
        link.href = `#product/${product.code}`;
        title.textContent = product.product_name;
        score.textContent = product.nutriscore_grade;

        link.append(image, title, score);
        listItem.appendChild(link);
        searchList.appendChild(listItem);
    })
    // for each item in the fetch data, create a list item with a link to the product page
}