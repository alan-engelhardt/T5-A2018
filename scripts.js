"use strict";

const catLink = "https://kea-alt-del.dk/t5/api/categories";
const pListLink = "https://kea-alt-del.dk/t5/api/productlist";
const imgbase = "https://kea-alt-del.dk/t5/site/imgs/";
const pLink = "https://kea-alt-del.dk/t5/api/product?id=";

const modal = document.querySelector("#modal");
const discountFilter = document.querySelector("#discount-filter");

const main = document.querySelector("main");
const nav = document.querySelector("nav");
const allLink = document.querySelector("#allLink");
const myTemplate = document.querySelector("#myTemplate").content;

let filters = [];

allLink.addEventListener("click", ()=>filterBy("all"));

function filterBy(category){
	filters.push("catgory");
	document.querySelectorAll("section").forEach(section=>{
		if(section.id == category || category == "all"){
			section.classList.remove("hide");
			section.querySelectorAll("article").forEach(article=>article.classList.remove("hide"));
		}else{
			section.classList.add("hide");
		}
	})
}

discountFilter.addEventListener("click", ()=>{
	filters.push("discount");
	document.querySelectorAll("section").forEach(section => {
		if(section.classList.contains("has-discount")){
			section.classList.remove("hide");
			section.querySelectorAll("article").forEach(article=>{
				if(!article.classList.contains("has-discount")){
					article.classList.add("hide");
				}
			});
		}else{
			section.classList.add("hide");
		}
	});
});

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

function show(plist){
	plist.forEach(product=>{
		const parent = document.querySelector("#"+product.category);
		const clone = myTemplate.cloneNode(true);
		clone.querySelector("h2").textContent=product.name;
		clone.querySelector(".description").textContent=product.shortdescription;
		clone.querySelector(".price span").textContent=product.price;
		clone.querySelector(".productImage").src=imgbase + "small/" + product.image + "-sm.jpg";
		clone.querySelector(".details-button").addEventListener("click", ()=>{
			modal.classList.remove("hide");
			fetch(pLink+product.id).then(promise=>promise.json()).then(data=>showDetails(data))
		});

		if(product.discount){
			const newPrice = Math.round(product.price - product.price * product.discount / 100);
			clone.querySelector(".discount-price span").textContent = newPrice;
			clone.querySelector("article").classList.add("has-discount");
			parent.classList.add("has-discount");
		} else {
			clone.querySelector(".discount-price").classList.add("hide");
		}

		if(product.soldout){
			clone.querySelector(".soldout").classList.remove("hide");
			clone.querySelector("article").classList.add("is-soldout");
		}

		parent.appendChild(clone);
	});
}

function showDetails(product){
	modal.querySelector("h2").textContent=product.name;
	modal.querySelector("p").textContent=product.longdescription;
}

modal.addEventListener("click", ()=>modal.classList.add("hide"));










