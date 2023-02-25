export async function renderProduct(data) {
    checkData(data);

    document.querySelector('header h1').textContent = data.product.product_name
    document.querySelector('section:nth-of-type(3) figcaption h2').textContent = data.product.brands
    document.querySelector('section:nth-of-type(3) figure figcaption p:first-of-type').textContent = data.product.name_en
    document.querySelector('section:nth-of-type(3) p:last-of-type').textContent = data.product.code
    document.querySelector('section:nth-of-type(3) figure img').src = data.product.image_front_url
    document.querySelector('section:nth-of-type(3) ul').innerHTML = data.product.ingredients_original_tags.map(ingredient => `<li>${ingredient}</li>`).join('')
}

function checkData(data) {
    try {
        data.product.product_name = data.product.product_name ?? 'Unknown';
        data.product.brands = data.product.brands ?? 'Unknown';
        data.product.name_en = data.product.name_en ?? 'Unknown';
        data.product.image_front_url = data.product.image_front_url ?? 'https://www.bakkerijvanhouten.nl/wp-content/uploads/2018/10/placeholder.png';
        data.product.ingredients_original_tags = data.product.ingredients_original_tags ?? 'Unknown';
    } catch (error) {
        console.log(error);
    }
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

