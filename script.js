'use strict'

// Background Image API
const pixabayApi = '12181901-0ae683bad462aef9e23b07d08';
const pixabayUrl = 'https://pixabay.com/api/';

// Edamam Key and ID
const edamamKey = '3ea9d172ac4a9f190c88c7603e386b8f';
const edamamAppId = '97ad01ba';

// Edamam Recipe API
const edamamRecipeUrl = 'https://api.edamam.com/search';

// Edamam Nutrition API
const edamamNutritionUrl = 'https://api.edamam.com/api/nutrition-details';

// Edamam Food API
const edamamFoodUrl = 'https://api.edamam.com/api/food-database/parser';


// Page HTML Database
const HTML = {
    options: [
        
    ]
}

// Runs after clicking search button on start page
function handleSearch() {
    $('#js-form').submit(event => {
        event.preventDefault();
        const query = $('#js-search-query').val();
        const diet = $('#js-diet-dropdown').val();
        const calories = $('#js-input').val();
        const exclude = $('#js-textarea').val();
    })
}

// Runs on page load
$(function onLoad() {
    console.log('load');
    handleSearch();
})