import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CommunityPost, CommunityReply } from '../types';
import { MessageSquare, Heart, MessageCircle, Send, Plus, X, Search, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../lib/translations';

interface CommunityProps {
  language?: Language;
}

const cTrans: Record<string, Record<string, string>> = {
  header_badge: {
    ta: "வேளாண் சமூக மன்றம்",
    en: "Vivasayam Forum"
  },
  header_title: {
    ta: "வேளாண் சமூக மன்றம் (Farmer Forum)",
    en: "Farmers Community Forum"
  },
  header_desc: {
    ta: "தமிழக விவசாயிகளுடன் உங்கள் சந்தேகங்களைப் பகிர்ந்து கொள்ளுங்கள், பயிர் ஆலோசனை மற்றும் இயற்கை முறைகளைக் கற்றுக்கொள்ளுங்கள்.",
    en: "Share agricultural questions and insights with fellow farmers, learn crop management tips and organic methods."
  },
  new_topic_btn: {
    ta: "விவாதம் துவங்கு (New Topic)",
    en: "Ask Question (New Topic)"
  },
  search_title: {
    ta: "தேடல் (Search Forum)",
    en: "Search Forum"
  },
  search_placeholder: {
    ta: "கருத்துக்களைத் தேடுக...",
    en: "Search questions or topics..."
  },
  categories_title: {
    ta: "பிரிவுகள் (Categories)",
    en: "Discussion Categories"
  },
  all_categories: {
    ta: "அனைத்தும் (All)",
    en: "All Discussions"
  },
  category_paddy: {
    ta: "நெல் (Paddy)",
    en: "Paddy"
  },
  category_tomato: {
    ta: "தக்காளி (Tomato)",
    en: "Tomato"
  },
  category_organic: {
    ta: "இயற்கை விவசாயம் (Organic)",
    en: "Organic Farming"
  },
  category_general: {
    ta: "பொதுவானவை (General)",
    en: "General"
  },
  guidelines_title: {
    ta: "மன்றத்தின் விதிமுறைகள்",
    en: "Community Guidelines"
  },
  guidelines_desc: {
    ta: "விவசாயிகளுக்கிடையே பரஸ்பர மரியாதையுடனும் உதவியுடனும் உரையாடுங்கள். வதந்திகளையோ தவறான விளம்பரங்களையோ பகிர்வதைத் தவிர்க்கவும்.",
    en: "Please communicate with mutual respect. Avoid sharing unverified rumors or promotional advertisements."
  },
  new_post_title: {
    ta: "புதிய விவாதம் ஆரம்பி (Create New Topic)",
    en: "Start a New Discussion"
  },
  topic_title_label: {
    ta: "விவாதத்தின் தலைப்பு (Topic Title)",
    en: "Discussion Title"
  },
  title_placeholder: {
    ta: "எ.கா. பருத்தி பயிரில் பூச்சி தாக்குதலை தடுப்பது எப்படி?",
    en: "e.g., How to prevent blast disease in Paddy?"
  },
  category_label: {
    ta: "பிரிவு (Category)",
    en: "Choose Category"
  },
  content_label: {
    ta: "விளக்கம் (Content Detail)",
    en: "Detailed Description"
  },
  content_placeholder: {
    ta: "உங்கள் கேள்வி அல்லது அனுபவங்களை விரிவாகப் பகிருங்கள்...",
    en: "Please share your questions or experiences in detail..."
  },
  cancel_btn: {
    ta: "இரத்து செய் (Cancel)",
    en: "Cancel"
  },
  publish_btn: {
    ta: "வெளியிடு (Publish Post)",
    en: "Publish Post"
  },
  publishing: {
    ta: "பதிவேற்றப்படுகிறது...",
    en: "Publishing..."
  },
  loading_posts: {
    ta: "விவாதங்களை ஏற்றுகிறது...",
    en: "Loading discussion topics..."
  },
  no_posts_found: {
    ta: "விவாதங்கள் எதுவும் காணப்படவில்லை.",
    en: "No discussions found yet."
  },
  no_posts_desc: {
    ta: "புதிய விவாதம் துவக்கி உரையாடலைத் தொடங்குங்கள்.",
    en: "Be the first to start a discussion by clicking New Topic."
  },
  replies_count: {
    ta: "பதில்கள்",
    en: "Replies"
  },
  replies_section_title: {
    ta: "விவாதப் பதில்கள் (Replies):",
    en: "Discussion Replies:"
  },
  no_replies: {
    ta: "பதில்கள் எதுவும் இல்லை. முதல் ஆளாகப் பதிலளிக்கவும்!",
    en: "No replies yet. Be the first to answer!"
  },
  write_reply_placeholder: {
    ta: "உங்கள் பதிலை இங்கே எழுதுங்கள்...",
    en: "Write your answer here..."
  },
  login_to_reply: {
    ta: "பதிலளிக்க முதலில் உள்நுழையவும்",
    en: "Sign in to reply"
  },
  login_to_post: {
    ta: "விவாதங்களை உருவாக்க முதலில் உள்நுழையவும்! Please Login to create discussions.",
    en: "Please login to start a discussion."
  },
  fetch_error: {
    ta: "விவாதங்களைப் பதிவிறக்க முடியவில்லை.",
    en: "Failed to load discussions."
  },
  conn_error: {
    ta: "இணைப்புப் பிழை.",
    en: "Connection error."
  },
  publish_failed: {
    ta: "வெளியிட முடியவில்லை.",
    en: "Failed to publish."
  }
};

const getCT = (key: string, lang: Language): string => {
  const translationsForKey = cTrans[key];
  if (!translationsForKey) return '';
  return translationsForKey[lang] || translationsForKey['en'] || '';
};

export default function Community({ language = 'ta' }: CommunityProps) {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering & Search
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // New Post Form
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [submittingPost, setSubmittingPost] = useState(false);

  // Active Post for Replies / Expanded Post ID
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, CommunityReply[]>>({});
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({});
  const [newReplyContent, setNewReplyContent] = useState<Record<string, string>>({});

  // Categories list
  const categories = ['All', 'Paddy', 'Tomato', 'Organic', 'General'];

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/community/posts');
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setPosts(data);
      } else {
        setError(getCT('fetch_error', language));
      }
    } catch (err) {
      console.error(err);
      setError(getCT('conn_error', language));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Submit a new post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert(getCT('login_to_post', language));
      return;
    }
    if (!newTitle.trim() || !newContent.trim()) return;

    setSubmittingPost(true);
    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          category: newCategory
        })
      });

      const data = await res.json();
      if (res.ok) {
        setPosts(prev => [data, ...prev]);
        setNewTitle('');
        setNewContent('');
        setNewCategory('General');
        setShowNewPostForm(false);
      } else {
        alert(data.error || getCT('publish_failed', language));
      }
    } catch (err) {
      console.error(err);
      alert(getCT('conn_error', language));
    } finally {
      setSubmittingPost(false);
    }
  };

  // Like a post
  const handleLikePost = async (postId: string) => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const res = await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers
      });
      if (res.ok) {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle replies and fetch them
  const handleToggleReplies = async (postId: string) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }
    
    setExpandedPostId(postId);
    if (replies[postId]) return; // already loaded

    try {
      setLoadingReplies(prev => ({ ...prev, [postId]: true }));
      const res = await fetch(`/api/community/posts/${postId}/replies`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setReplies(prev => ({ ...prev, [postId]: data }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReplies(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Send a reply
  const handleSendReply = async (postId: string) => {
    const textStr = newReplyContent[postId];
    if (!textStr || !textStr.trim() || !token) return;

    try {
      const res = await fetch(`/api/community/posts/${postId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: textStr })
      });
      const data = await res.json();
      if (res.ok) {
        setReplies(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), data]
        }));
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, repliesCount: p.repliesCount + 1 } : p));
        setNewReplyContent(prev => ({ ...prev, [postId]: '' }));
      } else {
        alert(data.error || 'Failed to add reply.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter & Search Logic
  const filteredPosts = posts.filter(post => {
    const matchesCategory = categoryFilter === 'All' || post.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getLocalizedCategoryName = (cat: string) => {
    switch(cat) {
      case 'All': return getCT('all_categories', language);
      case 'Paddy': return getCT('category_paddy', language);
      case 'Tomato': return getCT('category_tomato', language);
      case 'Organic': return getCT('category_organic', language);
      case 'General': return getCT('category_general', language);
      default: return cat;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="community-view-container">
      
      {/* Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
            {getCT('header_badge', language)}
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5 font-sans">
            {getCT('header_title', language)}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {getCT('header_desc', language)}
          </p>
        </div>

        {/* Create Post trigger button */}
        <button
          onClick={() => {
            if (!token) {
              alert(getCT('login_to_post', language));
              return;
            }
            setShowNewPostForm(true);
          }}
          className="inline-flex items-center space-x-2 bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-lg shadow-emerald-100 transition-all cursor-pointer shrink-0"
          id="btn-trigger-new-post"
        >
          <Plus className="h-4 w-4" />
          <span>{getCT('new_topic_btn', language)}</span>
        </button>
      </div>

      {/* Grid containing Sidebar Filters and Main Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Filters Sidebar */}
        <div className="space-y-4 lg:col-span-1">
          {/* Search Box */}
          <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-xl shadow-slate-100/50">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-2">{getCT('search_title', language)}</h3>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={getCT('search_placeholder', language)}
                className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-800"
              />
            </div>
          </div>

          {/* Category List */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xl shadow-slate-100/50">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="h-4 w-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">{getCT('categories_title', language)}</h3>
            </div>
            
            <div className="flex flex-col space-y-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex justify-between items-center cursor-pointer ${
                    categoryFilter === cat 
                      ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 font-bold' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{getLocalizedCategoryName(cat)}</span>
                  {categoryFilter === cat && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Community Guidelines Widget */}
          <div className="bg-gradient-to-tr from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Sparkles className="h-24 w-24" />
            </div>
            <h4 className="text-sm font-extrabold font-sans flex items-center space-x-1.5 text-emerald-400">
              <MessageSquare className="h-4 w-4" />
              <span>{getCT('guidelines_title', language)}</span>
            </h4>
            <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
              {getCT('guidelines_desc', language)}
            </p>
          </div>
        </div>

        {/* Right Column: Forum Feed */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* New Post Form Modal/Card */}
          <AnimatePresence>
            {showNewPostForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white border-2 border-emerald-600/30 p-6 rounded-3xl shadow-2xl shadow-emerald-50 relative"
              >
                <button
                  onClick={() => setShowNewPostForm(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>

                <h3 className="text-base font-bold text-slate-900 font-sans mb-4 flex items-center space-x-2">
                  <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                    <Plus className="h-4 w-4" />
                  </span>
                  <span>{getCT('new_post_title', language)}</span>
                </h3>

                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">{getCT('topic_title_label', language)}</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder={getCT('title_placeholder', language)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-slate-800 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{getCT('category_label', language)}</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2 bg-white text-xs focus:outline-none focus:border-emerald-500 text-slate-800"
                      >
                        <option value="General">{getCT('category_general', language)}</option>
                        <option value="Paddy">{getCT('category_paddy', language)}</option>
                        <option value="Tomato">{getCT('category_tomato', language)}</option>
                        <option value="Organic">{getCT('category_organic', language)}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">{getCT('content_label', language)}</label>
                    <textarea
                      required
                      rows={4}
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder={getCT('content_placeholder', language)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-slate-800 bg-white"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNewPostForm(false)}
                      className="px-4 py-2.5 border rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer"
                    >
                      {getCT('cancel_btn', language)}
                    </button>
                    <button
                      type="submit"
                      disabled={submittingPost}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                    >
                      {submittingPost ? getCT('publishing', language) : getCT('publish_btn', language)}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Posts Feed Listing */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-3"></div>
              <p className="text-xs text-slate-400 font-mono">{getCT('loading_posts', language)}</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 border border-red-100 rounded-2xl p-4 text-center text-xs font-semibold">
              {error}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-slate-50 border border-dashed rounded-3xl p-12 text-center text-slate-400">
              <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-2 animate-pulse" />
              <p className="text-sm font-semibold">{getCT('no_posts_found', language)}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{getCT('no_posts_desc', language)}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-100/30 hover:border-slate-200 transition-all"
                  id={`post-card-${post.id}`}
                >
                  {/* Category and Author header */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase font-mono">
                      {getLocalizedCategoryName(post.category)}
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {language === 'ta' ? 'பதிவு செய்த நாள்: ' : 'Posted on '} 
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Today'}
                    </p>
                  </div>

                  {/* Title and Content */}
                  <h3 className="text-base font-extrabold text-slate-900 font-sans tracking-tight mb-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {/* Post Footer Metadata & Actions */}
                  <div className="border-t border-slate-50 pt-4 mt-4 flex items-center justify-between">
                    {/* Author identity */}
                    <div className="flex items-center space-x-2">
                      <div className="h-7 w-7 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center font-mono">
                        {post.authorName ? post.authorName.charAt(0) : 'வி'}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{post.authorName}</span>
                    </div>

                    {/* Interactive buttons */}
                    <div className="flex items-center space-x-4">
                      {/* Like button */}
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className="flex items-center space-x-1.5 text-slate-400 hover:text-rose-500 transition-colors text-xs font-bold cursor-pointer group"
                      >
                        <Heart className="h-4 w-4 group-hover:scale-125 transition-transform" />
                        <span>{post.likes}</span>
                      </button>

                      {/* Reply/Comments Toggle button */}
                      <button
                        onClick={() => handleToggleReplies(post.id)}
                        className={`flex items-center space-x-1.5 transition-colors text-xs font-bold cursor-pointer ${
                          expandedPostId === post.id ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-600'
                        }`}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.repliesCount} {getCT('replies_count', language)}</span>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Replies Section */}
                  {expandedPostId === post.id && (
                    <div className="mt-5 border-t border-slate-100 pt-5 space-y-4 bg-slate-50/50 -mx-6 -mb-6 p-6 rounded-b-3xl">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">{getCT('replies_section_title', language)}</h4>
                      
                      {loadingReplies[post.id] ? (
                        <div className="py-4 text-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600 mx-auto"></div>
                        </div>
                      ) : (replies[post.id] || []).length === 0 ? (
                        <p className="text-xs text-slate-400 italic">{getCT('no_replies', language)}</p>
                      ) : (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                          {(replies[post.id] || []).map((reply) => (
                            <div key={reply.id} className="bg-white border border-slate-100 p-3.5 rounded-2xl shadow-sm">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-800">{reply.authorName}</span>
                                <span className="text-[9px] text-slate-400 font-mono">
                                  {reply.createdAt ? new Date(reply.createdAt).toLocaleDateString() : 'Today'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {reply.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Reply Input Form */}
                      <div className="flex space-x-2 mt-4 pt-2 border-t border-slate-100">
                        <input
                          type="text"
                          value={newReplyContent[post.id] || ''}
                          onChange={(e) => setNewReplyContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder={token ? getCT('write_reply_placeholder', language) : getCT('login_to_reply', language)}
                          disabled={!token}
                          className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-emerald-500 disabled:bg-slate-100 disabled:text-slate-400 text-slate-800"
                        />
                        <button
                          onClick={() => handleSendReply(post.id)}
                          disabled={!token || !(newReplyContent[post.id] || '').trim()}
                          className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl shadow transition-all cursor-pointer flex items-center justify-center"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
