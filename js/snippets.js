const snippets = [
`for(int i = 0; i < 10; i++) {
    cout << i << endl;
}`,

`int add(int a, int b) {
    return a + b;
}`,

`while(true) {
    break;
}`,

`vector<int> nums;
nums.push_back(5);`
];

function getRandomSnippet() {
    return snippets[
        Math.floor(Math.random() * snippets.length)
    ];
}