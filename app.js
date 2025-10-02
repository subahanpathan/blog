const form = document.getElementById("postForm");
const postsDiv = document.getElementById("posts");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const imageInput = document.getElementById("image");
const commentInput = document.getElementById("commentInput");
const commentNameInput = document.getElementById("commentNameInput");
const addCommentBtn = document.getElementById("addCommentBtn");
const commentsList = document.getElementById("commentsList");

let posts = JSON.parse(localStorage.getItem("posts")) || [];
let currentPostIndex = null;

// Render posts
function renderPosts(filter = "", category = "") {
  postsDiv.innerHTML = "";

  let filteredPosts = posts.filter(
    (p) =>
      (p.title.toLowerCase().includes(filter.toLowerCase()) ||
        p.content.toLowerCase().includes(filter.toLowerCase())) &&
      (category === "" || p.category === category)
  );

  if (filteredPosts.length === 0) {
    postsDiv.innerHTML = `<div class="text-center text-muted"><p>😔 No posts found. Try writing one!</p></div>`;
    return;
  }

  filteredPosts.forEach((post, index) => {
    postsDiv.innerHTML += `
      <div class="col-md-6 col-lg-4">
        <div class="card mb-4 shadow-sm h-100">
          <div class="card-body d-flex flex-column">
            ${post.image ? `<img src="${post.image}" class="post-img" alt="Post Image">` : ""}
            <h5 class="card-title text-primary">${post.title}</h5>
            <span class="badge bg-info mb-2">${post.category}</span>
            <p class="card-text flex-grow-1">${post.content.substring(0,120)}${post.content.length>120?'...':''}</p>
            <small class="text-muted">📅 ${post.date}</small>
            <div class="mt-3 d-flex justify-content-between align-items-center">
              <button class="btn btn-sm btn-info" onclick="openPost(${index})">🔍 Read More</button>
              <div>
                <button class="like-btn" onclick="likePost(${index})">❤️ ${post.likes||0}</button>
                <button class="btn btn-sm btn-warning me-1" onclick="editPost(${index})">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="deletePost(${index})">🗑️</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

// Add post
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const category = document.getElementById("category").value;

  const reader = new FileReader();
  if (imageInput.files[0]) {
    reader.readAsDataURL(imageInput.files[0]);
    reader.onload = () => { savePost(title, content, category, reader.result); };
  } else { savePost(title, content, category, null); }
});

function savePost(title, content, category, image){
  const newPost = {
    title, content, category, image,
    date: new Date().toLocaleString(),
    likes:0, comments:[]
  };
  posts.unshift(newPost);
  localStorage.setItem("posts", JSON.stringify(posts));
  form.reset();
  renderPosts();
}

function likePost(index){
  posts[index].likes = (posts[index].likes||0)+1;
  localStorage.setItem("posts", JSON.stringify(posts));
  renderPosts(searchInput.value, categoryFilter.value);
}

function deletePost(index){
  posts.splice(index,1);
  localStorage.setItem("posts", JSON.stringify(posts));
  renderPosts(searchInput.value, categoryFilter.value);
}

function editPost(index){
  const newTitle = prompt("Edit Title:", posts[index].title);
  const newContent = prompt("Edit Content:", posts[index].content);
  const newCategory = prompt("Edit Category (Tech, Lifestyle, Travel, Food, Other):", posts[index].category);

  if(newTitle!==null && newContent!==null && newCategory!==null){
    posts[index].title = newTitle;
    posts[index].content = newContent;
    posts[index].category = newCategory;
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts(searchInput.value, categoryFilter.value);
  }
}

// Open post modal
function openPost(index){
  currentPostIndex = index;
  const post = posts[index];

  document.getElementById("modalTitle").innerText = post.title;
  document.getElementById("modalContent").innerText = post.content;
  document.getElementById("modalCategory").innerText = post.category;
  document.getElementById("modalDate").innerText = "📅 " + post.date;

  const modalImage = document.getElementById("modalImage");
  if(post.image){ modalImage.src = post.image; modalImage.classList.remove("d-none"); }
  else{ modalImage.classList.add("d-none"); }

  renderComments();
  new bootstrap.Modal(document.getElementById("readMoreModal")).show();
}

// Comments
function renderComments(){
  commentsList.innerHTML="";
  const comments = posts[currentPostIndex].comments || [];
  if(comments.length===0){
    commentsList.innerHTML='<li class="list-group-item text-muted">No comments yet. Be the first!</li>';
    return;
  }

  comments.forEach((c, idx)=>{
    commentsList.innerHTML+=`
      <li class="list-group-item d-flex justify-content-between align-items-start">
        <div><strong>${c.name}:</strong> ${c.text}</div>
        <div>
          <button class="btn btn-sm btn-warning me-1" onclick="editComment(${idx})">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="deleteComment(${idx})">🗑️</button>
        </div>
      </li>
    `;
  });
}

addCommentBtn.addEventListener("click", ()=>{
  const name = commentNameInput.value.trim() || "Anonymous";
  const text = commentInput.value.trim();
  if(!text) return;

  if(!posts[currentPostIndex].comments) posts[currentPostIndex].comments = [];
  posts[currentPostIndex].comments.push({name,text});
  localStorage.setItem("posts", JSON.stringify(posts));

  commentInput.value="";
  commentNameInput.value="";
  renderComments();
});

function editComment(idx){
  const newText = prompt("Edit Comment:", posts[currentPostIndex].comments[idx].text);
  if(newText!==null){
    posts[currentPostIndex].comments[idx].text = newText;
    localStorage.setItem("posts", JSON.stringify(posts));
    renderComments();
  }
}

function deleteComment(idx){
  if(confirm("Delete this comment?")){
    posts[currentPostIndex].comments.splice(idx,1);
    localStorage.setItem("posts", JSON.stringify(posts));
    renderComments();
  }
}

// Search & filter
searchInput.addEventListener("input", e=>{ renderPosts(e.target.value, categoryFilter.value); });
categoryFilter.addEventListener("change", e=>{ renderPosts(searchInput.value, e.target.value); });

// Initial render
renderPosts();
