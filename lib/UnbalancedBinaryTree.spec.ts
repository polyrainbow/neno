import assert from 'node:assert';
import it, { describe } from 'node:test';
import UnbalancedBinaryTree from './UnbalancedBinaryTree.js';


describe("UnbalancedBinaryTree", () => {
  it("should correctly set and retrieve nodes", async () => {
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

  it("should return null if node not found", async () => {
    const tree = new UnbalancedBinaryTree();
    assert.strictEqual(tree.get(1), null);
  });

  it("should correctly overwrite existing nodes", async () => {
    const tree = new UnbalancedBinaryTree();
    tree.set(1, 1);
    tree.set(1, 2);
    assert.strictEqual(tree.get(1), 2);
  });
});
