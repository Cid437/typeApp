/**
 * snippets.js
 * -----------------------------------------------------------------------
 * Single source of truth for every language and its practice snippets.
 *
 * Each snippet is an object, not a bare string, so it can carry teaching
 * copy alongside the code itself:
 *   - code:        the text the user actually types
 *   - description: one short line shown above the editor before typing
 *   - explanation: a longer write-up shown on the results screen
 *   - output:      a sample of what running the snippet would print/produce
 *
 * To add a new language:
 *   1. Add a new entry to SNIPPET_DATA, following the shape below.
 *   2. Push its key onto LANGUAGE_ORDER (controls display order).
 *
 * To add more snippets to an existing language, just push another
 * snippet object into that language's `snippets` array. Keep `code`
 * short (2-8 lines) so a single test stays focused.
 * -----------------------------------------------------------------------
 */

const SNIPPET_DATA = {

  javascript: {
    id: "javascript",
    name: "JavaScript",
    extension: ".js",
    accent: "#f7df1e",
    snippets: [
      {
        code:
`function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}`,
        description: "A debounce utility that delays a call until things go quiet.",
        explanation:
          "debounce wraps a function so rapid, repeated calls collapse into a single invocation. Each call resets a timer, and only once `delay` milliseconds pass without another call does `fn` actually run. It's the standard pattern for search-as-you-type boxes, window-resize handlers, and other high-frequency events where you only care about the final state.",
        output:
`const log = debounce(() => console.log("searching..."), 300);
log(); log(); log();
// 300ms after the last call:
// searching...`,
      },
      {
        code:
`const users = data
  .filter(u => u.active)
  .map(u => u.name)
  .sort();`,
        description: "Filters active users, pulls their names, then sorts them.",
        explanation:
          "This chain first keeps only records where `active` is true, transforms each surviving user into just its `name` string, then sorts the result alphabetically. It's a common three-step pipeline for turning raw API data into something ready to render in a UI.",
        output:
`// data = [{name:"Zoe",active:true},{name:"Amir",active:false},{name:"Bo",active:true}]
users;
// ["Bo", "Zoe"]`,
      },
      {
        code:
`class Stack {
  #items = [];
  push(item) { this.#items.push(item); }
  pop() { return this.#items.pop(); }
}`,
        description: "A minimal LIFO stack backed by a private field.",
        explanation:
          "Stack hides its internal array behind the private `#items` field, so outside code can only touch it through `push` and `pop`. push adds an item to the top; pop removes and returns the most recently added item, giving classic last-in-first-out behavior.",
        output:
`const s = new Stack();
s.push(1); s.push(2);
s.pop(); // 2`,
      },
      {
        code:
`async function fetchUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error("Not found");
  return res.json();
}`,
        description: "Fetches a user by id and throws if the request fails.",
        explanation:
          "fetchUser awaits a network request to a REST endpoint built from the given id. If the response isn't ok (a non-2xx status), it throws so the caller can catch and handle the failure; otherwise it parses and returns the JSON body.",
        output:
`await fetchUser(42);
// { id: 42, name: "Ada Lovelace" }`,
      },
    ],
  },

  python: {
    id: "python",
    name: "Python",
    extension: ".py",
    accent: "#3572A5",
    snippets: [
      {
        code:
`def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a`,
        description: "Iteratively computes the nth Fibonacci number.",
        explanation:
          "Starting from a=0, b=1, the loop repeatedly advances both variables to the next pair in the sequence, n times. This iterative approach runs in O(n) time and constant space, avoiding the exponential blowup of a naive recursive version.",
        output:
`fibonacci(10)
# 55`,
      },
      {
        code:
`class Node:
    def __init__(self, value):
        self.value = value
        self.next = None`,
        description: "A basic linked-list node holding a value and a pointer.",
        explanation:
          "Node is the building block of a singly linked list: each instance stores a value and a reference to the next node, initialized to None. Chaining these together lets you build a list without needing contiguous memory, and insertion/removal at a known point stays O(1).",
        output:
`n = Node(5)
n.value  # 5
n.next   # None`,
      },
      {
        code: `squares = [x ** 2 for x in range(10) if x % 2 == 0]`,
        description: "Builds a list of squares for the even numbers under 10.",
        explanation:
          "This list comprehension iterates x over range(10), keeps only even values via the `if` filter, and squares each surviving value. It's a compact, Pythonic replacement for a manual for-loop with an if-check and append call.",
        output:
`squares
# [0, 4, 16, 36, 64]`,
      },
      {
        code:
`with open("data.txt") as f:
    lines = [line.strip() for line in f]
`,
        description: "Reads a text file and strips whitespace from each line.",
        explanation:
          "The `with` statement opens data.txt and guarantees it's closed automatically afterward, even if an error occurs partway through. The comprehension then reads every line and strips leading/trailing whitespace, including the newline, into a clean list of strings.",
        output:
`lines
# ["first row", "second row", "third row"]`,
      },
    ],
  },

  html: {
    id: "html",
    name: "HTML / CSS",
    extension: ".html",
    accent: "#e34c26",
    snippets: [
      {
        code:
`<nav class="navbar">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>`,
        description: "A simple, semantic navigation bar with two links.",
        explanation:
          "This markup wraps the links in a semantic <nav> landmark containing an unordered list, which is the standard accessible pattern for site navigation. Screen readers announce <nav> as a distinct navigation region, and each <li> becomes its own link item in that region.",
        output:
`Rendered: [ Home ] [ About ]  — both clickable nav links`,
      },
      {
        code:
`.card {
  display: flex;
  gap: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,.1);
}`,
        description: "Flexbox styling for a rounded, shadowed card component.",
        explanation:
          "This rule turns any .card element into a flex container with evenly spaced children, rounded corners, and a soft drop shadow. It's a typical base style for product cards, profile cards, or dashboard tiles before any content-specific styling is layered on.",
        output:
`.card elements render as rounded, shadowed flex rows with 1rem gaps.`,
      },
      {
        code:
`<form onsubmit="handleSubmit(event)">
  <input type="email" required />
  <button type="submit">Send</button>
</form>`,
        description: "An email signup form that calls a handler on submit.",
        explanation:
          "The form's onsubmit attribute intercepts the submit event and calls handleSubmit, typically to prevent the default full-page reload and send the data via JavaScript instead. The required email input also makes the browser block submission until a validly formatted address is entered.",
        output:
`Submitting the form triggers: handleSubmit(event)`,
      },
    ],
  },

  cpp: {
    id: "cpp",
    name: "C++",
    extension: ".cpp",
    accent: "#00599C",
    snippets: [
      {
        code:
`int binarySearch(vector<int>& v, int target) {
    int lo = 0, hi = v.size() - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (v[mid] == target) return mid;
        v[mid] < target ? lo = mid + 1 : hi = mid - 1;
    }
    return -1;
}`,
        description: "Classic binary search over a sorted vector.",
        explanation:
          "binarySearch repeatedly halves the search range by comparing the middle element to the target: a match returns the index immediately, otherwise the search continues in whichever half must contain the target. It runs in O(log n) time, far faster than a linear scan once the input is large.",
        output:
`binarySearch({1,3,5,7,9}, 7); // 3`,
      },
      {
        code:
`struct Point {
    double x, y;
    double distance(const Point& o) const {
        return sqrt(pow(x - o.x, 2) + pow(y - o.y, 2));
    }
};`,
        description: "A 2D point struct with a Euclidean distance method.",
        explanation:
          "Point stores an x/y coordinate pair and exposes a const `distance` method that applies the Pythagorean theorem to compute the straight-line distance to another point. Marking the method const signals it doesn't modify the object it's called on.",
        output:
`Point{0,0}.distance(Point{3,4}); // 5`,
      },
      {
        code:
`for (auto it = nums.begin(); it != nums.end(); ++it) {
    cout << *it << " ";
}`,
        description: "Iterates a vector with an explicit iterator, printing each value.",
        explanation:
          "This loop walks nums from begin() to end() using an iterator instead of an index, dereferencing `it` with `*it` to read each element. It's the pre-range-based-for idiom for traversing any STL container generically, regardless of its underlying storage.",
        output:
`// prints: 1 2 3 4 5`,
      },
    ],
  },

};

// Controls the order languages appear in the picker + dropdown.
const LANGUAGE_ORDER = ["javascript", "python", "html", "cpp"];

/** Returns a random snippet object ({code, description, explanation, output}) for a language. */
function getRandomSnippet(languageId) {
  const pool = SNIPPET_DATA[languageId].snippets;
  return pool[Math.floor(Math.random() * pool.length)];
}
