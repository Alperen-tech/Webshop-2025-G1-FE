document.addEventListener("DOMContentLoaded", () => {
    const categoryList = document.querySelector(".category-menu");
    const productCards = document.querySelectorAll(".product-card");
  
    // 1. Hämta kategorier från API
    fetch("https://webshop-2025-be-g7.vercel.app/api/categories")
      .then(res => res.json())
      .then(data => {
        const categories = data.categories;
  
        // 2. Lägg till "Visa alla"-länk först
        const allItem = document.createElement("li");
        allItem.innerHTML = `<a href="#" data-category="Alla">🔁 Visa alla</a>`;
        categoryList.appendChild(allItem);
  
        // 3. Lägg till kategorier i listan
        categories.forEach(cat => {
          const li = document.createElement("li");
          li.innerHTML = `<a href="#" data-category="${cat.name}">${cat.name}</a>`;
          categoryList.appendChild(li);
        });
  
        // 4. Lägg till click-event på alla länkar
        setupCategoryFilter();
      })
      .catch(error => {
        console.error("Fel vid hämtning av kategorier:", error);
        categoryList.innerHTML = "<li>Det gick inte att ladda kategorier.</li>";
      });
  
    // 5. Funktion för filtrering
    function setupCategoryFilter() {
      const categoryLinks = document.querySelectorAll(".category-menu a");
  
      categoryLinks.forEach(link => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const selectedCategory = link.getAttribute("data-category");
  
          productCards.forEach(card => {
            const cardCategory = card.getAttribute("data-category");
            if (selectedCategory === "Alla" || cardCategory === selectedCategory) {
              card.style.display = "block";
            } else {
              card.style.display = "none";
            }
          });
        });
      });
    }
  });
  