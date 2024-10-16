// Mock data
const mockUsers = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
];

const mockPosts = [
  { id: 1, title: 'First Post', content: 'This is the first post content', userId: 1 },
  { id: 2, title: 'Second Post', content: 'This is the second post content', userId: 2 },
  { id: 3, title: 'Third Post', content: 'This is the third post content', userId: 3 },
];

// Mock controller
const mockController = {
  getUsers: (req, res) => {
    res.json(mockUsers);
  },

  getUserById: (req, res) => {
    const userId = parseInt(req.params.id);
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  },

  getPosts: (req, res) => {
    res.json(mockPosts);
  },

  getPostById: (req, res) => {
    const postId = parseInt(req.params.id);
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  },
};

export default mockController;
