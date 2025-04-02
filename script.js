const posts = JSON.parse(localStorage.getItem('posts')) || [];


function displayPosts() {
  const postsList = document.getElementById('posts-list');
  postsList.innerHTML = ''; 

  posts.forEach((post, index) => {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');

    postDiv.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content.slice(0, 100)}...</p>
      ${post.image ? `<img src="${post.image}" alt="Post Image" class="post-image">` : ''}
      <a href="post.html?id=${index}">Read more</a>
    `;
    postsList.appendChild(postDiv);
  });
}


function createPost(event) {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const image = document.getElementById('image').files[0];

  const newPost = {
    title: title,
    content: content,
    image: null,
  };

  if (image) {
    const reader = new FileReader();

    reader.onloadend = function () {
      newPost.image = reader.result;

      
      const urlParams = new URLSearchParams(window.location.search);
      const postId = urlParams.get('id');

      if (postId !== null) {
        
        posts[postId] = newPost;
      } else {
        
        posts.push(newPost);
      }

      localStorage.setItem('posts', JSON.stringify(posts));
      window.location.href = 'index.html'; 
    };

    reader.readAsDataURL(image);
  } else {
    
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (postId !== null) {
        const existingPost = posts[postId];
        newPost.image = existingPost.image; 
     
      posts[postId] = newPost;
    } else {
      
      posts.push(newPost);
    }

    localStorage.setItem('posts', JSON.stringify(posts));
    window.location.href = 'index.html'; 
  }
}


function displayPost() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  if (postId !== null) {
    const post = posts[postId];

    
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-content').textContent = post.content;

    if (post.image) {
      const postContent = document.getElementById('post-content');
      postContent.innerHTML += `<img src="${post.image}" alt="Post Image" class="post-image">`;
    }

    
    document.getElementById('edit-button').addEventListener('click', () => {
      window.location.href = `new-post.html?id=${postId}`; 
    });

    
    document.getElementById('delete-button').addEventListener('click', () => {
      posts.splice(postId, 1); 
      localStorage.setItem('posts', JSON.stringify(posts));
      window.location.href = 'index.html'; 
    });
  }
}


function loadEditForm() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  if (postId !== null) {
    const post = posts[postId];
    document.getElementById('title').value = post.title;
    document.getElementById('content').value = post.content;

    const imageInput = document.getElementById('image');
    
    if (post.image) {
        
        const imagePreview = document.createElement('img');
        imagePreview.src = post.image;
        imagePreview.alt = 'Existing Post Image';
        imagePreview.classList.add('image-preview');
        
        const imagePreviewContainer = document.getElementById('image-preview-container');
        imagePreviewContainer.innerHTML = '';  
        imagePreviewContainer.appendChild(imagePreview);
      } else {
        
        const imagePreviewContainer = document.getElementById('image-preview-container');
        imagePreviewContainer.innerHTML = ''; 
        
    }
  }
}


if (document.getElementById('posts-list')) {
  displayPosts();
}


if (document.getElementById('post-title')) {
  displayPost();
}


if (document.getElementById('create-post-form')) {
  document.getElementById('create-post-form').addEventListener('submit', createPost);
  loadEditForm();
}

