function startGeneration() {
    const outputCount = parseInt(document.getElementById("outputCount").value, 10);
    const outputContainer = document.getElementById("outputContainer");
    outputContainer.innerHTML = "";

    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";
    const progress = document.createElement("div");
    progress.className = "progress";
    progressBar.appendChild(progress);

    const generatingText = document.createElement("div");
    generatingText.className = "generating-text";
    outputContainer.appendChild(progressBar);
    outputContainer.appendChild(generatingText);

    const randomDelay = Math.floor(Math.random() * 21) + 10; // Random delay between 10 to 30 seconds

    let animationCycle = 0;

    const animationInterval = setInterval(function () {
        if (animationCycle === 0) {
            generatingText.textContent = "Generating.";
            progress.style.width = "20%"; // Sync progress bar with text
        } else if (animationCycle === 2) {
            generatingText.textContent = "Generating..";
            progress.style.width = "40%";
        } else if (animationCycle === 4) {
            generatingText.textContent = "Generating...";
            progress.style.width = "60%";
        } else if (animationCycle === 6) {
            generatingText.textContent = "Almost there!";
            progress.style.width = "80%";
        } else if (animationCycle === 8) {
            generatingText.textContent = "Done!";
            clearInterval(animationInterval);

            setTimeout(function () {
                outputContainer.removeChild(progressBar);
                outputContainer.removeChild(generatingText);
                generateAndDisplay(outputCount, outputContainer);
            }, 2000); // 2 seconds delay after "Done!"
        }

        // Check if the specified random delay is reached
        if (animationCycle === randomDelay) {
            generatingText.textContent = "Generating...";
            progress.style.width = "60%"; // Sync progress bar with text
        }

        // Check if 2 animation cycles are completed (random delay)
        if (animationCycle === randomDelay + 2) {
            clearInterval(animationInterval);
        }

        animationCycle++;
    }, 1000); // 1 second interval
}

function generateAndDisplay(outputCount, outputContainer) {
    let codeCounter = 0;
    let listCounter = 0;
    let allCodes = [];

    // Function to generate a random string of specified length
    function randomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
    }

    // Generate random strings for each group and create the value
    function generateRandomValue() {
        const groupA = randomString(4);
        const groupB = randomString(4);
        const groupC = randomString(4);
        const groupD = randomString(4);
        return `${groupA}-${groupB}-${groupC}-${groupD}`;
    }

    let currentList = document.createElement("ul");
    currentList.className = "output-list";

    for (let i = 0; i < outputCount; i++) {
        const randomValue = generateRandomValue();
        const outputElement = document.createElement("li");
        outputElement.textContent = randomValue;
        outputElement.className = "output-list-item";

        allCodes.push(randomValue);

        currentList.appendChild(outputElement);

        codeCounter++;

        if (codeCounter === 10) {
            codeCounter = 0;
            listCounter++;
            const dropdownLabel = document.createElement("div");
            dropdownLabel.className = "dropdown-label";
            dropdownLabel.textContent = `Code list ${listCounter}`;
            dropdownLabel.addEventListener("click", toggleDropdown);

            const dropdownContent = document.createElement("ul");
            dropdownContent.className = "dropdown-content";
            dropdownContent.appendChild(currentList);

            const copyCodesButton = createCopyCodesButton(allCodes);
            const downloadCodesButton = createDownloadCodesButton(allCodes);
            dropdownContent.appendChild(copyCodesButton);
            dropdownContent.appendChild(downloadCodesButton);

            const dropdown = document.createElement("div");
            dropdown.className = "dropdown";
            dropdown.appendChild(dropdownLabel);
            dropdown.appendChild(dropdownContent);
            outputContainer.appendChild(dropdown);

            currentList = document.createElement("ul");
            currentList.className = "output-list";
        }
    }

    if (codeCounter > 0) {
        const dropdownLabel = document.createElement("div");
        dropdownLabel.className = "dropdown-label";
        dropdownLabel.textContent = `Code list ${listCounter}`;
        dropdownLabel.addEventListener("click", toggleDropdown);

        const dropdownContent = document.createElement("ul");
        dropdownContent.className = "dropdown-content";
        dropdownContent.appendChild(currentList);

        const copyCodesButton = createCopyCodesButton(allCodes);
        const downloadCodesButton = createDownloadCodesButton(allCodes);
        dropdownContent.appendChild(copyCodesButton);
        dropdownContent.appendChild(downloadCodesButton);

        const dropdown = document.createElement("div");
        dropdown.className = "dropdown";
        dropdown.appendChild(dropdownLabel);    
        dropdown.appendChild(dropdownContent);
        outputContainer.appendChild(dropdown);
    }

    listCounter = 0
}

function toggleDropdown() {
    this.parentElement.querySelector(".dropdown-content").classList.toggle("show");
}

function copyToClipboard(text) {
    const tempInput = document.createElement("textarea");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}

function createCopyCodesButton(text) {
    const copyCodesButton = document.createElement("button");
    copyCodesButton.textContent = "Copy Codes";
    copyCodesButton.className = "copy-button";
    copyCodesButton.addEventListener("click", function () {
        const formattedCodes = text.map(code => `"${code}"`).join(',\n');
        copyToClipboard(formattedCodes);
    });
    return copyCodesButton;
}

function createDownloadCodesButton(text) {
    const downloadCodesButton = document.createElement("button");
    downloadCodesButton.textContent = "Download Codes";
    downloadCodesButton.className = "copy-button";
    downloadCodesButton.addEventListener("click", function () {
        const formattedCodes = text.map(code => `"${code}"`).join(',\n');
        const blob = new Blob([formattedCodes], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'generated_codes.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    });
    return downloadCodesButton;
}