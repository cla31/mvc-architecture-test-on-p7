//Rappel étapes du projet, sans MVC

//8. déclarer les tableaux
let chosenIngredients = [];
let chosenAppliances = [];
let chosenUstensils = [];

//11 Déclaration Tableau des recettes
let recipes = [];
//15 Rajout 
const searchBar = document.querySelector("#recherche");
console.time("Temps de l'algo");
searchBar.addEventListener("input", principalFilter);
let SearchBarValue = "";
let generalSearch = [];
//17
function allRecipesFilter(filterSearchRecipes) {
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
}
//16 Rajout
function principalFilter(e) {
    SearchBarValue = e.target.value.toLowerCase().replace(/\s/g, "");
    // console.log("searchvalue", SearchBarValue.length);
    if (SearchBarValue.length >= 3) {
        generalSearch = allRecipesFilter(recipes);
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

}
// 20 La fonctions qui filtre les ingrédients
function filterIngredients(recipesToFilter) {
    let selectedIngredients = recipesToFilter;
    chosenIngredients.forEach((item) => {
        selectedIngredients = selectedIngredients.filter(
            (recipe) =>
            recipe.ingredients.find((elt) =>
                elt.ingredient.toLowerCase().includes(item)
            )
        );
    });
    return selectedIngredients;
}
// 27 La fonctions qui filtre les appareils
function filterAppliances(recipesToFilter) {
    let selectedAppliances = recipesToFilter;
    chosenAppliances.forEach((item) => {
        selectedAppliances = selectedAppliances.filter(
            (recipe) =>
            recipe.appliance.toLowerCase().includes(item)

        );
    });
    return selectedAppliances;
}
// 32 La fonctions qui filtre les ustensils
function filterUstensils(recipesToFilter) {
    let selectedUstensils = recipesToFilter;
    chosenUstensils.forEach((item) => {
        selectedUstensils = selectedUstensils.filter((recipe) =>
            recipe.ustensils.find((elt) =>
                elt.toLowerCase().includes(item)
            )
        );
    });
    return selectedUstensils;
}
// 21 Tag pour les ingrédients
function displayTagIngredients() {
    const tagsIngr = document.querySelector(".tagsIngredient");
    tagsIngr.innerHTML = ` ${chosenIngredients.map( item =>  
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
            chosenIngredients = chosenIngredients.filter(e => e !== chosenIngredients[index]);
            orchestrator();
        }));
}
// 28 Tag pour les appareils
function displayTagAppliances(){
    const tagsIngr = document.querySelector(".tagsAppliance");
    tagsIngr.innerHTML =` ${chosenAppliances.map( item =>  
        {return ` 
    <div class="tagSelected" style="background-color:#28a745;">${item}
        <img class="closeAppliances" src="assets/images/close.svg" class="ml-5 mb-1" alt="" />
    </div>`
    }).join('')}`;
    let cross = document.querySelectorAll(".closeAppliances");
        cross.forEach((tags, index) => tags.addEventListener("click", e=>{
            let element = e.target;
            element.parentNode.remove(element);
            chosenAppliances = chosenAppliances.filter(e => e !== chosenAppliances[index]);
            orchestrator();
        }));
}
// 33 Tag pour les ustensils
function displayTagUstensils(){
    const tagsUs = document.querySelector(".tagsUstensils");
    tagsUs.innerHTML =` ${chosenUstensils.map( item =>  
        {return ` 
    <div class="tagSelected" style="background-color:#dc3545;">${item}
        <img class="closeUstensils" src="assets/images/close.svg" class="ml-5 mb-1" alt="" />
    </div>`
    }).join('')}`;
    let cross = document.querySelectorAll(".closeUstensils");
        cross.forEach((tags, index) => tags.addEventListener("click", e=>{
            let element = e.target;
            element.parentNode.remove(element);
            chosenUstensils = chosenUstensils.filter(e => e !== chosenUstensils[index]);
            orchestrator();
        }));

}
//1. Création de la fonction pour récupérer les données

const pathJsonProject = "./datas/recipes.json";
async function getDatas(pathJson) {
    try {
        const fetchJson = await fetch(pathJson);
        const backFetch = await fetchJson.json();
        return backFetch;
    } catch (erreur) {
        console.log(erreur);
    }
}
//2. Création de la classe Recettes
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
//7.Création des objets dropdown
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

//3. Fonction pour modéliser les recettes des données brutes en objet recette
//fonction qui permet de transformer les éléments d'un tableau en objets:
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

//4 Création de la fonction init() qui dans un premier temps va se charger de modéliser les données
async function init(pathJson) {

    try {
        let listRecipes;
        const jsonDatas = await getDatas(pathJson);
        const objetsRecipes = jsonDatas.recipes;
        listRecipes = Objects(objetsRecipes, Recipe);
        console.log("liste des recettes en objets",listRecipes);
        //6.Affichage de la liste générale des recettes.
        // displayRecipes( listRecipes );
        //10. Appel des fonctions qui affichent les dropdowns
        // displayIngredientsFromRecipes(listRecipes);
        // displayAppliancesFromRecipes(listRecipes);
        // displayUstensilsFromRecipes(listRecipes);
        //13 On met la liste des recettes dans la variable globale
        recipes = listRecipes
        // 14 Appel de l'orchestrator
        orchestrator()    

    } catch (erreur) {
        console.log(erreur);
    }
}

init(pathJsonProject);

//12 Création de l'orchestrator dont le rôle sera de dispatcher les données en
//entrées de plusieurs fonctions
//Grâce à la variable globale recipes, pas besoin de paramètres
function orchestrator() {
    //Affiche les recettes (à mettre à l'étape 12)
    // displayRecipes(recipes);
    //Affiche les dropdowns
    displayIngredientsFromRecipes(recipes);
    displayAppliancesFromRecipes(recipes);
    displayUstensilsFromRecipes(recipes); 
    //18 Recherche globale 
    const recipesSearchBar = allRecipesFilter(recipes);
    //19 Filtre de la recherche globale:
    // displayRecipes(recipesSearchBar);
    //24 Filtre des ingrédients inclu dans le filtre global de recherche
    const filteredIngredients = filterIngredients(recipesSearchBar);
    //25 Affichage des recettes en fonction du filtre global et le filtre pour les ingrédients
    displayRecipes(filteredIngredients);
    //26 Affichage des tags ingrédients au clic
    displayTagIngredients();
    //continuer ici pour les appareils
    //30  Filtre des ingrédients + filtre des appliances inclus dans le filtre global de recherche et des ingrédients
    const filteredAppliances = filterAppliances(filteredIngredients);
    //31 Affichage des tags appliances au clic
    displayTagAppliances();
    //35 Filtre des ingrédients + filtre des appliances + filtre des ustensils inclus dans le filtre global de recherche, des ingrédients et des appareils
    const recipesToDisplay = filterUstensils(filteredAppliances);
    //36 Affiche les recettes selon tout ce qui est filtré ds la recherche globale, filtres ingrédients, appliance, ustensils
    displayRecipes(recipesToDisplay);
    // Affichage des tags ustensils au clic
    displayTagUstensils();
}



//5 Création de la fonction qui affiche les recettes
//grâce à la méthode display de l'objet recette.
function displayRecipes(recipesToDisplay) {
    document.getElementById("recipesCards").innerHTML = ` ${recipesToDisplay.map( element =>  {return element.display()
    }).join('')}`;
}
//9.Création des fonctions qui affichent les listes dans les dropdowns
//Les ingrédients
function displayIngredientsFromRecipes(allRecipes) {
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
            if (!chosenIngredients.includes(item.dataset.element.toLowerCase())) {
                chosenIngredients.push(
                    item.dataset.element.toLowerCase());
            }
            document.querySelector("#inputBlue").value = '';
            orchestrator();
        });

    });

};
////////////////////////////////////////////////////////////////////////////
//Les appareils
function displayAppliancesFromRecipes(allRecipes) {
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
            if (!chosenAppliances.includes(item.dataset.element.toLowerCase())) {
                chosenAppliances.push(
                    item.dataset.element.toLowerCase()
                );
            }
            document.querySelector("#inputGreen").value = '';
            orchestrator();
        });
    });
};

////////////////////////////////////////////////////////////////////////////
//Les ustensils
function displayUstensilsFromRecipes(allRecipes) {
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
            if (!chosenUstensils.includes(item.dataset.element.toLowerCase())) {
                chosenUstensils.push(
                    item.dataset.element.toLowerCase()
                );
            }
            document.querySelector("#inputRed").value = '';
            orchestrator();
        });
    });

};
// 23 Gestion des champs de recherche dans les inputs.
function filterInput(e) {
    const inputValue = e.target.value.toLowerCase();
    const itemsList = document.querySelectorAll(".dropdown-item");
    for (i = 0; i < itemsList.length; i++) {
        if (!itemsList[i].innerHTML.toLowerCase().includes(inputValue)) {
            itemsList[i].style.display = "none";
        } else {
            itemsList[i].style.display = "list-item";
        }
    }
}
//22 Listener sur input ingrédient
document.querySelector("#inputBlue").addEventListener("input", filterInput);
//29 Listener sur input appareils
document.querySelector("#inputGreen").addEventListener("input", filterInput);
//34  Listener sur input ustensils
document.querySelector("#inputRed").addEventListener("input", filterInput);