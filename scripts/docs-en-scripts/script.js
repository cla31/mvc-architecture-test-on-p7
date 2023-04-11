//Fichier avec tout le js de l'application (pour info mais non appelé ds l'index.html)
// Archi, Model View Controller

// Model: Partie qui gère les données. 
// le tableau de recettes 
// les tableaux de filtres (ingrédients, appareils, ustensiles etc.) 


// View: Partie qui gère l'affichage des données à l'utilisateur. 
// Les fonctions qui affichent les recettes et 
// les tags.

// Controller: Partie qui gère les interactions utilisateur 
// et les traite pour mettre à jour le modèle et la vue. 
// + fonction init().


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
//RECIPES
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
                .includes(SearchBarValue) ||
                recipe.description
                .toLowerCase()
                .replace(/\s/g, "")
                .includes(SearchBarValue) ||
                recipe.ingredients.find((item) =>
                    item.ingredient
                    .toLowerCase()
                    .replace(/\s/g, "")
                    .includes(SearchBarValue)
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
        SearchBarValue = e.target.value.toLowerCase().replace(/\s/g, "");
        // console.log("searchvalue", SearchBarValue.length);
        if (SearchBarValue.length >= 3) {
            generalSearch = model.allRecipesFilter(model.recipes);
            if (generalSearch.length === 0) {
                document.getElementById("recipesCards").innerHTML =
                    "<p id='error'> Aucune recette ne correspond à votre critère ...vous pouvez, par exemple, rechercher 'tarte aux pommes', 'poisson', etc. </p>";
            } else {
                orchestrator(generalSearch);
            }
    
        } else {
            SearchBarValue = "";
            orchestrator();
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

//********************************************************************** */
//********************************************************************** */
//********************************************************************** */
//********************************************************************** */
//********************************************************************** */
//********************************************************************** */
//View
let view = {
    displayRecipes: function(recipesToDisplay) {
        // Afficher les recettes à l'utilisateur
        document.getElementById("recipesCards").innerHTML = ` ${recipesToDisplay.map( element =>  {return element.display()
        }).join('')}`;
    },

    displayIngredientsFromRecipes: function(allRecipes) {
        // Afficher les ingrédients disponibles pour les recettes
        let allIngredients = [];
        allRecipes.forEach(element => {
            element.ingredients.forEach(index => {
                allIngredients.push(index.ingredient);
            })
        });
        allIngredients = [...new Set(allIngredients)].sort();
        ingredients = Objects(allIngredients, Ingredient);
        document.getElementById("ingredients").innerHTML = ` ${ingredients.map( element =>  {return element.display() }).join('')}`;
        allIngredients = Array.from(document.querySelectorAll(".ingredient"));
        allIngredients.forEach((item) => {
            item.addEventListener("click", () => {
                if (!model.chosenIngredients.includes(item.dataset.element.toLowerCase())) {
                    model.chosenIngredients.push(
                        item.dataset.element.toLowerCase());
                }
                document.querySelector("#inputBlue").value = '';
                orchestrator();
            });

        });

    },

    displayAppliancesFromRecipes: function(allRecipes) {
        // Afficher les appareils disponibles pour les recettes
        let allAppliances = [];
        allRecipes.forEach(element => {
            allAppliances.push(element.appliance);

        });
        allAppliances = [...new Set(allAppliances)].sort();
        appliances = Objects(allAppliances, Device);
        document.getElementById("appliances").innerHTML = ` ${appliances.map( element =>  {return element.display() }).join('')}`;
        allAppliances = Array.from(document.querySelectorAll(".appliance"));
        allAppliances.forEach((item) => {
            item.addEventListener("click", () => {
                if (!model.chosenAppliances.includes(item.dataset.element.toLowerCase())) {
                    model.chosenAppliances.push(
                        item.dataset.element.toLowerCase()
                    );
                }
                document.querySelector("#inputGreen").value = '';
                orchestrator();
            });
        });
    },
    displayUstensilsFromRecipes: function(allRecipes) {
        // Afficher les ustensiles disponibles pour les recettes
        let allUstensils = [];
        allRecipes.forEach(element => {
            element.ustensils.forEach(index => {
                allUstensils.push(index);
            })
        });
        allUstensils = [...new Set(allUstensils)].sort();
        ustensils = Objects(allUstensils, Ustensil);
        document.getElementById("ustensils").innerHTML = ` ${ustensils.map( element =>  {return element.display() }).join('')}`;
        allUstensils = Array.from(document.querySelectorAll(".ustensil"));
        allUstensils.forEach((item) => {
            item.addEventListener("click", () => {
                if (!model.chosenUstensils.includes(item.dataset.element.toLowerCase())) {
                    model.chosenUstensils.push(
                        item.dataset.element.toLowerCase()
                    );
                }
                document.querySelector("#inputRed").value = '';
                orchestrator();
            });
        });
    },

displayTagIngredients: function () {
    const tagsIngr = document.querySelector(".tagsIngredient");
    tagsIngr.innerHTML = ` ${model.chosenIngredients.map( item =>  
        {return ` 
        <div class="tagSelected" style="background-color:#007bff;">
            ${item}
            <img class="closeIngredients" src="assets/images/close.svg" class="ml-5 mb-1" alt="" />
        </div>
        `
    }).join('')}`;
        let cross = document.querySelectorAll(".closeIngredients");
        cross.forEach((tags, index) => tags.addEventListener("click", e=>{
            let element = e.target;
            element.parentNode.remove(element);
            model.chosenIngredients = model.chosenIngredients.filter(e => e !== model.chosenIngredients[index]);
            orchestrator();
        }));
},

 displayTagAppliances: function(){
    const tagsIngr = document.querySelector(".tagsAppliance");
    tagsIngr.innerHTML =` ${model.chosenAppliances.map( item =>  
        {return ` 
    <div class="tagSelected" style="background-color:#28a745;">${item}
        <img class="closeAppliances" src="assets/images/close.svg" class="ml-5 mb-1" alt="" />
    </div>`
    }).join('')}`;
    let cross = document.querySelectorAll(".closeAppliances");
        cross.forEach((tags, index) => tags.addEventListener("click", e=>{
            let element = e.target;
            element.parentNode.remove(element);
            model.chosenAppliances = model.chosenAppliances.filter(e => e !== model.chosenAppliances[index]);
            orchestrator();
        }));

},

 displayTagUstensils: function(){
    const tagsUs = document.querySelector(".tagsUstensils");
    tagsUs.innerHTML =` ${model.chosenUstensils.map( item =>  
        {return ` 
    <div class="tagSelected" style="background-color:#dc3545;">${item}
        <img class="closeUstensils" src="assets/images/close.svg" class="ml-5 mb-1" alt="" />
    </div>`
    }).join('')}`;
    let cross = document.querySelectorAll(".closeUstensils");
        cross.forEach((tags, index) => tags.addEventListener("click", e=>{
            let element = e.target;
            element.parentNode.remove(element);
            model.chosenUstensils = model.chosenUstensils.filter(e => e !== model.chosenUstensils[index]);
            orchestrator();
        }));

}
};
//********************************************************************** */
//********************************************************************** */
//********************************************************************** */
//********************************************************************** */
//********************************************************************** */
//********************************************************************** */
//Controller
function orchestrator() {
    //2.1
    const recipesSearchBar = model.allRecipesFilter(model.recipes);
    //2.1.Tri de la liste des recettes
    const filteredIngredients = model.filterIngredients(recipesSearchBar);
    const filteredAppliances = model.filterAppliances(filteredIngredients);
    const recipesToDisplay = model.filterUstensils(filteredAppliances);
    //2.2.Affiche les recettes
    view.displayRecipes(recipesToDisplay);
    //2.3.Affiche les dropdowns
    view.displayIngredientsFromRecipes(recipesToDisplay);
    view.displayAppliancesFromRecipes(recipesToDisplay);
    view.displayUstensilsFromRecipes(recipesToDisplay);
    //2.4.Affiche les tags
    view.displayTagIngredients();
    view.displayTagAppliances();
    view.displayTagUstensils();
}
let controller = {
    init: async function(pathJson) {
        try {
            let listRecipes;
            const jsonDatas = await model.getDatas(pathJson);
            const objetsRecipes = jsonDatas.recipes;
            listRecipes = Objects(objetsRecipes, Recipe);
            //Test recettes:
            model.recipes = [
                ...listRecipes,
                ...listRecipes
            ];
            console.log(model.recipes);
            orchestrator();

        } catch (erreur) {
            console.log(erreur);
        }

    },
    filterInput: function(e) {
        const inputValue = e.target.value.toLowerCase();
        const itemsList = document.querySelectorAll(".dropdown-item");
        for (i = 0; i < itemsList.length; i++) {
            if (!itemsList[i].innerHTML.toLowerCase().includes(inputValue)) {
                itemsList[i].style.display = "none";
            } else {
                itemsList[i].style.display = "list-item";
            }
        }
    },

    orchestrator: function() {
        // Filtrer les recettes
        const recipesSearchBar = model.allRecipesFilter(model.recipes);
        const filteredIngredients = model.filterIngredients(recipesSearchBar);
        const filteredAppliances = model.filterAppliances(filteredIngredients);
        const recipesToDisplay = model.filterUstensils(filteredAppliances);
        // Afficher les recettes
        view.displayRecipes(recipesToDisplay);

        // Afficher les dropdowns
        view.displayIngredientsFromRecipes(recipesToDisplay);
        view.displayAppliancesFromRecipes(recipesToDisplay);
        view.displayUstensilsFromRecipes(recipesToDisplay);

    }
};

const searchBar = document.querySelector("#recherche");
console.time("Temps de l'algo");
searchBar.addEventListener("input", model.principalFilter);
let SearchBarValue = "";
let generalSearch = [];

//Listeners
document.querySelector("#inputBlue").addEventListener("input", controller.filterInput);
document.querySelector("#inputGreen").addEventListener("input", controller.filterInput);
document.querySelector("#inputRed").addEventListener("input", controller.filterInput);

const pathJsonProject = "./datas/recipes.json";
//Lancement de l'application
controller.init(pathJsonProject);