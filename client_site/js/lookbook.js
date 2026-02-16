/* ==========================
   API CODE BEGINS: UNSPLASH
   ========================== */

   const ACCESS_KEY = "LyrX39GSrgfQ9e7p_Q69ReoBN3FbNkzRoL5HQUDZYw4";

   const btn = document.getElementById("lookbook-btn");
   const input = document.getElementById("lookbook-query");
   const statusEl = document.getElementById("lookbook-status");
   const grid = document.querySelector(".product-grid");
   
   btn.addEventListener("click", async () => {
     const query = input.value.trim() || "streetwear fashion";
   
     btn.disabled = true;
     statusEl.textContent = "Loading lookbook...";
   
     try {
       const response = await fetch(
         `https://api.unsplash.com/search/photos?query=${query}&per_page=6`,
         {
           headers: {
             Authorization: `Client-ID ${ACCESS_KEY}`
           }
         }
       );
   
       if (!response.ok) {
        const text = await response.text();
        throw new Error(`Request failed (${response.status}): ${text}`);
      }
      
   
       const data = await response.json();
   
       grid.innerHTML = "";
   
       data.results.forEach(photo => {
         const card = document.createElement("div");
         card.className = "product-card";
   
         card.innerHTML = `
           <div class="product-image">
             <img src="${photo.urls.small}"
                  alt="${photo.alt_description || "Lookbook image"}"
                  style="width:100%; height:100%; object-fit:cover;">
           </div>
           <div class="product-info">
             <div class="product-name">${(photo.alt_description || "LOOKBOOK").toUpperCase()}</div>
             <div class="product-price">Photo by ${photo.user.name}</div>
           </div>
         `;
   
         grid.appendChild(card);
       });
   
       statusEl.textContent = "Lookbook updated.";
     } catch (error) {
       statusEl.textContent = "Error loading images.";
       console.error(error);
     }
   
     btn.disabled = false;
   });
   