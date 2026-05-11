const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=');
  if (key && value) acc[key.trim()] = value.trim();
  return acc;
}, {});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkTables() {
  console.log('Checking Supabase URL:', env.NEXT_PUBLIC_SUPABASE_URL);
  
  const { data: protocols, error: protocolError } = await supabase.from('protocols').select('*').limit(1);
  if (protocolError) {
    console.error('Error fetching protocols:', protocolError.message);
  } else {
    console.log('Protocols table exists. Items found:', protocols.length);
  }

  const { data: posts, error: postsError } = await supabase.from('posts').select('*').limit(1);
  if (postsError) {
    console.error('Error fetching posts:', postsError.message);
  } else {
    console.log('Posts table exists. Items found:', posts.length);
  }

  const { data: users, error: userError } = await supabase.from('users').select('*').limit(1);
  if (userError) {
    console.error('Error fetching users:', userError.message);
  } else {
    console.log('Users table exists. Items found:', users.length);
  }
}

checkTables();
