
// configuracion de la base de datos
const dbInfo = process.env.NODE_ENV === 'production' ? 
{
  host: '',
  user: '',
  password: '',
  database: '',
  timezone: '+03:00',
} : 
{
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'slothfashion',
  timezone: '+00:00',
}

module.exports = { dbInfo }