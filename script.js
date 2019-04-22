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
    dietOptions: [
        
    ],
    weekMealPlan: 
    `<ul id="js-container" class="container">
    <li id="js-box" class="box box1" data-expand="false">
      <section class="header-container">
      <header role="header" id="js-recipe-header" class="recipe-header">
          <h1>{day}</h1>
          <h2>{recipe}</h2>
          <h3>{mealCals}kcal</h3>
          <p>{ingredient-list-snippet}</p>
      </header>
      <img role="img" src="https://www.rd.com/wp-content/uploads/2018/06/healthy-food.jpg" alt="Recipe image for Monday" id="js-recipe-img" class="recipe-img">
      </section>
      <section id="js-section" class="section">
        <section class="recipe-info">
          <header class="info-header">
            <h1>{day}</h1>
            <h2>{recipe}</h2>
            <h3>{mealCals}kcal per serving | {yields} Servings</h3>
            <p><em>Takes approximately: {time}</em></p>
          </header>
          <article>
            <h2>Ingredients</h2>
            <ul id="js-ingredient-list" class="ingredient-list">
            </ul>
          </article>
        </section>
          </section>
    </li>
    </ul>`
};

function generateIngredientList(Responsejson) {
    const ingredientList = [];
    const ingredients = Responsejson.hits[0].recipe.ingredientLines;
    for (let i of ingredients) {
        ingredientList.push(`<li>${i}</li>`);
    }
    $('#js-main').html(HTML.weekMealPlan);
    $('#js-ingredient-list').html(ingredientList);
}

function displayResults(Responsejson) {
    console.log(Responsejson);
    generateIngredientList(Responsejson);
}

function formatQueryParams(params) {
    /*for (let value in params) {
        if (params[value] === 'N/A' || params[value] === undefined || params[value] === null || params[value] === '') {
            delete params[value];
        }
    }*/
    console.log(params);
    const queryItems = Object.keys(params).map(key =>
        `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        return queryItems.join('&');
}

function getRecipes(q, diet, calLimit, exclusions) {

    const query = {
        q: q,
        diet: diet,
        calories: calLimit,
        excluded: exclusions,
        to: 7,
        app_id: edamamAppId,
        app_key: edamamKey
    };

    const params = generateParam(query);
    function generateParam(query) {
        let newKey = {};
        Object.keys(query).forEach((value) => {
            if (query[value]) {
                newKey[value] = query[value];
            }
        });
        return newKey;
    };

    

    const queryString = formatQueryParams(params);
    const url = edamamRecipeUrl + '?' + queryString;

    fetch(url)
    .then(Response => {
        if(Response.ok) {
            return Response.json();
        }
        throw new Error(Response.statusText);
    })
    .then(Responsejson => displayResults(Responsejson))
    .catch(err => {
        $('#js-main').text(`Uh oh, something went wrong: ${err.message}`);
    });
}

// Seperate any exclusions by commas. Removes the following: " ", ",", "and" 
function generateEx(exclude) {
    return exclude.split(/[\W\d]|\band|none|nothing|nope\b/g).filter(empty => empty != '').join(',');
}

// Check for blank values. If blank delete or assign a default value
/*function handleBlank(q, diet, calLimit, exclusions) {
    const query = [q, diet, calLimit, exclusions];
    const filtered = query.filter(empty);
    function empty(value) {
        if (value !== 'N/A' || value !== null || value !== undefined || value !== '') {
            return value;
        }
    }
    console.log(filtered.join());
    return filtered.join();
}*/

// Runs after clicking search button on start page
function handleSearch() {
    $('#js-form').submit(event => {
        event.preventDefault();
        const query = $('#js-search-query').val();
        const diet = $('#js-diet-dropdown').val();
        const calories = $('#js-input').val();
        const exclude = $('#js-textarea').val();
        const q = query ? query : 'healthy';
        const calLimit = calories ? `0-${calories}` : calories;
        const exclusions = generateEx(exclude);
        getRecipes(q, diet, calLimit, exclusions);
    })
}

// Runs on page load
$(function onLoad() {
    console.log('load');
    handleSearch();
})