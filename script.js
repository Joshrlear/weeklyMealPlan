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

function displayResults(Responsejson) {
    console.log(Responsejson);
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