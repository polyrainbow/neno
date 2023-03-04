import assert from 'node:assert';
import test from 'node:test';
import UnbalancedBinaryTree from './UnbalancedBinaryTree.js';


test("UnbalancedBinaryTree", async (t) => {
  await t.test("should correctly set and retrieve nodes", () => {
    const tree = new UnbalancedBinaryTree();
    tree.set(100, "100");
    tree.set(50, "50");
    tree.set(150, "150");
    tree.set(75, "75");
    assert.strictEqual(tree.get(50), "50");
    assert.strictEqual(tree.get(75), "75");
    assert.strictEqual(tree.get(100), "100");
    assert.strictEqual(tree.get(150), "150");
  });

  await t.test("should return null if node not found", () => {
    const tree = new UnbalancedBinaryTree();
    assert.strictEqual(tree.get(1), null);
  });

  await t.test("should correctly overwrite existing nodes", () => {
    const tree = new UnbalancedBinaryTree();
    tree.set(1, 1);
    tree.set(1, 2);
    assert.strictEqual(tree.get(1), 2);
  });
});
