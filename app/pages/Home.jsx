import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, postsResponse] = await Promise.all([
          axios.get('/api/mock/users'),
          axios.get('/api/mock/posts')
        ]);
        setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
        setPosts(Array.isArray(postsResponse.data) ? postsResponse.data : []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Users</h2>
        {users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(user => (
              <div key={user.id} className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-green-300">{user.email}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No users found.</p>
        )}
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">Posts</h2>
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-xl font-semibold">{post.title}</h3>
                <p className="text-green-300">{post.content}</p>
                <p className="text-sm text-gray-400 mt-2">Posted by User ID: {post.userId}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No posts found.</p>
        )}
      </section>
    </div>
  );
};

export default Home;
