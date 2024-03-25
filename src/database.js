import fs from "node:fs/promises";

const databasePath = new URL("db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }
    this.#persist();
    return data;
  }

  select(table, search) {
    let data = this.#database[table] || [];
    if (search) {
      data = data.filter((item) => {
        return Object.entries(search).some(([key, value]) => item[key].toLowerCase().includes(value.toLowerCase()));
      });
    }
    return data;
  }

  delete(table, id) {
    const idx = this.#database[table].findIndex((item) => item.id === id);
    if (idx > -1) {
      this.#database[table].splice(idx, 1);
      this.#persist();
    }
  }

  update(table, id, data) {
    const idx = this.#database[table].findIndex((item) => item.id === id);
    if (idx > -1) {
      this.#database[table][idx] = { id, ...data };
      this.#persist();
    }
  }
}
