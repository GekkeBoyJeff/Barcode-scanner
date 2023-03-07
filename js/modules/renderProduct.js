import { showLoadingState, hideLoadingState } from "./loadingState.js";

/* Get the image container element */
const imageContainer = document.querySelector("section:nth-of-type(3) figure div");
showLoadingState();

export async function renderProduct(data) {
    checkData(data);

    document.querySelector('header h1').textContent = data.product.product_name
    document.querySelector('section:nth-of-type(3) figcaption h2').textContent = data.product.brands
    document.querySelector('section:nth-of-type(3) figure figcaption p:first-of-type').textContent = data.product.quantity
    document.querySelector('section:nth-of-type(3) p:last-of-type').textContent = data.product.code
    document.querySelector('section:nth-of-type(3) > details > ul').innerHTML = data.product.ingredients_original_tags.map(ingredient => `<li>${ingredient.replace(/^en:/, '')}</li>`).join('')

    hideLoadingState();
}

function checkData(data) {
    try {
        data.product.product_name = data.product.product_name ?? 'Unknown';
        data.product.brands = data.product.brands ?? 'Unknown';
        data.product.name_en = data.product.name_en ?? 'Unknown';
        data.product.ingredients_original_tags = data.product.ingredients_original_tags ?? 'Unknown';
        renderImages(data)
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


// code
// product_name_nl
// brands
// categories_hierarchy []
// categories_tags
// allergens_hierarchy []
// name_en // korte beschrijving
// food_groups_tags []
// image_front_url
// image_ingredients_url
// image_nutrition_url
// image_packaging_url
// image_url
// ingredients_original_tags []
// nutrient_levels {}
// nutriments {}
// nutrition_data
// nutrition_grades
// product_quantity
// update_key

