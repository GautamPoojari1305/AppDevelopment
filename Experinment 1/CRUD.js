  // Our data array
let items = [];

// CREATE
function createItem(name) {
  const newItem = {
    id: items.length + 1,
    name: name,
  };
  items.push(newItem);
  console.log("Created:", newItem);
}

// READ
function readItems() {
  console.log("Current Items:", items);
}

// UPDATE
function updateItem(id, newName) {
  const item = items.find(i => i.id === id);
  if (item) {
    item.name = newName;
    console.log("Updated:", item);
  } else {
    console.log(`Item with id=${id} not found.`);
  }
}

// DELETE
function deleteItem(id) {
  const index = items.findIndex(i => i.id === id);
  if (index !== -1) {
    const deleted = items.splice(index, 1);
    console.log("Deleted:", deleted[0]);
  } else {
    console.log(`Item with id=${id} not found.`);
  }
}

// Example usage
createItem("Apple");
createItem("Banana");
readItems();

updateItem(2, "Mango");
readItems();

deleteItem(1);
readItems();
