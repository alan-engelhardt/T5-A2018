const catLink = "https://kea-alt-del.dk/t5/api/categories";
const pListLink = "https://kea-alt-del.dk/t5/api/productlist";
const imgbase = "https://kea-alt-del.dk/t5/site/imgs/";
const main = document.querySelector("main");
const nav = document.querySelector("nav");
const allLink = document.querySelector("#allLink");
const myTemplate = document.querySelector("#myTemplate").content;

allLink.addEventListener("click", ()=>filterBy("all"));

fetch(catLink).then(promise=>promise.json()).then(data=>buildCategories(data));

function buildCategories(data){
	data.forEach(category=>{
		//console.log(category);
		const newSection = document.createElement("section");
		const newH2 = document.createElement("h2");
		const newLink = document.createElement("a");
		newLink.href="#";
		newLink.textContent=category;
		newLink.addEventListener("click", ()=>filterBy(category));
		newSection.id=category;
		newH2.textContent=category;
		nav.appendChild(newLink);
		newSection.appendChild(newH2);
		main.appendChild(newSection);
	});
	fetch(pListLink).then(promise=>promise.json()).then(data=>show(data));
}

function filterBy(category){
	document.querySelectorAll("section").forEach(section=>{
		if(section.id == category || category == "all"){
			section.classList.remove("hide");
		}else{
			section.classList.add("hide");
		}
	})
}

function show(plist){
	plist.forEach(product=>{
		const parent = document.querySelector("#"+product.category);
		const clone = myTemplate.cloneNode(true);
		clone.querySelector("h2").textContent=product.name;
		clone.querySelector("p").textContent=product.shortdescription;
		clone.querySelector(".productImage").src=imgbase + "small/" + product.image + "-sm.jpg";
		parent.appendChild(clone);
	});
}
