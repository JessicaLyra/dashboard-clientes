import bcrypt from 'bcrypt';

async function generateHash() {
  const password = '123456'; // troque se quiser
  const hash = await bcrypt.hash(password, 10);

  console.log('Senha:', password);
  console.log('Hash:', hash);
}

generateHash();
