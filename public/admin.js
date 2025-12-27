async function postJSON(url, body){
  const res = await fetch(url, {method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body), credentials: 'same-origin'});
  return res.json();
}

async function getJSON(url){
  const res = await fetch(url, {credentials: 'same-origin'});
  return res.ok ? res.json() : [];
}

const loginForm = document.getElementById('login-form');
const loginMsg = document.getElementById('login-msg');
const loginArea = document.getElementById('login-area');
const appArea = document.getElementById('app-area');
const setupBtn = document.getElementById('setup-btn');
const logoutBtn = document.getElementById('logout-btn');
const formMsg = document.getElementById('form-msg');

loginForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  loginMsg.textContent = '';
  const fd = new FormData(loginForm);
  const data = {username: fd.get('username'), password: fd.get('password')};
  const res = await postJSON('/api/login', data);
  if (res.ok) { loginArea.classList.add('hidden'); appArea.classList.remove('hidden'); await loadPosts(); showList(); }
  else loginMsg.textContent = res.error || 'Login failed';
});

setupBtn.addEventListener('click', async ()=>{
  const username = prompt('choose username');
  const password = prompt('choose password');
  if (!username || !password) return alert('Canceled');
  const res = await postJSON('/api/setup', {username, password});
  if (res.ok) alert('Admin created, you can log in now'); else alert(res.error || 'Failed');
});

logoutBtn.addEventListener('click', async ()=>{
  await postJSON('/api/logout', {});
  appArea.classList.add('hidden'); loginArea.classList.remove('hidden');
});

// Posts
const postsList = document.getElementById('posts-list');
const postForm = {
  id: document.getElementById('post-id'),
  title: document.getElementById('post-title'),
  desc: document.getElementById('post-desc'),
  link: document.getElementById('post-link'),
  category: document.getElementById('post-category'),
  image: document.getElementById('post-image')
};
const previewImg = document.getElementById('preview-img');
const uploadBtn = document.getElementById('upload-btn');
const uploadedUrl = document.getElementById('uploaded-url');
const createBtn = document.getElementById('create-btn');
const updateBtn = document.getElementById('update-btn');
const resetBtn = document.getElementById('reset-btn');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');
const nextPanelBtn = document.getElementById('next-btn');
const addNewBtn = document.getElementById('add-new-btn');
const fixCatBtn = document.getElementById('fix-cat-btn');

let allPosts = [];
let page = 1;
const perPage = 6;
let highlightId = null;

postForm.image.addEventListener('change', ()=>{
  const file = postForm.image.files[0];
  if (!file) { previewImg.src=''; previewImg.classList.add('hidden'); return; }
  const url = URL.createObjectURL(file);
  previewImg.src = url; previewImg.classList.remove('hidden');
});

async function loadPosts(){
  postsList.innerHTML = 'Loading...';
  allPosts = await getJSON('/api/posts');
  page = 1; renderPage();
}

function renderPage(){
  postsList.innerHTML = '';
  const total = allPosts.length; const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page-1)*perPage; const end = start + perPage;
  const slice = allPosts.slice(start, end);
  slice.forEach(r=>{
    const el = document.createElement('div');
    el.className = 'border p-3 rounded flex justify-between items-start gap-4';
    if (highlightId === r.id) el.classList.add('ring-2','ring-green-400');
    el.innerHTML = `<div class="flex gap-4">
      <img src="${r.image || '/img/placeholder.svg'}" class="w-24 h-14 object-cover rounded">
      <div>
        <div class="font-semibold">${r.title} <span class="text-sm text-gray-500">(${r.id})</span></div>
        <div class="text-sm text-gray-700">${r.description || ''}</div>
        <div class="text-sm text-gray-500">Category: ${r.category || 'uncategorized'}</div>
        <div class="text-sm mt-2"><a target="_blank" class="text-blue-600 hover:underline" href="${r.link}">View on Amazon</a></div>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <button class="edit btn bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
      <button class="del btn bg-red-500 text-white px-3 py-1 rounded">Delete</button>
    </div>`;
    el.querySelector('.edit').addEventListener('click', ()=>{
      postForm.id.value = r.id; postForm.title.value = r.title; postForm.desc.value = r.description; postForm.link.value = r.link; postForm.category.value = r.category || ''; uploadedUrl.textContent = r.image || '';
      if (r.image) { previewImg.src = r.image; previewImg.classList.remove('hidden'); } else { previewImg.src=''; previewImg.classList.add('hidden'); }
      showForm();
    });
    el.querySelector('.del').addEventListener('click', async ()=>{
      if (!confirm('Delete this post?')) return;
      disableButtons(true);
      const res = await fetch('/api/posts/'+encodeURIComponent(r.id), {method:'DELETE'});
      const json = await res.json();
      disableButtons(false);
      if (json.ok) loadPosts(); else alert(json.error || 'Error');
    });
    postsList.appendChild(el);
  });
  pageInfo.textContent = `Page ${page} / ${pages}`;
  prevBtn.disabled = (page <= 1);
  nextBtn.disabled = (page >= pages);
  // clear highlight after render
  if (highlightId) setTimeout(()=>{ highlightId = null; renderPage(); }, 2500);
}

prevBtn.addEventListener('click', ()=>{ if (page>1) { page--; renderPage(); }});
nextBtn.addEventListener('click', ()=>{ const pages = Math.max(1, Math.ceil(allPosts.length / perPage)); if (page < pages) { page++; renderPage(); }});

uploadBtn.addEventListener('click', async ()=>{
  const file = postForm.image.files[0];
  if (!file) return alert('Choose file');
  uploadBtn.disabled = true; uploadBtn.textContent = 'Uploading...';
  try{
    // fetch cloudinary config from server
    const cfgRes = await fetch('/api/cloudinary-config');
    if (!cfgRes.ok) { throw new Error('Cloudinary not configured'); }
    const cfg = await cfgRes.json();
    const url = `https://api.cloudinary.com/v1_1/${cfg.cloud_name}/image/upload`;
    const fd = new FormData(); fd.append('file', file); fd.append('upload_preset', cfg.upload_preset);
    const res = await fetch(url, { method: 'POST', body: fd });
    if (!res.ok) {
      let errText;
      try { const ej = await res.json(); errText = JSON.stringify(ej); }
      catch(e){ errText = await res.text(); }
      console.error('Cloudinary upload error', res.status, errText);
      if (res.status === 404) throw new Error('Cloudinary not found (check CLOUDINARY_CLOUD_NAME). Response: ' + errText);
      if (res.status === 401 || res.status === 403) throw new Error('Cloudinary auth error (check upload preset and that it is unsigned). Response: ' + errText);
      throw new Error('Upload failed: ' + errText);
    }
    const j = await res.json();
    uploadBtn.disabled = false; uploadBtn.textContent = 'Upload image';
    if (j.secure_url) { uploadedUrl.textContent = j.secure_url; previewImg.src = j.secure_url; previewImg.classList.remove('hidden'); formMsg.textContent = 'Rasm yuklandi.'; setTimeout(()=>formMsg.textContent='',3000);} else { formMsg.textContent = 'Yuklashda muammo: no secure_url'; }
  }catch(err){ uploadBtn.disabled = false; uploadBtn.textContent = 'Upload image'; formMsg.textContent = 'Xato: ' + (err.message || err); }
});

function disableButtons(v){ [createBtn, updateBtn, uploadBtn, resetBtn].forEach(b=>b.disabled = v); }

createBtn.addEventListener('click', async ()=>{
  const id = postForm.id.value.trim();
  const title = postForm.title.value.trim();
  if (!id || !title) return alert('ID and title are required');
  const exists = allPosts.find(p=>p.id === id);
  if (exists){
    if (!confirm('A post with this ID exists. Click OK to overwrite (this performs an Update), Cancel to abort.')) return;
    // perform update
    const body = { title, description: postForm.desc.value.trim(), link: postForm.link.value.trim(), image: uploadedUrl.textContent };
    disableButtons(true);
    const res = await fetch('/api/posts/'+encodeURIComponent(id), {method:'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)});
    const j = await res.json(); disableButtons(false);
    if (j.ok) { loadPosts(); resetForm(); formMsg.textContent='Updated.'; setTimeout(()=>formMsg.textContent='',3000); highlightId = id; showList(); } else alert(j.error || 'Error');
    return;
  }
  const body = { id, title, description: postForm.desc.value.trim(), link: postForm.link.value.trim(), image: uploadedUrl.textContent, category: postForm.category.value };
  createBtn.disabled = true; createBtn.textContent = 'Creating...';
  const res = await postJSON('/api/posts', body);
  createBtn.disabled = false; createBtn.textContent = 'Create';
  if (res.ok) { loadPosts(); resetForm(); formMsg.textContent='Created.'; setTimeout(()=>formMsg.textContent='',3000); highlightId = id; showList(); } else alert(res.error || 'Error');
});

updateBtn.addEventListener('click', async ()=>{
  const id = postForm.id.value.trim();
  if (!id) return alert('ID required');
  const body = { title: postForm.title.value.trim(), description: postForm.desc.value.trim(), link: postForm.link.value.trim(), image: uploadedUrl.textContent, category: postForm.category.value };
  updateBtn.disabled = true; updateBtn.textContent = 'Updating...';
  const res = await fetch('/api/posts/'+encodeURIComponent(id), {method:'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)});
  const j = await res.json();
  updateBtn.disabled = false; updateBtn.textContent = 'Update';
  if (j.ok) { loadPosts(); resetForm(); formMsg.textContent='Updated.'; setTimeout(()=>formMsg.textContent='',3000); highlightId = id; showList(); } else alert(j.error || 'Error');
});

resetBtn.addEventListener('click', resetForm);

nextPanelBtn.addEventListener('click', ()=>{ showList(); });
addNewBtn.addEventListener('click', ()=>{ showForm(); });
fixCatBtn && fixCatBtn.addEventListener('click', async ()=>{
  if (!confirm('Run migration to set missing categories to "uncategorized"?')) return;
  fixCatBtn.disabled = true; fixCatBtn.textContent = 'Running...';
  try{
    const res = await fetch('/api/migrate-categories', {method: 'POST', credentials: 'same-origin'});
    const j = await res.json();
    if (j.ok) { alert('Done. Updated ' + j.changed + ' posts.'); await loadPosts(); showList(); } else alert(j.error || 'Failed');
  }catch(e){ alert('Error: ' + e.message); }
  fixCatBtn.disabled = false; fixCatBtn.textContent = 'Fix categories';
});

function resetForm(){ postForm.id.value=''; postForm.title.value=''; postForm.desc.value=''; postForm.link.value=''; postForm.image.value=''; uploadedUrl.textContent = ''; previewImg.src=''; previewImg.classList.add('hidden'); }

function showList(){ document.getElementById('form-section').classList.add('hidden'); document.getElementById('list-section').classList.remove('hidden'); // ensure posts refreshed
  renderPage(); window.location.hash = '#posts-list'; }
function showForm(){ document.getElementById('list-section').classList.add('hidden'); document.getElementById('form-section').classList.remove('hidden'); window.location.hash = '#form-section'; }

// On load, check if admin session exists and show posts list by default
(async function initAuth(){
  try{
    const res = await fetch('/api/me', {credentials: 'same-origin'});
    if (res.ok){ loginArea.classList.add('hidden'); appArea.classList.remove('hidden'); await loadPosts(); showList(); }
  }catch(e){ /* ignore */ }
})();
