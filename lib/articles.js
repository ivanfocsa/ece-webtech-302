import { createClient } from './supabase/client';
import { initialArticles, initialComments } from './mock-data';

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes('placeholder') && !url.includes('your-project'));
}

/**
 * Récupère la liste des articles avec filtre optionnel par recherche et catégorie.
 */
export async function getArticles({ query = '', category = '', limit = null } = {}) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      let req = supabase.from('articles').select('*').order('created_at', { ascending: false });

      if (category && category !== 'Toutes') {
        req = req.eq('category', category);
      }
      if (query) {
        req = req.or(`title.ilike.%${query}%,summary.ilike.%${query}%`);
      }
      if (limit) {
        req = req.limit(limit);
      }

      const { data, error } = await req;
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback sur mock data
    }
  }

  // Filtrage local en mémoire
  let results = [...initialArticles];

  if (category && category !== 'Toutes') {
    results = results.filter((a) => a.category.toLowerCase() === category.toLowerCase());
  }
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q)
    );
  }
  if (limit) {
    results = results.slice(0, limit);
  }

  return results;
}

/**
 * Récupère un article par son ID ou son slug.
 */
export async function getArticleById(idOrSlug) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      const column = isUuid ? 'id' : 'slug';

      const { data, error } = await supabase.from('articles').select('*').eq(column, idOrSlug).single();
      if (!error && data) {
        return data;
      }
    } catch {
      // Fallback sur mock data
    }
  }

  return initialArticles.find((a) => a.id === idOrSlug || a.slug === idOrSlug) || null;
}

/**
 * Récupère les identifiants d'articles pour generateStaticParams.
 */
export async function getStaticArticleIds() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('articles').select('id');
      if (!error && data && data.length > 0) {
        return data.map((item) => item.id);
      }
    } catch {
      // Fallback
    }
  }

  return initialArticles.map((a) => a.id);
}

/**
 * Crée un nouvel article.
 */
export async function createArticle({ title, category, summary, content, userId, authorName }) {
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .insert([
        {
          title,
          slug: `${slug}-${Date.now().toString(36)}`,
          category,
          summary,
          content,
          user_id: userId,
          author_name: authorName,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  const newArticle = {
    id: `art-${Date.now()}`,
    title,
    slug: `${slug}-${Date.now().toString(36)}`,
    category,
    summary,
    content,
    user_id: userId,
    author_name: authorName,
    reading_time: '3 min',
    likes_count: 0,
    created_at: new Date().toISOString(),
  };

  initialArticles.unshift(newArticle);
  return newArticle;
}

/**
 * Met à jour un article existant.
 */
export async function updateArticle(id, { title, category, summary, content }) {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .update({ title, category, summary, content, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  const index = initialArticles.findIndex((a) => a.id === id);
  if (index !== -1) {
    initialArticles[index] = {
      ...initialArticles[index],
      title,
      category,
      summary,
      content,
      updated_at: new Date().toISOString(),
    };
    return initialArticles[index];
  }
  return null;
}

/**
 * Supprime un article.
 */
export async function deleteArticle(id) {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  const index = initialArticles.findIndex((a) => a.id === id);
  if (index !== -1) {
    initialArticles.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Récupère les likes d'un article et vérifie si l'utilisateur courant a liké.
 */
export async function getArticleLikes(articleId, userId = null) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', articleId);

      let userHasLiked = false;
      if (userId) {
        const { data: userLike } = await supabase
          .from('likes')
          .select('id')
          .eq('article_id', articleId)
          .eq('user_id', userId)
          .maybeSingle();
        userHasLiked = Boolean(userLike);
      }

      return { count: count || 0, userHasLiked };
    } catch {
      // Fallback
    }
  }

  const article = initialArticles.find((a) => a.id === articleId);
  return {
    count: article ? article.likes_count : 0,
    userHasLiked: false,
  };
}

/**
 * Bascule le like d'un article.
 */
export async function toggleLike(articleId, userId) {
  if (!userId) throw new Error('Authentification requise pour liker.');

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data: existing } = await supabase
      .from('likes')
      .select('id')
      .eq('article_id', articleId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      await supabase.from('likes').delete().eq('id', existing.id);
      return { liked: false };
    } else {
      await supabase.from('likes').insert([{ article_id: articleId, user_id: userId }]);
      return { liked: true };
    }
  }

  const article = initialArticles.find((a) => a.id === articleId);
  if (article) {
    article.likes_count += 1;
    return { liked: true, count: article.likes_count };
  }
  return { liked: true };
}

/**
 * Récupère les commentaires d'un article.
 */
export async function getArticleComments(articleId) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('article_id', articleId)
        .order('created_at', { ascending: true });

      if (!error && data) return data;
    } catch {
      // Fallback
    }
  }

  return initialComments.filter((c) => c.article_id === articleId);
}

/**
 * Ajoute un commentaire.
 */
export async function addComment({ articleId, userId, authorName, content }) {
  if (!userId) throw new Error('Authentification requise pour commenter.');

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          article_id: articleId,
          user_id: userId,
          author_name: authorName,
          content,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  const newComment = {
    id: `com-${Date.now()}`,
    article_id: articleId,
    user_id: userId,
    author_name: authorName,
    content,
    created_at: new Date().toISOString(),
  };

  initialComments.push(newComment);
  return newComment;
}

/**
 * Supprime un commentaire.
 */
export async function deleteComment(commentId, userId) {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }

  const index = initialComments.findIndex((c) => c.id === commentId);
  if (index !== -1) {
    initialComments.splice(index, 1);
    return true;
  }
  return false;
}
