import { useState } from 'react';

function App() {
  const [postStatus, setPostStatus] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState({});

  function handlePostSubmit(event: any) {
    event.preventDefault();
    const postData = {
      title: title,
      content: content
    };

    fetch(`${import.meta.env.VITE_CANISTER_URL}/posts/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(json => {
      if (json.error) {
        setPostStatus(json.error);
      } else {
        setPostStatus(json.status);
        setTitle('');
        setContent('');
      }
    })
    .catch(error => {
      setPostStatus('An error occurred while adding the post.');
      console.error('Error:', error);
    });
  }

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      <form action="#" onSubmit={handlePostSubmit}>
        <label htmlFor="title">Post Title: &nbsp;</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <label htmlFor="content">Post Content: &nbsp;</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <br />
        <button type="submit">Submit Post</button>
      </form>
      <section id="postStatus">{postStatus}</section>
    </main>
  );
}

export default App;
