interface Node<T> {
  key: number,
  value: T,
  left: Node<T> | null,
  right: Node<T> | null,
}

export default class UnbalancedBinaryTree<T> {
  #root: Node<T> | null = null;

  #createNewNode(key: number, value: T): Node<T> {
    const node: Node<T> = {
      key,
      value,
      left: null,
      right: null,
    };

    return node;
  }


  // https://en.wikipedia.org/wiki/Binary_search_tree#Iterative_search
  get(key: number): T | null {
    let x = this.#root;

    while (x && (key !== x.key)) {
      if (key < x.key) {
        x = x.left;
      } else {
        x = x.right;
      }
    }

    return x?.value || null;
  }


  // https://en.wikipedia.org/wiki/Binary_search_tree#Insertion
  set(key: number, value: T): void {
    let y: Node<T> | null = null;
    let x: Node<T> | null = this.#root;
    while (x) {
      y = x;
      if (key < x.key) {
        x = x.left;
      } else {
        x = x.right;
      }
    }

    const newNode = this.#createNewNode(key, value);
    
    if (!y) {
      this.#root = newNode;
    } else if (key < y.key) {
      y.left = newNode;
    } else {
      y.right = newNode;
    }
  }
}