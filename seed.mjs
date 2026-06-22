async function seed() {
  try {
    const res1 = await fetch('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Project Alpha (Dummy)',
        year: 2024,
        description: '<p>This is a dummy project showcasing modern web development techniques.</p>'
      })
    });
    console.log('Project 1:', await res1.text());

    const res2 = await fetch('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Project Beta (Dummy)',
        year: 2023,
        description: '<p>Another dummy project demonstrating advanced API integration.</p>'
      })
    });
    console.log('Project 2:', await res2.text());
  } catch(e) {
    console.error(e);
  }
}
seed();
