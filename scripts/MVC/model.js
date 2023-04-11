//Model
//fonctions et classes pour modéliser les données via l'objet model
function Objects(elements, Instance) {
    try {
        objectElements = elements.map(function instance(recipe) {
            return new Instance(recipe);
        });
        return objectElements;
    } catch (erreur) {
        console.log(erreur);
    }
}
//DROPDOWNS
class Ingredient {
    constructor(ingredient) {
        this.ingredient = ingredient.toLowerCase();
    }
    display() {
        return `
            <a class="dropdown-item blue ingredient" data-element="${this.ingredient}" href="#">${this.ingredient}</a>
        `
    }
}

class Device {
    constructor(appliance) {
        this.appliance = appliance.toLowerCase();
    }
    display() {
        return `
            <a class="dropdown-item green appliance" data-element="${this.appliance}" href="#">${this.appliance} </a>
        `
    }
}

class Ustensil {
    constructor(ustensil) {
        this.ustensil = ustensil.toLowerCase();
    }
    display() {
        return `
            <a class="dropdown-item red ustensil" data-element="${this.ustensil}"  href="#">${this.ustensil}</a>
        `
    }
}
//RECIPE
class Recipe {
    constructor(datas) {
        this.id = datas.id;
        this.image = datas.image;
        this.name = datas.name;
        this.servings = datas.servings;
        // this.ingredients = datas.ingredients.map(element => element.toLowerCase());
        this.ingredients = datas.ingredients;
        // console.log("Les ingrédients", this.ingredients[0])
        this.time = datas.time;
        this.description = datas.description;
        this.appliance = datas.appliance;
        this.ustensils = datas.ustensils;
    }

    display() {
            return `   
        <article class="col-12 col-lg-4">
            <div class="card">
                <div class="container-img">
                    <img class="imgRecipe" src="./assets/recipes/${this.image}" alt="${this.name}">
                </div>
                <div class="card-body">
                    <div class="card-body__header">
                        <h2 class="card-title">${this.name}</h2>
                        <div class="time">
                            <div class="minutes">
                                <span class="icon-minutes"><img src="assets/images/time.svg" alt="icone horloge"> </span>${this.time} min                                                                   
                            </div>
                        </div>
                    </div>
                    <div class="main-card">
                        <ul class="ingredients">
                            ${this.ingredients.map((data)=>
                                `
                                    <li> 
                                    <strong>${data.ingredient}: </strong>${"quantity" in data?data.quantity:""} ${"unit" in data ? data.unit : ""}
                                    </li>                                                          
                                `
                                ).join("")}                            
                        </ul>
                        <p class="card-text">${this.description}</p>
                    </div>
                </div>
            </div>
        </article>
    `
    }

}
//Objet model 
let model = {
    recipes: [],
    chosenIngredients: [],
    chosenAppliances: [],
    chosenUstensils: [],
    getDatas: async function(pathJson) {
        try {
            const fetchJson = await fetch(pathJson);
            const backFetch = await fetchJson.json();
            return backFetch;
        } catch (erreur) {
            console.log(erreur);
        }
    },
    allRecipesFilter: function(filterSearchRecipes) {
        let selectedRecipesBySearch = [];
        // console.log("Fonction avec les recettes");
        filterSearchRecipes.filter((recipe) => {
            if (
                recipe.name
                .toLowerCase()
                .replace(/\s/g, "")
                .includes(view.SearchBarValue) ||
                recipe.description
                .toLowerCase()
                .replace(/\s/g, "")
                .includes(view.SearchBarValue) ||
                recipe.ingredients.find((item) =>
                    item.ingredient
                    .toLowerCase()
                    .replace(/\s/g, "")
                    .includes(view.SearchBarValue)
                )
    
            ) {
                selectedRecipesBySearch.push(recipe);
                selectedRecipesBySearch = [...new Set(selectedRecipesBySearch)];
                // console.log("Tableau selectedRecipesBySearch",selectedRecipesBySearch);
    
            }
        });
        return selectedRecipesBySearch;
    },
     principalFilter: function(e) {
        view.SearchBarValue = e.target.value.toLowerCase().replace(/\s/g, "");
        if (view.SearchBarValue.length >= 3) {
            generalSearch = model.allRecipesFilter(model.recipes);
            if (generalSearch.length === 0) {
                document.getElementById("recipesCards").innerHTML =
                    "<p id='error'> Aucune recette ne correspond à votre critère ...vous pouvez, par exemple, rechercher 'tarte aux pommes', 'poisson', etc. </p>";
            } else {
                controller.orchestrator(generalSearch);
            }
    
        } else {
            view.SearchBarValue = "";
            controller.orchestrator();
            // console.log("search value est sous 3 caractères");
        }
    
    },
    filterIngredients: function (recipesToFilter) {
        let selectedIngredients = recipesToFilter;
        model.chosenIngredients.forEach((item) => {
            selectedIngredients = selectedIngredients.filter(
                (recipe) =>
                recipe.ingredients.find((elt) =>
                    elt.ingredient.toLowerCase().includes(item)
                )
            );
        });
        return selectedIngredients;
    },
    filterAppliances: function(recipesToFilter) {
        let selectedAppliances = recipesToFilter;
        model.chosenAppliances.forEach((item) => {
            selectedAppliances = selectedAppliances.filter(
                (recipe) =>
                recipe.appliance.toLowerCase().includes(item)
    
            );
        });
        return selectedAppliances;
    },  
    filterUstensils: function(recipesToFilter) {
        let selectedUstensils = recipesToFilter;
        model.chosenUstensils.forEach((item) => {
            selectedUstensils = selectedUstensils.filter((recipe) =>
                recipe.ustensils.find((elt) =>
                    elt.toLowerCase().includes(item)
                )
            );
        });
        return selectedUstensils;
    }
};