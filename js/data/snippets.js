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
 *                       (may include comments/setup — for the results screen,
 *                       and as the pre-typing output panel's fallback)
 *   - predictedOutput: OPTIONAL. The exact literal text the snippet prints
 *                       when run, with no comments or narration. Only
 *                       snippets whose `code` actually calls something like
 *                       console.log/print/cout get this field. When present,
 *                       it's shown (instead of `output`) above the editor
 *                       before typing starts, in every mode.
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
 * something on its own.
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
        level: "beginner",
        code:
`pi = 3.14159
radius = 4
print(pi * radius ** 2)`,
        description: "Computes and prints the area of a circle.",
        explanation:
          "radius ** 2 raises radius to the power of 2 using Python's exponent operator, then multiplies by pi. Operator precedence means ** binds tighter than *, so the squaring happens before the multiplication.",
        output: `50.26544`,
        predictedOutput: `50.26544`,
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
        level: "easy",
        code:
`fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit.upper())`,
        description: "Loops over a list and prints each item in uppercase.",
        explanation:
          "The for loop binds fruit to each element of the fruits list in turn. .upper() is a string method that returns a new, all-caps copy of the string — it doesn't modify the original list.",
        output:
`APPLE
BANANA
CHERRY`,
        predictedOutput:
`APPLE
BANANA
CHERRY`,
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
        level: "intermediate",
        code:
`def is_palindrome(s):
    s = s.lower()
    return s == s[::-1]

print(is_palindrome("Racecar"))`,
        description: "Checks whether a string reads the same backwards.",
        explanation:
          "s[::-1] uses Python's extended slice syntax to reverse the string, and comparing it to the lowercased original tells you whether the text is a palindrome. Lowercasing first keeps the check case-insensitive.",
        output: `True`,
        predictedOutput: `True`,
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
        level: "advanced",
        code:
`from collections import Counter

words = "the cat sat on the mat".split()
print(Counter(words))`,
        description: "Counts word frequency using the collections module.",
        explanation:
          "split() breaks the sentence into a list of words on whitespace, and Counter tallies how many times each distinct item appears, returning a dict-like object ordered by first occurrence. It's the standard tool for frequency counting in Python.",
        output: `Counter({'the': 2, 'cat': 1, 'sat': 1, 'on': 1, 'mat': 1})`,
        predictedOutput: `Counter({'the': 2, 'cat': 1, 'sat': 1, 'on': 1, 'mat': 1})`,
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
      {
        level: "expert",
        code:
`def memoize(func):
    cache = {}
    def wrapper(n):
        if n not in cache:
            cache[n] = func(n)
        return cache[n]
    return wrapper

@memoize
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)`,
        description: "A hand-written memoizing decorator that caches recursive results.",
        explanation:
          "memoize wraps fib in a closure holding a cache dict; before recomputing fib(n), wrapper checks whether that result is already cached and reuses it if so. Applied to naive recursive Fibonacci, this turns an exponential-time function into a linear-time one by never solving the same subproblem twice — the same idea functools.lru_cache automates for you.",
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

  bash: {
    id: "bash",
    name: "Bash (Linux / macOS)",
    extension: ".sh",
    accent: "#4EAA25",
    snippets: [
      {
        level: "beginner",
        code: `pwd`,
        description: "Prints the current working directory's full path.",
        explanation:
          "pwd stands for \"print working directory\" and is usually the first command you run to orient yourself — it tells you exactly where in the filesystem your shell session currently is, which matters because relative paths (like ./file.txt) are resolved from here.",
        output: `/Users/ada/projects/typeApp`,
        predictedOutput: `/Users/ada/projects/typeApp`,
      },
      {
        level: "beginner",
        code: `ls -la`,
        description: "Lists every file in the current directory, including hidden ones, with details.",
        explanation:
          "ls lists directory contents; -l switches to the long listing format showing permissions, owner, size, and modified date, while -a includes dotfiles (hidden entries starting with a period) that a plain ls would skip, like .gitignore.",
        output:
`drwxr-xr-x  6 ada  staff   192 Aug 12 09:14 .
drwxr-xr-x  9 ada  staff   288 Aug 10 17:02 ..
-rw-r--r--  1 ada  staff  1042 Aug 12 09:14 index.html
drwxr-xr-x  4 ada  staff   128 Aug 11 20:31 js`,
      },
      {
        level: "easy",
        code: `mkdir project && cd project`,
        description: "Creates a new directory and immediately moves into it.",
        explanation:
          "mkdir creates the project folder, and && only runs the following command if the first one succeeded — so cd project only fires once the directory actually exists. Chaining commands like this is a common shell habit for atomic \"create then enter\" steps.",
        output: `# no output — the prompt's path now ends in /project`,
      },
      {
        level: "easy",
        code: `cp -r src/ backup/`,
        description: "Recursively copies a whole directory tree to a new location.",
        explanation:
          "cp copies files, but by default it refuses to copy directories outright — the -r (recursive) flag tells it to walk into src/ and copy every file and subfolder inside it into backup/, preserving the directory structure.",
        output: `# no output on success — backup/ now mirrors src/`,
      },
      {
        level: "intermediate",
        code: `grep -rn "TODO" ./src`,
        description: "Recursively searches source files for a text pattern, with line numbers.",
        explanation:
          "grep scans file contents for lines matching a pattern; -r walks into every subdirectory of ./src, and -n prefixes each match with its line number so you can jump straight to it in an editor. It's the fastest way to find every leftover TODO across a codebase.",
        output:
`./src/app.js:42:  // TODO: handle empty state
./src/utils.js:8:  // TODO: memoize this`,
      },
      {
        level: "intermediate",
        code: `find . -name "*.log" -mtime +7 -delete`,
        description: "Finds and deletes log files older than a week.",
        explanation:
          "find walks the current directory tree; -name \"*.log\" filters to log files, -mtime +7 keeps only ones last modified more than 7 days ago, and -delete removes every file that matches all the preceding conditions. Flags in a find command act like a chained filter, left to right.",
        output: `# no output — matching files are silently removed`,
      },
      {
        level: "intermediate",
        code: `chmod +x deploy.sh && ./deploy.sh`,
        description: "Makes a script executable, then runs it.",
        explanation:
          "chmod changes a file's permission bits; +x adds execute permission for everyone, which most shell scripts need before they can be run directly. Once that succeeds, ./deploy.sh runs the script, with ./ required so the shell looks in the current directory instead of your PATH.",
        output: `Deploying build to production...`,
      },
      {
        level: "advanced",
        code: `ps aux | grep node | awk '{print $2}'`,
        description: "Lists the process IDs of every running node process.",
        explanation:
          "ps aux lists every running process with details like PID and command; piping into grep node filters that list down to lines mentioning node. awk '{print $2}' then splits each remaining line on whitespace and prints just the second column, which is the PID — a common three-stage pipeline for scripting process management.",
        output:
`4821
6390`,
      },
      {
        level: "advanced",
        code: `tar -czvf backup.tar.gz ./data`,
        description: "Bundles and compresses a directory into a single archive.",
        explanation:
          "tar combines files into a single archive; -c creates a new one, -z pipes it through gzip compression, -v prints each file as it's added (verbose), and -f names the output file. The result, backup.tar.gz, is the standard \"tarball\" format for distributing or backing up a directory tree.",
        output:
`./data/
./data/users.json
./data/config.yml`,
      },
      {
        level: "expert",
        code:
`for f in *.txt; do
  mv "$f" "\${f%.txt}.md"
done`,
        description: "Batch-renames every .txt file in the folder to .md.",
        explanation:
          "The loop binds f to each matching filename in turn. \${f%.txt} is parameter expansion that strips a trailing \".txt\" suffix off the value of f, and appending \".md\" builds the new name — so mv renames each file in place without ever touching the parts of the name before the extension.",
        output: `# no output — notes.txt becomes notes.md, todo.txt becomes todo.md, etc.`,
      },
      {
        level: "expert",
        code: `cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -5`,
        description: "Finds the top 5 most frequent IP addresses in a log file.",
        explanation:
          "This pipeline reads the log, extracts the first whitespace-separated field of every line (the IP), sorts those IPs so identical ones sit next to each other, collapses duplicates into counted lines with uniq -c, sorts numerically in reverse to put the highest counts first, and head -5 keeps only the top five — a classic \"count and rank\" shell one-liner.",
        output:
`  482 203.0.113.7
  310 198.51.100.4
  201 203.0.113.9
   88 192.0.2.15
   41 198.51.100.20`,
      },
    ],
  },

  powershell: {
    id: "powershell",
    name: "PowerShell (Windows)",
    extension: ".ps1",
    accent: "#5391FE",
    snippets: [
      {
        level: "beginner",
        code: `Get-Location`,
        description: "Prints the current working directory.",
        explanation:
          "Get-Location is PowerShell's equivalent of pwd — it returns a path object describing where the current session is rooted in the filesystem, which relative paths are resolved against. Cmdlets like this follow PowerShell's Verb-Noun naming convention.",
        output:
`Path
----
C:\\Users\\Ada\\projects\\typeApp`,
      },
      {
        level: "beginner",
        code: `Get-ChildItem`,
        description: "Lists files and folders in the current directory.",
        explanation:
          "Get-ChildItem (often aliased as ls or dir) returns the items — files and subdirectories — directly inside the current location as objects, complete with properties like Mode, LastWriteTime, and Length, not just plain text like older shells would print.",
        output:
`    Directory: C:\\Users\\Ada\\projects\\typeApp

Mode    LastWriteTime     Length Name
----    -------------     ------ ----
d----   8/12/2026 9:14 AM        js
-a---   8/12/2026 9:14 AM   1042 index.html`,
      },
      {
        level: "easy",
        code: `New-Item -ItemType Directory -Name project`,
        description: "Creates a new folder in the current directory.",
        explanation:
          "New-Item is a general-purpose creation cmdlet; -ItemType Directory tells it to make a folder rather than a file, and -Name supplies the folder's name. It returns the newly created item as an object, which is why you see its details echoed back.",
        output:
`    Directory: C:\\Users\\Ada\\projects\\typeApp

Mode    LastWriteTime     Length Name
----    -------------     ------ ----
d----   8/17/2026 2:03 PM        project`,
      },
      {
        level: "easy",
        code: `Copy-Item -Path .\\src -Destination .\\backup -Recurse`,
        description: "Recursively copies a folder to a new location.",
        explanation:
          "Copy-Item duplicates files or folders; -Recurse is required to copy a directory's full contents rather than just an empty folder shell, mirroring src's structure and files into backup. Parameters in PowerShell are explicit and named, rather than relying on single-letter flags.",
        output: `# no output on success — backup\\ now mirrors src\\`,
      },
      {
        level: "intermediate",
        code: `Get-Process | Where-Object { $_.CPU -gt 100 }`,
        description: "Lists running processes using more than 100 CPU seconds.",
        explanation:
          "Get-Process returns every running process as an object with properties like CPU and Id. Piping into Where-Object filters that stream, keeping only objects where the condition is true; $_ refers to \"the current object in the pipeline\", so $_.CPU reads each process's CPU time.",
        output:
`Handles  NPM(K)    PM(K)      CPU(s)     Id  ProcessName
-------  ------    -----      ------     --  -----------
    842      41   210532      184.22   6390  node
    511      28   142880      131.05   4821  chrome`,
      },
      {
        level: "intermediate",
        code: `Get-ChildItem -Recurse -Filter *.log`,
        description: "Finds every .log file anywhere under the current folder.",
        explanation:
          "-Recurse tells Get-ChildItem to descend into every subdirectory instead of only listing the top level, and -Filter *.log narrows results to files matching that wildcard pattern before they're even returned, which is faster than filtering afterward with Where-Object.",
        output:
`    Directory: C:\\Users\\Ada\\projects\\typeApp\\logs

Mode    LastWriteTime     Length Name
----    -------------     ------ ----
-a---   8/16/2026 6:40 PM   8213 error.log
-a---   8/17/2026 1:10 PM   4029 access.log`,
      },
      {
        level: "advanced",
        code: `Get-Content log.txt | Select-String "ERROR"`,
        description: "Prints every line in a log file that contains the word ERROR.",
        explanation:
          "Get-Content streams a text file's contents line by line into the pipeline, and Select-String acts like a PowerShell-native grep, matching each line against the given pattern and returning only the lines (with match info) that succeed.",
        output:
`log.txt:14:[ERROR] connection timed out
log.txt:88:[ERROR] invalid token`,
      },
      {
        level: "advanced",
        code: `Get-ChildItem *.txt | Rename-Item -NewName { $_.Name -replace '\\.txt$','.md' }`,
        description: "Batch-renames every .txt file in the folder to .md.",
        explanation:
          "Get-ChildItem *.txt streams matching files into the pipeline, and Rename-Item's -NewName accepts a script block evaluated once per item; inside it, $_ is the current file object and -replace swaps the trailing .txt extension for .md on each one.",
        output: `# no output — notes.txt becomes notes.md, todo.txt becomes todo.md, etc.`,
      },
      {
        level: "expert",
        code:
`function Get-TopWords {
    param([string]$Path, [int]$Top = 5)
    Get-Content $Path -Raw -Split '\\W+' |
      Group-Object | Sort-Object Count -Descending |
      Select-Object -First $Top
}`,
        description: "A reusable function returning the most frequent words in a file.",
        explanation:
          "The function declares typed parameters with a default value for $Top, splits the file's raw text on non-word characters, groups identical tokens together with Group-Object (which counts them automatically), sorts by that Count descending, and keeps only the first $Top groups — a full word-frequency pipeline wrapped in a reusable function.",
        output:
`Get-TopWords -Path notes.txt -Top 3

Count Name
----- ----
   42 the
   19 project
   12 deploy`,
      },
      {
        level: "expert",
        code: `Get-Process | Sort-Object CPU -Descending | Select-Object -First 5 Name,CPU | Export-Csv top5.csv -NoTypeInformation`,
        description: "Exports the top 5 CPU-heaviest processes to a CSV file.",
        explanation:
          "This pipeline sorts all running processes by CPU time descending, keeps just the top 5 with only their Name and CPU columns, and writes that to top5.csv. -NoTypeInformation drops PowerShell's usual '#TYPE' metadata header, producing a plain, spreadsheet-friendly CSV.",
        output: `# no console output — top5.csv is written to the current folder`,
      },
    ],
  },

  cmd: {
    id: "cmd",
    name: "Windows CMD",
    extension: ".bat",
    accent: "#c1c1c1",
    snippets: [
      {
        level: "beginner",
        code: `dir`,
        description: "Lists the files and folders in the current directory.",
        explanation:
          "dir is the Command Prompt's built-in directory-listing command, printing each entry's size, type, and last-modified date, along with a summary of total files and free disk space at the end — the CMD equivalent of ls in Unix shells.",
        output:
` Volume in drive C has no label.

08/17/2026  02:03 PM    <DIR>          js
08/12/2026  09:14 AM             1,042 index.html
               1 File(s)          1,042 bytes`,
      },
      {
        level: "beginner",
        code: `cd`,
        description: "Prints the current directory path.",
        explanation:
          "Run with no arguments, cd (short for \"change directory\") simply prints the current working directory instead of changing it — useful for quickly checking where you are before running a relative-path command.",
        output: `C:\\Users\\Ada\\projects\\typeApp`,
        predictedOutput: `C:\\Users\\Ada\\projects\\typeApp`,
      },
      {
        level: "easy",
        code: `mkdir project`,
        description: "Creates a new folder in the current directory.",
        explanation:
          "mkdir (aliased to md) creates a new directory with the given name inside the current location. Unlike some Unix mkdir implementations, it will also create any missing parent folders in the path automatically.",
        output: `# no output on success — the "project" folder now exists`,
      },
      {
        level: "easy",
        code: `copy file.txt backup.txt`,
        description: "Copies a file to a new name in the same folder.",
        explanation:
          "copy duplicates the source file's contents into the destination name; if backup.txt doesn't exist yet, it's created, and if it does, CMD will prompt before overwriting it. This is the most basic file-duplication command in the Windows shell.",
        output: `        1 file(s) copied.`,
        predictedOutput: `        1 file(s) copied.`,
      },
      {
        level: "intermediate",
        code: `dir /s *.txt`,
        description: "Recursively lists every .txt file under the current folder.",
        explanation:
          "The /s switch tells dir to search the current directory and every subdirectory beneath it, not just the top level, while *.txt restricts the listing to files matching that extension — handy for locating scattered text files across a project tree.",
        output:
`Directory of C:\\Users\\Ada\\projects\\typeApp\\notes

08/15/2026  10:22 AM               812 todo.txt`,
      },
      {
        level: "intermediate",
        code: `findstr "error" log.txt`,
        description: "Prints every line in a file containing the word 'error'.",
        explanation:
          "findstr is CMD's built-in text-search command, similar to grep — it scans log.txt line by line and prints only the lines containing the given string. By default the match is case-sensitive unless the /i switch is added.",
        output:
`14:connection failed: socket error
88:invalid token error`,
      },
      {
        level: "advanced",
        code: `for %i in (*.txt) do echo %i`,
        description: "Loops over every .txt file and prints its name.",
        explanation:
          "The for loop expands *.txt into each matching filename in turn, binding it to the loop variable %i, and echo %i prints that name on its own line. In a saved .bat script file the variable would be written %%i instead, since a single percent sign is only valid when typed directly at the prompt.",
        output:
`notes.txt
todo.txt`,
        predictedOutput:
`notes.txt
todo.txt`,
      },
      {
        level: "advanced",
        code: `netstat -an | findstr LISTEN`,
        description: "Lists all network ports currently listening for connections.",
        explanation:
          "netstat -an prints every active network connection and listening port in numeric form (no hostname lookups, thanks to -n). Piping into findstr LISTEN narrows that output down to only the ports in the LISTENING state, which is useful for checking what's bound before starting a local server.",
        output:
`  TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING
  TCP    0.0.0.0:5432           0.0.0.0:0              LISTENING`,
      },
      {
        level: "expert",
        code:
`if exist file.txt (
    echo found
) else (
    echo missing
)`,
        description: "Branches based on whether a file exists.",
        explanation:
          "if exist checks whether the given path is present on disk, and the parenthesized blocks work like an if/else — only the block matching the condition's result runs. Batch scripting's if/else syntax needs both branches wrapped in parentheses on the same logical statement, unlike most other languages.",
        output: `found`,
        predictedOutput: `found`,
      },
      {
        level: "expert",
        code:
`@echo off
set count=0
for %%f in (*.log) do (
    set /a count+=1
)
echo Total log files: %count%`,
        description: "A batch script that counts how many .log files are present.",
        explanation:
          "@echo off suppresses CMD from printing each command before running it, keeping output clean. The for loop iterates every matching .log file (using %%f since this runs from a saved script, not the prompt) and set /a count+=1 increments a numeric counter each pass, which is finally echoed out.",
        output: `Total log files: 3`,
        predictedOutput: `Total log files: 3`,
      },
    ],
  },

};

// Controls the order languages appear in the picker + dropdown.
const LANGUAGE_ORDER = ["javascript", "python", "html", "cpp", "bash", "powershell", "cmd"];

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