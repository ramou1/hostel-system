// Camada de dados simples com persistência em localStorage.
// Simula um "banco de dados" compartilhado entre a área administrativa
// e a tela pública de auto-cadastro (link enviado ao hóspede).

const CLIENTS_KEY = "hostelzim:clients";
const ROOMS_KEY = "hostelzim:rooms";

// Origem do cadastro (enum)
export const SOURCE = { LINK: "link", DESK: "desk" };

// Opções usadas nos formulários (nomes traduzidos via i18n)
export const COUNTRY_OPTIONS = ["BR", "AR", "US", "PT", "CL", "FR", "DE", "ES", "IT"];
export const LANGUAGE_OPTIONS = ["pt", "en", "es", "fr", "de", "it"];

export const INITIAL_ROOMS = [
  { name: "Quarto 101", capacity: 2, clients: 2, availableSpaces: 0, type: "male" },
  { name: "Quarto 102", capacity: 3, clients: 1, availableSpaces: 2, type: "female" },
  { name: "Quarto 103", capacity: 4, clients: 3, availableSpaces: 1, type: "mixed" },
  { name: "Quarto 104", capacity: 5, clients: 5, availableSpaces: 0, type: "female" },
];

export const INITIAL_CLIENTS = [
  { name: "Ana Beatriz", email: "ana.beatriz@example.com", phone: "(11) 98888-1010", room: "Quarto 101", cpf: "123.456.789-00", documentId: "", photo: "", country: "BR", language: "pt", source: SOURCE.LINK, registeredAt: "2026-09-09T10:15:00" },
  { name: "Lucas Pereira", email: "lucas.pereira@example.com", phone: "(21) 97777-2020", room: "Quarto 102", cpf: "987.654.321-00", documentId: "", photo: "", country: "BR", language: "pt", source: SOURCE.DESK, registeredAt: "2026-09-08T18:40:00" },
  { name: "Sofía Gómez", email: "sofia.gomez@example.com", phone: "+54 9 11 5555-3030", room: "Quarto 103", cpf: "", documentId: "DNI 40.123.456", photo: "", country: "AR", language: "es", source: SOURCE.LINK, registeredAt: "2026-09-08T09:05:00" },
  { name: "Michael Johnson", email: "michael.johnson@example.com", phone: "+1 202 555-4040", room: "Quarto 104", cpf: "", documentId: "US-PP-548921", photo: "", country: "US", language: "en", source: SOURCE.DESK, registeredAt: "2026-09-07T14:20:00" },
  { name: "Emily Davis", email: "emily.davis@example.com", phone: "+1 415 555-5050", room: "Quarto 101", cpf: "", documentId: "US-PP-773310", photo: "", country: "US", language: "en", source: SOURCE.LINK, registeredAt: "2026-09-06T11:00:00" },
  { name: "João Ferreira", email: "joao.ferreira@example.com", phone: "+351 912 345 678", room: "Quarto 102", cpf: "", documentId: "PT 12345678", photo: "", country: "PT", language: "pt", source: SOURCE.DESK, registeredAt: "2026-09-05T16:30:00" },
  { name: "Camila Rojas", email: "camila.rojas@example.com", phone: "+56 9 6666 7070", room: "Quarto 103", cpf: "", documentId: "CL 18.765.432", photo: "", country: "CL", language: "es", source: SOURCE.LINK, registeredAt: "2026-09-04T08:45:00" },
  { name: "Pierre Dubois", email: "pierre.dubois@example.com", phone: "+33 6 12 34 56 78", room: "Quarto 104", cpf: "", documentId: "FR-PP-99AA77", photo: "", country: "FR", language: "fr", source: SOURCE.DESK, registeredAt: "2026-09-03T19:10:00" },
  { name: "Lena Müller", email: "lena.mueller@example.com", phone: "+49 151 2345678", room: "Quarto 101", cpf: "", documentId: "DE-ID-556677", photo: "", country: "DE", language: "de", source: SOURCE.LINK, registeredAt: "2026-09-01T12:00:00" },
  { name: "Marta Silva", email: "marta.silva@example.com", phone: "(31) 96666-8080", room: "Quarto 102", cpf: "777.666.555-44", documentId: "", photo: "", country: "BR", language: "pt", source: SOURCE.LINK, registeredAt: "2026-08-31T09:20:00" },
  { name: "Giovanni Rossi", email: "giovanni.rossi@example.com", phone: "+39 340 123 4567", room: "Quarto 103", cpf: "", documentId: "IT-PP-1122AA", photo: "", country: "IT", language: "it", source: SOURCE.DESK, registeredAt: "2026-08-30T15:45:00" },
  { name: "Carlos Sánchez", email: "carlos.sanchez@example.com", phone: "+34 612 345 678", room: "Quarto 104", cpf: "", documentId: "ES 98765432X", photo: "", country: "ES", language: "es", source: SOURCE.LINK, registeredAt: "2026-08-29T11:10:00" },
  { name: "Fátima Alves", email: "fatima.alves@example.com", phone: "+351 913 222 111", room: "Quarto 101", cpf: "", documentId: "PT 87654321", photo: "", country: "PT", language: "pt", source: SOURCE.DESK, registeredAt: "2026-08-28T17:05:00" },
  { name: "Hans Weber", email: "hans.weber@example.com", phone: "+49 172 9876543", room: "Quarto 102", cpf: "", documentId: "DE-ID-889900", photo: "", country: "DE", language: "de", source: SOURCE.LINK, registeredAt: "2026-08-27T08:30:00" },
  { name: "Marie Laurent", email: "marie.laurent@example.com", phone: "+33 6 98 76 54 32", room: "Quarto 103", cpf: "", documentId: "FR-PP-33BB11", photo: "", country: "FR", language: "fr", source: SOURCE.DESK, registeredAt: "2026-08-26T13:50:00" },
  { name: "Diego Fernández", email: "diego.fernandez@example.com", phone: "+54 9 11 4444-9090", room: "Quarto 104", cpf: "", documentId: "DNI 38.222.111", photo: "", country: "AR", language: "es", source: SOURCE.LINK, registeredAt: "2026-08-25T10:00:00" },
  { name: "Sarah Williams", email: "sarah.williams@example.com", phone: "+1 646 555-6060", room: "Quarto 101", cpf: "", documentId: "US-PP-660011", photo: "", country: "US", language: "en", source: SOURCE.DESK, registeredAt: "2026-08-24T19:25:00" },
  { name: "Bruno Costa", email: "bruno.costa@example.com", phone: "(41) 95555-7070", room: "Quarto 102", cpf: "121.232.343-45", documentId: "", photo: "", country: "BR", language: "pt", source: SOURCE.LINK, registeredAt: "2026-08-23T14:15:00" },
  { name: "Valentina Torres", email: "valentina.torres@example.com", phone: "+56 9 7777 8080", room: "Quarto 103", cpf: "", documentId: "CL 19.888.777", photo: "", country: "CL", language: "es", source: SOURCE.DESK, registeredAt: "2026-08-22T12:40:00" },
  { name: "Thomas Becker", email: "thomas.becker@example.com", phone: "+49 160 5554443", room: "Quarto 104", cpf: "", documentId: "DE-ID-445566", photo: "", country: "DE", language: "de", source: SOURCE.LINK, registeredAt: "2026-08-21T16:55:00" },
];

function readJSON(key, seed) {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    // ignora JSON corrompido e recria a partir do seed
  }
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

// ----- Clientes -----
export function loadClients() {
  return readJSON(CLIENTS_KEY, INITIAL_CLIENTS);
}

export function saveClients(list) {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(list));
}

export function addClient(client) {
  const list = loadClients();
  const next = [...list, client];
  saveClients(next);
  return next;
}

// ----- Quartos -----
export function loadRooms() {
  return readJSON(ROOMS_KEY, INITIAL_ROOMS);
}

export function saveRooms(list) {
  localStorage.setItem(ROOMS_KEY, JSON.stringify(list));
}

export const STORAGE_KEYS = { CLIENTS_KEY, ROOMS_KEY };
