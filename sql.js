  const { Client } = require('pg');
  const xss = require('xss');  // eslint-disable-line

  const connectionString = 'postgres://postgres:123@localhost/postgres';

  async function insert(values) {
    const client = new Client({ connectionString });
    client.connect();
    
    try {
      const res = await client.query('INSERT INTO vef_v2 (name,email,ssn,count) VALUES($1,$2,$3,$4)', values);
    } catch (e) {
      console.error('Error inserting', e);
      return -1;
    }
    await client.end();
  }

  async function select() {
    const client = new Client({ connectionString });
    client.connect();
    try {
      const res = await client.query('SELECT * FROM vef_v2');
      return res.rows;
    } catch (e) {
      console.error('Error selecting', e);
    }
    await client.end();
  }



  module.exports = {
    select,
    insert,
  };

