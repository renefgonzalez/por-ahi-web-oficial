import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zxczvfotwcdoreqezist.supabase.co';
const supabaseAnonKey = 'sb_publishable_GI3JjzQfGCjFDBlypwvmdw_DXoOx3Wh';

console.log('Connecting to Supabase at:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  try {
    const { data, error } = await supabase.from('products').select('*').limit(3);
    if (error) {
      console.error('Supabase query returned an error:', error);
      process.exit(1);
    } else {
      console.log('Connection to Supabase successful!');
      console.log(`Successfully fetched ${data.length} products from 'products' table.`);
      if (data.length > 0) {
        console.log('First product sample name:', data[0].name);
      }
      process.exit(0);
    }
  } catch (err) {
    console.error('An unexpected error occurred during communication:', err);
    process.exit(1);
  }
}

test();
