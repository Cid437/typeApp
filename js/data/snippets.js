/**
 * snippets.js
 * -----------------------------------------------------------------------
 * Single source of truth for every language and its practice snippets.
 *
 * To add a new language:
 *   1. Add a new entry to SNIPPET_DATA, following the shape below.
 *   2. Push its key onto LANGUAGE_ORDER (controls display order).
 *
 * To add more snippets to an existing language, just push more strings
 * into that language's `snippets` array. Keep snippets short (2-8 lines)
 * so a single test stays focused.
 * -----------------------------------------------------------------------
 */

const SNIPPET_DATA = {

  javascript: {
    id: "javascript",
    name: "JavaScript",
    extension: ".js",
    accent: "#f7df1e",
    snippets: [
`function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}`,
`const users = data
  .filter(u => u.active)
  .map(u => u.name)
  .sort();`,
`class Stack {
  #items = [];
  push(item) { this.#items.push(item); }
  pop() { return this.#items.pop(); }
}`,
`async function fetchUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error("Not found");
  return res.json();
}`
    ],
  },

  python: {
    id: "python",
    name: "Python",
    extension: ".py",
    accent: "#3572A5",
    snippets: [
`def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a`,
`class Node:
    def __init__(self, value):
        self.value = value
        self.next = None`,
`squares = [x ** 2 for x in range(10) if x % 2 == 0]`,
`with open("data.txt") as f:
    lines = [line.strip() for line in f]
`
    ],
  },

  html: {
    id: "html",
    name: "HTML / CSS",
    extension: ".html",
    accent: "#e34c26",
    snippets: [
`<nav class="navbar">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>`,
`.card {
  display: flex;
  gap: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,.1);
}`,
`<form onsubmit="handleSubmit(event)">
  <input type="email" required />
  <button type="submit">Send</button>
</form>`
    ],
  },

  cpp: {
    id: "cpp",
    name: "C++",
    extension: ".cpp",
    accent: "#00599C",
    snippets: [
`int binarySearch(vector<int>& v, int target) {
    int lo = 0, hi = v.size() - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (v[mid] == target) return mid;
        v[mid] < target ? lo = mid + 1 : hi = mid - 1;
    }
    return -1;
}`,
`struct Point {
    double x, y;
    double distance(const Point& o) const {
        return sqrt(pow(x - o.x, 2) + pow(y - o.y, 2));
    }
};`,
`for (auto it = nums.begin(); it != nums.end(); ++it) {
    cout << *it << " ";
}`
    ],
  },

};

// Controls the order languages appear in the picker + dropdown.
const LANGUAGE_ORDER = ["javascript", "python", "html", "cpp"];

/** Returns a random snippet string for the given language id. */
function getRandomSnippet(languageId) {
  const pool = SNIPPET_DATA[languageId].snippets;
  return pool[Math.floor(Math.random() * pool.length)];
}
