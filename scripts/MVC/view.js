//View
let view = {
        searchBar: document.querySelector("#recherche").addEventListener("input", model.principalFilter),
        // console.time("Temps de l'algo");
        SearchBarValue: "",
        generalSearch: [],
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
                    controller.orchestrator();
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
                    controller.orchestrator();
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
                    controller.orchestrator();
                });
            });
        },

        displayTagIngredients: function() {
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
            controller.orchestrator();
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
                    controller.orchestrator();
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
                    controller.orchestrator();
                }));

        }
};