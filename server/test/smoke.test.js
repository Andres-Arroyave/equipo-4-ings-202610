const { spawn } = require('child_process');
const axios = require('axios');
const path = require('path');
const treeKill = require('tree-kill');


const SERVER_URL = 'http://localhost:8080';
const MOCK_USER_EMAIL = `testvendedor_${Date.now()}@example.com`;
const MOCK_USER_PASSWORD = 'password123';
let serverProcess;
let idUser;

const waitForServer = async (maxRetries = 60, interval = 2000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get(`${SERVER_URL}/health`);
      if (response.status === 200) return true;
    } catch (error) {

    }
    await new Promise(res => setTimeout(res, interval));
  }
  throw new Error('Timeout esperando a que el servidor levante');
};

beforeAll(async () => {
  console.log('Iniciando el servidor...');

  const serverPath = path.resolve(__dirname, '..');
  serverProcess = spawn('cmd.exe', ['/c', 'gradlew.bat', 'bootRun'], {
    cwd: serverPath,
    stdio: 'ignore'
  });

  await waitForServer();
  console.log('Servidor levantado correctamente');
}, 180000);

afterAll((done) => {
  if (serverProcess && serverProcess.pid) {
    console.log('Deteniendo el servidor...');
    treeKill(serverProcess.pid, 'SIGKILL', (err) => {
      done();
    });
  } else {
    done();
  }
});

describe('Smoke Tests - Backend', () => {

  // PUNTO 1: Server Startup & Health Check
  test('1. Server Startup & Health Check: GET /health devuelve 200 OK', async () => {
    const response = await axios.get(`${SERVER_URL}/health`);
    expect(response.status).toBe(200);
    expect(response.data).toBe('OK');
  });

  // PUNTO 2: Database Connection
  test('2. Database Connection: GET /api/vendedores funciona sin arrojar 500', async () => {
    const response = await axios.get(`${SERVER_URL}/api/vendedores`);
    expect(response.status).toBe(200);
  });

  // PUNTO 3: User Authentication
  test('3. User Authentication: POST /api/auth/login con credenciales válidas', async () => {
    // a) Crear el usuario primero
    const registroPayload = {
      email: MOCK_USER_EMAIL,
      contrasena: MOCK_USER_PASSWORD,
      telefono: "3001234567",
      nombreNegocio: "Tienda de Prueba",
      nombrePropietario: "Juan Perez",
      descripcionNeg: "Descripción test",
      whatsAppLink: "wa.link/test",
      instagramLink: "instagram.com/test",
      idCategoriasV: [1]
    };

    const registerResponse = await axios.post(`${SERVER_URL}/api/auth/registro/vendedor`, registroPayload);
    expect(registerResponse.status).toBe(201);

    // b) Realizar Login
    const loginPayload = {
      email: MOCK_USER_EMAIL,
      contrasena: MOCK_USER_PASSWORD
    };
    const loginResponse = await axios.post(`${SERVER_URL}/api/auth/login`, loginPayload);

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.data).toHaveProperty('idUser');
    expect(loginResponse.data).toHaveProperty('rol');

    idUser = loginResponse.data.idUser;
  });

  // PUNTO 4: Fetching Vendor List
  test('4. Fetching Vendor List: GET /api/vendedores retorna array', async () => {
    const response = await axios.get(`${SERVER_URL}/api/vendedores`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    if (response.data.length > 0) {
      expect(response.data[0]).toHaveProperty('idVendedor');
      expect(response.data[0]).toHaveProperty('nombreNegocio');
    }
  });

  // PUNTO 5: Vendor Creation with Catalog
  test('5. Vendor Creation with Catalog: Flujo compuesto de catálogo y productos', async () => {

    // a) Crear catálogo
    const catalogoPayload = {
      nombreCatalogo: "Catálogo Invierno"
    };
    const catalogoResponse = await axios.post(`${SERVER_URL}/api/auth/vendedor/${idUser}/catalogos`, catalogoPayload);
    expect(catalogoResponse.status).toBe(201);
    expect(catalogoResponse.data).toHaveProperty('idCatalogo');
    const idCatalogo = catalogoResponse.data.idCatalogo;

    // b) Crear producto en ese catálogo
    const productoPayload = {
      nombreProducto: "Gorro de lana",
      descripcionProd: "Muy calentito",
      precio: 25000,
      imagenesUrl: "http://imagen.com/img.jpg"
    };
    const productoResponse = await axios.post(`${SERVER_URL}/api/auth/vendedor/${idUser}/catalogos/${idCatalogo}/productos`, productoPayload);

    expect(productoResponse.status).toBe(201);
    expect(productoResponse.data).toHaveProperty('idProducto');
  });

});
