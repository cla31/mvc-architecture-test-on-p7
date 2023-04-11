//Controller
let controller = {
    init: async function(pathJson) {
        try {
            let listRecipes;
            const jsonDatas = await model.getDatas(pathJson);
            const objetsRecipes = jsonDatas.recipes;
            listRecipes = Objects(objetsRecipes, Recipe);
            //Pour test performance algo: rajouter plusieurs recettes ici:
            model.recipes = [
                ...listRecipes,
                ...listRecipes
            ];
            console.log(model.recipes);
            controller.orchestrator();

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
        //Affiche les tags
        view.displayTagIngredients();
        view.displayTagAppliances();
        view.displayTagUstensils();

    }
};