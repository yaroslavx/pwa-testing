window.addEventListener('load', async () => {
  if (navigator.serviceWorker) {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
    } catch (err) {
      console.log(err);
    }
  }
  await loadPosts();
});

async function loadPosts() {
  const res = await fetch(
    'https://jsonplaceholder.typicode.com/posts?_limit=11'
  );
  const data = await res.json();

  const container = document.querySelector('#posts');
  container.innerHTML = data.map(toCard).join('\n');
}

function toCard(post) {
  return `
    <div class="card">
      <div class="card-title">
        ${post.title}
      </div>
      <div class="card-body">
        ${post.body}
      </div>
    </div>
  `;
}
