const { supabaseAdmin } = require('../config/supabase');

exports.getProducts = async (req, res) => {
  try {
    if (!supabaseAdmin) {
      throw new Error('Database connection not established (missing credentials)');
    }
    const { category, featured, search } = req.query;
    let query = supabaseAdmin.from('products').select('*, product_images(*)');

    if (category) query = query.eq('category_id', category);
    if (featured) query = query.eq('is_featured', true);
    if (search) query = query.ilike('name', `%${search}%`);

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*, product_images(*), product_variants(*)')
      .eq('slug', req.params.slug)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: 'Product not found' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([req.body])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
