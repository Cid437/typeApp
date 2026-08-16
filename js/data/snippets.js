/**
 * snippets.js
 * -----------------------------------------------------------------------
 * Single source of truth for every language and its practice snippets.
 *
 * Each snippet is an object:
 *   - code:            the text typed in Random/Progression mode
 *   - description:     one short line shown above the editor before typing
 *   - explanation:     a longer write-up shown on the results screen
 *   - output:          a narrated sample of what running the code produces
 *                       (may include comments/setup — for the results screen)
 *   - predictedOutput: OPTIONAL. The exact literal text the snippet prints
 *                       when run, with no comments or narration. Only
 *                       snippets whose `code` actually calls something like
 *                       console.log/print/cout get this field — it's what
 *                       "Output" mode asks the user to type from memory.
 *   - level:            "beginner" | "easy" | "intermediate" | "advanced" | "expert"
 *
 * Snippets within each language are ordered from easiest to hardest —
 * that order IS the progression path (see progression mode in app.js).
 *
 * To add a new language:
 *   1. Add a new entry to SNIPPET_DATA, following the shape below.
 *   2. Push its key onto LANGUAGE_ORDER (controls display order).
 *
 * To add more snippets to an existing language, push another snippet
 * object into that language's `snippets` array, keeping the array sorted
 * from "beginner" to "expert" so the progression path stays coherent.
 * Add `predictedOutput` only if the snippet's code literally prints
 * something on its own — Output mode filters to those automatically.
 * -----------------------------------------------------------------------
 */

/** Display label + accent color for each level, keyed by the level string. */
const LEVEL_META = {
  beginner: { label: "Beginner", color: "#6fcf5a" },
  easy: { label: "Easy", color: "#a8d84a" },
  intermediate: { label: "Intermediate", color: "#ffb000" },
  advanced: { label: "Advanced", color: "#ff8a3d" },
  expert: { label: "Expert", color: "#ff5f56" },
};

// The order levels progress through — drives getSortedSnippets() below.
const LEVEL_ORDER = ["beginner", "easy", "intermediate", "advanced", "expert"];

const SNIPPET_DATA = {

  javascript: {
    id: "javascript",
    name: "JavaScript",
    extension: ".js",
    accent: "#f7df1e",
    snippets: [
      {
        level: "beginner",
        code:
`let score = 0;
score += 10;
console.log(score);`,
        description: "Declares a variable, updates it, then logs the value.",
        explanation:
          "let creates a variable that can be reassigned, unlike const. score += 10 is shorthand for score = score + 10, and console.log prints the current value to the console — the most basic way to inspect what a program is doing.",
        output: `10`,
        predictedOutput: `10`,
      },
      {
        level: "beginner",
        code:
`const name = "Ada";
console.log(\`Hello, \${name}!\`);`,
        description: "A template literal that interpolates a variable into a string.",
        explanation:
          "Backtick-delimited template literals let you embed expressions directly inside a string using ${...}, instead of concatenating with +. Here it inserts the value of name into the greeting at render time.",
        output: `Hello, Ada!`,
        predictedOutput: `Hello, Ada!`,
      },
      {
        level: "easy",
        code:
`const age = 20;
if (age >= 18) {
  console.log("adult");
} else {
  console.log("minor");
}`,
        description: "A simple if/else branching on a number.",
        explanation:
          "The condition age >= 18 is evaluated once; if it's true the first block runs, otherwise control falls to the else block. Only one branch ever executes, and console.log prints whichever label matched.",
        output: `adult`,
        predictedOutput: `adult`,
      },
      {
        level: "easy",
        code:
`for (let i = 0; i < 5; i++) {
  console.log(i);
}`,
        description: "A basic for loop counting from 0 up to 4.",
        explanation:
          "The loop declares i starting at 0, keeps running while i < 5, and increments i after each pass. That prints five lines total, from 0 through 4 — a classic counted loop.",
        output:
`0
1
2
3
4`,
        predictedOutput:
`0
1
2
3
4`,
      },
      {
        level: "intermediate",
        code:
`function sum(a, b) {
  return a + b;
}

console.log(sum(2, 3));`,
        description: "A named function that adds two numbers and returns the result.",
        explanation:
          "sum takes two parameters and returns their total with a return statement, which hands the value back to whoever called the function. Calling sum(2, 3) doesn't print anything by itself — it's the surrounding console.log that prints the returned value.",
        output: `5`,
        predictedOutput: `5`,
      },
      {
        level: "intermediate",
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
        level: "advanced",
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
        level: "advanced",
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
      {
        level: "expert",
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
        level: "expert",
        code:
`function* range(start, end) {
  for (let i = start; i < end; i++) {
    yield i;
  }
}

for (const n of range(1, 4)) {
  console.log(n);
}`,
        description: "A generator function that lazily yields numbers in a range.",
        explanation:
          "function* marks range as a generator: instead of returning once, it pauses at each yield and hands control back to the caller. A for...of loop pulls values out one at a time, so nothing is computed until it's actually needed — useful for large or infinite sequences.",
        output:
`1
2
3`,
        predictedOutput:
`1
2
3`,
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
        level: "beginner",
        code:
`name = "Ada"
print(f"Hello, {name}!")`,
        description: "An f-string that interpolates a variable into a greeting.",
        explanation:
          "Prefixing a string with f turns it into an f-string, letting you embed expressions directly inside {} instead of concatenating with +. Python evaluates name and substitutes its value when the string is built.",
        output: `Hello, Ada!`,
        predictedOutput: `Hello, Ada!`,
      },
      {
        level: "beginner",
        code:
`x = 5
y = 3
print(x + y)`,
        description: "Basic arithmetic stored in variables, then printed.",
        explanation:
          "x and y are assigned integer values, and x + y is evaluated before being passed to print. This is the simplest possible Python program shape: assign, compute, print.",
        output: `8`,
        predictedOutput: `8`,
      },
      {
        level: "beginner",
        code:
`favorite = "python"
print(favorite.upper())`,
        description: "Calls a string method to make text uppercase.",
        explanation:
          "Strings have built-in methods like .upper(), which returns a new string with every letter capitalized. The original variable is left unchanged, since strings in Python are immutable — .upper() hands back a brand new string rather than modifying favorite in place.",
        output: `PYTHON`,
        predictedOutput: `PYTHON`,
      },
      {
        level: "easy",
        code:
`age = 20
if age >= 18:
    print("adult")
else:
    print("minor")`,
        description: "An if/else branch based on age, using Python's indentation blocks.",
        explanation:
          "Python uses indentation instead of braces to define which lines belong to the if branch versus the else branch. Only one print statement runs, depending on whether age >= 18 evaluates to True or False.",
        output: `adult`,
        predictedOutput: `adult`,
      },
      {
        level: "easy",
        code:
`for i in range(5):
    print(i)`,
        description: "A for loop over range(5), printing 0 through 4.",
        explanation:
          "range(5) produces the sequence 0, 1, 2, 3, 4, and the for loop binds i to each value in turn, running the indented body once per iteration. It's the idiomatic way to repeat something a fixed number of times in Python.",
        output:
`0
1
2
3
4`,
        predictedOutput:
`0
1
2
3
4`,
      },
      {
        level: "easy",
        code:
`total = 0
for n in [1, 2, 3, 4]:
    total += n
print(total)`,
        description: "Accumulates a running total while looping over a list.",
        explanation:
          "total starts at 0, and each pass through the loop adds the next list element to it with +=. After the loop finishes, total holds the sum of every number in the list — the classic \"accumulator\" pattern.",
        output: `10`,
        predictedOutput: `10`,
      },
      {
        level: "intermediate",
        code:
`def add(a, b):
    return a + b

print(add(2, 3))`,
        description: "A function that adds two numbers, called and printed.",
        explanation:
          "def declares a function named add with two parameters; return sends the computed value back to the caller instead of printing it directly. print(add(2, 3)) first evaluates the function call, then prints whatever it returned.",
        output: `5`,
        predictedOutput: `5`,
      },
      {
        level: "intermediate",
        code: `squares = [x ** 2 for x in range(10) if x % 2 == 0]`,
        description: "Builds a list of squares for the even numbers under 10.",
        explanation:
          "This list comprehension iterates x over range(10), keeps only even values via the `if` filter, and squares each surviving value. It's a compact, Pythonic replacement for a manual for-loop with an if-check and append call.",
        output:
`squares
# [0, 4, 16, 36, 64]`,
      },
      {
        level: "intermediate",
        code:
`def is_even(n):
    return n % 2 == 0

evens = list(filter(is_even, range(10)))
print(evens)`,
        description: "Filters a range down to only its even numbers.",
        explanation:
          "is_even returns True or False depending on whether n divides evenly by 2. filter() applies that function to every value in range(10) and keeps only the ones it returns True for, and list() turns the resulting filter object into a concrete list.",
        output: `[0, 2, 4, 6, 8]`,
        predictedOutput: `[0, 2, 4, 6, 8]`,
      },
      {
        level: "advanced",
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
        level: "advanced",
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
      {
        level: "advanced",
        code:
`class BankAccount:
    def __init__(self, balance=0):
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        return self.balance`,
        description: "A class modeling a bank account with a deposit method.",
        explanation:
          "__init__ runs when a BankAccount is created, setting up an initial balance (defaulting to 0 if none is given). deposit adds the given amount to self.balance and returns the new total, so each instance keeps track of its own independent balance.",
        output:
`acct = BankAccount(100)
acct.deposit(50)  # 150`,
      },
      {
        level: "expert",
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
        level: "expert",
        code:
`import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(time.time() - start)
        return result
    return wrapper`,
        description: "A decorator that times how long the wrapped function takes to run.",
        explanation:
          "timer takes a function and returns a new wrapper function that records a start time, calls the original func with whatever arguments it received, prints the elapsed time, then returns func's result unchanged. Applying @timer above a function definition swaps it for this timed version automatically.",
        output:
`# @timer
# def slow(): ...
# slow()
0.0021398067474365234`,
      },
      {
        level: "expert",
        code:
`from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)`,
        description: "A memoized recursive Fibonacci function using a decorator.",
        explanation:
          "@lru_cache wraps fib so that once it's been called with a given n, the result is cached and instantly returned next time instead of being recomputed. That turns an otherwise exponential-time recursive Fibonacci into an effectively linear-time one, since each n is only ever computed once.",
        output:
`fib(30)
# 832040`,
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
        level: "beginner",
        code: `<h1>Hello, world!</h1>`,
        description: "The most basic HTML heading element.",
        explanation:
          "<h1> defines the top-level heading on a page — browsers render it large and bold by default, and it also signals document structure to screen readers and search engines. A page should generally have exactly one <h1>.",
        output: `Rendered as a large, bold "Hello, world!" heading.`,
      },
      {
        level: "beginner",
        code: `<p>This is a paragraph.</p>`,
        description: "A single block of paragraph text.",
        explanation:
          "<p> wraps a block of running text and browsers automatically add space above and below it. It's the default container for ordinary prose content on a page.",
        output: `Rendered as a normal paragraph of text.`,
      },
      {
        level: "easy",
        code: `<button onclick="alert('Hi!')">Click me</button>`,
        description: "A button that shows a popup alert when clicked.",
        explanation:
          "The onclick attribute wires up an inline JavaScript handler: whenever the button is clicked, the browser runs alert('Hi!'), which pops up a small dialog box with that message. Inline handlers like this are fine for tiny demos but usually get moved to a separate script for real apps.",
        output: `Clicking the button opens a browser alert box reading "Hi!"`,
      },
      {
        level: "easy",
        code: `<img src="cat.jpg" alt="A sleeping cat" />`,
        description: "An image tag with descriptive alt text.",
        explanation:
          "<img> embeds an image from the given src path. The alt attribute provides a text description that's shown if the image fails to load and read aloud by screen readers, making it essential for accessibility.",
        output: `Rendered as an inline image; "A sleeping cat" if the file can't load.`,
      },
      {
        level: "intermediate",
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
        output: `Rendered: [ Home ] [ About ]  — both clickable nav links`,
      },
      {
        level: "intermediate",
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
        output: `.card elements render as rounded, shadowed flex rows with 1rem gaps.`,
      },
      {
        level: "advanced",
        code:
`<form onsubmit="handleSubmit(event)">
  <input type="email" required />
  <button type="submit">Send</button>
</form>`,
        description: "An email signup form that calls a handler on submit.",
        explanation:
          "The form's onsubmit attribute intercepts the submit event and calls handleSubmit, typically to prevent the default full-page reload and send the data via JavaScript instead. The required email input also makes the browser block submission until a validly formatted address is entered.",
        output: `Submitting the form triggers: handleSubmit(event)`,
      },
      {
        level: "advanced",
        code:
`.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}`,
        description: "A CSS grid layout split into three equal columns.",
        explanation:
          "display: grid turns .container into a grid context, and grid-template-columns: repeat(3, 1fr) divides it into three tracks of equal width. gap adds consistent spacing between both rows and columns without needing margins on individual items.",
        output: `Children of .container arrange into 3 equal-width columns with 1rem gaps.`,
      },
      {
        level: "expert",
        code:
`:root {
  --spacing: 8px;
}
.box {
  padding: calc(var(--spacing) * 2);
}`,
        description: "A CSS custom property combined with calc() for dynamic spacing.",
        explanation:
          "--spacing is a custom property (CSS variable) defined once on :root, making it available anywhere in the stylesheet via var(--spacing). calc() then multiplies it by 2 for .box's padding, so changing that single value would update every place that depends on it.",
        output: `.box renders with 16px of padding, derived from --spacing * 2.`,
      },
      {
        level: "expert",
        code:
`<script>
  fetch("/api/data")
    .then(res => res.json())
    .then(data => console.log(data));
</script>`,
        description: "An inline script that fetches JSON data and logs it.",
        explanation:
          "fetch starts a network request to /api/data and returns a Promise. The first .then parses the response body as JSON (which is itself asynchronous, so it also returns a Promise), and the second .then logs the parsed data once it's ready.",
        output: `Logs the parsed JSON response, e.g. { "status": "ok" }`,
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
        level: "beginner",
        code:
`int x = 5;
int y = 3;
cout << x + y << endl;`,
        description: "Basic arithmetic stored in variables, then printed.",
        explanation:
          "x and y are declared as ints and initialized, then x + y is evaluated and streamed to cout, C++'s standard output stream. The << operator chains values onto the stream, and endl flushes the line with a newline.",
        output: `8`,
        predictedOutput: `8`,
      },
      {
        level: "beginner",
        code:
`string name = "Ada";
cout << "Hello, " << name << endl;`,
        description: "Building a greeting by streaming a string variable to cout.",
        explanation:
          "string name holds text, and the two << operators chain a literal and the variable onto the same output line. This is the standard C++ way to combine multiple pieces of output without manual concatenation.",
        output: `Hello, Ada`,
        predictedOutput: `Hello, Ada`,
      },
      {
        level: "easy",
        code:
`int age = 20;
if (age >= 18) {
    cout << "adult" << endl;
} else {
    cout << "minor" << endl;
}`,
        description: "An if/else branch on age, printed with cout.",
        explanation:
          "The condition age >= 18 is checked once; braces mark which statements belong to each branch. Only one of the two cout lines ever runs, depending on the result of the comparison.",
        output: `adult`,
        predictedOutput: `adult`,
      },
      {
        level: "easy",
        code:
`for (int i = 0; i < 5; i++) {
    cout << i << " ";
}`,
        description: "A basic for loop printing 0 through 4 on one line.",
        explanation:
          "The loop declares i, runs while i < 5, and increments after each pass — the same structure as for loops in JavaScript. Each iteration streams i followed by a space, so the numbers print side by side instead of on separate lines.",
        output: `0 1 2 3 4 `,
        predictedOutput: `0 1 2 3 4 `,
      },
      {
        level: "intermediate",
        code:
`int add(int a, int b) {
    return a + b;
}

cout << add(2, 3);`,
        description: "A function that adds two integers, called and printed.",
        explanation:
          "add is declared to return an int and takes two int parameters; return hands the sum back to the caller. cout << add(2, 3) first evaluates the function call, then streams whatever it returned to standard output.",
        output: `5`,
        predictedOutput: `5`,
      },
      {
        level: "intermediate",
        code:
`for (auto it = nums.begin(); it != nums.end(); ++it) {
    cout << *it << " ";
}`,
        description: "Iterates a vector with an explicit iterator, printing each value.",
        explanation:
          "This loop walks nums from begin() to end() using an iterator instead of an index, dereferencing `it` with `*it` to read each element. It's the pre-range-based-for idiom for traversing any STL container generically, regardless of its underlying storage.",
        output: `// nums = {1, 2, 3, 4, 5}
1 2 3 4 5 `,
        predictedOutput: `1 2 3 4 5 `,
      },
      {
        level: "advanced",
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
        output: `Point{0,0}.distance(Point{3,4}); // 5`,
      },
      {
        level: "advanced",
        code:
`class Counter {
    int count = 0;
public:
    void increment() { count++; }
    int value() const { return count; }
};`,
        description: "A Counter class encapsulating a private count with public methods.",
        explanation:
          "count is private by default (before the public: label), so it can only be changed through increment(), which is the class's controlled interface. value() is marked const to promise it won't modify the object, and simply returns the current count.",
        output:
`Counter c; c.increment(); c.increment();
c.value(); // 2`,
      },
      {
        level: "expert",
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
        output: `binarySearch({1,3,5,7,9}, 7); // 3`,
      },
      {
        level: "expert",
        code:
`template <typename T>
T maxOf(T a, T b) {
    return a > b ? a : b;
}`,
        description: "A generic template function that returns the larger of two values.",
        explanation:
          "template <typename T> makes maxOf work with any type T that supports >, rather than writing separate overloads for int, double, and so on. The compiler generates a concrete version of the function for each type it's actually called with, a technique called template instantiation.",
        output:
`maxOf(3, 7);      // 7
maxOf(2.5, 1.1);  // 2.5`,
      },
    ],
  },

};

// Controls the order languages appear in the picker + dropdown.
const LANGUAGE_ORDER = ["javascript", "python", "html", "cpp"];

/** Returns a random snippet object for a language (any level) — used by Random mode. */
function getRandomSnippet(languageId) {
  const pool = SNIPPET_DATA[languageId].snippets;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Returns a language's snippets sorted beginner -> expert. Snippet arrays
 * are already authored in that order, but sorting explicitly here means
 * progression mode stays correct even if someone appends snippets out of
 * order later.
 */
function getSortedSnippets(languageId) {
  const pool = SNIPPET_DATA[languageId].snippets;
  return [...pool].sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level));
}

/**
 * Returns only the snippets in a language whose code actually prints
 * something (i.e. they carry a `predictedOutput`) — the pool Output mode
 * draws from, since you can't predict the output of a bare class/struct
 * definition that never gets called.
 */
function getOutputEligibleSnippets(languageId) {
  return SNIPPET_DATA[languageId].snippets.filter((s) => !!s.predictedOutput);
}

/** Returns a random output-eligible snippet for a language, or null if it has none. */
function getRandomOutputSnippet(languageId) {
  const pool = getOutputEligibleSnippets(languageId);
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
