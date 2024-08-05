function interesting_time(S, T) {
    //for checking thatt use only 2digits or not
    const isInteresting = (time) => {
        const digits = new Set(time.replace(/:/g, ''));
        return digits.size <= 2;
    };

    //for convert formatted to seconds vice versa
    const timeToSeconds = (time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    const secondsToTime = (seconds) => {
        const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
        seconds %= 3600;
        const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
        seconds = String(seconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };


    let startSeconds = timeToSeconds(S);
    let endSeconds = timeToSeconds(T);
    if (endSeconds < startSeconds) {
        endSeconds += 24 * 3600; // for earlier start day case
    }

    let count = 0;

    for (let i = startSeconds; i <= endSeconds; i++) {
        if (isInteresting(secondsToTime(i % (24 * 3600)))) {
            count++;
        }
    }

    return count;
}

// Unit tests
function Test_interesting_time() {
    const testCases = [
        { input: ["15:15:00", "15:15:12"], expected: 1 },
        { input: ["22:22:21", "22:22:23"], expected: 3 },
        { input: ["00:00:00", "00:00:59"], expected: 20 },
        { input: ["23:59:59", "00:00:00"], expected: 1 },
        { input: ["12:34:56", "12:35:56"], expected: 0 },
        { input: ["01:01:01", "01:01:10"], expected: 2 },
        { input: ["00:00:00", "23:59:59"], expected: 504 },
        { input: ["12:34:56", "12:34:56"], expected: 0 },
        { input: ["14:59:59", "15:00:00"], expected: 0 },
        { input: ["05:05:00", "05:05:59"], expected: 4 },
        { input: ["01:00:00", "01:59:59"], expected: 16 }
    ];

    testCases.forEach((testCase, index) => {
        const result = interesting_time(...testCase.input);
        const passed = result === testCase.expected;
        console.log(`Test Case ${index + 1}: ${passed ? "Pass" : "Fail"}`);
        if (!passed) {
            console.log(`  Input: ${testCase.input}`);
            console.log(`  Expected: ${testCase.expected}, Got: ${result}`);
        }
    });
}

Test_interesting_time();