'use strict'

// Edamam Key and ID
const edamamKey = '3ea9d172ac4a9f190c88c7603e386b8f';
const edamamAppId = '97ad01ba';

// Edamam Recipe API
const edamamRecipeUrl = 'https://api.edamam.com/search';



function getWeekDay(i) {
        const weekArray = {
            1: 'Monday',
            2: 'Tuesday',
            3: 'Wednesday',
            4: 'Thursday',
            5: 'Friday',
            6: 'Saturday',
            7: 'Sunday',
            8: 'Monday',
            9: 'Tuesday',
            10: 'Wednesday',
            11: 'Thursday',
            12: 'Friday',
            13: 'Saturday'
        };

        const date = new Date();
        const day = date.getDay() + i;
        return weekArray[day];
}

function getRecipeName(Responsejson, i) {
    return Responsejson.hits[i].recipe.label;
}

function getCals(Responsejson, i) {
    const totalCals = Responsejson.hits[i].recipe.calories;
    const servings = Responsejson.hits[i].recipe.yield;
    return Math.round(totalCals / servings);
}

function getServings(Responsejson, i) {
    return Responsejson.hits[i].recipe.yield;
}

function getTimeToMake(Responsejson, i) {
    const time = Responsejson.hits[i].recipe.totalTime;
    return `<b>${time}mins</b>`
}

function getSnippet(Responsejson, i) {
    const ingredients = Responsejson.hits[i].recipe.ingredientLines;
    const snippet = ingredients.join(', ').substring(0, 22);
    return snippet;
}

function getIngredients(Responsejson, i) {
    const ingredientList = []
    const ingredients = Responsejson.hits[i].recipe.ingredientLines;
    for (let x of ingredients) {
        ingredientList.push(`<li>${x}</li><br>`);
    }
    const ingredientString = ingredientList.join('');
    return ingredientString;
}

function getImage(Responsejson, i) {
    return Responsejson.hits[i].recipe.image;
}

function displayResults(Responsejson) {
    $('#js-container').empty();
    
    //$('#js-main').append(`<ul id="js-container" class="container"></ul>`)
    const num = Responsejson.to;
    console.log(Responsejson);

    for (let i = 0; i < num; i++) {
        const day = getWeekDay(i);
        const recipe = getRecipeName(Responsejson, i);
        const snippet = getSnippet(Responsejson, i);
        const calories = getCals(Responsejson, i);
        const servings = getServings(Responsejson, i);
        const timeToMake = getTimeToMake(Responsejson, i);
        const ingredients = getIngredients(Responsejson, i);
        const image = getImage(Responsejson, i);
        
        $('#js-container').append(
            `
            <li id="js-box" class="box box1" data-expand="false">
              <section id="js-header-container" class="header-container">
              <header role="header" id="js-recipe-header" class="recipe-header">
                  <h1>${day}</h1>
                  <h3>${recipe}</h3>
                  <p>${calories}kcal</p>
                  <p>${snippet}...</p>
              </header>
              <div id="js-img-container" class="img-container">
                <img role="img" src=${image} alt="image of ${recipe} for ${day}" id="js-recipe-img" class="recipe-img tint-blur">
              </div>
              </section>
              <section id="js-section" class="section hidden">
                <section class="recipe-info">
                  <header class="info-header">
                    <h4>${day}</h4>
                    <h2>${recipe}</h2>
                    <p${calories}kcal per serving | ${servings} Servings</p>
                    <p><em>Takes approximately: ${timeToMake}</em></p>
                  </header>
                  <article>
                    <h2>Ingredients</h2>
                    <ul id="js-ingredient-list" class="ingredient-list">
                    ${ingredients}
                    </ul>
                  </article>
                </section>
                  </section>
            </li>
            `
        )
        
    }
    $('#js-menu-toggle').removeClass('hidden');
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
        //diet: diet,
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
    .catch(err => { console.log(err);
        $('#js-main').html(`<div class="err-message"><h3>Uh oh, something went wrong: ${err.message}</h3><br>
        <p>Your parameters may be too retricitve. Try changing your search parameters and try again.</p></div>`);
    });
}

// Seperate any exclusions by commas. Removes the following: " ", ",", "and" 
function generateEx(exclude) {
    return exclude.split(/[\W\d]|\band|none|nothing|or|nope\b/g).filter(empty => empty != '').join(',');
}


// Runs after clicking search button on start page
function handleSearch() {
    $('#js-form').submit(event => {
        event.preventDefault();
        const query = $('#js-search-query').val();
        const diet = $('#js-diet-dropdown').val();
        const calories = $('#js-input').val();
        const exclude = $('#js-textarea').val();

        // in the future make diet/health it's own param for better results
        const q = query ? `${query}, ${diet}` : `healthy, ${diet}`;
        const calLimit = calories ? `0-${calories}` : calories;
        const exclusions = generateEx(exclude);
        getRecipes(q, diet, calLimit, exclusions);
        $('#js-main').toggleClass('form-hidden');
        $('#js-main').toggleClass('container-hidden');
        $('#js-container').toggleClass('hidden');
        $('#js-form').toggleClass('hidden');
        $('#js-menu-toggle').one().fadeIn(750);
        $('#js-menu-input').prop('checked', false);
    })
}


function handleMenuClick() {
    $('#js-menu-input').on('click', function() {
        $('#js-container').toggleClass('hidden');
        $('#js-form').toggleClass('hidden');
        $('#js-main').toggleClass('form-hidden')
        $('#js-main').toggleClass('container-hidden');
    })
}

// Runs on page load
$(function onLoad() {
    console.log('load');
    $('#js-menu-toggle').hide();
    handleSearch();
    handleMenuClick();
})