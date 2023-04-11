//Listeners sur les inputs des dropdowns
document.querySelector("#inputBlue").addEventListener("input", controller.filterInput);
document.querySelector("#inputGreen").addEventListener("input", controller.filterInput);
document.querySelector("#inputRed").addEventListener("input", controller.filterInput);

const pathJsonProject = "./datas/recipes.json";
//Lancement de l'application
controller.init(pathJsonProject);