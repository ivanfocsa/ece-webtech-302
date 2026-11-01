import { createClient } from './supabase/client';

// Ajoute le nombre de likes à chaque article (relation likes(count) de Supabase)
function withLikes(article) {
  const { likes, ...rest } = article;
  return { ...rest, likes_count: likes?.[0]?.count ?? 0 };
}

/**
 * Récupère la liste des articles avec filtre optionnel par recherche et catégorie.
 */
export async function getArticles({ query = '', category = '', limit = null } = {}) {
  try {
    let req = createClient().from('articles').select('*, likes(count)').order('created_at', { ascending: false });

    if (category && category !== 'Toutes') req = req.eq('category', category);
    if (query) req = req.or(`title.ilike.%${query}%,summary.ilike.%${query}%`);
    if (limit) req = req.limit(limit);

    const { data, error } = await req;
    return error ? [] : data.map(withLikes);
  } catch {
    return [];
  }
}

/**
 * Récupère un article par son ID.
 */
export async function getArticleById(id) {
  try {
    const { data, error } = await createClient().from('articles').select('*, likes(count)').eq('id', id).single();
    return error ? null : withLikes(data);
  } catch {
    return null;
  }
}

/**
 * Identifiants des articles pré-générés au build (generateStaticParams).
 */
export async function getStaticArticleIds() {
  const articles = await getArticles();
  return articles.map((a) => a.id);
}

/**
 * Crée un nouvel article.
 */
export async function createArticle({ title, category, summary, content, userId, authorName }) {
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const { data, error } = await createClient()
    .from('articles')
    .insert([{ title, slug: `${slug}-${Date.now().toString(36)}`, category, summary, content, user_id: userId, author_name: authorName }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Met à jour un article (la règle RLS n'autorise que l'auteur).
 */
export async function updateArticle(id, { title, category, summary, content }) {
  const { data, error } = await createClient()
    .from('articles')
    .update({ title, category, summary, content, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Supprime un article (la règle RLS n'autorise que l'auteur).
 */
export async function deleteArticle(id) {
  const { error } = await createClient().from('articles').delete().eq('id', id);
  if (error) throw error;
}

/**
 * Ajoute ou retire le like de l'utilisateur sur un article.
 */
export async function getArticleLikes(articleId, userId = null) {
  {
    const supabase = createClient();
    const { count, error } = await supabase.from('likes')
      .select('*', { count: 'exact', head: true }).eq('article_id', articleId);
    if (error) throw error;
    let userHasLiked = false;
    if (userId) {
      const { data, error: userError } = await supabase.from('likes').select('id')
        .eq('article_id', articleId).eq('user_id', userId).maybeSingle();
      if (userError) throw userError;
      userHasLiked = Boolean(data);
    }
    return { count: count ?? 0, userHasLiked };
  }
}

/** Ajoute ou retire le like de l'utilisateur courant. */
export async function toggleLike(articleId, userId) {
  if (!userId) throw new Error('Authentification requise pour liker.');
  {
    const supabase = createClient();
    const { data: existing, error: readError } = await supabase.from('likes').select('id')
      .eq('article_id', articleId).eq('user_id', userId).maybeSingle();
    if (readError) throw readError;
    const { error } = existing
      ? await supabase.from('likes').delete().eq('id', existing.id).eq('user_id', userId)
      : await supabase.from('likes').insert([{ article_id: articleId, user_id: userId }]);
    if (error) throw error;
    return { liked: !existing };
  }
}

/**
 * Récupère les commentaires d'un article.
 */
export async function getArticleComments(articleId) {
  const { data, error } = await createClient()
    .from('comments')
    .select('*')
    .eq('article_id', articleId)
    .order('created_at', { ascending: true });

  return error ? [] : data;
}

/**
 * Ajoute un commentaire.
 */
export async function addComment({ articleId, userId, authorName, content }) {
  const { data, error } = await createClient()
    .from('comments')
    .insert([{ article_id: articleId, user_id: userId, author_name: authorName, content }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Supprime un commentaire (la règle RLS n'autorise que l'auteur).
 */
export async function deleteComment(commentId, userId) {
  const { error } = await createClient().from('comments').delete().eq('id', commentId).eq('user_id', userId);
  if (error) throw error;
}
