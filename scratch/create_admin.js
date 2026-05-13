import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  const email = 'nug7795@gmail.com';
  const password = 'Hifjur123';

  console.log(`Attempting to create admin user: ${email}`);

  // Check if user already exists
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing users:', listError.message);
    return;
  }

  const existingUser = users.users.find(u => u.email === email);

  if (existingUser) {
    console.log('User already exists. Updating password...');
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      { password: password, email_confirm: true }
    );
    if (updateError) {
        console.error('Error updating user:', updateError.message);
    } else {
        console.log('Admin user updated successfully!');
    }
  } else {
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { role: 'admin' }
    });

    if (createError) {
      console.error('Error creating user:', createError.message);
    } else {
      console.log('Admin user created successfully!');
      
      // Also create a profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: newUser.user.id,
          full_name: 'Super Admin',
          phone: ''
        });
      
      if (profileError) {
          console.error('Error creating profile:', profileError.message);
      } else {
          console.log('Profile created successfully!');
      }
    }
  }
}

createAdminUser();
