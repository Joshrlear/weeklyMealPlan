'use strict'

// Edamam Key and ID
const edamamKey = '3ea9d172ac4a9f190c88c7603e386b8f';
const edamamAppId = '97ad01ba';

// Edamam Recipe API
const edamamRecipeUrl = 'https://api.edamam.com/search';

// Pixabay Key
const pixabayKey = "12181901-0ae683bad462aef9e23b07d08";

// Pixabay API
const pixabayurl = "https://pixabay.com/api/";


// Values to check query against
const STORE = {
    diet: [
        "balanced",
        "high-fiber",
        "high-protein",
        "low-carb",
        "low-sodium"
    ],
    health: [
        "alcohol-free",
        "celery-free",
        "crustacean-free",
        "dairy-free",
        "egg-free",
        "fish-free",
        "gluten-free",
        "keto-friendly",
        "kidney-friendly",
        "kosher",
        "low-potassium",
        "lupine-free",
        "mustard-free",
        "No-oil-added",
        "low-sugar",
        "paleo",
        "peanut-free",
        "pescatarian",
        "pork-free",
        "red-meat-free",
        "sesame-free",
        "shellfish-free",
        "soy-free",
        "sugar-conscious",
        "tree-nut-free",
        "vegan",
        "vegetarian",
        "wheat-free"
    ]
}

// Determine today and get remaining 6 days
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

// Return name of recipe
function getRecipeName(Responsejson, i) {
    return Responsejson.hits[i].recipe.label;
}

// Return calories per serving
function getCals(Responsejson, i) {
    const totalCals = Responsejson.hits[i].recipe.calories;
    const servings = Responsejson.hits[i].recipe.yield;
    return Math.round(totalCals / servings);
}

// Return amount of servings
function getServings(Responsejson, i) {
    return Responsejson.hits[i].recipe.yield;
}

// Return time to cook per recipe
function getTimeToMake(Responsejson, i) {
    const time = Responsejson.hits[i].recipe.totalTime;
    return `<b>${time}mins</b>`
}

// Create a small snippet of the top ingredients
function getSnippet(Responsejson, i) {
    const ingredients = Responsejson.hits[i].recipe.ingredientLines;
    const snippet = ingredients.join(', ').substring(0, 22);
    return snippet;
}

// Return list of ingredients per recipe
function getIngredients(Responsejson, i) {
    const ingredientList = []
    const ingredients = Responsejson.hits[i].recipe.ingredientLines;
    for (let x of ingredients) {
        ingredientList.push(`<li>${x}</li><br>`);
    }
    const ingredientString = ingredientList.join('');
    return ingredientString;
}

// Return recipe image
function getImage(Responsejson, i) {
    return Responsejson.hits[i].recipe.image;
}


// Clears previous values and displays new week meal plan results
function displayResults(Responsejson) {
    $('#js-container').empty();
    
    const num = Responsejson.to;
    console.log(Responsejson);

    
    // Generate 7 day meal plan
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
                  <article role="article">
                    <h2>Ingredients</h2>
                    <ul role="list" id="js-ingredient-list" class="ingredient-list">
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


// Formats parameters for edamam api
function formatQueryParams(params) {
    console.log(params);
    const queryItems = Object.keys(params).map(key =>
        `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        return queryItems.join('&');
}


// Compile query and call edamam api
function getRecipes(q, diet, health, dishType, calLimit, exclusions) {

    const query = {
        q: q,
        diet: diet,
        health: health,
        dishtype: dishType,
        calories: calLimit,
        excluded: exclusions,
        to: 7,
        app_id: edamamAppId,
        app_key: edamamKey
    };

    // Filters blank or invalid query params
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

    // Generate args for edamam api
    const queryString = formatQueryParams(params);
    const url = edamamRecipeUrl + '?' + queryString;
    

    // Edamam api
    fetch(url)
    .then(Response => {
        if(Response.ok) {
            return Response.json();
        }
        throw new Error(Response.statusText);
    })
    .then(Responsejson => displayResults(Responsejson))
    .catch(err => {
        $('#js-main').html(`<div class="err-message"><h3>Uh oh, something went wrong: ${err.message}</h3><br>
        <p>Your parameters may be too retricitve. Try changing your search parameters and try again.</p></div>`);
    });
}


// Seperate any exclusions by commas. Removes the following: " ", ",", "and" 
function generateEx(exclude) {
    return exclude.split(/[\W\d]|\band|none|nothing|or|nope\b/g).filter(empty => empty != '').join(',');
}


// Determines whether diet is a query parameter
function isDiet(dietType) {
    for (let i of STORE.diet) {
        console.log(i);
        if (i === dietType) {
            return dietType;
        }
        else {
            return null;
        }
    }
};

// Determines whether health is a query parameter
function isHealth(dietType) {
    for (let i of STORE.health) {
        console.log(i);
        if (i === dietType) {
            return dietType;
        }
        else {
            return null;
        }
    }
};


// Handles all css related tasks after clicking Search button
function handleCssOnSearch() {
    $('#js-background').fadeToggle(750);
    $('#js-main').toggleClass('form-hidden');
    $('#js-main').toggleClass('container-hidden');
    $('#js-container').toggleClass('hidden');
    $('#js-form').toggleClass('hidden');
    $('#js-menu-toggle').one().fadeIn(750);
    $('#js-menu-input').prop('checked', false);
}


// Handles css functions when clicking hamburger menu button
function handleCssOnMenu() {
    $('#js-menu-input').on('click', function() {
        $('#js-background').fadeToggle(750);
        $('#js-container').toggleClass('hidden');
        $('#js-form').toggleClass('hidden')
        $('#js-main').toggleClass('form-hidden')
        $('#js-main').toggleClass('container-hidden');
    })
}

// Runs after clicking search button on start page
function handleSearch() {
    $('#js-form').submit(event => {
        event.preventDefault();
        const query = $('#js-search-query').val();
        const dishType = $('#js-meal-dropdown').val();
        const dietType = $('#js-diet-dropdown').val();
        const calories = $('#js-input').val();
        const exclude = $('#js-textarea').val();

        // in the future make diet/health it's own param for better results
        const q = query ? query : `food`;
        const diet = isDiet(dietType);
        const health = isHealth(dietType);
        const calLimit = calories ? `0-${calories}` : calories;
        const exclusions = generateEx(exclude);
        getRecipes(q, diet, health, dishType, calLimit, exclusions);
        handleCssOnSearch()
    })
}

function displayBackground(Responsejson) {
    const i = Math.round(Math.random());
    const img = '<img class="background-img-api"src="' + Responsejson.hits[i].largeImageURL + '"></img>';
    $('#js-background').html(img);
}

// Generate random image for background
function backgroundImage() {
    const foodList = [
        'breakfast',
        'omelette',
        'pancakes',
        'snack',
        'dessert',
        'steak',
        'chicken',
        'dinner',
        'pizza',
        'fruit',
        'chocolate',
        'strawberry',
        'salad',
        'baked',
        'bbq+fried',
        'hamburger',
        'waffles',
        'eggs'
    ]

    const i = Math.round(Math.random() * 17);
    const foodType = `q=${foodList[i]}`;

    const url = pixabayurl + '?' + 'key=' + pixabayKey + '&image_type=photo' + '&'+ foodType + '&editors_choice=true';
    console.log(url);
    fetch(url)
    .then(Response => {
        if(Response.ok) {
            return Response.json();
        }
        throw new Error(Response.statusText);
    })
    .then(Responsejson => displayBackground(Responsejson))
    .catch(err => {
        console.log(err);
    });
}

// Runs on page load
$(function onLoad() {
    backgroundImage()
    handleSearch();
    handleCssOnMenu();
})