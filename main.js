let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");

// Status Project Crate Mood OR Update Mood
let btnStatus = "create";
// Set Global ProdId For Update Product depended on it
let tempId;

// Array that will containing All The Products
let dataPro;

if (window.localStorage.products != null) {
  dataPro = JSON.parse(window.localStorage.products);
} else {
  dataPro = [];
}

/* -------------------------------------------------------------------------- */
// Get Total Price

function getTotal() {
  if (price.value != "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.innerHTML = result;
    total.style.background = "#040";
  } else {
    total.innerHTML = "";
    total.style.background = "#a00d02";
  }
}
/* -------------------------------------------------------------------------- */

// Create New Product

submit.onclick = function () {
  let newPro = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value.toLowerCase(),
  };

  // Inputs Validation
  if (
    title.value != "" &&
    price.value != "" &&
    category.value != "" &&
    count.value < 100
  ) {
    // Create Mood
    if (btnStatus === "create") {
      // Add Products equal to "Count" Value
      if (newPro.count > 1) {
        for (let i = 0; i < newPro.count; i++) {
          dataPro.push(newPro);
        }
      } else {
        // Add One Product To Array
        dataPro.push(newPro);
      }
    } else {
      // Update Mood
      // Update Product Data By ProID
      dataPro[tempId] = newPro;
      // Show count input
      count.style.display = "block";
      submit.innerHTML = "Create";
    }
  }

  // Save Products into LocalStorage by "products" key
  window.localStorage.setItem("products", JSON.stringify(dataPro));

  // Clear All Inputs Values
  clearData();

  // Show All Products
  showProducts();
};
/* -------------------------------------------------------------------------- */

//  Clear All Inputs Values

function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
}
/* -------------------------------------------------------------------------- */

// Show All Products

function showProducts() {
  // To Update Color Of Total
  getTotal();
  let tableRows = "";

  for (let i = 0; i < dataPro.length; i++) {
    tableRows += crateRow(i);
  }
  // Show Product in Table
  document.getElementById("tbody").innerHTML = tableRows;

  // Create "DeleteAll" Button
  let deleteAllContainer = document.getElementById("delete-container");
  if (dataPro.length > 0) {
    deleteAllContainer.innerHTML = `
      <button onclick="deleteAll()">delete All (${dataPro.length})</button>`;
  } else {
    deleteAllContainer.innerHTML = "";
  }
}

// Show All Products
showProducts();

/* -------------------------------------------------------------------------- */

// Delete Product Function

function deleteProduct(proId) {
  //delete Product from array
  dataPro.splice(proId, 1);

  //delete Product from LocalStorage (Update It)
  localStorage.products = JSON.stringify(dataPro);

  // Show all Products after deleting (Refresh HTML Table)
  showProducts();
}
/* -------------------------------------------------------------------------- */

// Delete ALL Products Function

function deleteAll() {
  //delete all Products from array
  dataPro.splice(0);

  //delete all Products from LocalStorage
  localStorage.removeItem("products");

  // Show all Products after deleting (Refresh HTML Table)
  showProducts();
}

/* -------------------------------------------------------------------------- */

// Update Product Function

function updateProduct(proId) {
  title.value = dataPro[proId].title;
  price.value = dataPro[proId].price;
  taxes.value = dataPro[proId].taxes;
  ads.value = dataPro[proId].ads;
  discount.value = dataPro[proId].discount;
  category.value = dataPro[proId].category;

  getTotal();
  // Hide count input
  count.style.display = "none";
  submit.innerHTML = "Update";

  btnStatus = "update";

  // Send Product Id To Submit Handler For Update Product depended on it's ID
  tempId = proId;

  scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/* -------------------------------------------------------------------------- */

// Search Section

// Set Global Search Mood For searching depended on it
let searchMood = "title";

function getSearchMood(btnId) {
  let searchInput = document.getElementById("search");
  if (btnId === "searchTitle") {
    searchMood = "title";
  } else {
    searchMood = "category";
  }
  searchInput.placeholder = `Search by ${searchMood}`;
  searchInput.focus();
  searchInput.value = "";

  showProducts();
}

/* -------------------------------------------------------------------------- */

// Search for products

function searchDate(searchValue) {
  searchValue = searchValue.toLowerCase();
  console.log(searchValue);
  let tableRows = "";

  for (let i = 0; i < dataPro.length; i++) {
    // Search By Tittle
    if (searchMood === "title") {
      //Fetch products whose ""title" is equal to the searchValue
      if (dataPro[i].title.includes(searchValue)) {
        tableRows += crateRow(i);
      }
    } else {
      //Search By Category
      //Fetch products whose "Category" is equal to the searchValue
      if (dataPro[i].category.includes(searchValue)) {
        tableRows += crateRow(i);
      }
    }
    // Show Product in Table
    document.getElementById("tbody").innerHTML = tableRows;
  }
}
/* -------------------------------------------------------------------------- */

// Crate Table Row For Every Product

function crateRow(i) {
  let tableRow = "";
  tableRow += `
        <tr>
            <td>${i + 1}</td>
            <td>${dataPro[i].title}</td>
            <td>${dataPro[i].price}</td>
            <td>${dataPro[i].taxes}</td>
            <td>${dataPro[i].ads}</td>
            <td>${dataPro[i].discount}</td>
            <td>${dataPro[i].total}</td>
            <td>${dataPro[i].category}</td>
            <td><button onclick="updateProduct(${i})">update</button></td>
            <td><button onclick="deleteProduct(${i})">delete</button></td>
        </tr>
        `;
  return tableRow;
}
