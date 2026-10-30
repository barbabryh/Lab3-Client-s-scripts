const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const GET_URL = API_URL + '?_limit=5';

const loadBtn = document.getElementById('loadBtn');
const createBtn = document.getElementById('createBtn');
const form = document.getElementById('form');
const titleInput = document.getElementById('title');
const bodyInput = document.getElementById('body');
const postsBox = document.getElementById('posts');
const message = document.getElementById('message');

function showMessage(text, type) {
  message.textContent = text;
  message.className = type;
}

function addPost(title, body, extra) {
  const div = document.createElement('div');
  div.className = 'post';

  const h3 = document.createElement('h3');
  h3.textContent = title;

  const p = document.createElement('p');
  p.textContent = body;

  div.appendChild(h3);
  div.appendChild(p);

  if (extra) {
    const small = document.createElement('small');
    small.textContent = extra;
    div.appendChild(small);
  }
  postsBox.appendChild(div);
}

async function loadPosts() {
  loadBtn.disabled = true;
  showMessage('Загрузка...', '');

  try {
    const response = await fetch(GET_URL);
    if (!response.ok) {
      throw new Error('Ошибка сервера: ' + response.status);
    }
    const posts = await response.json();

    postsBox.innerHTML = '';
    for (const post of posts) {
      addPost(post.title, post.body);
    }
    showMessage('Загружено публикаций: ' + posts.length, 'ok');
  } catch (error) {
    showMessage('Не удалось загрузить публикации. ' + error.message + '. Попробуйте ещё раз.', 'error');
  } finally {
    loadBtn.disabled = false;
  }
}

async function createPost(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (title === '' || body === '') {
    showMessage('Заполните заголовок и текст.', 'error');
    return;
  }

  createBtn.disabled = true;
  showMessage('Отправка...', '');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title, body: body, userId: 1 })
    });
    if (!response.ok) {
      throw new Error('Ошибка сервера: ' + response.status);
    }
    const data = await response.json();

    addPost(data.title, data.body, 'ID: ' + data.id);
    showMessage('Публикация создана!', 'ok');
    form.reset();
  } catch (error) {
    showMessage('Не удалось отправить. ' + error.message + '. Попробуйте ещё раз.', 'error');
  } finally {
    createBtn.disabled = false;
  }
}

loadBtn.addEventListener('click', loadPosts);
form.addEventListener('submit', createPost);
