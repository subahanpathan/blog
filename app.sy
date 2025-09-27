const form = document.getElementById("postForm");
const postsDiv = document.getElementById("posts");

// Load saved posts
let posts = JSON.parse(localStorage.getItem("posts")) || [];

// Render posts
function renderPosts() {
  postsDiv.innerHTML = "";
  posts.forEach((post, index) => {
    postsDiv.innerHTML += `
      <div class="post">
        <h2>${post.title}</h2>
        <p>${post.content}</p>
      </div>
    `;
  });
}

// Add post
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  posts.push({ title, content });
  localStorage.setItem("posts", JSON.stringify(posts));

  form.reset();
  renderPosts();
});

// Initial render
renderPosts();
