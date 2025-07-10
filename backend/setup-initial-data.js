import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

async function setupInitialData() {
  try {
    console.log('Setting up initial data...');
    
    // First, you need to authenticate as an admin
    // This assumes you've already created an admin account in PocketBase
    console.log('\nIMPORTANT: Before running this script:');
    console.log('1. Go to http://localhost:8090/_/');
    console.log('2. Create your first admin account');
    console.log('3. Use email: Andy@vimly.ai');
    console.log('4. Use password: Systemkleen!');
    console.log('\nThen update this script with those credentials and run it again.');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

setupInitialData();