// js/recipes.js
const DATA_URL = 'data/recipes.json';
let allRecipes = [];

// Fetch recipes.json
export async function fetchRecipes() {
  const resp = await fetch(DATA_URL);
  if (!resp.ok) throw new Error('Failed to load recipes.json');
  return resp.json();
}

// Render a grid of recipe cards
function displayRecipes(recipes) {
  const list = document.getElementById('recipe-list');
  list.innerHTML = '';
  if (!recipes.length) {
    list.innerHTML = '<p>No recipes found.</p>';
    return;
  }

  recipes.forEach(r => {
    const card = document.createElement('article');
    card.className = 'recipe-card';
    card.innerHTML = `
      <div class="card-image"><img src="${r.image}" alt="${r.title}"></div>
      <h3>${r.title}</h3>
      <p class="muted">${r.category || ''}</p>
      <p>${r.description || ''}</p>
      <div class="card-actions">
        <a class="small-btn" href="recipe.html?id=${r.id}">Open</a>
        <button class="small-btn view-js" data-id="${r.id}">View</button>
      </div>
    `;
    list.appendChild(card);
  });

  // attach inline view handlers
  document.querySelectorAll('.view-js').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = Number(e.currentTarget.dataset.id);
      const recipe = allRecipes.find(x => x.id === id);
      if (!recipe) return alert('Recipe not found');
      // simple modal-less quick view:
      const html = `
        <div style="padding:1rem">
          <img src="${recipe.image}" alt="${recipe.title}" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:.6rem" />
          <h3>${recipe.title}</h3>
          <p><strong>Ingredients</strong></p>
          <ul>${(recipe.ingredients||[]).map(i=>`<li>${i}</li>`).join('')}</ul>
          <p><strong>Instructions</strong></p>
          <ol>${(recipe.instructions||[]).map(i=>`<li>${i}</li>`).join('')}</ol>
        </div>
      `;
      const w = window.open('', '', 'width=700,height=600');
      w.document.write(`<html><head><title>${recipe.title}</title></head><body>${html}</body></html>`);
      w.document.close();
    });
  });
}

// Search logic
function initSearch() {
  const search = document.getElementById('search-bar');
  search.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) return displayRecipes(allRecipes);
    const filtered = allRecipes.filter(r => {
      return (r.title || '').toLowerCase().includes(q)
        || (r.description || '').toLowerCase().includes(q)
        || (r.category || '').toLowerCase().includes(q)
        || (r.ingredients || []).join(' ').toLowerCase().includes(q);
    });
    displayRecipes(filtered);
  });
}

async function init() {
  try {
    allRecipes = await fetchRecipes();
    displayRecipes(allRecipes);
    initSearch();
  } catch (err) {
    document.getElementById('recipe-list').innerHTML = '<p>Could not load recipes.</p>';
    console.error(err);
  }
}

// Run when loaded
document.addEventListener('DOMContentLoaded', init);
