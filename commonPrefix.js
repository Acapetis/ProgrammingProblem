//Function section
function longestCommonPrefix(strs) {
    if (strs.length === 0) return "";

    let prefix = strs[0];
    for (let i = 1; i < strs.length; i++) {
        while (strs[i].indexOf(prefix) !== 0) {
            prefix = prefix.substring(0, prefix.length - 1);
            if (prefix === "") return "";
        }
    }

    return prefix;
}


//Unit tests section
function testLongestCommonPrefix() {
    //test cases
    const testCases = [
        { input: ["flower"], expected: "flower" },
        { input: [], expected: "" },
        { input: ["test", "test", "test"], expected: "test" },
        { input: ["dog", "racecar", "car"], expected: "" },
        { input: ["flower", "flow", "flight"], expected: "fl" },
        { input: ["interspecies", "interstellar", "interstate"], expected: "inters" },
        { input: ["", "b", "c"], expected: "" },
        { input: ["", "", ""], expected: "" },
        { input: ["prefix", "prefix123", "prefix456"], expected: "prefix" },
        { input: ["@home", "@hotel", "@homework"], expected: "@ho" },
        { input: ["a1b2", "a1b", "a1"], expected: "a1" },
        { input: Array(200).fill("a".repeat(200)), expected: "a".repeat(200) }
    ];

    //testing function
    testCases.forEach((testCase, index) => {
        const result = longestCommonPrefix(testCase.input);
        console.log(`Test Case ${index + 1}: ${result === testCase.expected ? "Pass" : "Fail"}`);
        console.log(`Input: ${JSON.stringify(testCase.input)}`);
        console.log(`Expected: ${testCase.expected}, Got: ${result}`);
        console.log();
    });
}


testLongestCommonPrefix()