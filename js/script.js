let btnMenu = document.getElementById('btn-menu');
let mainNav = document.getElementById('main-nav');
btnMenu.addEventListener('click', function(){
  mainNav.classList.toggle('mostrar');
});

const slider = document.querySelector("#slider");
let sliderSection = document.querySelectorAll(".slider__section");
let sliderSectionLast = sliderSection[sliderSection.length -1];

const btnLeft = document.querySelector("#btn-left");
const btnRight = document.querySelector("#btn-right");

slider.insertAdjacentElement('afterbegin', sliderSectionLast);

function Next() {
  let sliderSectionFirst = document.querySelectorAll(".slider__section")[0];
  slider.style.marginLeft = "-200%";
  slider.style.transition = "all 0.5s";
  setTimeout(function(){
    slider.style.transition = "none";
    slider.insertAdjacentElement('beforeend', sliderSectionFirst);
    slider.style.marginLeft = "-100%";
  }, 500);
}

function Prev() {
  let sliderSection = document.querySelectorAll(".slider__section");
  let sliderSectionLast = sliderSection[sliderSection.length -1];
  slider.style.marginLeft = "0";
  slider.style.transition = "all 0.5s";
  setTimeout(function(){
    slider.style.transition = "none";
    slider.insertAdjacentElement('afterbegin', sliderSectionLast);
    slider.style.marginLeft = "-100%";
  }, 500);
}

btnRight.addEventListener('click', function(){
  Next();
});

btnLeft.addEventListener('click', function(){
  Prev();
});

setInterval(function(){
  Next();
}, 5000);

function showCart(x){
  document.getElementById("products-id").style.display = "block";
}
function closeBtn(){
   document.getElementById("products-id").style.display = "none";
}



//funcionalidad del carrito

let allContainerCart = document.querySelector(".container-products");
let containerBuyCart = document.querySelector(".card-items");
let priceTotal = document.querySelector(".price-total");
let amountProduct = document.querySelector(".count-product");

let buyThings = [];
let totalCart = 0;
let countProduct = 0;


loadEventListeners();
function loadEventListeners(){
  allContainerCart.addEventListener("click", addProduct);

  containerBuyCart.addEventListener("click", deleteProduct)
}


function addProduct(e){
  e.preventDefault();
  if (e.target.classList.contains("product__icon")) {
    const selectProduct = e.target.parentElement.parentElement;
    readTheContent(selectProduct);
  }

;}

function deleteProduct(e){
  if (e.target.classList.contains("delete-product")) {
    const deleteId = e.target.getAttribute("data-id");

    buyThings.forEach(value => {
      if (value.id == deleteId) {
        let priceReduce = parseFloat(Number(value.price.replace("$", ""))) * parseFloat(value.amount);
        totalCart = totalCart - priceReduce;
        totalCart = totalCart.toFixed(2);
      }
    })


    buyThings = buyThings.filter(product => product.id !== deleteId);


    countProduct--;
  }

  if (buyThings.length === 0) {
    priceTotal.innerHTML = 0;
    amountProduct.innerHTML = 0;

  }
  loadHtml();
  addLocalStorage();
}

function readTheContent(product){
  const infoProduct = {
    image: product.querySelector(".product__img").src,
    title: product.querySelector(".product__title").textContent,
    price: product.querySelector(".product__price").textContent,
    id: product.querySelector(".product__icon").getAttribute("data-id"),
    amount: 1
  }
  totalCart = Number(totalCart) + Number(infoProduct.price.replace("$", ""));

  const exist = buyThings.some(product => product.id === infoProduct.id)
  if (exist) {
    const pro = buyThings.map(product => {
      if (product.id === infoProduct.id) {
        product.amount++;
        return product;
      } else {
        return product;
      }
    });
    buyThings = [...pro];
  } else{
    buyThings = [...buyThings, infoProduct];
    countProduct++;
  }

  loadHtml();
  addLocalStorage();
}

function loadHtml(){
  clearHtml();
  buyThings.forEach(product => {
    const {image, title, price, amount, id} = product
    const row = document.createElement("div");
    row.classList.add("item");
    row.innerHTML = `
    <img src="${image}" alt="">
    <div class="item-content">
      <h5>${title}</h5>
      <h5 class="cart-price">${price}</h5>
      <h6>Cantidad: ${amount}</h6>
    </div>
    <span class="delete-product" data-id="${id}">X</span>
    `

    containerBuyCart.appendChild(row);

    priceTotal.innerHTML = totalCart;

    amountProduct.innerHTML = countProduct;
  });
}

function clearHtml(){
  containerBuyCart.innerHTML = "";
}

function addLocalStorage() {
  localStorage.setItem('buyThings', JSON.stringify(buyThings));
  localStorage.setItem("cont", JSON.stringify(countProduct));
  localStorage.setItem("total", JSON.stringify(totalCart));


}

window.onload = function(){
  const storage = JSON.parse(localStorage.getItem('buyThings'));
  const countStorage = JSON.parse(localStorage.getItem("cont"));
  const totalStorage = JSON.parse(localStorage.getItem("total"))
  if(storage){
    buyThings = storage;
    loadHtml()
  }
  if(countStorage){
    countProduct = countStorage;
    amountProduct.innerHTML = countStorage;
    
  }
  if (totalStorage) {
    totalCart = totalStorage;
    priceTotal.innerHTML = totalStorage
    
  }
}

