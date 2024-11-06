import { Hono } from "@hono/hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello from the Trees!");
});

interface Tree {
  id: string;
  species: string;
  age: number;
  location: string;
}

const oak: Tree = {
  id: "3",
  species: "oak",
  age: 4,
  location: "Some park",
};

const setItem = (key: string, value: Tree) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = (key: string): Tree | null => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

setItem(`trees_${oak.id}`, oak);
const newTree = getItem(`trees_${oak.id}`);
console.log(newTree);

app.post("trees", async (c) => {
  const treeDetails = await c.req.json();
  const tree: Tree = treeDetails;
  setItem(`trees_${tree.id}`, tree);
  return c.json({
    message: `We just added a ${tree.species} tree`,
  });
});

app.get(`/trees/:id`, async (c) => {
  const id = await c.req.param("id");
  const tree = getItem(`trees_${id}`);
  if (!tree) {
    return c.json({ message: "Tree not found" }, 404);
  }
  return c.json({ tree });
});

app.put(`/trees/:id`, async (c) => {
  const id = await c.req.param("id");
  const { species, age, location } = await c.req.json();
  const updatedTree: Tree = { id, species, age, location };
  setItem(`trees_${id}`, updatedTree);
  return c.json({
    message: `Tree has changed, ${location}, ${species}, ${age}`,
  });
});

const deleteItem = (key: string) => {
  localStorage.removeItem(key);
};

app.delete("/trees/:id", async (c) => {
  const id = await c.req.param("id");
  deleteItem(`trees_${id}`);
  return c.json({
    message: `Tree ${id} has been cut down`,
  });
});

Deno.serve(app.fetch);
