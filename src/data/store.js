// Camada de dados simples com persistência em localStorage.
// Simula um "banco de dados" compartilhado entre a área administrativa
// e a tela pública de auto-cadastro (link enviado ao hóspede).

const CLIENTS_KEY = "hostelzim:clients";
const ROOMS_KEY = "hostelzim:rooms";
const HOSTEL_KEY = "hostelzim:hostel";
const LOCKERS_KEY = "hostelzim:lockers";
const RENTALS_KEY = "hostelzim:rentals";

// Origem do cadastro (enum)
export const SOURCE = { LINK: "link", DESK: "desk" };

// Tipos de itens alugáveis
export const RENTAL_ITEM_TYPES = [
  "towel",
  "adapter",
  "padlock",
  "bike",
  "canga",
  "board",
];

// Opções usadas nos formulários (nomes traduzidos via i18n)
export const COUNTRY_OPTIONS = ["BR", "AR", "US", "PT", "CL", "FR", "DE", "ES", "IT"];
export const LANGUAGE_OPTIONS = ["pt", "en", "es", "fr", "de", "it"];

export const INITIAL_ROOMS = [
  { name: "Quarto 101", capacity: 2, clients: 2, availableSpaces: 0, type: "male" },
  { name: "Quarto 102", capacity: 3, clients: 1, availableSpaces: 2, type: "female" },
  { name: "Quarto 103", capacity: 4, clients: 3, availableSpaces: 1, type: "mixed" },
  { name: "Quarto 104", capacity: 5, clients: 5, availableSpaces: 0, type: "female" },
];

export const INITIAL_HOSTEL = {
  name: "Hostel Pé na Areia",
  email: "contato@penareia.com",
  phone: "(21) 98888-0000",
  address: "Rua das Ondas, 120",
  city: "Rio de Janeiro",
  country: "BR",
  description:
    "Hostel à beira-mar, com quartos mistos e privativos, área comum e cozinha compartilhada.",
  rules:
    "1. Silêncio após as 22h.\n2. Respeite os outros hóspedes.\n3. Não fume nos quartos.\n4. Guarde seus pertences no armário.\n5. Check-out até as 11h.",
};

export const INITIAL_LOCKERS = [
  { id: "lk-1", code: "A-01", clientName: "Ana Beatriz" },
  { id: "lk-2", code: "A-02", clientName: "" },
  { id: "lk-3", code: "A-03", clientName: "" },
  { id: "lk-4", code: "B-01", clientName: "Lucas Pereira" },
  { id: "lk-5", code: "B-02", clientName: "" },
];

export const INITIAL_RENTALS = [
  {
    id: "rt-1",
    itemType: "towel",
    clientName: "Ana Beatriz",
    price: 10,
    rentedAt: "2026-09-09T12:00:00",
  },
  {
    id: "rt-2",
    itemType: "adapter",
    clientName: "Sofía Gómez",
    price: 5,
    rentedAt: "2026-09-08T15:30:00",
  },
  {
    id: "rt-3",
    itemType: "bike",
    clientName: "Michael Johnson",
    price: 40,
    rentedAt: "2026-09-07T09:00:00",
  },
];

export const INITIAL_CLIENTS = [
  { name: "Ana Beatriz", email: "ana.beatriz@example.com", phone: "(11) 98888-1010", room: "Quarto 101", cpf: "123.456.789-00", documentId: "", photo: "", country: "BR", language: "pt", source: SOURCE.LINK, registeredAt: "2026-09-09T10:15:00", lockerId: "lk-1" },
  { name: "Lucas Pereira", email: "lucas.pereira@example.com", phone: "(21) 97777-2020", room: "Quarto 102", cpf: "987.654.321-00", documentId: "", photo: "", country: "BR", language: "pt", source: SOURCE.DESK, registeredAt: "2026-09-08T18:40:00", lockerId: "lk-4" },
  { name: "Sofía Gómez", email: "sofia.gomez@example.com", phone: "+54 9 11 5555-3030", room: "Quarto 103", cpf: "", documentId: "DNI 40.123.456", photo: "", country: "AR", language: "es", source: SOURCE.LINK, registeredAt: "2026-09-08T09:05:00", lockerId: "" },
  { name: "Michael Johnson", email: "michael.johnson@example.com", phone: "+1 202 555-4040", room: "Quarto 104", cpf: "", documentId: "US-PP-548921", photo: "", country: "US", language: "en", source: SOURCE.DESK, registeredAt: "2026-09-07T14:20:00", lockerId: "" },
  { name: "Emily Davis", email: "emily.davis@example.com", phone: "+1 415 555-5050", room: "Quarto 101", cpf: "", documentId: "US-PP-773310", photo: "", country: "US", language: "en", source: SOURCE.LINK, registeredAt: "2026-09-06T11:00:00", lockerId: "" },
  { name: "João Ferreira", email: "joao.ferreira@example.com", phone: "+351 912 345 678", room: "Quarto 102", cpf: "", documentId: "PT 12345678", photo: "", country: "PT", language: "pt", source: SOURCE.DESK, registeredAt: "2026-09-05T16:30:00", lockerId: "" },
  { name: "Camila Rojas", email: "camila.rojas@example.com", phone: "+56 9 6666 7070", room: "Quarto 103", cpf: "", documentId: "CL 18.765.432", photo: "", country: "CL", language: "es", source: SOURCE.LINK, registeredAt: "2026-09-04T08:45:00", lockerId: "" },
  { name: "Pierre Dubois", email: "pierre.dubois@example.com", phone: "+33 6 12 34 56 78", room: "Quarto 104", cpf: "", documentId: "FR-PP-99AA77", photo: "", country: "FR", language: "fr", source: SOURCE.DESK, registeredAt: "2026-09-03T19:10:00", lockerId: "" },
  { name: "Lena Müller", email: "lena.mueller@example.com", phone: "+49 151 2345678", room: "Quarto 101", cpf: "", documentId: "DE-ID-556677", photo: "", country: "DE", language: "de", source: SOURCE.LINK, registeredAt: "2026-09-01T12:00:00", lockerId: "" },
  { name: "Marta Silva", email: "marta.silva@example.com", phone: "(31) 96666-8080", room: "Quarto 102", cpf: "777.666.555-44", documentId: "", photo: "", country: "BR", language: "pt", source: SOURCE.LINK, registeredAt: "2026-08-31T09:20:00", lockerId: "" },
  { name: "Giovanni Rossi", email: "giovanni.rossi@example.com", phone: "+39 340 123 4567", room: "Quarto 103", cpf: "", documentId: "IT-PP-1122AA", photo: "", country: "IT", language: "it", source: SOURCE.DESK, registeredAt: "2026-08-30T15:45:00", lockerId: "" },
  { name: "Carlos Sánchez", email: "carlos.sanchez@example.com", phone: "+34 612 345 678", room: "Quarto 104", cpf: "", documentId: "ES 98765432X", photo: "", country: "ES", language: "es", source: SOURCE.LINK, registeredAt: "2026-08-29T11:10:00", lockerId: "" },
  { name: "Fátima Alves", email: "fatima.alves@example.com", phone: "+351 913 222 111", room: "Quarto 101", cpf: "", documentId: "PT 87654321", photo: "", country: "PT", language: "pt", source: SOURCE.DESK, registeredAt: "2026-08-28T17:05:00", lockerId: "" },
  { name: "Hans Weber", email: "hans.weber@example.com", phone: "+49 172 9876543", room: "Quarto 102", cpf: "", documentId: "DE-ID-889900", photo: "", country: "DE", language: "de", source: SOURCE.LINK, registeredAt: "2026-08-27T08:30:00", lockerId: "" },
  { name: "Marie Laurent", email: "marie.laurent@example.com", phone: "+33 6 98 76 54 32", room: "Quarto 103", cpf: "", documentId: "FR-PP-33BB11", photo: "", country: "FR", language: "fr", source: SOURCE.DESK, registeredAt: "2026-08-26T13:50:00", lockerId: "" },
  { name: "Diego Fernández", email: "diego.fernandez@example.com", phone: "+54 9 11 4444-9090", room: "Quarto 104", cpf: "", documentId: "DNI 38.222.111", photo: "", country: "AR", language: "es", source: SOURCE.LINK, registeredAt: "2026-08-25T10:00:00", lockerId: "" },
  { name: "Sarah Williams", email: "sarah.williams@example.com", phone: "+1 646 555-6060", room: "Quarto 101", cpf: "", documentId: "US-PP-660011", photo: "", country: "US", language: "en", source: SOURCE.DESK, registeredAt: "2026-08-24T19:25:00", lockerId: "" },
  { name: "Bruno Costa", email: "bruno.costa@example.com", phone: "(41) 95555-7070", room: "Quarto 102", cpf: "121.232.343-45", documentId: "", photo: "", country: "BR", language: "pt", source: SOURCE.LINK, registeredAt: "2026-08-23T14:15:00", lockerId: "" },
  { name: "Valentina Torres", email: "valentina.torres@example.com", phone: "+56 9 7777 8080", room: "Quarto 103", cpf: "", documentId: "CL 19.888.777", photo: "", country: "CL", language: "es", source: SOURCE.DESK, registeredAt: "2026-08-22T12:40:00", lockerId: "" },
  { name: "Thomas Becker", email: "thomas.becker@example.com", phone: "+49 160 5554443", room: "Quarto 104", cpf: "", documentId: "DE-ID-445566", photo: "", country: "DE", language: "de", source: SOURCE.LINK, registeredAt: "2026-08-21T16:55:00", lockerId: "" },
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

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
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
  const next = [...list, { lockerId: "", ...client }];
  saveClients(next);
  return next;
}

export function updateClient(matcher, patch) {
  const list = loadClients();
  const next = list.map((c) => {
    const match =
      typeof matcher === "function"
        ? matcher(c)
        : c.email === matcher || c.name === matcher;
    return match ? { ...c, ...patch } : c;
  });
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

// ----- Hostel -----
export function loadHostel() {
  return readJSON(HOSTEL_KEY, INITIAL_HOSTEL);
}

export function saveHostel(data) {
  localStorage.setItem(HOSTEL_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("hostelzim:hostel-updated"));
  return data;
}

// ----- Armários -----
export function loadLockers() {
  return readJSON(LOCKERS_KEY, INITIAL_LOCKERS);
}

export function saveLockers(list) {
  localStorage.setItem(LOCKERS_KEY, JSON.stringify(list));
}

export function addLocker(locker) {
  const list = loadLockers();
  const next = [...list, { id: uid("lk"), clientName: "", ...locker }];
  saveLockers(next);
  return next;
}

export function updateLocker(id, patch) {
  const list = loadLockers();
  const next = list.map((lk) => (lk.id === id ? { ...lk, ...patch } : lk));
  saveLockers(next);
  return next;
}

export function removeLocker(id) {
  const list = loadLockers().filter((lk) => lk.id !== id);
  saveLockers(list);
  // Limpa vínculo no cliente
  const clients = loadClients().map((c) =>
    c.lockerId === id ? { ...c, lockerId: "" } : c
  );
  saveClients(clients);
  return list;
}

/** Associa (ou libera) um armário a um cliente pelo nome */
export function assignLockerToClient(lockerId, clientName) {
  const name = (clientName || "").trim();
  let lockers = loadLockers();

  // Libera armários que estavam com este cliente
  if (name) {
    lockers = lockers.map((lk) =>
      lk.clientName === name && lk.id !== lockerId
        ? { ...lk, clientName: "" }
        : lk
    );
  }

  lockers = lockers.map((lk) => {
    if (lk.id === lockerId) return { ...lk, clientName: name };
    return lk;
  });
  saveLockers(lockers);

  // Atualiza clientes: quem tinha este armário, e quem recebe
  let clients = loadClients().map((c) =>
    c.lockerId === lockerId ? { ...c, lockerId: "" } : c
  );
  if (name) {
    clients = clients.map((c) =>
      c.name === name
        ? { ...c, lockerId }
        : c.lockerId === lockerId
          ? { ...c, lockerId: "" }
          : c
    );
  }
  saveClients(clients);

  return { lockers, clients };
}

// ----- Aluguéis -----
export function loadRentals() {
  return readJSON(RENTALS_KEY, INITIAL_RENTALS);
}

export function saveRentals(list) {
  localStorage.setItem(RENTALS_KEY, JSON.stringify(list));
}

export function addRental(rental) {
  const list = loadRentals();
  const next = [
    {
      id: uid("rt"),
      rentedAt: new Date().toISOString(),
      ...rental,
      price: Number(rental.price) || 0,
    },
    ...list,
  ];
  saveRentals(next);
  return next;
}

export function removeRental(id) {
  const list = loadRentals().filter((r) => r.id !== id);
  saveRentals(list);
  return list;
}

export const STORAGE_KEYS = {
  CLIENTS_KEY,
  ROOMS_KEY,
  HOSTEL_KEY,
  LOCKERS_KEY,
  RENTALS_KEY,
};
