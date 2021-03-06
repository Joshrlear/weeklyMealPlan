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
    ],
    food: [
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
    handleCssOnSearch();
    $('#js-search-back').one().removeClass('hidden');
    $('#js-container').empty();
    
    const num = Responsejson.to;

    
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
            <li id="js-weekday-recipe" class="weekday-recipe" data-expand="false">
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

}


// Formats parameters for edamam api
function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key =>
        `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        return queryItems.join('&');
}

function closeErr() {
    $('#js-close-err').click(function () {
        $('#js-err-container').fadeOut(500, function () {
            $('#js-err-container').remove();
        });
        
    })
}

function alertErr() {
    $('#js-main').append(
        `
        <div id="js-err-container">
            <div id="js-err-message" class="err-message hidden">
                <a id="js-close-err" class="circle"><span></span><span></span></a>
                <h3>Something went wrong:</h3>
                <h4>Broaden your search criteria and try again</h4>
            </div>
            <div class="darken-background"></div>
        </div>
    `
    );
    $('#js-err-message').fadeIn(500);
    closeErr();
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
        console.log(err);
        alertErr();
        //$('#js-form').addClass('hidden');
        //$('#js-container').addClass('hidden');
    });
}


// Seperate any exclusions by commas. Removes the following: " ", ",", "and" 
function generateEx(exclude) {
    return exclude.split(/[\W\d]|\band|none|nothing|or|nope\b/g).filter(empty => empty != '').join(',');
}


// Determines whether diet is a query parameter
function isDiet(dietType) {
    let diet = undefined;
    for (let i of STORE.diet) {
        if (i === dietType) {
            diet = i;
            return diet;
        }
    }
};

function isHealth(dietType) {
    let health = undefined;
    for (let i of STORE.health) {
        if (i === dietType) {
            health = i;
            return health;
        }
    }
}

// Handles all css related tasks after clicking "search" button
function handleCssOnSearch() {
    if (window.outerWidth >= 700) {
        $('#js-background').fadeToggle(750);
    }
    $('#js-main').toggleClass('form-hidden');
    $('#js-main').toggleClass('container-hidden');
    $('#js-container').toggleClass('hidden');
    $('#js-form').toggleClass('hidden');
    //$('#js-search-toggle').one().fadeIn(750);
    $('#js-search').show();
    $('#js-search-back').text('New Search');
}

function handleCssOnNewSearch() {
    $('#js-search-back').on('click', function() {
        $(this).text(function(i, text) {
            return text === 'New Search' ? 'Back' : 'New Search';
        });

        // line below formats back button for iPhone 5/SE
        $(this).toggleClass('bottom-left');

        $('#js-err-message').remove();
        if (window.outerWidth >= 700) {
            $('#js-background').fadeToggle(750);
        }
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
        const meal = $('#js-meal-dropdown').val();
        const dietType = $('#js-diet-dropdown').val();
        const calories = $('#js-input').val();
        const exclude = $('#js-textarea').val();


        const q = query ? query : STORE.food[Math.round(Math.random() * 17)];
        const dishType = meal !== 'any' ? meal : null;
        const diet = dietType !== 'none' ? isDiet(dietType) : null;
        const health = diet === undefined ? isHealth(dietType) : null;
        const calLimit = calories ? `0-${calories}` : calories;
        const exclusions = generateEx(exclude);
        getRecipes(q, diet, health, dishType, calLimit, exclusions);
    })
}

function displayBackground(Responsejson) {
    const i = Math.round(Math.random());
    const img = '<img class="background-img-api"src="' + Responsejson.hits[i].largeImageURL + '"></img>';
    $('#js-background').html(img);
}

// Generate random image for background
function backgroundImage() {
    const foodList = STORE.food;
    const i = Math.round(Math.random() * 17);
    const foodType = `q=${foodList[i]}`;

    const url = pixabayurl + '?' + 'key=' + pixabayKey + '&image_type=photo' + '&'+ foodType + '&editors_choice=true';
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


$(function onLoad() {
    backgroundImage()
    handleSearch();
    handleCssOnNewSearch();
})