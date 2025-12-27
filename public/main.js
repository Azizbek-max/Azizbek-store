async function getJSON(url){
  const res = await fetch(url);
  if (!res.ok) return [];
  return res.json();
}

let allPosts = [];
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');

function debounce(fn, wait=250){ let t; return (...args)=>{ clearTimeout(t); t = setTimeout(()=>fn(...args), wait); }; }

function renderPosts(posts){
  const container = document.getElementById('posts-grid');
  container.innerHTML = '';
  if (!posts || posts.length === 0) { container.innerHTML = '<div class="col-span-full text-center text-gray-600">No results found.</div>'; return; }
  posts.forEach(r=>{
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-lg p-6';
    card.innerHTML = `
      <img src="${r.image || '/img/placeholder.svg'}" alt="${r.title}" class="w-full h-56 object-cover rounded">
      <div class="mt-3 flex justify-between items-start">
        <h2 class="text-2xl font-semibold">${r.title}</h2>
        <span class="text-sm text-gray-500 uppercase">${(r.category || 'uncategorized')}</span>
      </div>
      <p class="mt-2 text-gray-600">${r.description || ''}</p>
      <a href="${r.link || '#'}" target="_blank" class="block mt-4 bg-blue-500 text-white text-center py-3 rounded hover:bg-blue-700">View on Amazon</a>
    `;
    container.appendChild(card);
  });
}

function applyFilters(){
  const q = (searchInput && searchInput.value || '').trim().toLowerCase();
  const cat = (categoryFilter && categoryFilter.value || '').trim().toLowerCase();
  const filtered = allPosts.filter(p=>{
    const matchQ = !q || (p.id && p.id.toLowerCase().includes(q)) || (p.title && p.title.toLowerCase().includes(q));
    const matchCat = !cat || (p.category || 'uncategorized').toLowerCase() === cat;
    return matchQ && matchCat;
  });
  renderPosts(filtered);
}

async function renderPostsInit(){
  allPosts = await getJSON('/api/posts');
  applyFilters();
}

document.addEventListener('DOMContentLoaded', ()=>{ renderPostsInit(); if (searchInput) searchInput.addEventListener('input', debounce(applyFilters,200)); if (categoryFilter) categoryFilter.addEventListener('change', applyFilters); });
