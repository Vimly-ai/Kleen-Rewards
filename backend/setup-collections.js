const PocketBase = require('pocketbase');

async function setupCollections() {
  const pb = new PocketBase('http://localhost:8090');
  
  // You'll need to login with your admin credentials
  console.log('Please enter your admin credentials:');
  const email = 'admin@vibecode.com'; // Replace with your admin email
  const password = 'admin123456'; // Replace with your admin password
  
  try {
    await pb.admins.authWithPassword(email, password);
    console.log('✓ Admin authenticated');
    
    // Create Companies collection
    console.log('Creating companies collection...');
    const companiesCollection = await pb.collections.create({
      name: 'companies',
      type: 'base',
      schema: [
        {
          name: 'name',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'settings',
          type: 'json',
          required: false,
        }
      ]
    });
    console.log('✓ Companies collection created');
    
    // Update the built-in users collection to add our custom fields
    console.log('Updating users collection...');
    const usersCollection = await pb.collections.getOne('users');
    await pb.collections.update('users', {
      schema: [
        ...usersCollection.schema,
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          required: true,
          options: {
            maxSelect: 1,
            values: ['employee', 'admin', 'super_admin']
          }
        },
        {
          name: 'company',
          type: 'relation',
          required: true,
          options: {
            collectionId: companiesCollection.id,
            cascadeDelete: false,
            maxSelect: 1,
          }
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          options: {
            maxSelect: 1,
            values: ['pending', 'approved', 'rejected', 'suspended']
          }
        }
      ]
    });
    console.log('✓ Users collection updated');
    
    // Create CheckIns collection
    console.log('Creating checkIns collection...');
    await pb.collections.create({
      name: 'checkIns',
      type: 'base',
      schema: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          options: {
            collectionId: 'users',
            cascadeDelete: true,
            maxSelect: 1,
          }
        },
        {
          name: 'checkInTime',
          type: 'date',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: {
            maxSelect: 1,
            values: ['early', 'ontime', 'late']
          }
        },
        {
          name: 'pointsEarned',
          type: 'number',
          required: true,
        },
        {
          name: 'qrCodeData',
          type: 'text',
          required: true,
        }
      ]
    });
    console.log('✓ CheckIns collection created');
    
    // Create demo company
    console.log('Creating demo company...');
    const demoCompany = await pb.collection('companies').create({
      name: 'Demo Company',
      settings: {
        checkInWindow: {
          start: '06:00',
          end: '09:00',
          timezone: 'America/Denver'
        },
        pointsConfig: {
          early: 2,
          onTime: 1,
          late: 0
        }
      }
    });
    console.log('✓ Demo company created');
    
    console.log('\n🎉 Setup complete!');
    console.log(`Company ID: ${demoCompany.id}`);
    console.log('\nYou can now:');
    console.log('1. Visit http://localhost:5173 to access the frontend');
    console.log('2. Create user accounts through the app');
    console.log('3. Test the check-in functionality');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\nPlease make sure:');
    console.log('1. PocketBase is running at http://localhost:8090');
    console.log('2. Your admin credentials are correct');
    console.log('3. You have admin access');
  }
}

setupCollections();