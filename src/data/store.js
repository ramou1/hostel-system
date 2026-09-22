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
    returned: false,
  },
  {
    id: "rt-2",
    itemType: "adapter",
    clientName: "Sofía Gómez",
    price: 5,
    rentedAt: "2026-09-08T15:30:00",
    returned: false,
  },
  {
    id: "rt-3",
    itemType: "bike",
    clientName: "Michael Johnson",
    price: 40,
    rentedAt: "2026-09-07T09:00:00",
    returned: false,
  },
];

function seedClient(partial) {
  return {
    locker: "",
    languages: ["pt"],
    status: "checkedIn",
    checkedOutAt: "",
    ...partial,
  };
}

export const INITIAL_CLIENTS = [
  seedClient({ name: "Ana Beatriz", email: "ana.beatriz@example.com", phone: "(11) 98888-1010", room: "Quarto 101", cpf: "123.456.789-00", documentId: "", photo: "", country: "Brasil", languages: ["pt"], source: SOURCE.LINK, registeredAt: "2026-09-09T10:15:00", locker: "A-01" }),
  seedClient({ name: "Lucas Pereira", email: "lucas.pereira@example.com", phone: "(21) 97777-2020", room: "Quarto 102", cpf: "987.654.321-00", documentId: "", photo: "", country: "Brasil", languages: ["pt", "en"], source: SOURCE.DESK, registeredAt: "2026-09-08T18:40:00", locker: "B-01" }),
  seedClient({ name: "Sofía Gómez", email: "sofia.gomez@example.com", phone: "+54 9 11 5555-3030", room: "Quarto 103", cpf: "", documentId: "DNI 40.123.456", photo: "", country: "Argentina", languages: ["es"], source: SOURCE.LINK, registeredAt: "2026-09-08T09:05:00" }),
  seedClient({ name: "Michael Johnson", email: "michael.johnson@example.com", phone: "+1 202 555-4040", room: "Quarto 104", cpf: "", documentId: "US-PP-548921", photo: "", country: "Estados Unidos", languages: ["en"], source: SOURCE.DESK, registeredAt: "2026-09-07T14:20:00" }),
  seedClient({ name: "Emily Davis", email: "emily.davis@example.com", phone: "+1 415 555-5050", room: "Quarto 101", cpf: "", documentId: "US-PP-773310", photo: "", country: "Estados Unidos", languages: ["en"], source: SOURCE.LINK, registeredAt: "2026-09-06T11:00:00" }),
  seedClient({ name: "João Ferreira", email: "joao.ferreira@example.com", phone: "+351 912 345 678", room: "Quarto 102", cpf: "", documentId: "PT 12345678", photo: "", country: "Portugal", languages: ["pt"], source: SOURCE.DESK, registeredAt: "2026-09-05T16:30:00" }),
  seedClient({ name: "Camila Rojas", email: "camila.rojas@example.com", phone: "+56 9 6666 7070", room: "Quarto 103", cpf: "", documentId: "CL 18.765.432", photo: "", country: "Chile", languages: ["es"], source: SOURCE.LINK, registeredAt: "2026-09-04T08:45:00" }),
  seedClient({ name: "Pierre Dubois", email: "pierre.dubois@example.com", phone: "+33 6 12 34 56 78", room: "Quarto 104", cpf: "", documentId: "FR-PP-99AA77", photo: "", country: "França", languages: ["fr", "en"], source: SOURCE.DESK, registeredAt: "2026-09-03T19:10:00" }),
  seedClient({ name: "Lena Müller", email: "lena.mueller@example.com", phone: "+49 151 2345678", room: "Quarto 101", cpf: "", documentId: "DE-ID-556677", photo: "", country: "Alemanha", languages: ["de"], source: SOURCE.LINK, registeredAt: "2026-09-01T12:00:00" }),
  seedClient({ name: "Marta Silva", email: "marta.silva@example.com", phone: "(31) 96666-8080", room: "Quarto 102", cpf: "777.666.555-44", documentId: "", photo: "", country: "Brasil", languages: ["pt"], source: SOURCE.LINK, registeredAt: "2026-08-31T09:20:00" }),
  seedClient({ name: "Giovanni Rossi", email: "giovanni.rossi@example.com", phone: "+39 340 123 4567", room: "Quarto 103", cpf: "", documentId: "IT-PP-1122AA", photo: "", country: "Itália", languages: ["it"], source: SOURCE.DESK, registeredAt: "2026-08-30T15:45:00" }),
  seedClient({ name: "Carlos Sánchez", email: "carlos.sanchez@example.com", phone: "+34 612 345 678", room: "Quarto 104", cpf: "", documentId: "ES 98765432X", photo: "", country: "Espanha", languages: ["es"], source: SOURCE.LINK, registeredAt: "2026-08-29T11:10:00" }),
  seedClient({ name: "Fátima Alves", email: "fatima.alves@example.com", phone: "+351 913 222 111", room: "Quarto 101", cpf: "", documentId: "PT 87654321", photo: "", country: "Portugal", languages: ["pt"], source: SOURCE.DESK, registeredAt: "2026-08-28T17:05:00" }),
  seedClient({ name: "Hans Weber", email: "hans.weber@example.com", phone: "+49 172 9876543", room: "Quarto 102", cpf: "", documentId: "DE-ID-889900", photo: "", country: "Alemanha", languages: ["de"], source: SOURCE.LINK, registeredAt: "2026-08-27T08:30:00" }),
  seedClient({ name: "Marie Laurent", email: "marie.laurent@example.com", phone: "+33 6 98 76 54 32", room: "Quarto 103", cpf: "", documentId: "FR-PP-33BB11", photo: "", country: "França", languages: ["fr"], source: SOURCE.DESK, registeredAt: "2026-08-26T13:50:00" }),
  seedClient({ name: "Diego Fernández", email: "diego.fernandez@example.com", phone: "+54 9 11 4444-9090", room: "Quarto 104", cpf: "", documentId: "DNI 38.222.111", photo: "", country: "Argentina", languages: ["es"], source: SOURCE.LINK, registeredAt: "2026-08-25T10:00:00" }),
  seedClient({ name: "Sarah Williams", email: "sarah.williams@example.com", phone: "+1 646 555-6060", room: "Quarto 101", cpf: "", documentId: "US-PP-660011", photo: "", country: "Estados Unidos", languages: ["en"], source: SOURCE.DESK, registeredAt: "2026-08-24T19:25:00" }),
  seedClient({ name: "Bruno Costa", email: "bruno.costa@example.com", phone: "(41) 95555-7070", room: "Quarto 102", cpf: "121.232.343-45", documentId: "", photo: "", country: "Brasil", languages: ["pt"], source: SOURCE.LINK, registeredAt: "2026-08-23T14:15:00" }),
  seedClient({ name: "Valentina Torres", email: "valentina.torres@example.com", phone: "+56 9 7777 8080", room: "Quarto 103", cpf: "", documentId: "CL 19.888.777", photo: "", country: "Chile", languages: ["es"], source: SOURCE.DESK, registeredAt: "2026-08-22T12:40:00" }),
  seedClient({ name: "Thomas Becker", email: "thomas.becker@example.com", phone: "+49 160 5554443", room: "Quarto 104", cpf: "", documentId: "DE-ID-445566", photo: "", country: "Alemanha", languages: ["de"], source: SOURCE.LINK, registeredAt: "2026-08-21T16:55:00" }),
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
  const normalized = {
    locker: "",
    languages: [],
    status: "checkedIn",
    checkedOutAt: "",
    ...client,
  };
  if (!normalized.languages?.length && client.language) {
    normalized.languages = [client.language];
  }
  const next = [...list, normalized];
  saveClients(next);

  if (normalized.room && normalized.status !== "checkedOut") {
    adjustRoomOccupancy(normalized.room, 1);
  }
  if (normalized.locker) {
    assignLockerByCode(normalized.locker, normalized.name);
  }
  return loadClients();
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

export function getClientLanguages(client) {
  if (Array.isArray(client?.languages) && client.languages.length) {
    return client.languages;
  }
  if (client?.language) return [client.language];
  return [];
}

export function getClientLocker(client) {
  if (client?.locker) return client.locker;
  if (client?.lockerId) {
    const found = loadLockers().find((lk) => lk.id === client.lockerId);
    return found?.code || "";
  }
  return "";
}

/** Incrementa/decrementa ocupação do quarto ao cadastrar ou fazer checkout */
export function adjustRoomOccupancy(roomName, delta) {
  if (!roomName || !delta) return loadRooms();
  const rooms = loadRooms().map((room) => {
    if (room.name !== roomName) return room;
    const clients = Math.max(0, (Number(room.clients) || 0) + delta);
    const capacity = Number(room.capacity) || 0;
    return {
      ...room,
      clients,
      availableSpaces: Math.max(0, capacity - clients),
    };
  });
  saveRooms(rooms);
  return rooms;
}

/** Checkout: libera quarto/armário e marca aluguéis como devolvidos */
export function checkoutClient(clientName, { returnAllRentals = true, returnedIds = [] } = {}) {
  const name = (clientName || "").trim();
  const clients = loadClients();
  const target = clients.find((c) => c.name === name);
  if (!target || target.status === "checkedOut") {
    return { clients, lockers: loadLockers(), rentals: loadRentals(), rooms: loadRooms() };
  }

  const nextClients = clients.map((c) =>
    c.name === name
      ? {
          ...c,
          status: "checkedOut",
          checkedOutAt: new Date().toISOString(),
          locker: "",
        }
      : c
  );
  saveClients(nextClients);

  if (target.room) adjustRoomOccupancy(target.room, -1);

  // Libera armário
  const lockers = loadLockers().map((lk) =>
    lk.clientName === name || (target.locker && lk.code === target.locker)
      ? { ...lk, clientName: "" }
      : lk
  );
  saveLockers(lockers);

  const now = new Date().toISOString();
  const rentals = loadRentals().map((r) => {
    if (r.clientName !== name || r.returned) return r;
    const shouldReturn =
      returnAllRentals || returnedIds.includes(r.id);
    return shouldReturn
      ? { ...r, returned: true, returnedAt: now }
      : r;
  });
  saveRentals(rentals);

  return {
    clients: nextClients,
    lockers,
    rentals,
    rooms: loadRooms(),
  };
}

export function getOpenRentalsForClient(clientName) {
  return loadRentals().filter(
    (r) => r.clientName === clientName && !r.returned
  );
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
  const removed = loadLockers().find((lk) => lk.id === id);
  const list = loadLockers().filter((lk) => lk.id !== id);
  saveLockers(list);
  const clients = loadClients().map((c) => {
    if (c.lockerId === id || (removed && c.locker === removed.code)) {
      return { ...c, lockerId: "", locker: "" };
    }
    return c;
  });
  saveClients(clients);
  return list;
}

/** Associa armário digitado (código) a um cliente; cria o armário se não existir */
export function assignLockerByCode(code, clientName) {
  const trimmed = (code || "").trim();
  const name = (clientName || "").trim();
  let lockers = loadLockers();

  // Libera armários deste cliente
  if (name) {
    lockers = lockers.map((lk) =>
      lk.clientName === name ? { ...lk, clientName: "" } : lk
    );
  }

  if (!trimmed) {
    saveLockers(lockers);
    const clients = loadClients().map((c) =>
      c.name === name ? { ...c, locker: "", lockerId: "" } : c
    );
    saveClients(clients);
    return { lockers, clients };
  }

  let target = lockers.find(
    (lk) => lk.code.toLowerCase() === trimmed.toLowerCase()
  );
  if (!target) {
    target = { id: uid("lk"), code: trimmed, clientName: name };
    lockers = [...lockers, target];
  } else {
    lockers = lockers.map((lk) =>
      lk.id === target.id ? { ...lk, clientName: name } : lk
    );
  }
  saveLockers(lockers);

  const clients = loadClients().map((c) =>
    c.name === name
      ? { ...c, locker: trimmed, lockerId: target.id }
      : c.lockerId === target.id
        ? { ...c, locker: "", lockerId: "" }
        : c
  );
  saveClients(clients);
  return { lockers, clients };
}

/** Associa (ou libera) um armário a um cliente pelo nome */
export function assignLockerToClient(lockerId, clientName) {
  const name = (clientName || "").trim();
  let lockers = loadLockers();
  const target = lockers.find((lk) => lk.id === lockerId);
  if (!target) return { lockers, clients: loadClients() };

  if (name) {
    lockers = lockers.map((lk) =>
      lk.clientName === name && lk.id !== lockerId
        ? { ...lk, clientName: "" }
        : lk
    );
  }

  lockers = lockers.map((lk) =>
    lk.id === lockerId ? { ...lk, clientName: name } : lk
  );
  saveLockers(lockers);

  let clients = loadClients().map((c) =>
    c.lockerId === lockerId || c.locker === target.code
      ? { ...c, lockerId: "", locker: "" }
      : c
  );
  if (name) {
    clients = clients.map((c) =>
      c.name === name
        ? { ...c, lockerId, locker: target.code }
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
      returned: false,
      returnedAt: "",
      ...rental,
      price: Number(rental.price) || 0,
    },
    ...list,
  ];
  saveRentals(next);
  return next;
}

export function markRentalReturned(id) {
  const now = new Date().toISOString();
  const list = loadRentals().map((r) =>
    r.id === id ? { ...r, returned: true, returnedAt: now } : r
  );
  saveRentals(list);
  return list;
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
