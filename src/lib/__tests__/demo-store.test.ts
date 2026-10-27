import { describe, expect, it } from "vitest";
import { DEMO_STORAGE_KEY, createDemoStore, type StorageLike } from "../demo-store";
import type { Letter, LetterState, SubscribeOptions } from "../types";

function memoryStorage(): StorageLike & { dump(): string | null } {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
    dump: () => map.get(DEMO_STORAGE_KEY) ?? null,
  };
}

type Store = ReturnType<typeof createDemoStore>;

function snapshot(store: Store, id: string, options?: SubscribeOptions): LetterState {
  let state: LetterState = { status: "loading" };
  store.subscribeLetter(
    id,
    (next) => {
      state = next;
    },
    options,
  )();
  return state;
}

function mine(store: Store, uid: string): Letter[] {
  let letters: Letter[] = [];
  store.subscribeMyLetters(
    uid,
    (next) => {
      letters = next;
    },
    () => {},
  )();
  return letters;
}

describe("demo store", () => {
  it("starts with one example letter for the demo owner and nothing for anyone else", () => {
    const store = createDemoStore(memoryStorage(), { seedOwner: "demo" });
    const letters = mine(store, "demo");
    expect(letters).toHaveLength(1);
    expect(letters[0].childName).toBe("Emma");
    expect(letters[0].items.length).toBeGreaterThan(0);
    expect(mine(store, "someone-else")).toHaveLength(0);
    expect(mine(createDemoStore(memoryStorage()), "demo")).toHaveLength(0);
  });

  it("creates, edits and lists letters, newest first", async () => {
    const store = createDemoStore(memoryStorage());
    const first = await store.createLetter("p", "Liam", "desk");
    const second = await store.createLetter("p", "  Noah  ", "table");
    await store.updateLetter(first, { intro: "Hello Santa", childName: "Liam J." });

    const letters = mine(store, "p");
    expect(letters.map((l) => l.id)).toEqual([first, second]);
    expect(letters[0].intro).toBe("Hello Santa");
    expect(letters[0].childName).toBe("Liam J.");
    expect(letters[1].childName).toBe("Noah");
    expect(letters[1].background).toBe("table");
  });

  it("keeps private letters away from guests but never from the owner", async () => {
    const store = createDemoStore(memoryStorage());
    const id = await store.createLetter("p", "Ava", "snow");
    expect(snapshot(store, id, { asGuest: true }).status).toBe("denied");
    expect(snapshot(store, id).status).toBe("ready");
    await store.setSharing(id, true);
    expect(snapshot(store, id, { asGuest: true }).status).toBe("ready");
    expect(snapshot(store, "nope").status).toBe("missing");
  });

  it("manages wishes and notifies subscribers", async () => {
    const store = createDemoStore(memoryStorage());
    const id = await store.createLetter("p", "Mia", "snow");
    const seen: LetterState[] = [];
    const stop = store.subscribeLetter(id, (state) => seen.push(state));

    await store.addWish(id, { name: "A sled", url: "https://example.com/sled", note: "" });
    await store.addWish(id, { name: "Mittens", url: "", note: "red ones" });
    let letter = (seen.at(-1) as { letter: Letter }).letter;
    expect(letter.items.map((w) => w.name)).toEqual(["A sled", "Mittens"]);

    await store.moveWish(id, letter.items[1].id, -1);
    await store.updateWish(id, letter.items[0].id, { name: "A faster sled", url: "", note: "" });
    letter = (seen.at(-1) as { letter: Letter }).letter;
    expect(letter.items.map((w) => w.name)).toEqual(["Mittens", "A faster sled"]);

    await store.removeWish(id, letter.items[0].id);
    letter = (seen.at(-1) as { letter: Letter }).letter;
    expect(letter.items.map((w) => w.name)).toEqual(["A faster sled"]);

    await expect(store.addWish(id, { name: "", url: "", note: "" })).rejects.toThrow("needs a name");
    await expect(store.addWish(id, { name: "x", url: "javascript:alert(1)", note: "" })).rejects.toThrow("web address");
    stop();
  });

  it("rotating the link kills the old id and keeps the content", async () => {
    const store = createDemoStore(memoryStorage());
    const id = await store.createLetter("p", "Leo", "snow");
    await store.addWish(id, { name: "A kite", url: "", note: "" });
    await store.setSharing(id, true);
    const letter = (snapshot(store, id) as { letter: Letter }).letter;

    const newId = await store.rotateLink(letter);
    expect(newId).not.toBe(id);
    expect(snapshot(store, id).status).toBe("missing");
    const moved = snapshot(store, newId, { asGuest: true });
    expect(moved.status).toBe("ready");
    expect((moved as { letter: Letter }).letter.items[0].name).toBe("A kite");

    await store.deleteLetter(newId);
    expect(mine(store, "p")).toHaveLength(0);
  });

  it("persists as JSON and survives corrupt storage", async () => {
    const storage = memoryStorage();
    const store = createDemoStore(storage);
    const id = await store.createLetter("p", "Zoe", "snow");
    expect(JSON.parse(storage.dump() ?? "{}")[id].childName).toBe("Zoe");

    storage.setItem(DEMO_STORAGE_KEY, "{not json");
    expect(mine(createDemoStore(storage), "p")).toHaveLength(0);

    storage.setItem(DEMO_STORAGE_KEY, JSON.stringify({ bad: { items: "nope" }, ok: { ownerId: "p", items: [{ id: "w", name: "Boots" }, null] } }));
    const [letter] = mine(createDemoStore(storage), "p");
    expect(letter.id).toBe("ok");
    expect(letter.items).toEqual([{ id: "w", name: "Boots", url: "", note: "", createdAt: 0 }]);
  });
});
